document.addEventListener('DOMContentLoaded', () => {

    const checkPhoneAppIcon = document.getElementById('app-check-phone');
    if (!checkPhoneAppIcon) return;

    // 状态管理，用于控制返回按钮逻辑
    let currentCheckPhoneView = null; // 'list' or 'simulator'

    // 获取通用模态框的元素
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // 存储原始的关闭事件，以便在退出App时恢复
    let originalCloseHandler = null;

    // 1. 打开联系人列表视图
    function openContactList(clickedElement) {
        currentCheckPhoneView = 'list';
        modalBody.classList.remove('phone-view-body');

        // 获取所有可查看的角色（包括User和其他角色）
        // 确保 archiveData 已经定义（它应该在你的主HTML的<script>中）
        const characters = (window.archiveData && window.archiveData.characters) ? [window.archiveData.user, ...window.archiveData.characters] : [];

        let contactsHTML = '<div class="check-phone-contact-list">';
        if (characters.length > 0) {
            contactsHTML += characters.map(char => `
                <div class="check-phone-contact-item" data-contact-id="${char.id}">
                    <div class="check-phone-avatar" style="background-image: url('${char.avatar}')"></div>
                    <span class="check-phone-name">${escapeHTML(char.name)}</span>
                </div>
            `).join('');
        } else {
            contactsHTML += '<span class="empty-text" style="text-align:center; padding: 40px 0;">档案中没有角色</span>';
        }
        contactsHTML += '</div>';

        openModal('选择要查看的手机', contactsHTML, clickedElement);
    }

    // 2. 打开手机模拟器视图
    function openPhoneSimulator(contact) {
        currentCheckPhoneView = 'simulator';
        modalTitle.textContent = `${contact.name}的手机`;

        // 为模态框body添加特定class以应用新样式
        modalBody.classList.add('phone-view-body');

        modalBody.innerHTML = `
            <div class="phone-simulator-frame">
                <p>正在查看 ${escapeHTML(contact.name)} 的手机内容...</p>
                <p>（后续功能在此处开发）</p>
            </div>
        `;
    }

    // 3. 为“查手机”App图标绑定主入口事件
    checkPhoneAppIcon.addEventListener('click', function(e) {
        // 保存并覆盖原始返回按钮事件
        if (!originalCloseHandler) {
            originalCloseHandler = modalCloseBtn.onclick;
        }
        modalCloseBtn.onclick = handleCheckPhoneBack;
        
        openContactList(e.currentTarget);
    });

    // 4. 使用事件委托处理联系人列表的点击
    modalBody.addEventListener('click', function(e) {
        // 确保该逻辑只在“查手机”的列表视图中生效
        if (currentCheckPhoneView !== 'list') return;

        const contactItem = e.target.closest('.check-phone-contact-item');
        if (contactItem) {
            const contactId = contactItem.dataset.contactId;
            const allProfiles = [window.archiveData.user, ...window.archiveData.characters];
            const selectedContact = allProfiles.find(p => p.id === contactId);

            if (selectedContact) {
                openPhoneSimulator(selectedContact);
            }
        }
    });

    // 5. 自定义的返回按钮处理函数
    function handleCheckPhoneBack() {
        if (currentCheckPhoneView === 'simulator') {
            // 从模拟器视图返回到联系人列表视图
            openContactList(checkPhoneAppIcon);
        } else if (currentCheckPhoneView === 'list') {
            // 从列表视图返回，即关闭整个App
            closeModal();
            // 恢复原始的关闭事件
            modalCloseBtn.onclick = originalCloseHandler;
            currentCheckPhoneView = null;
            originalCloseHandler = null;
        } else {
            // 异常情况，直接关闭
            if(typeof closeModal === 'function') closeModal();
            if(originalCloseHandler) modalCloseBtn.onclick = originalCloseHandler;
            currentCheckPhoneView = null;
            originalCloseHandler = null;
        }
    }
});
