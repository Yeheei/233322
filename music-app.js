        // === 新增：音乐检索核心功能 ===

        /**
         * 检查一个音频URL是否可以播放
         * @param {string} url - 音频URL
         * @returns {Promise<boolean>}
         */
        async function checkAudioAvailability(url) {
            return new Promise(resolve => {
                if (!url) return resolve(false);
                const tempAudio = new Audio();
                tempAudio.muted = true;
                tempAudio.crossOrigin = "anonymous";
                const timer = setTimeout(() => {
                    tempAudio.src = ''; // 停止加载
                    resolve(false);
                }, 2500); // 2.5秒超时
                tempAudio.oncanplay = () => {
                    clearTimeout(timer);
                    resolve(tempAudio.duration > 1); // 确保是有效音频
                };
                tempAudio.onerror = () => {
                    clearTimeout(timer);
                    resolve(false);
                };
                tempAudio.src = url;
            });
        }

        /**
         * 从GDStudio API搜索音乐
         * @param {string} source - 'netease', 'tencent', 'kuwo'等
         * @param {string} query - 搜索关键词
         * @returns {Promise<Array|null>} - 返回歌曲对象数组或null
         */
        async function searchMusicFromGDStudio(source, query) {
            const API = 'https://music-api.gdstudio.xyz/api.php';
            try {
                const response = await fetch(`${API}?types=search&count=20&source=${source}&name=${encodeURIComponent(query)}`);

                if (!response.ok) {
                    throw new Error(`API 请求失败，状态: ${response.status}`);
                }

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const errorText = await response.text();
                    // 截取前100个字符用于日志，避免控制台过长
                    const errorPreview = errorText.substring(0, 100); 
                    throw new Error(`服务器返回了非JSON格式的内容，可能是API错误或不稳定。内容预览: ${errorPreview}`);
                }

                const searchResult = await response.json();
                
                if (Array.isArray(searchResult) && searchResult.length > 0) {
                    return searchResult;
                }
                return null;
            } catch (e) {
                console.error(`搜索音乐失败 (源: ${source}):`, e);
                return null;
            }

        }
        
        /**
         * 获取网易云音乐的播放链接 (适配v.iarc.top)
         * @param {string} songId - 歌曲ID
         * @returns {Promise<string|null>} - 返回可播放的URL或null
         */
        async function getNeteaseSongUrl(songId) {
            const API_URL = `https://music-api.gdstudio.xyz/api.php?types=url&id=${songId}&source=netease`;
            try {
                const response = await fetch(`${API_URL}&_t=${Date.now()}`, { cache: 'no-cache' });
                
                if (!response.ok) {
                    throw new Error(`API 请求失败，状态码: ${response.status}`);
                }

                const data = await response.json();
                const songUrl = data.url;

                if (!songUrl) {
                    throw new Error('API未返回有效的播放链接。');
                }
                
                // 验证URL是否可用，这是一个好习惯
                if (await checkAudioAvailability(songUrl)) {
                    return songUrl;
                } else {
                    throw new Error('获取到的播放链接不可用。');
                }
            } catch (error) {
                console.error(`获取歌曲 ${songId} 播放链接失败:`, error.message);
                // 这里可以使用你的 showGlobalToast 给出更友好的提示
                showGlobalToast(`获取播放链接失败: ${error.message}`, { type: 'error' });
                return null;
            }
        }


        // =============================================
        // === 音乐App - 歌单数据与核心功能 (新增) ===
        // =============================================
        
        let musicPlaylists = []; // 全局变量，存储歌单数据
        const MUSIC_PLAYLISTS_KEY = 'musicPlaylists';

        // 1. 加载歌单数据
        function loadMusicPlaylists() {
            const data = localStorage.getItem(MUSIC_PLAYLISTS_KEY);
            musicPlaylists = data ? JSON.parse(data) : [
                // 可以添加一个默认歌单
                {
                    id: 'default_love',
                    name: '我喜欢的音乐',
                    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop',
                    songs: []
                }
            ];
        }

        // 2. 保存歌单数据
        function saveMusicPlaylists() {
            localStorage.setItem(MUSIC_PLAYLISTS_KEY, JSON.stringify(musicPlaylists));
        }

        // 3. 渲染"我的"页面的歌单列表
        function renderMyMusicPage() {
            const container = document.getElementById('my-page-playlists');
            if (!container) return;

            let html = '';

            // 渲染“添加歌单”卡片
            html += `
                <div class="playlist-card add-playlist-card" id="add-playlist-btn">
                    <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                </div>
            `;

            // 渲染已有歌单
            musicPlaylists.forEach(playlist => {
                html += `
                    <div class="playlist-card" data-playlist-id="${playlist.id}">
                        <div class="playlist-cover" style="background-image: url('${playlist.cover || ''}')">
                            ${!playlist.cover ? '<svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4V7h4V3h-6z"></path></svg>' : ''}
                        </div>
                        <div class="playlist-info">
                            <div class="playlist-title">${playlist.name}</div>
                            <div class="playlist-song-count">${playlist.songs.length}首</div>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;

            // 使用事件委托来处理所有卡片的点击事件
            container.addEventListener('click', (e) => {
                const addBtn = e.target.closest('#add-playlist-btn');
                const playlistCard = e.target.closest('.playlist-card:not(.add-playlist-card)');

                if (addBtn) {
                    handleAddPlaylistClick();
                } else if (playlistCard) {
                    const playlistId = playlistCard.dataset.playlistId;
                    openPlaylistDetailModal(playlistId);
                }
            });
        }
        
        // 4. 处理点击“添加歌单”或“编辑歌单” (已重构)
        function openPlaylistEditModal(playlistId = null) {
            const overlay = document.getElementById('playlist-edit-overlay');
            const titleEl = document.getElementById('playlist-edit-title');
            const nameInput = document.getElementById('playlist-name-input');
            const coverPreview = document.getElementById('playlist-cover-preview');
            const coverUpload = document.getElementById('playlist-cover-upload');
            const saveBtn = document.getElementById('save-playlist-edit');
            const cancelBtn = document.getElementById('cancel-playlist-edit');

            let editingPlaylist = null;
            let coverDataUrl = '';

            if (playlistId) {
                // 编辑模式
                editingPlaylist = musicPlaylists.find(p => p.id === playlistId);
                if (!editingPlaylist) return;
                titleEl.textContent = '编辑歌单';
                nameInput.value = editingPlaylist.name;
                coverDataUrl = editingPlaylist.cover || '';
            } else {
                // 创建模式
                titleEl.textContent = '创建新歌单';
                nameInput.value = '';
                coverDataUrl = '';
            }
            
            // 更新封面预览
            if (coverDataUrl) {
                coverPreview.style.backgroundImage = `url('${coverDataUrl}')`;
                coverPreview.innerHTML = '';
            } else {
                coverPreview.style.backgroundImage = 'none';
                coverPreview.innerHTML = '<span>点击设置封面</span>';
            }

            // 事件绑定
            const coverClickHandler = () => coverUpload.click();
            coverPreview.addEventListener('click', coverClickHandler);

            const coverChangeHandler = (e) => {
                const file = e.target.files[0];
                if (file) {
                    compressImage(file).then(compressedDataUrl => {
                        coverDataUrl = compressedDataUrl;
                        coverPreview.style.backgroundImage = `url('${coverDataUrl}')`;
                        coverPreview.innerHTML = '';
                    }).catch(error => {
                        console.error("歌单封面压缩失败:", error);
                        showCustomAlert("图片压缩失败，请换张图片或稍后再试。");
                    });
                }
            };
            coverUpload.addEventListener('change', coverChangeHandler);
            
            const closeOverlay = () => {
                overlay.classList.remove('visible');
                // 清理事件监听器，防止内存泄漏
                coverPreview.removeEventListener('click', coverClickHandler);
                coverUpload.removeEventListener('change', coverChangeHandler);
            };

            const saveHandler = () => {
                const name = nameInput.value.trim();
                if (!name) {
                    showCustomAlert('歌单名称不能为空！');
                    return;
                }

                if (editingPlaylist) { // 编辑模式
                    editingPlaylist.name = name;
                    editingPlaylist.cover = coverDataUrl;
                } else { // 创建模式
                    const newPlaylist = {
                        id: 'playlist_' + generateId(),
                        name: name,
                        cover: coverDataUrl,
                        songs: []
                    };
                    musicPlaylists.push(newPlaylist);
                }
                
                saveMusicPlaylists();
                renderMyMusicPage();
                closeOverlay();
                showGlobalToast(`歌单 "${name}" 已保存！`, { type: 'success' });
            };

            // 使用克隆节点法确保每次都是新的事件监听
            const newSaveBtn = saveBtn.cloneNode(true);
            saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
            newSaveBtn.addEventListener('click', saveHandler);

            const newCancelBtn = cancelBtn.cloneNode(true);
            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
            newCancelBtn.addEventListener('click', closeOverlay);
            
            overlay.classList.add('visible');
        }

        // 修改原有的添加函数入口
        function handleAddPlaylistClick() {
            openPlaylistEditModal(); // 不传ID即为创建模式
        }
        
        // 5. 打开“收藏到歌单”的模态框 (已重构为悬浮窗)
        function openCollectModal(songData, clickedButton) {
            // 复用歌单详情的模态框HTML结构，动态填充内容
            const overlay = document.getElementById('playlist-detail-overlay');
            const titleEl = document.getElementById('playlist-detail-title');
            const bodyEl = document.getElementById('playlist-detail-body');
            const editBtn = document.getElementById('edit-playlist-btn');
            const closeBtn = document.getElementById('close-playlist-detail');
            
            titleEl.textContent = '收藏到歌单';
            
            let listHTML = '<div id="collect-to-playlist-modal-list" style="max-height: 60vh; overflow-y: auto;">';
            musicPlaylists.forEach(playlist => {
                listHTML += `
                    <div class="collect-playlist-item" data-playlist-id="${playlist.id}">
                        <div class="collect-playlist-cover" style="background-image: url('${playlist.cover || ''}')"></div>
                        <span class="collect-playlist-name">${playlist.name}</span>
                    </div>
                `;
            });
            listHTML += '</div>';
            bodyEl.innerHTML = listHTML;

            // 隐藏不必要的按钮
            editBtn.style.display = 'none';

            // 为模态框内的歌单列表绑定点击事件
            const listContainer = document.getElementById('collect-to-playlist-modal-list');
            const newlistContainer = listContainer.cloneNode(true);
            listContainer.parentNode.replaceChild(newlistContainer, listContainer);

            newlistContainer.addEventListener('click', (e) => {
                const item = e.target.closest('.collect-playlist-item');
                if (item) {
                    const playlistId = item.dataset.playlistId;
                    addSongToPlaylist(songData, playlistId, clickedButton);
                }
            });
            
            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            newCloseBtn.addEventListener('click', () => overlay.classList.remove('visible'));

            overlay.classList.add('visible');
        }
                // 新增：打开歌单详情悬浮窗
        function openPlaylistDetailModal(playlistId) {
            const playlist = musicPlaylists.find(p => p.id === playlistId);
            if (!playlist) return;

            const overlay = document.getElementById('playlist-detail-overlay');
            const titleEl = document.getElementById('playlist-detail-title');
            const bodyEl = document.getElementById('playlist-detail-body');
            const editBtn = document.getElementById('edit-playlist-btn');
            const closeBtn = document.getElementById('close-playlist-detail');
            
            titleEl.textContent = playlist.name;

            if (playlist.songs.length === 0) {
                bodyEl.innerHTML = `<span class="empty-text">这个歌单还是空的</span>`;
            } else {
                bodyEl.innerHTML = playlist.songs.map(song => `
                    <div class="music-result-item" data-song-id="${song.id}" data-song-name="${song.name}">
                        <div class="result-item-cover" style="background-image: url('${song.cover}')"></div>
                        <div class="result-item-info">
                            <div class="result-item-title">${song.name}</div>
                            <div class="result-item-artist">${song.artist}</div>
                        </div>
                    </div>
                `).join('');
            }
            
            // 为歌曲列表添加点击播放事件 (使用索引)
            const songItems = bodyEl.querySelectorAll('.music-result-item');
            songItems.forEach((item, index) => {
                item.addEventListener('click', async () => {
                    // 需求2: 立即关闭歌单悬浮窗
                    overlay.classList.remove('visible');

                    const songId = item.dataset.songId;
                    const songName = item.dataset.songName;
                    
                    // 需求3: 立即切换到播放器页面
                    document.getElementById('music-btn-play').click();

                    showGlobalToast(`即将播放: ${songName}`);

                    const songUrl = await getNeteaseSongUrl(songId);
                    if (songUrl) {
                        // 构造歌曲详情对象
                        const songDetails = {
                            id: item.dataset.songId,
                            name: item.dataset.songName,
                            artist: item.querySelector('.result-item-artist').textContent, // 从DOM中获取更准确
                            cover: item.querySelector('.result-item-cover').style.backgroundImage.slice(5, -2) // 提取URL
                        };
                        
                        // 【修改点】传入歌单上下文，包含来源、歌单ID和当前歌曲索引
                        const playbackContext = {
                            source: 'playlist',
                            playlistId: playlistId,
                            currentIndex: index
                        };
                        playSong(songUrl, songDetails, playbackContext);

                    } else {
                        showCustomAlert(`获取 "${songName}" 的播放链接失败。`);
                        // 如果失败，切回"我的"页面
                        document.getElementById('music-btn-my').click();
                    }
                });
            });

            // 使用克隆节点法绑定事件
            const newEditBtn = editBtn.cloneNode(true);
            editBtn.parentNode.replaceChild(newEditBtn, editBtn);
            newEditBtn.addEventListener('click', () => {
                overlay.classList.remove('visible'); // 先关闭详情窗
                openPlaylistEditModal(playlistId); // 打开编辑窗
            });

            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            newCloseBtn.addEventListener('click', () => overlay.classList.remove('visible'));

            overlay.classList.add('visible');
        }

        // 6. 将歌曲添加到指定歌单 (已重构)
        function addSongToPlaylist(songData, playlistId, clickedButton) {
            const playlist = musicPlaylists.find(p => p.id === playlistId);
            if (!playlist) {
                showCustomAlert('错误：未找到目标歌单。');
                return;
            }
            
            const overlay = document.getElementById('playlist-detail-overlay');

            // 检查歌曲是否已存在
            const isExist = playlist.songs.some(s => String(s.id) === String(songData.id));
            if (isExist) {
                showGlobalToast(`歌曲已在歌单 "${playlist.name}" 中`, { type: 'info' });
                overlay.classList.remove('visible'); // 只关闭悬浮窗
                return;
            }
            
            playlist.songs.push(songData);
            
            if (!playlist.cover && songData.cover) {
                playlist.cover = songData.cover;
            }
            
            saveMusicPlaylists();
            showGlobalToast(`已收藏到 "${playlist.name}"`, { type: 'success' });
            overlay.classList.remove('visible'); // 只关闭悬浮窗

            // 如果是在“我喜欢的音乐”歌单里操作，更新按钮状态
            if (playlist.id === 'default_love' && clickedButton) {
                clickedButton.classList.add('collected');
            }
        }

        // =============================================
        // === 音乐App - 事件绑定与入口修改 (新增) ===
        // =============================================
        
        document.getElementById('app-music').addEventListener('click', function(e) {
            // "我的" 页面的 HTML 内容
            const myPageHTML = `
                <div class="my-page-container">
                    <div class="my-page-profile-card">
                        <div class="my-page-avatar"></div>
                        <div class="my-page-info">
                            <div class="my-page-nickname">水母</div>
                            <div class="my-page-stats">
                                <span>关注 123</span>
                                <span>粉丝 456k</span>
                                <span>点赞 7.8M</span>
                            </div>
                        </div>
                    </div>

                    <!-- === 新增：图库入口 Start === -->
                    <div id="music-gallery-entry" class="music-gallery-entry-bar">
                        <span>播放器封面图库</span>
                        <svg class="category-arrow" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>
                    </div>
                    <!-- === 新增：图库入口 End === -->

                    <!-- 歌单列表容器 -->
                    <div id="my-page-playlists">
                        <!-- 歌单将由JS动态渲染到这里 -->
                    </div>
                </div>
            `;

            
            // "搜索" 页面的 HTML 内容
            const searchPageHTML = `
                <div class="music-search-page-container">
                    <div class="music-search-bar-wrapper"> <!-- 新增的包裹层 -->
                        <input type="text" id="music-search-input" class="music-search-input" placeholder="搜索歌曲、歌手">
                        <button id="music-search-btn" class="music-search-button-icon"> <!-- 按钮类型改为图标按钮 -->
                            <!-- 搜索图标 SVG -->
                            <svg t="1767430269951" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3234" width="16" height="16"><path d="M828.72183 738.215042l176.526936 176.523323c24.987196 24.989002 24.987196 65.522302 0 90.509498-24.98539 24.989002-65.522302 24.989002-90.507692 0l-176.526935-176.523323m106.58121-367.917225c0-212.07869-171.92289-384.00158-384.003387-384.00158-212.064241 0-383.985324 171.92289-383.985324 384.00158 0 212.064241 171.921084 383.985324 383.985324 383.985325 212.080497 0 384.003387-171.921084 384.003387-383.985325z m-106.58121 367.917225c-193.248886 145.725529-466.310856 117.077133-625.13326-65.574682C-45.74333 580.517911-36.173996 306.117535 134.964996 134.978542 306.118438-36.173093 580.502559-45.744233 763.154373 113.07817c182.648202 158.82421 211.296599 431.884374 65.569264 625.136872" fill="currentColor" p-id="3235"></path></svg>
                        </button>
                    </div>
                    <div id="music-search-results" class="music-results-container">
                        <span class="empty-text" style="text-align:center; padding-top: 40px;">开始你的音乐探索之旅吧！</span>
                    </div>
                </div>
            `;
            
            // 新增：“播放”页面的HTML内容
            const playPageHTML = `
                <div class="music-player-container">
                    <div class="music-player-card">
                        <div id="player-album-art" class="player-album-art"></div>
                        <div class="player-info">
                            <div id="player-song-title" class="player-song-title">未在播放</div>
                            <div id="player-song-artist" class="player-song-artist">--</div>
                        </div>
                        <div class="player-progress-container">
                            <input type="range" id="player-progress-bar" value="0" min="0" max="100">
                            <div class="player-time-display">
                                <span id="player-current-time">00:00</span>
                                <span id="player-duration">00:00</span>
                            </div>
                        </div>
                        <div class="player-controls">
                            <button id="player-prev-btn" class="player-control-btn" title="上一首">
                                <svg t="1767430326326" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3483" width="28" height="28">
                                    <path d="M364.302083 465.602819L687.954365 218.588294c38.416414-29.327534 93.791393-1.929039 93.791392 46.396277v494.029051c0 48.325316-55.374979 75.725617-93.791392 46.398084L364.302083 558.397181c-30.600916-23.357989-30.600916-69.436372 0-92.794362zM238.945254 780.798397V451.684117v-164.562559c0-19.628152-5.904521-60.475733 17.057907-75.841215 25.523642-17.068744 59.747828 1.210165 59.747828 31.919454v493.676839c0 19.628152 5.915358 60.473927-17.047069 75.841215-25.53448 17.068744-59.758666-1.211971-59.758666-31.919454z" fill="currentColor" p-id="3484"></path>
                                </svg>
                            </button>
                            <button id="player-play-pause-btn" class="player-control-btn main-btn" title="播放/暂停">
                                <svg id="player-play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                                <svg id="player-pause-icon" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
                            </button>
                            <button id="player-next-btn" class="player-control-btn" title="下一首">
                                <svg t="1767430353937" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3732" width="28" height="28">
                                    <path d="M655.706179 465.602819L332.053897 218.588294c-38.414608-29.327534-93.791393-1.929039-93.791392 46.396277v494.029051c0 48.325316 55.376785 75.725617 93.791392 46.398084l323.652282-247.014525c30.602722-23.357989 30.602722-69.436372 0-92.794362zM781.064814 780.798397V451.684117v-164.562559c0-19.628152 5.904521-60.475733-17.057907-75.841215-25.523642-17.068744-59.747828 1.210165-59.747828 31.919454v493.676839c0 19.628152-5.915358 60.473927 17.047069 75.841215 25.532673 17.068744 59.758666-1.211971 59.758666-31.919454z" fill="currentColor" p-id="3733"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // 音乐 App 的整体框架 HTML
            const musicAppHTML = `
                <div class="music-app-container">
                    <div class="music-content-area">
                        <!-- 内容区域 -->
                    </div>
                    <div class="music-capsule-bar">
                        <button id="music-btn-search" class="music-capsule-btn" title="搜索">
                             <svg t="1767379651110" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1313"><path d="M959.266 879.165c0 81.582-81.582 81.582-81.582 81.582l-233.38-233.381c-60.529 43.977-134.777 70.217-215.318 70.217-202.755 0-367.117-164.362-367.117-367.117S226.23 63.349 428.985 63.349s367.117 164.362 367.117 367.117c0 80.541-26.241 154.785-70.217 215.318l233.381 233.381zM428.985 144.931c-157.697 0-285.536 127.838-285.536 285.536s127.838 285.536 285.536 285.536 285.536-127.838 285.536-285.536-127.839-285.536-285.536-285.536z" p-id="1314"></path></svg>
                            <span>搜索</span>
                        </button>
                        <button id="music-btn-play" class="music-capsule-btn" title="播放">
                            <svg t="1767381029075" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6654"><path d="M934.4 53.333333c-29.866667-23.466667-68.266667-32-104.533333-23.466666L334.933333 145.066667c-55.466667 12.8-96 61.866667-96 119.466666v443.733334c-14.933333-6.4-32-8.533333-49.066666-8.533334-81.066667 0-147.2 66.133333-147.2 147.2s66.133333 147.2 147.2 147.2c81.066667 0 147.2-66.133333 147.2-147.2V492.8l544-125.866667v341.333334c-14.933333-6.4-32-8.533333-49.066667-8.533334-81.066667 0-147.2 66.133333-147.2 147.2 0 81.066667 66.133333 147.2 147.2 147.2 78.933333 0 142.933333-59.733333 147.2-136.533333 0-4.266667 2.133333-6.4 2.133333-10.666667V151.466667c0-38.4-17.066667-74.666667-46.933333-98.133334zM339.2 390.4v-125.866667c0-10.666667 8.533333-21.333333 19.2-23.466666L851.2 128c10.666667-2.133333 17.066667 2.133333 21.333333 4.266667 4.266667 2.133333 8.533333 8.533333 8.533334 19.2v115.2l-541.866667 123.733333z" p-id="6655"></path></svg>
                            <span>播放</span>
                        </button>
                        <button id="music-btn-my" class="music-capsule-btn active" title="我的">
                           <svg t="1767379674232" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1530"><path d="M512 527.424c-141.184 0-256-114.816-256-256s114.816-256 256-256 256 114.816 256 256-114.816 256-256 256z m0-448c-105.856 0-192 86.144-192 192s86.144 192 192 192 192-86.144 192-192-86.144-192-192-192zM867.712 1008.576H156.352A108.416 108.416 0 0 1 48 900.288c0-188.288 151.36-339.712 337.344-339.712h253.312a337.792 337.792 0 0 1 337.344 337.344c0 62.08-48.576 110.656-108.288 110.656z m-482.368-384A273.664 273.664 0 0 0 112 897.92c0 26.752 19.904 46.656 44.352 46.656h711.36a44.352 44.352 0 0 0 44.288-44.288c0-153.088-122.624-275.712-273.344-275.712H385.344z" p-id="1531"></path></svg>
                            <span>我的</span>
                        </button>
                    </div>
                </div>
            `;
            
            // 使用通用的模态框函数打开界面
            openModal('音乐', musicAppHTML, this);

            const contentArea = document.querySelector('.music-content-area');

            // 切换到指定页面的函数
            const switchMusicPage = (pageName) => {
                const allBtns = document.querySelectorAll('.music-capsule-btn');
                allBtns.forEach(b => b.classList.remove('active'));

                if (pageName === 'my') {
                    contentArea.innerHTML = myPageHTML;
                    document.getElementById('music-btn-my').classList.add('active');
                    loadMusicPlaylists();

                    // --- 新增代码开始 ---
                    // 读取主屏幕保存的头像和昵称
                    const homeAvatar = localStorage.getItem('homeScreenAvatar');
                    const homeNickname = localStorage.getItem('profileName') || '水母'; // 如果没设置名字，则显示默认
                    
                    // 获取“我的”页面中的元素
                    const myAvatarEl = contentArea.querySelector('.my-page-avatar');
                    const myNicknameEl = contentArea.querySelector('.my-page-nickname');

                    // 填充数据
                    if (myAvatarEl && homeAvatar) {
                        myAvatarEl.style.backgroundImage = `url(${homeAvatar})`;
                    }
                    if (myNicknameEl) {
                        myNicknameEl.textContent = homeNickname;
                    }
                    // --- 新增代码结束 ---
                    
                    renderMyMusicPage();
                } else if (pageName === 'search') {
                    contentArea.innerHTML = searchPageHTML;
                    document.getElementById('music-btn-search').classList.add('active');
                    bindSearchPageEvents();
                } else if (pageName === 'play') {
                    contentArea.innerHTML = playPageHTML;
                    document.getElementById('music-btn-play').classList.add('active');
                    
                    // 【关键修复】当切换到播放页面时，尝试加载上次播放的歌曲信息并更新UI
                    const lastPlayedSong = JSON.parse(localStorage.getItem('lastPlayedSong'));
                    if (lastPlayedSong && globalAudioPlayer.src === lastPlayedSong.url) {
                        // 如果播放器已经有歌曲在播放，并且是上次播放的那首
                        globalAudioPlayer.currentSongDetails = lastPlayedSong.details;
                        updatePlayerUI(globalAudioPlayer.currentSongDetails);
                        // 同时更新播放/暂停按钮状态
                        if (!globalAudioPlayer.paused) {
                            document.getElementById('player-play-icon').style.display = 'none';
                            document.getElementById('player-pause-icon').style.display = 'block';
                        } else {
                            document.getElementById('player-play-icon').style.display = 'block';
                            document.getElementById('player-pause-icon').style.display = 'none';
                        }
                    } else if (lastPlayedSong) {
                        // 如果播放器是空的，但localStorage有记录，加载它但不自动播放
                        globalAudioPlayer.src = lastPlayedSong.url;
                        globalAudioPlayer.currentSongDetails = lastPlayedSong.details;
                        updatePlayerUI(globalAudioPlayer.currentSongDetails);
                        // 确保显示播放图标
                        document.getElementById('player-play-icon').style.display = 'block';
                        document.getElementById('player-pause-icon').style.display = 'none';
                    } else {
                        // 如果都没有，显示默认的“未在播放”状态
                        updatePlayerUI(null);
                    }
                }
            };
            // 绑定底部导航按钮事件
            document.getElementById('music-btn-my').addEventListener('click', () => switchMusicPage('my'));
            document.getElementById('music-btn-search').addEventListener('click', () => switchMusicPage('search'));
            document.getElementById('music-btn-play').addEventListener('click', () => switchMusicPage('play'));

            // 默认显示"我的"页面
            switchMusicPage('my');
            
            // 绑定搜索页事件的函数
            function bindSearchPageEvents() {
                const searchInput = document.getElementById('music-search-input');
                const searchBtn = document.getElementById('music-search-btn');
                const resultsContainer = document.getElementById('music-search-results');

                // **【核心修复】**：将事件监听器移到函数顶层，只绑定一次
                const newResultsContainer = resultsContainer.cloneNode(true);
                resultsContainer.parentNode.replaceChild(newResultsContainer, resultsContainer);
                
                         newResultsContainer.addEventListener('click', async (e) => {
                            const item = e.target.closest('.music-result-item');
                            const collectBtn = e.target.closest('.collect-song-btn');

                            // 如果点击的是收藏按钮，则不触发播放
                            if (collectBtn) {
                                return;
                            }
                            
                            if (item) {
                                const songId = item.dataset.songId;
                                const songName = item.dataset.songName;
                                const titleEl = item.querySelector('.result-item-title');
                                const originalText = titleEl.textContent;

                                // 切换到播放页面
                                document.getElementById('music-btn-play').click();
                                showGlobalToast(`即将播放: ${songName}`);

                                const songUrl = await getNeteaseSongUrl(songId);
                                if (songUrl) {
                                    // 构造歌曲详情对象
                                    const songDetails = {
                                        id: item.dataset.songId,
                                        name: item.dataset.songName,
                                        artist: item.dataset.songArtist,
                                        cover: item.dataset.songCover
                                    };
                                    // 【修改点】传入搜索上下文
                                    playSong(songUrl, songDetails, { source: 'search' });
                                } else {
                                    showCustomAlert(`获取"${songName}"的播放链接失败。`);
                                    // 失败则切回搜索页
                                     document.getElementById('music-btn-search').click();
                                }
                            }
                        });



                const performSearch = async () => {
                    const query = searchInput.value.trim();
                    if (!query) {
                        showCustomAlert('请输入搜索关键词。');
                        return;
                    }
                    
                    newResultsContainer.innerHTML = `<span class="empty-text" style="text-align:center; padding-top: 40px;">正在努力检索中...</span>`;
                    searchBtn.disabled = true;
                    searchBtn.textContent = '...';

                    try {
                        const results = await searchMusicFromGDStudio('netease', query);
                        
                        if (!results || results.length === 0) {
                            newResultsContainer.innerHTML = `<span class="empty-text" style="text-align:center; padding-top: 40px;">未能找到相关结果。</span>`;
                            return;
                        }

                        // 构建结果列表的HTML (注意 data-* 属性的传递)
                        newResultsContainer.innerHTML = results.map(song => {
                            const isCollected = musicPlaylists[0] && musicPlaylists[0].songs.some(s => String(s.id) === String(song.id));
                            const collectedClass = isCollected ? 'collected' : '';
                            
                            return `
                                <div class="music-result-item" 
                                    data-song-id="${song.id}" 
                                    data-song-name="${song.name}" 
                                    data-song-artist="${Array.isArray(song.artist) ? song.artist.join(' / ') : song.artist}" 
                                    data-song-cover="${song.pic}"
                                >
                                    <div class="result-item-cover" style="background-image: url('${song.pic}')"></div>
                                    <div class="result-item-info">
                                        <div class="result-item-title">${song.name}</div>
                                        <div class="result-item-artist">${Array.isArray(song.artist) ? song.artist.join(' / ') : song.artist}</div>
                                    </div>
                                    <button class="collect-song-btn ${collectedClass}" title="收藏到歌单" 
                                        data-song-id="${song.id}" 
                                        data-song-name="${song.name}" 
                                        data-song-artist="${Array.isArray(song.artist) ? song.artist.join('/') : song.artist}"
                                        data-song-cover="${song.pic}"
                                    >
                                        <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                                    </button>
                                </div>
                            `;
                        }).join('');
                        // 注意：这里不再需要绑定事件，因为父容器已经有了

                    } catch (error) {
                        newResultsContainer.innerHTML = `<span class="empty-text" style="text-align:center; padding-top: 40px;">搜索时发生错误，请稍后重试。</span>`;
                        console.error('搜索流程出错:', error);
                    } finally {
                        searchBtn.disabled = false;
                        searchBtn.textContent = '搜索';
                    }
                };

                searchBtn.addEventListener('click', performSearch);
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        performSearch();
                    }
                });
            }
        
        // 使用事件委托处理所有在 #modal-body 内的点击事件
        modalBody.addEventListener('click', function(event) {
            const collectBtn = event.target.closest('.collect-song-btn');
            if (collectBtn) {
                const songData = {
                    id: collectBtn.dataset.songId,
                    name: collectBtn.dataset.songName,
                    artist: collectBtn.dataset.songArtist,
                    cover: collectBtn.dataset.songCover
                };
                // 将点击的按钮本身传递过去，以便后续更新UI状态
                openCollectModal(songData, collectBtn);
            }
        });


        });
        // =============================================
        // === 音乐播放器核心逻辑 (新增) ===
        // =============================================
        
        /**
         * 格式化时间，将秒转换为 mm:ss 格式
         * @param {number} seconds - 总秒数
         * @returns {string} - 格式化后的时间字符串
         */
        function formatTime(seconds) {
            if (isNaN(seconds) || seconds < 0) {
                return '00:00';
            }
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        }
        /**
         * 播放歌单中的下一首歌曲
         */
        async function playNextSongInPlaylist() {
            const context = globalAudioPlayer.currentPlaybackContext;
            if (!context || context.source !== 'playlist') return;

            const playlist = musicPlaylists.find(p => p.id === context.playlistId);
            if (!playlist || playlist.songs.length === 0) return;

            const nextIndex = (context.currentIndex + 1) % playlist.songs.length;
            const nextSong = playlist.songs[nextIndex];

            showGlobalToast(`下一首: ${nextSong.name}`, { type: 'info' });

            const songUrl = await getNeteaseSongUrl(nextSong.id);
            if (songUrl) {
                const newContext = { ...context, currentIndex: nextIndex };
                playSong(songUrl, nextSong, newContext);
            } else {
                showCustomAlert(`获取歌曲 "${nextSong.name}" 播放链接失败，已跳过。`);
                // 可选：如果下一首失败，可以尝试再下一首
            }
        }

        /**
         * 播放歌单中的上一首歌曲
         */
        async function playPrevSongInPlaylist() {
            const context = globalAudioPlayer.currentPlaybackContext;
            if (!context || context.source !== 'playlist') return;

            const playlist = musicPlaylists.find(p => p.id === context.playlistId);
            if (!playlist || playlist.songs.length === 0) return;
            
            const prevIndex = (context.currentIndex - 1 + playlist.songs.length) % playlist.songs.length;
            const prevSong = playlist.songs[prevIndex];

            showGlobalToast(`上一首: ${prevSong.name}`, { type: 'info' });

            const songUrl = await getNeteaseSongUrl(prevSong.id);
            if (songUrl) {
                const newContext = { ...context, currentIndex: prevIndex };
                playSong(songUrl, prevSong, newContext);
            } else {
                showCustomAlert(`获取歌曲 "${prevSong.name}" 播放链接失败，已跳过。`);
            }
        }

        /**
         * 更新播放器UI
         * @param {object} songDetails - 歌曲详情对象
         */
        function updatePlayerUI(songDetails) {
            const artEl = document.getElementById('player-album-art');
            const titleEl = document.getElementById('player-song-title');
            const artistEl = document.getElementById('player-song-artist');
            const durationEl = document.getElementById('player-duration'); // 新增，获取时长元素

            if (artEl && titleEl && artistEl && durationEl) { // 确保播放器UI已加载
                if (songDetails) {
                    // 确保封面URL被正确引用，即使是Data URL也适用
                    artEl.style.backgroundImage = `url("${songDetails.cover}")`;
                    titleEl.textContent = songDetails.name;
                    artistEl.textContent = Array.isArray(songDetails.artist) ? songDetails.artist.join(' / ') : songDetails.artist;
                    
                    // 歌曲时长显示 (如果播放器已加载元数据，则显示实际时长，否则显示 --:--)
                    durationEl.textContent = formatTime(globalAudioPlayer.duration) || '--:--';

                } else {
                    artEl.style.backgroundImage = 'none';
                    titleEl.textContent = '未在播放';
                    artistEl.textContent = '--';
                    durationEl.textContent = '--:--'; // 无歌曲时时长也显示默认
                }
            }
        }
        
        // 绑定播放器控制事件 (使用事件委托)
        modalBody.addEventListener('click', (e) => {
            const playPauseBtn = e.target.closest('#player-play-pause-btn');
            const prevBtn = e.target.closest('#player-prev-btn');
            const nextBtn = e.target.closest('#player-next-btn');
            
            if (playPauseBtn) {
                if (globalAudioPlayer.paused) {
                    globalAudioPlayer.play().catch(err => console.error(err));
                } else {
                    globalAudioPlayer.pause();
                }
            }
            // 【修改点】为上一首/下一首按钮绑定真实事件
            if (prevBtn) {
                const context = globalAudioPlayer.currentPlaybackContext;
                if (context && context.source === 'playlist') {
                    playPrevSongInPlaylist();
                } else {
                    showGlobalToast('当前非歌单播放模式', { type: 'info' });
                }
            }
            if (nextBtn) {
                const context = globalAudioPlayer.currentPlaybackContext;
                if (context && context.source === 'playlist') {
                    playNextSongInPlaylist();
                } else {
                    showGlobalToast('当前非歌单播放模式', { type: 'info' });
                }
            }
        });
        
        // 绑定进度条拖动事件
        modalBody.addEventListener('input', (e) => {
            if (e.target.id === 'player-progress-bar') {
                const newTime = (e.target.value / 100) * globalAudioPlayer.duration;
                if (!isNaN(newTime)) {
                    globalAudioPlayer.currentTime = newTime;
                }
            }
        });


        // 监听全局播放器的事件，以同步UI
         globalAudioPlayer.addEventListener('play', () => {
            // 更新播放/暂停按钮的图标
            const playIcon = document.getElementById('player-play-icon');
            const pauseIcon = document.getElementById('player-pause-icon');
            if (playIcon && pauseIcon) {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            }
            
            // 自动跳转到播放器页面 (如果尚未在该页面)
            const musicModal = document.getElementById('modal-overlay');
            const musicPlayBtn = document.getElementById('music-btn-play');
            if (musicModal.classList.contains('visible') && musicPlayBtn && !musicPlayBtn.classList.contains('active')) {
                musicPlayBtn.click();
            }
            
            // 使用存储的歌曲信息更新播放器UI
            if (globalAudioPlayer.currentSongDetails) {
                 updatePlayerUI(globalAudioPlayer.currentSongDetails);
            } else if (globalAudioPlayer.src) {
                // 如果currentSongDetails为空但有src，尝试从localStorage恢复最近播放的歌曲信息
                const lastPlayedSong = JSON.parse(localStorage.getItem('lastPlayedSong'));
                if (lastPlayedSong && lastPlayedSong.url === globalAudioPlayer.src) {
                    globalAudioPlayer.currentSongDetails = lastPlayedSong.details;
                    updatePlayerUI(globalAudioPlayer.currentSongDetails);
                }
            }
        });


        globalAudioPlayer.addEventListener('pause', () => {
            const playIcon = document.getElementById('player-play-icon');
            const pauseIcon = document.getElementById('player-pause-icon');
            if (playIcon && pauseIcon) {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        });
        
        globalAudioPlayer.addEventListener('loadedmetadata', () => {
            const durationEl = document.getElementById('player-duration');
            if (durationEl) {
                durationEl.textContent = formatTime(globalAudioPlayer.duration);
            }
        });

        globalAudioPlayer.addEventListener('timeupdate', () => {
            const currentTimeEl = document.getElementById('player-current-time');
            const progressBar = document.getElementById('player-progress-bar');
            
            if (currentTimeEl && progressBar) {
                currentTimeEl.textContent = formatTime(globalAudioPlayer.currentTime);
                // 只有在音频可播放时才更新进度条，防止duration为NaN时出错
                if (globalAudioPlayer.duration) {
                     progressBar.value = (globalAudioPlayer.currentTime / globalAudioPlayer.duration) * 100;
                }
            }
        });
        
        globalAudioPlayer.addEventListener('ended', () => {
             // 播放结束的通用清理逻辑
            const playingId = globalAudioPlayer.dataset.playingMessageId;
            if (playingId) {
                const voiceBar = document.querySelector(`.message-voice-bar[data-message-id="${playingId}"]`);
                if (voiceBar) {
                    voiceBar.classList.remove('playing');
                }
            }
            globalAudioPlayer.dataset.playingMessageId = '';

            // 根据音频类型执行不同逻辑
            if (globalAudioPlayer.audioType === 'song') {
                // --- 歌曲播放结束逻辑 ---
                const context = globalAudioPlayer.currentPlaybackContext;
                if (context && context.source === 'playlist') {
                    playNextSongInPlaylist();
                } else {
                    // 单首歌曲播放完毕，弹出提示
                    showGlobalToast('当前歌曲播放完毕', { type: 'info' });
                    updatePlayerUI(null); // 清空播放器显示
                    const progressBar = document.getElementById('player-progress-bar');
                    const currentTimeEl = document.getElementById('player-current-time');
                    if (progressBar) progressBar.value = 0;
                    if (currentTimeEl) currentTimeEl.textContent = '00:00';
                }
            } else if (globalAudioPlayer.audioType === 'voice_message') {
                // --- 语音消息播放结束逻辑 ---
                // 需求1: 不弹出提示。

                // 需求2: 自动折叠文字描述
                if (playingId) {
                    const voiceBar = document.querySelector(`.message-voice-bar[data-message-id="${playingId}"]`);
                    if (voiceBar) {
                        const description = voiceBar.nextElementSibling;
                        if (description && description.classList.contains('voice-text-description')) {
                            description.style.display = 'none';
                        }
                    }
                }
            }

            // 重置音频类型标识，为下一次播放做准备
            globalAudioPlayer.audioType = undefined;
        });
                // =============================================
        // === 新增：音乐App播放器封面图库逻辑 ===
        // =============================================
        const MUSIC_COVERS_KEY = 'musicPlayerCovers';
        let musicPlayerCovers = JSON.parse(localStorage.getItem(MUSIC_COVERS_KEY)) || [];

        function saveMusicCovers() {
            localStorage.setItem(MUSIC_COVERS_KEY, JSON.stringify(musicPlayerCovers));
        }

        // 渲染图库预览
        function renderMusicGallery() {
            const grid = document.getElementById('music-gallery-grid');
            if (!grid) return;

            grid.innerHTML = `
                <div class="music-gallery-item add-btn" id="add-music-cover-btn" title="添加图片">
                    <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                </div>
            `;

            musicPlayerCovers.forEach(coverUrl => {
                const item = document.createElement('div');
                item.className = 'music-gallery-item';
                item.style.backgroundImage = `url(${coverUrl})`;
                item.dataset.url = coverUrl; // 将URL存起来以便删除
                grid.appendChild(item);
            });
        }

        // 打开图库悬浮窗
        function openMusicGallery() {
            const overlay = document.getElementById('music-gallery-overlay');
            if (!overlay) return;
            renderMusicGallery();
            overlay.classList.add('visible');
        }

        // 事件委托：处理图库的点击和双击事件
        document.body.addEventListener('click', (e) => {
            // 点击图库入口
            if (e.target.closest('#music-gallery-entry')) {
                openMusicGallery();
            }
            // 点击添加图片按钮
            if (e.target.closest('#add-music-cover-btn')) {
                document.getElementById('music-cover-upload-input').click();
            }
            // 点击关闭按钮
            if (e.target.closest('#close-music-gallery-btn')) {
                document.getElementById('music-gallery-overlay').classList.remove('visible');
            }
        });

        document.body.addEventListener('dblclick', (e) => {
            const itemToDelete = e.target.closest('.music-gallery-item:not(.add-btn)');
            if (itemToDelete) {
                const urlToDelete = itemToDelete.dataset.url;
                showCustomConfirm('确定要删除这张封面吗？', () => {
                    musicPlayerCovers = musicPlayerCovers.filter(url => url !== urlToDelete);
                    saveMusicCovers();
                    renderMusicGallery(); // 重新渲染
                    showGlobalToast('封面已删除', { type: 'success' });
                });
            }
        });

        // === 核心修改：使用事件委托和async/await重构图片上传逻辑 ===
        document.body.addEventListener('change', async (e) => {
            // 检查事件是否由我们的文件输入框触发
            if (e.target.id === 'music-cover-upload-input') {
                const files = e.target.files;
                if (!files || files.length === 0) {
                    return;
                }

                showGlobalToast(`正在处理 ${files.length} 张图片...`, { type: 'info', duration: files.length * 1000 });

                const compressionPromises = Array.from(files).map(file => 
                    compressImage(file).catch(error => {
                        console.error(`处理文件 "${file.name}" 时发生错误:`, error);
                        showCustomAlert(`处理图片 "${file.name}" 失败，该图片已被跳过。`);
                        return null; // 返回 null 以便过滤
                    })
                );

                const compressedCovers = (await Promise.all(compressionPromises)).filter(Boolean); // 等待所有压缩完成并过滤掉失败的

                if (compressedCovers.length > 0) {
                    musicPlayerCovers.push(...compressedCovers);
                    saveMusicCovers();
                    renderMusicGallery();
                    showGlobalToast(`${compressedCovers.length}张封面已成功添加！`, { type: 'success' });
                }

                // 重置输入框
                e.target.value = '';
            }
        });

        // 修改 updatePlayerUI 函数以支持随机封面
        function updatePlayerUI(songDetails) {
            const artEl = document.getElementById('player-album-art');
            const titleEl = document.getElementById('player-song-title');
            const artistEl = document.getElementById('player-song-artist');
            const durationEl = document.getElementById('player-duration');

            if (artEl && titleEl && artistEl && durationEl) {
                if (songDetails) {
                    // --- 随机封面逻辑 Start ---
                    const customCovers = JSON.parse(localStorage.getItem(MUSIC_COVERS_KEY)) || [];
                    let finalCoverUrl = songDetails.cover; // 默认使用歌曲自带封面
                    if (customCovers.length > 0) {
                        const randomIndex = Math.floor(Math.random() * customCovers.length);
                        finalCoverUrl = customCovers[randomIndex];
                    }
                    artEl.style.backgroundImage = `url("${finalCoverUrl}")`;
                    // --- 随机封面逻辑 End ---
                    
                    titleEl.textContent = songDetails.name;
                    artistEl.textContent = Array.isArray(songDetails.artist) ? songDetails.artist.join(' / ') : songDetails.artist;
                    durationEl.textContent = formatTime(globalAudioPlayer.duration) || '--:--';
                } else {
                    artEl.style.backgroundImage = 'none';
                    titleEl.textContent = '未在播放';
                    artistEl.textContent = '--';
                    durationEl.textContent = '--:--';
                }
            }
        }
            /**
     * 播放指定URL的歌曲
     * @param {string} url - 歌曲的播放链接
     * @param {object} songDetails - 包含歌曲信息的对象 {id, name, artist, cover}
     * @param {object} playbackContext - 播放上下文 {source: 'search' | 'playlist', playlistId?: string, currentIndex?: number}
     */
    function playSong(url, songDetails, playbackContext = { source: 'search' }) {
        if (!url) {
            showCustomAlert('无法获取播放链接。');
            return;
        }

        // 【核心修改】为播放器打上“歌曲”标识
        globalAudioPlayer.audioType = 'song';

        // 存储歌曲详情和播放上下文到播放器实例上
        globalAudioPlayer.currentSongDetails = songDetails;
        globalAudioPlayer.currentPlaybackContext = playbackContext;

        // 如果当前有歌曲正在播放，先暂停并重置
        if (!globalAudioPlayer.paused) {
            globalAudioPlayer.pause();
            globalAudioPlayer.currentTime = 0;
        }

        // 设置新的歌曲源并播放
        globalAudioPlayer.src = url;
        const playPromise = globalAudioPlayer.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error("音频播放失败:", error);
                // 浏览器可能会因为用户未交互而阻止自动播放，这里给一个提示
                showCustomAlert('无法自动播放，请检查浏览器设置或尝试手动交互后重试。');
            });
        }
        
        // 确保每次播放时都保存当前歌曲信息到localStorage
        localStorage.setItem('lastPlayedSong', JSON.stringify({
            url: url,
            details: songDetails,
            context: playbackContext // 同时保存上下文
        }));
    }
