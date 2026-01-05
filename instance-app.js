/**
 * @file instance-app.js
 * @description 副本App的专属逻辑文件
 */

/**
 * 打开并初始化副本App的基础设置悬浮窗。
 */
// =============================================
// === 新增：副本App - 数据管理与核心渲染逻辑 ===
// =============================================
let instanceData = [];

// 加载副本数据
function loadInstanceData() {
    instanceData = JSON.parse(localStorage.getItem('instanceData')) || [];
}

// 保存副本数据
function saveInstanceData() {
    localStorage.setItem('instanceData', JSON.stringify(instanceData));
}

/**
 * 新增：将包含简单Markdown的文本安全地渲染为HTML。
 * 支持：粗体、斜体、粗斜体、删除线。
 * @param {string} text - 需要渲染的文本.
 * @returns {string} - 转换后的HTML字符串.
 */
function renderMarkdown(text) {
    if (typeof text !== 'string' || !text) return '';

    // 1. 先转义HTML特殊字符，防止XSS攻击
    let safeText = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // 2. 将Markdown语法转换为HTML标签。
    // 注意：转换顺序很重要，需要从最复杂（最长）的模式开始匹配。

    // ***粗斜体*** -> <strong><em>粗斜体</em></strong>
    safeText = safeText.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');

    // **粗体** -> <strong>粗体</strong>
    safeText = safeText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // *斜体* 或 _斜体_ -> <em>斜体</em>
    safeText = safeText.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');

    // ~~删除线~~ -> <del>删除线</del>
    safeText = safeText.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    // 3. 将换行符转换为<br>
    safeText = safeText.replace(/\n/g, '<br>');

    return safeText;
}
async function getAICompletion(prompt, stream = false) {
    const apiSettings = JSON.parse(localStorage.getItem('apiSettings')) || {};
    if (!apiSettings.url || !apiSettings.key || !apiSettings.model) {
        showCustomAlert('请先在全局API设置中配置有效的 API URL, Key 和 Model！');
        return null;
    }
    try {
        const response = await fetch(new URL('/v1/chat/completions', apiSettings.url).href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiSettings.key}`
            },
            body: JSON.stringify({
                model: apiSettings.model,
                messages: [{ role: 'user', content: prompt }],
                temperature: parseFloat(apiSettings.temp || 0.7),
                stream: stream
            })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(`API 请求失败! 状态: ${response.status}. ${errorData?.error?.message || ''}`);
        }
        
        if (stream) {
            // 流式处理（暂未用于此功能）
            return response.body;
        } else {
            // 非流式处理
            const result = await response.json();
            return result.choices[0].message.content.trim();
        }
    } catch (error) {
        console.error("AI Completion Error:", error);
        showCustomAlert(`AI调用失败: ${error.message}`);
        return null;
    }
}
// 渲染副本列表
function renderInstanceList() {
    loadInstanceData();
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = '<div id="instance-list-container"></div>';
    const container = document.getElementById('instance-list-container');

    if (instanceData.length === 0) {
        container.innerHTML = `<span class="empty-text" style="text-align:center; display:block; padding: 40px 0;">空空如也，点击右上角菜单中的“创建副本”来添加第一个副本吧。</span>`;
        return;
    }

    instanceData.forEach(instance => {
        const card = document.createElement('div');
        card.className = 'instance-card';
        card.style.backgroundImage = `url(${instance.coverImage || ''})`;
        card.dataset.id = instance.id;
        card.innerHTML = `<h3 class="instance-card-title">${escapeHTML(instance.title)}</h3>`;
        
        card.addEventListener('click', () => showInstanceDetails(instance.id));
        container.appendChild(card);
    });
}

// 显示副本详情
function showInstanceDetails(instanceId) {
    const instance = instanceData.find(inst => inst.id === instanceId);
    if (!instance) return;

    const overlay = document.getElementById('instance-popup-overlay');
    const popupBox = document.getElementById('instance-popup-box');
    const titleEl = document.getElementById('instance-popup-title');
    const bodyEl = document.getElementById('instance-popup-body');
    const footerEl = document.getElementById('instance-popup-footer');

    // 添加详情页专属class
    popupBox.classList.add('instance-detail-view');
    footerEl.classList.add('detail-footer');
    titleEl.style.display = 'none'; // 隐藏默认标题

    bodyEl.innerHTML = `
        <div class="instance-detail-cover" style="background-image: url('${instance.coverImage || ''}');"></div>
        <div class="instance-detail-body">
            <h3 class="instance-detail-main-title">${escapeHTML(instance.title)}</h3>
            <div class="modal-form-section">
                <div class="modal-form-group">
                    <label>简介</label>
                    <pre class="modal-input" style="min-height: 80px; height: auto; white-space: pre-wrap; word-wrap: break-word; background: transparent; border: none; padding-left: 0;">${escapeHTML(instance.intro)}</pre>
                </div>
                <div class="modal-form-group">
                    <label>开场白</label>
                    <pre class="modal-input" style="min-height: 120px; height: auto; white-space: pre-wrap; word-wrap: break-word; background: transparent; border: none; padding-left: 0;">${escapeHTML(instance.openingMonologue)}</pre>
                </div>
            </div>
        </div>
    `;

    footerEl.innerHTML = `
        <button id="delete-instance-btn" class="instance-delete-btn" title="删除此副本">
            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
        </button>
        <button id="enter-instance-btn" class="modal-button">进入副本</button>
    `;

    overlay.classList.add('visible');

    // --- 绑定事件 ---
    
    // 点击外部关闭
    const closeHandler = (e) => {
        if (e.target === overlay) {
            popupBox.classList.remove('instance-detail-view'); // 移除专属class
            footerEl.classList.remove('detail-footer');
            titleEl.style.display = 'block'; // 恢复默认标题
            overlay.classList.remove('visible');
            overlay.removeEventListener('click', closeHandler);
        }
    };
    overlay.addEventListener('click', closeHandler);

    // 删除按钮
    document.getElementById('delete-instance-btn').addEventListener('click', () => {
        showCustomConfirm(`确定要永久删除副本 "${instance.title}" 吗？此操作无法撤销。`, () => {
            instanceData = instanceData.filter(inst => inst.id !== instanceId);
            saveInstanceData();
            overlay.dispatchEvent(new Event('click')); // 模拟点击外部来关闭
            renderInstanceList();
            showGlobalToast('副本已删除', { type: 'success' });
        });
    });

    // 进入副本按钮
    document.getElementById('enter-instance-btn').addEventListener('click', () => {
        // 新增：检查是否存在此副本的活动会话
        const activeSession = JSON.parse(localStorage.getItem('activeInstanceSession'));
        if (activeSession && activeSession.instanceId === instance.id) {
            // 如果存在且匹配，直接恢复会话并进入聊天界面
            showGlobalToast('正在恢复副本进度...', { type: 'info', duration: 1500 });
            setTimeout(() => {
                startInstanceSession(instance); // 直接调用启动函数，它会自动加载已有会话
            }, 300);
        } else {
            // 如果不存在或不匹配，才打开角色选择悬浮窗
            openEnterInstancePopup(instance);
        }
    });
}


// 打开创建副本的悬浮窗
function openCreateInstanceModal() {
    const overlay = document.getElementById('instance-popup-overlay');
    const titleEl = document.getElementById('instance-popup-title');
    const bodyEl = document.getElementById('instance-popup-body');
    const footerEl = document.getElementById('instance-popup-footer');
    
    titleEl.textContent = '创建新副本';
    
    let tempCoverImageData = ''; // 临时存储封面图片

    bodyEl.innerHTML = `
        <div class="modal-form-section" style="gap: 16px;">
            <div class="instance-form-cover-preview" id="instance-cover-setter">
                <span>点击上传封面</span>
            </div>
            <input type="file" id="instance-cover-upload" accept="image/*" hidden>

            <div class="modal-form-group">
                <label for="instance-title-input">副本标题</label>
                <input type="text" id="instance-title-input" class="modal-input" placeholder="输入副本的响亮名号">
            </div>
            <div class="modal-form-group">
                <label for="instance-intro-textarea">简介</label>
                <textarea id="instance-intro-textarea" class="modal-input" rows="3" placeholder="简要描述副本的背景和目标"></textarea>
            </div>
            <div class="modal-form-group">
                <label for="instance-opening-textarea">开场白</label>
                <textarea id="instance-opening-textarea" class="modal-input" rows="5" placeholder="玩家进入副本时看到的第一段话"></textarea>
            </div>

            <div class="ai-generation-section">
                <div class="modal-form-group">
                    <label for="ai-theme-input">AI 自动生成</label>
                    <input type="text" id="ai-theme-input" class="modal-input" placeholder="输入大致主题，如“末日废土、寻找水源”">
                </div>
                <div class="button-container" style="margin-top: 10px;">
                    <button id="ai-generate-instance-btn" class="modal-button secondary">让AI来写</button>
                </div>
            </div>
        </div>
    `;

    footerEl.innerHTML = `
        <button id="cancel-create-instance-btn" class="modal-button secondary">取消</button>
        <button id="save-create-instance-btn" class="modal-button">保存副本</button>
    `;

    overlay.classList.add('visible');

    // --- 绑定内部事件 ---
    const coverSetter = document.getElementById('instance-cover-setter');
    const coverUpload = document.getElementById('instance-cover-upload');
    
    coverSetter.addEventListener('click', () => coverUpload.click());
    coverUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                tempCoverImageData = event.target.result;
                coverSetter.style.backgroundImage = `url('${tempCoverImageData}')`;
                coverSetter.querySelector('span').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });
    
    document.getElementById('ai-generate-instance-btn').addEventListener('click', async () => {
        const theme = document.getElementById('ai-theme-input').value.trim();
        if (!theme) {
            showCustomAlert("请输入一个主题，AI才能开始创作哦！");
            return;
        }

        const btn = document.getElementById('ai-generate-instance-btn');
        btn.textContent = 'AI创作中...';
        btn.disabled = true;

        const prompt = `请你为我创作一个基于主题“${theme}”的副本设定。请严格按照以下格式返回，不要包含任何多余的解释或说明：
[TITLE]
一个吸引人的副本标题
[INTRO]
一段引人入胜的副本简介，大约50-100字。
[OPENING]
一段充满悬念或代入感的开场白，作为玩家进入副本看到的第一段话，大约100-150字。`;

        const response = await getAICompletion(prompt, false);
        
        btn.textContent = '让AI来写';
        btn.disabled = false;

        if (response) {
            // 解析AI返回的内容
            const titleMatch = response.match(/\[TITLE\]\s*([\s\S]*?)\s*\[INTRO\]/);
            const introMatch = response.match(/\[INTRO\]\s*([\s\S]*?)\s*\[OPENING\]/);
            const openingMatch = response.match(/\[OPENING\]\s*([\s\S]*)/);

            const title = titleMatch ? titleMatch[1].trim() : '';
            const intro = introMatch ? introMatch[1].trim() : '';
            const opening = openingMatch ? openingMatch[1].trim() : '';

            if (title || intro || opening) {
                document.getElementById('instance-title-input').value = title;
                document.getElementById('instance-intro-textarea').value = intro;
                document.getElementById('instance-opening-textarea').value = opening;
                showGlobalToast('AI创作完成！', { type: 'success' });
            } else {
                showCustomAlert('AI返回的内容格式不正确，无法自动填充。请检查API或稍后重试。');
            }
        }
    });

    // 保存按钮
    const saveBtn = document.getElementById('save-create-instance-btn');
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
    newSaveBtn.addEventListener('click', () => {
        const newInstance = {
            id: 'instance_' + generateId(),
            title: document.getElementById('instance-title-input').value.trim(),
            coverImage: tempCoverImageData,
            intro: document.getElementById('instance-intro-textarea').value.trim(),
            openingMonologue: document.getElementById('instance-opening-textarea').value.trim()
        };

        if (!newInstance.title) {
            showCustomAlert('副本标题不能为空！');
            return;
        }

        instanceData.unshift(newInstance); // 添加到数组开头
        saveInstanceData();
        overlay.classList.remove('visible'); // 关闭悬浮窗
        renderInstanceList(); // 刷新主界面
        showGlobalToast('新副本创建成功！', { type: 'success' });
    });

    // 取消按钮
    const cancelBtn = document.getElementById('cancel-create-instance-btn');
    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    newCancelBtn.addEventListener('click', () => overlay.classList.remove('visible'));
}


function openInstanceBaseSettingsPopup() {
    const overlay = document.getElementById('instance-base-settings-overlay');
    const body = document.getElementById('instance-base-settings-body');

    if (!overlay || !body) {
        console.error('无法找到基础设置悬浮窗的必要元素。');
        return;
    }

    // 1. 构建悬浮窗的内部HTML结构
    body.innerHTML = `
        <div class="instance-settings-section">
            <h5>API 预设</h5>
            <p style="font-size: 12px; opacity: 0.6; margin: -5px 0 5px 0;">选择此副本对话时使用的API配置。留空则使用全局API设置。</p>
            <select id="instance-api-preset-select" class="modal-select"></select>
        </div>
        <div class="instance-settings-section">
            <h5>提示词预设</h5>
            <!-- 操作按钮 -->
            <div class="preset-controls" style="grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <button id="import-prompt-preset-btn" class="modal-button secondary">导入预设</button>
                <button id="add-prompt-preset-btn" class="modal-button secondary">新建预设</button>
                <input type="file" id="prompt-preset-import-input" accept=".json" hidden>
            </div>
            <!-- 预设选择和管理 -->
            <div class="preset-controls" style="grid-template-columns: 1fr auto auto; margin-bottom: 15px;">
                <select id="prompt-preset-select" class="modal-select"></select>
                <button id="delete-prompt-preset-btn" class="modal-button danger">删除</button>
            </div>
            <!-- 预设条目列表 -->
            <div id="prompt-preset-items-container" class="prompt-preset-list">
                <span class="empty-text">选择或导入一个预设以开始。</span>
            </div>
             <!-- 添加新条目按钮 -->
            <button id="add-prompt-entry-btn" class="modal-button secondary add-prompt-entry-btn" style="display: none;">+ 添加条目</button>
        </div>
        <div class="instance-settings-section">
            <h5>上下文记忆读取与总结</h5>
            <div class="placeholder-section-content">此功能待开发</div>
        </div>
    `;

    // 2. 填充API预设下拉框
    const selectEl = document.getElementById('instance-api-preset-select');
    const apiPresets = JSON.parse(localStorage.getItem('apiPresets')) || {};
    
    // 添加一个默认选项
    selectEl.innerHTML = '<option value="">-- 使用全局API设置 --</option>';
    
    for (const name in apiPresets) {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        selectEl.appendChild(option);
    }

    // 3. 加载并应用当前副本的设置
    const instanceSettings = JSON.parse(localStorage.getItem('instanceAppSettings')) || {};
    selectEl.value = instanceSettings.apiPreset || ""; // 如果没有设置，则选中默认项

    // 4. 初始化提示词预设管理器
    promptPresetManager.init(body);

    // 5. 显示悬浮窗
    overlay.classList.add('visible');
}


/**
 * 当副本App图标被点击时触发此函数。
 * 它会构建App的界面内容，在头部添加设置按钮，并调用主文件中定义的 openModal 函数来显示。
 * @param {MouseEvent} event - 点击事件对象，用于获取点击的元素以实现动画效果。
 */
function openInstanceApp(event) {
    // 打开主模态框，初始内容为空，由 renderInstanceList 填充
    openModal('副本', '', event.currentTarget);

    // 渲染副本列表
    renderInstanceList();

    // 异步添加头部设置按钮，确保模态框渲染完毕
    setTimeout(() => {
        const modalHeader = document.getElementById('modal-header');
        // 如果已存在，则确保其可见
        let controlsContainer = document.getElementById('instance-app-header-controls');
        if (controlsContainer) {
            controlsContainer.style.display = 'block';
        } else {
             // 如果不存在，则创建
            controlsContainer = document.createElement('div');
            controlsContainer.id = 'instance-app-header-controls';
            const settingsBtn = document.createElement('button');
            settingsBtn.id = 'instance-settings-btn';
            settingsBtn.title = '副本设置';
            settingsBtn.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                </svg>
            `;
            controlsContainer.appendChild(settingsBtn);
            modalHeader.appendChild(controlsContainer);
        }
    }, 0);

    // 绑定返回按钮事件，确保点击返回时关闭整个模态框
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const newCloseBtn = modalCloseBtn.cloneNode(true);
    modalCloseBtn.parentNode.replaceChild(newCloseBtn, modalCloseBtn);
    newCloseBtn.addEventListener('click', () => closeModal());
}

