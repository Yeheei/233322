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
                <!-- 新增：显示副本任务 -->
                <div class="modal-form-group">
                    <label>副本任务</label>
                    <div id="instance-detail-tasks-list">
                        ${
                            (instance.tasks && instance.tasks.trim())
                                ? instance.tasks.trim().split('\n').map(task => `
                                    <div class="task-list-item">
                                        <span class="task-list-dot"></span>
                                        <span>${escapeHTML(task)}</span>
                                    </div>
                                `).join('')
                                : '<span class="empty-text">此副本暂无任务。</span>'
                        }
                    </div>
                </div>
                <div class="modal-form-group">
                    <label>开场白</label>
                    <pre class="modal-input" style="min-height: 120px; height: auto; white-space: pre-wrap; word-wrap: break-word; background: transparent; border: none; padding-left: 0;">${escapeHTML(instance.openingMonologue)}</pre>
                </div>
            </div>
        </div>
    `;

    footerEl.innerHTML = `
        <div>
             <button id="edit-instance-btn" class="instance-delete-btn" title="编辑副本信息">
                <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
            </button>
            <button id="delete-instance-btn" class="instance-delete-btn" title="删除此副本">
                <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
            </button>
        </div>
        <button id="enter-instance-btn" class="modal-button" style="margin-bottom: 5px; margin-right: 5px;">进入副本</button>
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

    // 【新增】编辑按钮事件
    document.getElementById('edit-instance-btn').addEventListener('click', () => {
        // 先关闭当前的详情弹窗
        overlay.dispatchEvent(new Event('click'));
        // 延迟一点打开编辑弹窗，让关闭动画更平滑
        setTimeout(() => {
            openInstanceFormModal(instance.id); // 调用表单函数，并传入当前副本ID
        }, 200);
    });

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


// 打开创建/编辑副本的悬浮窗
function openInstanceFormModal(instanceId = null) {
    const isEditing = instanceId !== null;
    const instanceToEdit = isEditing ? instanceData.find(inst => inst.id === instanceId) : null;
    
    if (isEditing && !instanceToEdit) {
        showCustomAlert('错误：找不到要编辑的副本数据。');
        return;
    }

    const overlay = document.getElementById('instance-popup-overlay');
    const titleEl = document.getElementById('instance-popup-title');
    const bodyEl = document.getElementById('instance-popup-body');
    const footerEl = document.getElementById('instance-popup-footer');
    
    titleEl.textContent = isEditing ? '更新副本' : '创建新副本';
    
    let tempCoverImageData = isEditing ? (instanceToEdit.coverImage || '') : '';

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
                <label for="instance-tasks-container">副本任务</label>
                <div id="instance-tasks-container">
                    <!-- 动态添加的任务项将在这里显示 -->
                </div>
                <div id="add-instance-task-btn" class="add-item-placeholder" style="margin-top: 10px;">点击添加任务</div>
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
        <button id="save-create-instance-btn" class="modal-button">${isEditing ? '更新副本' : '保存副本'}</button>
    `;

    overlay.classList.add('visible');

    // --- 绑定内部事件 ---
    const coverSetter = document.getElementById('instance-cover-setter');
    const coverUpload = document.getElementById('instance-cover-upload');
    
    coverSetter.addEventListener('click', () => coverUpload.click());
    coverUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // 调用新的压缩函数，副本封面尺寸适中
            compressImage(file, 1024, 0.8)
                .then(compressedDataUrl => {
                    tempCoverImageData = compressedDataUrl;
                    coverSetter.style.backgroundImage = `url('${tempCoverImageData}')`;
                    coverSetter.querySelector('span').style.display = 'none';
                })
                .catch(error => {
                    console.error("副本封面压缩失败:", error);
                    showCustomAlert("图片压缩失败，请换张图片或稍后再试。");
                });
        }
    });
    
    const tasksContainer = document.getElementById('instance-tasks-container');

    const addInstanceTaskItem = (taskText) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-list-item';
        taskItem.style.cursor = 'default';
        taskItem.dataset.taskContent = taskText;
        taskItem.innerHTML = `
            <span class="task-list-dot"></span>
            <span style="flex-grow: 1;">${escapeHTML(taskText)}</span>
            <button class="delete-item-btn" title="删除此任务" style="flex-shrink: 0;">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
            </button>
        `;
        taskItem.querySelector('.delete-item-btn').addEventListener('click', () => taskItem.remove());
        tasksContainer.appendChild(taskItem);
    };

    document.getElementById('add-instance-task-btn').addEventListener('click', () => {
        showCustomPrompt('请输入任务内容：', '', (text) => {
            if (text && text.trim()) addInstanceTaskItem(text.trim());
        });
    });

    // --- 填充表单 (如果是编辑模式) ---
    if (isEditing) {
        document.getElementById('instance-title-input').value = instanceToEdit.title;
        document.getElementById('instance-intro-textarea').value = instanceToEdit.intro;
        document.getElementById('instance-opening-textarea').value = instanceToEdit.openingMonologue;
        if (tempCoverImageData) {
            coverSetter.style.backgroundImage = `url('${tempCoverImageData}')`;
            coverSetter.querySelector('span').style.display = 'none';
        }
        if (instanceToEdit.tasks) {
            instanceToEdit.tasks.split('\n').forEach(task => {
                if(task.trim()) addInstanceTaskItem(task.trim());
            });
        }
    }
    
    // AI 生成逻辑 (保持不变)
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
[TASKS]
一个包含4-6个副本任务的列表，每行一个任务，不要添加*。
[OPENING]
一段充满悬念或代入感的开场白，作为玩家进入副本看到的第一段话，大约100-150字。`;

        const response = await getAICompletion(prompt, false);
        
        btn.textContent = '让AI来写';
        btn.disabled = false;

        if (response) {
            const titleMatch = response.match(/\[TITLE\]\s*([\s\S]*?)\s*\[INTRO\]/);
            const introMatch = response.match(/\[INTRO\]\s*([\s\S]*?)\s*\[TASKS\]/);
            const tasksMatch = response.match(/\[TASKS\]\s*([\s\S]*?)\s*\[OPENING\]/);
            const openingMatch = response.match(/\[OPENING\]\s*([\s\S]*)/);
            const title = titleMatch ? titleMatch[1].trim() : '';
            const intro = introMatch ? introMatch[1].trim() : '';
            const tasksText = tasksMatch ? tasksMatch[1].trim() : '';
            const opening = openingMatch ? openingMatch[1].trim() : '';

            if (title || intro || tasksText || opening) {
                document.getElementById('instance-title-input').value = title;
                document.getElementById('instance-intro-textarea').value = intro;
                document.getElementById('instance-opening-textarea').value = opening;
                tasksContainer.innerHTML = '';
                if (tasksText) {
                    tasksText.split('\n').forEach(task => {
                        if (task.trim()) addInstanceTaskItem(task.trim());
                    });
                }
                showGlobalToast('AI创作完成！', { type: 'success' });
            } else {
                showCustomAlert('AI返回的内容格式不正确，无法自动填充。');
            }
        }
    });

    // --- 保存/更新按钮逻辑 ---
    const saveBtn = document.getElementById('save-create-instance-btn');
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
    newSaveBtn.addEventListener('click', () => {
        const taskItems = Array.from(tasksContainer.querySelectorAll('.task-list-item'));
        const tasksString = taskItems.map(item => item.dataset.taskContent).join('\n');
        
        const title = document.getElementById('instance-title-input').value.trim();
        if (!title) {
            showCustomAlert('副本标题不能为空！');
            return;
        }

        const dataPayload = {
            title: title,
            coverImage: tempCoverImageData,
            intro: document.getElementById('instance-intro-textarea').value.trim(),
            tasks: tasksString,
            openingMonologue: document.getElementById('instance-opening-textarea').value.trim()
        };

        if (isEditing) {
            // 更新模式
            const index = instanceData.findIndex(inst => inst.id === instanceId);
            if (index !== -1) {
                instanceData[index] = { ...instanceData[index], ...dataPayload };
                showGlobalToast('副本更新成功！', { type: 'success' });
            }
        } else {
            // 创建模式
            const newInstance = { id: 'instance_' + generateId(), ...dataPayload };
            instanceData.unshift(newInstance);
            showGlobalToast('新副本创建成功！', { type: 'success' });
        }

        saveInstanceData();
        overlay.classList.remove('visible');
        renderInstanceList();
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
            <div class="modal-form-group">
                <label for="instance-context-count">副本上下文记忆条数</label>
                <input type="number" id="instance-context-count" class="modal-input" min="1" placeholder="默认20条">
                <p style="font-size: 12px; opacity: 0.6; margin: 4px 0 0 0;">AI进行副本回复时，可读取的包含副本和小手机内容的总条数。</p>
            </div>
             <div class="modal-form-group" style="margin-top: 15px;">
                <label for="instance-phone-context-count">小手机上下文记忆条数</label>
                <input type="number" id="instance-phone-context-count" class="modal-input" min="1" placeholder="默认10条">
                <p style="font-size: 12px; opacity: 0.6; margin: 4px 0 0 0;">在小手机内聊天时，AI可读取的前文条数。</p>
            </div>
            <div class="modal-form-group" style="margin-top: 15px;">
                <label for="instance-summary-threshold">自动总结阈值</label>
                <input type="number" id="instance-summary-threshold" class="modal-input" min="0" placeholder="0为关闭">
                 <p style="font-size: 12px; opacity: 0.6; margin: 4px 0 0 0;">当未被总结的对话（包含小手机）条数达到此值时，将触发自动总结。0为关闭。</p>
            </div>
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

    // 新增：加载并填充上下文与总结设置
    document.getElementById('instance-context-count').value = instanceSettings.contextCount || 20;
    document.getElementById('instance-phone-context-count').value = instanceSettings.phoneContextCount || 10;
    document.getElementById('instance-summary-threshold').value = instanceSettings.summaryThreshold || 50;

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
        
        // 使用 setTimeout 确保侧边栏关闭动画完成后再打开新弹窗，避免视觉冲突
        setTimeout(() => {
            if (buttonTitle === '基础设置') {
                openInstanceBaseSettingsPopup();
            } else if (buttonTitle === '创建副本') {
                openInstanceFormModal(null);
            } else if (buttonTitle === 'NPC库') {
                openInstanceNpcLibrary();
            } else if (buttonTitle === '归档副本') { // **需求2：新增归档副本入口**
                renderArchivedInstancesPage();
            } else {
                showCustomAlert(`你点击了副本设置的 "${buttonTitle}" 按钮。`);
            }
        }, 300);
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
        const settings = JSON.parse(localStorage.getItem('instanceAppSettings')) || {};
        
        // 保存API预设
        settings.apiPreset = document.getElementById('instance-api-preset-select').value;
        
        // 新增：保存上下文与总结设置
        settings.contextCount = parseInt(document.getElementById('instance-context-count').value, 10) || 20;
        settings.phoneContextCount = parseInt(document.getElementById('instance-phone-context-count').value, 10) || 10;
        settings.summaryThreshold = parseInt(document.getElementById('instance-summary-threshold').value, 10) || 50;

        localStorage.setItem('instanceAppSettings', JSON.stringify(settings));
        
        showGlobalToast('副本基础设置已保存！', { type: 'success' });
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
            // 调用新的压缩函数，头像尺寸较小，设为512px
            compressImage(file, 512, 0.8)
                .then(compressedDataUrl => {
                    tempAvatarData = compressedDataUrl;
                    avatarPreview.style.backgroundImage = `url('${tempAvatarData}')`;
                })
                .catch(error => {
                    console.error("NPC头像压缩失败:", error);
                    showCustomAlert("图片压缩失败，请换张图片或稍后再试。");
                });
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
            // 3秒倒计时结束
            console.log("进入副本确认！");
            
            // 收集选中的角色和NPC
            const selectedChars = Array.from(document.querySelectorAll('input[name="selected-chars"]:checked')).map(cb => cb.value);
            const selectedNpcs = Array.from(document.querySelectorAll('input[name="selected-npcs"]:checked')).map(cb => cb.value);

            // 关闭角色选择悬浮窗
            closePopup();
            
            // 【核心修正】关闭背后显示副本列表的主模态框
            closeModal();

            // 调用新函数来启动或恢复副本会话
            showGlobalToast('正在载入副本...', { type: 'info', duration: 1500 });
            setTimeout(() => {
                startInstanceSession(instance, selectedChars, selectedNpcs);
            }, 300); // 延迟一点，让主模态框关闭动画更平滑

        }, 3000); // 3秒
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

