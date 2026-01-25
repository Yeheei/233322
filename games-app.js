// === 新增：游戏 App 功能 (V2 - 包含小剧场逻辑) ===
document.getElementById('app-games').addEventListener('click', function(e) {
    // 定义游戏卡片的数据和SVG图标
    const games = [
        { name: '小剧场', icon: '<svg t="1769319040210" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1411" width="32" height="32"><path d="M336.426667 499.434667c155.093333-62.549333 357.034667 3.136 340.928-3.114667q40.96-148.586667 152.192-136.064-21.973333-225.216-210.709334-178.282667-121.450667-106.346667-220.949333-3.136-204.842667-20.330667-213.632 184.533334 124.373333-9.386667 152.170667 136.064z m0 0l493.12-103.210667c-29.546667-0.277333-56.938667 16.448-71.701334 43.797333-4.672 5.077333-8.618667 10.88-11.712 17.194667l-43.882666 109.482667q-229.738667-103.232-384.853334 3.114666l-36.565333-95.402666a89.6 89.6 0 0 0-24.874667-39.082667c-16.490667-20.608-40.490667-32.576-65.856-32.853333C144.768 399.786667 106.666667 438.4 106.688 486.933333c-0.832 28.949333 11.776 56.448 33.664 73.493334 9.728 8.597333 19.989333 16.426667 30.72 23.466666l65.856 164.202667c11.712 26.602667 49.749333 39.104 68.778667 46.933333l-24.874667 46.912c-9.28 17.28-3.712 39.317333 12.458667 49.237334 16.149333 9.92 36.778667 3.989333 46.08-13.269334l43.882666-79.765333h260.458667l43.904 79.765333c9.28 17.28 29.909333 23.210667 46.08 13.290667 16.149333-9.941333 21.717333-32 12.437333-49.28l-24.874666-43.776c29.952-6.101333 55.466667-26.965333 68.778666-56.298667l55.594667-159.509333a102.677333 102.677333 0 0 0 52.693333-39.104 94.613333 94.613333 0 0 0 19.008-56.32c-2.304-49.365333-40.085333-88.362667-86.336-89.130667L336.426667 499.434667z" p-id="1412" fill="#13227a"></path></svg>' },
        { name: '测谎仪', icon: '<svg t="1769319148603" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3017" width="32" height="32"><path d="M743.04 804.16a715.2 715.2 0 0 1-219.84 32A710.72 710.72 0 0 1 290.56 800H288a379.2 379.2 0 1 1 455.68 6.08m-73.6 78.4c-2.88 0-22.4 8-29.12 9.92a401.28 401.28 0 0 1-120.96 13.76 411.84 411.84 0 0 1-116.16-14.4c-9.92-2.88-29.12-9.92-38.08-13.12a48.96 48.96 0 0 1-4.48-6.72 814.4 814.4 0 0 0 162.56 16.32 870.72 870.72 0 0 0 148.16-14.4 16.96 16.96 0 0 0-3.52 6.72M519.36 65.92a432.64 432.64 0 0 0-224 802.56 32 32 0 0 1 12.8 18.88l2.24 4.8c11.84 21.12 21.12 32 35.52 36.48s28.48 10.24 42.88 14.72a463.68 463.68 0 0 0 130.88 16.64 444.8 444.8 0 0 0 136.96-16.32c8-2.56 27.84-9.92 29.76-10.24a74.24 74.24 0 0 0 34.24-32l2.24-3.84a71.68 71.68 0 0 1 21.44-29.76 432.64 432.64 0 0 0-224-802.24" fill="#13227a" p-id="3018"></path><path d="M506.24 373.12a118.08 118.08 0 0 1 0 235.84 118.08 118.08 0 0 1 0-235.84z m0 178.88a61.12 61.12 0 0 0 3.52-121.92h-3.52a61.12 61.12 0 1 0 0 121.92z m0-317.12a28.48 28.48 0 1 0-28.48-28.48 28.48 28.48 0 0 0 28.48 28.48" fill="#13227a" p-id="3019"></path></svg>' },
        { name: '情侣问答', icon: '<svg t="1769319222515" class="icon" viewBox="0 0 1134 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4003" width="32" height="32"><path d="M220.897507 1024v-145.728532H99.279778A99.279778 99.279778 0 0 1 0 780.055402V415.556787a99.634349 99.634349 0 0 1 99.279778-99.279779H248.199446v70.914128H99.279778a28.365651 28.365651 0 0 0-28.365651 28.365651V780.055402a28.365651 28.365651 0 0 0 28.365651 28.365651h192.531856v87.933518l138.99169-87.933518h179.412742v70.914127h-158.847645z" p-id="4004" fill="#13227a"></path><path d="M931.102493 910.537396L638.227147 726.160665H332.941828A120.554017 120.554017 0 0 1 212.742382 605.606648V120.554017A120.554017 120.554017 0 0 1 332.941828 0h681.484765A120.908587 120.908587 0 0 1 1134.626039 120.554017v485.052631a120.908587 120.908587 0 0 1-120.554017 120.554017h-82.969529zM332.941828 70.914127A49.639889 49.639889 0 0 0 283.65651 120.554017v485.052631a49.639889 49.639889 0 0 0 49.639889 49.639889h326.204986l200.686981 126.581718v-126.581718h154.238227a49.639889 49.639889 0 0 0 49.639889-49.639889V120.554017a49.639889 49.639889 0 0 0-49.639889-49.63989z" p-id="4005" fill="#13227a"></path><path d="M976.842105 497.462604h-70.914127v-15.955679l-54.603878-140.764543-54.958449 140.764543v15.955679h-70.914127v-29.074792l98.925207-254.581718h53.540167l98.925207 254.581718v29.074792zM531.855956 496.398892a141.828255 141.828255 0 1 1 141.828255-141.828255 141.828255 141.828255 0 0 1-141.828255 141.828255z m0-212.742382a70.914127 70.914127 0 1 0 70.914127 70.914127 70.914127 70.914127 0 0 0-70.914127-70.914127z" p-id="4006" fill="#13227a"></path><path d="M581.460388 455.091413l50.100831-50.171745 54.178393 54.142936-50.136288 50.171745z" p-id="4007" fill="#13227a"></path></svg>' },
        { name: '提问箱', icon: '<svg t="1769319385471" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5775" width="32" height="32"><path d="M958 283v-2c0-4.1-2-6.1-2-8.2l-59.1-135c-20.4-45-63.1-73.6-112-73.6H237.1c-48.9-2-91.6 26.6-112 71.6L66 270.7c-2 2-2 6.1-2 8.2v558.4C64 904.8 119 960 186.2 960h651.6C905 960 960 904.8 960 837.3V287.1c-2-2.1-2-4.1-2-4.1zM196.5 176.2c8.6-19.6 27.9-32.3 49.3-32.3h528.3c21.3 0 40.7 12.7 49.3 32.3l30.7 70H165.8l30.7-70z m682 649.9c0 29.9-24.1 54.1-53.9 54.1H199.3c-29.7 0-53.9-24.2-53.9-54.1V328h733.1v498.1z" fill="#13227a" p-id="5776"></path><path d="M465.5 713.2h81.3v76.7h-81.3zM580 608.3c-31 21.1-44.8 41.7-41.5 61.6v13.4h-66.4V665c-1.1-34.4 13.3-62.2 43.1-83.3 27.6-22.2 40.9-42.2 39.9-60-2.2-23.3-14.9-36.1-38.2-38.3-31 0-50.3 20.5-58 61.6l-74.7-16.6c13.3-75.5 61.4-112.2 144.3-110 68.6 3.3 105.6 34.4 111.1 93.4 2.3 35.4-17.6 67.6-59.6 96.5z" p-id="5777" fill="#13227a"></path></svg>' }
    ];

    const gameAppHTML = `
        <div class="game-app-grid">
            ${games.map(game => `
                <div class="game-card" data-gamename="${game.name}">
                    ${game.icon}
                    <span class="game-card-name">${game.name}</span>
                </div>
            `).join('')}
        </div>
    `;

    openModal('游戏', gameAppHTML, this);

    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const gameName = card.dataset.gamename;
            if (gameName === '小剧场') {
                // 打开小剧场专属界面，并渲染已有的小剧场
                renderLittleTheaterPage();
            } else {
                showCustomAlert(`你点击了【${gameName}】，该功能正在开发中...`);
            }
        });
    });
});