/**
 * 初始化副本App，为其图标绑定点击事件，并设置所有相关的交互逻辑。
 */
function initializeInstanceApp() {
    const instanceAppIcon = document.getElementById('app-instance');
    if (instanceAppIcon) {
        instanceAppIcon.addEventListener('click', openInstanceApp);
    }

    // 侧边栏交互
    const sidebar = document.getElementById('instance-settings-sidebar');
    const overlay = document.getElementById('instance-settings-sidebar-overlay');
    if (!sidebar || !overlay) return;

    const showSidebar = () => {
        sidebar.classList.add('visible');
        overlay.classList.add('visible');
    };
    const hideSidebar = () => {
        sidebar.classList.remove('visible');
        overlay.classList.remove('visible');
    };

    document.addEventListener('click', function(e) {
        if (e.target.closest('#instance-settings-btn')) {
            sidebar.classList.contains('visible') ? hideSidebar() : showSidebar();
        } else if (e.target.id === 'instance-settings-sidebar-overlay') {
            hideSidebar();
        }
    });

    sidebar.addEventListener('click', function(e) {
        const button = e.target.closest('.instance-sidebar-btn');
        if (!button) return;

        const buttonTitle = button.title;
        hideSidebar(); // 点击后先关闭侧边栏

        // **核心修改：根据点击的按钮执行不同操作**
        if (buttonTitle === '基础设置') {
            // 使用 setTimeout 确保侧边栏关闭动画完成后再打开新弹窗，避免视觉冲突
            setTimeout(() => {
                openInstanceBaseSettingsPopup();
            }, 300);
        } else if (buttonTitle === '创建副本') {
            setTimeout(() => {
                openCreateInstanceModal();
            }, 300);
        } else if (buttonTitle === 'NPC库') { // 新增分支
             setTimeout(() => {
                openInstanceNpcLibrary();
            }, 300);
        } else {
            // 其他按钮暂时保持原样
            showCustomAlert(`你点击了副本设置的 "${buttonTitle}" 按钮。`);
        }
    });

    // 基础设置悬浮窗的事件绑定
    const settingsOverlay = document.getElementById('instance-base-settings-overlay');
    const saveBtn = document.getElementById('save-instance-base-settings-btn');
    const closeBtn = document.getElementById('close-instance-base-settings-btn');

    if (!settingsOverlay || !saveBtn || !closeBtn) return;

    const closeSettingsPopup = () => settingsOverlay.classList.remove('visible');

    closeBtn.addEventListener('click', closeSettingsPopup);
    settingsOverlay.addEventListener('click', (e) => {
        if (e.target === settingsOverlay) {
            closeSettingsPopup();
        }
    });

    saveBtn.addEventListener('click', () => {
        const selectedPreset = document.getElementById('instance-api-preset-select').value;
        const settings = JSON.parse(localStorage.getItem('instanceAppSettings')) || {};
        settings.apiPreset = selectedPreset;
        localStorage.setItem('instanceAppSettings', JSON.stringify(settings));
        
        showGlobalToast('副本API预设已保存！', { type: 'success' });
        closeSettingsPopup();
    });
}