// === 新增：副本聊天气泡长按菜单的全局变量 ===
let instanceLongPressTimer = null;
let longPressedMessageId = null;
const CONTEXT_MENU_PRESS_DURATION = 500; // 长按500毫秒触发

// =============================================
// === 新增：副本内手机模拟器状态管理 ===
// =============================================
let phoneSimulatorView = { current: 'contacts', contactId: null };
let phoneIsApiReplying = false;
let phoneAbortController = null;

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
        const archiveData = JSON.parse(localStorage.getItem('archiveData')) || { characters: [] };
        
        const initialCharStatus = {};
        selectedCharIds.forEach(charId => {
            const charProfile = archiveData.characters.find(c => c.id === charId);
            initialCharStatus[charId] = {
                favorability: charProfile ? (charProfile.favorability || 0) : 0,
                time: '初始时刻',
                location: '未知',
                status: '准备就绪'
            };
        });

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
            chatBackground: '', // 背景字段
            // --- 新增：初始化状态数据 ---
            tasks: instance.tasks || '',
            completedTasks: [], // 【新增】用于存储已完成的任务名称
            points: 0,
            userStatus: {
                time: '初始时刻',
                location: '未知'
            },
            charStatus: initialCharStatus,
            // 新增：为手机模拟器初始化聊天数据存储
            phoneChats: {},
            // 新增：副本进度日志
            progressLog: []
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

        // 【核心修改】应用正则表达式
        // 检查 window.applyAllRegex 函数是否存在，避免在正则App脚本加载失败时报错
        const processedText = typeof window.applyAllRegex === 'function'
            ? window.applyAllRegex(msg.text, { type: 'instance' })
            : msg.text;

        // 新增：为每个气泡添加唯一的ID，方便JS后续直接操作
        return `
            <div class="instance-message-line">
                <div id="instance-msg-bubble-${msg.id}" class="instance-chat-bubble" style="align-self: ${msg.sender === 'me' ? 'flex-end' : 'flex-start'};">
                    ${renderMarkdown(processedText.trim())}
                </div>
            </div>
        `;
    }).join('');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // === 新增：为消息容器绑定长按手势 ===
    const newMessagesContainer = messagesContainer.cloneNode(true);
    messagesContainer.parentNode.replaceChild(newMessagesContainer, messagesContainer);

    const handlePressStart = (e) => {
        const targetBubble = e.target.closest('.instance-chat-bubble');
        if (!targetBubble) return;
        
        // 阻止默认的上下文菜单（主要针对桌面端右键）
        e.preventDefault();

        // 清除任何可能存在的旧计时器
        clearTimeout(instanceLongPressTimer);

        // 启动长按计时器
        instanceLongPressTimer = setTimeout(() => {
            showInstanceContextMenu(e, targetBubble);
        }, CONTEXT_MENU_PRESS_DURATION);
    };

    const handlePressEnd = () => {
        clearTimeout(instanceLongPressTimer);
    };

    newMessagesContainer.addEventListener('contextmenu', (e) => e.preventDefault()); // 彻底禁用默认右键菜单
    newMessagesContainer.addEventListener('mousedown', handlePressStart);
    newMessagesContainer.addEventListener('mouseup', handlePressEnd);
    newMessagesContainer.addEventListener('mouseleave', handlePressEnd);
    newMessagesContainer.addEventListener('touchstart', handlePressStart, { passive: false }); // passive: false 允许 preventDefault
    newMessagesContainer.addEventListener('touchend', handlePressEnd);
    newMessagesContainer.addEventListener('touchcancel', handlePressEnd);
    // === 新增结束 ===

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

    // --- 新增：为“状态”按钮绑定事件 ---
    const statusBtn = document.querySelector('#instance-chat-toolbar .instance-toolbar-btn[title="状态"]');
    if(statusBtn) {
        const newStatusBtn = statusBtn.cloneNode(true);
        statusBtn.parentNode.replaceChild(newStatusBtn, statusBtn);
        newStatusBtn.addEventListener('click', () => {
            openInstanceStatusPopup();
        });
    }

    // --- 新增：为“手机”按钮绑定事件 ---
    const phoneBtn = document.querySelector('#instance-chat-toolbar .instance-toolbar-btn[title="手机"]');
    if (phoneBtn) {
        const newPhoneBtn = phoneBtn.cloneNode(true);
        phoneBtn.parentNode.replaceChild(newPhoneBtn, phoneBtn);
        newPhoneBtn.addEventListener('click', () => {
            openPhoneSimulator();
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
            { okText: '暂时退出', cancelText: '结束副本' }
        ).then(result => {
             if (result === 'cancel') { // 用户点击了“结束副本”
                // 调用新的结算流程函数
                startSettlementProcess();
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

        // a. 添加历史剧情总结
        const summaries = session.messages.filter(m => m.type === 'summary');
        if (summaries.length > 0) {
            systemPrompt += `【历史剧情概要】\n`;
            summaries.forEach(summary => {
                systemPrompt += `- ${summary.text}\n`;
            });
            systemPrompt += `\n`;
        }

        // b. 添加副本提示词预设
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
        
        // === 核心修改：重构并润色剧本提示词 ===
        systemPrompt += `【剧情回复通用规则】
1.  **重剧情轻互动**：剧情发展应围绕副本故事本身，而非user和char的二人世界。请大胆引入NPC、意外事件、伏笔和悬念钩子，增加故事的趣味性和复杂性。char可以在故事中途出现或离开。
2.  **增强可读性**：在描写场景、动作或内心独白时，适当使用Markdown格式（如 \`**粗体**\`、\`*斜体*\`）来增强文本的可读性和表现力。
3.  **禁止行为**：
    *   绝不允许代替user进行任何思考、行动或对话。
    *   绝不允许复述、模仿或扩写user回复中的内容。你必须直接承接user的输入，推动剧情继续发展。

【特殊指令生成规则】
**你的每一轮回复都必须严格检查并按需生成以下指令块，它们是你回复的必要组成部分。**

1.  **检查积分/好感度变化**：回顾上一轮用户的行动。
    *   **积分 (points)**：仅在用户完成关键任务或做出重大贡献时，才在 \`[STATUS]\` 块中通过 \`add_points\` 增加积分，此项变化不应频繁。
    *   **好感度 (favor)**：仅在互动对char产生显著情感影响时，才在 \`[STATUS]\` 块中通过 \`add_favor\` 增减好感度，此项变化同样不应频繁。

2.  **检查任务状态**：检查上一轮的剧情进展是否满足了某个任务的完成条件。如果满足，在 \`[STATUS]\` 块中增加 \`task_completed="任务名称"\` 字段。

3.  **检查通讯消息**：判断当前剧情中，是否有NPC、char或系统会主动通过“小手机”给user发送消息。如果需要发送，**必须**在你的回复**最开始**，生成一个或多个 \`[PHONE_MESSAGE: contact_id=角色ID | text=消息内容]\` 块。

4.  **【强制】生成正确格式**：
    *   **动态状态 \`[STATUS]\`**：你的每一轮回复都 **必须** 在**末尾**包含一个动态状态块，格式为：\`[STATUS: user_time=... | user_location=... | char_time=... | char_location=... | char_status=... | add_points=... | add_favor=...]\`。**所有字段都必须生成**，即使没有变化（此时增减值为0）。
    *   **行动选项 \`[OPTIONS]\`**：在你的所有回复结束后，请另起一行，并严格按照以下格式提供四个供玩家选择的不同方向的行动建议。
        [OPTIONS]
        A. [建议一]
        B. [建议二]
        C. [建议三]
        D. [建议四]
        [/OPTIONS]
`;

        // b. 添加参与者人设
        systemPrompt += `\n【参与者信息】\n`;
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

        // --- 3. 构建对话历史 (重构以合并手机聊天记录) ---
        const allMessages = [];
        
        // a. 添加副本主线消息
        session.messages.filter(m => m.type !== 'loading').forEach(msg => {
            allMessages.push({ ...msg, source: 'instance' });
        });

        // b. 添加所有手机聊天消息
        if (session.phoneChats) {
            for (const contactId in session.phoneChats) {
                const contact = [...instanceNpcData, ...(archiveData.characters || [])].find(c => c.id === contactId);
                const contactName = contact ? contact.name : '未知联系人';
                
                session.phoneChats[contactId].forEach(msg => {
                    const phoneMsg = { ...msg, source: 'phone', contactName: contactName };
                    allMessages.push(phoneMsg);
                });
            }
        }
        
        // c. 按时间戳排序，确保时间线连贯
        allMessages.sort((a, b) => a.timestamp - b.timestamp);

        // d. 截取指定数量的上下文
        const contextCount = (JSON.parse(localStorage.getItem('instanceAppSettings')) || {}).contextCount || 20;
        const recentMessages = allMessages.slice(-contextCount);

        // e. 格式化为API需要的格式
        const history = recentMessages.map(msg => {
            let content = msg.text;
            // 为手机消息添加上下文前缀
            if (msg.source === 'phone') {
                content = `[在手机上与${msg.contactName}的对话] ${content}`;
            }
            return {
                role: msg.sender === 'me' ? 'user' : 'assistant',
                content: content
            };
        });

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
        let originalFullReply = ''; // 用于匹配多个指令

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
                            originalFullReply += delta; // 同时更新原始回复字符串
                            // 【修复】使用renderMarkdown函数来处理加粗和换行
                            newBubbleElement.innerHTML = renderMarkdown(fullReply.replace(/\[PHONE_MESSAGE:.*?\]/g, '').trimStart()); // 渲染时移除手机指令
                            
                            // 实时滚动到底部
                            const messagesContainer = document.getElementById('instance-chat-messages');
                            messagesContainer.scrollTop = messagesContainer.scrollHeight;
                        }
                    } catch (e) { /* 忽略解析错误 */ }
                }
            }
        }

        // === 核心修改：解析所有指令，包括手机消息 ===
        // 使用原始的、未被修改过的回复 `originalFullReply` 来进行所有指令的解析

        // 1. 解析并处理 [PHONE_MESSAGE] 指令
        const phoneMessageRegex = /\[PHONE_MESSAGE:\s*contact_id=([^|]+?)\s*\|\s*text=([\s\S]+?)\]/g;
        let match;
        let hasNewPhoneMessage = false; // 标记是否有新手机消息
        
        // 循环匹配所有手机消息指令
        while ((match = phoneMessageRegex.exec(originalFullReply)) !== null) {
            const contactId = match[1].trim();
            const messageText = match[2].trim();
            
            // 确保联系人ID和消息内容都存在
            if (contactId && messageText) {
                // a. 确保持久化存储中有 phoneChats 对象
                if (!session.phoneChats) session.phoneChats = {};
                if (!session.phoneChats[contactId]) session.phoneChats[contactId] = [];
                
                // b. 创建新的手机消息对象并添加到对应的联系人聊天记录中
                session.phoneChats[contactId].push({
                    id: 'phone_msg_' + generateId(),
                    text: messageText,
                    sender: 'them', // AI发送的消息，所以是 'them'
                    timestamp: Date.now()
                });
                
                // c. 更新主 Chat App 数据中的未读角标
                const chatAppData = JSON.parse(localStorage.getItem('chatAppData')) || { contacts: [] };
                const contactInChatApp = chatAppData.contacts.find(c => c.id === contactId);
                if (contactInChatApp) {
                    contactInChatApp.unreadCount = (contactInChatApp.unreadCount || 0) + 1;
                    localStorage.setItem('chatAppData', JSON.stringify(chatAppData));
                }

                // d. 设置标记，表示有新手机消息
                hasNewPhoneMessage = true;
            }
        }
        
        // e. 如果有新手机消息，显示工具栏手机图标上的红点
        if (hasNewPhoneMessage) {
            const phoneNotificationDot = document.getElementById('instance-phone-notification-dot');
            if (phoneNotificationDot) {
                phoneNotificationDot.style.display = 'block';
            }
        }

        // 2. 从回复中移除所有 [PHONE_MESSAGE] 指令，得到用于副本气泡显示的纯净文本
        fullReply = fullReply.replace(phoneMessageRegex, '').trim();

        // 3. 解析 [STATUS] 块并更新会话数据 (保持原有逻辑)
        const statusRegex = /\[STATUS:\s*([\s\S]*?)\]/;
        const statusMatch = fullReply.match(statusRegex);
        if (statusMatch) {
            const statusContent = statusMatch[1];
            // 从回复中移除 [STATUS] 块
            fullReply = fullReply.replace(statusRegex, '').trim();
            
            const statusData = {};
            statusContent.split('|').forEach(part => {
                const [key, ...valueParts] = part.split('=');
                let value = valueParts.join('=').trim(); // 使用 let 以便后续修改
                if (key && value) {
                    // 【核心修复】移除值可能带有的前后引号，以应对AI不规范的输出
                    if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.substring(1, value.length - 1);
                    }
                    statusData[key.trim()] = value;
                }
            });

            // 初始化 session 中的状态对象
            if (!session.userStatus) session.userStatus = {};
            if (!session.charStatus) session.charStatus = {};
            if (!session.points) session.points = 0;

            // 更新 User 状态
            session.userStatus.time = statusData.user_time || session.userStatus.time;
            session.userStatus.location = statusData.user_location || session.userStatus.location;

            // 更新 Char 状态
            // 假设只有一个Char，未来可扩展为遍历session.charIds
            if (session.charIds && session.charIds.length > 0) {
                const mainCharId = session.charIds[0];
                if (!session.charStatus[mainCharId]) session.charStatus[mainCharId] = {};

                session.charStatus[mainCharId].time = statusData.char_time || session.charStatus[mainCharId].time;
                session.charStatus[mainCharId].location = statusData.char_location || session.charStatus[mainCharId].location;
                session.charStatus[mainCharId].status = statusData.char_status || session.charStatus[mainCharId].status;

                // 增加好感度
                const favorToAdd = parseInt(statusData.add_favor, 10) || 0;
                if (favorToAdd !== 0) {
                    const currentFavor = session.charStatus[mainCharId].favorability || 0;
                    session.charStatus[mainCharId].favorability = currentFavor + favorToAdd;
                    const favorText = favorToAdd > 0 ? `好感度 +${favorToAdd}` : `好感度 ${favorToAdd}`;
                    showGlobalToast(favorText, { type: 'success', duration: 2000 });
                    if (!session.progressLog) session.progressLog = [];
                    session.progressLog.push({ type: 'favor', value: favorToAdd, timestamp: Date.now() });
                }
            }

            // 增加积分
            const pointsToAdd = parseInt(statusData.add_points, 10) || 0;
            if (pointsToAdd !== 0) {
                session.points += pointsToAdd;
                const pointsText = pointsToAdd > 0 ? `积分 +${pointsToAdd}` : `积分 ${pointsToAdd}`;
                showGlobalToast(pointsText, { type: 'success', duration: 2000 });
                if (!session.progressLog) session.progressLog = [];
                session.progressLog.push({ type: 'points', value: pointsToAdd, timestamp: Date.now() });
            }
             // 【新增】处理任务完成
        if (statusData.task_completed) {
            const completedTaskName = statusData.task_completed.trim();
            // 初始化 completedTasks 数组（如果不存在）
            if (!session.completedTasks) {
                session.completedTasks = [];
            }
            // 检查是否已存在，避免重复添加
            if (completedTaskName && !session.completedTasks.includes(completedTaskName)) {
                session.completedTasks.push(completedTaskName);
                showGlobalToast(`任务完成: ${completedTaskName}`, { type: 'success' });
            }
        }
        }
        
        // === 解析并存储行动选项 ===
        const optionsRegex = /\[OPTIONS\]([\s\S]*?)\[\/OPTIONS\]/;
        const optionsMatch = fullReply.match(optionsRegex);
        
        if (optionsMatch) {
            const optionsText = optionsMatch[1].trim();
            const optionsArray = optionsText.split('\n').filter(line => line.trim() !== '').map(line => line.trim());
            replyMessage.actionOptions = optionsArray;
            fullReply = fullReply.replace(optionsRegex, '').trim();
        }

        replyMessage.text = fullReply;

        // 调用新函数来更新状态面板UI
        updateInstanceStatusPanel(session);

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
        
        // 新增：在回复完成后，检查是否需要进行自动总结
        checkAndTriggerAutoSummary(session);

        renderInstanceChatUI(session); // 最终渲染
        updateInstanceStatusPanel(session); // 在最终渲染后再次确保面板数据同步
    }
}

