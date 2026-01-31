        // === 9. 新增功能：世界书 App 完整逻辑 ===
        const worldBookFab = document.getElementById('world-book-fab');
        let worldBookData = [];
        let isWorldBookEditMode = false;
        let worldBookDraggedElement = null;
        
        // 状态跟踪变量
        let currentActiveTab = 0; // 当前活动标签页索引
        let openWorldBookCategoryId = null; // 当前打开的世界书分类ID
        let openRegexCategoryId = null; // 当前打开的正则分类ID

        const saveWorldBookData = async () => {
            await localforage.setItem('worldBookData', JSON.stringify(worldBookData));
        };
        
        const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

        // 渲染世界书主界面
        const renderWorldBook = async (expandedCategoryId = null) => {
            const container = document.querySelector('.world-book-page.main-page');
            if (!container) return; // 如果容器不存在则不渲染

            const data = await localforage.getItem('worldBookData');
            worldBookData = data ? JSON.parse(data) : [];
            
            const scrollPosition = container.scrollTop; // 保存当前滚动位置

            container.innerHTML = ''; // 清空
            if (worldBookData.length === 0) {
                container.innerHTML = `<span class="empty-text" style="text-align:center; display:block; padding: 40px 0;">空空如也，点击右下角加号添加第一个分类吧</span>`;
            }

            worldBookData.forEach((category, index) => {
                const categoryEl = document.createElement('div');
                categoryEl.className = 'world-book-category';
                categoryEl.dataset.categoryId = category.id;
                
                let editControlsHTML = '';
                if (isWorldBookEditMode) {
                    categoryEl.draggable = true;
                    categoryEl.dataset.index = index;
                    categoryEl.classList.add('in-edit-mode');
                    editControlsHTML = `
                        <div class="edit-mode-controls">
                            <button class="edit-mode-btn" data-action="rename" title="重命名"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
                            <button class="edit-mode-btn" data-action="delete" title="删除"><svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></button>
                        </div>
                    `;
                }

                categoryEl.innerHTML = `
                    <span class="category-title">${escapeHTML(category.name)}</span>
                    <div class="d-flex align-items-center">
                        ${editControlsHTML}
                        ${!isWorldBookEditMode ? '<svg class="category-arrow" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>' : ''}
                    </div>
                `;


                const itemsContainer = document.createElement('div');
                itemsContainer.className = 'category-items';
                itemsContainer.dataset.containerFor = category.id;

                if (!isWorldBookEditMode) {
                    const addItemPlaceholder = document.createElement('div');
                    addItemPlaceholder.className = 'add-item-placeholder';
                    addItemPlaceholder.textContent = '点击添加新条目';
                    addItemPlaceholder.dataset.action = 'add-item';
                    addItemPlaceholder.dataset.categoryId = category.id;
                    itemsContainer.appendChild(addItemPlaceholder);
                }
                
                if (category.items && category.items.length > 0) {
                    category.items.forEach(item => {
                        const itemEl = document.createElement('div');
                        itemEl.className = 'world-book-item';
                        itemEl.dataset.itemId = item.id;
                        itemEl.dataset.categoryId = category.id;

                        let itemHTML = `
                            <div class="item-title">${escapeHTML(item.title)}</div>
                            <div class="item-content">${escapeHTML(item.content)}</div>
                        `;
                        if (isWorldBookEditMode) {
                            itemEl.style.display = 'flex';
                            itemEl.style.justifyContent = 'space-between';
                            itemEl.style.alignItems = 'center';
                            
                            itemHTML = `
                                <div style="flex-grow: 1; overflow: hidden;">
                                    <div class="item-title">${escapeHTML(item.title)}</div>
                                    <div class="item-content">${escapeHTML(item.content)}</div>
                                </div>
                                <div class="edit-mode-controls">
                                    <button class="edit-mode-btn" data-action="delete-item" title="删除条目"><svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></button>
                                </div>
                            `;
                        }
                        itemEl.innerHTML = itemHTML;
                        itemsContainer.appendChild(itemEl);
                    });
                }
                
                if (expandedCategoryId && category.id === expandedCategoryId) {
                    categoryEl.classList.add('expanded');
                    itemsContainer.classList.add('visible');
                }

                container.appendChild(categoryEl);
                container.appendChild(itemsContainer);
            });
            
            container.scrollTop = scrollPosition; // 恢复滚动位置

            if (isWorldBookEditMode) {
                 addDragAndDropListeners();
            }
        };

        const handleOpenPreset = async (e) => {
            isWorldBookEditMode = false;
            archiveFab.classList.remove('visible');
            const instanceControls = document.getElementById('instance-app-header-controls');
            if(instanceControls) instanceControls.style.display = 'none';

            // 1. 定义包含新导航条的HTML结构
            const contentHTML = `
                <div class="memory-page world-book-page main-page active"></div>
                <div class="memory-page world-book-page regex-page"></div>
                <div class="memory-page world-book-page writing-style-page"></div>

                <div class="memory-nav-bar">
                    <button class="memory-nav-btn active" id="wb-nav-main">
                        <svg t="1769871027121" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1410" width="24" height="24"><path d="M277.333333 1002.666667c-83.2 0-149.333333-66.133333-149.333333-149.333334V170.666667c0-83.2 66.133333-149.333333 149.333333-149.333334h576c23.466667 0 42.666667 19.2 42.666667 42.666667v896c0 23.466667-19.2 42.666667-42.666667 42.666667H277.333333z m0-213.333334c-36.266667 0-64 27.733333-64 64s27.733333 64 64 64h533.333334v-128H277.333333zM213.333333 170.666667v548.266666c19.2-10.666667 40.533333-14.933333 64-14.933333h533.333334V106.666667H277.333333c-36.266667 0-64 27.733333-64 64z" fill="#2c2c2c" p-id="1411"></path><path d="M362.666667 320h298.666666c23.466667 0 42.666667-19.2 42.666667-42.666667s-19.2-42.666667-42.666667-42.666666H362.666667c-23.466667 0-42.666667 19.2-42.666667 42.666666s19.2 42.666667 42.666667 42.666667M362.666667 469.333333h170.666666c23.466667 0 42.666667-19.2 42.666667-42.666666s-19.2-42.666667-42.666667-42.666667h-170.666666c-23.466667 0-42.666667 19.2-42.666667 42.666667s19.2 42.666667 42.666667 42.666666" fill="#2c2c2c" p-id="1412"></path></svg>
                        <span>世界书</span>
                    </button>
                    <button class="memory-nav-btn" id="wb-nav-regex">
                        <svg t="1767282098136" class="app-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7509"><path d="M150.588235 223.894588h722.82353c3.915294 0 7.047529 3.132235 7.047529 6.987294v87.341177H143.540706v-87.341177c0-3.855059 3.192471-6.987294 7.047529-6.987294z m796.129883 6.987294c0-40.478118-32.828235-73.246118-73.306353-73.246117H150.588235c-40.478118 0-73.306353 32.768-73.306353 73.246117v625.302589c0 40.478118 32.828235 73.306353 73.306353 73.306353h722.82353c40.478118 0 73.306353-32.828235 73.306353-73.306353V230.942118z m-66.258824 153.6v471.702589a7.047529 7.047529 0 0 1-7.047529 7.047529H150.588235a7.047529 7.047529 0 0 1-7.047529-7.047529v-471.642353h736.918588zM229.797647 586.932706L340.931765 494.230588a12.047059 12.047059 0 0 1 16.986353 1.566118l26.985411 32.406588a12.047059 12.047059 0 0 1-1.566117 16.986353l-83.365647 69.451294 86.317176 86.256941a12.047059 12.047059 0 0 1 0 17.046589l-29.81647 29.81647a12.047059 12.047059 0 0 1-17.046589 0l-111.917176-111.917176a33.129412 33.129412 0 0 1 2.228706-48.911059z m494.170353 27.708235L640.542118 545.129412a12.047059 12.047059 0 0 1-1.566118-16.986353l26.985412-32.406588a12.047059 12.047059 0 0 1 16.986353-1.505883l111.194353 92.641883a33.129412 33.129412 0 0 1 2.228706 48.911058l-111.917177 111.917177a12.047059 12.047059 0 0 1-17.046588 0l-29.816471-29.816471a12.047059 12.047059 0 0 1 0-17.046588l86.256941-86.256941z m-252.807529 114.447059a12.047059 12.047059 0 0 1-9.637647-13.974588l35.779764-197.210353a12.047059 12.047059 0 0 1 14.034824-9.637647l41.502117 7.529412a12.047059 12.047059 0 0 1 9.637647 13.974588l-35.779764 197.150117a12.047059 12.047059 0 0 1-14.034824 9.697883l-41.502117-7.529412z" p-id="7510"></path></svg>
                        <span>正则</span>
                    </button>
                    <button class="memory-nav-btn" id="wb-nav-style">
                        <svg t="1769871093904" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1636" width="24" height="24"><path d="M644.12903226 804.26941935A160.1403871 160.1403871 0 0 0 804.26941935 644.12903226h32.04129033a160.1403871 160.1403871 0 0 0 160.14038709 160.14038709v32.04129033a160.1403871 160.1403871 0 0 0-160.14038709 160.14038709h-32.04129033A160.1403871 160.1403871 0 0 0 644.12903226 836.37677419v-32.04129032zM289.09832258 601.51741935c-10.24 27.48283871-18.89445161 52.8516129-26.624 78.55070968 42.28129032-30.72 92.49032258-50.20903226 150.49496774-57.47612903C523.69341935 608.85058065 621.99741935 535.78322581 671.87612903 443.95354839L607.72748387 379.87096774l62.10064516-62.29883871 44.13109678-44.13109677c18.89445161-18.89445161 40.29935484-53.90864516 62.89341935-104.24980645-246.42064516 38.18529032-397.17987097 189.01058065-487.75432258 432.39225806z m443.09470968-221.77858064l44.06503226 43.99896774c-44.06503226 132.12903226-176.19406452 264.25806452-352.32206452 286.3236129-117.59483871 14.66632258-190.92645161 95.39716129-220.32516129 242.19251613H115.61290323c44.06503226-264.25806452 132.12903226-880.83819355 792.77419354-880.83819354-43.99896774 131.99690323-87.99793548 220.06090323-131.99690322 264.12593548l-44.19716129 44.26322581z" p-id="1637"></path></svg>
                        <span>文风</span>
                    </button>
                </div>
            `;
            openModal('预设管理', contentHTML, e.currentTarget);

            const headerControls = `
                <div id="modal-header-controls">
                    <button id="world-book-edit-btn" class="modal-button secondary" style="padding: 6px 12px; font-size: 14px;">编辑</button>
                </div>
            `;
            document.getElementById('modal-header').insertAdjacentHTML('beforeend', headerControls);
            worldBookFab.classList.add('visible');

            // 2. 初始渲染世界书页面
            await renderWorldBook();

            // 3. 绑定导航按钮事件
            const mainBtn = document.getElementById('wb-nav-main');
            const regexBtn = document.getElementById('wb-nav-regex');
            const styleBtn = document.getElementById('wb-nav-style');

            const mainPage = document.querySelector('.world-book-page.main-page');
            const regexPage = document.querySelector('.world-book-page.regex-page');
            const stylePage = document.querySelector('.world-book-page.writing-style-page');

            const allBtns = [mainBtn, regexBtn, styleBtn];
            const allPages = [mainPage, regexPage, stylePage];
            const allHeaderControls = [document.getElementById('world-book-edit-btn'), worldBookFab];

            mainBtn.addEventListener('click', async () => {
                switchTab(0);
                await renderWorldBook();
            });

            regexBtn.addEventListener('click', () => {
                switchTab(1);
                renderRegexPageForWorldBook();
            });

            styleBtn.addEventListener('click', () => {
                switchTab(2);
                renderWritingStylePage();
            });
        };

        const handleClosePreset = () => {
             worldBookFab.classList.remove('visible');
             // [修复] 确保在关闭世界书时，彻底移除其头部的编辑按钮容器，防止其在其他App中残留
             const headerControls = document.getElementById('modal-header-controls');
             if (headerControls) {
                 headerControls.remove();
             }
             closeModal();
        };

        // 为世界书App的底部导航渲染 "文风" 页面
        const renderWritingStylePage = () => {
            const container = document.querySelector('.world-book-page.writing-style-page');
            if (!container) return;
            container.innerHTML = `<span class="empty-text" style="text-align:center; display:block; padding: 40px 0;">文风功能开发中...</span>`;
        };

        // 重写 close 按钮事件，以确保 FAB 消失和实现正确的返回逻辑
        modalCloseBtn.removeEventListener('click', closeModal); // 移除旧的，防止重复绑定
        modalCloseBtn.addEventListener('click', async () => {
            const currentTitle = modalTitle.textContent;
            const editBtn = document.getElementById('world-book-edit-btn'); // 世界书编辑按钮

            // 新增：检查是否在小剧场详情页
            if (document.querySelector('.little-theater-detail-view')) {
                renderLittleTheaterPage(); // 返回到小剧场列表页
            }
            // 新增：检查是否在小剧场列表页
            else if (currentTitle === '小剧场') {
                document.getElementById('app-games').click(); // 模拟点击游戏App，返回游戏列表
            }
            // 检查是否在世界书的子页面或正则条目页面
            else if (currentTitle.startsWith('添加条目到') || currentTitle.startsWith('编辑条目') || currentTitle === '添加正则' || currentTitle === '编辑正则') {
                // 重新创建标签页结构并返回预设管理主界面
                modalTitle.textContent = '预设管理';
                
                // 重新创建包含新导航条的HTML结构
                const contentHTML = `
                    <div class="memory-page world-book-page main-page active"></div>
                    <div class="memory-page world-book-page regex-page"></div>
                    <div class="memory-page world-book-page writing-style-page"></div>

                    <div class="memory-nav-bar">
                        <button class="memory-nav-btn active" id="wb-nav-main">
                            <svg t="1769871027121" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1410" width="24" height="24"><path d="M277.333333 1002.666667c-83.2 0-149.333333-66.133333-149.333333-149.333334V170.666667c0-83.2 66.133333-149.333333 149.333333-149.333334h576c23.466667 0 42.666667 19.2 42.666667 42.666667v896c0 23.466667-19.2 42.666667-42.666667 42.666667H277.333333z m0-213.333334c-36.266667 0-64 27.733333-64 64s27.733333 64 64 64h533.333334v-128H277.333333zM213.333333 170.666667v548.266666c19.2-10.666667 40.533333-14.933333 64-14.933333h533.333334V106.666667H277.333333c-36.266667 0-64 27.733333-64 64z" fill="#2c2c2c" p-id="1411"></path><path d="M362.666667 320h298.666666c23.466667 0 42.666667-19.2 42.666667-42.666667s-19.2-42.666667-42.666667-42.666666H362.666667c-23.466667 0-42.666667 19.2-42.666667 42.666666s19.2 42.666667 42.666667 42.666667M362.666667 469.333333h170.666666c23.466667 0 42.666667-19.2 42.666667-42.666666s-19.2-42.666667-42.666667-42.666667h-170.666666c-23.466667 0-42.666667 19.2-42.666667 42.666667s19.2 42.666667 42.666667 42.666666" fill="#2c2c2c" p-id="1412"></path></svg>
                            <span>世界书</span>
                        </button>
                        <button class="memory-nav-btn" id="wb-nav-regex">
                            <svg t="1767282098136" class="app-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7509"><path d="M150.588235 223.894588h722.82353c3.915294 0 7.047529 3.132235 7.047529 6.987294v87.341177H143.540706v-87.341177c0-3.855059 3.192471-6.987294 7.047529-6.987294z m796.129883 6.987294c0-40.478118-32.828235-73.246118-73.306353-73.246117H150.588235c-40.478118 0-73.306353 32.768-73.306353 73.246117v625.302589c0 40.478118 32.828235 73.306353 73.306353 73.306353h722.82353c40.478118 0 73.306353-32.828235 73.306353-73.306353V230.942118z m-66.258824 153.6v471.702589a7.047529 7.047529 0 0 1-7.047529 7.047529H150.588235a7.047529 7.047529 0 0 1-7.047529-7.047529v-471.642353h736.918588zM229.797647 586.932706L340.931765 494.230588a12.047059 12.047059 0 0 1 16.986353 1.566118l26.985411 32.406588a12.047059 12.047059 0 0 1-1.566117 16.986353l-83.365647 69.451294 86.317176 86.256941a12.047059 12.047059 0 0 1 0 17.046589l-29.81647 29.81647a12.047059 12.047059 0 0 1-17.046589 0l-111.917176-111.917176a33.129412 33.129412 0 0 1 2.228706-48.911059z m494.170353 27.708235L640.542118 545.129412a12.047059 12.047059 0 0 1-1.566118-16.986353l26.985412-32.406588a12.047059 12.047059 0 0 1 16.986353-1.505883l111.194353 92.641883a33.129412 33.129412 0 0 1 2.228706 48.911058l-111.917177 111.917177a12.047059 12.047059 0 0 1-17.046588 0l-29.816471-29.816471a12.047059 12.047059 0 0 1 0-17.046588l86.256941-86.256941z m-252.807529 114.447059a12.047059 12.047059 0 0 1-9.637647-13.974588l35.779764-197.210353a12.047059 12.047059 0 0 1 14.034824-9.637647l41.502117 7.529412a12.047059 12.047059 0 0 1 9.637647 13.974588l-35.779764 197.150117a12.047059 12.047059 0 0 1-14.034824 9.697883l-41.502117-7.529412z" p-id="7510"></path></svg>
                            <span>正则</span>
                        </button>
                        <button class="memory-nav-btn" id="wb-nav-style">
                            <svg t="1769871093904" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1636" width="24" height="24"><path d="M644.12903226 804.26941935A160.1403871 160.1403871 0 0 0 804.26941935 644.12903226h32.04129033a160.1403871 160.1403871 0 0 0 160.14038709 160.14038709v32.04129033a160.1403871 160.1403871 0 0 0-160.14038709 160.14038709h-32.04129033A160.1403871 160.1403871 0 0 0 644.12903226 836.37677419v-32.04129032zM289.09832258 601.51741935c-10.24 27.48283871-18.89445161 52.8516129-26.624 78.55070968 42.28129032-30.72 92.49032258-50.20903226 150.49496774-57.47612903C523.69341935 608.85058065 621.99741935 535.78322581 671.87612903 443.95354839L607.72748387 379.87096774l62.10064516-62.29883871 44.13109678-44.13109677c18.89445161-18.89445161 40.29935484-53.90864516 62.89341935-104.24980645-246.42064516 38.18529032-397.17987097 189.01058065-487.75432258 432.39225806z m443.09470968-221.77858064l44.06503226 43.99896774c-44.06503226 132.12903226-176.19406452 264.25806452-352.32206452 286.3236129-117.59483871 14.66632258-190.92645161 95.39716129-220.32516129 242.19251613H115.61290323c44.06503226-264.25806452 132.12903226-880.83819355 792.77419354-880.83819354-43.99896774 131.99690323-87.99793548 220.06090323-131.99690322 264.12593548l-44.19716129 44.26322581z" p-id="1637"></path></svg>
                            <span>文风</span>
                        </button>
                    </div>
                `;
                
                // 替换模态框内容
                document.getElementById('modal-body').innerHTML = contentHTML;
                
                // 添加头部控制按钮
                const headerControls = document.getElementById('modal-header-controls');
                if (headerControls) {
                    headerControls.innerHTML = `
                        <button id="world-book-edit-btn" class="modal-button secondary" style="padding: 6px 12px; font-size: 14px;">编辑</button>
                    `;
                } else {
                    const headerControlsHTML = `
                        <div id="modal-header-controls">
                            <button id="world-book-edit-btn" class="modal-button secondary" style="padding: 6px 12px; font-size: 14px;">编辑</button>
                        </div>
                    `;
                    document.getElementById('modal-header').insertAdjacentHTML('beforeend', headerControlsHTML);
                }
                
                // 显示世界书悬浮按钮
                worldBookFab.classList.add('visible');
                
                // 重新绑定导航按钮事件
                const mainBtn = document.getElementById('wb-nav-main');
                const regexBtn = document.getElementById('wb-nav-regex');
                const styleBtn = document.getElementById('wb-nav-style');
                
                if (mainBtn) {
                    mainBtn.addEventListener('click', async () => {
                        switchTab(0);
                        await renderWorldBook(openWorldBookCategoryId);
                    });
                }
                
                if (regexBtn) {
                    regexBtn.addEventListener('click', () => {
                        switchTab(1);
                        renderRegexPageForWorldBook();
                    });
                }
                
                if (styleBtn) {
                    styleBtn.addEventListener('click', () => {
                        switchTab(2);
                        renderWritingStylePage();
                    });
                }
                
                // 根据记录的状态恢复界面
                setTimeout(async () => {
                    // 恢复到之前的标签页
                    if (currentTitle === '添加正则' || currentTitle === '编辑正则') {
                        // 从正则条目返回，停在正则标签页
                        switchTab(1);
                        await renderRegexPageForWorldBook();
                        
                        // 保持之前打开的分类
                        if (openRegexCategoryId) {
                            const categoryEl = document.querySelector(`.world-book-category[data-category-id="${openRegexCategoryId}"]`);
                            if (categoryEl) {
                                categoryEl.classList.add('expanded');
                                categoryEl.nextElementSibling.classList.add('visible');
                            }
                        }
                    } else {
                        // 从世界书条目返回，停在世界书标签页
                        switchTab(0);
                        await renderWorldBook(openWorldBookCategoryId);
                    }
                }, 100);
            } 
            // 检查是否在世界书主页
            else if (currentTitle === '预设管理') {
                handleClosePreset();
            } 
            // 检查是否在档案App的编辑页面
            else if (currentTitle.startsWith('编辑角色：') || currentTitle === '添加新角色') {
                closeArchiveDetailModal(); // 关闭档案编辑模态框
                modalTitle.textContent = '档案'; // 将通用模态框标题设回档案
                archiveFab.classList.add('visible'); // 显示档案悬浮按钮
            }
            // 检查是否在档案App主页 或 副本App主页
            else if (currentTitle === '档案' || currentTitle === '副本') {
                closeArchiveApp(); // 关闭档案或副本App，并隐藏其悬浮按钮
            }
            // 其他情况，正常关闭
            else {
                closeModal();
            }
        });


        // 添加分类
        const handleAddCategory = () => {
            showCustomPrompt('请输入新的分类名称：', '', async (categoryName) => {
                if (categoryName && categoryName.trim()) {
                    worldBookData.unshift({
                        id: generateId(),
                        name: categoryName.trim(),
                        items: []
                    });
                    await saveWorldBookData();
                    await renderWorldBook();
                }
            });
        };


        // 显示添加或编辑条目的表单
        const showItemForm = (categoryId, itemId = null) => {
            // 记录当前状态
            const openCategory = document.querySelector('.world-book-category.expanded');
            if (openCategory) {
                openWorldBookCategoryId = openCategory.dataset.categoryId;
            }

            // 新增：进入表单页时，隐藏悬浮球
            worldBookFab.classList.remove('visible');

            const category = worldBookData.find(c => c.id === categoryId);
            let item = null;
            let currentTitle = '';
            let currentContent = '';

            const editBtn = document.getElementById('world-book-edit-btn');
            if(editBtn) editBtn.style.display = 'none'; // 隐藏“编辑”按钮


            if (itemId) {
                item = category.items.find(i => i.id === itemId);
                modalTitle.textContent = `编辑条目`;
                currentTitle = item.title;
                currentContent = item.content;
            } else {
                modalTitle.textContent = `添加条目到 "${category.name}"`;
            }

            
            modalBody.innerHTML = `
                <div id="world-book-add-item-form" class="modal-form-section">
                    <div class="modal-form-group">
                        <label for="item-title-input">标题</label>
                        <input type="text" id="item-title-input" class="modal-input" placeholder="条目标题" value="${currentTitle}">
                    </div>
                    
                    <!-- === 新增：注入位置选择器 === -->
                    <div class="modal-form-group injection-position-group">
                        <label>注入位置 (AI读取优先级)</label>
                        <div class="injection-position-selector">
                            <input type="radio" id="pos-front" name="injection-position" value="front" ${!item || item.injectionPosition === 'front' ? 'checked' : ''}>
                            <label for="pos-front">前</label>
                            
                            <input type="radio" id="pos-middle" name="injection-position" value="middle" ${item && item.injectionPosition === 'middle' ? 'checked' : ''}>
                            <label for="pos-middle">中</label>

                            <input type="radio" id="pos-back" name="injection-position" value="back" ${item && item.injectionPosition === 'back' ? 'checked' : ''}>
                            <label for="pos-back">后</label>

                            <input type="radio" id="pos-keyword" name="injection-position" value="keyword" ${item && item.injectionPosition === 'keyword' ? 'checked' : ''}>
                            <label for="pos-keyword">关键词</label>
                        </div>
                    </div>
                    <!-- === 新增结束 === -->

                    <div class="modal-form-group">
                        <label for="item-content-input">内容</label>
                        <textarea id="item-content-input" class="modal-input" placeholder="条目内容">${currentContent}</textarea>
                    </div>
                    <div class="button-container">
                        <button id="save-item-btn" class="modal-button">保存</button>
                    </div>
                </div>
            `;
            // 将 categoryId 和 itemId 传递给保存函数
            document.getElementById('save-item-btn').onclick = () => saveItem(categoryId, itemId);
        };


        // 保存新条目或更新现有条目
        const saveItem = async (categoryId, itemId) => {
            const title = document.getElementById('item-title-input').value;
            const content = document.getElementById('item-content-input').value;
            // 新增：获取选中的注入位置
            const injectionPosition = document.querySelector('input[name="injection-position"]:checked').value;

            if (!title.trim()) {
                showCustomAlert('标题不能为空！');
                return;
            }

            const category = worldBookData.find(c => c.id === categoryId);

            if (itemId) { // 如果有 itemId，说明是编辑模式
                const itemToUpdate = category.items.find(i => i.id === itemId);
                itemToUpdate.title = title.trim();
                itemToUpdate.content = content.trim();
                // 新增：更新注入位置
                itemToUpdate.injectionPosition = injectionPosition; 
            } else { // 否则是新增模式
                category.items.push({
                    id: generateId(),
                    title: title.trim(),
                    content: content.trim(),
                    // 新增：保存注入位置
                    injectionPosition: injectionPosition 
                });
            }
            
             await saveWorldBookData();
            
            // 返回主界面并渲染
            modalTitle.textContent = '世界书';
            // [修复] 重新显示“编辑”按钮和悬浮按钮
            worldBookFab.classList.add('visible');
            const editBtn = document.getElementById('world-book-edit-btn');
            if(editBtn) editBtn.style.display = '';

            await renderWorldBook();
            
            // 展开刚刚操作的分类
            const categoryEl = document.querySelector(`.world-book-category[data-category-id="${categoryId}"]`);

            const itemsContainer = document.querySelector(`.category-items[data-container-for="${categoryId}"]`);
            if(categoryEl && itemsContainer) {
                categoryEl.classList.add('expanded');
                itemsContainer.classList.add('visible');
            }
        };


        // 切换编辑模式
        const toggleEditMode = () => {
            isWorldBookEditMode = !isWorldBookEditMode;
            const editBtn = document.getElementById('world-book-edit-btn');
            editBtn.textContent = isWorldBookEditMode ? '完成' : '编辑';
            renderWorldBook(); // 这会重新渲染并应用拖拽事件

            // 为现有元素切换 class，以应用 user-select: none
            const categories = document.querySelectorAll('.world-book-category');
            categories.forEach(cat => {
                if (isWorldBookEditMode) {
                    cat.classList.add('in-edit-mode');
                } else {
                    cat.classList.remove('in-edit-mode');
                }
            });
        };

        // 拖拽排序功能（兼容桌面和移动端）
        const addDragAndDropListeners = () => {
            const draggables = document.querySelectorAll('.world-book-category[draggable="true"]');

            const handleDragEnd = () => {
                if (worldBookDraggedElement) {
                    worldBookDraggedElement.classList.remove('dragging');
                }
                worldBookDraggedElement = null;
                document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
            };

            const handleDrop = (targetElement) => {
                 if (worldBookDraggedElement && targetElement && worldBookDraggedElement !== targetElement) {
                    const fromIndex = parseInt(worldBookDraggedElement.dataset.index, 10);
                    const toIndex = parseInt(targetElement.dataset.index, 10);
                    if (fromIndex !== toIndex) {
                        const [movedItem] = worldBookData.splice(fromIndex, 1);
                        worldBookData.splice(toIndex, 0, movedItem);
                        saveWorldBookData();
                        renderWorldBook(); // 会自动重新执行 addDragAndDropListeners
                    }
                }
            };
            
            draggables.forEach(draggable => {
                // --- 桌面端事件 ---
                draggable.addEventListener('dragstart', () => {
                    worldBookDraggedElement = draggable;
                    draggable.classList.add('dragging');
                });

                draggable.addEventListener('dragend', handleDragEnd);

                draggable.addEventListener('dragover', e => {
                    e.preventDefault();
                    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
                    draggable.classList.add('drag-over');
                });

                draggable.addEventListener('drop', e => {
                    e.preventDefault();
                    handleDrop(draggable);
                });

                // --- 移动端触摸事件 ---
                draggable.addEventListener('touchstart', e => {
                    // 长按触发（例如 300ms）
                    const longPressTimer = setTimeout(() => {
                        worldBookDraggedElement = draggable;
                        draggable.classList.add('dragging');
                        // 阻止页面滚动
                        modalBody.style.overflow = 'hidden';
                    }, 300);

                    // 如果手指移开或移动，则取消长按
                    const cancelLongPress = () => clearTimeout(longPressTimer);
                    draggable.addEventListener('touchend', cancelLongPress, { once: true });
                    draggable.addEventListener('touchmove', cancelLongPress, { once: true });
                }, { passive: true });

                draggable.addEventListener('touchmove', e => {
                    if (!worldBookDraggedElement) return;
                    e.preventDefault(); // 阻止滚动
                    const touch = e.touches[0];
                    const target = document.elementFromPoint(touch.clientX, touch.clientY);
                    const dropTarget = target ? target.closest('.world-book-category[draggable="true"]') : null;

                    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
                    if (dropTarget) {
                        dropTarget.classList.add('drag-over');
                    }
                }, { passive: false }); // 需要 preventDefault，所以不是 passive

                draggable.addEventListener('touchend', e => {
                    modalBody.style.overflow = 'auto'; // 恢复滚动
                    if (!worldBookDraggedElement) return;

                    // 使用 changedTouches 因为 touchend 事件的 touches 列表是空的
                    const touch = e.changedTouches[0]; 
                    const target = document.elementFromPoint(touch.clientX, touch.clientY);
                    const dropTarget = target ? target.closest('.world-book-category[draggable="true"]') : null;

                    if (dropTarget) {
                         handleDrop(dropTarget);
                    }
                    handleDragEnd(); // 清理状态
                });
            });
        };

        
        // 主事件监听 (利用事件委托)
        document.getElementById('app-preset').addEventListener('click', handleOpenPreset);
        worldBookFab.addEventListener('click', handleAddCategory);
        
        modalBody.addEventListener('click', e => {
            // 修正：确保只在世界书的主页面监听这些点击事件
            const mainPage = e.target.closest('.world-book-page.main-page');
            if (!mainPage) return;

            const actionBtn = e.target.closest('[data-action]');
            
            // --- 编辑模式下的操作 ---
            if (isWorldBookEditMode && actionBtn) {
                const action = actionBtn.dataset.action;
                const categoryEl = actionBtn.closest('.world-book-category');
                const itemEl = actionBtn.closest('.world-book-item');

                if (action === 'rename') {
                    const categoryId = categoryEl.dataset.categoryId;
                    const category = worldBookData.find(c => c.id === categoryId);
                    showCustomPrompt('请输入新的分类名称：', category.name, (newName) => {
                        if (newName && newName.trim() && newName.trim() !== category.name) {
                            category.name = newName.trim();
                            saveWorldBookData();
                            renderWorldBook();
                        }
                    });
                } else if (action === 'delete') {
                    const categoryId = categoryEl.dataset.categoryId;
                    showCustomConfirm('确定要删除这个分类及其所有条目吗？', () => {
                        worldBookData = worldBookData.filter(c => c.id !== categoryId);
                        saveWorldBookData();
                        renderWorldBook();
                    });
                } else if (action === 'delete-item') {
                    const itemId = itemEl.dataset.itemId;
                    const categoryId = itemEl.dataset.categoryId;
                    showCustomConfirm('确定要删除这个条目吗？', () => {
                        const cat = worldBookData.find(c => c.id === categoryId);
                        if (cat) {
                            cat.items = cat.items.filter(i => i.id !== itemId);
                            saveWorldBookData();
                            renderWorldBook(categoryId); 
                        }
                    });
                }
                return;
            }

            // --- 普通模式下的操作 ---
            if (actionBtn && actionBtn.dataset.action === 'add-item') {
                showItemForm(actionBtn.dataset.categoryId);
            } else {
                const categoryEl = e.target.closest('.world-book-category');
                const itemEl = e.target.closest('.world-book-item');

                if (itemEl && !isWorldBookEditMode) {
                    showItemForm(itemEl.dataset.categoryId, itemEl.dataset.itemId);
                } else if (categoryEl) {
                    categoryEl.classList.toggle('expanded');
                    categoryEl.nextElementSibling.classList.toggle('visible');
                }
            }
        });

        // ===================================
        // === 正则 App 核心逻辑 (regex_app.js) ===
        // ===================================

        // --- 数据管理 ---
        let regexAppData = [];
        let isRegexEditMode = false; // 新增：正则App的编辑模式状态
        let draggedElement = null; // 新增：用于拖拽排序
        const REGEX_STORAGE_KEY = 'regexAppData';

        async function loadRegexData() {
            regexAppData = JSON.parse(await localforage.getItem(REGEX_STORAGE_KEY)) || [];
        }

        async function saveRegexData() {
            await localforage.setItem(REGEX_STORAGE_KEY, JSON.stringify(regexAppData));
        }

        // --- App 入口 ---
        const regexAppIcon = document.getElementById('app-regex');
        if (regexAppIcon) {
            regexAppIcon.addEventListener('click', (e) => openRegexApp(e));
        }

        async function openRegexApp(event) {
            await loadRegexData();
            isRegexEditMode = false; // 每次打开时重置编辑模式

            // 创建并显示FAB
            if (!document.getElementById('regex-app-fab')) {
                const fab = document.createElement('div');
                fab.id = 'regex-app-fab';
                fab.title = '添加分类';
                fab.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>`;
                document.body.appendChild(fab);
                fab.addEventListener('click', handleAddRegexCategory);
            }
            document.getElementById('regex-app-fab').classList.add('visible');

            // 动态添加右上角的“编辑”按钮
            const headerControlsHTML = `
                <div id="modal-header-controls">
                    <button id="regex-edit-btn" class="modal-button secondary" style="padding: 6px 12px; font-size: 14px;">编辑</button>
                </div>
            `;
            openModal('正则', '', event.currentTarget);
            document.getElementById('modal-header').insertAdjacentHTML('beforeend', headerControlsHTML);

            renderRegexApp();
        }

        // --- 渲染函数 ---

        // 渲染主界面（分类列表），新增 expandedCategoryId 参数用于保持分类展开
        function renderRegexApp(expandedCategoryId = null, container = null) {
            const targetContainer = container || document.getElementById('modal-body');
            if (!targetContainer) return;
            
            const scrollPosition = targetContainer.scrollTop; // 保存滚动位置
            targetContainer.innerHTML = '';

            if (regexAppData.length === 0) {
                targetContainer.innerHTML = `<span class="empty-text" style="text-align:center; display:block; padding: 40px 0;">点击右下角“+”添加第一个分类</span>`;
                return;
            }

            regexAppData.forEach((category, index) => {
                const categoryEl = document.createElement('div');
                categoryEl.className = 'world-book-category';
                categoryEl.dataset.categoryId = category.id;

                let editControlsHTML = '';
                if (isRegexEditMode) {
                    categoryEl.draggable = true;
                    categoryEl.dataset.index = index;
                    categoryEl.classList.add('in-edit-mode'); // 应用 user-select: none;
                    editControlsHTML = `
                        <div class="edit-mode-controls">
                            <button class="edit-mode-btn" data-action="rename-category" title="重命名"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
                            <button class="edit-mode-btn" data-action="delete-category" title="删除"><svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></button>
                        </div>
                    `;
                }

                categoryEl.innerHTML = `
                    <span class="category-title">${escapeHTML(category.name)}</span>
                    <div class="d-flex align-items-center">
                        ${editControlsHTML}
                        ${isRegexEditMode ? '' : '<svg class="category-arrow" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>'}
                    </div>
                `;

                const itemsContainer = document.createElement('div');
                itemsContainer.className = 'category-items';

                // 只有非编辑模式才显示“添加”按钮
                if (!isRegexEditMode) {
                    const addItemPlaceholder = document.createElement('div');
                    addItemPlaceholder.className = 'add-item-placeholder';
                    addItemPlaceholder.textContent = '点击添加正则';
                    addItemPlaceholder.dataset.action = 'add-regex';
                    addItemPlaceholder.dataset.categoryId = category.id;
                    itemsContainer.appendChild(addItemPlaceholder);
                }

                if (category.items && category.items.length > 0) {
                    category.items.forEach(item => {
                        const itemEl = document.createElement('div');
                        itemEl.className = 'world-book-item';
                        itemEl.dataset.itemId = item.id;
                        itemEl.dataset.categoryId = category.id;

                        let itemHTML;
                        if (isRegexEditMode) {
                            itemEl.style.display = 'flex';
                            itemEl.style.justifyContent = 'space-between';
                            itemEl.style.alignItems = 'center';
                            itemHTML = `
                                <div style="flex-grow: 1; overflow: hidden;">
                                    <div class="item-title">${escapeHTML(item.name)}</div>
                                    <div class="item-content">规则: ${escapeHTML(item.pattern)}</div>
                                </div>
                                <div class="edit-mode-controls">
                                    <button class="edit-mode-btn" data-action="delete-item" title="删除条目"><svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></button>
                                </div>
                            `;
                        } else {
                            itemHTML = `
                                <div class="item-title">${escapeHTML(item.name)}</div>
                                <div class="item-content">规则: ${escapeHTML(item.pattern)}</div>
                            `;
                        }
                        itemEl.innerHTML = itemHTML;
                        itemsContainer.appendChild(itemEl);
                    });
                }

                targetContainer.appendChild(categoryEl);
                targetContainer.appendChild(itemsContainer);

                // 如果需要保持展开，则添加相应class
                if (expandedCategoryId && category.id === expandedCategoryId) {
                    categoryEl.classList.add('expanded');
                    itemsContainer.classList.add('visible');
                }
            });

            if (isRegexEditMode) {
                addDragAndDropListenersForRegex();
            }

            targetContainer.scrollTop = scrollPosition; // 恢复滚动位置
        }

        // 显示添加/编辑规则的表单
        async function showRegexForm(categoryId, itemId = null) {
            // 记录当前状态
            const openCategory = document.querySelector('.world-book-category.expanded');
            if (openCategory) {
                openRegexCategoryId = openCategory.dataset.categoryId;
            }

            const fab = document.getElementById('regex-app-fab');
            if (fab) fab.classList.remove('visible');
            
            const category = regexAppData.find(c => c.id === categoryId);
            const item = itemId ? category.items.find(i => i.id === itemId) : null;
            
            let currentName = item ? item.name : '';
            let currentPattern = item ? item.pattern : '';
            let currentReplacement = item ? item.replacement : '';
            let currentScope = item ? item.scope : { global: false, instance: false, chatapp: [] };

            // 获取聊天联系人列表
            const contacts = (JSON.parse(await localforage.getItem('chatAppData')) || { contacts: [] }).contacts;
            const contactsCheckboxesHTML = contacts.map(contact => `
                <label class="regex-scope-contact-item">
                    <input type="checkbox" class="chatapp-contact-checkbox" value="${contact.id}" ${currentScope.chatapp.includes(contact.id) ? 'checked' : ''}>
                    <div class="chat-contact-avatar" style="width: 30px; height: 30px; background-image: url('${contact.avatar}')"></div>
                    <span>${escapeHTML(contact.name)}</span>
                </label>
            `).join('');

            const formHTML = `
                <div class="modal-form-section">
                    <div class="modal-form-group">
                        <label for="regex-name-input">规则名称</label>
                        <input type="text" id="regex-name-input" class="modal-input" placeholder="用于在列表中识别" value="${escapeHTML(currentName)}">
                    </div>
                    <div class="modal-form-group">
                        <label for="regex-pattern-input">正则表达式</label>
                        <input type="text" id="regex-pattern-input" class="modal-input" placeholder="例如: /水母/g" value="${escapeHTML(currentPattern)}">
                    </div>
                    <div class="modal-form-group">
                        <label for="regex-replacement-input">替换内容</label>
                        <input type="text" id="regex-replacement-input" class="modal-input" placeholder="匹配后替换为此内容" value="${escapeHTML(currentReplacement)}">
                    </div>
                    <div class="modal-form-group">
                        <label>适用范围</label>
                        <div class="regex-scope-options">
                            <label><input type="checkbox" id="scope-global" ${currentScope.global ? 'checked' : ''}> 全局</label>
                            <label><input type="checkbox" id="scope-instance" ${currentScope.instance ? 'checked' : ''}> 副本中</label>
                        </div>
                        <details id="chatapp-scope-details">
                            <summary>ChatApp聊天</summary>
                            <div class="regex-scope-contact-list">
                                ${contactsCheckboxesHTML}
                            </div>
                        </details>
                    </div>
                    <div class="button-container">
                        <button id="save-regex-rule-btn" class="modal-button">保存</button>
                    </div>
                </div>
            `;
            
            const modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = formHTML;
            document.getElementById('modal-title').textContent = item ? '编辑正则' : '添加正则';

            document.getElementById('save-regex-rule-btn').addEventListener('click', () => saveRegexRule(categoryId, itemId));
        }
        
        // --- 事件处理 ---
        
        // 添加新分类
        function handleAddRegexCategory() {
            showCustomPrompt('请输入新的分类名称：', '', async (name) => {
                if (name && name.trim()) {
                    regexAppData.unshift({
                        id: 'regex_cat_' + generateId(),
                        name: name.trim(),
                        items: []
                    });
                    await saveRegexData();
                    const regexPage = document.querySelector('.world-book-page.regex-page');
                    if (regexPage && regexPage.classList.contains('active')) {
                        renderRegexApp(null, regexPage);
                    } else {
                        renderRegexApp();
                    }
                }
            });
        }

        // 保存规则
        async function saveRegexRule(categoryId, itemId) {
            const name = document.getElementById('regex-name-input').value.trim();
            const pattern = document.getElementById('regex-pattern-input').value.trim();
            const replacement = document.getElementById('regex-replacement-input').value;

            if (!name || !pattern) {
                showCustomAlert('规则名称和正则表达式不能为空！');
                return;
            }

            const scope = {
                global: document.getElementById('scope-global').checked,
                instance: document.getElementById('scope-instance').checked,
                chatapp: Array.from(document.querySelectorAll('.chatapp-contact-checkbox:checked')).map(cb => cb.value)
            };

            const category = regexAppData.find(c => c.id === categoryId);
            if (!category) return;

            if (itemId) { // 编辑
                const item = category.items.find(i => i.id === itemId);
                if (item) {
                    item.name = name;
                    item.pattern = pattern;
                    item.replacement = replacement;
                    item.scope = scope;
                }
            } else { // 新增
                category.items.push({
                    id: 'regex_item_' + generateId(),
                    name,
                    pattern,
                    replacement,
                    scope
                });
            }
            
            await saveRegexData();
            document.getElementById('modal-title').textContent = '预设管理';
            const fab = document.getElementById('regex-app-fab');
            if (fab) fab.classList.add('visible');
            const regexPage = document.querySelector('.world-book-page.regex-page');
            if (regexPage && regexPage.classList.contains('active')) {
                renderRegexApp(categoryId, regexPage);
            } else {
                renderRegexApp(categoryId);
            }
            showGlobalToast('规则已保存！', { type: 'success' });
        }

        // 新增：切换编辑模式
        function toggleRegexEditMode() {
            isRegexEditMode = !isRegexEditMode;
            const editBtn = document.getElementById('regex-edit-btn');
            if (editBtn) {
                editBtn.textContent = isRegexEditMode ? '完成' : '编辑';
            }
            const regexPage = document.querySelector('.world-book-page.regex-page');
            if (regexPage && regexPage.classList.contains('active')) {
                renderRegexApp(null, regexPage);
            } else {
                renderRegexApp();
            }
        }
        
        // 新增：拖拽排序功能
        function addDragAndDropListenersForRegex() {
            const draggables = document.querySelectorAll('.world-book-category[draggable="true"]');
            
            draggables.forEach(draggable => {
                draggable.addEventListener('dragstart', () => {
                    draggedElement = draggable;
                    setTimeout(() => draggable.classList.add('dragging'), 0);
                });

                draggable.addEventListener('dragend', () => {
                    if(draggedElement) draggedElement.classList.remove('dragging');
                    draggedElement = null;
                    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
                });

                draggable.addEventListener('dragover', e => {
                    e.preventDefault();
                    const target = e.target.closest('.world-book-category');
                    if(target && target !== draggedElement) {
                        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
                        target.classList.add('drag-over');
                    }
                });

                draggable.addEventListener('drop', async e => {
                    e.preventDefault();
                    const toElement = e.target.closest('.world-book-category');
                    if (!draggedElement || !toElement || draggedElement === toElement) return;

                    const fromIndex = parseInt(draggedElement.dataset.index, 10);
                    const toIndex = parseInt(toElement.dataset.index, 10);
                    
                    const [movedItem] = regexAppData.splice(fromIndex, 1);
                    regexAppData.splice(toIndex, 0, movedItem);

                    await saveRegexData();
                    const regexPage = document.querySelector('.world-book-page.regex-page');
                    if (regexPage && regexPage.classList.contains('active')) {
                        renderRegexApp(null, regexPage);
                    } else {
                        renderRegexApp();
                    }
                });
            });
        }

        // 渲染正则页面
        async function renderRegexPageForWorldBook() {
            const container = document.querySelector('.world-book-page.regex-page');
            if (!container) return;

            await loadRegexData();
            isRegexEditMode = false;

            // 创建并显示FAB
            if (!document.getElementById('regex-app-fab')) {
                const fab = document.createElement('div');
                fab.id = 'regex-app-fab';
                fab.title = '添加分类';
                fab.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>`;
                document.body.appendChild(fab);
                fab.addEventListener('click', handleAddRegexCategory);
            }
            document.getElementById('regex-app-fab').classList.add('visible');

            // 动态添加右上角的“编辑”按钮
            const headerControls = document.getElementById('modal-header-controls');
            if (headerControls) {
                headerControls.innerHTML = `
                    <button id="regex-edit-btn" class="modal-button secondary" style="padding: 6px 12px; font-size: 14px;">编辑</button>
                `;
            } else {
                const headerControlsHTML = `
                    <div id="modal-header-controls">
                        <button id="regex-edit-btn" class="modal-button secondary" style="padding: 6px 12px; font-size: 14px;">编辑</button>
                    </div>
                `;
                document.getElementById('modal-header').insertAdjacentHTML('beforeend', headerControlsHTML);
            }

            renderRegexApp(null, container);
            
            // 添加正则页面事件监听器
            setTimeout(addRegexPageEventListener, 100);
        }

        // --- 正则应用核心函数 (暴露到全局) ---
        window.applyAllRegex = async function(originalText, scopeContext) {
            if (typeof originalText !== 'string' || !originalText) {
                return originalText;
            }
            
            let modifiedText = originalText;
            const regexData = JSON.parse(await localforage.getItem('regexAppData')) || [];

            for (const category of regexData) {
                if (!category.items || category.items.length === 0) continue;

                for (const rule of category.items) {
                    try {
                        // 检查作用域是否匹配
                        let shouldApply = false;
                        if (rule.scope.global) {
                            shouldApply = true;
                        } else if (scopeContext.type === 'instance' && rule.scope.instance) {
                            shouldApply = true;
                        } else if (scopeContext.type === 'chat' && rule.scope.chatapp && rule.scope.chatapp.includes(scopeContext.id)) {
                            shouldApply = true;
                        }
                        
                        if (shouldApply) {
                            // 解析 /pattern/flags 格式的正则表达式字符串
                            const regexParts = rule.pattern.match(/^\/(.*)\/([gimsuy]*)$/);
                            if (regexParts) {
                                const pattern = regexParts[1];
                                const flags = regexParts[2];
                                const regex = new RegExp(pattern, flags);
                                modifiedText = modifiedText.replace(regex, rule.replacement);
                            } else {
                                // 如果格式不匹配，当作普通字符串替换
                                const regex = new RegExp(rule.pattern, 'g'); // 默认全局替换
                                modifiedText = modifiedText.replace(regex, rule.replacement);
                            }
                        }
                    } catch (error) {
                        // 捕获无效的正则表达式错误，避免中断整个应用
                        console.error(`无效的正则表达式规则: "${rule.name}" (${rule.pattern})`, error);
                        continue; // 跳过此规则
                    }
                }
            }
            return modifiedText;
        };

        // 监听模态框头部按钮事件 (新增)
        document.getElementById('modal-header').addEventListener('click', (e) => {
            if (e.target.id === 'regex-edit-btn') {
                toggleRegexEditMode();
            }
        });

        // 正则页面事件委托函数
        function addRegexPageEventListener() {
            const regexPage = document.querySelector('.world-book-page.regex-page');
            if (!regexPage) return;

            // 移除可能存在的旧事件监听器
            const newRegexPage = regexPage.cloneNode(true);
            regexPage.parentNode.replaceChild(newRegexPage, regexPage);

            // 添加新的事件监听器
            newRegexPage.addEventListener('click', (e) => {
                const regexPage = document.querySelector('.world-book-page.regex-page');
                if (!regexPage || !regexPage.classList.contains('active')) return;

                const actionBtn = e.target.closest('[data-action]');
                
                // --- 编辑模式下的操作 ---
                if (isRegexEditMode && actionBtn) {
                    const action = actionBtn.dataset.action;
                    const categoryEl = actionBtn.closest('.world-book-category');
                    const itemEl = actionBtn.closest('.world-book-item');

                    if (action === 'rename-category') {
                        const categoryId = categoryEl.dataset.categoryId;
                        const category = regexAppData.find(c => c.id === categoryId);
                        showCustomPrompt('请输入新的分类名称：', category.name, async (newName) => {
                            if (newName && newName.trim() !== category.name) {
                                category.name = newName.trim();
                                await saveRegexData();
                                renderRegexApp(null, regexPage);
                            }
                        });
                    } else if (action === 'delete-category') {
                        const categoryId = categoryEl.dataset.categoryId;
                        showCustomConfirm('确定要删除这个分类及其所有规则吗？', async () => {
                            regexAppData = regexAppData.filter(c => c.id !== categoryId);
                            await saveRegexData();
                            renderRegexApp(null, regexPage);
                        });
                    } else if (action === 'delete-item') {
                        const categoryId = itemEl.dataset.categoryId;
                        const itemId = itemEl.dataset.itemId;
                        showCustomConfirm('确定要删除这个正则规则吗？', async () => {
                            const category = regexAppData.find(c => c.id === categoryId);
                            if (category) {
                                category.items = category.items.filter(i => i.id !== itemId);
                                await saveRegexData();
                                renderRegexApp(categoryId, regexPage);
                            }
                        });
                    }
                    return;
                }

                // --- 普通模式下的操作 ---
                if (actionBtn && actionBtn.dataset.action === 'add-regex') {
                    showRegexForm(actionBtn.dataset.categoryId);
                } else {
                    const categoryEl = e.target.closest('.world-book-category');
                    const itemEl = e.target.closest('.world-book-item');

                    if (itemEl && !isRegexEditMode) {
                        showRegexForm(itemEl.dataset.categoryId, itemEl.dataset.itemId);
                    } else if (categoryEl) {
                        categoryEl.classList.toggle('expanded');
                        categoryEl.nextElementSibling.classList.toggle('visible');
                    }
                }
            }, true);
        }

        // 调整标签页切换逻辑
        const switchTab = (activeIndex) => {
            const allBtns = [document.getElementById('wb-nav-main'), document.getElementById('wb-nav-regex'), document.getElementById('wb-nav-style')];
            const allPages = [document.querySelector('.world-book-page.main-page'), document.querySelector('.world-book-page.regex-page'), document.querySelector('.world-book-page.writing-style-page')];
            const allHeaderControls = [document.getElementById('world-book-edit-btn'), worldBookFab];
            const regexFab = document.getElementById('regex-app-fab');
            const regexEditBtn = document.getElementById('regex-edit-btn');
            
            allBtns.forEach((btn, index) => btn.classList.toggle('active', index === activeIndex));
            allPages.forEach((page, index) => page.classList.toggle('active', index === activeIndex));
            
            // 更新当前活动标签页索引
            currentActiveTab = activeIndex;
            
            // 控制只在“世界书”页面显示编辑按钮和悬浮按钮
            const isMainPage = activeIndex === 0;
            const isRegexPage = activeIndex === 1;
            
            allHeaderControls.forEach(ctrl => {
                if (ctrl) ctrl.style.display = isMainPage ? '' : 'none';
            });
            
            // 控制正则页面的FAB和编辑按钮
            if (regexFab) {
                regexFab.style.display = isRegexPage ? '' : 'none';
            }
            if (regexEditBtn) {
                regexEditBtn.style.display = isRegexPage ? '' : 'none';
            }
        };

        // 重写switchTab函数
        const originalSwitchTab = switchTab;
        switchTab = (activeIndex) => {
            originalSwitchTab(activeIndex);
        };
        