// 确保在主页面DOM加载完毕后执行初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInstanceApp);
} else {
    initializeInstanceApp();
}
// =============================================
// === 新增：副本App - NPC库功能核心逻辑 ===
// =============================================

const instanceNpcFab = document.getElementById('instance-npc-fab');
let instanceNpcData = [];

// 加载NPC数据
function loadInstanceNpcData() {
    instanceNpcData = JSON.parse(localStorage.getItem('instanceNpcData')) || [];
}

// 保存NPC数据
function saveInstanceNpcData() {
    localStorage.setItem('instanceNpcData', JSON.stringify(instanceNpcData));
}

// 渲染NPC列表
function renderNpcList() {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = ''; // 清空内容
    loadInstanceNpcData();

    if (instanceNpcData.length === 0) {
        modalBody.innerHTML = `<span class="empty-text" style="text-align:center; display:block; padding: 40px 0;">NPC库是空的，点击右下角加号添加第一个NPC吧。</span>`;
        return;
    }

    const container = document.createElement('div');
    container.className = 'npc-grid-container';

    instanceNpcData.forEach(npc => {
        const card = document.createElement('div');
        card.className = 'npc-card';
        card.dataset.id = npc.id;
        card.innerHTML = `
            <div class="card-avatar" style="background-image: url('${npc.avatar || ''}');"></div>
            <div class="card-info">
                <div class="name">${escapeHTML(npc.name)}</div>
            </div>
        `;
        card.addEventListener('click', () => openNpcDetailModal(npc.id));
        container.appendChild(card);
    });

    modalBody.appendChild(container);
}

// 打开NPC库主界面
function openInstanceNpcLibrary() {
    // 复用通用模态框
    openModal('NPC库', '', null); // 内部导航不需要动画元素
    renderNpcList();
    instanceNpcFab.classList.add('visible');

    // 1. 隐藏副本App主界面的设置按钮
    const headerControls = document.getElementById('instance-app-header-controls');
    if (headerControls) {
        headerControls.style.display = 'none';
    }
    
    // 2. 覆盖主返回按钮的逻辑，使其返回到副本App主界面
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const newCloseBtn = modalCloseBtn.cloneNode(true);
    modalCloseBtn.parentNode.replaceChild(newCloseBtn, modalCloseBtn);

    newCloseBtn.addEventListener('click', () => {
        // 返回副本App主界面的逻辑
        const mainModalTitle = document.getElementById('modal-title');
        mainModalTitle.textContent = '副本';
        renderInstanceList(); // 重新渲染主列表

        // 恢复副本App的UI状态
        if (headerControls) {
            headerControls.style.display = 'block';
        }
        instanceNpcFab.classList.remove('visible');
        
        // 再次绑定返回按钮，使其具有“退出副本App”的功能
        const finalCloseBtn = newCloseBtn.cloneNode(true);
        newCloseBtn.parentNode.replaceChild(finalCloseBtn, newCloseBtn);
        finalCloseBtn.addEventListener('click', () => closeModal());
    });
}