/**
 * 关闭副本会话
 * @param {'temporary' | 'end'} type - 关闭类型
 */
function closeInstanceSession(type) {
    const container = document.getElementById('instance-chat-container');
    container.classList.remove('visible');

    // --- 核心修复：主动打开主模态框并渲染副本列表 ---
    // 这一步确保了我们返回的是副本列表页，而不是黑屏或其他界面
    openInstanceApp({ currentTarget: document.getElementById('app-instance') });
    // --- 修复结束 ---
    
    if (type === 'end') {
        // 这是结算流程成功并结束后调用的清理函数
        localStorage.removeItem('activeInstanceSession');
        showGlobalToast('副本已结束。', { type: 'success' });
        // renderInstanceList(); // openInstanceApp 内部已调用
    } else { // 'temporary'
        showGlobalToast('已暂时退出副本，进度已保存。', { type: 'info' });
        // renderInstanceList(); // openInstanceApp 内部已调用
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
            // 调用新的压缩函数，背景图尺寸可以稍大一些
            compressImage(file, 1280, 0.8)
                .then(compressedDataUrl => {
                    session.chatBackground = compressedDataUrl;
                    localStorage.setItem('activeInstanceSession', JSON.stringify(session)); // 保存
                    bgPreview.style.backgroundImage = `url('${compressedDataUrl}')`; // 更新预览
                    document.getElementById('instance-chat-wallpaper').style.backgroundImage = `url('${compressedDataUrl}')`; // 实时更新聊天背景
                })
                .catch(error => {
                    console.error("副本聊天背景压缩失败:", error);
                    showCustomAlert("图片压缩失败，请换张图片或稍后再试。");
                });
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

/**
 * 新增：打开副本内的状态悬浮窗（重构版）
 */
function openInstanceStatusPopup() {
    const overlay = document.getElementById('instance-status-overlay');
    const popup = document.getElementById('instance-status-popup'); // 获取悬浮窗主体
    const navBar = document.getElementById('instance-status-nav-bar');
    
    if (!overlay || !popup || !navBar) return;

    overlay.classList.add('visible');

    // --- 新增：打开时立即渲染当前状态 ---
    const session = JSON.parse(localStorage.getItem('activeInstanceSession'));
    if (session) {
        updateInstanceStatusPanel(session);
    }
    // --- 新增结束 ---

    // 点击外部遮罩区域关闭悬浮窗
    const closeHandler = (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('visible');
            overlay.removeEventListener('click', closeHandler);
        }
    };
    overlay.addEventListener('click', closeHandler);

         const switchPage = (pageName) => {
            // 【核心修复】在这里重新获取导航栏元素，确保操作的是最新的、在页面上的DOM
            const currentNavBar = document.getElementById('instance-status-nav-bar');
            
            // 切换导航按钮的激活状态
            currentNavBar.querySelectorAll('.instance-status-nav-item').forEach(item => {
                if (item.dataset.page === pageName) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            // 切换内容页面的显示状态
            popup.querySelectorAll('.instance-status-page').forEach(page => {
                if (page.id === `status-page-${pageName}`) {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });
        };


    // 默认显示第一个页面
    switchPage('panel');

    // 为导航栏绑定事件委托
    const newNavBar = navBar.cloneNode(true);
    navBar.parentNode.replaceChild(newNavBar, navBar);
    newNavBar.addEventListener('click', (e) => {
        const clickedItem = e.target.closest('.instance-status-nav-item');
        if (!clickedItem) return;
        
        const pageNameToSwitch = clickedItem.dataset.page;
        switchPage(pageNameToSwitch);
    });
}
// 在 initializeInstanceApp() 函数定义的后面添加这个新函数

/**
 * 新增：更新副本状态面板的UI
 * @param {object} session - 最新的副本会话数据
 */
function updateInstanceStatusPanel(session) {
    if (!document.getElementById('instance-status-overlay').classList.contains('visible')) {
        return;
    }
    
    const archiveData = JSON.parse(localStorage.getItem('archiveData')) || { user: {}, characters: [] };
    const userProfile = archiveData.user;
    
    // --- 更新 User 面板 ---
    const userCard = document.getElementById('user-status-card');
    const userAvatarEl = document.getElementById('user-status-avatar');
    const userNameEl = document.getElementById('user-status-name');
    const userPointsEl = document.getElementById('user-status-points');
    const userTimeEl = document.getElementById('user-status-time');
    const userLocationEl = document.getElementById('user-status-location');
    
    if(userAvatarEl) userAvatarEl.style.backgroundImage = `url(${userProfile.avatar || ''})`;
    if(userNameEl) userNameEl.textContent = userProfile.name || 'User';
    if(userPointsEl) userPointsEl.textContent = session.points || 0;
    if(userTimeEl) userTimeEl.textContent = `时间: ${session.userStatus?.time || '未知'}`;
    if(userLocationEl) userLocationEl.textContent = `地点: ${session.userStatus?.location || '未知'}`;
    
    // --- 新增：为User面板绑定折叠事件 ---
    if (userCard) {
        // 使用克隆节点法防止重复绑定
        const newUserCard = userCard.cloneNode(true);
        userCard.parentNode.replaceChild(newUserCard, userCard);
        
        newUserCard.addEventListener('click', () => {
            const progressDetails = document.getElementById('user-progress-details');
            newUserCard.classList.toggle('expanded');
            if (newUserCard.classList.contains('expanded')) {
                progressDetails.style.display = 'block';
            } else {
                progressDetails.style.display = 'none';
            }
        });
    }

    // --- 新增：渲染进度日志列表 ---
    const progressContainer = document.getElementById('user-progress-details');
    if (progressContainer) {
        const progressLog = session.progressLog || [];
        if (progressLog.length > 0) {
            // 按时间戳排序，最新的在最下面
            progressLog.sort((a, b) => a.timestamp - b.timestamp);
            progressContainer.innerHTML = progressLog.map(log => {
                let text = '';
                if (log.type === 'points') {
                    text = `获得积分 ${log.value > 0 ? '+' : ''}${log.value}`;
                } else if (log.type === 'favor') {
                    text = `好感度 ${log.value > 0 ? '+' : ''}${log.value}`;
                }
                return `<div class="progress-list-item">${text}</div>`;
            }).join('');
        } else {
            progressContainer.innerHTML = `<div class="empty-text" style="font-size: 14px; padding: 10px 0;">暂无进度记录</div>`;
        }
    }

    // --- 动态生成并更新 Char 面板 ---
    const charContainer = document.getElementById('char-status-cards-container');
    if (charContainer) {
        charContainer.innerHTML = '';
        
        session.charIds.forEach(charId => {
            const charProfile = archiveData.characters.find(c => c.id === charId);
            if (!charProfile) return;
            
            const charStatus = session.charStatus?.[charId] || {};
            
            const card = document.createElement('div');
            card.className = 'status-card';
            card.innerHTML = `
                <div class="status-card-avatar" style="background-image: url('${charProfile.avatar || ''}')"></div>
                <div class="status-card-info">
                    <div class="name"><span>${charProfile.name}</span><span class="favor">好感: <span class="favor-value">${charStatus.favorability || 0}</span></span></div>
                    <div class="meta-item">
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path></svg>
                        <span>${charStatus.status || '状态未知'}</span>
                    </div>
                    <div class="meta-item">
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5z"></path></svg>
                        <span>${charStatus.location || '地点未知'}</span>
                    </div>
                </div>
            `;
            charContainer.appendChild(card);
        });
    }

    // --- 更新任务面板 ---
    const taskListContainer = document.getElementById('instance-task-list');
    if(taskListContainer) {
        if (session.tasks && session.tasks.trim()) {
            const tasks = session.tasks.trim().split('\n');
            // 【新增】获取已完成的任务列表，确保它是一个数组
            const completedTasks = session.completedTasks || [];
            
            taskListContainer.innerHTML = tasks.map(task => {
                // 【新增】检查当前任务是否已完成
                const isCompleted = completedTasks.includes(task.trim());
                const completedClass = isCompleted ? 'completed' : '';

                // 【修改】在 div 上添加 completedClass
                return `
                <div class="task-list-item ${completedClass}">
                    <span class="task-list-dot"></span>
                    <span>${escapeHTML(task)}</span>
                </div>
                `;
            }).join('');
        } else {
            taskListContainer.innerHTML = `<span class="empty-text">当前没有副本任务。</span>`;
        }
    }
}
/**
 * =============================================
 * === 新增：副本内手机模拟器核心逻辑 ===
 * =============================================
 */

/**
 * 打开手机模拟器悬浮窗
 */
function openPhoneSimulator() {
    const overlay = document.getElementById('instance-phone-simulator-overlay');
    if (!overlay) return;

    // 新增：初始化拖拽和缩放功能
    makePhoneDraggableAndResizable();

    // 新增：打开手机时，隐藏工具栏上的通知红点
    const phoneNotificationDot = document.getElementById('instance-phone-notification-dot');
    if (phoneNotificationDot) {
        phoneNotificationDot.style.display = 'none';
    }

    overlay.classList.add('visible');

    const closeHandler = (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('visible');
            overlay.removeEventListener('click', closeHandler);
        }
    };
    overlay.addEventListener('click', closeHandler);

    // 根据当前状态决定渲染哪个视图
    if (phoneSimulatorView.current === 'contacts') {
        renderPhoneContactList();
    } else if (phoneSimulatorView.current === 'chat' && phoneSimulatorView.contactId) {
        renderPhoneChatView(phoneSimulatorView.contactId);
    } else {
        renderPhoneContactList(); // 默认或异常状态下渲染联系人列表
    }
}

/**
 * 渲染手机模拟器内的联系人列表
 */
function renderPhoneContactList() {
    phoneSimulatorView.current = 'contacts'; // 更新状态
    const screen = document.getElementById('phone-simulator-screen');
    const session = JSON.parse(localStorage.getItem('activeInstanceSession'));
    const archiveData = JSON.parse(localStorage.getItem('archiveData')) || { characters: [] };
    
    // 1. 【核心修改】创建一个副本手机专用的本地“系统”联系人对象，不再从chatapp读取
    const systemContactForPhone = {
        id: 'system',
        name: '系统',
        avatar: '系统头像.jpg', // 使用和chatapp一样的头像URL，但数据源是独立的
        persona: `你是一个手机内置的AI助手，负责模拟与其他角色的聊天。你的回复应该简洁、工具化，专注于推进剧情和模拟对话。`
    };

    // 2. 获取副本内的参与者
    const instanceChars = (session.charIds || []).map(id => archiveData.characters.find(c => c.id === id)).filter(Boolean);
    const instanceNpcs = (session.npcIds || []).map(id => instanceNpcData.find(n => n.id === id)).filter(Boolean);
    const allParticipants = [...instanceChars, ...instanceNpcs];

    // 3. 组合联系人列表，本地的系统联系人置顶
    const contacts = [systemContactForPhone, ...allParticipants].filter(Boolean);
    
    let contactsHTML = '';
    if (contacts.length > 0) {
        // 新增：在渲染前先获取主聊天App的数据，用于读取未读数
        const chatAppData = JSON.parse(localStorage.getItem('chatAppData')) || { contacts: [] };

        contactsHTML = contacts.map(contact => {
            const phoneChats = session.phoneChats || {};
            const lastMsgObj = (phoneChats[contact.id] || []).slice(-1)[0];
            const lastMessageText = lastMsgObj ? lastMsgObj.text : (contact.id === 'system' ? '点击查看系统消息' : '暂无消息');
            
            // 新增：从主聊天App数据中获取未读数
            const contactInChatApp = chatAppData.contacts.find(c => c.id === contact.id);
            const unreadCount = contactInChatApp ? (contactInChatApp.unreadCount || 0) : 0;
            const badgeHTML = unreadCount > 0 ? `<span class="message-badge">${unreadCount}</span>` : '';

            return `
            <div class="chat-contact-item" data-contact-id="${contact.id}">
                <div class="chat-contact-avatar-wrapper">
                    <div class="chat-contact-avatar" style="background-image: url('${contact.avatar}')"></div>
                    ${badgeHTML}
                </div>
                <div class="chat-contact-info">
                    <div class="chat-contact-name">${escapeHTML(contact.name)}</div>
                    <div class="chat-contact-last-msg">${escapeHTML(lastMessageText)}</div>
                </div>
            </div>`;
        }).join('');
    } else {
        contactsHTML = `<span class="empty-text" style="text-align:center; display:block; padding: 40px 0;">无可用联系人</span>`;
    }

    screen.innerHTML = `
        <div class="chat-contact-list-view">
            <div class="chat-contact-list" style="padding-top: 15px;">${contactsHTML}</div>
        </div>
    `;

    // 绑定事件
    screen.querySelectorAll('.chat-contact-item').forEach(item => {
        item.addEventListener('click', () => {
            renderPhoneChatView(item.dataset.contactId);
        });
    });
}

/**
 * 渲染手机模拟器内的聊天视图
 * @param {string} contactId
 */
function renderPhoneChatView(contactId) {
    phoneSimulatorView.current = 'chat';
    phoneSimulatorView.contactId = contactId;

    const screen = document.getElementById('phone-simulator-screen');
    const session = JSON.parse(localStorage.getItem('activeInstanceSession'));
    const archiveData = JSON.parse(localStorage.getItem('archiveData')) || { characters: [] };
    const chatAppData = JSON.parse(localStorage.getItem('chatAppData')) || { contacts: [] };
    
    // 新增：清除未读消息和红点
    const contactInChatApp = chatAppData.contacts.find(c => c.id === contactId);
    if (contactInChatApp && contactInChatApp.unreadCount > 0) {
        contactInChatApp.unreadCount = 0;
        localStorage.setItem('chatAppData', JSON.stringify(chatAppData));
        // 注意：总红点在打开手机时已清除，此处无需重复操作
    }

    // 获取联系人信息
    const contact = [...archiveData.characters, ...instanceNpcData, ...chatAppData.contacts].find(c => c.id === contactId);
    if (!contact) {
        showCustomAlert('找不到联系人信息');
        renderPhoneContactList();
        return;
    }

    // 获取聊天记录
    const messages = (session.phoneChats && session.phoneChats[contactId]) ? session.phoneChats[contactId] : [];
    const userAvatarUrl = (JSON.parse(localStorage.getItem('archiveData'))?.user?.avatar) || '';
    
    const messagesHTML = messages.map(msg => {
        const isSent = msg.sender === 'me';
        const avatarUrl = isSent ? userAvatarUrl : contact.avatar;
        return `
            <div class="message-line ${isSent ? 'sent' : 'received'}">
                <div class="chat-avatar" style="background-image: url('${avatarUrl}')"></div>
                <div class="chat-bubble ${isSent ? 'sent' : 'received'}">${renderMarkdown(msg.text)}</div>
            </div>`;
    }).join('');
    
    screen.innerHTML = `
        <div class="chat-room-view">
            <div class="chat-header">
                <button class="chat-header-btn" id="phone-chat-back-btn">
                    <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
                </button>
                <span class="chat-contact-title">${escapeHTML(contact.name)}</span>
                <div style="width: 24px;"></div> <!-- 占位使标题居中 -->
            </div>
            <div class="chat-messages" id="phone-chat-messages">${messagesHTML}</div>
            ${phoneIsApiReplying ? `
                <div class="message-line received">
                    <div class="chat-avatar" style="background-image: url('${contact.avatar}')"></div>
                    <div class="chat-bubble received loading">
                        <div class="loading-dots"><span></span><span></span><span></span></div>
                    </div>
                </div>` : ''}
            <div id="phone-chat-footer">
                <button class="chat-action-btn" id="phone-redo-btn" title="重回">
                    <svg t="1767115092714" class="icon" viewBox="0 0 1024 1024"><path d="M512 82c237.482 0 430 192.518 430 430 0 128.822-57.15 249.565-155.928 331.351-6.533 5.41-16.214 4.498-21.623-2.034l-29.382-35.487c-5.409-6.533-4.498-16.213 2.035-21.622C818.31 716.968 865.214 617.878 865.214 512c0-195.075-158.14-353.214-353.214-353.214-195.075 0-353.214 158.14-353.214 353.214 0 103.647 44.947 200.788 123.023 267.913l77.012-91.778c7.162-8.536 19.889-9.65 28.425-2.487a20.176 20.176 0 0 1 6.875 11.812l44.016 239.646c2.013 10.96-5.24 21.477-16.2 23.49-1.25 0.23-2.518 0.332-3.788 0.332l-243.65-1.734c-11.142-0.08-20.11-9.176-20.032-20.32a20.18 20.18 0 0 1 4.72-12.825l73.262-87.31C137.039 757.061 82 638.421 82 512 82 274.518 274.518 82 512 82z" p-id="15984"></path></svg>
                </button>
                <div class="chat-input-area">
                    <input type="text" id="phone-chat-input" placeholder="输入消息...">
                </div>
                <button class="chat-action-btn" id="phone-api-reply-btn" title="${phoneIsApiReplying ? '停止' : 'AI回复'}">
                     <svg style="display:${phoneIsApiReplying ? 'none' : 'block'};" t="1767101507871" viewBox="0 0 1024 1024"><path d="M201.1 913.6c-1.2 0-2.4 0-3.6-0.1-11.1-1-21.6-5.2-31.2-12.5-9.3-7.7-15.9-17.2-19.7-28.4-4-10.7-4.8-22.3-2.4-34.5l24.2-111.3c-24.7-31-43.8-64.3-56.8-98.8C95.3 586.2 87 542.7 87 498.6c0-104.8 44.9-202.7 126.5-275.9 38.8-35.1 83.9-62.7 134.2-81.9 52-19.9 107.2-30 164-30 112.3 0 218 39.8 297.7 112 39.6 35.7 70.8 77.3 92.5 123.7 22.6 48.1 34 99.3 34 152.2 0 52.8-11.4 104-34 152.1-21.8 46.5-52.9 88.1-92.5 123.6-38.7 35.2-83.8 62.8-134.1 82-51.9 19.9-106.9 29.9-163.6 29.9-33.8 0-67.9-3.8-101.6-11.4-28.8-6.2-55.6-14.9-79.7-25.7l-100.5 56.9c-9.5 4.9-19.2 7.5-28.8 7.5z m29.4-223.2c9.1 9 12.8 22 10 34.7l-22.8 105.5 94.9-53.9c5.2-2.8 10.9-4.3 16.6-4.3 5 0 9.7 1.1 14.1 3.2 26.5 12.9 53.9 22.4 81.4 28.3 27.4 6.2 56.6 9.4 87 9.4 95.5 0 185.3-33.4 252.7-94.1 31.9-28.6 57-62.1 74.5-99.4 18-38.5 27.2-79.3 27.2-121.3s-9.1-82.8-27.2-121.3c-17.5-37.3-42.6-70.9-74.5-99.7-67.7-60.7-157.4-94.1-252.7-94.1-95.5 0-185.4 33.4-253.1 94.1-31.8 28.9-56.9 62.4-74.5 99.7-18.2 38.6-27.5 79.5-27.5 121.3 0 34.7 6.5 68.9 19.2 101.8 12.9 33.1 31.2 63.4 54.7 90.1z m453.3-124.8c-13.2 0-26.2-5.7-36.5-16.1-9.7-10.2-15-23.6-15-37.8 0-14.1 5.3-27.6 14.9-38.1 10.1-10.2 23.1-15.8 36.6-15.8s26.5 5.6 36.5 15.7c9.7 10.6 15 24.1 15 38.2 0 14.3-5.3 27.7-15 37.8-10.3 10.4-23.2 16.1-36.5 16.1z m-172 0c-13.7 0-26.6-5.7-36.5-16.1-9.8-10.3-15.1-23.7-15.1-37.8 0-13.9 5.4-27.5 15.1-38.1 9.7-10.2 22.7-15.8 36.6-15.8 13.7 0 26.5 5.6 36.2 15.7 9.6 10.3 15 23.9 15 38.2 0 14.5-5.3 27.8-15 37.8-10 10.4-22.8 16.1-36.3 16.1z m-168.7 0c-13.4 0-26.6-5.9-36.3-16.1-9.6-9.9-14.9-23.3-14.9-37.8 0-14.3 5.3-27.8 14.9-38.1 9.7-10.2 22.6-15.8 36.4-15.8 13.6 0 26.5 5.6 36.4 15.7 9.8 10.5 15.1 24 15.1 38.2 0 14.3-5.4 27.8-15.1 37.8-10.2 10.4-23.2 16.1-36.5 16.1z" p-id="1346"></path></svg>
                     <svg style="display:${phoneIsApiReplying ? 'block' : 'none'};" t="1767105419099" viewBox="0 0 1024 1024"><path d="M512 928.3c-229.2 0-415-185.8-415-415s185.8-415 415-415 415 185.8 415 415-185.8 415-415 415z m0.4-77.5c186.2 0 337.2-151 337.2-337.2s-151-337.2-337.2-337.2-337.2 151-337.2 337.2 150.9 337.2 337.2 337.2zM382.3 357.6h259.4c14.3 0 25.9 11.6 25.9 25.9V643c0 14.3-11.6 25.9-25.9 25.9H382.3c-14.3 0-25.9-11.6-25.9-25.9V383.6c0-14.4 11.6-26 25.9-26z"></path></svg>
                </button>
                <button class="chat-action-btn" id="phone-send-btn" title="发送">
                    <svg t="1767102878463" viewBox="0 0 1024 1024"><path d="M955 125.6c-4.5-12.5-15.4-21.8-28.6-24.2-9.2-1.7-18.4 0.1-26.1 4.8L83.9 544.3c-12.8 6.8-20.6 20.6-19.8 35.1 0.8 14.3 9.9 27.3 23.2 32.9l238.5 97.9c12.4 5.2 26.8 3.4 37.5-4.9s16.1-21.3 14.4-34.8c-1.6-13.2-10.4-24.6-23-29.9l-165-67.7 573-307.3-357 421.9c-6.5 7.7-9.6 17.4-8.8 27.4L411.4 884c1.6 19.7 17.7 34.6 37.5 34.6 9.5 0 18.7-3.7 25.8-10.4l74-69.2 0.1-0.1c13.5-13.2 15.2-33.5 4.8-48.4l222.6 72c4 1.3 7.9 2 11.7 2 18.2 0 33.8-12.9 37-30.6l131.6-688.3h-0.1c1.4-6.6 0.9-13.5-1.4-20zM497.3 783.8L479.9 800l-6.5-75.9L856 271.6l-96.8 506.3L539 706.6c-19.7-6.4-41.1 4.4-47.5 24.2-5.8 17.9 2.5 37.1 18.9 45.4-4.7 1.5-9.2 4-13.1 7.6z"></path></svg>
                </button>
            </div>
        </div>
    `;

    // 滚动到底部
    const messagesContainer = document.getElementById('phone-chat-messages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // --- 绑定事件 ---
    document.getElementById('phone-chat-back-btn').addEventListener('click', renderPhoneContactList);
    
    const input = document.getElementById('phone-chat-input');
    const sendBtn = document.getElementById('phone-send-btn');
    const apiBtn = document.getElementById('phone-api-reply-btn');
    const redoBtn = document.getElementById('phone-redo-btn');

    const sendMessage = () => {
        const text = input.value.trim();
        if (text && !phoneIsApiReplying) {
            const currentSession = JSON.parse(localStorage.getItem('activeInstanceSession'));
            if (!currentSession.phoneChats) currentSession.phoneChats = {};
            if (!currentSession.phoneChats[contactId]) currentSession.phoneChats[contactId] = [];
            
            currentSession.phoneChats[contactId].push({
                id: 'phone_msg_' + generateId(),
                text: text,
                sender: 'me',
                timestamp: Date.now()
            });

            localStorage.setItem('activeInstanceSession', JSON.stringify(currentSession));
            input.value = '';
            renderPhoneChatView(contactId);
            triggerPhoneAiReply(contactId);
        }
    };
    
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    apiBtn.addEventListener('click', () => {
        if (phoneIsApiReplying && phoneAbortController) {
            phoneAbortController.abort();
        } else {
            triggerPhoneAiReply(contactId);
        }
    });

    redoBtn.addEventListener('click', () => {
        if (phoneIsApiReplying) {
            showCustomAlert('AI正在回复中，请稍后重试。');
            return;
        }

        const currentSession = JSON.parse(localStorage.getItem('activeInstanceSession'));
        const chatHistory = currentSession.phoneChats[contactId] || [];
        
        let lastUserIndex = -1;
        for (let i = chatHistory.length - 1; i >= 0; i--) {
            if (chatHistory[i].sender === 'me') {
                lastUserIndex = i;
                break;
            }
        }
        
        if (lastUserIndex !== -1 && lastUserIndex < chatHistory.length - 1) {
            chatHistory.splice(lastUserIndex + 1);
            localStorage.setItem('activeInstanceSession', JSON.stringify(currentSession));
            renderPhoneChatView(contactId); 
            triggerPhoneAiReply(contactId);
        } else {
            showCustomAlert('没有可供“重回”的AI回复。');
        }
    });
}

/**
 * 触发手机模拟器内的AI回复
 * @param {string} contactId
 */
async function triggerPhoneAiReply(contactId) {
    if (phoneIsApiReplying) return;

    phoneIsApiReplying = true;
    phoneAbortController = new AbortController();
    renderPhoneChatView(contactId); // 刷新UI以显示加载状态

    try {
        const session = JSON.parse(localStorage.getItem('activeInstanceSession'));
        const apiSettings = JSON.parse(localStorage.getItem('apiSettings')) || {}; // 使用全局API设置
        const archiveData = JSON.parse(localStorage.getItem('archiveData')) || { characters: [] };
        const chatAppData = JSON.parse(localStorage.getItem('chatAppData')) || { contacts: [] };

        const contact = [...archiveData.characters, ...instanceNpcData, ...chatAppData.contacts].find(c => c.id === contactId);

        if (!apiSettings.url || !apiSettings.key || !apiSettings.model) {
            throw new Error('请先在全局API设置中配置有效的 API URL, Key 和 Model！');
        }
        if (!contact) {
            throw new Error('找不到联系人信息。');
        }

        const systemPrompt = `你正在扮演名为 "${contact.name}" 的角色，ta的人设是：${contact.persona}。你现在正在通过手机和用户聊天，请保持人设，并以简短、口语化的方式进行回复。`;
        
        const phoneContextCount = (JSON.parse(localStorage.getItem('instanceAppSettings')) || {}).phoneContextCount || 10;
        const history = (session.phoneChats[contactId] || []).slice(-phoneContextCount).map(msg => ({
            role: msg.sender === 'me' ? 'user' : 'assistant',
            content: msg.text
        }));

        const apiMessages = [{ role: 'system', content: systemPrompt }, ...history];

        const response = await fetch(new URL('/v1/chat/completions', apiSettings.url).href, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiSettings.key}` },
            body: JSON.stringify({
                model: apiSettings.model,
                messages: apiMessages,
                temperature: parseFloat(apiSettings.temp || 0.7),
                stream: false // 手机聊天回复短，非流式即可
            }),
            signal: phoneAbortController.signal
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API 请求失败: ${response.status} ${errorData.error?.message || ''}`);
        }

        const result = await response.json();
        const replyText = result.choices[0].message.content.trim();
        
        if (replyText) {
            const newSession = JSON.parse(localStorage.getItem('activeInstanceSession'));
            newSession.phoneChats[contactId].push({
                id: 'phone_msg_' + generateId(),
                text: replyText,
                sender: 'them',
                timestamp: Date.now()
            });
            localStorage.setItem('activeInstanceSession', JSON.stringify(newSession));
        }

    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error("手机AI回复失败:", error);
            showCustomAlert(`AI响应失败: ${error.message}`);
        }
    } finally {
        phoneIsApiReplying = false;
        renderPhoneChatView(contactId); // 最终刷新UI
    }
}

/**
 * =============================================
 * === 新增：手机模拟器拖拽与缩放逻辑 ===
 * =============================================
 */
let isPhoneInitialized = false;

function makePhoneDraggableAndResizable() {
    if (isPhoneInitialized) return;

    const frame = document.getElementById('phone-simulator-frame');
    const resizeHandle = document.getElementById('phone-resize-handle');
    const screen = document.getElementById('phone-simulator-screen');
    const initialPhoneWidth = 300; // 与CSS中的基础宽度保持一致

    let isDragging = false;
    let isResizing = false;
    let startX, startY, offsetX, offsetY, initialWidth, initialMouseX;

    frame.style.setProperty('--phone-scale', 1);

    // 统一的事件处理函数
    const getCoords = (e) => e.touches ? e.touches[0] : e;

    const onDragStart = (e) => {
        const target = e.target;
        if (target === resizeHandle || screen.contains(target)) return;

        isDragging = true;
        frame.style.cursor = 'grabbing';
        const coords = getCoords(e);
        const rect = frame.getBoundingClientRect();

        // 移除transform以便使用top/left进行精确定位
        frame.style.transition = 'none'; // 拖动时禁用动画
        frame.style.transform = 'none';
        frame.style.left = `${rect.left}px`;
        frame.style.top = `${rect.top}px`;

        offsetX = coords.clientX - rect.left;
        offsetY = coords.clientY - rect.top;

        // 阻止移动端浏览器默认的滚动行为
        if (e.type === 'touchstart') e.preventDefault();
    };

    const onResizeStart = (e) => {
        e.stopPropagation();
        isResizing = true;
        const coords = getCoords(e);
        const rect = frame.getBoundingClientRect();
        
        frame.style.transition = 'none';
        frame.style.transform = 'none';
        frame.style.left = `${rect.left}px`;
        frame.style.top = `${rect.top}px`;

        initialWidth = rect.width;
        initialMouseX = coords.clientX;

        if (e.type === 'touchstart') e.preventDefault();
    };

    const onMove = (e) => {
        if (!isDragging && !isResizing) return;
        const coords = getCoords(e);

        if (isDragging) {
            frame.style.left = `${coords.clientX - offsetX}px`;
            frame.style.top = `${coords.clientY - offsetY}px`;
        }

        if (isResizing) {
            const deltaX = coords.clientX - initialMouseX;
            const newWidth = initialWidth + deltaX;
            if (newWidth > 200) { // 最小尺寸限制
                frame.style.width = `${newWidth}px`;
                frame.style.setProperty('--phone-scale', newWidth / initialPhoneWidth);
            }
        }
    };

    const onEnd = () => {
        isDragging = false;
        isResizing = false;
        frame.style.cursor = 'grab';
        frame.style.transition = ''; // 恢复动画
    };

    // 绑定鼠标事件
    frame.addEventListener('mousedown', onDragStart);
    resizeHandle.addEventListener('mousedown', onResizeStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('mouseleave', onEnd); // 处理鼠标移出窗口的情况

    // 绑定触摸事件
    frame.addEventListener('touchstart', onDragStart, { passive: false });
    resizeHandle.addEventListener('touchstart', onResizeStart, { passive: false });
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);

    isPhoneInitialized = true;
}
/**
 * =============================================
 * === 新增：自动总结核心逻辑 ===
 * =============================================
 */

/**
 * 检查当前对话是否达到总结阈值，如果达到则触发总结。
 * @param {object} session - 当前的副本会话数据
 */
async function checkAndTriggerAutoSummary(session) {
    const summarySettings = (JSON.parse(localStorage.getItem('instanceAppSettings')) || {});
    const threshold = summarySettings.summaryThreshold || 50;
    
    // 阈值为0表示关闭自动总结
    if (threshold <= 0) return;

    // 1. 合并并排序所有消息
    const allMessages = [];
    (session.messages || []).forEach(msg => allMessages.push({ ...msg }));
    if (session.phoneChats) {
        for (const contactId in session.phoneChats) {
            (session.phoneChats[contactId] || []).forEach(msg => allMessages.push({ ...msg }));
        }
    }
    allMessages.sort((a, b) => a.timestamp - b.timestamp);

    // 2. 找到最后一条总结消息的位置
    let lastSummaryIndex = -1;
    for (let i = allMessages.length - 1; i >= 0; i--) {
        if (allMessages[i].type === 'summary') {
            lastSummaryIndex = i;
            break;
        }
    }

    // 3. 计算自上次总结以来的消息数量（只计算用户和AI的普通消息）
    const messagesSinceLastSummary = allMessages
        .slice(lastSummaryIndex + 1)
        .filter(m => !m.type && m.sender); // 过滤掉总结和系统提示等特殊消息

    // 4. 判断是否达到阈值
    if (messagesSinceLastSummary.length >= threshold) {
        showGlobalToast(`对话已达 ${threshold} 条，正在进行后台总结...`, { type: 'info', duration: 3000 });
        await triggerSummaryGeneration(session);
    }
}

/**
 * 触发一次对话总结。
 * @param {object} session - 当前的副本会话数据
 */
async function triggerSummaryGeneration(session) {
    // 1. 获取总结相关的设置
    const summarySettings = (JSON.parse(localStorage.getItem('instanceAppSettings')) || {});
    const defaultPrompt = `你是一个专业的对话总结助手。请根据以下聊天记录，直接返回一段50字以内的精简总结，不要包含任何开头的问候语或结尾的客套话。`;
    const prompt = summarySettings.summaryPrompt || defaultPrompt;

    // 2. 获取API配置
    const presets = JSON.parse(localStorage.getItem('apiPresets')) || {};
    let apiSettings;
    if (summarySettings.apiPreset && presets[summarySettings.apiPreset]) {
        apiSettings = presets[summarySettings.apiPreset];
    } else {
        apiSettings = JSON.parse(localStorage.getItem('apiSettings')) || {};
    }

    if (!apiSettings.url || !apiSettings.key || !apiSettings.model) {
        showGlobalToast('总结失败：未配置有效的API。', { type: 'error' });
        return;
    }
    
    // 3. 准备需要总结的数据
    // 合并并排序所有消息
    const allMessages = [];
    (session.messages || []).forEach(msg => allMessages.push({ ...msg, source: 'instance' }));
    if (session.phoneChats) {
        const archiveData = JSON.parse(localStorage.getItem('archiveData')) || { characters: [] };
        for (const contactId in session.phoneChats) {
            const contact = [...instanceNpcData, ...archiveData.characters].find(c => c.id === contactId);
            const contactName = contact ? contact.name : '未知联系人';
            (session.phoneChats[contactId] || []).forEach(msg => allMessages.push({ ...msg, source: 'phone', contactName }));
        }
    }
    allMessages.sort((a, b) => a.timestamp - b.timestamp);

    // 筛选出未被总结过的普通消息
    const messagesToSummarize = allMessages.filter(m => !m.summarized && !m.type && m.sender);
    if (messagesToSummarize.length === 0) {
        return; // 没有新内容可总结
    }
    
    // 4. 构建API请求体
    const chatLogString = messagesToSummarize.map(msg => {
        let prefix = msg.sender === 'me' ? '我' : 'AI';
        if (msg.source === 'phone') {
            prefix = `[手机|${msg.contactName}] ${prefix}`;
        }
        return `${prefix}: ${msg.text}`;
    }).join('\n');

    const fullUserPrompt = `${prompt}\n\n以下是需要总结的聊天记录：\n\n${chatLogString}`;
    
    // 5. 调用AI
    const summaryText = await getAICompletion(fullUserPrompt, false);

    if (summaryText) {
        // 6. 创建并插入总结消息
        const summaryMessage = {
            id: 'summary_' + generateId(),
            type: 'summary',
            text: summaryText,
            timestamp: Date.now(),
            summarizedMessageIds: messagesToSummarize.map(m => m.id)
        };
        
        // 总结消息应该添加到主线剧情中
        session.messages.push(summaryMessage);

        // 7. 标记已被总结的消息
        const summarizedIdsSet = new Set(messagesToSummarize.map(m => m.id));
        session.messages.forEach(msg => {
            if (summarizedIdsSet.has(msg.id)) msg.summarized = true;
        });
        if (session.phoneChats) {
            for (const contactId in session.phoneChats) {
                session.phoneChats[contactId].forEach(msg => {
                    if (summarizedIdsSet.has(msg.id)) msg.summarized = true;
                });
            }
        }
        
        // 8. 保存并更新UI
        saveInstanceData(); // 假设这是保存副本会话的函数，根据你的代码，应该是 saveActiveInstanceSession
        localStorage.setItem('activeInstanceSession', JSON.stringify(session));
        renderInstanceChatUI(session); // 刷新聊天界面
        showGlobalToast('后台自动总结完成！', { type: 'success' });
    }
}
// 在脚本文件末尾添加以下所有代码

/**
 * =============================================
 * === 副本结算流程核心函数 (新增) ===
 * =============================================
 */

/**
 * 开始副本结算流程的入口函数
 */
async function startSettlementProcess() {
    const loadingOverlay = document.getElementById('instance-settlement-loading-overlay');
    loadingOverlay.classList.add('visible');

    try {
        const session = JSON.parse(localStorage.getItem('activeInstanceSession'));
        if (!session) {
            throw new Error("找不到活动的副本会话数据。");
        }

        // --- 1. AI生成故事梗概 ---
        const storySummary = await generateStorySummary(session);
        if (!storySummary) {
            throw new Error("故事梗概生成失败，请检查API设置并重试。");
        }

        // --- 2. AI生成成就称号 ---
        const achievementTitle = await generateAchievementTitle(storySummary);

        // --- 3. 计算奖励 (非AI) ---
        const rewards = calculateRewards(session);
        
        // --- 核心修改：将结算结果临时存入 session ---
        session.settlement = { storySummary, achievementTitle, rewards };
        localStorage.setItem('activeInstanceSession', JSON.stringify(session));

        // --- 4. 准备并显示最终结算界面 ---
        await populateAndShowSettlementResult(session, storySummary, achievementTitle, rewards, false);

    } catch (error) {
        console.error("结算流程出错:", error);
        showGlobalToast(error.message, { type: 'error', duration: 5000 });
        // 失败后，隐藏加载动画，让用户留在副本内
        loadingOverlay.classList.remove('visible');
    }
}

/**
 * 调用AI生成500字以上的故事梗概
 * @param {object} session - 当前副本会话
 * @returns {Promise<string|null>} - 成功则返回故事梗概，失败返回null
 */
async function generateStorySummary(session) {
    const allSummaries = (session.messages || []).filter(m => m.type === 'summary').map(s => s.text).join('\n');
    
    // 合并所有消息（副本主线 + 手机聊天）
    const allMessages = [];
    (session.messages || []).forEach(msg => allMessages.push({ ...msg, source: 'instance' }));
    if (session.phoneChats) {
        const archiveData = JSON.parse(localStorage.getItem('archiveData')) || { characters: [] };
        for (const contactId in session.phoneChats) {
            const contact = [...instanceNpcData, ...archiveData.characters].find(c => c.id === contactId);
            const contactName = contact ? contact.name : '未知联系人';
            session.phoneChats[contactId].forEach(msg => {
                if (!msg.summarized) allMessages.push({ ...msg, source: 'phone', contactName });
            });
        }
    }
    allMessages.sort((a, b) => a.timestamp - b.timestamp);

    // 筛选出还未被总结过的普通消息
    const unsummarizedMessages = allMessages.filter(m => !m.summarized && !m.type && m.sender);

    const chatLogString = unsummarizedMessages.map(msg => {
        let prefix = msg.sender === 'me' ? '我' : 'AI';
        if (msg.source === 'phone') {
            prefix = `[手机|${msg.contactName}] ${prefix}`;
        }
        return `${prefix}: ${msg.text}`;
    }).join('\n');

    const prompt = `你是一个出色的故事讲述者。请整合以下“历史剧情概要”和“近期对话记录”，重新生成一个500字以上的、连贯流畅的、包含所有重点的完整故事梗概。请以第三人称视角叙述，不要遗漏任何关键情节、人物互动或重要转折。不要包含任何开头的问候语或结尾的客套话。

【历史剧情概要】
${allSummaries || "无"}

【近期对话记录】
${chatLogString}
`;
    
    // 调用全局的AI请求函数
    return await getAICompletion(prompt, false);
}

/**
 * 调用AI生成成就称号
 * @param {string} storySummary - 故事梗概
 * @returns {Promise<string>} - 返回成就称号
 */
async function generateAchievementTitle(storySummary) {
    const prompt = `根据以下故事梗概，为玩家生成一个富有诗意或概括性的、六个字以内的成就称号，类似于“末日救世主”或“深海蔷薇”。请只返回称号本身，不要包含任何多余的解释。

故事梗概：
${storySummary}`;
    try {
        const title = await getAICompletion(prompt, false);
        return title || '平凡的旅人';
    } catch (e) {
        console.error("生成成就失败:", e);
        return '一次冒险'; // 失败时的默认值
    }
}

/**
 * 计算结算奖励（积分、好感度）
 * @param {object} session - 当前副本会话
 * @returns {object} - 包含总积分和好感度变化的对象
 */
function calculateRewards(session) {
    const progressLog = session.progressLog || [];
    const totalPoints = progressLog
        .filter(item => item.type === 'points')
        .reduce((sum, item) => sum + (item.value || 0), 0);
    
    const favorChanges = {};
    if (session.charIds) {
        session.charIds.forEach(charId => {
            const charFavorChange = progressLog
                .filter(item => item.type === 'favor' && item.charId === charId) // 假设日志中包含charId
                .reduce((sum, item) => sum + (item.value || 0), 0);
            if (charFavorChange !== 0) {
                favorChanges[charId] = charFavorChange;
            }
        });
    }

    return { totalPoints, favorChanges };
}

/**
/**
 * 填充并显示最终的结算界面 (新版，支持查看归档)
 * @param {object} session - 副本会话数据或归档数据
 * @param {string} storySummary - 故事梗概
 * @param {string} achievementTitle - 成就称号
 * @param {object} rewards - 结算奖励数据
 * @param {boolean} [isViewingArchive=false] - 是否为查看归档模式
 */
async function populateAndShowSettlementResult(session, storySummary, achievementTitle, rewards, isViewingArchive = false) {
    const loadingOverlay = document.getElementById('instance-settlement-loading-overlay');
    const resultOverlay = document.getElementById('instance-settlement-result-overlay');
    
    // --- 新增：获取按钮容器 ---
    const buttonGroup = resultOverlay.querySelector('.button-group');
    buttonGroup.innerHTML = ''; // 清空旧按钮

    // 填充内容
    const participantsContainer = document.getElementById('settlement-participants');
    const endingResultEl = document.getElementById('settlement-ending-result');
    const achievementEl = document.getElementById('settlement-achievement-title');
    const storySummaryEl = document.getElementById('settlement-story-summary');
    const rewardsContainer = document.getElementById('settlement-rewards');
    const archiveData = JSON.parse(localStorage.getItem('archiveData')) || { user: {}, characters: [] };
    
    participantsContainer.innerHTML = '';
    const userProfile = archiveData.user;
    participantsContainer.innerHTML += `
        <div class="participant-card">
            <div class="participant-avatar" style="background-image: url('${userProfile.avatar}')"></div>
            <span class="participant-name">${escapeHTML(userProfile.name)}</span>
        </div>
    `;
    if (session.charIds) {
        session.charIds.forEach(charId => {
            const charProfile = archiveData.characters.find(c => c.id === charId);
            if(charProfile) {
                participantsContainer.innerHTML += `
                    <div class="participant-card">
                        <div class="participant-avatar" style="background-image: url('${charProfile.avatar}')"></div>
                        <span class="participant-name">${escapeHTML(charProfile.name)}</span>
                    </div>
                `;
            }
        });
    }
    
    endingResultEl.textContent = `结局：${rewards.totalPoints >= 0 ? '成功' : '失败'}`;
    achievementEl.textContent = `成就：${achievementTitle}`;
    storySummaryEl.textContent = storySummary;

    let rewardsHTML = `
        <div class="reward-item">
            <span>总积分</span>
            <span class="value">${rewards.totalPoints > 0 ? '+' : ''}${rewards.totalPoints}</span>
        </div>
    `;
    for (const charId in rewards.favorChanges) {
        const charProfile = archiveData.characters.find(c => c.id === charId);
        const favorChange = rewards.favorChanges[charId];
        if (charProfile) {
            rewardsHTML += `
                <div class="reward-item">
                    <span>${escapeHTML(charProfile.name)} 好感度</span>
                    <span class="value">${favorChange > 0 ? '+' : ''}${favorChange}</span>
                </div>
            `;
        }
    }
    rewardsContainer.innerHTML = rewardsHTML;

    // --- 核心修改：动态添加按钮 ---
    if (isViewingArchive) {
        // 查看归档模式下，添加“回顾”和“关闭”按钮
        buttonGroup.innerHTML = `
            <button id="review-instance-btn" class="modal-button secondary">回顾</button>
            <button id="close-settlement-result-btn" class="modal-button">关闭</button>
        `;
        document.getElementById('review-instance-btn').addEventListener('click', () => {
            resultOverlay.classList.remove('visible');
            showInstanceReview(session.id); // 调用回顾函数
        });
        document.getElementById('close-settlement-result-btn').addEventListener('click', () => {
            resultOverlay.classList.remove('visible');
        });

    } else {
        // 正常结算模式下，只有“确认”按钮
        buttonGroup.innerHTML = `<button id="close-settlement-result-btn" class="modal-button">确认</button>`;
        document.getElementById('close-settlement-result-btn').addEventListener('click', () => {
            resultOverlay.classList.remove('visible');
            archiveAndEndInstance(session);
            renderInstanceList();
        });
    }

    if (loadingOverlay.classList.contains('visible')) {
        loadingOverlay.classList.remove('visible');
    }
    resultOverlay.classList.add('visible');
}
// 在 instance-app.js 文件末尾添加
/**
 * 新增：归档并结束当前副本的函数
 * @param {object} session - 带有结算数据的当前副本会话
 */
function archiveAndEndInstance(session) {
    // 1. 获取要归档的副本的原始数据
    const instanceId = session.instanceId;
    loadInstanceData(); // 确保 instanceData 是最新的
    const instanceIndex = instanceData.findIndex(inst => inst.id === instanceId);
    
    if (instanceIndex === -1) {
        console.error("归档失败：找不到原始副本数据。");
        localStorage.removeItem('activeInstanceSession'); // 即使找不到也清理会话
        return;
    }
    
    const instanceToArchive = instanceData[instanceIndex];
    
    // 2. 加载归档数据
    let archivedInstances = JSON.parse(localStorage.getItem('archivedInstancesData')) || [];

    // 3. 创建完整的归档对象，包含副本信息和结算信息
    const archiveObject = {
        ...instanceToArchive, // 包含 title, coverImage, intro 等
        settlementData: session.settlement, // 将结算数据保存进去
        // 【核心新增】将完整的聊天记录也保存到归档对象中
        messages: session.messages 
    };
    
    // 4. 将新归档对象添加到列表顶部，并从原列表中移除
    archivedInstances.unshift(archiveObject);
    instanceData.splice(instanceIndex, 1);
    
    // 5. 保存更新后的两个列表
    localStorage.setItem('archivedInstancesData', JSON.stringify(archivedInstances));
    saveInstanceData(); // 这个函数会保存 instanceData
    
    showGlobalToast('副本已归档！', { type: 'success' });
    
    // 6. 【核心修改】调用 closeInstanceSession 函数来清理UI并结束会话
    closeInstanceSession('end');
}
// 在 instance-app.js 文件末尾添加
/**
 * 新增：渲染已归档的副本列表页面
 */
function renderArchivedInstancesPage() {
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const archivedData = JSON.parse(localStorage.getItem('archivedInstancesData')) || [];
    
    modalTitle.textContent = '归档副本';
    modalBody.innerHTML = '<div id="instance-list-container"></div>'; // 复用列表容器
    const container = document.getElementById('instance-list-container');
    
    // 隐藏主界面的FAB
    const headerControls = document.getElementById('instance-app-header-controls');
    if (headerControls) headerControls.style.display = 'none';
    const npcFab = document.getElementById('instance-npc-fab');
    if (npcFab) npcFab.classList.remove('visible');

    if (archivedData.length === 0) {
        container.innerHTML = `<span class="empty-text">还没有已结束的副本。</span>`;
        return;
    }

    container.innerHTML = archivedData.map(archive => `
        <div class="instance-card" data-archive-id="${archive.id}">
            <div class="instance-card-title">${escapeHTML(archive.title)}</div>
        </div>
    `).join('');

    // 为卡片绑定新的点击事件
    container.querySelectorAll('.instance-card').forEach(card => {
        card.addEventListener('click', () => {
            showArchivedSettlement(card.dataset.archiveId);
        });
    });

    // **需求4：修改返回按钮逻辑**
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const newCloseBtn = modalCloseBtn.cloneNode(true);
    modalCloseBtn.parentNode.replaceChild(newCloseBtn, modalCloseBtn);
    newCloseBtn.addEventListener('click', () => {
        // 返回到副本主列表
        openInstanceApp({ currentTarget: document.getElementById('app-instance') });
    });
}

/**
 * 新增：显示已归档副本的结算页面
 * @param {string} archiveId - 已归档副本的ID
 */
function showArchivedSettlement(archiveId) {
    const archivedData = JSON.parse(localStorage.getItem('archivedInstancesData')) || [];
    const archive = archivedData.find(a => a.id === archiveId);

    if (archive && archive.settlementData) {
        const { storySummary, achievementTitle, rewards } = archive.settlementData;
        // 调用 populateAndShowSettlementResult 并传入 isViewingArchive = true
        populateAndShowSettlementResult(archive, storySummary, achievementTitle, rewards, true);
    } else {
        showCustomAlert('找不到此归档副本的结算信息。');
    }
}
/**
 * 新增：显示已归档副本的聊天记录回顾界面
 * @param {string} archiveId - 已归档副本的ID
 */
function showInstanceReview(archiveId) {
    const archivedData = JSON.parse(localStorage.getItem('archivedInstancesData')) || [];
    const archive = archivedData.find(a => a.id === archiveId);

    if (!archive || !archive.messages) {
        showCustomAlert('找不到此归档副本的聊天记录。');
        return;
    }

    // 创建一个临时的 session 对象给 renderInstanceChatUI 使用
    const reviewSession = {
        instanceId: archive.id,
        instanceTitle: archive.title,
        messages: archive.messages
        // 其他字段在回顾模式下不需要
    };

    // 渲染UI，此时输入框等元素都还存在
    renderInstanceChatUI(reviewSession);

    // 隐藏不需要的元素
    const chatFooter = document.getElementById('instance-chat-footer');
    if (chatFooter) {
        chatFooter.style.display = 'none';
    }

    // 修改返回按钮的行为，让它只关闭聊天界面
    const backBtn = document.getElementById('instance-chat-back-btn');
    const newBackBtn = backBtn.cloneNode(true);
    backBtn.parentNode.replaceChild(newBackBtn, backBtn);
    newBackBtn.addEventListener('click', () => {
        document.getElementById('instance-chat-container').classList.remove('visible');
        // 返回后，恢复聊天输入框的显示，以防影响正常副本
        if (chatFooter) {
            chatFooter.style.display = 'block'; 
        }
    });

    // 显示聊天容器
    document.getElementById('instance-chat-container').classList.add('visible');
}

/**
 * =============================================
 * === 新增：副本内气泡长按菜单相关函数 ===
 * =============================================
 */

/**
 * 显示副本消息的长按菜单
 * @param {Event} event - 触发的事件 (mousedown 或 touchstart)
 * @param {HTMLElement} targetBubble - 被长按的气泡元素
 */
function showInstanceContextMenu(event, targetBubble) {
    longPressedMessageId = targetBubble.closest('.instance-message-line').querySelector('.instance-chat-bubble').id.replace('instance-msg-bubble-', '');
    if (!longPressedMessageId) return;

    const menu = document.getElementById('instance-message-context-menu');
    menu.classList.add('visible');
    
    // 定位菜单
    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;
    const padding = 10;
    
    let clientX, clientY;
    if (event.touches) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else {
        clientX = event.clientX;
        clientY = event.clientY;
    }

    let top = clientY + padding;
    let left = clientX;

    // 防止菜单超出屏幕
    if (left + menuWidth > window.innerWidth - padding) {
        left = window.innerWidth - menuWidth - padding;
    }
    if (top + menuHeight > window.innerHeight - padding) {
        top = clientY - menuHeight - padding;
    }

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;

    // 添加一次性的点击外部关闭事件
    setTimeout(() => {
        document.addEventListener('click', hideInstanceContextMenu, { once: true });
    }, 0);
}

/**
 * 隐藏副本消息的长按菜单
 */
function hideInstanceContextMenu() {
    const menu = document.getElementById('instance-message-context-menu');
    if (menu) {
        menu.classList.remove('visible');
    }
    longPressedMessageId = null;
}

/**
 * 显示副本消息编辑的专用悬浮窗
 * @param {object} session - 当前副本会话
 * @param {number} messageIndex - 要编辑的消息在数组中的索引
 */
function showInstanceEditModal(session, messageIndex) {
    const overlay = document.getElementById('instance-edit-message-overlay');
    const textarea = document.getElementById('instance-edit-message-textarea');
    const confirmBtn = document.getElementById('confirm-instance-edit-btn');
    const cancelBtn = document.getElementById('cancel-instance-edit-btn');
    
    const messageToEdit = session.messages[messageIndex];
    // 将<br>标签转换回换行符，以便在textarea中正确显示
    textarea.value = messageToEdit.text.replace(/<br\s*\/?>/gi, '\n');

    overlay.classList.add('visible');
    textarea.focus();

    const close = () => overlay.classList.remove('visible');

    // 使用克隆节点法确保事件只绑定一次
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    newConfirmBtn.onclick = () => {
        const newText = textarea.value.trim();
        if (newText) {
            session.messages[messageIndex].text = newText;
            localStorage.setItem('activeInstanceSession', JSON.stringify(session));
            renderInstanceChatUI(session); // 重新渲染以显示更改
        }
        close();
    };

    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    newCancelBtn.onclick = close;

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            close();
        }
    }, { once: true });
}


