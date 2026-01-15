// ===================================
// === 正则 App 核心逻辑 (regex_app.js) ===
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // --- 数据管理 ---
    let regexAppData = [];
    let isRegexEditMode = false; // 新增：正则App的编辑模式状态
    let draggedElement = null; // 新增：用于拖拽排序
    const REGEX_STORAGE_KEY = 'regexAppData';

    function loadRegexData() {
        regexAppData = JSON.parse(localStorage.getItem(REGEX_STORAGE_KEY)) || [];
    }

    function saveRegexData() {
        localStorage.setItem(REGEX_STORAGE_KEY, JSON.stringify(regexAppData));
    }

    // --- App 入口 ---
    const regexAppIcon = document.getElementById('app-regex');
    if (regexAppIcon) {
        regexAppIcon.addEventListener('click', (e) => openRegexApp(e));
    }

    function openRegexApp(event) {
        loadRegexData();
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
    function renderRegexApp(expandedCategoryId = null) {
        const modalBody = document.getElementById('modal-body');
        const scrollPosition = modalBody.scrollTop; // 保存滚动位置
        modalBody.innerHTML = '';

        if (regexAppData.length === 0) {
            modalBody.innerHTML = `<span class="empty-text" style="text-align:center; display:block; padding: 40px 0;">点击右下角“+”添加第一个分类</span>`;
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

            modalBody.appendChild(categoryEl);
            modalBody.appendChild(itemsContainer);

            // 如果需要保持展开，则添加相应class
            if (expandedCategoryId && category.id === expandedCategoryId) {
                categoryEl.classList.add('expanded');
                itemsContainer.classList.add('visible');
            }
        });

        if (isRegexEditMode) {
            addDragAndDropListeners();
        }

        modalBody.scrollTop = scrollPosition; // 恢复滚动位置
    }

    // 显示添加/编辑规则的表单
    function showRegexForm(categoryId, itemId = null) {
        document.getElementById('regex-app-fab').classList.remove('visible');
        
        const category = regexAppData.find(c => c.id === categoryId);
        const item = itemId ? category.items.find(i => i.id === itemId) : null;
        
        let currentName = item ? item.name : '';
        let currentPattern = item ? item.pattern : '';
        let currentReplacement = item ? item.replacement : '';
        let currentScope = item ? item.scope : { global: false, instance: false, chatapp: [] };

        // 获取聊天联系人列表
        const contacts = (JSON.parse(localStorage.getItem('chatAppData')) || { contacts: [] }).contacts;
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
        showCustomPrompt('请输入新的分类名称：', '', (name) => {
            if (name && name.trim()) {
                regexAppData.unshift({
                    id: 'regex_cat_' + generateId(),
                    name: name.trim(),
                    items: []
                });
                saveRegexData();
                renderRegexApp();
            }
        });
    }

    // 保存规则
    function saveRegexRule(categoryId, itemId) {
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
        
        saveRegexData();
        document.getElementById('modal-title').textContent = '正则';
        document.getElementById('regex-app-fab').classList.add('visible');
        renderRegexApp(categoryId); // 传递categoryId以保持展开
        showGlobalToast('规则已保存！', { type: 'success' });
    }

    // 新增：切换编辑模式
    function toggleRegexEditMode() {
        isRegexEditMode = !isRegexEditMode;
        const editBtn = document.getElementById('regex-edit-btn');
        if (editBtn) {
            editBtn.textContent = isRegexEditMode ? '完成' : '编辑';
        }
        renderRegexApp();
    }
    
    // 新增：拖拽排序功能
    function addDragAndDropListeners() {
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

            draggable.addEventListener('drop', e => {
                e.preventDefault();
                const toElement = e.target.closest('.world-book-category');
                if (!draggedElement || !toElement || draggedElement === toElement) return;

                const fromIndex = parseInt(draggedElement.dataset.index, 10);
                const toIndex = parseInt(toElement.dataset.index, 10);
                
                const [movedItem] = regexAppData.splice(fromIndex, 1);
                regexAppData.splice(toIndex, 0, movedItem);

                saveRegexData();
                renderRegexApp();
            });
        });
    }

    // 主体事件委托 (重构)
    document.getElementById('modal-body').addEventListener('click', (e) => {
        const currentTitle = document.getElementById('modal-title').textContent;
        if (currentTitle !== '正则') return;

        const actionBtn = e.target.closest('[data-action]');
        
        // --- 编辑模式下的操作 ---
        if (isRegexEditMode && actionBtn) {
            const action = actionBtn.dataset.action;
            const categoryEl = actionBtn.closest('.world-book-category');
            const itemEl = actionBtn.closest('.world-book-item');

            if (action === 'rename-category') {
                const categoryId = categoryEl.dataset.categoryId;
                const category = regexAppData.find(c => c.id === categoryId);
                showCustomPrompt('请输入新的分类名称：', category.name, (newName) => {
                    if (newName && newName.trim() !== category.name) {
                        category.name = newName.trim();
                        saveRegexData();
                        renderRegexApp();
                    }
                });
            } else if (action === 'delete-category') {
                const categoryId = categoryEl.dataset.categoryId;
                showCustomConfirm('确定要删除这个分类及其所有规则吗？', () => {
                    regexAppData = regexAppData.filter(c => c.id !== categoryId);
                    saveRegexData();
                    renderRegexApp();
                });
            } else if (action === 'delete-item') {
                const categoryId = itemEl.dataset.categoryId;
                const itemId = itemEl.dataset.itemId;
                showCustomConfirm('确定要删除这个正则规则吗？', () => {
                    const category = regexAppData.find(c => c.id === categoryId);
                    if (category) {
                        category.items = category.items.filter(i => i.id !== itemId);
                        saveRegexData();
                        // 重新渲染并保持当前分类展开
                        renderRegexApp(categoryId);
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
    });

    // 监听模态框头部按钮事件 (新增)
    document.getElementById('modal-header').addEventListener('click', (e) => {
        if (e.target.id === 'regex-edit-btn') {
            toggleRegexEditMode();
        }
    });


    // 监听返回按钮，处理FAB和编辑按钮的显隐
    document.getElementById('modal-close-btn').addEventListener('click', () => {
        const title = document.getElementById('modal-title').textContent;
        const fab = document.getElementById('regex-app-fab');
        const headerControls = document.getElementById('modal-header-controls');
        
        if (title === '正则') {
            if (fab) fab.remove();
            if (headerControls) headerControls.remove();
        } else if (title === '添加正则' || title === '编辑正则') {
            if (fab) fab.classList.add('visible');
            if (headerControls) headerControls.style.display = '';
            document.getElementById('modal-title').textContent = '正则';
            renderRegexApp();
        }
    });
});

// --- 正则应用核心函数 (暴露到全局) ---
window.applyAllRegex = function(originalText, scopeContext) {
    if (typeof originalText !== 'string' || !originalText) {
        return originalText;
    }
    
    let modifiedText = originalText;
    const regexData = JSON.parse(localStorage.getItem('regexAppData')) || [];

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