// 打开NPC详情模态框
function openNpcDetailModal(npcId) {
    const npc = instanceNpcData.find(n => n.id === npcId);
    if (!npc) return;

    // 复用档案详情模态框的UI
    const detailOverlay = document.getElementById('archive-modal-overlay');
    const detailContent = document.getElementById('archive-detail-content');

    instanceNpcFab.classList.remove('visible'); // 隐藏主界面的FAB

    const editIconSVG = `<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`;
    const editButtonHTML = `<button class="edit-char-btn" data-action="edit-npc" data-id="${npc.id}">${editIconSVG}</button>`;
    
    const contentHTML = `
        <div class="profile-detail-content npc-detail-content">
            <div class="profile-detail-header-section">
                <div class="profile-detail-avatar-large" style="background-image: url('${npc.avatar || ''}');"></div>
                <div class="profile-detail-basic-info-display">
                    <span class="name">${escapeHTML(npc.name)} ${editButtonHTML}</span>
                </div>
            </div>
            <div class="profile-detail-extended-info-display">
                <div class="field-group">
                    <label>人设:</label>
                    <span style="white-space: pre-wrap;">${escapeHTML(npc.persona || '暂无')}</span>
                </div>
            </div>
        </div>
    `;

    detailContent.innerHTML = contentHTML;
    detailOverlay.classList.add('visible');

    // 绑定关闭和编辑按钮事件
    const closeDetailBtn = document.getElementById('archive-detail-close-btn');
    const newCloseBtn = closeDetailBtn.cloneNode(true);
    closeDetailBtn.parentNode.replaceChild(newCloseBtn, closeDetailBtn);
    newCloseBtn.addEventListener('click', () => {
        detailOverlay.classList.remove('visible');
        instanceNpcFab.classList.add('visible'); // 重新显示主界面的FAB
    });

    detailContent.querySelector('[data-action="edit-npc"]').addEventListener('click', () => {
        // 先关闭详情弹窗，再打开编辑弹窗
        detailOverlay.classList.remove('visible');
        openNpcEditForm(npcId);
    });
}

// 打开NPC添加/编辑表单
function openNpcEditForm(npcId = null) {
    const isNew = npcId === null;
    const npc = isNew ? { id: null, avatar: '', name: '', persona: '' } : instanceNpcData.find(n => n.id === npcId);
    if (!npc) return;

    const detailOverlay = document.getElementById('archive-modal-overlay');
    const detailContent = document.getElementById('archive-detail-content');

    instanceNpcFab.classList.remove('visible');

    const title = isNew ? '添加新NPC' : '编辑NPC档案';

    const contentHTML = `
        <div class="profile-detail-content profile-edit-form">
            <h4 style="text-align: center; margin-bottom: 20px;">${title}</h4>
            <div class="modal-form-group">
                <label>立绘头像 (点击更换)</label>
                <div id="npc-edit-avatar-preview" class="profile-detail-avatar-large" style="margin: 0 auto; background-image: url('${npc.avatar || ''}'); cursor: pointer;"></div>
                <input type="file" id="npc-edit-avatar-upload" accept="image/*" hidden>
            </div>
            <div class="modal-form-group">
                <label for="npc-edit-name">姓名</label>
                <input type="text" id="npc-edit-name" class="modal-input" value="${escapeHTML(npc.name)}">
            </div>
            <div class="modal-form-group">
                <label for="npc-edit-persona">人设</label>
                <textarea id="npc-edit-persona" class="modal-input npc-persona-textarea">${escapeHTML(npc.persona)}</textarea>
            </div>
            <div class="button-container">
                <button id="save-npc-btn" class="modal-button">保存</button>
            </div>
        </div>
    `;

    detailContent.innerHTML = contentHTML;
    detailOverlay.classList.add('visible');

    let tempAvatarData = npc.avatar || '';

    // 绑定头像上传
    const avatarPreview = document.getElementById('npc-edit-avatar-preview');
    const avatarUpload = document.getElementById('npc-edit-avatar-upload');
    avatarPreview.addEventListener('click', () => avatarUpload.click());
    avatarUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                tempAvatarData = event.target.result;
                avatarPreview.style.backgroundImage = `url('${tempAvatarData}')`;
            };
            reader.readAsDataURL(file);
        }
    });

    // 绑定保存按钮
    document.getElementById('save-npc-btn').addEventListener('click', () => {
        const name = document.getElementById('npc-edit-name').value.trim();
        if (!name) {
            showCustomAlert('NPC姓名不能为空！');
            return;
        }
        
        const updatedNpc = {
            id: isNew ? 'npc_' + generateId() : npcId,
            avatar: tempAvatarData,
            name: name,
            persona: document.getElementById('npc-edit-persona').value.trim()
        };

        if (isNew) {
            instanceNpcData.unshift(updatedNpc);
        } else {
            const index = instanceNpcData.findIndex(n => n.id === npcId);
            if (index !== -1) {
                instanceNpcData[index] = updatedNpc;
            }
        }
        
        saveInstanceNpcData();
        detailOverlay.classList.remove('visible'); // 关闭编辑/添加弹窗
        renderNpcList(); // 刷新主列表
        instanceNpcFab.classList.add('visible'); // 重新显示主FAB
        showGlobalToast(isNew ? 'NPC添加成功！' : 'NPC信息已更新！', { type: 'success' });
    });

    // 绑定关闭按钮
    const closeDetailBtn = document.getElementById('archive-detail-close-btn');
    const newCloseBtn = closeDetailBtn.cloneNode(true);
    closeDetailBtn.parentNode.replaceChild(newCloseBtn, closeDetailBtn);
    newCloseBtn.addEventListener('click', () => {
        detailOverlay.classList.remove('visible');
        instanceNpcFab.classList.add('visible');
    });
}

// 绑定主FAB点击事件，打开添加表单
instanceNpcFab.addEventListener('click', () => openNpcEditForm(null));

// 加载时，先读取一次数据到内存
loadInstanceNpcData();
/**
 * =============================================
 * === 新增：进入副本确认悬浮窗核心逻辑 ===
 * =============================================
 */

/**
 * 打开进入副本前的准备悬浮窗
 * @param {object} instance - 当前副本的完整数据对象
 */