/**
 * 处理菜单项的点击事件
 * @param {string} action - 'edit' 或 'delete'
 */
function handleInstanceContextMenuAction(action) {
    if (!longPressedMessageId) return;

    const session = JSON.parse(localStorage.getItem('activeInstanceSession'));
    if (!session || !session.messages) return;

    const messageIndex = session.messages.findIndex(m => m.id === longPressedMessageId);
    if (messageIndex === -1) {
        hideInstanceContextMenu();
        return;
    }
    
    if (action === 'edit') {
        showInstanceEditModal(session, messageIndex);
    } else if (action === 'delete') {
        showCustomConfirm('确定要删除这条消息吗？', () => {
            session.messages.splice(messageIndex, 1);
            localStorage.setItem('activeInstanceSession', JSON.stringify(session));
            renderInstanceChatUI(session);
        });
    }

    hideInstanceContextMenu();
}

// 使用 DOMContentLoaded 确保在绑定事件时元素已存在
document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('instance-message-context-menu');
    if (menu) {
        menu.addEventListener('click', (e) => {
            const actionItem = e.target.closest('.instance-context-menu-item');
            if (actionItem) {
                handleInstanceContextMenuAction(actionItem.dataset.action);
            }
        });
    }
});
/**
 * =============================================
 * === 新增：副本App - 提示词预设管理核心逻辑 ===
 * =============================================
 */
