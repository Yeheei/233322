// ===================================
// === 正则 App 核心逻辑 (regex_app.js) ===
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // --- 数据管理 ---
    let regexAppData = [];
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

        openModal('正则', '', event.currentTarget);
        renderRegexApp();
    }
    
    // --- 渲染函数 ---

    // 渲染主界面（分类列表）
    function renderRegexApp() {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = '';

        if (regexAppData.length === 0) {
            modalBody.innerHTML = `<span class="empty-text" style="text-align:center; display:block; padding: 40px 0;">点击右下角“+”添加第一个分类</span>`;
            return;
        }

        regexAppData.forEach(category => {
            const categoryEl = document.createElement('div');
            categoryEl.className = 'world-book-category'; // 复用世界书的样式
            categoryEl.dataset.categoryId = category.id;
            categoryEl.innerHTML = `
                <span class="category-title">${escapeHTML(category.name)}</span>
                <svg class="category-arrow" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>
            `;

            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'category-items'; // 复用世界书的样式

            // 添加规则的占位符
            const addItemPlaceholder = document.createElement('div');
            addItemPlaceholder.className = 'add-item-placeholder';
            addItemPlaceholder.textContent = '点击添加正则';
            addItemPlaceholder.dataset.action = 'add-regex';
            addItemPlaceholder.dataset.categoryId = category.id;
            itemsContainer.appendChild(addItemPlaceholder);

            // 渲染已有的规则
            if (category.items && category.items.length > 0) {
                category.items.forEach(item => {
                    const itemEl = document.createElement('div');
                    itemEl.className = 'world-book-item'; // 复用世界书的样式
                    itemEl.dataset.itemId = item.id;
                    itemEl.dataset.categoryId = category.id;
                    itemEl.innerHTML = `
                        <div class="item-title">${escapeHTML(item.name)}</div>
                        <div class="item-content">规则: ${escapeHTML(item.pattern)}</div>
                    `;
                    itemsContainer.appendChild(itemEl);
                });
            }

            modalBody.appendChild(categoryEl);
            modalBody.appendChild(itemsContainer);
        });
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
        renderRegexApp();
        showGlobalToast('规则已保存！', { type: 'success' });
    }

    // 主体事件委托
    document.getElementById('modal-body').addEventListener('click', (e) => {
        if (document.getElementById('modal-title').textContent !== '正则') return;

        const categoryEl = e.target.closest('.world-book-category');
        const addItemPlaceholder = e.target.closest('.add-item-placeholder');
        const itemEl = e.target.closest('.world-book-item');

        if (categoryEl) {
            categoryEl.classList.toggle('expanded');
            categoryEl.nextElementSibling.classList.toggle('visible');
        } else if (addItemPlaceholder) {
            showRegexForm(addItemPlaceholder.dataset.categoryId);
        } else if (itemEl) {
            showRegexForm(itemEl.dataset.categoryId, itemEl.dataset.itemId);
        }
    });

    // 监听返回按钮，处理FAB的显隐
    document.getElementById('modal-close-btn').addEventListener('click', () => {
        const title = document.getElementById('modal-title').textContent;
        if (title === '正则') {
            const fab = document.getElementById('regex-app-fab');
            if(fab) fab.remove(); // 关闭App时移除FAB
        } else if (title === '添加正则' || title === '编辑正则') {
             // 返回主界面时，重新显示FAB
            const fab = document.getElementById('regex-app-fab');
            if(fab) fab.classList.add('visible');
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