function openEnterInstancePopup(instance) {
    const overlay = document.getElementById('enter-instance-overlay');
    const titleEl = document.getElementById('enter-instance-title');
    const bodyEl = document.getElementById('enter-instance-body');
    const closeBtn = document.getElementById('close-enter-instance-btn');

    if (!overlay || !bodyEl || !instance) return;

    titleEl.textContent = `进入副本：${instance.title}`;

    // --- 1. 加载并渲染角色（Char）列表 ---
    // 从 localStorage 加载档案数据
    const archiveData = JSON.parse(localStorage.getItem('archiveData')) || { characters: [] };
    const availableChars = archiveData.characters.filter(char => char.id !== 'user'); // 排除 user

    const charSectionHTML = `
        <div class="selection-section">
            <h5>添加角色 (Char)</h5>
            ${availableChars.length > 0 ? `
                <div class="selection-grid">
                    ${availableChars.map(char => `
                        <label class="selection-card">
                            <input type="checkbox" name="selected-chars" value="${char.id}">
                            <div class="card-avatar" style="background-image: url('${char.avatar}')"></div>
                            <div class="card-name">${escapeHTML(char.name)}</div>
                        </label>
                    `).join('')}
                </div>
            ` : '<span class="empty-text">档案库中暂无可用角色。</span>'}
        </div>
    `;

    // --- 2. 加载并渲染 NPC 列表 ---
    loadInstanceNpcData(); // 确保 NPC 数据已加载到 instanceNpcData
    
    const npcSectionHTML = `
        <div class="selection-section">
            <h5>添加NPC (可选)</h5>
            ${instanceNpcData.length > 0 ? `
                <div class="selection-grid">
                     ${instanceNpcData.map(npc => `
                        <label class="selection-card">
                            <input type="checkbox" name="selected-npcs" value="${npc.id}">
                            <div class="card-avatar" style="background-image: url('${npc.avatar}')"></div>
                            <div class="card-name">${escapeHTML(npc.name)}</div>
                        </label>
                    `).join('')}
                </div>
            ` : '<span class="empty-text">NPC库为空。</span>'}
        </div>
    `;
    
    bodyEl.innerHTML = charSectionHTML + npcSectionHTML;

    // --- 3. 显示悬浮窗并绑定事件 ---
    overlay.classList.add('visible');

    const closePopup = () => {
        overlay.classList.remove('visible');
    };
    
    // 使用克隆节点法确保关闭按钮事件只绑定一次
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    newCloseBtn.addEventListener('click', closePopup);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePopup();
        }
    });

    // --- 4. 绑定长按确认按钮的动画逻辑 ---
    const confirmWrapper = document.getElementById('confirm-entry-button-wrapper');
    const confirmBtn = document.getElementById('confirm-entry-button');
    let pressTimer = null;

    const startPress = (e) => {
        e.preventDefault(); // 阻止默认行为，如移动端长按弹出菜单
        
        // 已经按下了，直接返回
        if (pressTimer !== null) return;

        confirmWrapper.classList.add('holding');
        
        pressTimer = setTimeout(() => {
            // 5秒倒计时结束
            console.log("进入副本确认！");
            
            // 收集选中的角色和NPC
            const selectedChars = Array.from(document.querySelectorAll('input[name="selected-chars"]:checked')).map(cb => cb.value);
            const selectedNpcs = Array.from(document.querySelectorAll('input[name="selected-npcs"]:checked')).map(cb => cb.value);

            console.log('选择的角色ID:', selectedChars);
            console.log('选择的NPC ID:', selectedNpcs);

            // 关闭当前悬浮窗
            closePopup();
            
            // 新增：调用新函数来启动或恢复副本会话
            showGlobalToast('正在载入副本...', { type: 'info', duration: 1500 });
            setTimeout(() => {
                startInstanceSession(instance, selectedChars, selectedNpcs);
            }, 300); // 延迟一点，让弹窗关闭动画更平滑

        }, 5000); // 5秒
    };

    const cancelPress = () => {
        clearTimeout(pressTimer);
        pressTimer = null;
        confirmWrapper.classList.remove('holding');
    };
    
    // 绑定事件
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.addEventListener('mousedown', startPress);
    newConfirmBtn.addEventListener('touchstart', startPress, { passive: false });

    newConfirmBtn.addEventListener('mouseup', cancelPress);
    newConfirmBtn.addEventListener('mouseleave', cancelPress);
    newConfirmBtn.addEventListener('touchend', cancelPress);
    newConfirmBtn.addEventListener('touchcancel', cancelPress);
}
/**
 * =============================================
 * === 新增：副本聊天界面核心逻辑 ===
 * =============================================
 */

let instanceIsApiReplying = false;
let instanceAbortController = null;

/**
 * 启动或恢复一个副本会话
 * @param {object} instance - 副本数据对象
 * @param {Array<string>} [selectedCharIds=[]] - (仅新建时) 选中的角色ID数组
 * @param {Array<string>} [selectedNpcIds=[]] - (仅新建时) 选中的NPC ID数组
 */
function startInstanceSession(instance, selectedCharIds = [], selectedNpcIds = []) {
    let session = JSON.parse(localStorage.getItem('activeInstanceSession'));

    // 如果没有活动的会话，或者活动的会话不是当前副本的，则创建一个新的
    if (!session || session.instanceId !== instance.id) {
        session = {
            instanceId: instance.id,
            instanceTitle: instance.title, // 缓存标题，方便显示
            charIds: selectedCharIds,
            npcIds: selectedNpcIds,
            messages: [
                // 自动发送开场白
                {
                    id: 'instance_msg_' + generateId(),
                    text: instance.openingMonologue,
                    sender: 'them', // 'them' 代表DM/AI
                    timestamp: Date.now()
                }
            ],
            chatBackground: '' // 新增：初始化背景字段
        };
    }

    localStorage.setItem('activeInstanceSession', JSON.stringify(session));

    // 新增：应用背景图
    const wallpaperEl = document.getElementById('instance-chat-wallpaper');
    if (wallpaperEl) {
        wallpaperEl.style.backgroundImage = `url('${session.chatBackground || ''}')`;
    }

    renderInstanceChatUI(session); // 渲染UI
    document.getElementById('instance-chat-container').classList.add('visible');
}

/**
 * 渲染副本聊天UI
 * @param {object} session - 当前的副本会话数据
 */