async function renderLittleTheaterPage() {
    const theaters = JSON.parse(await localforage.getItem('littleTheaters') || '[]');
    let theaterListHTML = '';
    
    if (theaters.length === 0) {
        theaterListHTML = `<span class="empty-text" style="padding: 40px 0;">这里将显示已创建的小剧场列表...</span>`;
    } else {
        const cardsHTML = theaters.map((theater, index) => `
            <div class="little-theater-card" data-theater-index="${index}">
                <div class="little-theater-title">${escapeHTML(theater.title)}</div>
                <div class="little-theater-actors">
                    ${theater.actors.map(actor => `
                        <div class="little-theater-actor-avatar" style="background-image: url('${actor.avatar}')"></div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        theaterListHTML = `<div id="little-theater-list">${cardsHTML}</div>`;
    }

    openModal('小剧场', theaterListHTML);
    document.getElementById('little-theater-fab').classList.add('visible');

    // === 新逻辑从这里开始 ===
    
    // 获取菜单和遮罩层元素
    const contextMenuOverlay = document.getElementById('little-theater-context-menu-overlay');
    const contextMenu = document.getElementById('little-theater-context-menu');
    let longPressTimer = null;
    let isLongPress = false;
    let currentTheaterIndex = null;

    // 显示菜单的函数
    function showContextMenu(event, index) {
        currentTheaterIndex = index; // 记录当前操作的卡片索引
        
        let x, y;
        if (event.touches) {
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        } else {
            x = event.clientX;
            y = event.clientY;
        }

        const menuWidth = contextMenu.offsetWidth;
        const menuHeight = contextMenu.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // 防止菜单超出屏幕
        if (x + menuWidth > windowWidth - 10) x = windowWidth - menuWidth - 10;
        if (y + menuHeight > windowHeight - 10) y = windowHeight - menuHeight - 10;
        
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenuOverlay.classList.add('visible');
    }

    // 隐藏菜单的函数
    function hideContextMenu() {
        contextMenuOverlay.classList.remove('visible');
        currentTheaterIndex = null;
    }

    // 为每个卡片绑定事件
    document.querySelectorAll('.little-theater-card').forEach(card => {
        const theaterIndex = card.dataset.theaterIndex;

        // 短按事件（显示详情）
        card.addEventListener('click', (e) => {
            if (isLongPress) return; // 如果是长按，则不触发单击

            const theater = theaters[theaterIndex];
            if (theater) {
                openModal(theater.title, `<div class="little-theater-detail-view">${theater.htmlContent}</div>`);
                document.getElementById('little-theater-fab').classList.remove('visible');
            }
        });

        // 长按事件处理（触摸和鼠标）
        const startPress = (e) => {
            // e.preventDefault(); // 【移除】此行可能阻止 click 事件在某些设备上触发
            isLongPress = false; // 【核心修复】每次按压开始时，重置长按标志
            longPressTimer = setTimeout(() => {
                isLongPress = true;
                // 如果是触摸事件，需要手动阻止默认的上下文菜单行为
                if (e.type === 'touchstart') {
                    e.preventDefault();
                }
                showContextMenu(e, theaterIndex);
            }, 500); // 500ms 触发长按
        };

        const endPress = () => {
            clearTimeout(longPressTimer);
        };
        
        card.addEventListener('mousedown', startPress);
        card.addEventListener('mouseup', endPress);
        card.addEventListener('mouseleave', endPress);
        card.addEventListener('touchstart', startPress, { passive: false });
        card.addEventListener('touchend', endPress);
        card.addEventListener('touchmove', endPress, { passive: true });
    });

    // 绑定菜单遮罩层的关闭事件
    contextMenuOverlay.addEventListener('click', (e) => {
        if (e.target === contextMenuOverlay) {
            hideContextMenu();
        }
    });

    // 绑定菜单项的点击事件
    contextMenu.addEventListener('click', async (e) => {
        const action = e.target.dataset.action;
        if (action === 'delete') {
            if (currentTheaterIndex !== null) {
                showCustomConfirm(`确定要删除小剧场 "${theaters[currentTheaterIndex].title}" 吗？`, async () => {
                    theaters.splice(currentTheaterIndex, 1);
                    await localforage.setItem('littleTheaters', JSON.stringify(theaters));
                    renderLittleTheaterPage(); // 重新渲染列表
                    showGlobalToast('删除成功', { type: 'success' });
                });
            }
        }
        hideContextMenu();
    });

    // === 新逻辑到这里结束 ===

    // === 新增：为悬浮按钮绑定点击事件 ===
    document.getElementById('little-theater-fab').addEventListener('click', openCreateTheaterPopup);
}
async function openCreateTheaterPopup() {
    const overlay = document.getElementById('create-theater-overlay');
    
    // 动态加载角色列表
    const archiveData = JSON.parse(await localforage.getItem('archiveData') || '{}');
    const characters = archiveData.characters || [];
    const charListContainer = document.getElementById('theater-character-list');
    
    if (characters.length > 0) {
        charListContainer.innerHTML = characters.map(char => `
            <div class="theater-character-item" data-char-id="${char.id}">
                <div class="theater-char-avatar" style="background-image: url('${char.avatar}');"></div>
                <span class="theater-char-name">${escapeHTML(char.name)}</span>
                <input type="checkbox" class="theater-char-checkbox" value="${char.id}">
            </div>
        `).join('');
    } else {
        charListContainer.innerHTML = '<span class="empty-text" style="padding: 30px 0; text-align: center;">暂无可用角色</span>';
    }

    overlay.classList.add('visible');

    // 为弹窗内的关闭和确认按钮绑定事件
    document.getElementById('cancel-create-theater').onclick = () => overlay.classList.remove('visible');
    
    // 为了防止多次绑定，先移除之前的事件监听器
    const confirmBtn = document.getElementById('confirm-create-theater');
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    newConfirmBtn.addEventListener('click', generateLittleTheater);

    // 为每个角色项（除了 checkbox 之外的区域）添加点击事件，以触发 checkbox 的选中/取消
    document.querySelectorAll('.theater-character-item').forEach(item => {
        item.addEventListener('click', e => {
            // 确保点击的不是 checkbox 本身，避免双重触发
            if (e.target.type !== 'checkbox') {
                const checkbox = item.querySelector('.theater-char-checkbox');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
            }
        });
    });
}

async function generateLittleTheater() {
    const theme = document.getElementById('theater-theme-textarea').value.trim();
    const selectedCheckboxes = document.querySelectorAll('.theater-char-checkbox:checked');
    const confirmBtn = document.getElementById('confirm-create-theater');

    if (!theme) {
        showCustomAlert('请输入小剧场主题。');
        return;
    }
    if (selectedCheckboxes.length === 0) {
        showCustomAlert('请至少选择一个角色。');
        return;
    }
    
    const originalBtnText = confirmBtn.textContent;
    confirmBtn.textContent = '生成中...';
    confirmBtn.disabled = true;

    try {
        // 1. 获取API设置
        const apiSettings = JSON.parse(await localforage.getItem('apiSettings') || '{}');
        if (!apiSettings.url || !apiSettings.key || !apiSettings.model) {
            throw new Error('API配置不完整，请先在设置中配置。');
        }

        // 2. 整理角色人设
        const archiveData = JSON.parse(await localforage.getItem('archiveData')) || { characters: [] };
        let actorsInfo = [];
        let actorsPersonaPrompt = '';

        for (const checkbox of selectedCheckboxes) {
            const charId = checkbox.value;
            const character = archiveData.characters.find(c => c.id === charId);
            if (character) {
                actorsInfo.push({ id: character.id, name: character.name, avatar: character.avatar });
                actorsPersonaPrompt += `\n- 角色：${character.name}\n- 人设：${character.persona}\n`;
            }
        }
        
        // 3. 构建核心提示词
        const littleTheaterPrompt = `你是一名专业的、富有创意的剧本杀（LARP）游戏主持人（GM）。你的任务是基于给定的主题和角色人设，创作一个引人入胜的“小剧场”片段。

【核心要求】
你必须使用HTML+CSS+JavaScript的交互界面模块来美化和排版输出内容，严格禁止使用纯文字。你的目标是让输出具有视觉吸引力、易于阅读，并能增强叙事氛围。

【格式化规则细节】
1.  **动态标题**：必须为小剧场生成一个概括内容的动态短语标题，并将其放入HTML中一个带有 \`class="theater-title"\` 的元素里。
2.  **多样化美化**：你可以自由选择最适合当前小剧场内容和风格的格式，例如：
    *   模仿电影字幕、剧本分镜。
    *   模拟社交平台（如小红书、论坛、朋友圈）的帖子或评论区。
    *   创建角色间的聊天对话界面（对话气泡、头像）。
    *   设计成报告摘要、新闻报道等形式。
    *   **配色建议**：请尽量使用明亮、清爽的浅色调（如白色、米白、淡灰）作为背景，避免使用大面积的深色或黑色背景，以保证良好的阅读体验。

    鼓励根据情节或情绪，使用不同的字体效果（粗体、斜体）、颜色、背景、边框等。
3.  **结构化输出**：
    *   所有输出内容必须包含在一个根 \`<div>\` 容器中。
    *   必须使用标准HTML标签（如\`<div>\`、\`<span>\`、\`<p>\`等）来包装所有文本，包括角色发言和动作描述，不得省略结构。
    *   模拟的页面类型不可省略或忽略（例如，如果是聊天界面，就要有聊天界面的结构）。
4.  **响应式设计**：
    *   所有配色和美化需兼顾移动端和PC端视觉体验。
    *   必须保证自适应屏宽、字号合适、对比度良好。
    *   生成的任何界面都不能在宽度上超出其容器。
    *   禁止插入任何外部图片链接 (\`<img>\` 标签)。

【本次创作任务】
- 小剧场主题：${theme}
- 参与角色及人设：${actorsPersonaPrompt}

请立即开始创作，直接输出完整的、可渲染的HTML代码片段。`;

        // 4. 调用API
        const response = await fetch(new URL('/v1/chat/completions', apiSettings.url).href, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiSettings.key}` },
            body: JSON.stringify({
                model: apiSettings.model,
                messages: [{ role: "user", content: littleTheaterPrompt }],
                temperature: apiSettings.temp || 0.8,
                stream: false
            })
        });

        if (!response.ok) throw new Error(`API 请求失败，状态: ${response.status}`);
        
        const result = await response.json();
        let htmlContent = '';

        if (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) {
            let rawContent = result.choices[0].message.content.trim();
            
            // 更健壮的清理逻辑：移除前后可能存在的Markdown代码块标记 (```...```)
            // 这个正则表达式会匹配开头的```后面可选的语言标识以及换行符，和结尾的```
            htmlContent = rawContent.replace(/^```[a-zA-Z]*\s*\n?/, '').replace(/\n?```\s*$/, '').trim();

            // 增加一个最终校验，防止内容清理后为空
            if (!htmlContent.startsWith('<')) {
                 // 如果清理后内容不是以HTML标签开头，可能AI返回了非HTML的说明文字
                 console.warn('AI返回内容可能不是有效的HTML片段:', htmlContent);
                 // 尝试从内容中提取第一个HTML标签之后的所有内容，作为最后的补救
                 const firstTagIndex = htmlContent.indexOf('<');
                 if (firstTagIndex !== -1) {
                    htmlContent = htmlContent.substring(firstTagIndex);
                 } else {
                    throw new Error('AI未能返回有效的HTML内容。');
                 }
            }

        } else {
            throw new Error('API未能返回有效的小剧场内容。');
        }

        // 从返回的HTML中提取标题
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const titleElement = tempDiv.querySelector('.theater-title');
        // 优化逻辑：确保即使标题元素存在但内容为空时，也使用默认标题
        const theaterTitle = (titleElement && titleElement.textContent.trim()) || '无题小剧场';

        // 5. 保存结果
        const theaters = JSON.parse(await localforage.getItem('littleTheaters') || '[]');
        theaters.unshift({
            id: 'theater_' + generateId(),
            title: theaterTitle,
            theme: theme,
            actors: actorsInfo,
            htmlContent: htmlContent,
            createdAt: new Date().toISOString()
        });
        await localforage.setItem('littleTheaters', JSON.stringify(theaters));

        // 6. 成功后处理
        document.getElementById('create-theater-overlay').classList.remove('visible');
        showGlobalToast('小剧场生成成功！', { type: 'success' });
        
        // 动态在列表顶部添加新的小剧场卡片
        const newTheater = theaters[0]; // theaters.unshift()后，新剧场在第一个
        const listContainer = document.getElementById('little-theater-list');
        
        const newCard = document.createElement('div');
        newCard.className = 'little-theater-card';
        newCard.dataset.theaterIndex = '0'; // 注意：这里需要后续更新其他卡片的index
        newCard.innerHTML = `
            <div class="little-theater-title">${escapeHTML(newTheater.title)}</div>
            <div class="little-theater-actors">
                ${newTheater.actors.map(actor => `
                    <div class="little-theater-actor-avatar" style="background-image: url('${actor.avatar}')"></div>
                `).join('')}
            </div>
        `;
        
        // 为新卡片添加点击事件
        newCard.addEventListener('click', () => {
             // 打开新视图显示HTML内容，并设置返回回调
             openModal(newTheater.title, `<div class="little-theater-detail-view">${newTheater.htmlContent}</div>`, () => {
                 // 返回时，重新渲染小剧场列表页
                 renderLittleTheaterPage();
             });
             // 进入详情页后隐藏FAB
             document.getElementById('little-theater-fab').classList.remove('visible');
        });

        if (listContainer) {
             // 如果列表已存在，直接在最前面插入
             listContainer.prepend(newCard);
             // 更新所有卡片的 data-theater-index，因为所有元素都向下移动了一位
             document.querySelectorAll('.little-theater-card').forEach((card, index) => {
                card.dataset.theaterIndex = index;
             });
        } else {
             // 如果列表不存在（之前是空的），则重新渲染整个内容
             renderLittleTheaterPage();
        }

        // 移除可能存在的“空列表”提示
        const emptyText = document.querySelector('.modal-content .empty-text');
        if (emptyText) {
            emptyText.remove();
        }

    } catch (error) {
        console.error('生成小剧场失败:', error);
        showCustomAlert(`生成失败: ${error.message}`);
    } finally {
        confirmBtn.textContent = originalBtnText;
        confirmBtn.disabled = false;
    }
}