const promptPresetManager = {
    STORAGE_KEY: 'instancePromptPresets',
    presets: {},
    currentPresetName: null,
    
    // 初始化管理器，绑定所有UI事件
    init(container) {
        this.container = container;
        this.loadPresets();
        this.bindEvents();
        this.renderPresetSelector();

        // 自动选择上一次的预设
        const lastSelected = localStorage.getItem('lastSelectedPromptPreset');
        if (lastSelected && this.presets[lastSelected]) {
            this.currentPresetName = lastSelected;
            this.container.querySelector('#prompt-preset-select').value = lastSelected;
        }
        this.renderPresetItems();
    },

    // 从LocalStorage加载所有预设
    loadPresets() {
        this.presets = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || {};
    },

    // 保存所有预设到LocalStorage
    savePresets() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.presets));
    },

    // 绑定所有按钮和选择框的事件
    bindEvents() {
        this.container.querySelector('#import-prompt-preset-btn').addEventListener('click', () => {
            this.container.querySelector('#prompt-preset-import-input').click();
        });

        this.container.querySelector('#prompt-preset-import-input').addEventListener('change', (e) => this.handleFileImport(e));
        
        this.container.querySelector('#add-prompt-preset-btn').addEventListener('click', () => this.handleAddNewPreset());

        this.container.querySelector('#prompt-preset-select').addEventListener('change', (e) => {
            this.currentPresetName = e.target.value;
            localStorage.setItem('lastSelectedPromptPreset', this.currentPresetName);
            this.renderPresetItems();
        });

        this.container.querySelector('#delete-prompt-preset-btn').addEventListener('click', () => this.handleDeletePreset());
        
        this.container.querySelector('#add-prompt-entry-btn').addEventListener('click', () => this.handleAddNewEntry());
        
        // 使用事件委托处理条目列表内的所有点击
        const itemsContainer = this.container.querySelector('#prompt-preset-items-container');
        itemsContainer.addEventListener('click', (e) => {
            // 点击头部展开/折叠
            const header = e.target.closest('.prompt-item-header');
            if (header && !e.target.closest('.switch-container')) {
                header.parentElement.classList.toggle('expanded');
            }
            // 点击开关切换状态
            const toggle = e.target.closest('.switch-container input[type="checkbox"]');
            if (toggle) {
                const itemId = toggle.dataset.itemId;
                this.handleToggleEntry(itemId, toggle.checked);
            }
        });
    },

    // 渲染预设选择的下拉框
    renderPresetSelector() {
        const select = this.container.querySelector('#prompt-preset-select');
        select.innerHTML = '<option value="">选择一个预设...</option>';
        for (const name in this.presets) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        }
    },

    // 渲染当前选中预设的所有条目
    renderPresetItems() {
        const container = this.container.querySelector('#prompt-preset-items-container');
        const addEntryBtn = this.container.querySelector('#add-prompt-entry-btn');

        if (!this.currentPresetName || !this.presets[this.currentPresetName]) {
            container.innerHTML = `<span class="empty-text">选择或新建一个预设以开始。</span>`;
            addEntryBtn.style.display = 'none';
            return;
        }
        
        addEntryBtn.style.display = 'block';
        const items = this.presets[this.currentPresetName];
        if (items.length === 0) {
            container.innerHTML = `<span class="empty-text">此预设为空，点击下方按钮添加条目。</span>`;
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="prompt-preset-item" data-id="${item.identifier}">
                <div class="prompt-item-header">
                    <span class="prompt-item-title">${item.name || '无标题'}</span>
                    <label class="switch-container">
                        <input type="checkbox" data-item-id="${item.identifier}" ${item.enabled ? 'checked' : ''}>
                        <span class="switch-slider"></span>
                    </label>
                </div>
                <div class="prompt-item-content">${escapeHTML(item.content)}</div>
            </div>
        `).join('');
    },
    
    // 处理文件导入
    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (!data.prompts || !Array.isArray(data.prompts)) {
                    throw new Error('JSON文件格式无效，缺少 "prompts" 数组。');
                }
                const presetName = file.name.replace('.json', '');
                this.presets[presetName] = data.prompts;
                this.savePresets();
                this.renderPresetSelector();
                this.container.querySelector('#prompt-preset-select').value = presetName;
                this.currentPresetName = presetName;
                this.renderPresetItems();
                showGlobalToast(`预设 "${presetName}" 导入成功！`, { type: 'success' });
            } catch (error) {
                showCustomAlert(`导入失败: ${error.message}`);
            } finally {
                event.target.value = ''; // 重置文件输入框
            }
        };
        reader.readAsText(file);
    },

    // 处理新建预设
    handleAddNewPreset() {
        showCustomPrompt('请输入新预设的名称:', '', (name) => {
            if (name && name.trim()) {
                if (this.presets[name.trim()]) {
                    showCustomAlert('错误：同名预设已存在。');
                    return;
                }
                const newName = name.trim();
                this.presets[newName] = [];
                this.savePresets();
                this.renderPresetSelector();
                this.container.querySelector('#prompt-preset-select').value = newName;
                this.currentPresetName = newName;
                this.renderPresetItems();
            }
        });
    },
    
    // 处理删除预设
    handleDeletePreset() {
        if (!this.currentPresetName) {
            showCustomAlert('请先选择一个要删除的预设。');
            return;
        }
        showCustomConfirm(`确定要删除预设 "${this.currentPresetName}" 吗？此操作不可逆！`, () => {
            delete this.presets[this.currentPresetName];
            this.savePresets();
            this.currentPresetName = null;
            localStorage.removeItem('lastSelectedPromptPreset');
            this.renderPresetSelector();
            this.renderPresetItems();
            showGlobalToast('预设已删除。', { type: 'success' });
        });
    },

    // 处理添加新条目
    handleAddNewEntry() {
        if (!this.currentPresetName) return;
        
        // 这里我们可以复用自定义Prompt，但需要多个输入框，因此最好自定义一个小的表单模态框
        // 为了简化，我们先用两个prompt
        showCustomPrompt('请输入新条目的标题:', '', (title) => {
            if (title && title.trim()) {
                showCustomPrompt('请输入新条目的内容:', '', (content) => {
                    const newItem = {
                        identifier: 'manual_' + generateId(),
                        name: title.trim(),
                        enabled: true,
                        injection_position: 0,
                        injection_depth: 20,
                        role: "system",
                        content: content.trim(),
                    };
                    this.presets[this.currentPresetName].push(newItem);
                    this.savePresets();
                    this.renderPresetItems();
                });
            }
        });
    },

    // 处理条目开关切换
    handleToggleEntry(itemId, isEnabled) {
        if (!this.currentPresetName) return;
        const items = this.presets[this.currentPresetName];
        const item = items.find(i => i.identifier === itemId);
        if (item) {
            item.enabled = isEnabled;
            this.savePresets();
            // 无需重绘，UI已即时响应
            showGlobalToast(`条目 "${item.name}" 已${isEnabled ? '开启' : '关闭'}`, { duration: 1500 });
        }
    }
};