function renderInstanceChatUI(session) {
    const titleEl = document.getElementById('instance-chat-title');
    const messagesContainer = document.getElementById('instance-chat-messages');
    const backBtn = document.getElementById('instance-chat-back-btn');
    const input = document.getElementById('instance-chat-input');
    const sendBtn = document.getElementById('instance-send-btn');
    const apiReplyBtn = document.getElementById('instance-api-reply-btn');
    const apiReplyIconDefault = document.getElementById('instance-api-reply-icon-default');
    const apiReplyIconStop = document.getElementById('instance-api-reply-icon-stop');

    titleEl.textContent = session.instanceTitle;

    // 渲染消息
    messagesContainer.innerHTML = session.messages.map(msg => {
        // AI回复时的加载动画单独处理
        if (msg.type === 'loading') {
            return `
                <div class="instance-message-line">
                    <div class="instance-chat-bubble loading">
                        <div class="loading-dots"><span></span><span></span><span></span></div>
                    </div>
                </div>
            `;
        }
        // 新增：为每个气泡添加唯一的ID，方便JS后续直接操作
        return `
            <div class="instance-message-line">
                <div id="instance-msg-bubble-${msg.id}" class="instance-chat-bubble" style="align-self: ${msg.sender === 'me' ? 'flex-end' : 'flex-start'};">
                    ${renderMarkdown(msg.text.trim())}
                </div>
            </div>
        `;
    }).join('');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // 更新AI回复按钮状态
    if (instanceIsApiReplying) {
        apiReplyIconDefault.style.display = 'none';
        apiReplyIconStop.style.display = 'block';
        apiReplyBtn.title = '停止生成';
    } else {
        apiReplyIconDefault.style.display = 'block';
        apiReplyIconStop.style.display = 'none';
        apiReplyBtn.title = '让AI继续';
    }
    // --- 新增：为“重回”按钮绑定事件 ---
    const redoBtn = document.querySelector('#instance-chat-toolbar .instance-toolbar-btn[title="重回"]');
    if (redoBtn) {
        const newRedoBtn = redoBtn.cloneNode(true);
        redoBtn.parentNode.replaceChild(newRedoBtn, redoBtn);
        newRedoBtn.addEventListener('click', () => {
            if (instanceIsApiReplying) {
                showCustomAlert('AI正在回复中，请稍后重试。');
                return;
            }

            // 找到最后一轮对话（用户的最后一次输入和AI的所有连续回复）
            let lastUserIndex = -1;
            for (let i = session.messages.length - 1; i >= 0; i--) {
                if (session.messages[i].sender === 'me') {
                    lastUserIndex = i;
                    break;
                }
            }
            
            // 如果找到了用户的输入，并且后面有AI的回复
            if (lastUserIndex !== -1 && lastUserIndex < session.messages.length - 1) {
                // 【修复】截断消息数组，只保留到用户最后一次输入（包含该次输入）
                session.messages.splice(lastUserIndex + 1);
                
                // 保存更改并重新触发AI回复
                localStorage.setItem('activeInstanceSession', JSON.stringify(session));
                renderInstanceChatUI(session); // 先渲染界面，移除旧回复
                triggerInstanceApiReply(session); // 再触发新回复
            } else {
                showCustomAlert('没有可供“重回”的AI回复。');
            }
        });
    }
    // --- 新增：为“API切换”按钮绑定事件 ---
    const apiSwitchBtn = document.querySelector('#instance-chat-toolbar .instance-toolbar-btn[title="API切换"]');
    if (apiSwitchBtn) {
        const newApiSwitchBtn = apiSwitchBtn.cloneNode(true);
        apiSwitchBtn.parentNode.replaceChild(newApiSwitchBtn, apiSwitchBtn);
        newApiSwitchBtn.addEventListener('click', () => {
            openInstanceApiSwitchPopup(session);
        });
    }
    // --- 新增：为“氛围”按钮绑定事件 ---
    const atmosphereBtn = document.querySelector('#instance-chat-toolbar .instance-toolbar-btn[title="氛围"]');
    if (atmosphereBtn) {
        const newAtmosphereBtn = atmosphereBtn.cloneNode(true);
        atmosphereBtn.parentNode.replaceChild(newAtmosphereBtn, atmosphereBtn);
        newAtmosphereBtn.addEventListener('click', () => {
            openAtmospherePopup(session);
        });
    }

    // 绑定事件 (使用克隆节点法确保事件不重复绑定)
    const newBackBtn = backBtn.cloneNode(true);
    backBtn.parentNode.replaceChild(newBackBtn, backBtn);
    newBackBtn.addEventListener('click', () => {
        showCustomConfirm(
            '要如何处理当前副本？', 
            () => { // "确认" -> 暂时退出
                closeInstanceSession('temporary');
            },
            () => { // "取消" -> 保持在界面
                // do nothing
            },
            { okText: '暂时退出', cancelText: '结束副本' } // 自定义按钮文本
        ).then(result => {
             if (result === 'cancel') { // 如果用户点击了“结束副本”
                closeInstanceSession('end');
             }
        });
    });

    const sendMessage = () => {
        const text = input.value.trim();
        if (text) {
            session.messages.push({
                id: 'instance_msg_' + generateId(),
                text: text,
                sender: 'me',
                timestamp: Date.now()
            });
            input.value = '';
            localStorage.setItem('activeInstanceSession', JSON.stringify(session));
            renderInstanceChatUI(session); // 重新渲染以显示新消息
            triggerInstanceApiReply(session); // 发送后立即触发AI回复
        }
    };
    
    const newSendBtn = sendBtn.cloneNode(true);
    sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);
    newSendBtn.addEventListener('click', sendMessage);

    input.onkeydown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // --- 新增：“选项”按钮逻辑 ---
    const optionsBtn = document.getElementById('instance-options-btn');
    if (optionsBtn) {
        const newOptionsBtn = optionsBtn.cloneNode(true);
        optionsBtn.parentNode.replaceChild(newOptionsBtn, optionsBtn);
        newOptionsBtn.addEventListener('click', () => {
            const lastMessage = session.messages.length > 0 ? session.messages[session.messages.length - 1] : null;
            
            // 检查最后一条消息是否是AI的，并且是否包含行动选项
            if (lastMessage && lastMessage.sender === 'them' && lastMessage.actionOptions && lastMessage.actionOptions.length > 0) {
                const overlay = document.getElementById('action-options-overlay');
                const listContainer = document.getElementById('action-options-list');
                
                listContainer.innerHTML = ''; // 清空旧选项
                lastMessage.actionOptions.forEach(optionText => {
                    const btn = document.createElement('button');
                    btn.className = 'action-option-btn';
                    btn.textContent = optionText;
                    listContainer.appendChild(btn);
                });

                overlay.classList.add('visible');

                // 为悬浮框添加一次性的关闭事件
                const closeOptionsHandler = (e) => {
                    if (e.target === overlay) {
                        overlay.classList.remove('visible');
                        overlay.removeEventListener('click', closeOptionsHandler);
                    }
                };
                overlay.addEventListener('click', closeOptionsHandler);

                // 为选项按钮添加事件委托
                const optionClickHandler = (e) => {
                    const clickedBtn = e.target.closest('.action-option-btn');
                    if (clickedBtn) {
                        const actionText = clickedBtn.textContent.substring(3).trim(); // 移除 "A. " 前缀
                        
                        // 复用现有的 sendMessage 逻辑来发送消息
                        input.value = actionText;
                        sendMessage(); // sendMessage 函数在下方定义

                        overlay.classList.remove('visible');
                        listContainer.removeEventListener('click', optionClickHandler);
                    }
                };
                listContainer.addEventListener('click', optionClickHandler);

            } else {
                showCustomAlert('当前没有可用的行动选项。');
            }
        });
    }

    const newApiReplyBtn = apiReplyBtn.cloneNode(true);
    apiReplyBtn.parentNode.replaceChild(newApiReplyBtn, apiReplyBtn);
    newApiReplyBtn.addEventListener('click', () => {
        if (instanceIsApiReplying && instanceAbortController) {
            instanceAbortController.abort();
        } else {
            triggerInstanceApiReply(session);
        }
    });
}

/**
 * 构建提示词并调用API
 * @param {object} session - 当前的副本会话数据
 */
async function triggerInstanceApiReply(session) {
    if (instanceIsApiReplying) return;

    instanceIsApiReplying = true;
    instanceAbortController = new AbortController();
    
    // 添加加载动画气泡
    session.messages.push({ type: 'loading' });
    renderInstanceChatUI(session);

    try {
        // --- 1. 获取API配置 ---
        const instanceSettings = JSON.parse(localStorage.getItem('instanceAppSettings')) || {};
        const presets = JSON.parse(localStorage.getItem('apiPresets')) || {};
        let apiSettings;
        if (instanceSettings.apiPreset && presets[instanceSettings.apiPreset]) {
            apiSettings = presets[instanceSettings.apiPreset];
        } else {
            apiSettings = JSON.parse(localStorage.getItem('apiSettings')) || {};
        }

        if (!apiSettings.url || !apiSettings.key || !apiSettings.model) {
            throw new Error('API配置不完整，请检查副本基础设置或全局API设置。');
        }

        // --- 2. 构建 System Prompt ---
        // 加载所需数据
        const archiveData = JSON.parse(localStorage.getItem('archiveData')) || {};
        const instancePromptPresets = JSON.parse(localStorage.getItem('instancePromptPresets')) || {};

        let systemPrompt = `你是一个世界一流的地下城主（DM），正在主持一场文字角色扮演游戏（TRPG）。你的任务是基于我提供的世界观、角色设定和我的行动，生动地描述场景、扮演NPC，并推动剧情发展。请始终保持故事的连贯性和沉浸感。\n\n`;

        // a. 添加副本提示词预设
        const lastSelectedPresetName = localStorage.getItem('lastSelectedPromptPreset');
        if (lastSelectedPresetName && instancePromptPresets[lastSelectedPresetName]) {
            systemPrompt += `【核心规则】\n`;
            instancePromptPresets[lastSelectedPresetName].forEach(preset => {
                if (preset.enabled) {
                    systemPrompt += `- ${preset.content}\n`;
                }
            });
            systemPrompt += `\n`;
        }

        // b. 添加参与者人设
        systemPrompt += `【参与者信息】\n`;

        // === 新增：要求AI生成行动选项的指令 ===
        systemPrompt += `
【行动建议】
在你的所有回复结束后，请另起一行，并严格按照以下格式提供四个供玩家选择的不同方向的行动建议。这些建议应简洁明了，作为玩家下一步行动的参考。
[OPTIONS]
A. [建议一]
B. [建议二]
C. [建议三]
D. [建议四]
[/OPTIONS]
`;
        // 用户
        if (archiveData.user) {
            systemPrompt += `玩家 (User): ${archiveData.user.persona}\n`;
        }
        // 角色 (Char)
        if (session.charIds && session.charIds.length > 0) {
            const selectedChars = archiveData.characters.filter(c => session.charIds.includes(c.id));
            selectedChars.forEach(char => {
                systemPrompt += `玩家控制的角色 (${char.name}): ${char.persona}\n`;
            });
        }
        // NPC
        if (session.npcIds && session.npcIds.length > 0) {
            const selectedNpcs = instanceNpcData.filter(n => session.npcIds.includes(n.id));
             selectedNpcs.forEach(npc => {
                systemPrompt += `你扮演的NPC (${npc.name}): ${npc.persona}\n`;
            });
        }

        // --- 3. 构建对话历史 ---
        const history = session.messages
            .filter(m => m.type !== 'loading') // 过滤掉加载中的消息
            .map(msg => ({
                role: msg.sender === 'me' ? 'user' : 'assistant',
                content: msg.text
            }));

        const apiMessages = [{ role: 'system', content: systemPrompt.trim() }, ...history];

        // --- 4. 发起API请求 ---
        const response = await fetch(new URL('/v1/chat/completions', apiSettings.url).href, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiSettings.key}` },
            body: JSON.stringify({
                model: apiSettings.model,
                messages: apiMessages,
                temperature: parseFloat(apiSettings.temp || 0.7),
                stream: true // 推荐使用流式以获得更好的体验
            }),
            signal: instanceAbortController.signal
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API 请求失败: ${response.status} ${errorData.error?.message || ''}`);
        }

        // --- 5. 处理流式响应 (优化版) ---
        // 移除加载动画气泡
        session.messages.pop(); 
        
        // 创建新的消息对象并添加到会话中
        const replyMessage = {
            id: 'instance_msg_' + generateId(),
            text: '', // 初始为空
            sender: 'them',
            timestamp: Date.now()
        };
        session.messages.push(replyMessage);

        // 渲染一次UI，将新的空AI气泡添加到DOM中
        renderInstanceChatUI(session);
        
        // 获取这个新气泡的DOM元素引用
        const newBubbleElement = document.getElementById(`instance-msg-bubble-${replyMessage.id}`);
        if (!newBubbleElement) {
            // 如果找不到元素，说明渲染出了问题，回退到旧逻辑或报错
            console.error("未能找到新创建的AI回复气泡DOM元素。");
            return; 
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let fullReply = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done || instanceAbortController.signal.aborted) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.substring(6);
                    if (data === '[DONE]') break;
                    try {
                        const json = JSON.parse(data);
                        const delta = json.choices[0].delta.content;
                        if (delta) {
                            fullReply += delta;
                            // 【修复】使用renderMarkdown函数来处理加粗和换行
                            newBubbleElement.innerHTML = renderMarkdown(fullReply.trimStart());
                            
                            // 实时滚动到底部
                            const messagesContainer = document.getElementById('instance-chat-messages');
                            messagesContainer.scrollTop = messagesContainer.scrollHeight;
                        }
                    } catch (e) { /* 忽略解析错误 */ }
                }
            }
        }

        // 循环结束后，将最终清理过的文本保存回数据对象
        
        // === 新增：解析并存储行动选项 ===
        const optionsRegex = /\[OPTIONS\]([\s\S]*?)\[\/OPTIONS\]/;
        const optionsMatch = fullReply.match(optionsRegex);
        
        if (optionsMatch) {
            const optionsText = optionsMatch[1].trim();
            const optionsArray = optionsText.split('\n').filter(line => line.trim() !== '').map(line => line.trim());
            // 将解析出的选项数组附加到消息对象上
            replyMessage.actionOptions = optionsArray;
            
            // 从最终回复中移除选项块
            fullReply = fullReply.replace(optionsRegex, '').trim();
        }

        replyMessage.text = fullReply;
        
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error("副本API调用失败:", error);
            showCustomAlert(`AI响应失败: ${error.message}`);
        }
    } finally {
        instanceIsApiReplying = false;
        // 移除加载气泡（如果它还在）
        const loadingIndex = session.messages.findIndex(m => m.type === 'loading');
        if (loadingIndex > -1) {
            session.messages.splice(loadingIndex, 1);
        }
        localStorage.setItem('activeInstanceSession', JSON.stringify(session));
        renderInstanceChatUI(session); // 最终渲染
    }
}

/**
 * 关闭副本会话
 * @param {'temporary' | 'end'} type - 关闭类型
 */
function closeInstanceSession(type) {
    const container = document.getElementById('instance-chat-container');
    container.classList.remove('visible');

    if (type === 'end') {
        // TODO: 实现总结功能
        localStorage.removeItem('activeInstanceSession');
        showGlobalToast('副本已结束。', { type: 'success' });
        // 结束副本后，返回副本列表主界面
        renderInstanceList(); 
    } else { // 'temporary'
        showGlobalToast('已暂时退出副本，进度已保存。', { type: 'info' });
        // 暂时退出，返回副本列表主界面
        renderInstanceList(); 
    }
}

// 修正 showCustomConfirm 以返回 Promise，便于处理不同选择
function showCustomConfirm(message, onConfirm, onCancel, options = {}) {
    return new Promise((resolve) => {
        const { okText = '确认', cancelText = '取消' } = options;
        const overlay = document.getElementById('custom-confirm-overlay');
        const messageEl = document.getElementById('custom-confirm-message');
        const okBtn = document.getElementById('custom-confirm-ok');
        const cancelBtn = document.getElementById('custom-confirm-cancel');

        messageEl.textContent = message;
        okBtn.textContent = okText;
        cancelBtn.textContent = cancelText;

        overlay.classList.add('visible');

        const newOkBtn = okBtn.cloneNode(true);
        okBtn.parentNode.replaceChild(newOkBtn, okBtn);
        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

        const close = () => overlay.classList.remove('visible');

        newOkBtn.onclick = () => {
            close();
            if (typeof onConfirm === 'function') onConfirm();
            resolve('ok');
        };

        newCancelBtn.onclick = () => {
            close();
            if (typeof onCancel === 'function') onCancel();
            resolve('cancel');
        };
    });
}
/**
 * 新增：打开副本专用的API切换悬浮窗
 * @param {object} session - 当前的副本会话数据
 */
function openInstanceApiSwitchPopup(session) {
    const apiSwitchOverlay = document.getElementById('instance-api-switch-overlay');
    const apiPresetList = document.getElementById('instance-api-preset-list');
    const closeBtn = document.getElementById('close-instance-api-switch');

    const presets = JSON.parse(localStorage.getItem('apiPresets')) || {};
    const currentInstanceSettings = session.apiSettings || {};
    
    // 如果实例没有独立设置，则使用全局设置作为当前参考
    const globalSettings = JSON.parse(localStorage.getItem('apiSettings')) || {};
    const currentEffectiveSettings = Object.keys(currentInstanceSettings).length > 0 ? currentInstanceSettings : globalSettings;

    apiPresetList.innerHTML = '';
    if (Object.keys(presets).length === 0) {
        apiPresetList.innerHTML = `<span class="empty-text" style="padding: 20px; text-align: center;">无可用预设，请先在全局API设置中保存。</span>`;
        apiSwitchOverlay.classList.add('visible');
        return;
    }

    for (const name in presets) {
        const preset = presets[name];
        const item = document.createElement('div');
        item.className = 'api-preset-item';
        item.dataset.presetName = name;

        // 检查此预设是否为当前实例的设定
        const isSelected = JSON.stringify(preset) === JSON.stringify(currentEffectiveSettings);
        if (isSelected) {
            item.classList.add('selected');
        }

        item.innerHTML = `
            <span>${name}</span>
            <div class="api-preset-details">
                <div class="model-selection-group">
                    <select class="modal-select api-model-select">
                        ${preset.model ? `<option value="${preset.model}" selected>${preset.model}</option>` : '<option value="">未选择模型</option>'}
                    </select>
                    <button class="modal-button secondary pull-models-btn" style="padding: 10px;">拉取</button>
                </div>
                <div class="save-preset-container">
                    <button class="modal-button apply-preset-btn">应用此预设</button>
                </div>
            </div>
        `;
        apiPresetList.appendChild(item);
    }
    
    // 事件委托
    const newApiPresetList = apiPresetList.cloneNode(true);
    apiPresetList.parentNode.replaceChild(newApiPresetList, apiPresetList);
    newApiPresetList.addEventListener('click', async (e) => {
        const presetItem = e.target.closest('.api-preset-item');
        if (!presetItem) return;

        const presetName = presetItem.dataset.presetName;
        const presetData = presets[presetName];

        if (e.target.classList.contains('apply-preset-btn')) {
            e.stopPropagation();
            const modelSelect = presetItem.querySelector('.api-model-select');
            const selectedModel = modelSelect.value;
            
            // 更新预设并应用到当前副本会话
            const finalPreset = { ...presets[presetName], model: selectedModel };
            session.apiSettings = finalPreset;
            localStorage.setItem('activeInstanceSession', JSON.stringify(session));

            apiSwitchOverlay.classList.remove('visible');
            showGlobalToast(`副本已切换到预设: ${presetName}`, { type: 'success' });
            return;
        }

        if (e.target.classList.contains('pull-models-btn')) {
            e.stopPropagation(); // 阻止展开/收起
            const pullBtn = e.target;
            const modelSelect = presetItem.querySelector('.api-model-select');

            if (!presetData.url || !presetData.key) {
                showGlobalToast('此预设缺少URL或Key', { type: 'error' });
                return;
            }

            pullBtn.textContent = '...';
            pullBtn.disabled = true;

            try {
                const response = await fetch(new URL('/v1/models', presetData.url).href, {
                    headers: { 'Authorization': `Bearer ${presetData.key}` }
                });
                if (!response.ok) throw new Error(`API错误: ${response.status}`);
                const data = await response.json();
                
                // 确保返回的数据结构正确
                if (!data.data || !Array.isArray(data.data)) {
                    throw new Error('返回数据格式不正确');
                }

                const models = data.data.map(m => m.id).sort();
                
                modelSelect.innerHTML = '';
                models.forEach(modelId => {
                    modelSelect.innerHTML += `<option value="${modelId}">${modelId}</option>`;
                });
                
                showGlobalToast('模型列表已更新', { type: 'success', duration: 2000 });
            } catch (error) {
                showGlobalToast(`拉取失败: ${error.message}`, { type: 'error' });
            } finally {
                pullBtn.textContent = '拉取';
                pullBtn.disabled = false;
            }
            return;
        }

        // 展开/收起
        if (!e.target.closest('.api-preset-details')) {
            if (presetItem.classList.contains('expanded')) {
                presetItem.classList.remove('expanded');
            } else {
                newApiPresetList.querySelectorAll('.api-preset-item.expanded').forEach(p => p.classList.remove('expanded'));
                presetItem.classList.add('expanded');
            }
        }
    });

    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    newCloseBtn.onclick = () => apiSwitchOverlay.classList.remove('visible');

    apiSwitchOverlay.classList.add('visible');
}
/**
 * 新增：打开副本的氛围设置悬浮窗
 * @param {object} session - 当前的副本会话数据
 */
function openAtmospherePopup(session) {
    const overlay = document.getElementById('instance-atmosphere-overlay');
    const body = document.getElementById('instance-atmosphere-body');
    const closeBtn = document.getElementById('close-atmosphere-popup-btn');
    
    // --- 1. 构建背景更换UI ---
    const backgroundSectionHTML = `
        <div class="instance-settings-section">
            <h5>更换背景</h5>
            <div class="mockup-container" style="margin: 0; justify-content: center;">
                <div class="phone-mockup">
                    <div class="phone-frame">
                        <div id="atmosphere-bg-preview" class="phone-screen" style="background-image: url('${session.chatBackground || ''}'); background-color: var(--bg-color-end);"></div>
                    </div>
                    <input type="file" id="atmosphere-bg-upload" accept="image/*" hidden>
                </div>
            </div>
        </div>
    `;

    // --- 2. 构建音乐播放UI ---
    loadMusicPlaylists(); // 确保加载最新的歌单数据
    let musicSectionHTML = `
        <div class="atmosphere-music-section">
            <h5>选择音乐</h5>
    `;
    if (musicPlaylists.length > 0) {
        musicPlaylists.forEach(playlist => {
            musicSectionHTML += `
                <details class="atmosphere-playlist-details">
                    <summary>${escapeHTML(playlist.name)}</summary>
                    <div class="song-list-container">
            `;
            if (playlist.songs.length > 0) {
                playlist.songs.forEach(song => {
                    musicSectionHTML += `
                        <div class="atmosphere-song-item" data-song-id="${song.id}" data-song-name="${escapeHTML(song.name)}" data-song-artist="${escapeHTML(song.artist)}" data-song-cover="${song.cover}">
                            <div class="song-item-cover" style="background-image: url('${song.cover}')"></div>
                            <div class="song-item-info">
                                <div class="song-item-title">${escapeHTML(song.name)}</div>
                                <div class="song-item-artist">${escapeHTML(song.artist)}</div>
                            </div>
                        </div>
                    `;
                });
            } else {
                musicSectionHTML += `<span class="empty-text">歌单为空</span>`;
            }
            musicSectionHTML += `</div></details>`;
        });
    } else {
        musicSectionHTML += `<span class="empty-text">音乐库中没有歌单。</span>`;
    }
    musicSectionHTML += `</div>`;
    
    // --- 3. 组合并渲染UI ---
    body.innerHTML = backgroundSectionHTML + musicSectionHTML;
    overlay.classList.add('visible');

    // --- 4. 绑定事件 ---
    
    // 背景更换
    const bgPreview = document.getElementById('atmosphere-bg-preview');
    const bgUpload = document.getElementById('atmosphere-bg-upload');
    bgPreview.parentElement.addEventListener('click', () => bgUpload.click());
    bgUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target.result;
                session.chatBackground = dataUrl;
                localStorage.setItem('activeInstanceSession', JSON.stringify(session)); // 保存
                bgPreview.style.backgroundImage = `url('${dataUrl}')`; // 更新预览
                document.getElementById('instance-chat-wallpaper').style.backgroundImage = `url('${dataUrl}')`; // 实时更新聊天背景
            };
            reader.readAsDataURL(file);
        }
    });

    // 音乐播放 (使用事件委托)
    const musicSection = body.querySelector('.atmosphere-music-section');
    musicSection.addEventListener('click', async (e) => {
        const songItem = e.target.closest('.atmosphere-song-item');
        if (songItem) {
            const songId = songItem.dataset.songId;
            const songName = songItem.dataset.songName;
            
            showGlobalToast(`正在准备播放: ${songName}`, { duration: 1500 });

            const songUrl = await getNeteaseSongUrl(songId);
            if (songUrl) {
                const songDetails = {
                    id: songId,
                    name: songName,
                    artist: songItem.dataset.songArtist,
                    cover: songItem.dataset.songCover
                };
                playSong(songUrl, songDetails);
                showGlobalToast(`开始播放: ${songName}`, { type: 'success' });
            } else {
                // 失败提示已在 getNeteaseSongUrl 中处理
            }
        }
    });

    // 关闭按钮
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    newCloseBtn.onclick = () => overlay.classList.remove('visible');
}
