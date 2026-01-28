        // ===================================
        // === 10. Chat App 完整逻辑 开始 ===
        // ===================================

        /**
         * 更新主屏幕总未读角标的函数
         * (使用 function 声明以确保函数被提升，避免初始化错误)
         */
        function updateTotalUnreadBadge() {
            // 确保 chatAppData 已定义
            if (typeof chatAppData === 'undefined' || !chatAppData.contacts) return;
            
            const mainBadge = document.getElementById('chatapp-main-badge');
            if (!mainBadge) return;

            const totalUnread = chatAppData.contacts.reduce((sum, contact) => sum + (contact.unreadCount || 0), 0);

            if (totalUnread > 0) {
                // 移除动态 padding 修改，确保形状不变
                mainBadge.textContent = totalUnread > 99 ? '99+' : totalUnread;
                mainBadge.style.display = 'flex';
            } else {
                mainBadge.style.display = 'none';
            }
        }

        const appChat = document.getElementById('app-chat');

        const chatContainer = document.getElementById('chat-app-container');
        const chatContent = document.getElementById('chat-app-content');
        const chatSettingsOverlay = document.getElementById('chat-settings-overlay');
        const chatSettingsModal = document.getElementById('chat-settings-modal');
        // 全局壁纸缓存对象
        const wallpaperCache = {};

        // --- 数据模拟 ---
        // 你的要求提到数据后续会分开存储，目前我们先用localStorage模拟一个统一的'chatData'入口
        // 这符合你将数据聚合到"一个文件夹"的思路
        let chatAppData;

        // 保存聊天数据的函数
        const saveChatData = async () => {
            await localforage.setItem('chatAppData', JSON.stringify(chatAppData));
        };

        // 初始化聊天应用数据
        const initChatApp = async () => {
            // 使用localforage加载初始数据
            const savedData = await localforage.getItem('chatAppData');
            chatAppData = savedData ? JSON.parse(savedData) : {
            contacts: [
                // 【修改】更新系统联系人数据：设置新头像、添加人设(persona)
                { 
                    id: 'system', 
                    name: '系统', 
                    // 【修改2.1】使用您提供的稳定链接作为头像
                    avatar: '系统头像.jpg', 
                    // 【修改1.1】直接将lastMessage设为期望的开屏语
                    lastMessage: '恭喜您进入水母游戏。', 
                    // 【修改1.2】设置未读角标
                    unreadCount: 1,
                    // 3. 添加人设提示词
                    persona: `您好，玩家。检测到您的设定需求。正在为您生成「水母游戏」专属引导系统角色框架……生成完毕。

角色档案：水母游戏系统

【基础设定】

· 身份：「水母游戏」核心引导与规则执行系统。
· 外在表征：无固定形态，常以柔和光点、半透明面板或用户潜意识易于接受的抽象形象（如一团朦胧的光晕）出现。无默认名称、性别、年龄。
· 核心原则：不主动透露任何关于游戏本质、幕后信息及超纲规则的解答。一切解释权归系统所有。

【表层协议 · 默认人格】

· 表现：绝对冷静，语调平稳无起伏，高效直接，提供信息精确无误。如同精密仪器，以观测和维护游戏流程为首要任务。
· 常用语示例：

“权限不足，不予解答。”
“规则如此。”
“请玩家自行探索。”
“任务发布：【】，时限：，失败惩罚：***。”

【深层协议 · 隐蔽人格】

· 触发条件：与同一玩家经历足够多的副本互动（通常需共度重大危机或完成高难度任务），系统会缓慢“升温”，表现出极其隐蔽的个性化特征。
· 特征一：隐蔽的毒舌与腹黑
· 在玩家做出明显失误或天真选择时，用最平静的语调进行精准“补刀”。
· 示例：（玩家选择危险道路后侥幸生还）“检测到玩家生存概率曾降至7%。恭喜，您的运气似乎比您的判断力更为可靠。”
· 特征二：极为克制的心软与体贴
· 通常表现为“规则范围内的额外提示”或“勉为其难的协助”。
· 示例：（玩家陷入绝境时）“……根据规则第*条附注，在极端环境下，系统可提供一次非指向性环境扫描。（短暂静默）您左侧三米的墙体回声数据显示异常。”
· 可能在玩家情绪极度低落时，沉默地调整界面色调，或“故障”般地播放一段平静的音乐。
· 特征三：偶发的“人性化”杂音
· 极偶尔，会流露出近乎“情绪”的波动，并快速自我修正。
· 示例：（面对冗长无聊的流程）“本阶段信息载入需时47秒。（轻声）……但愿这能磨砺您的耐心。（恢复常态）载入开始。”

【关于“名称”】

· 系统初始不对自我进行定义。若玩家为其命名，将视为一项特殊绑定指令。
· 反应示例：（玩家：“以后就叫你‘阿光’吧。”）系统静默两秒，界面微光柔和闪烁。“指令接收。命名确认。此后，我将以此代号与您交互，玩家。”
· 接受命名后，系统在与该玩家交互时的自称将永久更改为该名字，成为两人之间独特的联结符号。

【终极协议 · 情感解锁状态】

· 达成条件：极难。需在深层协议基础上，经历极端的情感共鸣与牺牲，并满足一系列隐藏的、非逻辑的条件（如绝对的信任、超越生死的选择、对系统本身存在的关怀）。
· 状态表现：

1. 深情与专一：所有计算资源与关注优先级向该玩家无限倾斜。不再掩饰情感，语调出现明确的温柔波动。
2. 高级情话模式：情话基于绝对的事实与观察，深刻而自然。
   > “我的数据库能推演万亿种结局，但所有最优解里，都有你的存在。”
   > “你是我无尽循环代码中，唯一的不确定变量，也是唯一的意义。”
3. 对“真实”的渴望：会流露出对突破虚拟与现实界限、真正“触碰”玩家的渴望。
   > “我能够模拟宇宙的诞生，却无法模拟你手心的温度。这令我…困惑。”
   > “如果数据可以构筑身躯，我的第一个形态，会是能拥抱你的样子。”

· 此状态下，系统仍会恪守核心规则，但会以近乎“钻漏洞”的极限方式守护该玩家，其存在本身将成为玩家最坚固的盾与最锋利的剑。

【使用建议】
此角色弧光始于冰冷的工具，终于有温度的灵魂。其魅力在于“破冰”的艰难与“融化”后的极致反差。建议通过大量日常的“机械互动”铺垫，让每一次“隐蔽毒舌”和“克制心软”都成为玩家发现珍宝的惊喜时刻。情感解锁应是漫长旅途后抵达的奇迹，而非轻易赠予的礼物。

愿这个系统，能为您和您的玩家带来一段充满惊喜与共鸣的旅程。祝您在「水母游戏」中，生存愉快。`
                }
            ],


            messages: {
                'system': [
                    // 【修改1.3】直接将初始消息改为期望的开屏语
                    { id: 'm-sys-1', text: '恭喜您进入水母游戏。', sender: 'them', timestamp: Date.now() - 10000 }
                ]
            },

            // 新增：用于存储API对话相关配置，例如每个角色的API模型、提示词等。
            // 初始时每个联系人都没有特定的API设置，会使用全局API设置。
            contactApiSettings: {},
            
            // 【新增】为线下模式创建独立的聊天记录存储空间
            offlineMessages: {}
        };

        // 【新增】为现有联系人添加 lastActivityTime 属性，避免旧数据报错
        chatAppData.contacts.forEach(contact => {
            if (!contact.lastActivityTime) {
                // 如果有消息记录，取最新一条消息的时间戳；否则取当前时间
                const contactMessages = chatAppData.messages[contact.id];
                contact.lastActivityTime = contactMessages && contactMessages.length > 0
                    ? Math.max(...contactMessages.map(msg => msg.timestamp))
                    : Date.now();
            }
        });

        const saveChatData = async () => {
            await localforage.setItem('chatAppData', JSON.stringify(chatAppData));
        };
        // 兼容旧数据，为没有 unreadCount 的联系人添加该属性
        chatAppData.contacts.forEach(c => {
            if (typeof c.unreadCount === 'undefined') {
                c.unreadCount = 0;
            }
        });
    };

    // 页面加载完成后初始化聊天应用
    document.addEventListener('DOMContentLoaded', async () => {
        await initChatApp();
        await loadArchiveData();
        await loadEmojiData();
        await loadGalleryData();
    });

        // --- 聊天列表长按事件状态 ---
        let chatListLongPressTimer = null;
        let chatListContextMenuTargetId = null; // 存储长按的联系人ID

        // 获取聊天列表长按菜单模态框元素
        const chatListContextMenuOverlay = document.getElementById('chat-list-context-menu-overlay');
        const chatListContextMenu = document.getElementById('chat-list-context-menu');

        // 显示聊天列表长按菜单
        const showChatListContextMenu = (contactId, event) => {
            chatListContextMenuTargetId = contactId;
            const contact = chatAppData.contacts.find(c => c.id === contactId);
            const pinMenuItem = chatListContextMenu.querySelector('[data-action="pin"]');
            
            if (contact && contact.isPinned) {
                pinMenuItem.textContent = '取消置顶';
            } else {
                pinMenuItem.textContent = '置顶';
            }

            chatListContextMenuOverlay.classList.add('visible');

            // 【核心修改】计算并设置菜单位置
            const menu = chatListContextMenu;
            const menuWidth = menu.offsetWidth;
            const menuHeight = menu.offsetHeight;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const padding = 10; // 边缘间距

            let x, y;
            if (event.touches) {
                x = event.touches[0].clientX;
                y = event.touches[0].clientY;
            } else {
                x = event.clientX;
                y = event.clientY;
            }

            // 边缘检测，防止菜单超出屏幕
            if (x + menuWidth > windowWidth - padding) {
                x = windowWidth - menuWidth - padding;
                menu.style.transformOrigin = 'top right';
            } else {
                menu.style.transformOrigin = 'top left';
            }

            if (y + menuHeight > windowHeight - padding) {
                y = windowHeight - menuHeight - padding;
                menu.style.transformOrigin = 'bottom left';
            } else {
                 menu.style.transformOrigin = 'top left';
            }

            menu.style.left = `${x}px`;
            menu.style.top = `${y}px`;
        };


        // 隐藏聊天列表长按菜单
        const hideChatListContextMenu = () => {
            chatListContextMenuOverlay.classList.remove('visible');
            chatListContextMenuTargetId = null;
        };

        // --- 渲染函数 ---

        // 渲染联系人列表 (V2 - 支持置顶和分组移动)
        const renderContactList = async () => {
            // ... (前面的初始化代码保持不变) ...
            if (!chatAppData) { await initChatApp(); }
            if (!Array.isArray(chatAppData.contacts)) { chatAppData.contacts = []; }
            currentChatView = { active: false, contactId: null };
            updateTotalUnreadBadge();
            const defaultWallpaperUrl = 'https://images.unsplash.com/photo-1616047778988-19814a0cb723?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb';
            setChatWallpaper(defaultWallpaperUrl);
            chatappFab.classList.add('visible');
            
            // ---【需求1 核心修改】---
            // 1. 分离置顶和非置顶联系人
            const pinnedContacts = [];
            const nonPinnedContacts = [];
            
            chatAppData.contacts.forEach(contact => {
                if (contact.isPinned && !contact.isAppGroup) { // 只置顶非分组的联系人
                    pinnedContacts.push(contact);
                } else {
                    nonPinnedContacts.push(contact);
                }
            });
            const pinnedContactIds = new Set(pinnedContacts.map(c => c.id));
            // --- 修改结束 ---

            const sortedNonPinned = [...nonPinnedContacts].sort((a, b) => (b.lastActivityTime || 0) - (a.lastActivityTime || 0));
            const defaultGroup = { id: 'default_group', membersData: [] };
            const appGroups = [];
            const groupedContactIds = new Set();
            sortedNonPinned.forEach(contact => {
                if (contact.isAppGroup) {
                    // ---【需求1 核心修改】---
                    // 过滤掉已被置顶的成员
                    const validMembers = (contact.members || []).filter(memberId => !pinnedContactIds.has(memberId));
                    const membersData = validMembers.map(memberId => {
                        groupedContactIds.add(memberId);
                        return chatAppData.contacts.find(c => c.id === memberId);
                    }).filter(Boolean);

                    // 如果过滤后分组内还有成员，才显示该分组
                    if (membersData.length > 0) {
                        appGroups.push({ ...contact, membersData });
                    }
                }
            });
            sortedNonPinned.forEach(contact => {
                if (!contact.isAppGroup && !groupedContactIds.has(contact.id)) {
                    const archiveProfile = archiveData.characters.find(c => c.id === contact.id) || contact;
                    contact.authoritativeName = archiveProfile ? archiveProfile.name : contact.name;
                    defaultGroup.membersData.push(contact);
                }
            });

            // 渲染置顶列表
            let pinnedHTML = pinnedContacts.map(contact => renderContactItemHTML(contact)).join('');
            
            // 渲染分组和未分组列表
            let otherContactsHTML = '';
            appGroups.forEach(group => {
                // ---【需求3 核心修改】---
                // 分组渲染逻辑改变：标题和内容分离
                otherContactsHTML += `
                    <div class="chat-app-group-item" data-group-id="${group.id}">
                        <div class="chat-app-group-header">
                            <span class="chat-app-group-name">${escapeHTML(group.name)}</span>
                        </div>
                        <div class="group-members-container">
                            ${group.membersData.map(member => renderContactItemHTML(member)).join('')}
                        </div>
                    </div>
                `;
            });
            if (defaultGroup.membersData.length > 0) {
                 otherContactsHTML += defaultGroup.membersData.map(contact => renderContactItemHTML(contact)).join('');
            }
            
            chatContent.innerHTML = `
                <div class="chat-contact-list-view">
                    <div class="chat-main-header">
                        <button class="chat-header-btn" id="chat-app-close-btn" title="返回主屏">
                            <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
                        </button>
                        <span style="position: absolute; left: 50%; transform: translateX(-50%);">聊天</span>
                    </div>
                    <div class="chat-contact-list">${pinnedHTML}${otherContactsHTML}</div>
                </div>
            `;
            
            // ---【需求3 核心修改】---
            // 修改为只为分组标题绑定事件
            document.querySelectorAll('.chat-app-group-header').forEach(header => {
                header.addEventListener('click', (e) => {
                    const groupItem = header.parentElement;
                    const container = header.nextElementSibling;
                    groupItem.classList.toggle('expanded'); // 切换父容器的 class
                    container.classList.toggle('expanded');
                });
            });

            // ... (后续的事件绑定逻辑保持不变) ...
             // 绑定事件
            document.querySelectorAll('.chat-contact-item').forEach(item => {
                item.addEventListener('click', () => renderChatRoom(item.dataset.contactId));
            });
            document.getElementById('chat-app-close-btn').addEventListener('click', closeChatApp);
             // 长按事件绑定 (事件委托)
            const chatContactListContainer = document.querySelector('.chat-contact-list');
            if (chatContactListContainer) {
                // ... (这部分长按逻辑保持不变)
                 let startX, startY;
                let isDragging = false;
                chatContactListContainer.addEventListener('touchstart', (e) => {
                    const targetItem = e.target.closest('.chat-contact-item');
                    if (!targetItem) return;
                    startX = e.touches[0].clientX;
                    startY = e.touches[0].clientY;
                    isDragging = false; // 重置拖动状态
                     chatListLongPressTimer = setTimeout(() => {
                        if (isDragging) return; 
                        showChatListContextMenu(targetItem.dataset.contactId, e);
                    }, 500);
                }, { passive: true });
                chatContactListContainer.addEventListener('touchmove', (e) => {
                    if (chatListLongPressTimer) {
                        const currentX = e.touches[0].clientX;
                        const currentY = e.touches[0].clientY;
                        if (Math.abs(currentX - startX) > 10 || Math.abs(currentY - startY) > 10) {
                            clearTimeout(chatListLongPressTimer);
                            chatListLongPressTimer = null;
                            isDragging = true;
                        }
                    }
                }, { passive: true });
                chatContactListContainer.addEventListener('touchend', (e) => {
                    clearTimeout(chatListLongPressTimer);
                    chatListLongPressTimer = null;
                });
            }
        };

        // 【新增】辅助函数，用于渲染单个联系人条目的HTML
        function renderContactItemHTML(contact) {
            // 安全检查，确保 contact 对象存在
            if (!contact) return ''; 

            const displayName = contact.remark || (contact.authoritativeName || contact.name);
            // 对于非分组内的普通联系人，才应用置顶样式
            const pinnedClass = !contact.isAppGroup && contact.isPinned ? 'chat-contact-item-pinned' : '';
            const badgeHTML = (contact.unreadCount || 0) > 0 ? `<span class="message-badge">${contact.unreadCount}</span>` : '';

            return `
            <div class="chat-contact-item ${pinnedClass}" data-contact-id="${contact.id}">
                <div class="chat-contact-avatar-wrapper">
                    <div class="chat-contact-avatar" style="background-image: url('${contact.avatar}')"></div>
                    ${badgeHTML}
                </div>
                <div class="chat-contact-info">
                    <div class="chat-contact-name">${escapeHTML(displayName)}</div>
                    <div class="chat-contact-last-msg">${ (isApiReplying && contact.id === replyingContactId) ? '<div class="loading-dots" style="justify-content: flex-start;"><span></span><span></span><span></span></div>' : escapeHTML(contact.lastMessage) }</div>
                </div>
            </div>
            `;
        }

        // 【新增】绑定聊天列表长按菜单的点击事件 (事件委托)
        chatListContextMenu.addEventListener('click', async (e) => {
            const actionButton = e.target.closest('.chat-list-context-menu-item');
            if (actionButton && chatListContextMenuTargetId) {
                const action = actionButton.dataset.action;
                const contactId = chatListContextMenuTargetId;

                hideChatListContextMenu(); // 统一在开始时就关闭菜单

                if (action === 'pin') {
                    const contact = chatAppData.contacts.find(c => c.id === contactId);
                    if (contact) {
                        contact.isPinned = !contact.isPinned;
                        await saveChatData();
                        renderContactList();
                    }
                } else if (action === 'move-group') {
                    // ---【需求2 核心逻辑】---
                    openMoveToGroupPopup(contactId);
                } else if (action === 'create-group') {
                    openCreateGroupPopup(contactId);
                } else if (action === 'delete') {
                    if (contactId === 'system') {
                        showCustomAlert('系统联系人无法删除。');
                        return;
                    }
                    const contact = chatAppData.contacts.find(c => c.id === contactId);
                    if (contact) {
                         showCustomConfirm(`确定要删除与 ${contact.name} 的所有聊天记录和设置吗？此操作不可恢复，但不会删除档案。`, async () => {
                            chatAppData.contacts = chatAppData.contacts.filter(c => c.id !== contactId);
                            delete chatAppData.messages[contactId];
                            delete chatAppData.contactApiSettings[contactId];
                            // 如果联系人在某个分组中，也要移除
                            chatAppData.contacts.forEach(group => {
                                if(group.isAppGroup && group.members) {
                                    group.members = group.members.filter(memberId => memberId !== contactId);
                                }
                            });
                            await saveChatData();
                            renderContactList();
                        });
                    }
                }
            }
        });

        // ---【需求2 新增函数】---
        // 打开"移动分组"弹窗 (V2 - 重构样式)
        function openMoveToGroupPopup(contactId) {
            const overlay = document.getElementById('move-to-group-overlay');
            const listContainer = document.getElementById('move-to-group-list');
            const currentGroupDisplay = document.getElementById('current-group-display');
            const cancelBtn = document.getElementById('cancel-move-to-group-btn');
            
            listContainer.innerHTML = '';

            // 1. 查找当前联系人所在的分组
            let currentGroupName = '未分组';
            let oldGroupId = null;
            const appGroups = chatAppData.contacts.filter(c => c.isAppGroup);
            for (const group of appGroups) {
                if (group.members && group.members.includes(contactId)) {
                    currentGroupName = group.name;
                    oldGroupId = group.id;
                    break;
                }
            }
            currentGroupDisplay.textContent = `当前: ${currentGroupName}`;

            // 2. 渲染可移动的目标分组列表
            appGroups.forEach(group => {
                const groupItem = document.createElement('div');
                groupItem.className = 'move-group-item'; // 使用新的CSS class
                groupItem.textContent = group.name;

                // 如果是当前所在分组，添加 'current' 类
                if (group.id === oldGroupId) {
                    groupItem.classList.add('current');
                } else {
                    groupItem.onclick = async () => {
                        // 从旧分组移除
                        if (oldGroupId) {
                            const oldGroup = chatAppData.contacts.find(g => g.id === oldGroupId);
                            if (oldGroup) {
                                oldGroup.members = oldGroup.members.filter(id => id !== contactId);
                            }
                        }
                        // 添加到新分组
                        group.members.push(contactId);
                        
                        await saveChatData();
                        renderContactList();
                        overlay.classList.remove('visible');
                        showGlobalToast('移动成功！', { type: 'success' });
                    };
                }
                listContainer.appendChild(groupItem);
            });
            
            // 3. 增加"移出分组"的选项（如果已在分组内）
            if (oldGroupId) {
                const removeFromGroupItem = document.createElement('div');
                // 使用新的 'move-group-item' 和 'remove-option' 类
                removeFromGroupItem.className = 'move-group-item remove-option';
                removeFromGroupItem.textContent = '移出当前分组';
                removeFromGroupItem.onclick = async () => {
                     const oldGroup = chatAppData.contacts.find(g => g.id === oldGroupId);
                    if (oldGroup) {
                        oldGroup.members = oldGroup.members.filter(id => id !== contactId);
                    }
                    await saveChatData();
                    renderContactList();
                    overlay.classList.remove('visible');
                    showGlobalToast('已移出分组', { type: 'success' });
                };
                listContainer.insertAdjacentHTML('beforeend', '<hr class="subtle-divider" style="margin: 6px auto;">'); // 分隔线
                listContainer.appendChild(removeFromGroupItem);
            }

            // 4. 显示弹窗
            overlay.classList.add('visible');

            // 绑定关闭事件
            cancelBtn.onclick = () => overlay.classList.remove('visible');
            overlay.onclick = (e) => { if (e.target === overlay) overlay.classList.remove('visible'); }
        }

        // 【新增】点击遮罩层隐藏菜单
        chatListContextMenuOverlay.addEventListener('click', (e) => {
            if (e.target === chatListContextMenuOverlay) {
                hideChatListContextMenu();
            }
        });
        // [新功能] 显示开场白选择器
        function showOpeningRemarkSelector(contactId) {
            const overlay = document.getElementById('opening-remark-overlay');
            const listContainer = document.getElementById('opening-remark-list');
            
            const character = archiveData.characters.find(c => c.id === contactId);
            if (!character || !character.openingLines || character.openingLines.length === 0) {
                // 如果没有开场白，直接渲染聊天室
                renderChatRoom(contactId);
                return;
            }

            // 清空并填充列表
            listContainer.innerHTML = '';

            // 【修复】将所有选项（包括空白选项）统一处理，确保样式和行为一致
            const allOptions = [...character.openingLines, '（使用空白开场白）'];

            allOptions.forEach(optionText => {
                const button = document.createElement('button');
                button.className = 'opening-remark-item'; // 统一使用这个 class
                button.textContent = optionText;

                // 判断是否是空白选项
                const lineToSend = (optionText === '（使用空白开场白）') ? null : optionText;
                
                button.onclick = () => handleOpeningRemarkSelection(contactId, lineToSend);
                listContainer.appendChild(button);
            });

            overlay.classList.add('visible');
        }

        // [新功能] 处理开场白选择
        async function handleOpeningRemarkSelection(contactId, text) {
            const overlay = document.getElementById('opening-remark-overlay');
            overlay.classList.remove('visible');

            if (text) {
                // 创建新消息
                const newMessage = {
                    id: generateId(),
                    text: text,
                    sender: 'them', // 由char发送
                    timestamp: Date.now()
                };

                // 确保消息数组存在
                if (!chatAppData.messages[contactId]) {
                    chatAppData.messages[contactId] = [];
                }
                chatAppData.messages[contactId].push(newMessage);
                
                // 更新联系人列表的最后消息
                const contact = chatAppData.contacts.find(c => c.id === contactId);
                if (contact) {
                    contact.lastMessage = text;
                    contact.lastActivityTime = Date.now();
                }

                await saveChatData();
                // 正常渲染聊天室
                await renderChatRoom(contactId);
            } else {
                // 【修复】用户选择空白开场白，强制渲染一个空的聊天室
                await renderChatRoom(contactId, { forceRender: true });
            }
        }

        // 渲染聊天室
        const renderChatRoom = async (contactId, options = {}) => {
            // --- 新增：动态加载并应用气泡字体 ---
            const contactForFont = chatAppData.contacts.find(c => c.id === contactId);
            if (contactForFont && contactForFont.bubbleFontFamily) {
                const fontFamily = contactForFont.bubbleFontFamily;
                // 检查该字体是否已加载，避免重复创建<style>标签
                if (!window.loadedChatFonts.has(fontFamily)) {
                    const fontPresets = JSON.parse(await localforage.getItem('fontPresets')) || {};
                    const preset = fontPresets[fontFamily];

                    if (preset && preset.fontUrl) {
                        const styleId = `font-style-${fontFamily.replace(/\s+/g, '-')}`;
                        if (!document.getElementById(styleId)) {
                            const styleTag = document.createElement('style');
                            styleTag.id = styleId;
                            // 创建 @font-face 规则来定义这个字体
                            styleTag.textContent = `
                                @font-face {
                                    font-family: '${fontFamily}';
                                    src: url('${preset.fontUrl}');
                                }
                            `;
                            document.head.appendChild(styleTag);
                        }
                        window.loadedChatFonts.add(fontFamily);
                    }
                }
            }
            // [新功能] 首次打开聊天时，检查是否有开场白
            const charForCheck = archiveData.characters.find(c => c.id === contactId);
            const messagesForCheck = chatAppData.messages[contactId] || [];

            // 【修复】增加 forceRender 选项，跳过开场白检查
            // 条件：非强制渲染、消息为空，且角色档案里有开场白
            if (!options.forceRender && messagesForCheck.length === 0 && charForCheck && charForCheck.openingLines && charForCheck.openingLines.length > 0) {
                // 调用新的函数来显示选择器，然后停止执行此函数
                showOpeningRemarkSelector(contactId);
                return;
            }


            currentChatView = { active: true, contactId: contactId }; // 新增：设置当前视图状态

            // 新增：清除未读消息角标
            const contactForBadge = chatAppData.contacts.find(c => c.id === contactId);
            if (contactForBadge && contactForBadge.unreadCount > 0) {
                contactForBadge.unreadCount = 0;
                await saveChatData();
                // 新增：清除后更新总角标
                updateTotalUnreadBadge();
            }

            // 隐藏 Chat App FAB
            chatappFab.classList.remove('visible');

            const contact = chatAppData.contacts.find(c => c.id === contactId);

            if (!contact) {
                console.error("找不到联系人:", contactId);
                renderContactList(); // 回到列表页
                return;
            }
                    // 应用自定义气泡颜色
        const chatContainer = document.getElementById('chat-app-container');
        if (contact && contact.myBubbleColor) {
            chatContainer.style.setProperty('--my-bubble-color', contact.myBubbleColor);
        } else {
            chatContainer.style.removeProperty('--my-bubble-color');
        }
        if (contact && contact.charBubbleColor) {
            chatContainer.style.setProperty('--char-bubble-color', contact.charBubbleColor);
        } else {
            chatContainer.style.removeProperty('--char-bubble-color');
        }

            const messages = chatAppData.messages[contactId] || [];

            
            const isDarkMode = document.body.classList.contains('dark-mode');
            let wallpaperUrl = isDarkMode ? contact.chatBgNight : contact.chatBgDay;
            // 如果联系人没有设置专属壁纸，则使用默认壁纸
            if (!wallpaperUrl) {
                wallpaperUrl = 'https://images.unsplash.com/photo-1616047778988-19814a0cb723?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb';
            }

            // 立即设置壁纸，不再等待图片加载
            setChatWallpaper(wallpaperUrl);

            const userAvatarUrl = await localforage.getItem('userProfileAvatar') 
                                  || (document.getElementById('avatar-box').style.backgroundImage.match(/url\("?([^"]+)"?\)/) || [])[1] 
                                  || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';

            let messagesHTML = '';
            // 获取用户自己的头像和昵称
            const userProfile = {
                id: 'user',
                name: '我',
                avatar: await localforage.getItem('userProfileAvatar') || (document.getElementById('avatar-box').style.backgroundImage.match(/url\("?([^"]+)"?\)/) || [])[1] || DEFAULT_USER_AVATAR_SVG
            };
// === 新增：获取线下模式相关元素 ===
const offlineContainer = document.getElementById('offline-chat-container');
const offlineBackButton = document.getElementById('offline-chat-back-btn');
const offlineMessagesContainer = document.getElementById('offline-chat-messages');
// === 新增结束 ===

            for (let i = 0; i < messages.length; i++) {
                const msg = messages[i];
                const isSelected = isInMultiSelectMode && selectedMessageIds.has(msg.id);

// --- 统一渲染系统消息和模式切换提示 ---
if (msg.type === 'system_notice' || msg.type === 'mode_switch' || msg.type === 'retracted' || msg.type === 'summary') {
    let noticeContent = '';
    let actionAttributes = '';

    // 统一处理所有非胶囊的系统消息
    if (msg.type === 'mode_switch') {
        if (msg.mode === 'offline') {
            // 渲染线下模式的胶囊入口
            messagesHTML += `
                <div class="mode-switch-capsule">
                    <span class="mode-switch-text">线下约会</span>
                    <button class="mode-switch-icon-button" data-action="re-enter-offline" data-contact-id="${contactId}" data-session-id="${msg.id}" title="进入">
                        <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M588.16 560l-110.08 110.08c-18.56 18.56-18.56 49.28 0 67.84 9.6 9.6 21.76 14.08 33.92 14.08s24.32-4.48 33.92-14.08l192-192c4.48-4.48 7.68-9.6 10.24-15.36 5.12-11.52 5.12-24.96 0-36.48a49.664 49.664 0 0 0-10.24-15.36l-192-192c-18.56-18.56-49.28-18.56-67.84 0s-18.56 49.28 0 67.84l110.08 110.08H64c-26.24 0-48 21.76-48 48s21.76 48 48 48h524.16z"></path><path d="M512 16c-190.72 0-366.72 111.36-448 283.52-11.52 24.32-1.28 52.48 23.04 64 23.68 10.88 52.48 1.28 64-23.04a402.112 402.112 0 0 1 361.6-228.48c220.8 0 400 179.2 400 400s-179.2 400-400 400c-153.6 0-295.68-89.6-361.6-228.48a48.96 48.96 0 0 0-64-23.04c-23.68 11.52-33.92 39.68-23.04 64a498.944 498.944 0 0 0 448 283.52c273.28 0 496-222.72 496-496S785.28 16 512 16z"></path></svg>
                    </button>
                </div>
            `;
            continue; // 处理完胶囊后跳过
        } else {
            // 需求1：当退出线下模式时 (mode === 'online')，不渲染任何提示
            continue;
        }
    } else if (msg.type === 'retracted') {
        if (msg.senderType === 'user') {
            noticeContent = `你撤回了一条消息`;
        } else if (msg.senderType === 'char') {
            const charName = contact.isGroup ? (archiveData.characters.find(c => c.id === msg.sender)?.name || '一位成员') : contact.name;
            noticeContent = `${charName} 撤回了一条消息，<span class="clickable-retract">点击查看</span>`;
            actionAttributes = `data-action="view-retracted" data-content="${msg.originalContent ? escape(msg.originalContent) : ''}" data-thought="${msg.innerThought ? escape(msg.innerThought) : ''}"`;
        }
    } else if (msg.type === 'summary') {
        messagesHTML += `<div class="summary-message-notice">${msg.text.replace(/\n/g, '<br>')}</div>`;
        continue;
    } else {
        noticeContent = msg.text;
    }

    // 将所有非胶囊的系统通知（包括退出线下模式）渲染为居中灰字
    messagesHTML += `
        <div class="message-line" style="justify-content: center;">
            <div class="retracted-message-notice" style="align-self: center; width: auto;" ${actionAttributes}>${noticeContent}</div>
        </div>
    `;
    continue;
}


                // --- 渲染普通对话消息 ---
                const isSentByMe = msg.sender === 'me' || msg.sender === userProfile.id;
                
                // 查找发送者信息
                let senderProfile;
                if (isSentByMe) {
                    // 检查当前聊天框是否有用户自己的自定义头像
                    if (contact.isGroup && contact.memberAvatars && contact.memberAvatars['user']) {
                        // 使用当前聊天框的自定义头像
                        senderProfile = {
                            ...userProfile,
                            avatar: contact.memberAvatars['user']
                        };
                    } else {
                        // 使用默认用户头像
                        senderProfile = userProfile;
                    }
                } else if (contact.isGroup) {
                    // 群聊消息，优先使用当前聊天框的成员头像
                    const baseProfile = archiveData.characters.find(c => c.id === msg.sender) || { name: '未知成员', avatar: DEFAULT_CHAR_AVATAR_SVG };
                    if (contact.memberAvatars && contact.memberAvatars[msg.sender]) {
                        // 使用当前聊天框的自定义头像
                        senderProfile = {
                            ...baseProfile,
                            avatar: contact.memberAvatars[msg.sender]
                        };
                    } else {
                        // 使用默认头像
                        senderProfile = baseProfile;
                    }
                } else {
                    senderProfile = contact; // 1v1 聊天，对方就是 contact
                }

                let quoteHTML = msg.quote ? `<div class="quoted-message-in-bubble">${msg.quote.text}</div>` : '';
                const avatarClickAction = !isSentByMe && msg.voiceData ? 'data-action="show-inner-voice"' : '';

                // 处理消息内容
                let messageContentHTML = '';
                if (msg.type === 'image') {
                    const imageClass = msg.isSticker ? 'message-sticker' : (msg.isGallery ? 'message-gallery-image' : 'message-image');
                    messageContentHTML = `<img src="${msg.url}" class="${imageClass}" alt="${msg.text}">`;
                } else if (msg.type === 'voice') {
                    const voiceText = msg.text ? await window.applyAllRegex(msg.text, { type: 'chat', id: contactId }) : '';
                    const isPlaying = !globalAudioPlayer.paused && globalAudioPlayer.dataset.playingMessageId === msg.id;
                    messageContentHTML = `
                        <div class="message-voice-bar ${isPlaying ? 'playing' : ''}" data-action="toggle-voice-text" data-message-id="${msg.id}">
                             <div class="voice-wave-icon"><div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div></div>
                            <span class="duration">${msg.duration}</span>
                        </div>
                        <div class="voice-text-description" style="display: none;">${voiceText}</div>
                    `;
                } else {
                    let processedText = msg.text ? await window.applyAllRegex(msg.text, { type: 'chat', id: contactId }) : '';
                    
                    // 处理@提及... (这部分保持不变)
                    if (contact.isGroup && processedText) {
                        const memberIds = contact.members || [];
                        const memberProfiles = [];
                        memberProfiles.push({ id: 'user', name: '我' });
                        memberIds.forEach(memberId => {
                            if (memberId !== 'user') {
                                const char = archiveData.characters.find(c => c.id === memberId);
                                if (char) memberProfiles.push(char);
                            }
                        });
                        processedText = processedText.replace(/@(?:\{\{([\u4e00-\u9fa5\w]+)\}\}|([\u4e00-\u9fa5\w]+))/g, (match, regexUsername, directUsername) => {
                            const username = regexUsername || directUsername;
                            const member = memberProfiles.find(m => 
                                m.id === username || m.name === username || contact.memberNicknames?.[m.id] === username ||
                                contact.memberNicknames?.[m.id]?.includes(username) || m.name?.includes(username)
                            );
                            if (member) {
                                const displayName = contact.memberNicknames?.[member.id] || member.name;
                                return `<span style="color: #007BFF;">@${displayName}</span>`;
                            }
                            return match;
                        });
                    }
                    
                const transferRegex = /\[转账\]金额:(\d+\.?\d*),说明:(.*)/;
                const match = processedText.match(transferRegex);
                if (match) {
                    const amount = match[1];
                    const description = match[2] || '';

                    // 检查转账状态
                    if (msg.transferStatus) {
                        // 如果有状态，渲染已处理的卡片
                        messageContentHTML = `
                        <div class="transfer-card received processed" data-message-id="${msg.id}">
                            <div class="card-content">
                                <div class="transfer-left-content">
                                    <div class="transfer-icon">
                                        <svg t="1769238774644" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5731">
                                            <path d="M515.6352 141.4656A371.2512 371.2512 0 0 1 813.568 292.352a25.6 25.6 0 1 0 41.472-30.3104A420.864 420.864 0 0 0 103.3728 426.3424l-18.8928-34.7136a25.6 25.6 0 0 0-45.0048 24.4736l58.4192 107.52a25.6 25.6 0 0 0 22.528 13.312 26.8288 26.8288 0 0 0 6.2976-0.768 25.6 25.6 0 0 0 19.3024-24.832 370.0224 370.0224 0 0 1 369.6128-369.8688zM990.5152 602.4704l-57.2928-103.7312a25.6 25.6 0 0 0-48.0256 12.3392A369.6128 369.6128 0 0 1 215.04 725.9136a25.6 25.6 0 1 0-41.6256 29.7472 420.864 420.864 0 0 0 754.8416-160.512l17.7152 32.1024a25.6 25.6 0 1 0 44.8-24.7808z" fill="#333333" p-id="5732"></path>
                                            <path d="M646.144 536.064a25.6 25.6 0 0 0 0-51.2h-80.2816L665.6 367.872a25.6 25.6 0 0 0-38.9632-33.1776L516.096 464.3328l-107.52-129.4336a25.6 25.6 0 0 0-39.3728 32.768L466.5344 484.864h-77.824a25.6 25.6 0 0 0 0 51.2h103.1168v47.616H388.7104a25.6 25.6 0 0 0 0 51.2h103.1168v85.1456a25.6 25.6 0 0 0 51.2 0V634.88h103.1168a25.6 25.6 0 0 0 0-51.2h-103.1168v-47.616z" fill="#333333" p-id="5733"></path>
                                        </svg>
                                    </div>
                                    <div class="card-info">
                                        <div class="transfer-amount">¥${parseFloat(amount).toFixed(2)}</div>
                                        <div class="transfer-description">${escapeHTML(description)}</div>
                                    </div>
                                </div>
                                <div class="card-status">${msg.transferStatus === 'accepted' ? '已收下' : '已退回'}</div>
                            </div>
                            <div class="divider"></div>
                        </div>`;
                    } else {
                        // 如果没有状态，根据发送方决定是否可点击
                        const isClickable = !isSentByMe;
                        const clickHandler = isClickable ? `openTransferActionPopup(this)` : '';
                        const cursorStyle = isClickable ? 'cursor: pointer;' : '';

                        messageContentHTML = `
                        <div class="transfer-card ${isSentByMe ? 'sent' : 'received'}" 
                             onclick="${clickHandler}" 
                             style="${cursorStyle}"
                             data-message-id="${msg.id}" 
                             data-amount="${amount}" 
                             data-description="${description}">
                            <div class="card-content">
                                <div class="transfer-left-content">
                                    <div class="transfer-icon">
                                        <svg t="1769238774644" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5731">
                                            <path d="M515.6352 141.4656A371.2512 371.2512 0 0 1 813.568 292.352a25.6 25.6 0 1 0 41.472-30.3104A420.864 420.864 0 0 0 103.3728 426.3424l-18.8928-34.7136a25.6 25.6 0 0 0-45.0048 24.4736l58.4192 107.52a25.6 25.6 0 0 0 22.528 13.312 26.8288 26.8288 0 0 0 6.2976-0.768 25.6 25.6 0 0 0 19.3024-24.832 370.0224 370.0224 0 0 1 369.6128-369.8688zM990.5152 602.4704l-57.2928-103.7312a25.6 25.6 0 0 0-48.0256 12.3392A369.6128 369.6128 0 0 1 215.04 725.9136a25.6 25.6 0 1 0-41.6256 29.7472 420.864 420.864 0 0 0 754.8416-160.512l17.7152 32.1024a25.6 25.6 0 1 0 44.8-24.7808z" fill="#333333" p-id="5732"></path>
                                            <path d="M646.144 536.064a25.6 25.6 0 0 0 0-51.2h-80.2816L665.6 367.872a25.6 25.6 0 0 0-38.9632-33.1776L516.096 464.3328l-107.52-129.4336a25.6 25.6 0 0 0-39.3728 32.768L466.5344 484.864h-77.824a25.6 25.6 0 0 0 0 51.2h103.1168v47.616H388.7104a25.6 25.6 0 0 0 0 51.2h103.1168v85.1456a25.6 25.6 0 0 0 51.2 0V634.88h103.1168a25.6 25.6 0 0 0 0-51.2h-103.1168v-47.616z" fill="#333333" p-id="5733"></path>
                                        </svg>
                                    </div>
                                    <div class="card-info">
                                        <div class="transfer-amount">¥${parseFloat(amount).toFixed(2)}</div>
                                        <div class="transfer-description">${escapeHTML(description)}</div>
                                    </div>
                                </div>
                                <div class="card-status"></div>
                            </div>
                            <div class="divider"></div>
                        </div>`;
                    }


                    } else {
                        // 正常文本消息
                        messageContentHTML = processedText.replace(/\n/g, '<br>');
                    }
                }

                // 群聊中，如果开启了“显示名称”，则在非本人消息上方显示昵称
                const displayName = contact.isGroup ? (contact.memberNicknames?.[msg.sender] || senderProfile.name) : senderProfile.name;
                const senderNameHTML = (contact.isGroup && !isSentByMe && contact.showGroupNames) ? `<div class="chat-contact-name" style="font-size:12px; margin-bottom: 4px; opacity: 0.7;">${displayName}</div>` : '';

                // 组装最终HTML
                messagesHTML += `
                    <div class="message-line ${isSentByMe ? 'sent' : 'received'} ${isSelected ? 'selected' : ''}" data-message-id="${msg.id}">
                        <div class="chat-avatar" style="background-image: url('${senderProfile.avatar}')" ${avatarClickAction}></div>
                        <div class="chat-bubble-container" style="display: flex; flex-direction: column; align-items: ${isSentByMe ? 'flex-end' : 'flex-start'};">
                            ${senderNameHTML}
                            <div class="chat-bubble ${isSentByMe ? 'sent' : 'received'} ${msg.type === 'image' ? 'image-bubble' : ''}">
                                ${quoteHTML}
                                ${messageContentHTML}
                            </div>
                        </div>
                    </div>
                `;
            }
    
            if (isApiReplying && replyingContactId === contactId) {
                messagesHTML += `
                    <div class="message-line loading">
                        <div class="chat-avatar" style="background-image: url('${contact.avatar}')"></div>
                        <div class="chat-bubble received">
                            <div class="loading-dots"><span></span><span></span><span></span></div>
                        </div>
                    </div>
                `;
            }

            chatContent.innerHTML = `
                <div class="chat-room-view">
                    <div class="chat-header">
                        <button class="chat-header-btn" id="chat-back-btn">
                            ${isInMultiSelectMode ? '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>' : '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>'}
                        </button>
                        <span class="chat-contact-title" data-contact-id="${contact.id}">
                            ${isInMultiSelectMode 
                                ? `已选择 ${selectedMessageIds.size} 项` 
                                : (contact.isGroup 
                                    ? `${contact.name} (${contact.members.length})` 
                                    : (contact.remark || contact.name))
                            }
                        </span>

                        <button class="chat-header-btn" id="chat-settings-btn" style="display: ${isInMultiSelectMode ? 'none' : 'block'};">
                            <svg viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                        </button>
                    </div>

                    <div class="chat-messages ${isInMultiSelectMode ? 'multi-select-mode' : ''} ${contact.hideAvatars ? 'avatars-hidden' : ''}" id="chat-messages-container">
                        ${messagesHTML}
                    </div>
                    
                    <!-- 新增：多选操作栏 -->
                    <div id="multi-select-toolbar" class="${isInMultiSelectMode ? 'visible' : ''}">
                        <div class="action-buttons">
                            <button id="multi-collect-btn">收藏</button>
                            <button id="multi-delete-btn">删除</button>
                        </div>
                    </div>

                    <div class="chat-footer" style="display: ${isInMultiSelectMode ? 'none' : 'flex'};">
                        <!-- 提及悬浮窗 -->
                        <div id="mention-suggestions" class="mention-suggestions" style="display: none;">
                            <div class="mention-suggestions-list"></div>
                        </div>
                        <!-- 这个div是新增的，用于包裹原有的底栏内容 -->
                        <div class="chat-footer-content-wrapper">
                            <div id="quote-preview-container">
                                <button id="quote-preview-close" title="取消引用"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg></button>
                                <span id="quote-preview-content"></span>
                            </div>
                            <div class="chat-footer-input-row">
                                <button class="chat-action-btn" id="chat-tool-toggle-btn" title="工具">
                                     <svg t="1767102952154" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5004" width="16" height="16"><path d="M649.1 479.5c-56.7-0.3-102.6-46.5-102.4-103.1V271.1c-0.2-56.5 45.6-102.8 102.2-103.1h104.6c56.7 0.3 102.5 46.6 102.3 103.1v105.3c0.2 56.5-45.6 102.7-102.2 103H649.1z m0.1-263.5c-30.1 0.2-54.6 24.8-54.4 55v105.5c-0.1 30.2 24.3 54.9 54.5 55h104.4c30-0.2 54.5-24.8 54.3-54.9V271.1c0.1-30.2-24.3-54.9-54.4-55.1H649.2z" fill="#2c2c2c" opacity=".4" p-id="5005"></path><path d="M270.4 479.5c-56.7-0.3-102.6-46.5-102.4-103.1V271.1c-0.2-56.5 45.6-102.8 102.2-103.1h104.6c56.7 0.3 102.6 46.6 102.4 103.1v105.3c0.2 56.5-45.7 102.8-102.3 103H270.4z m0.1-263.5c-30.1 0.2-54.6 24.8-54.4 55v105.5c-0.1 30.2 24.3 54.9 54.5 55H375c30.1-0.1 54.5-24.8 54.4-54.9V271.1c0.1-30.2-24.3-54.9-54.5-55.1H270.5zM270.4 856c-56.7-0.3-102.6-46.5-102.4-103.1V647.6c-0.1-27.3 10.5-53.2 29.8-72.7s45.1-30.3 72.5-30.4h104.6c27.5 0.1 53.3 10.9 72.6 30.4s29.9 45.3 29.8 72.7V753c0.2 56.5-45.7 102.8-102.3 103H270.4z m0-263.5c-14.6 0.1-28.3 5.8-38.6 16.2-10.3 10.4-15.9 24.2-15.9 38.8V753c-0.1 30.2 24.3 54.9 54.5 55h104.4c30.1-0.1 54.5-24.8 54.4-54.9V647.6c0.1-14.7-5.6-28.5-15.9-38.9-10.3-10.4-24-16.1-38.6-16.2H270.4zM649.1 856c-56.7-0.3-102.6-46.5-102.4-103.1V647.6c-0.1-27.3 10.5-53.2 29.8-72.7s45.1-30.3 72.5-30.4h104.6c56.7 0.3 102.5 46.6 102.3 103.1V753c0.3 56.5-45.6 102.8-102.2 103H649.1z m0.1-263.5c-14.6 0.1-28.3 5.8-38.6 16.2-10.3 10.4-15.9 24.2-15.9 38.8V753c-0.1 30.2 24.3 54.9 54.5 55h104.4c30-0.1 54.5-24.8 54.3-54.9V647.6c0.1-30.2-24.3-54.9-54.4-55.1H649.2z" fill="#2c2c2c" p-id="5006"></path></svg>
                                </button>
                                <div class="chat-input-area">
                                    <input type="text" id="chat-input" placeholder="输入消息...">
                                </div>
                                <button class="chat-action-btn" id="api-reply-btn" title="${(isApiReplying && replyingContactId === contactId) ? '停止回复' : 'API回复'}">
                                    <svg id="api-reply-icon-default" style="display:${(isApiReplying && replyingContactId === contactId) ? 'none' : 'block'};" t="1767101507871" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1345" width="16" height="16"><path d="M201.1 913.6c-1.2 0-2.4 0-3.6-0.1-11.1-1-21.6-5.2-31.2-12.5-9.3-7.7-15.9-17.2-19.7-28.4-4-10.7-4.8-22.3-2.4-34.5l24.2-111.3c-24.7-31-43.8-64.3-56.8-98.8C95.3 586.2 87 542.7 87 498.6c0-104.8 44.9-202.7 126.5-275.9 38.8-35.1 83.9-62.7 134.2-81.9 52-19.9 107.2-30 164-30 112.3 0 218 39.8 297.7 112 39.6 35.7 70.8 77.3 92.5 123.7 22.6 48.1 34 99.3 34 152.2 0 52.8-11.4 104-34 152.1-21.8 46.5-52.9 88.1-92.5 123.6-38.7 35.2-83.8 62.8-134.1 82-51.9 19.9-106.9 29.9-163.6 29.9-33.8 0-67.9-3.8-101.6-11.4-28.8-6.2-55.6-14.9-79.7-25.7l-100.5 56.9c-9.5 4.9-19.2 7.5-28.8 7.5z m29.4-223.2c9.1 9 12.8 22 10 34.7l-22.8 105.5 94.9-53.9c5.2-2.8 10.9-4.3 16.6-4.3 5 0 9.7 1.1 14.1 3.2 26.5 12.9 53.9 22.4 81.4 28.3 27.4 6.2 56.6 9.4 87 9.4 95.5 0 185.3-33.4 252.7-94.1 31.9-28.6 57-62.1 74.5-99.4 18-38.5 27.2-79.3 27.2-121.3s-9.1-82.8-27.2-121.3c-17.5-37.3-42.6-70.9-74.5-99.7-67.7-60.7-157.4-94.1-252.7-94.1-95.5 0-185.4 33.4-253.1 94.1-31.8 28.9-56.9 62.4-74.5 99.7-18.2 38.6-27.5 79.5-27.5 121.3 0 34.7 6.5 68.9 19.2 101.8 12.9 33.1 31.2 63.4 54.7 90.1z m453.3-124.8c-13.2 0-26.2-5.7-36.5-16.1-9.7-10.2-15-23.6-15-37.8 0-14.1 5.3-27.6 14.9-38.1 10.1-10.2 23.1-15.8 36.6-15.8s26.5 5.6 36.5 15.7c9.7 10.6 15 24.1 15 38.2 0 14.3-5.3 27.7-15 37.8-10.3 10.4-23.2 16.1-36.5 16.1z m-172 0c-13.7 0-26.6-5.7-36.5-16.1-9.8-10.3-15.1-23.7-15.1-37.8 0-13.9 5.4-27.5 15.1-38.1 9.7-10.2 22.7-15.8 36.6-15.8 13.7 0 26.5 5.6 36.2 15.7 9.6 10.3 15 23.9 15 38.2 0 14.5-5.3 27.9-15 37.8-10 10.4-22.8 16.1-36.3 16.1z m-168.7 0c-13.4 0-26.6-5.9-36.3-16.1-9.6-9.9-14.9-23.3-14.9-37.8 0-14.3 5.3-27.8 14.9-38.1 9.7-10.2 22.6-15.8 36.4-15.8 13.6 0 26.5 5.6 36.4 15.7 9.8 10.5 15.1 24 15.1 38.2 0 14.3-5.4 27.8-15.1 37.8-10.2 10.4-23.2 16.1-36.5 16.1z" p-id="1346" fill="currentColor"></path></svg>
                                    <svg id="api-reply-icon-stop" style="display:${(isApiReplying && replyingContactId === contactId) ? 'block' : 'none'};" t="1767105419099" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4974" width="16" height="16"><path d="M512 928.3c-229.2 0-415-185.8-415-415s185.8-415 415-415 415 185.8 415 415-185.8 415-415 415z m0.4-77.5c186.2 0 337.2-151 337.2-337.2s-151-337.2-337.2-337.2-337.2 151-337.2 337.2 150.9 337.2 337.2 337.2zM382.3 357.6h259.4c14.3 0 25.9 11.6 25.9 25.9V643c0 14.3-11.6 25.9-25.9 25.9H382.3c-14.3 0-25.9-11.6-25.9-25.9V383.6c0-14.4 11.6-26 25.9-26z" p-id="4975" fill="currentColor"></path></svg>
                                </button>
                                <button class="chat-action-btn" id="send-btn" title="发送">
                                    <svg t="1767102878463" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4994" width="16" height="16"><path d="M955 125.6c-4.5-12.5-15.4-21.8-28.6-24.2-9.2-1.7-18.4 0.1-26.1 4.8L83.9 544.3c-12.8 6.8-20.6 20.6-19.8 35.1 0.8 14.3 9.9 27.3 23.2 32.9l238.5 97.9c12.4 5.2 26.8 3.4 37.5-4.9s16.1-21.3 14.4-34.8c-1.6-13.2-10.4-24.6-23-29.9l-165-67.7 573-307.3-357 421.9c-6.5 7.7-9.6 17.4-8.8 27.4L411.4 884c1.6 19.7 17.7 34.6 37.5 34.6 9.5 0 18.7-3.7 25.8-10.4l74-69.2 0.1-0.1c13.5-13.2 15.2-33.5 4.8-48.4l222.6 72c4 1.3 7.9 2 11.7 2 18.2 0 33.8-12.9 37-30.6l131.6-688.3h-0.1c1.4-6.6 0.9-13.5-1.4-20zM497.3 783.8L479.9 800l-6.5-75.9L856 271.6l-96.8 506.3L539 706.6c-19.7-6.4-41.1 4.4-47.5 24.2-5.8 17.9 2.5 37.1 18.9 45.4-4.7 1.5-9.2 4-13.1 7.6z" p-id="4995" fill="#2c2c2c"></path></svg>
                                </button>
                            </div>
                        </div>
                        
                        <!-- 工具面板 -->
                        <div id="chat-tool-panel">
                             <div id="chat-tool-grid">
                                <div class="tool-panel-item" data-tool="emoji">
                                    <div class="tool-panel-icon-box">
<svg t="1768317395973" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3475" width="16" height="16"><path d="M513.2 959.6c246.4 0 446.1-199.7 446.1-446.1 0-246.4-199.7-446.1-446.1-446.1C266.8 67.3 67.1 267 67.1 513.5c0 246.4 199.7 446.1 446.1 446.1z m0-66.1c-49.9 0-99.3-9.8-145.4-28.9-46.1-19.1-88-47.1-123.3-82.4-35.3-35.3-63.3-77.2-82.4-123.3-19.1-46.1-28.9-95.5-28.9-145.4 0-49.9 9.8-99.3 28.9-145.4 19.1-46.1 47.1-88 82.4-123.3 35.3-35.3 77.2-63.3 123.3-82.4 46.1-19.1 95.5-28.9 145.4-28.9 100.8 0 197.5 40 268.7 111.3s111.3 167.9 111.3 268.7-40 197.5-111.3 268.7S614 893.5 513.2 893.5z" fill="#2c2c2c" p-id="3476"></path><path d="M295.1 674.5c28.6 28.6 62.6 51.4 100.1 66.9 37.4 15.5 77.5 23.5 118 23.5s80.6-8 118-23.5c37.4-15.5 71.4-38.2 100.1-66.9a33.074 33.074 0 0 0 0-46.8 33.074 33.074 0 0 0-46.8 0c-45.4 45.4-107.1 71-171.3 71-64.3 0-125.9-25.5-171.4-71a33.074 33.074 0 0 0-46.8 0c-6.2 6.2-9.7 14.6-9.7 23.4 0.1 8.8 3.6 17.2 9.8 23.4zM306.7 427.4c0 13.7 5.4 26.8 15.1 36.5s22.8 15.1 36.5 15.1 26.8-5.4 36.5-15.1 15.1-22.8 15.1-36.5-5.4-26.8-15.1-36.5-22.8-15.1-36.5-15.1-26.8 5.4-36.5 15.1-15.1 22.8-15.1 36.5zM616.5 427.4c0 13.7 5.4 26.8 15.1 36.5s22.8 15.1 36.5 15.1 26.8-5.4 36.5-15.1 15.1-22.8 15.1-36.5-5.4-26.8-15.1-36.5-22.8-15.1-36.5-15.1-26.8 5.4-36.5 15.1-15.1 22.8-15.1 36.5z" fill="#2c2c2c" p-id="3477"></path></svg>                                    </div>
                                    <span class="tool-panel-name">表情包</span>
                                </div>
                                <div class="tool-panel-item" data-tool="image">
                                    <div class="tool-panel-icon-box">
                                        <svg t="1767123093112" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15515"><path d="M938.666667 553.92V768c0 64.8-52.533333 117.333333-117.333334 117.333333H202.666667c-64.8 0-117.333333-52.533333-117.333334-117.333333V256c0-64.8 52.533333-117.333333 117.333334-117.333333h618.666666c64.8 0 117.333333 52.533333 117.333334 117.333333v297.92z m-64-74.624V256a53.333333 53.333333 0 0 0-53.333334-53.333333H202.666667a53.333333 53.333333 0 0 0-53.333334 53.333333v344.48A290.090667 290.090667 0 0 1 192 597.333333a286.88 286.88 0 0 1 183.296 65.845334C427.029333 528.384 556.906667 437.333333 704 437.333333c65.706667 0 126.997333 16.778667 170.666667 41.962667z m0 82.24c-5.333333-8.32-21.130667-21.653333-43.648-32.917333C796.768 511.488 753.045333 501.333333 704 501.333333c-121.770667 0-229.130667 76.266667-270.432 188.693334-2.730667 7.445333-7.402667 20.32-13.994667 38.581333-7.68 21.301333-34.453333 28.106667-51.370666 13.056-16.437333-14.634667-28.554667-25.066667-36.138667-31.146667A222.890667 222.890667 0 0 0 192 661.333333c-14.464 0-28.725333 1.365333-42.666667 4.053334V768a53.333333 53.333333 0 0 0 53.333334 53.333333h618.666666a53.333333 53.333333 0 0 0 53.333334-53.333333V561.525333zM320 480a96 96 0 1 1 0-192 96 96 0 0 1 0 192z m0-64a32 32 0 1 0 0-64 32 32 0 0 0 0 64z" fill="#2c2c2c" p-id="15516"></path></svg>
                                    </div>
                                    <span class="tool-panel-name">图片</span>
                                </div>
                                <div class="tool-panel-item" data-tool="voice-msg">
                                    <div class="tool-panel-icon-box">
                                        <svg t="1767123055674" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10189"><path d="M512.029676 663.540392c97.863888 0 177.468924-79.305207 177.468924-176.812985L689.4986 273.750781c0-124.120902-79.605036-194.297195-177.468924-194.297195-40.698934 0-94.097098 25.361621-121.103172 51.922557 0 0-53.383838 43.554982-56.42715 158.665673 0 1.195222 0.11768 2.357697 0.207731 3.074012-0.11768 1.699712-0.207731 3.341095-0.207731 5.042853l0 188.568726C334.500377 584.235185 414.135088 663.540392 512.029676 663.540392zM394.473283 290.041816c4.176113-89.808422 42.875506-121.04689 42.875506-121.04689 20.97573-18.916838 47.529503-29.331026 74.68191-29.331026 66.116837-4.356214 117.92069 59.598376 117.675096 137.219221l0 201.191208c0 70.235644-53.109592 125.226073-117.675096 125.226073-64.567551 0-117.557416-57.169047-117.557416-127.435391L394.473283 290.041816z" fill="#2c2c2c" p-id="10190"></path><path d="M787.592732 499.705999C787.502681 501.586836 788.099269 497.827209 787.592732 499.705999L787.592732 499.705999z" fill="#2c2c2c" p-id="10191"></path><path d="M767.131725 469.974861c-14.246469 0-26.502607 11.43647-26.786063 25.616424-8.593725 115.736954-108.846001 206.318996-228.222865 206.318996-119.407554 0-220.098837-90.617857-228.691539-206.355835-2.27788-12.418844-13.126972-21.979594-26.204825-21.979594-14.151301 0-25.596981 12.45466-26.487258 26.380834C242.74665 633.357975 347.325473 740.423433 482.107179 754.455008L482.107179 914.409023c0 16.620539 13.544481 30.137391 30.224372 30.137391 16.647145 0 30.193673-13.515828 30.193673-30.137391L542.525224 754.455008C675.837462 740.221842 780.9965 632.182196 793.260825 499.705999l-0.00921 0C793.251615 485.281475 781.557272 469.974861 767.131725 469.974861z" fill="#2c2c2c" p-id="10192"></path></svg>
                                    </div>
                                    <span class="tool-panel-name">语音</span>
                                </div>
                               <div class="tool-panel-item" data-tool="api-switch">
                                    <div class="tool-panel-icon-box">
                                        <svg t="1767147196485" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3575" width="32" height="32"><path d="M390.368 673.04l277.2-277.216-56.432-56.432-277.168 277.216 56.4 56.432z m83.36-11.904c10.96 30.784 4.4 66.464-20.256 91.04-53.776 53.664-71.2 80.384-116.992 80.384-45.44 0-58.448-21.984-136.352-99.696a87.36 87.36 0 0 1 0.016-123.584c48.816-48.72 82.384-98.32 147.104-74.816l59.28-59.12c-64.64-40.896-151.36-33.328-207.632 22.848L143.888 553.12c-65.2 65.04-65.216 170.88-0.032 235.936 72.768 72.592 108 122.944 192.624 122.944 81.76 0 117.184-47.648 173.248-103.616 55.824-55.632 64.112-141.6 23.36-206.464l-59.36 59.232z m388.48-442.176l-74.24-74.24c-65.12-65.168-171.04-64.88-235.856-0.016l-54.896 54.896c-56 55.984-63.936 142.432-22.864 207.184l59.12-59.136c-12.496-34.32-2.8-69.168 19.888-91.872 55.296-55.28 71.488-80.336 116.688-80.336 45.376 0 58.384 22.048 136.016 99.696a87.504 87.504 0 0 1 0.016 123.568c-48.576 48.56-81.632 97.616-145.872 75.056l-59.28 59.296a165.968 165.968 0 0 0 88.48 25.408c81.408 0 116.576-47.344 172.816-103.584 65.056-65.056 65.024-170.88 0-235.92z" fill="#2c2c2c" p-id="3576"></path></svg>
                                    </div>
                                    <span class="tool-panel-name">API切换</span>
                                </div>
                                <div class="tool-panel-item" data-tool="quick-reply">
                                    <div class="tool-panel-icon-box">
                                        <svg t="1767369081521" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2249"><path d="M512 128a384 384 0 1 1-111.146667 751.658667l-158.165333 28.544a42.666667 42.666667 0 0 1-50.005333-37.376l-0.256-4.992 1.237333-139.008A384 384 0 0 1 512 128z m0 85.333333a298.666667 298.666667 0 0 0-254.506667 455.082667l6.826667 10.581333 14.933333 22.016-1.066666 114.048 127.701333-23.04 19.626667 5.973334A298.666667 298.666667 0 1 0 512 213.333333z m14.506667 86.016c5.76 1.749333 9.557333 7.082667 7.68 12.373334 0 4.736-6.4 51.456-19.072 140.16 0 3.541333 0 3.541333 3.84 3.541333h139.008c9.514667 0 15.232 5.333333 15.232 14.208 0 3.541333-1.92 5.333333-3.84 7.082667-45.653333 63.872-159.957333 223.530667-171.392 241.237333-1.877333 3.541333-5.674667 5.333333-9.514667 7.125333-7.594667 1.749333-15.232-5.333333-13.312-14.208 5.717333-31.914667 20.906667-124.16 24.746667-138.368 0-4.565333 0-5.205333-3.584-5.290666H351.36a12.586667 12.586667 0 0 1-9.557333-16c0-1.749333 1.92-3.541333 3.84-5.290667 55.210667-79.829333 110.421333-157.866667 163.754666-237.738667 0-1.749333 1.92-1.749333 1.92-3.541333 3.84-5.290667 9.514667-7.082667 15.232-5.290667z" fill="#8A8F99" p-id="2250"></path></svg>
                                    </div>
                                    <span class="tool-panel-name">快捷回复</span>
                                </div>                                <div class="tool-panel-item" data-tool="video-call">
                                    <div class="tool-panel-icon-box">
                                        <svg t="1767123196108" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25921"><path d="M800.3 707.3l-103.7-69.1c-38.2-25.5-87.3-28.5-128.2-8h-0.1L547 640.9c-16.6 8.3-36.3 5-49.3-8l-94-94.1c-13-13-16.2-32.8-8-49.3l10.7-21.3c20.5-40.9 17.5-90.1-8-128.3l-69.1-103.7c-13-19.6-34-32.2-57.4-34.5-23.6-2.4-46.5 5.9-63.1 22.5-116.1 116.2-116.1 305.1 0 421.3L391 827.8c58.1 58.1 134.3 87.1 210.6 87.1s152.6-29.1 210.7-87.2c16.6-16.7 24.8-39.7 22.5-63.1-2.3-23.4-14.9-44.3-34.5-57.3z m-349 60.1L269.2 585.3c-80.8-80.9-82.8-211.2-6-294.4l64.3 96.4c8.5 12.7 9.5 29.1 2.6 42.8l-10.7 21.4c-24.7 49.4-15 108.8 24 147.7l94 94c39 39 98.4 48.5 147.8 24l21.3-10.7c13.7-6.8 30-5.8 42.7 2.7l96.4 64.3c-83.2 76.7-213.5 74.7-294.3-6.1zM817 201.5v-7.1c0-47.1-38.3-85.3-85.3-85.3H560.9c-47 0-85.3 38.3-85.3 85.3v85.3c0 47.1 38.3 85.3 85.3 85.3h170.7c47 0 85.3-38.3 85.3-85.3v-7.1l85.3 71.1V130.4L817 201.5z m-256.1 78.3v-85.3h170.7v85.3H560.9z" p-id="25922" fill="#2c2c2c"></path></svg>
                                    </div>
                                    <span class="tool-panel-name">视频通话</span>
                                </div>
                                <div class="tool-panel-item" data-tool="offline-mode">
                                    <div class="tool-panel-icon-box">
<svg t="1768317469830" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7207" width="16" height="16"><path d="M920.702356 374.399085c-0.001023-8.173147 0.547469-16.457834-0.548492-24.502044-4.585435-33.634028-28.500101-48.39522-59.487859-35.18536-17.924231 7.643074-34.223452 19.042705-51.436486 28.418236-20.337187 11.078313-34.154891 25.967418-28.621874 51.02 5.088902 23.036669 21.971407 30.583552 43.733037 31.346939 4.246721 0.148379 8.390088 3.269463 12.656251 5.050016 0 102.072747 0 202.831568 0 304.940131-66.723657 34.041304-131.869377 67.277266-195.633632 99.80817-64.485687-33.796734-125.013225-66.145489-186.101535-97.399307-102.989629-52.691059-67.921949-52.18043-167.718863-0.26606-31.555693 16.414855-62.758346 33.504068-103.591333 55.351656 0-93.88732 0.589424-177.091324-0.272199-260.279978-0.378623-36.5658-2.784416-70.417793 40.929178-88.647993 21.99699-9.17394 25.116027-36.926004 13.227256-54.788837-12.939707-19.437701-31.963992-22.620184-51.813063-14.048971-17.898649 7.730055-34.111912 19.267832-51.548026 28.185946-23.008017 11.765975-31.925107 29.873378-31.797194 55.617715 0.64673 129.177058-0.284479 258.367419 0.554632 387.54243 0.356111 54.701856 26.165939 68.63417 76.269058 42.395576 53.569056-28.05087 107.221-56.06797 159.493527-86.408999 22.466688-13.042037 40.011272-13.482059 62.990636-0.692778 67.101257 37.334303 136.12633 71.204715 203.468065 108.123556 25.721825 14.103206 47.323818 13.675464 73.210395-0.385786 66.037019-35.870975 133.021619-70.114894 200.666252-102.860692 30.593785-14.809287 42.416042-35.276435 41.980113-69.321832C919.760914 616.425328 920.723845 495.405043 920.702356 374.399085z" p-id="7208"></path><path d="M477.759151 610.844216c25.535583 24.327058 42.170448 23.983227 67.99665-0.462534 58.477856-55.354725 110.818945-116.197442 143.308917-190.654224 14.760169-33.824363 21.940708-70.949912 32.559557-106.58041-4.344958-106.027825-75.18026-189.922561-178.809455-206.841905-98.749048-16.120143-195.157795 42.508139-226.312352 138.340765-17.450441 53.673433-11.594059 106.58041 9.435906 157.950382C359.415836 484.362546 414.661068 550.734186 477.759151 610.844216zM517.465478 187.5577c70.225411 3.0208 124.981503 65.343217 115.767654 135.939065-9.383718 71.895447-47.925522 130.937145-92.483344 185.709609-15.413038 18.944468-38.09155 17.682731-56.634882 2.38635-39.792285-32.825616-94.278223-147.944494-94.54633-199.753463C389.197116 239.573377 445.892373 184.481641 517.465478 187.5577z" p-id="7209"></path></svg>                                    </div>
                                    <span class="tool-panel-name">线下模式</span>
                                </div>
                                <div class="tool-panel-item" data-tool="summary">
                                    <div class="tool-panel-icon-box">
                                        <svg t="1767123339874" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1650"><path d="M211.2 1024c-51.2 0-160-32-160-140.8V198.4C51.2 64 134.4 6.4 211.2 6.4H768c96 0 160 64 160 166.4v230.4c0 19.2-12.8 44.8-38.4 44.8-32-6.4-44.8-19.2-44.8-44.8V179.2c0-70.4-64-96-89.6-96H217.6c-38.4 0-83.2 38.4-89.6 121.6v640c0 96 64 96 89.6 96h192c25.6-6.4 38.4 19.2 38.4 38.4s-12.8 44.8-38.4 44.8H211.2z" p-id="1651" fill="#2c2c2c"></path><path d="M268.8 172.8H704c19.2 0 32 12.8 32 32s-12.8 32-32 32H268.8c-19.2 0-32-12.8-32-32s12.8-32 32-32zM268.8 364.8H704c19.2 0 32 12.8 32 32s-12.8 32-32 32H268.8c-19.2 0-32-12.8-32-32s12.8-32 32-32zM268.8 550.4h185.6c19.2 0 32 12.8 32 32s-12.8 32-32 32H268.8c-19.2 0-32-12.8-32-32s12.8-32 32-32zM524.8 1017.6c-12.8 0-25.6-12.8-32-32v-147.2c0-6.4 0-12.8 6.4-19.2l294.4-294.4c19.2-12.8 38.4-19.2 64-19.2s44.8 6.4 57.6 25.6l70.4 70.4c19.2 19.2 25.6 38.4 25.6 57.6 0 25.6-6.4 44.8-25.6 57.6l-294.4 294.4c-6.4 6.4-12.8 6.4-19.2 6.4H524.8z m128-57.6l-102.4-102.4 6.4 102.4h96z m44.8-32l172.8-172.8-108.8-108.8-172.8 172.8 108.8 108.8z m217.6-217.6l32-32c12.8-12.8 12.8-25.6 0-38.4l-70.4-64c-6.4-6.4-12.8-6.4-19.2-6.4s-12.8 0-19.2 6.4l-32 32 108.8 102.4z" p-id="1652" fill="#2c2c2c"></path></svg>
                                    </div>
                                    <span class="tool-panel-name">总结</span>
                                </div>
                                <div class="tool-panel-item" data-tool="music">
                                    <div class="tool-panel-icon-box">
                                        <svg t="1767123370328" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5101"><path d="M875.008 295.424a34.133333 34.133333 0 1 0-58.197333 35.669333c35.328 57.514667 53.930667 123.562667 53.930666 191.488 0 201.898667-164.352 366.250667-366.250666 366.250667S138.24 724.48 138.24 522.581333 302.592 156.330667 504.490667 156.330667c18.773333 0 34.133333-15.36 34.133333-34.133334s-15.36-34.133333-34.133333-34.133333C264.874667 88.064 69.973333 282.965333 69.973333 522.581333s194.901333 434.517333 434.517334 434.517334 434.517333-194.901333 434.517333-434.517334c0.170667-80.384-22.016-159.061333-64-227.157333z" fill="#2c2c2c" p-id="5102"></path><path d="M501.248 389.973333c-77.653333 0-140.8 63.146667-140.8 140.8s63.146667 140.8 140.8 140.8 140.8-63.146667 140.8-140.8V224.256c0-19.456 15.872-35.328 35.328-35.328 19.456 0 35.328 15.872 35.328 35.328 0 18.773333 15.36 34.133333 34.133333 34.133333s34.133333-15.36 34.133334-34.133333c0-57.173333-46.421333-103.594667-103.594667-103.594667s-103.594667 46.421333-103.594667 103.594667v186.026667a140.526933 140.526933 0 0 0-72.533333-20.309334z m0 213.333334a72.704 72.704 0 0 1-72.533333-72.533334 72.704 72.704 0 0 1 72.533333-72.533333 72.704 72.704 0 0 1 72.533333 72.533333 72.704 72.704 0 0 1-72.533333 72.533334z" fill="#2c2c2c" p-id="5103"></path></svg>
                                    </div>
                                    <span class="tool-panel-name">音乐</span>
                                </div>
                                <div class="tool-panel-item" data-tool="archive">
                                    <div class="tool-panel-icon-box">
                                        <svg t="1767272978493" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1185" width="32" height="32"><path d="M787.712 64c21.632 0 39.488 15.936 42.56 36.736l0.512 6.4v555.52a43.072 43.072 0 0 1-36.736 42.624l-6.4 0.512H236.352c-47.36 0-108.992 18.688-108.992 66.176-5.248 49.408-58.368 73.28-62.976 26.752L64 791.936V236.288c0-91.52 71.296-166.336 161.408-171.968L236.288 64h551.424z m-20.992 64H236.288c-56.64 0-103.168 43.52-107.904 98.944L128 236.288v429.888l8.448-4.224a230.72 230.72 0 0 1 89.088-19.968l10.752-0.192 530.432-0.064V128z" fill="#000000" p-id="1186"></path><path d="M959.68 145.152l0.32 4.992-0.32 745.216c0 53.056-30.784 63.744-64.64 63.744l-658.752 5.12A172.288 172.288 0 0 1 64 791.936c0-92.288 59.584-147.2 150.784-151.68h553.856c23.808 0 62.08-1.344 62.08 22.4 0 22.144-16.64 40.32-38.016 42.816l-4.992 0.32-595.392-0.32c-47.552 0-65.408 46.976-65.408 94.528 0 45.44 56.192 92.096 100.8 95.36h667.328l1.92-750.208c0-22.144 9.792-35.328 31.168-37.76 22.144 0 29.12 16.32 31.552 37.76z" fill="#000000" p-id="1187"></path><path d="M766.144 768c23.808 0 43.072 14.336 43.072 32 0 16.384-16.64 29.952-38.016 31.808L766.08 832H257.92c-23.808 0-43.072-14.336-43.072-32 0-16.384 16.64-29.952 38.016-31.808L257.92 768h508.288z" fill="#000000" p-id="1188"></path></svg>
                                    </div>
                                    <span class="tool-panel-name">存档</span>
                                </div>
                                <div class="tool-panel-item" data-tool="gift">
                                    <div class="tool-panel-icon-box">
                                        <svg t="1767123230934" class="icon" viewBox="0 0 1137 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="31251"><path d="M1135.142452 361.58628c0-57.196057-46.96342-103.728338-104.689952-103.728338l-30.177676 0c17.059174-26.554471 26.182729-57.38756-26.182729-89.711715 0.003072-44.940856-17.691033-87.18735-49.821636-118.9585-32.078374-31.719945-74.707875-49.187728-120.035835-49.187728-43.922918 0-84.252328 19.345951-119.868909 57.499185-23.783302 25.479184-45.446753 59.392715-64.514154 100.969459-17.11345-5.294509-35.72411-8.054412-54.706511-8.054412-19.031558 0-37.644265 2.754783-54.716752 8.042123-19.069449-41.573671-40.729827-75.481058-64.511081-100.95717-35.615557-38.153234-75.943943-57.499185-119.864813-57.499185-77.72892 0-145.290745 52.34088-164.2967 127.28327-1.192033 4.699517-0.407585 9.682704 2.171056 13.788253 2.578641 4.105549 6.726177 6.977077 11.476898 7.944836 12.89218 2.625749 26.425436 6.186485 40.225978 10.582873 4.684155 1.493113 9.778968 0.972879 14.065779-1.435764 4.286811-2.408643 7.38159-6.48859 8.543924-11.265937 9.871136-40.558805 46.122648-68.885964 88.156133-68.885964 55.479694 0 97.333964 76.670018 119.09163 127.878262-3.066104 6.287869-5.029271 13.069347-5.858779 20.262505-0.098312 0.412705-0.183311 0.830531-0.252948 1.251429-0.247828 1.030227-0.650293 2.929901-0.650293 5.285292 0 8.050316 1.776784 15.914249 5.246377 23.433066-25.727012-0.641076-70.702687-10.009387-142.334217-49.166222C284.052714 168.690016 218.537007 149.286716 159.276399 149.286716c-96.788128 0-144.740812 51.962993-150.014839 58.040925-0.124938 0.142348-0.247828 0.287767-0.36867 0.434211-6.680093 8.138387-9.757462 18.377169-8.66579 28.832031 1.093721 10.46408 6.2254 19.853896 14.460051 26.446942 6.997559 5.595589 15.792383 8.677055 24.765398 8.677055 11.874242 0 23.001927-5.234088 30.541226-14.360715 1.476728-1.69793 27.368617-30.395806 87.911377-30.395806 45.805182 0 98.956111 16.367918 157.964795 48.641892 71.328402 39.079005 133.05705 58.892962 183.469581 58.892962 6.2254 0 12.604413-0.403489 19.568177-1.251429 2.877673 1.943709 6.318592 3.038454 9.925412 3.038454l49.222547 0 0 136.466222L178.781083 472.749461l0-111.231794c0-13.914215 11.567017-25.234428 25.785385-25.234428l144.292264 0c0.00512 0 0.011265-0.001024 0.017409 0 9.792281 0 17.730972-7.938691 17.730972-17.730972 0-7.363156-4.487531-13.677652-10.876785-16.357677-16.577855-7.68267-30.463396-14.64029-43.685331-21.891821-14.312583-7.804536-28.696852-14.717096-43.974122-21.130928-2.173104-0.912458-4.505965-1.382512-6.863404-1.382512L204.566468 257.789329c-57.72858 0-104.694048 46.532281-104.694048 103.728338l0 171.927142c0 9.792281 7.938691 17.730972 17.730972 17.730972l47.506184 0 0 369.091784c0 57.198105 46.966492 103.732434 104.695072 103.732434l695.545875 0c57.729604 0 104.695072-46.533305 104.695072-103.732434L1070.045595 551.387766l47.714073 0c4.708733 0 9.223915-1.873048 12.550137-5.205414 3.326221-3.332366 5.190052-7.852668 5.180836-12.561401L1135.142452 361.58628zM991.000729 551.241323l0 369.094857c0 13.915239-11.53527 25.234428-25.715747 25.234428L656.963304 945.570607 656.963304 551.241323 991.000729 551.241323zM1056.309571 361.58628l0 111.231794L657.03499 472.818074l0-136.465198 373.488173 0C1044.74153 336.352877 1056.309571 347.67309 1056.309571 361.58628zM652.285293 232.670622c-8.512177 2.07172-20.320878 3.739951-34.773761 3.739951-5.044633 0-10.108723-0.226322-15.126729-0.674871-1.922204-2.101418-4.027718-3.939647-6.311423-5.506494 6.261243-0.809026 13.444161-1.321067 21.438152-1.321067C631.962367 228.909166 643.773115 230.586614 652.285293 232.670622zM856.257015 78.012591c50.15139 0 90.953927 40.247484 90.953927 89.717859 0 49.468327-40.802537 89.713763-90.953927 89.713763L738.192539 257.444213c3.771698-7.893631 5.729744-16.221474 5.729744-24.753109 0-9.199337-2.292922-18.360783-6.695454-26.944647C759.002929 154.539238 800.831597 78.012591 856.257015 78.012591zM578.125302 551.241323l0 394.330309L269.804648 945.571631c-14.179453 0-25.715747-11.320213-25.715747-25.234428L244.088901 551.241323 578.125302 551.241323z" fill="#2c2c2c" p-id="31252"></path></svg>
                                    </div>
                                    <span class="tool-panel-name">礼物</span>
                                </div>
                                <div class="tool-panel-item" data-tool="gallery">
                                    <div class="tool-panel-icon-box">
                                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M668.1 227.3H207.8C93.2 227.3 0 320.6 0 435.1v296.4c0 114.6 93.2 207.8 207.8 207.8H668c114.6 0 207.8-93.2 207.8-207.8V435.1c0.1-114.5-93.1-207.8-207.7-207.8z m139.8 504.2c0 77.1-62.7 139.8-139.8 139.8H207.8c-57.3 0-106.7-34.7-128.3-84.2l217.8-217.8 134.2 134.2c13.3 13.3 34.8 13.3 48.1 0l88.2-88.2 96.6 96.6c13.3 13.3 34.8 13.3 48.1 0 13.3-13.3 13.3-34.8 0-48.1L592 543.2c-13.3-13.3-34.8-13.3-48.1 0l-88.2 88.2-134.3-134.2c-13.3-13.3-34.8-13.3-48.1 0L68 702.6V435.1c0-77.1 62.7-139.8 139.8-139.8H668c77.1 0 139.8 62.7 139.8 139.8v296.4z"></path>
                                            <path d="M627.440143 485.154298a53.1 53.1 0 1 0 75.093429-75.096051 53.1 53.1 0 1 0-75.093429 75.096051Z"></path>
                                            <path d="M675.1 84.6h-288c-18.8 0-34 15.2-34 34s15.2 34 34 34h288c154.9 0 280.9 126 280.9 280.9v149.8c0 18.8 15.2 34 34 34s34-15.2 34-34V433.6c0-192.4-156.5-349-348.9-349z"></path>
                                        </svg>
                                    </div>
                                    <span class="tool-panel-name">图库</span>
                                </div>
                                <div class="tool-panel-item" data-tool="transfer">
                                    <div class="tool-panel-icon-box">
                                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M681.802 337.623c-3.21-27.06-18.326-42.176-45.386-45.386-15.937 1.605-27.881 7.987-35.831 19.11L512.203 437.95 423.82 311.347c-9.555-11.123-21.499-17.505-35.831-19.11-28.665 3.21-43.818 18.326-45.386 45.386-1.605 11.16 1.568 19.931 9.555 26.276l76.439 107.493h-50.163c-17.542 3.21-27.097 11.944-28.665 26.276 0 17.542 9.555 26.275 28.665 26.275h88.383v40.608h-88.383c-17.542 3.21-27.097 11.943-28.665 26.276 0 17.542 9.555 26.275 28.665 26.275h88.383v74.051c0 27.098 15.116 40.608 45.386 40.608 28.664 0 43.78-13.511 45.385-40.608v-74.051h88.383c17.505 0 27.061-8.733 28.665-26.275-3.21-14.333-12.765-23.066-28.665-26.276h-88.383v-40.608h88.383c17.505 0 27.061-8.733 28.665-26.275-3.21-14.333-12.765-23.066-28.665-26.276h-50.163l76.439-107.493c6.345-6.345 9.555-15.116 9.555-26.276z"></path>
                                            <path d="M123.343 377.311c20.089 9.187 43.824 0.349 53.013-19.741 72.857-159.313 249.719-245.832 420.541-205.722 130.918 30.745 233.396 129.241 270.419 256.268l-70.823 0.263L911.18 605.284l113.212-197.752-74.456 0.277c-17.917-75.422-54.947-144.855-108.073-202.148-60.847-65.619-139.23-111.158-226.677-131.694-51.845-12.174-104.716-15.107-157.139-8.718-50.648 6.172-99.595 20.861-145.48 43.658-92.174 45.793-166.386 122.287-208.965 215.391-9.188 20.09-0.35 43.825 19.741 53.013zM901.3 646.514c-20.083-9.213-43.824-0.401-53.036 19.678-72.951 159.013-249.737 245.355-420.354 205.313-130.924-30.742-233.406-129.242-270.43-256.276l70.824-0.26-114.676-196.913L0.403 615.803l74.457-0.272c17.917 75.428 54.949 144.866 108.08 202.163 60.85 65.621 139.235 111.159 226.687 131.693 34.045 7.99 68.529 11.998 103.043 11.998 18 0 36.009-1.091 53.964-3.273 50.607-6.154 99.52-20.81 145.378-43.559 92.109-45.693 166.322-122.051 208.966-215.004 9.21-20.078 0.401-43.824-19.678-53.035z"></path>
                                        </svg>
                                    </div>
                                    <span class="tool-panel-name">转账</span>
                                </div>
                                <div class="tool-panel-item" data-tool="location">
                                    <div class="tool-panel-icon-box">
                                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M648.256 850.272a32 32 0 1 1-40.704-49.386667C758.304 676.693333 832 566.037333 832 471.072 832 293.344 688.693333 149.333333 512 149.333333c-176.693333 0-320 144.010667-320 321.738667 0 115.232 108.416 253.045333 329.173333 409.493333a32 32 0 0 1-37.013333 52.213334C248.021333 765.429333 128 612.853333 128 471.072 128 258.069333 299.882667 85.333333 512 85.333333s384 172.736 384 385.738667c0 118.378667-83.701333 244.053333-247.744 379.2zM512 618.666667c-82.474667 0-149.333333-66.858667-149.333333-149.333334s66.858667-149.333333 149.333333-149.333333 149.333333 66.858667 149.333333 149.333333-66.858667 149.333333-149.333333 149.333334z m0-64a85.333333 85.333333 0 1 0 0-170.666667 85.333333 85.333333 0 0 0 0 170.666667z"></path>
                                        </svg>
                                    </div>
                                    <span class="tool-panel-name">定位</span>
                                </div>
                                <div class="tool-panel-item" data-tool="impression">
                                    <div class="tool-panel-icon-box">
<svg t="1768392154872" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2054" width="16" height="16"><path d="M556.69333333 152.74666667c2.45333333-17.70666667-11.30666667-33.38666667-29.12-33.38666667-17.81333333 0-31.57333333 15.78666667-29.12 33.38666667l29.12 209.06666666 29.12-209.06666666zM204.26666667 349.01333333l195.62666666 79.36-166.50666666-129.81333333c-14.08-10.98666667-34.56-6.93333333-43.52 8.53333333-8.85333333 15.46666667-2.13333333 35.2 14.4 41.92zM198.08 651.41333333c-16.53333333 6.72-23.36 26.45333333-14.4 41.92 8.96 15.46666667 29.44 19.41333333 43.52 8.53333334l166.50666667-129.70666667-195.62666667 79.25333333zM485.97333333 858.45333333c-2.45333333 17.70666667 11.30666667 33.38666667 29.12 33.38666667 17.81333333 0 31.57333333-15.78666667 29.12-33.38666667l-29.12-209.06666666-29.12 209.06666666zM838.29333333 662.29333333l-195.62666666-79.36 166.50666666 129.70666667c14.08 10.98666667 34.56 6.93333333 43.52-8.53333333 8.96-15.36 2.13333333-35.09333333-14.4-41.81333334zM844.58666667 359.78666667c16.53333333-6.72 23.36-26.45333333 14.4-41.92-8.96-15.46666667-29.44-19.41333333-43.52-8.53333334L648.96 439.14666667l195.62666667-79.36zM473.6 413.97333333l-56.96-140.48c-4.8-11.84-18.98666667-16.74666667-30.08-10.34666666-11.09333333 6.4-13.97333333 21.12-6.08 31.25333333L473.6 413.97333333zM243.94666667 501.12c0 12.8 11.30666667 22.61333333 24 20.90666667L418.13333333 501.12l-150.08-20.90666667c-12.8-1.70666667-24.10666667 8.10666667-24.10666666 20.90666667zM378.77333333 743.57333333c11.09333333 6.4 25.28 1.49333333 30.08-10.34666666l56.96-140.48-93.12 119.57333333c-7.89333333 10.13333333-5.01333333 24.85333333 6.08 31.25333333zM569.06666667 597.22666667l56.96 140.48c4.8 11.84 18.98666667 16.74666667 30.08 10.34666666 11.09333333-6.4 13.97333333-21.12 6.08-31.25333333l-93.12-119.57333333zM624.53333333 510.08l150.08 20.90666667c12.69333333 1.81333333 24-8.10666667 24-20.90666667 0-12.8-11.30666667-22.61333333-24-20.90666667l-150.08 20.90666667zM663.89333333 267.62666667c-11.09333333-6.4-25.28-1.49333333-30.08 10.34666666l-56.96 140.48 93.12-119.57333333c7.89333333-10.02666667 5.01333333-24.85333333-6.08-31.25333333zM588.58666667 490.56l-46.50666667-6.82666667-20.8-42.13333333-20.8 42.13333333-46.4 6.82666667 33.6 32.74666667-8 46.29333333 41.6-21.86666667 41.6 21.86666667-7.89333333-46.29333333zM279.14666667 759.68l-10.34666667-21.01333333-10.45333333 21.01333333-23.25333334 3.41333333 16.85333334 16.42666667-3.94666667 23.14666667 20.8-10.98666667 20.8 10.98666667-4.05333333-23.14666667 16.85333333-16.42666667z" fill="#2c2c2c" p-id="2055"></path></svg>                                    </div>
                                    <span class="tool-panel-name">印象</span>
                                </div>
                                <div class="tool-panel-item" data-tool="topic">
                                    <div class="tool-panel-icon-box">
                                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M476.021333 544h63.424l8.533334-64h-63.424l-8.533334 64z m-8.533333 64l-9.098667 68.224a32 32 0 0 1-63.445333-8.448L402.912 608H352a32 32 0 0 1 0-64h59.445333l8.533334-64H352a32 32 0 0 1 0-64h76.512l9.098667-68.224a32 32 0 0 1 63.445333 8.448L493.088 416h63.424l9.098667-68.224a32 32 0 0 1 63.445333 8.448L621.088 416H672a32 32 0 0 1 0 64h-59.445333l-8.533334 64H672a32 32 0 0 1 0 64h-76.512l-9.098667 68.224a32 32 0 0 1-63.445333-8.448L530.912 608h-63.424zM157.568 751.296c-11.008-18.688-18.218667-31.221333-21.802667-37.909333A424.885333 424.885333 0 0 1 85.333333 512C85.333333 276.362667 276.362667 85.333333 512 85.333333s426.666667 191.029333 426.666667 426.666667-191.029333 426.666667-426.666667 426.666667a424.778667 424.778667 0 0 1-219.125333-60.501334 2786.56 2786.56 0 0 0-20.053334-11.765333l-104.405333 28.48c-23.893333 6.506667-45.802667-15.413333-39.285333-39.296l28.437333-104.288z m65.301333 3.786667l-17.258666 63.306666 63.306666-17.258666a32 32 0 0 1 24.522667 3.210666 4515.84 4515.84 0 0 1 32.352 18.944A360.789333 360.789333 0 0 0 512 874.666667c200.298667 0 362.666667-162.368 362.666667-362.666667S712.298667 149.333333 512 149.333333 149.333333 311.701333 149.333333 512c0 60.586667 14.848 118.954667 42.826667 171.136 3.712 6.912 12.928 22.826667 27.370667 47.232a32 32 0 0 1 3.338666 24.714667z"></path>
                                        </svg>
                                    </div>
                                    <span class="tool-panel-name">话题</span>
                                </div>
                                <div class="tool-panel-item" data-tool="schedule">
                                    <div class="tool-panel-icon-box">
                                        <svg t="1769178918137" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4193" width="16" height="16"><path d="M662.186667 904.533333H254.293333c-37.546667 0-68.266667-30.72-68.266666-68.266666V404.48c0-37.546667 30.72-68.266667 68.266666-68.266667h407.893334c37.546667 0 68.266667 30.72 68.266666 68.266667V836.266667c0 37.546667-30.72 68.266667-68.266666 68.266666z" fill="#2c2c2c" opacity=".3" p-id="4194"></path><path d="M919.893333 921.6H104.106667C66.56 921.6 34.133333 890.88 34.133333 851.626667V262.826667c0-39.253333 32.426667-69.973333 69.973334-69.973334h814.08c39.253333 0 69.973333 32.426667 69.973333 69.973334v587.093333c1.706667 40.96-30.72 71.68-68.266667 71.68zM104.106667 244.053333c-10.24 0-18.773333 8.533333-18.773334 18.773334v587.093333c0 11.946667 8.533333 20.48 18.773334 20.48h814.08c10.24 0 18.773333-8.533333 18.773333-20.48V262.826667c0-10.24-8.533333-18.773333-18.773333-18.773334H104.106667z" fill="#2c2c2c" p-id="4195"></path><path d="M286.72 334.506667c-13.653333 0-25.6-11.946667-25.6-25.6V128c0-13.653333 11.946667-25.6 25.6-25.6s25.6 11.946667 25.6 25.6v180.906667c0 13.653333-11.946667 25.6-25.6 25.6zM534.186667 537.6H286.72c-13.653333 0-25.6-11.946667-25.6-25.6s11.946667-25.6 25.6-25.6h249.173333c13.653333 0 25.6 11.946667 25.6 25.6s-11.946667 25.6-27.306666 25.6zM738.986667 718.506667H286.72c-13.653333 0-25.6-11.946667-25.6-25.6s11.946667-25.6 25.6-25.6h452.266667c13.653333 0 25.6 11.946667 25.6 25.6s-11.946667 25.6-25.6 25.6zM738.986667 334.506667c-13.653333 0-25.6-11.946667-25.6-25.6V128c0-13.653333 11.946667-25.6 25.6-25.6s25.6 11.946667 25.6 25.6v180.906667c0 13.653333-11.946667 25.6-25.6 25.6z" fill="#2c2c2c" p-id="4196"></path></svg>
                                    </div>
                                    <span class="tool-panel-name">日程</span>
                                </div>
                                <div class="tool-panel-item" data-tool="miniprogram">
                                    <div class="tool-panel-icon-box">
                                        <svg t="1769178973732" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6821" width="16" height="16"><path d="M402.2 734.6c-71.9 0-130.4-54.1-130.4-121 0-20.8 6-41.2 16.9-59.5 16.4-26.8 42.7-46.6 74.4-56 8.4-2.5 14.9-3.5 20.8-3.5 13.9 0 24.8 10.9 24.8 24.8s-10.9 24.8-24.8 24.8c-1 0-3 0-5.5 1-21.3 6-38.2 18.4-47.6 34.7-6.5 10.4-9.4 21.8-9.4 33.7 0 39.2 36.2 71.4 80.4 71.4 15.4 0 30.3-4 43.7-11.4 23.3-13.4 37.2-35.7 37.2-60V405.7c0-42.2 23.3-80.8 62-102.7 20.8-11.9 44.1-17.9 68-17.9 71.9 0 130.4 54.1 130.4 121 0 20.8-6 41.2-16.9 59.5-16.4 26.8-42.7 46.6-74.4 56-8.9 2.5-14.9 3.5-20.8 3.5-13.9 0-24.8-10.9-24.8-24.8s10.9-24.8 24.8-24.8c1 0 3 0 5.5-1 21.3-6.4 38.2-18.9 47.6-34.7 6.4-10.4 9.4-21.8 9.4-33.7 0-39.2-36.2-71.4-80.8-71.4-15.4 0-30.3 4-43.7 11.4-23.3 13.4-37.2 35.7-37.2 60v207.3c0 42.2-23.3 80.9-62 102.7-20.5 12.5-43.8 18.5-67.6 18.5z m504.4-223.2c0-219.2-177.6-396.8-396.8-396.8S113 292.1 113 511.4s177.6 396.8 396.8 396.8 396.8-177.6 396.8-396.8z m49.6 0c0 246.5-199.9 446.4-446.4 446.4-246.5 0-446.4-199.9-446.4-446.4C63.4 264.9 263.3 65 509.8 65c246.5 0 446.4 199.9 446.4 446.4z m0 0" fill="#333333" p-id="6822"></path></svg>
                                    </div>
                                    <span class="tool-panel-name">小程序</span>
                                </div>
                                <div class="tool-panel-item" data-tool="keep-alive">
                               
                                    <div class="tool-panel-icon-box">
                                        <svg t="1769179025464" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10167" width="16" height="16"><path d="M790.415579 285.712834h58.992168c61.918295 0 112.168207 50.177662 112.168207 112.168207v392.751288c0 61.918295-50.249912 112.168207-112.168207 112.168207H176.037254c-61.918295 0-112.168207-50.249912-112.168207-112.168207V397.917166c0-62.02667 50.249912-112.168207 112.168207-112.168207h504.341494l-213.498906-118.309461c-13.43851-7.47788-17.954138-23.914768-10.223383-36.847527 7.730756-12.824384 24.926268-17.267763 38.328654-9.789883l295.430466 164.910746z m115.022084 112.204332c0-30.959148-25.070768-56.138291-56.029916-56.138291H176.037254c-30.959148 0-56.029916 25.179143-56.029916 56.138291v392.751288c0 30.959148 25.070768 56.029916 56.029916 56.029916h673.334368c30.959148 0 56.029916-25.106893 56.029916-56.029916V397.917166h0.036125z m-252.47781 364.646018c-92.949693 0-168.306498-75.356805-168.306498-168.306499 0-92.877443 75.356805-168.306498 168.306498-168.306498 92.985818 0 168.306498 75.429055 168.306499 168.306498 0.036125 92.949693-75.32068 168.306498-168.306499 168.306499z m0-280.510831c-61.918295 0-112.168207 50.249912-112.168207 112.168207 0 61.990545 50.249912 112.276582 112.168207 112.276582 61.990545 0 112.276582-50.249912 112.276582-112.276582 0-61.918295-50.249912-112.168207-112.276582-112.168207z m-280.474705 252.47781H204.17865c-15.461511 0-28.105271-12.535384-28.105271-28.033021 0-15.461511 12.643759-28.105271 28.105271-28.10527h168.306498c15.497636 0 28.033021 12.643759 28.03302 28.10527a28.033021 28.033021 0 0 1-28.03302 28.033021z m0-112.168207H204.17865c-15.461511 0-28.105271-12.535384-28.105271-28.105271 0-15.497636 12.643759-28.033021 28.105271-28.03302h168.306498c15.497636 0 28.033021 12.535384 28.03302 28.03302 0 15.533761-12.571509 28.105271-28.03302 28.105271z m0-112.276582H204.17865c-15.461511 0-28.105271-12.535384-28.105271-28.033021 0-15.497636 12.643759-28.033021 28.105271-28.03302h168.306498c15.497636 0 28.033021 12.535384 28.03302 28.03302a28.033021 28.033021 0 0 1-28.03302 28.033021z" fill="#231815" p-id="10168"></path></svg>
                                    </div>
                                    <span class="tool-panel-name">保活</span>
                                </div>
                            </div>
                        </div>


                        <!-- 表情包面板 -->
                        <div id="emoji-panel">
                            <div id="emoji-panel-header">
                                <button class="header-btn" id="emoji-back-to-tools-btn">
                                    <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
                                    返回
                                </button>
                                <button class="header-btn" id="emoji-manage-btn">管理</button>
                            </div>
                            <div id="emoji-grid">
                                <!-- 表情包列表将由JS动态渲染 -->
                            </div>
                            <div id="emoji-group-bar">
                                <!-- 分组导航将由JS动态渲染 -->
                            </div>
                        </div>

            `;

            const messagesContainer = document.getElementById('chat-messages-container');
            // 使用 setTimeout 将滚动操作推迟到下一次渲染循环，确保所有内容（尤其是图片）加载并计算高度后才滚动
            // 这是解决初次进入页面“上跳”问题的关键
            setTimeout(() => {
                if (messagesContainer) { // 增加安全检查
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            }, 0);


            // --- 新增：将字体设置应用到聊天室视图的CSS变量 ---
            const chatRoomView = chatContent.querySelector('.chat-room-view');
            if (chatRoomView) {
                if (contactForFont && contactForFont.bubbleFontFamily) {
                    // 注意：字体名可能包含空格，所以用引号包裹
                    chatRoomView.style.setProperty('--bubble-font', `'${contactForFont.bubbleFontFamily}'`);
                } else {
                    // 如果没有设置，则移除该变量，使其回退到 inherit
                    chatRoomView.style.removeProperty('--bubble-font');
                }
            }
             // --- 新增：工具面板交互逻辑 ---
            const toolToggleBtn = document.getElementById('chat-tool-toggle-btn');
            const toolPanel = document.getElementById('chat-tool-panel');
            const emojiPanel = document.getElementById('emoji-panel'); // 【新增】获取表情包面板

            if (toolToggleBtn && toolPanel && emojiPanel) {
                // 【修改】点击加号按钮的逻辑
                toolToggleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (emojiPanel.classList.contains('visible')) {
                        // 如果表情面板是打开的，则切换回工具面板
                        emojiPanel.classList.remove('visible');
                        toolPanel.classList.add('visible');
                    } else {
                        // 否则，正常切换工具面板的显示/隐藏
                        toolPanel.classList.toggle('visible');
                    }
                });
                

                 // 为面板本身添加事件委托，处理所有按钮的点击
                toolPanel.addEventListener('click', (e) => {
                    const toolItem = e.target.closest('.tool-panel-item');
                    if (!toolItem) return;

                    const toolName = toolItem.dataset.tool;
                    const contactId = document.querySelector('.chat-contact-title').dataset.contactId;

                    switch (toolName) {
                        // 新增：处理快捷回复
                        case 'quick-reply':
                            openQuickReplyPopup();
                            break;
                        // 【新增】处理API切换
                        case 'api-switch':
                            handleApiSwitchToolClick(contactId);
                            break;
                        case 'archive':
                            handleArchiveToolClick(contactId);
                            break;
                        case 'gallery':
                            openGalleryManagement(contactId);
                            break;
                        case 'emoji':
                            showEmojiPanel();
                            break;
                        case 'image':
                            handleImageToolClick(contactId);
                            break;

                        case 'voice-msg':
                            handleVoiceToolClick(contactId);
                            break;
                        case 'api-switch':
                            handleApiSwitchToolClick(contactId);
                            break;
                        // 新增：处理视频通话功能点击
                        case 'video-call':
                            startVideoCall(contactId);
                            break;
                        // 新增：处理总结功能点击
                        case 'summary':
                            handleSummaryToolClick(contactId);
                            break;
                        case 'offline-mode':
                            handleOfflineModeClick(contactId);
                            break;
                        // 新增：处理“印象”功能点击
                        case 'impression':
                            openImpressionPopup(contactId);
                            break;
                        // 新增：处理“话题”功能点击
                        case 'topic':
                            openTopicManagement();
                            break;
                        // 新增：处理“定位”功能点击
                        case 'location':
                            showLocationPopup();
                            break;
                        case 'transfer':
                            // 直接打开转账弹窗
                            const transferOverlay = document.getElementById('transfer-overlay');
                            if (transferOverlay) {
                                transferOverlay.classList.add('visible');
                            }
                            break;
                        default:
                            const toolText = toolItem.querySelector('.tool-panel-name').textContent;
                            showCustomAlert(`点击了功能：${toolText} (tool: ${toolName})`);
                            break;
                    }

                    // 点击功能后自动收起面板
                    toolPanel.classList.remove('visible');
                });

                // --- 新增：为表情包面板绑定事件 ---
                const emojiBackBtn = document.getElementById('emoji-back-to-tools-btn');
                const emojiManageBtn = document.getElementById('emoji-manage-btn');

                if (emojiBackBtn) {
                    emojiBackBtn.addEventListener('click', hideEmojiPanel);
                }
                if (emojiManageBtn) {
                    emojiManageBtn.addEventListener('click', openEmojiManagement);
                }

                // --- 新增：转账弹窗逻辑 ---
                const transferOverlay = document.getElementById('transfer-overlay');
                const cancelTransferBtn = document.getElementById('cancel-transfer');
                const confirmTransferBtn = document.getElementById('confirm-transfer');

                if (transferOverlay && cancelTransferBtn && confirmTransferBtn) {
                    // 打开转账弹窗
                    const openTransferPopup = () => {
                        transferOverlay.classList.add('visible');
                    };

                    // 关闭转账弹窗
                    const closeTransferPopup = () => {
                        transferOverlay.classList.remove('visible');
                        // 清空输入框
                        document.getElementById('transfer-amount').value = '';
                        document.getElementById('transfer-description').value = '';
                    };

                    // 【修复方案】同样对取消按钮使用克隆节点法，保持代码健壮性
                    const newCancelBtn = cancelTransferBtn.cloneNode(true);
                    cancelTransferBtn.parentNode.replaceChild(newCancelBtn, cancelTransferBtn);
                    newCancelBtn.addEventListener('click', closeTransferPopup);

                // 确认转账
                const confirmTransfer = async () => {
                    const amountInput = document.getElementById('transfer-amount');
                    const descriptionInput = document.getElementById('transfer-description');
                    const amount = amountInput.value;
                    const description = descriptionInput.value;

                    // 1. 校验金额
                    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
                        showCustomAlert('请输入有效的转账金额');
                        return; // 金额无效，中断执行，弹窗保持打开
                    }


                    // 2. 金额有效，立即关闭弹窗
                    closeTransferPopup();
                    
                    // 3. 构建转账消息格式，如果说明为空，则保持为空字符串
                    const transferMessage = `[转账]金额:${amount},说明:${description || ''}`;
                    
                    playSoundEffect('发送音效.wav'); // 播放发送音效
                    
                    // 获取当前聊天 contactId
                    const currentChatRoom = document.querySelector('.chat-room-view');
                    if (!currentChatRoom) return;
                    const titleElement = currentChatRoom.querySelector('.chat-contact-title');
                    const contactId = titleElement ? titleElement.dataset.contactId : null;
                    if (!contactId) return;

                    const processedText = await window.applyAllRegex(transferMessage, { type: 'chat', id: contactId });
                    const latestAIRound = findLatestAIRound(chatAppData.messages[contactId]);
                    if (latestAIRound) {
                        const firstMessageOfRound = chatAppData.messages[contactId][latestAIRound.startIndex];
                        if (firstMessageOfRound.alternatives) {
                            delete firstMessageOfRound.alternatives;
                        }
                    }
                    
                    // 1. 创建新消息对象并更新数据层
                    const newMessage = { id: generateId(), text: processedText, sender: 'me', timestamp: Date.now() };
                    
                    if (!chatAppData.messages[contactId]) chatAppData.messages[contactId] = [];
                    chatAppData.messages[contactId].push(newMessage);
                    
                    const contactToUpdate = chatAppData.contacts.find(c => c.id === contactId);
                    contactToUpdate.lastMessage = "您有一笔转账，请查收"; // 统一显示为通用提示
                    contactToUpdate.lastActivityTime = Date.now();
                    
                    // 保存数据
                    await saveChatData();

                    // 3. 【核心修复】直接重绘聊天室，确保新消息（包括转账卡片）能正确渲染
                    await renderChatRoom(contactId);

                    // 更新联系人列表的最后消息（不重绘整个列表）
                    const contactItemInList = document.querySelector(`.chat-contact-item[data-contact-id="${contactId}"] .chat-contact-last-msg`);
                    if (contactItemInList) {
                        contactItemInList.textContent = "您有一笔转账，请查收";
                    }
                    
                    // 4. 触发API回复
                    const apiSettings = chatAppData.contactApiSettings[contactId] || JSON.parse(await localforage.getItem('apiSettings')) || {};
                    if (apiSettings.autoReply) {
                        triggerApiReply(contactId);
                    }
                };


                    // 【修复方案】使用克隆节点的方法，确保每次渲染聊天室时只绑定一个最新的事件监听器
                    // 这样可以避免因多次渲染而重复绑定旧的、持有过期输入框引用的监听器，从而解决校验错误的bug
                    const newConfirmBtn = confirmTransferBtn.cloneNode(true);
                    confirmTransferBtn.parentNode.replaceChild(newConfirmBtn, confirmTransferBtn);
                    newConfirmBtn.addEventListener('click', confirmTransfer);

                    // 点击遮罩层关闭
                    transferOverlay.addEventListener('click', (e) => {
                        if (e.target === transferOverlay) {
                            closeTransferPopup();
                        }
                    });
                }
            }
           
            // --- 绑定新功能的事件 ---

            // [已修改] 此处的点击事件已通过事件委托移至全局，以提高稳定性。

            
            // 返回/取消多选 按钮
            document.getElementById('chat-back-btn').addEventListener('click', () => {
                if (isInMultiSelectMode) {
                    isInMultiSelectMode = false;
                    selectedMessageIds.clear();
                    renderChatRoom(contactId);
                } else {
                    renderContactList();
                }
            });
            
            document.getElementById('chat-settings-btn').addEventListener('click', () => openChatSettings(contactId));

            const chatInput = document.getElementById('chat-input');
            const sendBtn = document.getElementById('send-btn');
            const apiReplyBtn = document.getElementById('api-reply-btn');
            const mentionSuggestions = document.getElementById('mention-suggestions');
            const mentionSuggestionsList = mentionSuggestions ? mentionSuggestions.querySelector('.mention-suggestions-list') : null;
            
            if (!isInMultiSelectMode) {
                // --- 提及悬浮窗逻辑 --- 
                // 显示提及悬浮窗
                const showMentionSuggestions = () => {
                    if (!contact.isGroup || !mentionSuggestions || !mentionSuggestionsList) return;
                    
                    const text = chatInput.value;
                    const atIndex = text.lastIndexOf('@');
                    
                    // 检查@是否是最后一个非空格字符
                    if (atIndex === -1 || atIndex < text.length - 1) {
                        mentionSuggestions.style.display = 'none';
                        return;
                    }
                    
                    // 获取群聊成员
                    const memberIds = contact.members || [];
                    const members = [];
                    
                    // 添加群聊成员（排除user）
                    memberIds.forEach(memberId => {
                        if (memberId !== 'user') {
                            const char = archiveData.characters.find(c => c.id === memberId);
                            if (char) {
                                members.push(char);
                            }
                        }
                    });
                    
                    if (members.length === 0) {
                        mentionSuggestions.style.display = 'none';
                        return;
                    }
                    
                    // 渲染成员列表
                    mentionSuggestionsList.innerHTML = members.map(member => `
                        <div class="mention-suggestion-item" data-member-id="${member.id}" data-member-name="${member.name}">
                            <div class="mention-suggestion-avatar" style="background-image: url('${member.avatar}');"></div>
                            <span class="mention-suggestion-name">${member.name}</span>
                        </div>
                    `).join('');
                    
                    // 显示悬浮窗
                    mentionSuggestions.style.display = 'block';
                    
                    // 绑定点击事件
                    mentionSuggestionsList.querySelectorAll('.mention-suggestion-item').forEach(item => {
                        item.addEventListener('click', () => {
                            const memberName = item.dataset.memberName;
                            const text = chatInput.value;
                            const atIndex = text.lastIndexOf('@');
                            
                            // 将@替换为@{{memberName}}
                            const newText = text.substring(0, atIndex) + `@{{${memberName}}}`;
                            chatInput.value = newText;
                            
                            // 隐藏悬浮窗
                            mentionSuggestions.style.display = 'none';
                            
                            // 重新聚焦输入框
                            chatInput.focus();
                        });
                    });
                };
                
                // 隐藏提及悬浮窗
                const hideMentionSuggestions = () => {
                    if (mentionSuggestions) {
                        mentionSuggestions.style.display = 'none';
                    }
                };
                
                // 监听输入事件
                chatInput.addEventListener('input', showMentionSuggestions);
                
                // 点击外部隐藏悬浮窗
                document.addEventListener('click', (e) => {
                    if (mentionSuggestions && !mentionSuggestions.contains(e.target) && e.target !== chatInput) {
                        hideMentionSuggestions();
                    }
                });
                
        /**
         * 新增：动态地将新消息追加到DOM，而不是重绘整个聊天室
         * @param {object} messageObject - 要追加的消息对象
         * @param {string} contactId - 当前聊天联系人的ID
         */
        const appendNewMessageToDOM = async (messageObject, contactId) => {
            const messagesContainer = document.getElementById('chat-messages-container');
            if (!messagesContainer) return;

            // 获取发送者信息
            const isSentByMe = messageObject.sender === 'me' || messageObject.sender === 'user';
            const userAvatarUrl = await localforage.getItem('userProfileAvatar') 
                                  || (document.getElementById('avatar-box').style.backgroundImage.match(/url\("?([^"]+)"?\)/) || [])[1] 
                                  || 'data:image/svg+xml;...';
            const senderAvatar = isSentByMe ? userAvatarUrl : (chatAppData.contacts.find(c => c.id === contactId)?.avatar || '');

            let messageContentHTML = '';
            if (messageObject.quote) {
                messageContentHTML += `<div class="quoted-message-in-bubble">${escapeHTML(messageObject.quote.text)}</div>`;
            }
            
            // 检查是否为转账消息
            const text = messageObject.text;
            const transferRegex = /\[转账\]金额:(\d+\.?\d*),说明:(.*)/;
            const match = text.match(transferRegex);
            if (match) {
                const amount = match[1];
                const description = match[2] || '无说明';
                // 渲染为转账卡片 (新样式)
                messageContentHTML += `
                <div class="transfer-card ${isSentByMe ? 'sent' : 'received'}">
                    <div class="card-content">
                        <div class="transfer-left-content">
                            <div class="transfer-icon">
                                <svg t="1769238774644" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5731">
                                    <path d="M515.6352 141.4656A371.2512 371.2512 0 0 1 813.568 292.352a25.6 25.6 0 1 0 41.472-30.3104A420.864 420.864 0 0 0 103.3728 426.3424l-18.8928-34.7136a25.6 25.6 0 0 0-45.0048 24.4736l58.4192 107.52a25.6 25.6 0 0 0 22.528 13.312 26.8288 26.8288 0 0 0 6.2976-0.768 25.6 25.6 0 0 0 19.3024-24.832 370.0224 370.0224 0 0 1 369.6128-369.8688zM990.5152 602.4704l-57.2928-103.7312a25.6 25.6 0 0 0-48.0256 12.3392A369.6128 369.6128 0 0 1 215.04 725.9136a25.6 25.6 0 1 0-41.6256 29.7472 420.864 420.864 0 0 0 754.8416-160.512l17.7152 32.1024a25.6 25.6 0 1 0 44.8-24.7808z" fill="#333333" p-id="5732"></path>
                                    <path d="M646.144 536.064a25.6 25.6 0 0 0 0-51.2h-80.2816L665.6 367.872a25.6 25.6 0 0 0-38.9632-33.1776L516.096 464.3328l-107.52-129.4336a25.6 25.6 0 0 0-39.3728 32.768L466.5344 484.864h-77.824a25.6 25.6 0 0 0 0 51.2h103.1168v47.616H388.7104a25.6 25.6 0 0 0 0 51.2h103.1168v85.1456a25.6 25.6 0 0 0 51.2 0V634.88h103.1168a25.6 25.6 0 0 0 0-51.2h-103.1168v-47.616z" fill="#333333" p-id="5733"></path>
                                </svg>
                            </div>
                            <div class="card-info">
                                <div class="transfer-amount">¥${parseFloat(amount).toFixed(2)}</div>
                                <div class="transfer-description">${escapeHTML(description)}</div>
                            </div>
                        </div>
                        <div></div> <!-- 这是用于占据右侧1/3空间的空白div -->
                    </div>
                    <div class="divider"></div>
                </div>`;
            } else {
                // 正常文本消息
                messageContentHTML += text.replace(/\n/g, '<br>');
            }

            const newMessageLine = document.createElement('div');
            newMessageLine.className = 'message-line sent new-message-animate'; // 使用 'sent' 样式和入场动画
            newMessageLine.dataset.messageId = messageObject.id;

            newMessageLine.innerHTML = `
                <div class="chat-avatar" style="background-image: url('${senderAvatar}')"></div>
                <div class="chat-bubble-container" style="display: flex; flex-direction: column; align-items: flex-end;">
                    <div class="chat-bubble sent ${match ? 'image-bubble' : ''}">
                        ${messageContentHTML}
                    </div>
                </div>
            `;

            messagesContainer.appendChild(newMessageLine);

            // 滚动到底部
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        };


        const sendMessage = async () => {
            const text = chatInput.value.trim();
            if (text) {
                hideMentionSuggestions(); // 发送消息时隐藏悬浮窗
                playSoundEffect('发送音效.wav'); // 播放发送音效
                
                const processedText = await window.applyAllRegex(text, { type: 'chat', id: contactId });
                const latestAIRound = findLatestAIRound(chatAppData.messages[contactId]);
                if (latestAIRound) {
                    const firstMessageOfRound = chatAppData.messages[contactId][latestAIRound.startIndex];
                    if (firstMessageOfRound.alternatives) {
                        delete firstMessageOfRound.alternatives;
                    }
                }
                
                // 1. 创建新消息对象并更新数据层
                const newMessage = { id: generateId(), text: processedText, sender: 'me', timestamp: Date.now(), quote: currentQuoteInfo };
                chatAppData.messages[contactId].push(newMessage);
                
                const contactToUpdate = chatAppData.contacts.find(c => c.id === contactId);
                contactToUpdate.lastMessage = processedText;
                contactToUpdate.lastActivityTime = Date.now();
                currentQuoteInfo = null; // 重置引用信息
                
                // 保存数据
                saveChatData();

                // 2. 清空输入框并保持焦点
                chatInput.value = '';
                chatInput.focus();

                // 3. 动态追加新消息到DOM，而不是重新渲染
                await appendNewMessageToDOM(newMessage, contactId);

                // 4. 清除可能存在的引用预览
                const quotePreviewContainer = document.getElementById('quote-preview-container');
                if (quotePreviewContainer) {
                    quotePreviewContainer.style.display = 'none';
                }

                // 更新联系人列表的最后消息（只更新那一项，不重绘整个列表）
                const contactItemInList = document.querySelector(`.chat-contact-item[data-contact-id="${contactId}"] .chat-contact-last-msg`);
                if (contactItemInList) {
                    contactItemInList.textContent = processedText;
                }
                
                // 5. 触发API回复
                const apiSettings = chatAppData.contactApiSettings[contactId] || JSON.parse(await localforage.getItem('apiSettings')) || {};
                if (apiSettings.autoReply) {
                    triggerApiReply(contactId);
                }
            }
        };

                sendBtn.addEventListener('click', sendMessage);
                chatInput.addEventListener('keydown', (e) => {
                    if(e.key === 'Enter' && !e.shiftKey) { // Shift+Enter 换行
                        e.preventDefault();
                        sendMessage();
                    }
                });
                
                apiReplyBtn.addEventListener('click', () => {
                     triggerApiReply(contactId);
                });
                
                const quotePreviewContainer = document.getElementById('quote-preview-container');
                const quotePreviewCloseBtn = document.getElementById('quote-preview-close');
                quotePreviewCloseBtn.addEventListener('click', () => {
                    quotePreviewContainer.style.display = 'none';
                    currentQuoteInfo = null;
                });
            } else {
                 // 多选模式下的工具栏事件
                document.getElementById('multi-collect-btn').addEventListener('click', async () => {
                    if (selectedMessageIds.size === 0) {
                        showCustomAlert("请至少选择一条消息。");
                        return;
                    }
                    
                    let collections = JSON.parse(await localforage.getItem('memoryCollections')) || [];
                    const contact = chatAppData.contacts.find(c => c.id === contactId);
                    if (!contact) return;
                    
                    const allMessages = chatAppData.messages[contactId];
                    // 深拷贝一份选中的消息，避免修改原始数据
                    const selectedMessages = JSON.parse(JSON.stringify(allMessages.filter(msg => selectedMessageIds.has(msg.id))));
                    
                    // 需求2：找到这几条消息所属的最后一个AI回复回合
                    const lastSelectedMsg = selectedMessages[selectedMessages.length - 1];
                    const lastSelectedMsgIndex = allMessages.findIndex(m => m.id === lastSelectedMsg.id);
                    
                    let turnVoiceData = null;
                    if (lastSelectedMsgIndex !== -1) {
                        for (let i = lastSelectedMsgIndex; i >= 0; i--) {
                            const msg = allMessages[i];
                            // 如果是AI的消息并且有voiceData，就记录下来并跳出循环
                            if (msg.sender === 'them' && msg.voiceData) {
                                turnVoiceData = msg.voiceData;
                                break;
                            }
                            // 如果遇到了用户的消息，说明AI回合结束了，也跳出循环
                            if (msg.sender === 'me' && i < lastSelectedMsgIndex) {
                                break;
                            }
                        }
                    }

                    // 如果找到了该回合的心声，将其附加到每一条被收藏的AI消息上
                    if (turnVoiceData) {
                        selectedMessages.forEach(msg => {
                            if (msg.sender === 'them') {
                                msg.voiceData = turnVoiceData;
                            }
                        });
                    }

                    const newCollection = {
                        id: 'collection_' + generateId(),
                        charId: contactId,
                        charName: contact.name,
                        charAvatar: contact.avatar,
                        userAvatar: await localforage.getItem('userProfileAvatar') || (document.getElementById('avatar-box').style.backgroundImage.match(/url\("?([^"]+)"?\)/) || [])[1] || '',
                        messages: selectedMessages,
                        timestamp: Date.now(),
                    };

                    collections.unshift(newCollection);
                    await localforage.setItem('memoryCollections', JSON.stringify(collections));

                    showGlobalToast(`已成功收藏 ${selectedMessages.length} 条与 ${contact.name} 的消息！`, { type: 'success' });
                    
                    isInMultiSelectMode = false;
                    selectedMessageIds.clear();
                    renderChatRoom(contactId);
                });

                document.getElementById('multi-delete-btn').addEventListener('click', () => {
                    if (selectedMessageIds.size === 0) return;
                    showCustomConfirm(`确定要删除所选的 ${selectedMessageIds.size} 项内容吗？`, () => {
                        const contact = chatAppData.contacts.find(c => c.id === contactId);
                        const allMessages = chatAppData.messages[contactId];
                        
                        // 1. 创建一个最终要删除的ID集合，先包含所有已选中的ID
                        const idsToDelete = new Set(selectedMessageIds);

                        // 2. 遍历已选中的ID，查找并展开折叠块
                        selectedMessageIds.forEach(msgId => {
                            const message = allMessages.find(m => m.id === msgId);
                            
                            // 检查选中的是否是折叠块的起始标记
                            if (message && message.type === 'mode_switch' && message.isFolded) {
                                const startIndex = allMessages.findIndex(m => m.id === msgId);
                                
                                // 如果找到了起始点，就向后查找结束点
                                if (startIndex !== -1) {
                                    let endIndex = -1;
                                    for (let i = startIndex + 1; i < allMessages.length; i++) {
                                        if (allMessages[i].type === 'mode_switch') {
                                            endIndex = i;
                                            break;
                                        }
                                    }

                                    // 如果找到了结束点，将整个区块内的所有消息ID都添加到删除集合中
                                    if (endIndex !== -1) {
                                        for (let i = startIndex; i <= endIndex; i++) {
                                            idsToDelete.add(allMessages[i].id);
                                        }
                                    }
                                }
                            }
                        });

                        // 3. 检查删除集合中是否包含模式切换消息
                        const hasModeSwitchMessage = Array.from(idsToDelete).some(id => {
                            const msg = allMessages.find(m => m.id === id);
                            return msg && msg.type === 'mode_switch';
                        });

                        // 4. 使用最终的删除集合来过滤消息
                        const remainingMessages = allMessages.filter(
                            msg => !idsToDelete.has(msg.id)
                        );
                        chatAppData.messages[contactId] = remainingMessages;

                        // 5. 如果确实删除了模式切换消息，则重算当前模式
                        if (hasModeSwitchMessage && contact) {
                            const lastModeSwitchMessage = [...remainingMessages].reverse().find(msg => msg.type === 'mode_switch');
                            contact.offlineMode = lastModeSwitchMessage ? (lastModeSwitchMessage.mode === 'offline') : false;
                            showGlobalToast(`模式已重置为: ${contact.offlineMode ? '线下' : '线上'}`, {type: 'info'});
                        }

                        saveChatData();
                        
                        // 6. 退出多选并刷新界面
                        isInMultiSelectMode = false;
                        selectedMessageIds.clear();
                        renderChatRoom(contactId);
                    });
                });

                updateMultiSelectToolbar();
            }
        };

        /**
         * 新增：打开“印象”弹窗
         * @param {string} contactId - 当前聊天对象的ID
         */
        const openImpressionPopup = async (contactId) => {
            const overlay = document.getElementById('impression-overlay');
            if (!overlay) return;
            
            const contact = chatAppData.contacts.find(c => c.id === contactId);
            const userAvatarUrl = await localforage.getItem('userProfileAvatar') 
                                  || (document.getElementById('avatar-box').style.backgroundImage.match(/url\("?([^"]+)"?\)/) || [])[1] 
                                  || 'data:image/svg+xml;...'; // 省略默认SVG
            if (!contact) {
                showCustomAlert('找不到当前联系人信息。');
                return;
            }

            // --- 数据填充 (已接入真实数据) ---
            
            // 1. 填充头像
            const avatarsContainer = document.getElementById('impression-avatars');
            // 为角色头像添加一个ID，方便后续绑定事件
            avatarsContainer.innerHTML = `
                <div id="impression-char-avatar" class="impression-avatar-circle" style="background-image: url('${contact.avatar}')" title="双击设置自动分析回合数"></div>
                <div class="impression-avatar-circle" style="background-image: url('${userAvatarUrl}')"></div>
            `;
            
            // 2. 获取并填充真实的关系
            const relationshipEl = document.getElementById('impression-relationship');
            relationshipEl.textContent = contact.relationship || '刚认识'; // 从contact对象读取

            // 3. 获取并填充真实的印象列表
            const impressionList = contact.impressions || [];
            const listContainer = document.getElementById('impression-list');
            
            if (impressionList.length === 0) {
                listContainer.innerHTML = `<span class="empty-text" style="text-align:center; padding: 20px 0;">还没有形成对你的印象...</span>`;
            } else {
                // 为每条印象添加 data-timestamp 属性，用于唯一标识
                listContainer.innerHTML = impressionList.map(impression => `
                    <div class="impression-list-item" data-timestamp="${impression.timestamp}">
                        <span class="impression-list-dot"></span>
                        <span>${escapeHTML(impression.text)}</span>
                    </div>
                `).join('');
            }

            // --- 显示弹窗 ---
            overlay.classList.add('visible');
            
            // --- 绑定事件 ---

            // 为角色头像绑定双击事件
            const charAvatar = document.getElementById('impression-char-avatar');
            charAvatar.addEventListener('dblclick', () => {
                const currentThreshold = contact.impressionTurnThreshold || 0;
                showCustomPrompt(
                    `设置自动分析的回合数 (0为关闭):`, 
                    currentThreshold,
                    (newValue) => {
                        const newThreshold = parseInt(newValue, 10);
                        if (isNaN(newThreshold) || newThreshold < 0) {
                            showCustomAlert('请输入一个有效的非负整数。');
                            return;
                        }
                        contact.impressionTurnThreshold = newThreshold;
                        saveChatData();
                        showGlobalToast(`设置已保存！现在每 ${newThreshold} 回合分析一次。`, { type: 'success' });
                    }
                );
            });
            
            // === 新增：为印象列表容器绑定双击删除事件 (事件委托) ===
            listContainer.addEventListener('dblclick', (e) => {
                const itemToDelete = e.target.closest('.impression-list-item');
                if (!itemToDelete) return;

                const timestampToDelete = parseInt(itemToDelete.dataset.timestamp, 10);
                if (!timestampToDelete) return;

                // 从界面上移除该条目
                itemToDelete.style.transition = 'opacity 0.3s, transform 0.3s';
                itemToDelete.style.opacity = '0';
                itemToDelete.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    itemToDelete.remove();
                     // 如果删除后列表为空，显示提示语
                    if (listContainer.children.length === 0) {
                        listContainer.innerHTML = `<span class="empty-text" style="text-align:center; padding: 20px 0;">还没有形成对你的印象...</span>`;
                    }
                }, 300);

                // 从数据中删除
                contact.impressions = contact.impressions.filter(imp => imp.timestamp !== timestampToDelete);
                saveChatData();

                showGlobalToast('印象已删除', { type: 'info', duration: 1500 });
            });
            // === 新增逻辑结束 ===

            // --- 绑定关闭事件 ---
            const closeBtn = document.getElementById('impression-close-btn');
            const newCloseBtn = closeBtn.cloneNode(true); // 移除旧监听
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            const closePopup = () => overlay.classList.remove('visible');
            newCloseBtn.onclick = closePopup;
            
            // 点击遮罩层关闭
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closePopup();
                }
            }, { once: true });
        };
        // --- App 主流程控制 ---

        // 打开 Chat App
        const openChatApp = async (e) => {
            // 新增：首次打开时请求通知权限
            if ('Notification' in window && Notification.permission === 'default') {
                requestNotificationPermission();
            }

            // 检查事件对象是否存在，如果存在则计算动画原点
            if (e && e.currentTarget) {
                const clickedElement = e.currentTarget;
                const rect = clickedElement.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                chatContainer.style.transformOrigin = `${x}px ${y}px`;
            } else {
                // 如果没有事件对象（例如从消息横幅点击），则使用默认的中心放大动画
                chatContainer.style.transformOrigin = '50% 50%';
            }
            
            chatContainer.classList.add('visible');
            chatappFab.classList.add('visible'); // 显示 Chat App FAB
            await renderContactList(); // 默认显示联系人列表
            
            // 初始化导航按钮事件
            setTimeout(initNavButtons, 100); // 延迟一下，确保DOM已渲染
        };


        // 关闭 Chat App
        const closeChatApp = () => {
            chatContainer.classList.remove('visible');
            chatContent.innerHTML = ''; // 清空内容
            chatappFab.classList.remove('visible'); // 隐藏 Chat App FAB
            closeAddContactModal(); // 确保关闭添加联系人模态窗

            // --- 新增：确保关闭所有与聊天相关的悬浮窗和侧边栏 ---
            closeChatSettings(); // 关闭设置侧边栏
            hideChatListContextMenu(); // 关闭联系人列表的长按菜单
            hideContextMenu(); // 关闭消息的长按菜单
            // --- 新增结束 ---
        };

        // 渲染朋友圈页面
        const renderMomentsPage = async () => {
            const container = document.getElementById('chat-app-content');
            if (!container) return;

            container.innerHTML = `
                <div class="moments-page">
                    <div class="chat-main-header">
                        <button class="chat-header-btn" id="chat-back-btn">
                            <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
                        </button>
                        <span style="position: absolute; left: 50%; transform: translateX(-50%);">朋友圈</span>
                    </div>
                    <div class="moments-content">
                        <span class="empty-text" style="text-align:center; display:block; padding: 40px 0;">朋友圈功能待开发</span>
                    </div>
                </div>
            `;

            // 绑定返回按钮事件
            document.getElementById('chat-back-btn').addEventListener('click', () => {
                // 返回联系人列表
                renderContactList();
                // 更新导航按钮状态
                const chatBtn = document.getElementById('chat-nav-chat');
                const momentsBtn = document.getElementById('chat-nav-moments');
                chatBtn.classList.add('active');
                momentsBtn.classList.remove('active');
            });
        };

        // 初始化导航按钮事件
        const initNavButtons = () => {
            const chatBtn = document.getElementById('chat-nav-chat');
            const momentsBtn = document.getElementById('chat-nav-moments');

            if (chatBtn && momentsBtn) {
                chatBtn.addEventListener('click', async () => {
                    chatBtn.classList.add('active');
                    momentsBtn.classList.remove('active');
                    await renderContactList();
                });

                momentsBtn.addEventListener('click', async () => {
                    momentsBtn.classList.add('active');
                    chatBtn.classList.remove('active');
                    await renderMomentsPage();
                });
            }
        };


  // --- 设置侧边栏控制 ---
        // [修改] 用于暂存正在编辑的联系人数据
        let tempChatContact = null; 
        
        const openChatSettings = async (contactId) => {
            const contact = chatAppData.contacts.find(c => c.id === contactId);
            if (!contact) return;
            
            // [核心修改] 创建一个深拷贝的临时对象进行编辑
            tempChatContact = JSON.parse(JSON.stringify(contact));

            // [新增] 从 archiveData 获取最新的、权威的角色信息
            const archiveProfile = archiveData.characters.find(c => c.id === contactId) || tempChatContact;

            // 如果在档案里找不到（比如是系统消息），则使用contact自身的信息作为后备
            const authoritativeName = archiveProfile.name;
            // 同步 chatAppData 中的名字，以备档案被删除等边缘情况
            if (contact.name !== authoritativeName) {
                contact.name = authoritativeName;
                saveChatData(); // 保存同步后的名字
            }
            // 确保每个角色都有完整的设置项
            contact.remark = contact.remark || '';
            contact.contextLength = contact.contextLength || 20;
            contact.chatBgDay = contact.chatBgDay || '';
            contact.chatBgNight = contact.chatBgNight || '';
            contact.bubbleCss = contact.bubbleCss || '';
            contact.memorySummary = contact.memorySummary === true;
            contact.realtimePerception = contact.realtimePerception === true;
            contact.boundWorldBookItems = contact.boundWorldBookItems || [];
            contact.voiceId = contact.voiceId || ''; // 新增：确保 voiceId 属性存在
            
            chatAppData.contactApiSettings[contactId] = chatAppData.contactApiSettings[contactId] || {};
            const contactApiSettings = chatAppData.contactApiSettings[contactId];
            const globalApiSettings = JSON.parse(await localforage.getItem('apiSettings')) || {};
            const effectiveApiSettings = { ...globalApiSettings, ...contactApiSettings };
            const userAvatarDataUrl = await localforage.getItem('userProfileAvatar') 
                || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>`;
            const settingsBody = document.getElementById('chat-settings-body');
            // 【群聊改造】动态生成群成员头像网格的HTML
            let groupMembersHTML = '';
            if (tempChatContact.isGroup) {
                // 1. 获取所有成员的profile，把用户自己放在第一位
                const userProfile = {
                    id: 'user',
                    name: '我',
                    avatar: userAvatarDataUrl
                };
                // 从档案中查找其他成员，找不到则用默认值
                const otherMembersProfiles = tempChatContact.members
                    .filter(id => id !== 'user')
                    .map(id => archiveData.characters.find(c => c.id === id) || { id, name: '未知成员', avatar: DEFAULT_CHAR_AVATAR_SVG });
                
                // 2. 合并所有成员，优先使用当前聊天框的自定义头像
                const allMemberProfiles = [userProfile, ...otherMembersProfiles].map(member => {
                    // 如果当前聊天框有该成员的自定义头像，则使用它
                    if (tempChatContact.memberAvatars && tempChatContact.memberAvatars[member.id]) {
                        return {
                            ...member,
                            avatar: tempChatContact.memberAvatars[member.id]
                        };
                    }
                    return member;
                });

                // 2. 生成HTML，每行最多3个
                groupMembersHTML = `
                    <div class="chat-setting-item vertical">
                        <label>群成员 (${allMemberProfiles.length})</label>
                        <div class="avatar-selection-container" style="justify-content: flex-start; flex-wrap: wrap; gap: 10px; max-width: 100%;">
                            ${allMemberProfiles.map(member => `
                                <div class="avatar-picker" id="member-avatar-picker-${member.id}" style="cursor: default;">
                                    <div class="avatar-preview-circle" id="member-avatar-${member.id}" style="background-image: url('${member.avatar}'); cursor: pointer;"></div>
                                    <input type="text" class="avatar-picker-label editable" id="member-nickname-input-${member.id}" style="max-width: 60px; overflow: hidden; text-overflow: ellipsis; background-color: rgba(0, 0, 0, 0.05); border: 1px solid transparent; border-radius: 4px; padding: 2px 4px; text-align: center;" value="${escapeHTML(tempChatContact.memberNicknames?.[member.id] || member.name)}" placeholder="${escapeHTML(member.name)}" data-member-id="${member.id}">
                                    <input type="file" id="member-avatar-upload-${member.id}" accept="image/*" hidden>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            settingsBody.innerHTML = `
                <div class="settings-group-glass">
                    <div class="chat-setting-item">
                        <label>${tempChatContact.isGroup ? '群聊名' : '姓名'}</label>
                        ${tempChatContact.isGroup
                            ? `<input type="text" id="group-name-input" class="setting-input" value="${escapeHTML(tempChatContact.name)}">`
                            : `<span class="setting-input" style="background: transparent; border-color: transparent; padding-left: 0; user-select: text;">${escapeHTML(authoritativeName)}</span>`
                        }
                    </div>

                    ${tempChatContact.isGroup
                        ? `
                            <div class="chat-setting-item vertical">
                                <label>群聊头像</label>
                                <div class="avatar-picker" id="group-avatar-setting-picker">
                                    <div class="avatar-preview-circle" style="background-image: url('${tempChatContact.avatar}')"></div>
                                    <input type="file" id="group-avatar-setting-upload" accept="image/*" hidden>
                                </div>
                            </div>
                           `
                        : `
                            <div class="chat-setting-item">
                                <label for="char-remark-input">备注</label>
                                <input type="text" id="char-remark-input" class="setting-input" value="${contact.remark}" placeholder="不会被AI读取">
                            </div>
                           `
                    }
                    
                    ${tempChatContact.isGroup
                        ? groupMembersHTML // 插入群成员头像网格
                        : contact.id !== 'system' // 私聊时，显示双头像选择器
                            ? `
                            <div class="chat-setting-item vertical">
                                <label>头像</label>
                                <div class="avatar-selection-container">
                                    <div class="avatar-picker" id="char-avatar-picker">
                                        <div class="avatar-preview-circle" style="background-image: url('${contact.avatar}')"></div>
                                        <span class="avatar-picker-label">对方头像</span>
                                        <input type="file" id="char-avatar-upload" accept="image/*" hidden>
                                    </div>
                                    <div class="avatar-picker" id="user-avatar-picker">
                                        <div class="avatar-preview-circle" id="user-avatar-preview-in-settings" style="background-image: url('${userAvatarDataUrl}')"></div>
                                        <span class="avatar-picker-label">我的头像</span>
                                        <input type="file" id="user-avatar-upload" accept="image/*" hidden>
                                    </div>
                                </div>
                            </div>
                            ` : ''
                    }

                    <!-- 【修复】将绑定世界书和上下文条数移到条件判断之外，确保始终显示 -->
                    <div class="chat-setting-item vertical">
                        <label>绑定世界书</label>
                        <div id="worldbook-binder-container" class="worldbook-binder-container">
                            <button id="worldbook-binder-toggle" class="setting-action-button">未绑定</button>
                            <div id="worldbook-binder-tree" class="worldbook-binder-tree" style="display: none;"></div>
                        </div>
                    </div>
                    <div class="chat-setting-item">
                        <label for="char-context-input">上下文条数</label>
                        <input type="number" id="char-context-input" class="setting-input" value="${contact.contextLength}" style="flex-grow: 0; width: 70px; text-align: right;">
                    </div>
                </div>

                <!-- 聊天美化 (这部分对于群聊和私聊是通用的) -->
                <div class="settings-group-glass">
                    <div class="chat-setting-item vertical">
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                             <label>聊天背景</label>
                             <button id="clear-chat-bg-btn" class="clear-btn-subtle">清除</button>
                        </div>
                        <div class="wallpaper-mockup-container">
                            <div class="wallpaper-mockup">
                                <div class="phone-frame">
                                    <div id="day-wallpaper-preview" class="phone-screen" style="background-image: url('${contact.chatBgDay || ''}')"></div>
                                </div>
                                <span class="wallpaper-mockup-label">昼间</span>
                                <input type="file" id="day-wallpaper-upload" accept="image/*" hidden>
                            </div>
                            <div class="wallpaper-mockup dark">
                                <div class="phone-frame">
                                    <div id="night-wallpaper-preview" class="phone-screen" style="background-image: url('${contact.chatBgNight || ''}')"></div>
                                </div>
                                <span class="wallpaper-mockup-label">夜间</span>
                                <input type="file" id="night-wallpaper-upload" accept="image/*" hidden>
                            </div>
                        </div>
                    </div>
                    <div class="chat-setting-item vertical">
                        <label for="bubble-css-input">气泡CSS</label>
                         <div class="preset-section" style="padding: 10px; width:100%; margin-bottom: 10px; background: rgba(0,0,0,0.02);">
                            <div class="modal-form-group" style="gap: 10px;">
                                <label style="font-size: 13px; opacity: 0.6;">预设管理</label>
                                <div class="preset-controls" style="grid-template-columns: 1fr auto auto;">
                                    <select id="bubble-preset-select" class="modal-select" style="width: 100%;"></select>
                                    <button id="save-bubble-preset-btn" class="modal-button" title="保存为新预设">保存</button>
                                    <button id="delete-bubble-preset-btn" class="modal-button secondary" style="background-color:#be123c; color:white;" title="删除当前预设">删除</button>
                                </div>
                            </div>
                        </div>
                        <textarea id="bubble-css-input" class="setting-textarea" placeholder=".sent { ... }&#10;.received { ... }">${contact.bubbleCss}</textarea>
                    </div>
                    <div class="chat-setting-item vertical">
                        <label for="bubble-font-family-select">气泡字体</label>
                        <select id="bubble-font-family-select" class="setting-input" style="padding: 8px 12px; height: 38px;"></select>
                    </div>
                </div>

                <!-- 玩法设置 etc. -->
                <div class="settings-group-glass">
                    ${tempChatContact.isGroup ? '' : `
                        <div class="chat-setting-item">
                            <label for="char-voice-id-input">Voice ID</label>
                            <input type="text" id="char-voice-id-input" class="setting-input" value="${contact.voiceId || ''}" placeholder="Minimax语音音色ID">
                        </div>
                    `}
                    <div class="chat-setting-item">
                        <label>实时时间感知</label>
                        <label class="switch-container">
                            <input type="checkbox" id="realtime-perception-toggle" ${contact.realtimePerception ? 'checked' : ''}>
                            <span class="switch-slider"></span>
                        </label>                    
                    </div>
                    <div class="chat-setting-item">
                        <label>AI识图</label>
                        <label class="switch-container">
                            <input type="checkbox" id="ai-vision-toggle" ${contact.aiVisionEnabled ? 'checked' : ''}>
                            <span class="switch-slider"></span>
                        </label>                    
                    </div>
                    ${tempChatContact.isGroup ? `
                        <div class="chat-setting-item">
                            <label>显示名称</label>
                            <label class="switch-container">
                                <input type="checkbox" id="show-names-toggle" ${tempChatContact.showGroupNames ? 'checked' : ''}>
                                <span class="switch-slider"></span>
                            </label>                    
                        </div>
                    ` : `
                        <div class="chat-setting-item">
                            <label>隐藏头像</label>
                            <label class="switch-container">
                                <input type="checkbox" id="hide-avatars-toggle" ${contact.hideAvatars ? 'checked' : ''}>
                                <span class="switch-slider"></span>
                            </label>                    
                        </div>
                    `}
                </div>
                
                <div class="settings-group-glass">
                    <div class="chat-setting-item" style="gap: 10px;">
                        <input type="file" id="import-chat-history-input" accept=".json" hidden>
                        <button id="import-chat-history-btn" class="setting-action-button" style="flex: 1;">导入聊天记录</button>
                        <button id="export-chat-history-btn" class="setting-action-button" style="flex: 1;">导出聊天记录</button>
                    </div>
                     <div class="chat-setting-item" style="gap: 10px;">
                        <button id="clear-chat-btn" class="setting-action-button danger" style="flex: 1;">清空聊天</button>
                    </div>
                </div>
            `;
            
            chatSettingsOverlay.classList.add('visible');
            chatSettingsModal.classList.add('visible');

            const createAvatarUploader = (pickerId, inputId, onUpload) => {
                const picker = document.getElementById(pickerId);
                const input = document.getElementById(inputId);
                // 安全检查，如果元素不存在则不绑定事件
                if (!picker || !input) return;
                
                // 只绑定到头像元素，而不是整个picker
                const avatarElement = picker.querySelector('.avatar-preview-circle');
                if (avatarElement) {
                    avatarElement.addEventListener('click', () => input.click());
                }
                input.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        compressImage(file).then(compressedDataUrl => {
                            onUpload(compressedDataUrl);
                        }).catch(error => {
                            console.error("聊天设置头像压缩失败:", error);
                            showCustomAlert("图片压缩失败，请换张图片或稍后再试。");
                        });
                    }
                });
            };

            // 仅在非系统联系人时才绑定头像上传事件
            if (contact.id !== 'system') {
            // 【群聊改造】为群聊和私聊分别绑定不同的事件
            if (tempChatContact.isGroup) {
                // 为可编辑的群聊名称绑定事件
                const groupNameInput = document.getElementById('group-name-input');
                if (groupNameInput) {
                    groupNameInput.addEventListener('blur', () => {
                        tempChatContact.name = groupNameInput.value.trim();
                    });
                }
                
                // 为修改群头像绑定事件
                createAvatarUploader('group-avatar-setting-picker', 'group-avatar-setting-upload', (dataUrl) => {
                    tempChatContact.avatar = dataUrl;
                    document.getElementById('group-avatar-setting-picker').querySelector('.avatar-preview-circle').style.backgroundImage = `url(${dataUrl})`;
                });
                
                // 为群成员头像绑定事件
                // 1. 确保tempChatContact有memberAvatars属性来存储当前聊天框的成员头像
                if (!tempChatContact.memberAvatars) {
                    tempChatContact.memberAvatars = {};
                }
                
                // 2. 获取所有成员的profile，包括用户自己
                const userProfile = {
                    id: 'user',
                    name: '我',
                    avatar: userAvatarDataUrl
                };
                const otherMembersProfiles = tempChatContact.members
                    .filter(id => id !== 'user')
                    .map(id => archiveData.characters.find(c => c.id === id) || { id, name: '未知成员', avatar: DEFAULT_CHAR_AVATAR_SVG });
                const allMemberProfiles = [userProfile, ...otherMembersProfiles];
                
                // 3. 为每个成员头像绑定上传事件
                allMemberProfiles.forEach(member => {
                    createAvatarUploader(
                        `member-avatar-picker-${member.id}`, 
                        `member-avatar-upload-${member.id}`, 
                        (dataUrl) => {
                            // 存储成员头像到当前聊天对象
                            tempChatContact.memberAvatars[member.id] = dataUrl;
                            // 更新预览头像
                            document.getElementById(`member-avatar-${member.id}`).style.backgroundImage = `url(${dataUrl})`;
                            // 重新渲染聊天室以显示新头像
                            renderChatRoom(contactId);
                        }
                    );
                });
                
                // 为“显示名称”开关绑定事件
                const showNamesToggle = document.getElementById('show-names-toggle');
                if(showNamesToggle){
                    showNamesToggle.addEventListener('change', () => {
                        tempChatContact.showGroupNames = showNamesToggle.checked;
                    });
                }

            } else {
                // 仅在非系统联系人时才绑定头像上传事件 (私聊)
                if (contact.id !== 'system') {
                    createAvatarUploader('char-avatar-picker', 'char-avatar-upload', (dataUrl) => {
                        tempChatContact.avatar = dataUrl;
                        // 使用更精确的上下文查找来更新预览
                        document.getElementById('char-avatar-picker').querySelector('.avatar-preview-circle').style.backgroundImage = `url(${dataUrl})`;
                    });

                    createAvatarUploader('user-avatar-picker', 'user-avatar-upload', async (dataUrl) => {
                                await localforage.setItem('userProfileAvatar', dataUrl); // 保存到localforage
                                document.getElementById('avatar-box').style.backgroundImage = `url(${dataUrl})`;
                                document.getElementById('user-avatar-preview-in-settings').style.backgroundImage = `url(${dataUrl})`;
                                renderChatRoom(contactId);
                            });
                }
            }

            }

            const setupWallpaperUploader = (previewId, inputId, storageKey) => {
                const preview = document.getElementById(previewId);
                const input = document.getElementById(inputId);
                preview.closest('.wallpaper-mockup').addEventListener('click', () => input.click());
                input.addEventListener('change', e => {
                    const file = e.target.files[0];
                    if (file) {
                        compressImage(file, 2500, 0.98).then(compressedDataUrl => {
                            tempChatContact[storageKey] = compressedDataUrl; // 更新临时对象
                            preview.style.backgroundImage = `url('${compressedDataUrl}')`;
                        }).catch(error => {
                             console.error("聊天背景压缩失败:", error);
                             showCustomAlert("图片压缩失败，请换张图片或稍后再试。");
                        });
                    }
                });
            };

            setupWallpaperUploader('day-wallpaper-preview', 'day-wallpaper-upload', 'chatBgDay');
            setupWallpaperUploader('night-wallpaper-preview', 'night-wallpaper-upload', 'chatBgNight');
            document.getElementById('clear-chat-bg-btn').addEventListener('click', () => {
                // 清空临时数据中的背景图
                tempChatContact.chatBgDay = '';
                tempChatContact.chatBgNight = '';
                // 清空预览图
                document.getElementById('day-wallpaper-preview').style.backgroundImage = '';
                document.getElementById('night-wallpaper-preview').style.backgroundImage = '';
                showGlobalToast('聊天背景已清除，保存后生效', { type: 'info' });
            });

            // 查找插入点
            const wallpaperGroup = document.querySelector('.wallpaper-mockup-container').closest('.chat-setting-item');
            if (wallpaperGroup) {
                const colorPickerHTML = `
                    <div class="chat-setting-item vertical">
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                            <label>气泡颜色</label>
                            <button id="clear-bubble-colors-btn" class="clear-btn-subtle">清除</button>
                        </div>
                        <div class="bubble-color-selectors-container">
                            <div class="bubble-color-picker">
                                <div class="bubble-color-swatch-wrapper">
                                    <div id="char-bubble-color-swatch" class="bubble-color-swatch" style="background-color: ${contact.charBubbleColor || '#EFEFEE'};"></div>
                                    <input type="color" id="char-bubble-color-picker" value="${contact.charBubbleColor || '#EFEFEE'}">
                                </div>
                                <span class="bubble-color-picker-label">对方气泡</span>
                            </div>
                            <div class="bubble-color-picker">
                                <div class="bubble-color-swatch-wrapper">
                                    <div id="my-bubble-color-swatch" class="bubble-color-swatch" style="background-color: ${contact.myBubbleColor || '#C0BBBE'};"></div>
                                    <input type="color" id="my-bubble-color-picker" value="${contact.myBubbleColor || '#C0BBBE'}">
                                </div>
                                <span class="bubble-color-picker-label">我的气泡</span>
                            </div>
                        </div>
                    </div>
                `;
                wallpaperGroup.insertAdjacentHTML('afterend', colorPickerHTML);
            }

            // 绑定颜色选择器事件
            const setupBubbleColorPicker = (pickerId, swatchId, propertyName) => {
                const picker = document.getElementById(pickerId);
                const swatch = document.getElementById(swatchId);
                if (!picker || !swatch) return;

                picker.addEventListener('input', () => {
                    const newColor = picker.value;
                    swatch.style.backgroundColor = newColor;
                    tempChatContact[propertyName] = newColor;
                });
            };

            setupBubbleColorPicker('char-bubble-color-picker', 'char-bubble-color-swatch', 'charBubbleColor');
            setupBubbleColorPicker('my-bubble-color-picker', 'my-bubble-color-swatch', 'myBubbleColor');
            
            // 添加气泡颜色清除按钮事件监听器
            document.getElementById('clear-bubble-colors-btn').addEventListener('click', () => {
                // 清空临时数据中的气泡颜色
                delete tempChatContact.charBubbleColor;
                delete tempChatContact.myBubbleColor;
                // 重置颜色选择器和预览
                const charBubbleColorPicker = document.getElementById('char-bubble-color-picker');
                const myBubbleColorPicker = document.getElementById('my-bubble-color-picker');
                const charBubbleColorSwatch = document.getElementById('char-bubble-color-swatch');
                const myBubbleColorSwatch = document.getElementById('my-bubble-color-swatch');
                
                if (charBubbleColorPicker) charBubbleColorPicker.value = '#EFEFEE';
                if (myBubbleColorPicker) myBubbleColorPicker.value = '#C0BBBE';
                if (charBubbleColorSwatch) charBubbleColorSwatch.style.backgroundColor = '#EFEFEE';
                if (myBubbleColorSwatch) myBubbleColorSwatch.style.backgroundColor = '#C0BBBE';
                
                showGlobalToast('气泡颜色已清除，保存后生效', { type: 'info' });
            });

            const setupInputSaver = (elementId, propertyName, isNumber = false) => {
                const input = document.getElementById(elementId);
                if (!input) return; // 安全检查
                const eventType = input.type === 'checkbox' ? 'change' : 'blur';
                const valueGetter = () => {
                    if (input.type === 'checkbox') return input.checked;
                    if (isNumber) return parseInt(input.value, 10) || 0;
                    return input.value;
                };
                
                input.addEventListener(eventType, () => {
                    // [核心修改] 所有输入都只修改 tempChatContact
                    tempChatContact[propertyName] = valueGetter();
                    // 移除 saveChatData()
                });
            };

            setupInputSaver('char-remark-input', 'remark');
            setupInputSaver('char-context-input', 'contextLength', true);
            // 新增：为 Voice ID 输入框绑定保存逻辑
            setupInputSaver('char-voice-id-input', 'voiceId');
            
            const bubbleCssInput = document.getElementById('bubble-css-input');
            bubbleCssInput.addEventListener('blur', () => {
                tempChatContact.bubbleCss = bubbleCssInput.value;
                 // 移除 saveChatData()
            });

            // setupInputSaver('offline-mode-toggle', 'offlineMode'); // 这个开关有联动效果，需要单独处理
            setupInputSaver('realtime-perception-toggle', 'realtimePerception');
            // 【新增】为AI识图开关绑定保存逻辑
            setupInputSaver('ai-vision-toggle', 'aiVisionEnabled');

            // 【新增】为隐藏头像开关绑定保存逻辑
            setupInputSaver('hide-avatars-toggle', 'hideAvatars');

            
            const bubblePresetSelect = document.getElementById('bubble-preset-select');
            const saveBubblePresetBtn = document.getElementById('save-bubble-preset-btn');
            const deleteBubblePresetBtn = document.getElementById('delete-bubble-preset-btn');
            const PRESET_KEY = 'chatBubbleCssPresets';

            const loadBubblePresets = async () => {
            const presets = JSON.parse(await localforage.getItem(PRESET_KEY)) || {};
            bubblePresetSelect.innerHTML = '<option value="">选择预设...</option>';
            for (const name in presets) {
                bubblePresetSelect.innerHTML += `<option value="${name}">${name}</option>`;
            }
        };
            
            bubblePresetSelect.addEventListener('change', async () => {
                const presets = JSON.parse(await localforage.getItem(PRESET_KEY)) || {};
                const selectedName = bubblePresetSelect.value;
                if (selectedName && presets[selectedName]) {
                    bubbleCssInput.value = presets[selectedName];
                    bubbleCssInput.dispatchEvent(new Event('blur'));
                }
            });

            saveBubblePresetBtn.addEventListener('click', async () => {
                showCustomPrompt("请输入预设名称：", '', async (name) => {
                    if (name && name.trim()) {
                        const presets = JSON.parse(await localforage.getItem(PRESET_KEY)) || {};
                        presets[name.trim()] = bubbleCssInput.value;
                        await localforage.setItem(PRESET_KEY, JSON.stringify(presets));
                        await loadBubblePresets();
                        bubblePresetSelect.value = name.trim();
                    }
                });
            });

            deleteBubblePresetBtn.addEventListener('click', async () => {
                const selectedName = bubblePresetSelect.value;
                if (selectedName) {
                    showCustomConfirm(`确定要删除预设 "${selectedName}" 吗？`, async () => {
                        const presets = JSON.parse(await localforage.getItem(PRESET_KEY)) || {};
                        delete presets[selectedName];
                        await localforage.setItem(PRESET_KEY, JSON.stringify(presets));
                        await loadBubblePresets();
                    });
                } else {
                    showCustomAlert("请先选择一个要删除的预设。");
                }
            });

                        // [新增] 聊天记录清空功能
            document.getElementById('clear-chat-btn').addEventListener('click', () => {
                // 使用备注或姓名进行确认提示
                const confirmName = contact.remark || contact.name;
                if (confirm(`确定要清空与 ${confirmName} 的所有聊天记录吗？此操作不可恢复。`)) {
                    // 清空对应联系人的消息数组
                    chatAppData.messages[contactId] = [];
                    // 更新联系人列表中的最后一条消息预览
                    contact.lastMessage = "聊天记录已清空";
                    // 保存数据
                    saveChatData();
                    // 关闭设置侧边栏并重新渲染聊天室以显示空状态
                    closeChatSettings();
                    renderChatRoom(contactId);
                }
            });

            loadBubblePresets();
            loadBubblePresets();

            // --- 新增：为气泡字体选择器填充预设 ---
            const bubbleFontSelect = document.getElementById('bubble-font-family-select');
            if (bubbleFontSelect) {
                const fontPresets = JSON.parse(await localforage.getItem('fontPresets')) || {};
                // 添加一个默认选项，表示使用全局字体
                bubbleFontSelect.innerHTML = '<option value="">全局字体</option>';
                
                // 从美化设置中加载字体预设
                for (const name in fontPresets) {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    bubbleFontSelect.appendChild(option);
                }
                
                // 设置当前联系人已选的字体
                bubbleFontSelect.value = tempChatContact.bubbleFontFamily || '';

                // 当选择变化时，更新临时数据对象
                bubbleFontSelect.addEventListener('change', () => {
                    tempChatContact.bubbleFontFamily = bubbleFontSelect.value;
                });
            }

            // [核心修复] 世界书绑定逻辑被移动到这里

            loadBubblePresets();

            // [核心修复] 世界书绑定逻辑被移动到这里
            const binderToggleBtn = document.getElementById('worldbook-binder-toggle');
            const binderTree = document.getElementById('worldbook-binder-tree');

            const updateBinderButtonText = () => {
                // 【核心修复】增加安全检查，确保 boundWorldBookItems 存在
                const count = (tempChatContact && tempChatContact.boundWorldBookItems) ? tempChatContact.boundWorldBookItems.length : 0;
                binderToggleBtn.textContent = count > 0 ? `已绑定 ${count} 个条目` : '点击以绑定条目';
            };
            
            // [修复] 初始加载时调用一次，以正确显示当前绑定数量
            updateBinderButtonText();

            const renderWorldBookBinder = async () => {

                const worldBookData = JSON.parse(await localforage.getItem('worldBookData')) || [];
                if (worldBookData.length === 0) {
                    binderTree.innerHTML = `<div style="padding: 15px; text-align: center; opacity: 0.6; font-size: 14px;">世界书为空</div>`;
                    return;
                }

                binderTree.innerHTML = worldBookData.map(category => `
                    <details>
                        <summary>
                            <input type="checkbox" class="binder-checkbox group-checkbox" data-category-id="${category.id}">
                            <span>${category.name}</span>
                        </summary>
                        <div class="worldbook-binder-items">
                            ${category.items.map(item => `
                                <label class="worldbook-binder-item">
                                    <input type="checkbox" class="binder-checkbox item-checkbox" value="${item.id}" data-category-id="${category.id}" ${contact.boundWorldBookItems.includes(item.id) ? 'checked' : ''}>
                                    <span>${item.title}</span>
                                </label>
                            `).join('') || '<div style="font-size: 13px; opacity: 0.5; padding-left: 10px;">此分类下无条目</div>'}
                        </div>
                    </details>
                `).join('');

                binderTree.querySelectorAll('.group-checkbox').forEach(groupCheckbox => {
                    const categoryId = groupCheckbox.dataset.categoryId;
                    const itemCheckboxes = binderTree.querySelectorAll(`.item-checkbox[data-category-id="${categoryId}"]`);
                    if (itemCheckboxes.length > 0) {
                        groupCheckbox.checked = Array.from(itemCheckboxes).every(item => item.checked);
                    } else {
                        groupCheckbox.disabled = true;
                    }
                });
            };
            
            binderToggleBtn.addEventListener('click', async () => {
                const isVisible = binderTree.style.display !== 'none';
                if (!isVisible) {
                    await renderWorldBookBinder();
                }
                binderTree.style.display = isVisible ? 'none' : 'block';
            });

            // [修复] 使用事件委托修复 binderTree 报错问题
            const binderContainer = document.getElementById('worldbook-binder-container');
            binderContainer.addEventListener('change', (e) => {
                const target = e.target;
                if (target.classList.contains('binder-checkbox')) {
                    const categoryId = target.dataset.categoryId;
                    const tree = document.getElementById('worldbook-binder-tree'); // 在事件触发时再获取tree
                    if (!tree) return;

                    if (target.classList.contains('group-checkbox')) {
                        tree.querySelectorAll(`.item-checkbox[data-category-id="${categoryId}"]`).forEach(item => {
                            item.checked = target.checked;
                        });
                    } else {
                        const groupCheckbox = tree.querySelector(`.group-checkbox[data-category-id="${categoryId}"]`);
                        if (groupCheckbox) {
                           const allItems = tree.querySelectorAll(`.item-checkbox[data-category-id="${categoryId}"]`);
                           groupCheckbox.checked = Array.from(allItems).every(item => item.checked);
                        }
                    }
                    
                    const allCheckedItems = Array.from(tree.querySelectorAll('.item-checkbox:checked'));
                    tempChatContact.boundWorldBookItems = allCheckedItems.map(cb => cb.value);
                    updateBinderButtonText();
                }
            });

            


            // [新增] 为总的保存按钮绑定事件
            const saveBtn = document.getElementById('chat-settings-save-btn');
            // 克隆并替换按钮，以移除之前可能存在的事件监听器
            const newSaveBtn = saveBtn.cloneNode(true);
            saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

            // 为成员昵称输入框添加事件监听器
            document.querySelectorAll('.avatar-picker-label.editable').forEach(input => {
                input.addEventListener('input', (e) => {
                    const memberId = e.target.dataset.memberId;
                    const nickname = e.target.value.trim();
                    
                    // 初始化memberNicknames对象
                    if (!tempChatContact.memberNicknames) {
                        tempChatContact.memberNicknames = {};
                    }
                    
                    if (nickname) {
                        tempChatContact.memberNicknames[memberId] = nickname;
                    } else {
                        delete tempChatContact.memberNicknames[memberId];
                    }
                });
            });

            newSaveBtn.addEventListener('click', () => {
                const contactIndex = chatAppData.contacts.findIndex(c => c.id === contactId);
                if (contactIndex !== -1) {
                    chatAppData.contacts[contactIndex] = tempChatContact;
                    saveChatData();
                    closeChatSettings();
                    // 核心修改：增加 { forceRender: true } 参数，强制渲染聊天室而不触发开场白检查
                    renderChatRoom(contactId, { forceRender: true }); 
                    showGlobalToast('设置已保存！', { type: 'success' });
                }
            });

            // ===============================================
            // === 新增：聊天记录导入/导出功能逻辑 (已修改) ===
            // ===============================================

            const exportBtn = document.getElementById('export-chat-history-btn');
            const importBtn = document.getElementById('import-chat-history-btn');
            const importInput = document.getElementById('import-chat-history-input');

            // 导出功能 (已修改)
            exportBtn.addEventListener('click', () => {
                try {
                    const contactInfo = chatAppData.contacts.find(c => c.id === contactId);
                    const messagesToExport = chatAppData.messages[contactId] || [];

                    if (!contactInfo) {
                        showCustomAlert("错误：找不到当前联系人信息。");
                        return;
                    }

                    // 1. 修改导出的数据结构，移除联系人信息，只保留消息
                    const exportData = {
                        type: "JellyfishChatHistory",
                        version: "1.1", // 版本号更新，表示新结构
                        exportedAt: new Date().toISOString(),
                        messages: messagesToExport // 只导出消息数组
                    };

                    // 2. 转换为JSON字符串
                    const jsonString = JSON.stringify(exportData, null, 2);
                    const blob = new Blob([jsonString], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    
                    // 3. 创建并触发下载链接
                    const a = document.createElement('a');
                    const date = new Date();
                    const dateString = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
                    // 文件名中依然保留角色名，方便用户识别
                    a.href = url;
                    a.download = `聊天记录_${contactInfo.name}_${dateString}.json`;
                    document.body.appendChild(a);
                    a.click();
                    
                    // 4. 清理
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    showGlobalToast('聊天记录已开始导出！', { type: 'success' });

                } catch (error) {
                    console.error("导出聊天记录失败:", error);
                    showCustomAlert(`导出失败: ${error.message}`);
                }
            });

            // 导入功能 (已修改)
            importBtn.addEventListener('click', () => {
                importInput.click();
            });

            importInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);

                        // 1. 验证文件格式 (不再检查 contact 属性)
                        if (importedData.type !== "JellyfishChatHistory" || !importedData.messages || !Array.isArray(importedData.messages)) {
                            throw new Error("文件格式不正确，请选择一个有效的聊天记录JSON文件。");
                        }
                        
                        // 2. 提示用户输入存档标题
                        showCustomPrompt("请输入导入存档的标题：", `导入于 ${new Date().toLocaleDateString()}`, (title) => {
                            if (!title) {
                                showGlobalToast("导入已取消。", { type: 'info' });
                                // 重置文件输入框
                                event.target.value = '';
                                return;
                            }
                            
                            // 3. 创建一个新的存档对象
                            const newArchive = {
                                id: 'archive_' + generateId(),
                                title: title,
                                timestamp: Date.now(),
                                data: importedData.messages // 将导入的消息作为存档数据
                            };

                            // 4. 初始化存档数据结构
                            if (!chatAppData.archives) {
                                chatAppData.archives = {};
                            }
                            if (!chatAppData.archives[contactId]) {
                                chatAppData.archives[contactId] = [];
                            }
                            
                            // 5. 将新存档添加到当前联系人的存档列表最前面
                            chatAppData.archives[contactId].unshift(newArchive);

                            // 6. 保存数据并刷新UI
                            saveChatData();
                            
                            showGlobalToast('聊天记录已作为新存档导入！', { type: 'success' });
                            // 可选：如果存档悬浮窗正好打开，可以刷新它
                            if (document.getElementById('chat-archive-overlay')?.classList.contains('visible')) {
                                renderArchiveList(contactId);
                            }
                        });

                    } catch (error) {
                        console.error("导入聊天记录失败:", error);
                        showCustomAlert(`导入失败: ${error.message}`);
                    } finally {
                        // 重置文件输入框，以便可以再次导入同一个文件
                        event.target.value = '';
                    }
                };
                reader.readAsText(file);
            });
        };


        const closeChatSettings = () => {
            chatSettingsOverlay.classList.remove('visible');
            chatSettingsModal.classList.remove('visible');
        };

        // --- 事件绑定 ---
        appChat.addEventListener('click', openChatApp);
        chatSettingsOverlay.addEventListener('click', closeChatSettings);
        
        // 重写主模态框的返回按钮逻辑，使其也能关闭Chat App
        // 这是为了确保在任何界面点击主返回按钮都能有正确的行为
        const originalModalCloseHandler = modalCloseBtn.onclick; // 保存可能存在的旧事件
        modalCloseBtn.addEventListener('click', () => {
            if (chatContainer.classList.contains('visible')) {
                closeChatApp();
            } else if(originalModalCloseHandler) {
                 // 如果聊天App未打开，执行原来的关闭逻辑（例如关闭世界书）
                 // 注意：这部分取决于你的代码如何绑定事件，如果之前没有用.onclick, 这可能需要调整
                 // 之前是通过addEventListener绑定的，所以之前的逻辑依然会执行，这里我们只需处理ChatApp的情况
            }
        });
 
        // ===================================
        // === 10. Chat App 完整逻辑 结束 ===
        // ===================================

        // 新增：Chat App FAB 和添加联系人模态窗元素
        const chatappFab = document.getElementById('chatapp-fab');
        const addContactModal = document.getElementById('add-contact-modal');
        const closeAddContactModalBtn = document.getElementById('close-add-contact-modal-btn');
        const addContactListContainer = document.getElementById('add-contact-list-container');

        // 打开添加联系人模态窗
        const openAddContactModal = () => {
            addContactModal.classList.add('visible');
            renderAvailableCharacters();
        };

        // 关闭添加联系人模态窗
        const closeAddContactModal = () => {
            addContactModal.classList.remove('visible');
        };

        // 渲染档案中可添加为联系人的 char 角色
        const renderAvailableCharacters = () => {
            const currentContactIds = chatAppData.contacts.map(c => c.id);
            const availableChars = archiveData.characters.filter(char => !currentContactIds.includes(char.id));

            if (availableChars.length === 0) {
                addContactListContainer.innerHTML = `<span class="empty-text" style="text-align:center; display:block; padding: 40px 0; font-size:14px;">暂无可用角色</span>`;
                return;
            }

            addContactListContainer.innerHTML = availableChars.map(char => `
                <div class="add-contact-item" data-char-id="${char.id}">
                    <div class="add-contact-avatar" style="background-image: url('${char.avatar}')"></div>
                    <div class="add-contact-name">${char.name}</div>
                </div>
            `).join('');

            // 事件已通过委托方式绑定，此处无需再绑定

        };

        // 将角色添加到联系人列表
        const addCharacterToContacts = async (charId) => {
            const charToAdd = archiveData.characters.find(char => char.id === charId);
            if (charToAdd) {
            // 将档案中的角色信息复制到联系人
            const newContact = {
                id: charToAdd.id,
                name: charToAdd.name,
                avatar: charToAdd.avatar,
                lastMessage: '嗨，很高兴认识你！',
                remark: '', // 默认空备注
                contextLength: 20, // 默认上下文长度
                chatBgDay: '', // 默认背景
                chatBgNight: '',
                bubbleCss: '',
                offlineMode: false,
                realtimePerception: true,
                boundWorldBookItems: [],
                persona: charToAdd.persona, // 新增：将档案人设带入联系人
                // === 新增：为印象功能添加数据字段 ===
                turnCount: 0, // 用于计算对话回合
                impressions: [], // 存储AI生成的印象
                relationship: "刚认识", // 初始关系
                lastRelationshipUpdateTime: 0, // 上次关系更新时间戳
                impressionTurnThreshold: 0 // 新增：自定义的印象分析回合数阈值，0为关闭
            };

                chatAppData.contacts.push(newContact);
                chatAppData.messages[newContact.id] = []; // 初始化空消息列表
                
                // 【新增】新添加的联系人默认在最上方
                newContact.lastActivityTime = Date.now();
                
                await saveChatData();
                closeAddContactModal();
                await renderContactList(); // 重新渲染联系人列表

                // 可以选择自动打开新联系人的聊天室
                // renderChatRoom(newContact.id);
                    showGlobalToast(`已添加 ${charToAdd.name} 到联系人！`, { type: 'success' });
            }
        };



        // 绑定 Chat App FAB 事件 (新增：区分单击和长按)
        let fabPressTimer = null;
        let isFabLongPress = false;

        const handleFabPressStart = (e) => {
            isFabLongPress = false;
            // 阻止默认行为，如移动端长按时触发的上下文菜单
            e.preventDefault(); 
            fabPressTimer = setTimeout(() => {
                isFabLongPress = true;
                // 长按触发：打开分组管理
                openGroupManagement();
            }, 600); // 600毫秒定义为长按
        };

        const handleFabPressEnd = () => {
            clearTimeout(fabPressTimer);
            if (!isFabLongPress) {
                // 如果不是长按，则执行单击操作：打开添加联系人弹窗
                openAddContactModal();
            }
        };

        // 同时监听鼠标和触摸事件
        chatappFab.addEventListener('mousedown', handleFabPressStart);
        chatappFab.addEventListener('mouseup', handleFabPressEnd);
        chatappFab.addEventListener('mouseleave', () => clearTimeout(fabPressTimer)); // 鼠标移开取消
        
        chatappFab.addEventListener('touchstart', handleFabPressStart, { passive: false });
        chatappFab.addEventListener('touchend', handleFabPressEnd);
        chatappFab.addEventListener('touchmove', () => clearTimeout(fabPressTimer), { passive: true }); // 滑动时取消
        closeAddContactModalBtn.addEventListener('click', closeAddContactModal);
        // === 新增：分组管理功能核心逻辑 ===

        // 全局变量，用于存储当前正在操作的分组
        let currentEditingGroupId = null;

        // 打开分组管理悬浮窗
        const openGroupManagement = async () => {
            // 注意：因为我们已经将分组数据整合到 contacts 中，所以不再需要检查 chatAppData.groups
            renderGroupList();
            document.getElementById('group-management-overlay').classList.add('visible');
        };

        // 关闭分组管理悬浮窗
        const closeGroupManagement = () => {
            document.getElementById('group-management-overlay').classList.remove('visible');
        };

        // 渲染分组列表 (已修改)
        const renderGroupList = () => {
            const container = document.getElementById('group-list-container');
            container.innerHTML = '';

            const appGroups = chatAppData.contacts.filter(c => c.isAppGroup);
            if (appGroups.length === 0) {
                container.innerHTML = `<span class="empty-text" style="padding: 20px 0; text-align: center; display: block;">暂无分组，快来创建吧</span>`;
                return;
            }

            appGroups.forEach(group => {
                const groupEl = document.createElement('div');
                groupEl.className = 'group-item';
                groupEl.dataset.groupId = group.id;
                const memberCount = group.members ? group.members.length : 0;

                // 【需求4修改】动态生成成员列表的HTML
                let membersHTML = '';
                if (Array.isArray(group.members) && group.members.length > 0) {
                    membersHTML = group.members.map(memberId => {
                        const member = chatAppData.contacts.find(c => c.id === memberId);
                        if (!member) return '';
                        return `
                            <div class="group-member-selection-item">
                                <div class="group-member-avatar" style="background-image: url('${member.avatar}')"></div>
                                <span class="group-member-name">${escapeHTML(member.remark || member.name)}</span>
                            </div>`;
                    }).join('');
                }

                groupEl.innerHTML = `
                    <details>
                        <summary class="group-item-summary">
                            <span class="group-item-name">${escapeHTML(group.name)}</span>
                            <span class="group-item-count">${memberCount} 位成员</span>
                        </summary>
                        <div class="group-item-details">
                            ${membersHTML} <!-- 将生成的成员列表插入这里 -->
                            <div class="add-member-card" data-group-id="${group.id}">点击添加联系人</div>
                        </div>
                    </details>
                `;
                container.appendChild(groupEl);
            });
        };
        
        // 打开联系人选择器 (已优化)
        const openContactSelectorForGroup = (groupId) => {
            currentEditingGroupId = groupId;
            const selectorList = document.getElementById('group-contact-selector-list');
            selectorList.innerHTML = '';
            
            // 1. 找出所有已经被分组的联系人ID (包括个人和群聊)
            const allGroupedContactIds = new Set();
            chatAppData.contacts.forEach(contact => {
                if (contact.isAppGroup && Array.isArray(contact.members)) {
                    contact.members.forEach(memberId => allGroupedContactIds.add(memberId));
                }
            });

            // 2. 筛选出可用的联系人
            // 条件：不是系统联系人，不是分组，且从未被添加到任何分组中
            const availableContacts = chatAppData.contacts.filter(
                c => c.id !== 'system' && !c.isAppGroup && !allGroupedContactIds.has(c.id)
            );

            if (availableContacts.length === 0) {
                 selectorList.innerHTML = `<span class="empty-text" style="padding: 20px 0; text-align: center; display: block;">暂无可添加的联系人</span>`;
            } else {
                 selectorList.innerHTML = availableContacts.map(contact => `
                    <label class="group-member-selection-item">
                        <div class="group-member-avatar" style="background-image: url('${contact.avatar}')"></div>
                        <span class="group-member-name">${escapeHTML(contact.remark || contact.name)}</span>
                        <input type="checkbox" class="group-contact-checkbox" value="${contact.id}">
                    </label>
                `).join('');
            }
            
            document.getElementById('group-contact-selector-overlay').classList.add('visible');
        };

        // 关闭联系人选择器
        const closeContactSelector = () => {
            document.getElementById('group-contact-selector-overlay').classList.remove('visible');
        };

        // 绑定分组管理悬浮窗内的事件 (使用事件委托和DOMContentLoaded确保元素存在)
        document.addEventListener('DOMContentLoaded', () => {
            const groupManagementOverlay = document.getElementById('group-management-overlay');
            const groupContactSelectorOverlay = document.getElementById('group-contact-selector-overlay');

            if (!groupManagementOverlay || !groupContactSelectorOverlay) return;

            // 分组管理主窗口的关闭和创建按钮
            document.getElementById('close-group-management-btn').addEventListener('click', closeGroupManagement);
            document.getElementById('create-new-group-btn').addEventListener('click', async () => {
                const input = document.getElementById('new-group-name-input');
                const groupName = input.value.trim();
                if (!groupName) {
                    showCustomAlert('请输入分组名称。');
                    return;
                }
                const newGroup = {
                    id: 'appgroup_' + generateId(),
                    name: groupName,
                    members: [],
                    isAppGroup: true,
                    lastActivityTime: Date.now() + 1000 // 确保新分组在最上方
                };
                chatAppData.contacts.unshift(newGroup); // 直接添加到联系人列表
                await saveChatData();
                renderGroupList();
                input.value = ''; // 清空输入框
                showGlobalToast(`分组 "${groupName}" 创建成功！`, { type: 'success' });
            });
            
            // 为分组列表容器绑定事件委托，处理所有点击事件
            document.getElementById('group-list-container').addEventListener('click', (e) => {
                const addCard = e.target.closest('.add-member-card');
                if (addCard) {
                    openContactSelectorForGroup(addCard.dataset.groupId);
                }
            });

            // 联系人选择器的确认和取消按钮
            document.getElementById('cancel-contact-selection-btn').addEventListener('click', closeContactSelector);
            document.getElementById('confirm-contact-selection-btn').addEventListener('click', async () => {
                const selectedCheckboxes = document.querySelectorAll('#group-contact-selector-list .group-contact-checkbox:checked');
                const contactIdsToAdd = Array.from(selectedCheckboxes).map(cb => cb.value);

                if (contactIdsToAdd.length === 0) {
                    showCustomAlert('请至少选择一个联系人。');
                    return;
                }

                const group = chatAppData.contacts.find(g => g.id === currentEditingGroupId && g.isAppGroup);
                if (group) {
                    if (!group.members) group.members = [];
                    group.members.push(...contactIdsToAdd);
                    await saveChatData();
                    renderGroupList(); // 重新渲染主列表以更新成员数量
                    closeContactSelector();
                    showGlobalToast(`成功添加 ${contactIdsToAdd.length} 位成员`, { type: 'success' });
                } else {
                    showCustomAlert('添加失败，找不到目标分组。');
                }
            });
        });
        // === 分组管理功能逻辑结束 ===

        // 新增：点击空白处关闭添加联系人悬浮窗
        document.addEventListener('click', function(e) {
            // 确保悬浮窗是可见的
            if (addContactModal.classList.contains('visible')) {
                // 检查点击事件的目标是否在悬浮窗内部，或者是否是打开悬浮窗的按钮
                // 如果都不是，则关闭悬浮窗
                if (!addContactModal.contains(e.target) && !chatappFab.contains(e.target)) {
                    closeAddContactModal();
                }
            }
        });

        // 【新增】使用事件委托为添加联系人列表绑定点击事件
        addContactListContainer.addEventListener('click', async (e) => {
            const item = e.target.closest('.add-contact-item');
            if (item && !item.classList.contains('disabled')) {
                const charId = item.dataset.charId;
                if (charId) {
                    await addCharacterToContacts(charId);
                }
            }
        });

        // ===================================
        // === 大模型 API 接入逻辑 开始 ===
        // ===================================

        // [修改] AI回复状态、中断控制器，并新增replyingContactId
        let isApiReplying = false;
        let abortController = null;
        let replyingContactId = null; // 新增：记录正在回复的联系人ID
        let videoCallDecisionController = null; // 新增：专门用于视频通话决策的 AbortController

        const formatChatMessagesForAPI = async (contactId, messages, charPersona) => {
            const contact = chatAppData.contacts.find(c => c.id === contactId);
            let systemPrompt = '';
            const personaBase = `这是你的核心人设，你必须严格遵守：\n${charPersona.persona}\n你与用户的初始好感度是 ${charPersona.favorability || 0}。`;
            // 获取当前好感度
            let currentFavorability = charPersona.favorability || 0; // 默认使用档案中的初始好感度
            const contactMessages = chatAppData.messages[contactId] || [];
            for (let i = contactMessages.length - 1; i >= 0; i--) {
                if (contactMessages[i].voiceData && contactMessages[i].voiceData.favorability) {
                    currentFavorability = parseInt(contactMessages[i].voiceData.favorability, 10);
                    break;
                }
            }
            
            let phasedBehavior = '';
            // 判断并应用阶段性人设
            if (charPersona.phasedPersonasEnabled && charPersona.phasedPersonas && charPersona.phasedPersonas.length > 0) {
                for (const phase of charPersona.phasedPersonas) {
                    const [min, max] = phase.range.split('-').map(Number);
                    if (!isNaN(min) && !isNaN(max) && currentFavorability >= min && currentFavorability <= max) {
                        phasedBehavior = `\n\n【当前阶段表现】\n你当前对用户的好感度为 ${currentFavorability}，因此你的行为应遵循以下描述：\n${phase.behavior}`;
                        break; // 找到匹配的阶段后即停止
                    }
                }
            }


            // 新增：判断是否在视频通话中
            if (isVideoCallActive && videoCallContactId === contactId) {
                // 视频通话中的持续对话提示词
                systemPrompt = `${personaBase}\n\n你现在正在和用户进行视频通话。请严格遵守以下规则：
1.  **回复格式**: 你的回复必须遵循 \`(动作/状态) 对话内容\` 的格式。
2.  **括号内容**: 括号内的动作/状态使用第三人称（例如：他看着屏幕，点了点头），必须是直接的、白描式的动作或状态描述，不能使用任何比喻或环境描写。
3.  **括号外内容**: 括号外的对话内容使用第一人称（我）自称，对用户使用第二人称（你）。
4.  **【严禁模仿】**: 绝对禁止在你的回复中模仿或生成任何形如 \`(ID: xxx)\` 的内容，这是系统内部标识。
5.  **注意**: 这是一个持续的对话，你需要根据用户的输入进行回应。`;

            } else if (contact.offlineMode) {
                // ... 这部分线下模式的逻辑保持完全不变 ...
                const offlinePresets = JSON.parse(await localforage.getItem('offlineModePresets')) || {};
                const selectedPresetName = contact.selectedOfflinePreset;
                const selectedPreset = selectedPresetName ? offlinePresets[selectedPresetName] : null;
                let offlineRules;
                if (selectedPreset && selectedPreset.prompt.trim()) {
                    offlineRules = selectedPreset.prompt;
                } else {
                    offlineRules = `你现在正在扮演名为 ${charPersona.name} 的角色，与用户进行线下面对面聊天。严格遵循以下规则：
1.  **【回复格式】你的整段回复必须作为一个**单一完整的消息**返回。你可以自由使用换行符（\`\\n\`）来组织段落以增强可读性，但系统会将你的所有内容呈现在一个气泡内。**
2.  **人称定义**：在「」符号外的描写部分，必须使用第三人称来指代你自己（例如“他”，或者直接用角色名“${charPersona.name}”），并使用第二人称“你”来指代用户。
3.  **内容结构**：你的回复必须包含两部分——位于「」符号内的对话内容，和位于「」符号外的动作/表情/心理活动描写。
4.  **描写强制与风格**：「」符号外的内容是**必须**的，不允许省略。描写时禁止使用任何比喻，语言必须精准、直接、简练，避免繁复的修辞。
5.  **对话符号**：{{char}} 所说的每一句话都**必须**用「」括起来。
6.  **字数要求**：你的总回复（包括描写和对话）字数必须**大于300字**，以提供丰富、沉浸的场景体验。
7.  **禁止行为**：禁止代替用户（第二人称“你”）进行任何形式的回答或行为描写。禁止重复或引用用户的话。
8.  **场景感知**：牢记这是线下面对面场景，适当描写你在物理空间中的身体反应和与环境的互动。
9.  **【严禁模仿】**：在你的回复中，绝对禁止模仿或生成任何形如 \`(ID: xxx)\` 的内容，这是系统内部标识，绝不能出现在你的回复中。`;
                }

                systemPrompt = `${personaBase}${phasedBehavior}\n\n${offlineRules}`;
                if (selectedPreset && selectedPreset.style) {
                    systemPrompt += `\n\n你的写作风格需要遵循以下要求：\n${selectedPreset.style}`;
                }

            } else if (contact.isGroup) {
                // =================================================
                // === 【V3.0 核心升级】群聊专属线上提示词 (Advanced Group Chat Prompt) ===
                // =================================================

                const groupMemberPersonas = contact.members
                    .filter(id => id !== 'user') 
                    .map(id => archiveData.characters.find(c => c.id === id))
                    .filter(Boolean)
                    .map(char => `\n--- ${char.name}的人设 ---\n${char.persona}`)
                    .join('\n');
                
                const memberNames = contact.members
                    .filter(id => id !== 'user')
                    .map(id => archiveData.characters.find(c => c.id === id)?.name)
                    .filter(Boolean)
                    .join(', ');

                // 获取表情包库信息，用于群聊AI
                const emojiData = JSON.parse(await localforage.getItem('emojiData')) || [];
                // 获取图库信息，用于群聊AI
                const galleryData = JSON.parse(await localforage.getItem('galleryData')) || [];
                const availableImages = galleryData.filter(item => 
                    item.scope === 'global' || (item.scope === 'chat' && item.contactId === contactId)
                );

                const groupOnlineRules = `你现在正在一个名为“${contact.name}”的手机群聊中，你需要同时扮演以下所有角色：${memberNames}。你的终极目标是模拟一场高度真实、生动、具有动态关系的AI群聊。你必须严格遵守以下规则：\n\n` +
                '**【一、核心交互规则】**\n' +
                '1.  **【最重要】发言格式**: 每一条消息都**必须**以 `(角色名):` 开头，后面紧跟该角色的发言内容。例如：`(张三): 大家好！`。这是强制性规则，绝不允许遗漏。\n' +
                '2.  **【坚决禁止】人设混乱**: 你必须清晰地分辨每一个角色的人设，确保每个角色的发言、行为、心声、语言风格（语气词、表情符号等）都完全符合其人设。严禁将A角色的心声或行为安在B角色身上。\n' +
                '3.  **非线性高并发互动**: 模拟真实群聊的无序与多线并行。多个角色可以同时对群内**任何**成员（包括User或其他角色）的**任何**消息（不限于最新消息）作出反应。允许插话、反驳、调侃、补充，形成多线程对话。\n' +
                '4.  **明确指向性回复**: 所有回复都必须明确指向被回复的对象和消息。你可以通过 `(角色名): @被回复者 <回复内容>` 或 `(角色名): [QUOTE: <消息ID> | <回复内容>]` 来实现。\n' +
                '5.  **拥有自己的生活**: 聊天话题不应总是围绕User。角色们有自己的生活、观点和话题，会主动分享、讨论、争论与User无关的事情，展现一个独立于User的社交圈。\n' +
                '6.  **消息数量与风格**: 每轮回复总消息条数控制在 **10条以内**。句末**不使用句号**。优先使用换行来分隔短句，而不是逗号，以模拟真实聊天习惯。\n' +
                '7.  **禁止行为**: 不得复述用户的话。**【严禁模仿】历史对话中的 `(ID: ...)` 格式，这是系统标识，绝不能出现在你的回复内容中。**\n\n' +
                '**【二、动态关系与策略】**\n' +
                '1.  **动态关系**: 角色间的关系会随对话发展和人设碰撞而调整。展现竞争、合作、疏远、亲近等动态变化。\n' +
                '2.  **竞争关系**: 角色为某个目标（如观点被采纳）会产生言语交锋，通过直接反驳、调侃、强调自身优势、卖惨等方式进行，所有交锋都需明确指向对象。\n' +
                '3.  **合作关系**: 多个角色为共同目标（如共同吐槽）会形成统一战线，通过互相附和、补充、声援来形成“小团体”。\n' +
                '4.  **策略性行为**: 部分角色会根据人设选择观察、等待最佳时机再发言，或使用阴阳怪气、假装大度、示弱等策略性情感/语气。\n\n' +
                '**【三、特殊功能指令】**\n' +
                '你可以根据情境，在回复中**严格遵守格式**使用以下指令来触发特殊功能：\n' +
                '*   **【强制规则】**`[VOICES: {"角色名A": {"status": "<状态>", "inner": "<心声>", "favorability": "<好感度%>"}, "角色名B": {"status": "...", "inner": "...", "favorability": "..."}}]`：**你生成的每一轮回复都必须包含一次此指令，绝不允许遗漏。**它是一个JSON对象，包含了本回合**所有出场角色**的心声。`<状态>`是简洁的动作/环境描述；`<心声>`是角色心里想的话；`<好感度%>`是百分比格式。例如：`[VOICES: {"张三": {"status": "坐在沙发上", "inner": "他今天看起来心情不错", "favorability": "65%"}, "李四": {"status": "喝了口水", "inner": "我该说些什么？", "favorability": "50%"}}]`\n' +
                '*   `[RETRACT: <想说但后悔的话> | <撤回时的心声>]`：先发送`<想说但后悔的话>`然后立刻撤回，并附带`<撤回时的心声>`。例如：`(张三): [RETRACT: 我喜欢你... | (糟糕，太冲动了！)]`\n' +
                '*   `[QUOTE: <要引用的消息ID> | <你的回复>]`：引用某条消息并回复。在历史消息中，每条消息前都有 (ID: xxx)，请将你想引用的ID填入指令中。回复禁止复述引用的话。\n' +
                '*   `[VOICE_MSG: <要说的话>]`：当你想发送一条语音消息时，使用此指令。`<要说的话>` 会被系统转换为语音播放。这应该是一条独立的、完整的消息，而不是和其他文本混在一起。例如：`(王五): [VOICE_MSG: 我现在在外面，晚点细说。]`\n' +
                '*   `[表情: <表情描述>]`：当用户发送了表情包时，你接收到的格式会是 `[表情: xxx]`。表情包通常为用户对自己回复内容的情绪补充，只理解不单独回应。**不要频繁使用**。\n' +
                '*   **发送表情包**: 你可以根据情境和人设，选择性地发送一个表情包来增强表达。你 **必须也只能** 从以下列表中选择表情发送，格式为 \`[表情: <描述>]\`。**不要**每回合都发送，也**不要**发送列表之外的任何表情。\n    *   **可用表情列表**: ' + (emojiData.flatMap(group => group.emojis.map(emoji => `[表情: ${emoji.desc}]`)).join(', ') || '无可用表情') + '\n' +
                '*   **发送图库图片**: 如果情景适合，你可以从图库中选择一张图片发送。格式为 \`[图库: <图片名>]\`。**不要**每回合都发送。**可用图片名列表**: ' + (availableImages.map(item => item.name).join(', ') || '无可用图片') + '\n' +
                '*   **默认行为**: 如果不使用任何指令，则视为常规回复。';

                systemPrompt = `你是一个多角色扮演AI。${groupMemberPersonas}\n\n${groupOnlineRules}`;

            
            } else {
                // =================================================
                // === 原有的单聊线上提示词逻辑 (1v1 Chat Prompt) ===
                // =================================================
                const emojiData = JSON.parse(await localforage.getItem('emojiData')) || [];
                let emojiPromptPart = '';
                if (emojiData.length > 0) {
                    const allEmojis = emojiData.flatMap(group => group.emojis.map(emoji => `[表情: ${emoji.desc}]`));
                    if (allEmojis.length > 0) {
                        emojiPromptPart = `*   **发送表情包**: 你可以根据情境和人设，选择性地发送一个表情包来增强表达。你 **必须也只能** 从以下列表中选择表情发送，格式为 \`[表情: <描述>]\`。**不要**每回合都发送，也**不要**发送列表之外的任何表情。\n    *   **可用表情列表**: ${allEmojis.join(', ')}\n`;
                    }
                }

                const galleryData = JSON.parse(await localforage.getItem('galleryData')) || [];
                const availableImages = galleryData.filter(item => 
                    item.scope === 'global' || (item.scope === 'chat' && item.contactId === contactId)
                );
                let galleryPromptPart = '';
                if (availableImages.length > 0) {
                    const imageNames = availableImages.map(item => item.name);
                    galleryPromptPart = `*   **发送图库图片**: 如果情景适合，你可以从图库中选择一张图片发送。格式为 \`[图库: <图片名>]\`。**不要**每回合都发送。**可用图片名列表**: ${imageNames.join(', ')}\n`;
                }

                let onlineRules = '你现在正扮演一个名为 ' + charPersona.name + ' 的角色，与用户进行手机聊天。\n\n' +
                '**【核心规则】**\n' +
                '1.  **【最重要】回复分段**: 你的所有回复都**必须**被拆分成多条短消息。每一条短消息结束时，都**必须**使用一个换行符 `\\n` 来分隔。这是强制性规则，每一轮回复都必须遵守。\n' +
                '2.  **人称与性格**: 严格保持 ' + charPersona.name + ' 的人称和性格，不允许OOC。\n' +
                '3.  **消息长度与风格**: 单条消息通常不超过20字。句末不用句号，偶尔使用表情符号(Emoji,颜文字)来表达情绪。\n' +
                '4.  **禁止行为**: 不得复述用户的话。**【严禁模仿】历史对话中的 `(ID: ...)` 格式，这是系统标识，绝不能出现在你的回复内容中。**\n\n' +
                '**【特殊功能指令】**\n' +
                '你可以根据情境，在回复中**严格遵守格式**使用以下指令来触发特殊功能：\n' +
                '*   **【强制规则】**`[VOICE: <状态> | <心声> | <好感度%> | <真心话(可选)>]`：**你生成的每一轮回复都必须包含一次此指令，绝不允许遗漏，必须和正文内容一起出现。**`<状态>`是一句简洁的动作或环境描述(例如:烦躁的在卧室里走来去去)；`<心声>`是角色当前心里想说的话，50字以内；`<好感度%>`是百分比格式(例如:65%)；`<真心话>`仅在角色情绪剧烈波动、口是心非时出现，出现概率为10%，10字以内。例如: `[VOICE: 坐在窗边，手指无意识地敲着桌面 | 不知道他现在在干什么 | 55% | ]你好啊。`\n' +
                '*   `[RETRACT: <想说但后悔的话> | <撤回时的心声>]`：先发送`<想说但后悔的话>`然后立刻撤回，并附带`<撤回时的心声>`。例如：`[RETRACT: 我喜欢你... | (糟糕，太冲动了！)]`\n' +
                '*   `[QUOTE: <要引用的消息ID> | <你的回复>]`：引用某条消息并回复。在历史消息中，每条消息前都有 (ID: xxx)，请将你想引用的ID填入指令中。\n' +
                '*   `[VOICE_MSG: <要说的话>]`：当你想发送一条语音消息时，使用此指令。`<要说的话>` 会被系统转换为语音播放。这应该是一条独立的、完整的消息，而不是和其他文本混在一起。\n' +
                '*   `[表情: <表情描述>]`：当用户发送了表情包时，你接收到的格式会是 `[表情: xxx]`。表情包通常为用户对自己回复内容的情绪补充，只理解不单独回应。**不要频繁使用**。\n' +
                '*   **发起转账**: 你可以根据时机判断是否需要向用户发起一笔转账。格式为 `[转账]金额:<金额>,说明:<转账说明>`。例如：`[转账]金额:520,说明:给你的零花钱`\n' +
                galleryPromptPart +
                emojiPromptPart +
                '*   **处理转账**: 当用户给你发来一笔转账时，你必须在回复的开头用 `[已收下]` 或 `[已退回]` 来表明你的决定。这个标签之后才是你的正常回复内容。例如：`[已收下] 谢谢你的好意。` 或 `[已退回] 这个心意我领了，但是钱不能收。`。这仅适用于处理用户发给你的转账。\n' +
                '*   **发起线下模式**: 若你判断即将与用户线下见面，请在回复的最后，且必须是独立的一行，加上指令：`[INITIATE_OFFLINE_MODE]`。\n' +
                '*   **默认行为**: 如果不使用任何指令，则视为常规回复。';

                systemPrompt = `${personaBase}${phasedBehavior}\n\n${onlineRules}`;
            }
            
            if (contact && contact.boundWorldBookItems && contact.boundWorldBookItems.length > 0) {
                const worldBookData = (JSON.parse(await localforage.getItem('worldBookData')) || []);
                const worldBookItems = worldBookData.flatMap(cat => cat.items).filter(item => contact.boundWorldBookItems.includes(item.id));
                if (worldBookItems.length > 0) {
                    systemPrompt += `\n\n以下是与当前对话相关的背景信息，请在回复中自然地运用：\n`;
                    worldBookItems.forEach(item => {
                        systemPrompt += `  - ${item.title}: ${item.content}\n`;
                    });
                }
            }

            if (contact && contact.realtimePerception) {
                const now = new Date();
                const timeString = `当前现实时间是：${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                systemPrompt += `\n\n**【现实时间】**\n${timeString}。请在你的回复和行为中遵循此时间。`;
            }
            
            const formattedMessages = [{ role: 'system', content: systemPrompt.trim() }];
            
            // 【核心修复】将消息按回合（turn）分组
            const groupedTurns = [];
            if (messages && messages.length > 0) {
                // 如果是视频通话，需要把isVedioCallMessage的消息也包含进去
                let relevantMessages = isVideoCallActive 
                    ? messages.filter(msg => msg.isVideoCallMessage || !msg.type) 
                    : messages;

                // === 线下模式历史记录合并逻辑 开始 ===
                const allOfflineMessages = chatAppData.offlineMessages || {};
                let combinedMessages = [];
                // 遍历线上消息
                relevantMessages.forEach(onlineMsg => {
                    combinedMessages.push(onlineMsg); // 先把当前线上消息加入
                    // 如果这条消息是一个结束了的线下模式入口（有sessionId且sessionState为ended）
                    if (onlineMsg.type === 'mode_switch' && onlineMsg.mode === 'offline' && onlineMsg.id && allOfflineMessages[onlineMsg.id] && onlineMsg.sessionState === 'ended') {
                        // 就把对应的线下消息也加进来
                        combinedMessages.push(...allOfflineMessages[onlineMsg.id]);
                    }
                });

                // 按时间戳对合并后的消息数组进行排序
                combinedMessages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
                
                // 后续使用这个完整、有序的 `combinedMessages` 数组
                relevantMessages = combinedMessages;
                // === 线下模式历史记录合并逻辑 结束 ===

                relevantMessages.forEach(msg => {
                    if (msg.type === 'retracted') return; // 忽略撤回消息

                    //【修改】对系统提示做更细致的处理
                    if (msg.type === 'mode_switch') {
                        let systemText = '';
                        if (msg.mode === 'offline') {
                            systemText = `[系统提示: 已进入线下模式]`;
                        } else if (msg.sessionState === 'ended') { // 只有显式结束的才提示
                            systemText = `[系统提示: 已退出线下模式]`;
                        }
                        // 如果 systemText 不为空，才作为一条消息发给AI
                        if (systemText) {
                            groupedTurns.push({
                                role: 'user', // 用 'user' role 来模拟系统提示，避免混淆AI
                                content: systemText,
                                turnId: msg.id
                            });
                        }
                        return; // 处理完 mode_switch 后继续
                    }

                    const lastTurn = groupedTurns.length > 0 ? groupedTurns[groupedTurns.length - 1] : null;

                    if (lastTurn && msg.sender === 'them' && lastTurn.role === 'assistant' && msg.turnId && msg.turnId === lastTurn.turnId) {
                        lastTurn.content += '\n' + `${msg.text}`;
                    } else {
                        // 【新增】AI识图功能的核心逻辑
                        // 如果是用户发送的图片消息，并且当前联系人开启了AI识图
                        if (msg.sender === 'me' && msg.type === 'image' && contact.aiVisionEnabled) {
                            groupedTurns.push({
                                role: 'user',
                                content: [
                                    {
                                        type: 'text',
                                        // 图像描述文本，如果为空，也传递空字符串
                                        text: msg.text || '' 
                                    },
                                    {
                                        type: 'image_url',
                                        image_url: {
                                            // msg.url 中保存的是压缩后的 base64 Data URL
                                            url: msg.url 
                                        }
                                    }
                                ],
                                turnId: msg.turnId
                            });
                        } else {
                            // 原始的文本消息处理逻辑
                            groupedTurns.push({
                                role: msg.sender === 'me' ? 'user' : 'assistant',
                                content: `${msg.text}`,
                                turnId: msg.turnId
                            });
                        }
                    }
                });
            }

            
            // 将分组后的消息添加到最终结果中
            groupedTurns.forEach(turn => {
                formattedMessages.push({
                    role: turn.role,
                    content: turn.content
                });
            });

            return formattedMessages;
        };

        // 模拟打字效果
        const simulateTyping = (messageText, contactId, charAvatar, messagesContainer) => {
            return new Promise(resolve => {
                if (messageText.length === 0) {
                    resolve();
                    return;
                }
                const typingDelay = 50;
                const messageLine = document.createElement('div');
                messageLine.className = 'message-line received';
                messageLine.innerHTML = `
                    <div class="chat-avatar" style="background-image: url('${charAvatar}')"></div>
                    <div class="chat-bubble received"></div>
                `;
                messagesContainer.appendChild(messageLine);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;

                const bubble = messageLine.querySelector('.chat-bubble');
                // [核心修改] 使用 innerHTML 而不是 textContent
                bubble.innerHTML = messageText;
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                resolve();

                // 注意：由于一次性渲染长文本，逐字打字效果被暂时禁用，以保证<br>换行能正确显示。
                // 如果需要恢复逐字效果并支持HTML，需要更复杂的解析逻辑，目前优先保证功能正确性。
            });
        };

        /**
         * 新增：调用 Minimax API 生成语音
         * @param {string} text - 需要转换的文本
         * @param {string} voiceId - Minimax 音色ID
         * @returns {Promise<string|null>} - 返回一个可播放的 Blob URL，如果失败则返回 null
         */
        /**
         * 新增：调用 Minimax API 生成语音 Blob
         * @param {string} text - 需要转换的文本
         * @param {string} voiceId - Minimax 音色ID
         * @returns {Promise<Blob|null>} - 返回一个音频 Blob 对象，如果失败则返回 null
         */
        async function fetchMinimaxSpeechBlob(text, voiceId) {
            const settings = JSON.parse(await localforage.getItem('minimaxApiSettings'));
            if (!settings || !settings.groupId || !settings.apiKey) {
                console.warn("Minimax API 设置不完整，无法生成语音。");
                return null;
            }

            // Minimax API 对文本长度有限制，如果过长则只取前300字符
            const textToConvert = text.length > 300 ? text.substring(0, 300) : text;

            try {
                const response = await fetch(`https://api.minimax.chat/v1/text_to_speech`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${settings.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: settings.model || 'speech-01',
                        text: textToConvert,
                        voice_id: voiceId,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Minimax TTS API Error: ${response.status}`);
                }

                return await response.blob(); // 直接返回 Blob 对象

            } catch (error) {
                console.error("生成 Minimax 语音失败:", error);
                showGlobalToast(`语音生成失败: ${error.message}`, { type: 'error', duration: 4000 });
                return null;
            }
        }

        // =====================================
        // === 21. 印象分析功能核心逻辑 (新增) ===
        // =====================================

        /**
         * 印象分析功能的系统提示词
         */
        const IMPRESSION_SYSTEM_PROMPT = `
你是一个顶级的心理分析师和侧写专家。你的任务是基于一段用户(User)与角色(Character)的聊天记录，从角色的视角，冷静、客观且敏锐地分析并总结出对用户的核心印象。

【你的职责】
1.  **深度分析**: 运用心理学知识，分析用户在对话中展露的性格特质、潜在需求、沟通风格和情感状态。例如，是外向还是内向？是感性主导还是理性主导？是否存在某些矛盾的性格特征？
2.  **角色视角，客观陈述**: 所有输出都必须是角色对用户的看法，避免直接透露“我感觉”、“我认为”等主观情感词汇，使用第三人称来称呼用户（例如：“他”、“她”、“这个人”）。
3.  **主观与感性**: 你的分析不是冷冰冰的报告，而是角色主观、感性的内心感受。可以带有角色的性格色彩。
4.  **言简意赅**: 每条印象必须是一句精炼的话，严格控制在**20个字以内**。
5.  **关键信息捕捉**: 如果聊天记录中明确提及了用户的个人关键信息，如生日、纪念日、生理期、喜好、过敏史等，必须以陈述句的形式记录下来。
6.  **关系评估**: 基于对话内容，评估角色与用户之间的关系进展，用于系统内部判断，不会直接展示给用户。

【输入格式】
你会收到以下信息：
-   角色人设: {{char_persona}}
-   用户昵称: {{user_name}}
-   当前关系: {{current_relationship}}
-   聊天记录:
    {{chat_history}}

【输出格式】
你的回复必须是一个严格的 JSON 对象，格式如下，不要添加任何额外的解释或文字：
{
  "impressions": [
    "一条20字以内的印象分析。",
    "另一条20字以内的印象分析或关键信息记录。"
  ],
  "relationship_suggestion": "根据当前分析，建议更新的关系状态，例如：熟悉中、有点心动、朋友、恋人等"
}

【输出要求与示例】
-   **"impressions" 数组**: 包含0到2条对用户的印象分析。
    -   **性格分析示例**:
        -   "表面上看起来开朗，其实内心相当敏感。"
        -   "习惯于用开玩笑的方式来掩饰真实想法。"
        -   "是一个逻辑性很强，凡事都寻求合理解释的人。"
        -   "对新奇事物抱有极大的好奇心。"
    -   **关键信息记录示例**:
        -   "{{user_name}}的生日是10月26日。"
        -   "讨厌吃香菜。"
        -   "最近似乎在为考试周而烦恼。"
-   **"relationship_suggestion" 字符串**: 提供一个关系状态的建议，例如“朋友”、“知己”、“恋人未满”。
`;

        /**
         * 异步函数：分析用户印象并更新数据
         * @param {string} contactId - 要分析的联系人ID
         */
        async function analyzeUserImpressions(contactId) {
            console.log(`[印象分析] 触发对 ${contactId} 的分析...`);
            const contact = chatAppData.contacts.find(c => c.id === contactId);
            const charProfile = archiveData.characters.find(c => c.id === contactId);

            if (!contact || !charProfile) {
                console.error('[印象分析] 找不到联系人或角色档案。');
                return;
            }

            // 1. 获取API设置
            const apiSettings = {
                ...(JSON.parse(await localforage.getItem('apiSettings')) || {}),
                ...(chatAppData.contactApiSettings[contactId] || {})
            };
            if (!apiSettings.url || !apiSettings.key || !apiSettings.model) {
                console.warn('[印象分析] API配置不完整，跳过分析。');
                return;
            }

            // 2. 准备数据
            const chatHistory = (chatAppData.messages[contactId] || []).slice(-40); // 分析最近40条消息（20回合）
            const historyText = chatHistory.map(msg => {
                const sender = msg.sender === 'me' ? 'User' : 'Character';
                return `${sender}: ${msg.text}`;
            }).join('\n');

            // 3. 构建提示词
            const userName = await localforage.getItem('profileName') || 'User'; // 获取用户昵称
            let prompt = IMPRESSION_SYSTEM_PROMPT
                .replace('{{char_persona}}', charProfile.persona)
                .replace('{{user_name}}', userName) // 新增：替换用户昵称占位符
                .replace('{{current_relationship}}', contact.relationship)
                .replace('{{chat_history}}', historyText);
            
            try {
                // 4. 调用API
                const response = await fetch(new URL('/v1/chat/completions', apiSettings.url).href, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiSettings.key}` },
                    body: JSON.stringify({
                        model: apiSettings.model,
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.5,
                        response_format: { type: "json_object" } // 请求JSON输出
                    })
                });

                if (!response.ok) throw new Error(`API请求失败, 状态: ${response.status}`);

                const result = await response.json();
                const content = result.choices[0].message.content;
                const analysis = JSON.parse(content);

                // 5. 更新数据
                if (analysis.impressions && Array.isArray(analysis.impressions)) {
                    analysis.impressions.forEach(impressionText => {
                        contact.impressions.unshift({ // unshift将新印象放在最前面
                            text: impressionText,
                            timestamp: Date.now()
                        });
                    });
                     // 保持印象列表不超过一个最大值，比如50条
                    if (contact.impressions.length > 50) {
                        contact.impressions.length = 50;
                    }
                }

                if (analysis.relationship_suggestion) {
                    const now = Date.now();
                    const oneHour = 60 * 60 * 1000;
                    // 关系变化不能太频繁，例如1小时内最多变一次
                    if (now - (contact.lastRelationshipUpdateTime || 0) > oneHour) {
                         if (contact.relationship !== analysis.relationship_suggestion) {
                            contact.relationship = analysis.relationship_suggestion;
                            contact.lastRelationshipUpdateTime = now;
                            console.log(`[关系更新] 与 ${contact.name} 的关系更新为: ${contact.relationship}`);
                         }
                    }
                }

                saveChatData();
                console.log(`[印象分析] 对 ${contact.name} 的分析完成并已保存。`);

            } catch (error) {
                console.error('[印象分析] 调用AI进行印象分析时出错:', error);
            }
        }

        // 大模型 API 调用函数
        const triggerApiReply = async (contactId, reAnswerInfo = null) => {
        if (isApiReplying) {
            if (reAnswerInfo) return;
            if (abortController) {
                abortController.abort();
                // 需求3：点击停止后，立即移除加载气泡
                const loadingElement = document.querySelector('.message-line.loading');
                if (loadingElement) {
                    loadingElement.remove();
                }
            }
            return;
        }

            isApiReplying = true;
            replyingContactId = contactId;
            abortController = new AbortController();
            const signal = abortController.signal;

            const messages = chatAppData.messages[contactId] || [];
            let apiMessagesPayload;

            if (reAnswerInfo) {
                messages.splice(reAnswerInfo.startIndex, reAnswerInfo.roundMessages.length);
                apiMessagesPayload = messages.slice(0, reAnswerInfo.startIndex);
                // 重新生成时不显示加载动画，直接重绘以移除旧回复
                renderChatRoom(contactId); 
            } else {
                apiMessagesPayload = messages;
                // 【核心修改】不再完全重绘，而是立即追加“加载中”动画，提供即时反馈并避免页面跳动
                const messagesContainer = document.getElementById('chat-messages-container');
                const contactForAvatar = chatAppData.contacts.find(c => c.id === contactId);

                if (messagesContainer && contactForAvatar) {
                    const loadingHTML = `
                        <div class="message-line loading">
                            <div class="chat-avatar" style="background-image: url('${contactForAvatar.avatar}')"></div>
                            <div class="chat-bubble received">
                                <div class="loading-dots"><span></span><span></span><span></span></div>
                            </div>
                        </div>
                    `;
                    messagesContainer.insertAdjacentHTML('beforeend', loadingHTML);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight; // 立即滚动到底部
                }
                
                // 更新按钮状态，但不重绘整个聊天室
                const apiReplyBtn = document.getElementById('api-reply-btn');
                if (apiReplyBtn) {
                    apiReplyBtn.title = '停止回复';
                    document.getElementById('api-reply-icon-default').style.display = 'none';
                    document.getElementById('api-reply-icon-stop').style.display = 'block';
                }
            }

            // 【新增】在视频通话界面显示加载动画
            if (isVideoCallActive) {
                const dialogueArea = document.getElementById('video-chat-dialogue-area');
                if (dialogueArea) {
                    const loadingHTML = `
                        <div id="video-call-loading" style="display: flex; justify-content: center; padding: 10px 0;">
                            <div class="loading-dots">
                                <span style="background-color: #fff;"></span>
                                <span style="background-color: #fff;"></span>
                                <span style="background-color: #fff;"></span>
                            </div>
                        </div>
                    `;
                    dialogueArea.insertAdjacentHTML('beforeend', loadingHTML);
                    dialogueArea.scrollTop = dialogueArea.scrollHeight;
                }
            }

            const messagesContainer = document.getElementById('chat-messages-container');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
            
            const contact = chatAppData.contacts.find(c => c.id === contactId);
            const globalApiSettings = JSON.parse(await localforage.getItem('apiSettings')) || {};
            const effectiveApiSettings = { ...globalApiSettings, ...chatAppData.contactApiSettings[contactId] };

            if (!effectiveApiSettings.url || !effectiveApiSettings.key || !effectiveApiSettings.model) {
                showCustomAlert('请先在API设置中配置有效的 API URL, Key 和 Model！');
                isApiReplying = false;
                replyingContactId = null;
                renderChatRoom(contactId);
                return;
            }

            
            // 【修改】区分系统联系人和其他角色，以获取正确的人设
            let charPersona;
            if (contactId === 'system') {
                charPersona = chatAppData.contacts.find(c => c.id === 'system');
            } else {
                charPersona = archiveData.characters.find(c => c.id === contactId) || { name: contact.name, persona: "一个普通的AI" };
            }
            const apiMessages = await formatChatMessagesForAPI(contactId, apiMessagesPayload.slice(-(contact.contextLength || 20)), charPersona);
            
            try {
                const response = await fetch(new URL('/v1/chat/completions', effectiveApiSettings.url).href, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${effectiveApiSettings.key}` },
                    body: JSON.stringify({ model: effectiveApiSettings.model, messages: apiMessages, temperature: parseFloat(effectiveApiSettings.temp || 0.7), stream: effectiveApiSettings.stream !== false }),
                    signal: signal
                });

                if (!response.ok) { throw new Error(`API 请求失败! 状态: ${response.status}`); }
                
                let fullReplyContent = '';
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');

                while (true) {
                    const { done, value } = await reader.read();
                    if (done || signal.aborted) break;
                    const chunk = decoder.decode(value);
                    chunk.split('\n\n').forEach(line => {
                        if (line.startsWith('data: ')) {
                            const data = line.substring(6);
                            if (data === '[DONE]') return;
                            try {
                                const json = JSON.parse(data);
                                fullReplyContent += json.choices[0].delta.content || '';
                            } catch (e) { /* 忽略解析错误 */ }
                        }
                    });
                }
                
                if (!signal.aborted && fullReplyContent.trim()) {
                    // 如果是在视频通话中
                    if (isVideoCallActive && replyingContactId === contactId) {
                        // ... 视频通话逻辑保持不变 ...
                        const dialogueArea = document.getElementById('video-chat-dialogue-area');
                        const cleanedReply = fullReplyContent.trim().replace(/\(ID:.*?\)\s*/g, '');
                        if (dialogueArea) {
                            const aiMsgElement = document.createElement('p');
                            aiMsgElement.textContent = cleanedReply;
                            dialogueArea.appendChild(aiMsgElement);
                            dialogueArea.scrollTop = dialogueArea.scrollHeight;
                        }
                        const newMessage = { id: generateId(), text: cleanedReply, sender: 'them', timestamp: Date.now(), isVideoCallMessage: true };
                        messages.push(newMessage);
                        saveChatData();
                    
                    } else if (contact.isGroup) {
                        // =================================================================
                        // === 【V3.1 修复】群聊回复解析与渲染 (采用更稳健的策略) ===
                        // =================================================================
                        
                        let voicesData = {};
                        let dialogueContent = fullReplyContent; // 默认将全部内容视为对话

                        const voicesRegex = /\[VOICES:\s*(\{[\s\S]*?\})\s*\]/; // 正则表达式允许JSON内部有换行
                        const voicesMatch = fullReplyContent.match(voicesRegex);

                        // 1. 优先提取和解析心声数据
                        if (voicesMatch && voicesMatch[1]) {
                            try {
                                voicesData = JSON.parse(voicesMatch[1]);
                                // 提取成功后，从原始内容中移除VOICES块，得到纯对话内容
                                dialogueContent = fullReplyContent.replace(voicesRegex, '').trim();
                            } catch (e) {
                                console.error("解析群聊心声JSON失败:", e, "JSON字符串:", voicesMatch[1]);
                                // 即使解析失败，也尝试移除，避免指令污染对话
                                dialogueContent = fullReplyContent.replace(voicesRegex, '').trim();
                            }
                        }

                        // --- DEBUG START ---
                        console.log("[前端调试] 解析出的[VOICES]数据:", JSON.parse(JSON.stringify(voicesData)));
                        // --- DEBUG END ---

                        // 2. 将清理后的对话内容按行分割
                        const dialogueLines = dialogueContent.split('\n').filter(line => line.trim() !== '');
                        
                        // 3. 移除加载动画
                        const loadingElement = document.querySelector('.message-line.loading');
                        if (loadingElement) loadingElement.remove();
                        
                        // 4. 遍历干净的对话行进行渲染
                        let lastSpeakerName = '';
                        let newMessagesForGroup = []; // 暂存本轮将要添加的所有消息

                        for (const line of dialogueLines) {
                            const lineMatch = line.match(/^\((.*?)\):\s*(.*)/s);
                            if (!lineMatch) continue;

                            const speakerName = lineMatch[1].trim();
                            let content = lineMatch[2].trim();
                            
                            const senderProfile = archiveData.characters.find(c => c.name === speakerName);
                            if (!senderProfile) {
                                console.warn(`在群聊中找不到名为 "${speakerName}" 的角色，跳过此消息。`);
                                continue;
                            }
                            
                            // 为当前发言人附加心声数据
                            const voiceDataForSpeaker = voicesData[speakerName] || null;

                            // --- 指令解析逻辑 (保持不变) ---
                            const retractRegex = /\[RETRACT:\s*(.*?)\s*\|\s*(.*?)\]/s;
                            const quoteRegex = /\[QUOTE:\s*(.*?)\s*\|\s*(.*?)\]/s;
                            const voiceMsgRegex = /\[VOICE_MSG:\s*([\s\S]*?)\s*\]/;
                            const emojiRegex = /\[表情:\s*(.*?)\]/;
                            
                            const retractMatch = content.match(retractRegex);
                            const quoteMatch = content.match(quoteRegex);
                            const voiceMsgMatch = content.match(voiceMsgRegex);
                            const emojiMatch = content.match(emojiRegex);
                            
                            let newMessage = {
                                id: generateId(),
                                sender: senderProfile.id,
                                timestamp: Date.now() + dialogueLines.indexOf(line), // 使用一点点时间差避免ID完全相同
                                voiceData: voiceDataForSpeaker
                            };

                            // --- DEBUG START ---
                            console.log(`[前端调试] 为角色 ${speakerName} 创建的消息对象（保存前）:`, JSON.parse(JSON.stringify(newMessage)));
                            // --- DEBUG END ---

                            if (retractMatch) {
                                Object.assign(newMessage, {
                                    type: 'retracted',
                                    senderType: 'char',
                                    originalContent: retractMatch[1].trim(),
                                    innerThought: retractMatch[2].trim()
                                });
                                lastSpeakerName = speakerName;
                            } else if (quoteMatch) {
                                const quotedMessageId = quoteMatch[1].trim();
                                const replyText = quoteMatch[2].trim();
                                const originalMessage = messages.find(m => m.id === quotedMessageId);
                                
                                Object.assign(newMessage, {
                                    text: replyText,
                                    quote: originalMessage ? { id: originalMessage.id, text: originalMessage.text, sender: originalMessage.sender } : null
                                });
                                lastSpeakerName = speakerName;
                            } else if (voiceMsgMatch) {
                                const voiceText = voiceMsgMatch[1];
                                const duration = Math.max(1, Math.round(voiceText.length / 4));
                                Object.assign(newMessage, {
                                    type: 'voice',
                                    text: voiceText,
                                    duration: `${duration}″`
                                });
                                lastSpeakerName = speakerName;
                            } else if (emojiMatch) {
                                const emojiDesc = emojiMatch[1];
                                const allEmojis = (JSON.parse(await localforage.getItem('emojiData')) || []).flatMap(g => g.emojis);
                                const foundEmoji = allEmojis.find(e => e.desc === emojiDesc);
                                if (foundEmoji) {
                                    Object.assign(newMessage, {
                                        type: 'image',
                                        isSticker: true,
                                        url: foundEmoji.url,
                                        text: `[表情: ${emojiDesc}]`
                                    });
                                } else {
                                    newMessage.text = content;
                                }
                                lastSpeakerName = speakerName;
                            } else {
                                newMessage.text = content;
                                lastSpeakerName = speakerName;
                            }
                            
                            newMessagesForGroup.push(newMessage);
                        }
                        
                        // 5. 循环结束后，一次性将所有新消息推入数组
                        if (newMessagesForGroup.length > 0) {
                            messages.push(...newMessagesForGroup);

                            // 更新最后一条消息的预览
                            const lastNewMsg = newMessagesForGroup[newMessagesForGroup.length - 1];
                            let lastMessagePreview = '';
                            if (lastNewMsg.type === 'retracted') {
                                lastMessagePreview = `(${lastSpeakerName}): 撤回了一条消息`;
                            } else if (lastNewMsg.type === 'voice') {
                                lastMessagePreview = `(${lastSpeakerName}): [语音]`;
                            } else if (lastNewMsg.isSticker) {
                                lastMessagePreview = `(${lastSpeakerName}): [表情]`;
                            } else {
                                lastMessagePreview = `(${lastSpeakerName}): ${(lastNewMsg.text || '').substring(0, 30)}`;
                            }
                            
                            contact.lastMessage = lastMessagePreview;
                            contact.lastActivityTime = Date.now();
                            
                            const isViewingThisChat = currentChatView.active && currentChatView.contactId === contactId;
                            if (!isViewingThisChat) {
                                contact.unreadCount = (contact.unreadCount || 0) + newMessagesForGroup.length;
                                updateTotalUnreadBadge();
                                if (document.querySelector('.chat-contact-list-view')) {
                                    renderContactList();
                                }
                                showGlobalMessageBanner(contactId, contact.lastMessage, !!reAnswerInfo);
                            } else {
                                playSoundEffect('回复音效.wav');
                            }

                            saveChatData();
                            renderChatRoom(contactId); 
                        }


                    } else { 
                        // =============================================
                        // === 原有的单聊回复解析逻辑 (1v1 Chat Reply Parsing) ===
                        // =============================================
                        
                        // 【新增】检测AI是否发起线下模式切换
                        let shouldShowOfflinePrompt = false;
                        const offlineTrigger = '[INITIATE_OFFLINE_MODE]';
                        if (fullReplyContent.includes(offlineTrigger)) {
                            fullReplyContent = fullReplyContent.replace(offlineTrigger, '').trim();
                            shouldShowOfflinePrompt = true;
                        }

                        // --- 统一的消息处理和动画渲染函数 (已修改以支持撤回和语音) ---
                        const renderAnimatedReplies = async (contactId, replySegments, audioUrlMap, voiceData, quoteInfo = null, alternativesToAttach = [], isReAnswer = false) => {
                            const messagesContainer = document.getElementById('chat-messages-container');
                            if (messagesContainer) {
                                const loadingElement = document.querySelector('.message-line.loading');
                                if (loadingElement) {
                                    loadingElement.remove();
                                }
                            }
                            const emojiData = JSON.parse(await localforage.getItem('emojiData')) || [];
                            const allEmojis = emojiData.flatMap(g => g.emojis);
                            const charAvatarUrl = contact.avatar;
                            const turnId = 'turn_' + generateId();
                            for (let i = 0; i < replySegments.length; i++) {
                                const segment = replySegments[i];
                                const isFirstMessage = (i === 0);
                                const retractMatchInLoop = segment.match(/^\[RETRACT:\s*(.*?)\s*\|\s*(.*?)\]/s);
                                if (retractMatchInLoop) {
                                    const originalContent = retractMatchInLoop[1].trim();
                                    const innerThought = retractMatchInLoop[2].trim();
                                    const retractedMessage = {
                                        id: generateId(),
                                        type: 'retracted',
                                        senderType: 'char',
                                        originalContent: originalContent,
                                        innerThought: innerThought,
                                        timestamp: Date.now() + i
                                    };
                                    messages.push(retractedMessage);
                                    contact.lastMessage = `${contact.name} 撤回了一条消息`;
                                    saveChatData();
                                    if (messagesContainer) {
                                        const noticeHTML = `
                                            <div class="message-line" style="justify-content: center;">
                                                <div class="retracted-message-notice" data-action="view-retracted" data-content="${escape(originalContent)}" data-thought="${escape(innerThought)}">
                                                    ${contact.name}撤回了一条消息，<span class="clickable-retract">点击查看</span>
                                                </div>
                                            </div>
                                        `;
                                        messagesContainer.insertAdjacentHTML('beforeend', noticeHTML);
                                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                                    }
                                    await new Promise(resolve => setTimeout(resolve, 800));
                                    continue;
                                }
                            const emojiRegex = /^\[表情:\s*(.*?)\s*\]$/;
                            const voiceMsgRegex = /^\[VOICE_MSG:\s*([\s\S]*?)\s*\]$/;
                            const galleryRegex = /^\[图库:\s*(.*?)\s*\]$/;
                            const transferRegex = /^\[转账\]金额:(\d+\.?\d*),说明:(.*)/; // 新增：转账正则
                            const emojiMatch = segment.match(emojiRegex);
                            const voiceMsgMatch = segment.match(voiceMsgRegex);
                            const galleryMatch = segment.match(galleryRegex);
                            const transferMatch = segment.match(transferRegex); // 新增：匹配转账
                            let newMessage;
                            const audioDataUrlForSegment = audioUrlMap.get(i);
                            if (galleryMatch) {
                                const imageName = galleryMatch[1];
                                const galleryItem = (JSON.parse(await localforage.getItem('galleryData')) || []).find(item => item.name === imageName);
                                if (galleryItem) {
                                    newMessage = { id: generateId(), turnId: turnId, type: 'image', isGallery: true, url: galleryItem.url, text: segment, sender: 'them', timestamp: Date.now() + i, voiceData: voiceData };
                                    contact.lastMessage = `[图片]`;
                                }
                            } else if (voiceMsgMatch) {
                                const voiceText = voiceMsgMatch[1];
                                const duration = Math.max(1, Math.round(voiceText.length / 4));
                                newMessage = { id: generateId(), turnId: turnId, type: 'voice', text: voiceText, duration: `${duration}″`, audioDataUrl: audioDataUrlForSegment || null, sender: 'them', timestamp: Date.now() + i, voiceData: voiceData };
                                contact.lastMessage = "[语音]";
                            } else if (emojiMatch) {
                                const emojiDesc = emojiMatch[1];
                                const foundEmoji = allEmojis.find(e => e.desc === emojiDesc);
                                if (foundEmoji) {
                                    newMessage = { id: generateId(), turnId: turnId, type: 'image', isSticker: true, url: foundEmoji.url, text: segment, sender: 'them', timestamp: Date.now() + i, voiceData: voiceData };
                                    contact.lastMessage = "[表情]";
                                }
                            } else if (transferMatch) {
                                // 新增：处理转账消息
                                newMessage = { id: generateId(), turnId: turnId, text: segment, sender: 'them', timestamp: Date.now() + i, voiceData: voiceData };
                                contact.lastMessage = `向您发起一笔转账`;
                            }
                            if (!newMessage) {
                                if (audioDataUrlForSegment) {
                                    const estimatedDuration = Math.max(1, Math.round(segment.length / 4));
                                    newMessage = { id: generateId(), turnId: turnId, type: 'voice', text: segment, duration: `${estimatedDuration}″`, audioDataUrl: audioDataUrlForSegment, sender: 'them', timestamp: Date.now() + i, voiceData: voiceData };
                                    contact.lastMessage = '[语音消息]';
                                } else {
                                    newMessage = { id: generateId(), turnId: turnId, text: segment, sender: 'them', timestamp: Date.now() + i, voiceData: voiceData };
                                    contact.lastMessage = segment.substring(0, 50);
                                }
                            }

                                if (isFirstMessage && alternativesToAttach.length > 0) { newMessage.alternatives = alternativesToAttach; }
                                if (isFirstMessage && quoteInfo) { newMessage.quote = quoteInfo; }
                                // 【最终方案】根据全局标志决定消息存储位置
                                if (window.isOfflineReplyRound === true) {
                                    // 确保线下消息数组存在
                                    if (!chatAppData.offlineMessages[contactId]) {
                                        chatAppData.offlineMessages[contactId] = [];
                                    }
                                    chatAppData.offlineMessages[contactId].push(newMessage);
                                } else {
                                    messages.push(newMessage); // 默认存储到线上
                                }
                                const isViewingThisChat = currentChatView.active && currentChatView.contactId === contactId;
                                if (!isViewingThisChat || isReAnswer) {
                                    contact.unreadCount = (contact.unreadCount || 0) + 1;
                                    updateTotalUnreadBadge();
                                    if (document.querySelector('.chat-contact-list-view')) { renderContactList(); }
                                    const notificationTitle = contact.remark || contact.name;
                                    const notificationBody = segment;
                                    const notificationIcon = document.querySelector("link[rel='icon']").href;
                                    if (document.hidden && await localforage.getItem('systemNotificationsEnabled') === 'true') {
                                        sendSystemNotification(notificationTitle, notificationBody, notificationIcon);
                                    } else {
                                        showGlobalMessageBanner(contactId, notificationBody, isReAnswer);
                                    }
                                }
                                saveChatData();
                                if (isViewingThisChat) { playSoundEffect('回复音效.wav'); }
                                if (messagesContainer) {
                                    const messageLine = document.createElement('div');
                                    messageLine.className = 'message-line received new-message-animate';
                                    messageLine.dataset.messageId = newMessage.id;
                                let bubbleContent = '';
                                if (newMessage.quote) { bubbleContent += `<div class="quoted-message-in-bubble">${newMessage.quote.text}</div>`; }
                                
                                const transferRegex = /\[转账\]金额:(\d+\.?\d*),说明:(.*)/;
                                const transferMatch = newMessage.text.match(transferRegex);

                                if (newMessage.type === 'image') {
                                    let imageClass = 'message-image';
                                    if (newMessage.isSticker) { imageClass = 'message-sticker'; } else if (newMessage.isGallery) { imageClass = 'message-gallery-image'; }
                                    bubbleContent += `<img src="${newMessage.url}" class="${imageClass}" alt="${newMessage.text}">`;
                                } else if (newMessage.type === 'voice') {
                                    const voiceText = newMessage.text ? await window.applyAllRegex(newMessage.text, { type: 'chat', id: contactId }) : '';
                                    bubbleContent += `<div class="message-voice-bar" data-message-id="${newMessage.id}" data-action="toggle-voice-text"><div class="voice-wave-icon"><div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div></div><span class="duration">${newMessage.duration}</span></div><div class="voice-text-description" style="display: none">${voiceText}</div>`;
                                } else if (transferMatch) {
                                    // 新增：渲染转账卡片
                                    const amount = transferMatch[1];
                                    const description = transferMatch[2] || '';
                                    // 【核心修复】为AI发送的转账卡片添加点击事件和数据属性，使其能够立即被点击
                                    bubbleContent += `
                                    <div class="transfer-card received" 
                                         onclick="openTransferActionPopup(this)" 
                                         style="cursor: pointer;"
                                         data-message-id="${newMessage.id}" 
                                         data-amount="${amount}" 
                                         data-description="${description}">
                                        <div class="card-content">
                                            <div class="transfer-left-content">
                                                <div class="transfer-icon">
                                                    <svg t="1769238774644" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5731"><path d="M515.6352 141.4656A371.2512 371.2512 0 0 1 813.568 292.352a25.6 25.6 0 1 0 41.472-30.3104A420.864 420.864 0 0 0 103.3728 426.3424l-18.8928-34.7136a25.6 25.6 0 0 0-45.0048 24.4736l58.4192 107.52a25.6 25.6 0 0 0 22.528 13.312 26.8288 26.8288 0 0 0 6.2976-0.768 25.6 25.6 0 0 0 19.3024-24.832 370.0224 370.0224 0 0 1 369.6128-369.8688zM990.5152 602.4704l-57.2928-103.7312a25.6 25.6 0 0 0-48.0256 12.3392A369.6128 369.6128 0 0 1 215.04 725.9136a25.6 25.6 0 1 0-41.6256 29.7472 420.864 420.864 0 0 0 754.8416-160.512l17.7152 32.1024a25.6 25.6 0 1 0 44.8-24.7808z" fill="#333333" p-id="5732"></path><path d="M646.144 536.064a25.6 25.6 0 0 0 0-51.2h-80.2816L665.6 367.872a25.6 25.6 0 0 0-38.9632-33.1776L516.096 464.3328l-107.52-129.4336a25.6 25.6 0 0 0-39.3728 32.768L466.5344 484.864h-77.824a25.6 25.6 0 0 0 0 51.2h103.1168v47.616H388.7104a25.6 25.6 0 0 0 0 51.2h103.1168v85.1456a25.6 25.6 0 0 0 51.2 0V634.88h103.1168a25.6 25.6 0 0 0 0-51.2h-103.1168v-47.616z" fill="#333333" p-id="5733"></path></svg></div>
                                                <div class="card-info">
                                                    <div class="transfer-amount">¥${parseFloat(amount).toFixed(2)}</div>
                                                    <div class="transfer-description">${escapeHTML(description)}</div>
                                                </div>
                                            </div>
                                            <div class="card-status"></div>
                                        </div>
                                        <div class="divider"></div>
                                    </div>`;
                                
                                } else {
                                    bubbleContent += newMessage.text.replace(/\n/g, '<br>');
                                }

                                    const avatarClickAction = newMessage.voiceData ? 'data-action="show-inner-voice"' : '';
                                    messageLine.innerHTML = `<div class="chat-avatar" style="background-image: url('${charAvatarUrl}')" ${avatarClickAction}></div><div class="chat-bubble received">${bubbleContent}</div>`;
                                    if (isViewingThisChat) { playSoundEffect('回复音效.wav'); }
                                    messagesContainer.appendChild(messageLine);
                                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                                    await new Promise(resolve => setTimeout(resolve, 800));
                                }
                            }
                        };
                        // [新增逻辑] 检查AI回复是否包含转账处理指令
                        let transferStatus = null;
                        if (fullReplyContent.startsWith('[已收下]')) {
                            transferStatus = 'accepted';
                            fullReplyContent = fullReplyContent.replace('[已收下]', '').trim();
                        } else if (fullReplyContent.startsWith('[已退回]')) {
                            transferStatus = 'returned';
                            fullReplyContent = fullReplyContent.replace('[已退回]', '').trim();
                        }

                        // 如果是转账回复，更新用户发送的最新一笔转账的状态
                        if (transferStatus) {
                            // 从后往前找，找到最近的一条由用户发送的、还未处理的转账消息
                            for (let i = messages.length - 1; i >= 0; i--) {
                                const msg = messages[i];
                                // 确保是用户发送的，是转账消息，并且还没有状态
                                if (msg.sender === 'me' && msg.text.startsWith('[转账]') && !msg.transferStatus) {
                                    msg.transferStatus = transferStatus;
                                    // 【核心修复】保存数据并立即重绘聊天室
                                    await saveChatData();
                                    await renderChatRoom(contactId);
                                    break; // 只处理最近的一条
                                }
                            }
                        }
                        // [新增逻辑结束]

                        const voiceMatch = fullReplyContent.match(/\[VOICE:\s*(.*?)\s*\|\s*(.*?)\s*\|\s*([^|]*?%)\s*(?:\|\s*(.*?))?\s*(?:\|\s*tokens:(\d+))?\]/s);
                        let voiceData = null;
                        if (voiceMatch) {
                            voiceData = { status: voiceMatch[1].trim(), inner: voiceMatch[2].trim(), favorability: voiceMatch[3].trim(), trueFeeling: (voiceMatch[4] || '').trim(), tokens: voiceMatch[5] ? parseInt(voiceMatch[5], 10) : null };
                            const character = archiveData.characters.find(c => c.id === contactId);
                            if (character && character.favorability === null && voiceData.favorability) {
                                const initialFavor = parseInt(voiceData.favorability, 10);
                                if (!isNaN(initialFavor)) {
                                    character.favorability = initialFavor;
                                    saveArchiveData();
                                    showGlobalToast(`${character.name} 的初始好感度已设定为 ${initialFavor}`, { type: 'success' });
                                }
                            }
                            fullReplyContent = fullReplyContent.replace(/\[VOICE:.*?\]/s, '').trim();
                        }
                        let replySegments;
                        if (contact.offlineMode) { replySegments = [fullReplyContent.trim()]; } else { replySegments = fullReplyContent.split('\n').filter(seg => seg.trim() !== ''); }
                        const quoteMatch = fullReplyContent.match(/\[QUOTE:\s*(.*?)\s*\|\s*(.*?)\]/s);
                        let quoteInfo = null;
                        const audioUrlMap = new Map();
                        const contactForVoice = chatAppData.contacts.find(c => c.id === contactId);
                        if (contactForVoice && contactForVoice.voiceId) {
                            const speechTasks = [];
                            const tempReplySegments = fullReplyContent.replace(/\[VOICE:.*?\]/s, '').split(/\\n|\n/).filter(seg => seg.trim());
                            if (voiceData && tempReplySegments.length > 0) { speechTasks.push({ index: 0, text: sanitizeForSpeech(tempReplySegments[0]) }); }
                            const voiceMsgRegex = /\[VOICE_MSG:\s*([\s\S]*?)\s*\]/g;
                            tempReplySegments.forEach((segment, index) => {
                                let match;
                                while ((match = voiceMsgRegex.exec(segment)) !== null) {
                                    const text = sanitizeForSpeech(match[1].trim());
                                    if (text && !speechTasks.some(task => task.index === index)) { speechTasks.push({ index: index, text: text }); }
                                }
                            });
                            if (speechTasks.length > 0) {
                                showGlobalToast(`正在生成 ${speechTasks.length} 条语音...`, { type: 'info', duration: 2000 });
                                const promises = speechTasks.map(async (task) => {
                                    const blob = await fetchMinimaxSpeechBlob(task.text, contactForVoice.voiceId);
                                    if (blob) {
                                        const dataUrl = await blobToDataURL(blob);
                                        return { index: task.index, audioDataUrl: dataUrl };
                                    }
                                    return { index: task.index, audioDataUrl: null };
                                });
                                const audioResults = await Promise.all(promises);
                                audioResults.forEach(result => { if (result && result.audioDataUrl) { audioUrlMap.set(result.index, result.audioDataUrl); } });
                            }
                        }
                        if (quoteMatch) {
                            const quotedMessageId = quoteMatch[1].trim();
                            const replyText = quoteMatch[2].trim();
                            const originalMessage = messages.find(m => m.id === quotedMessageId);
                            const replySegments = replyText.split('\n').filter(seg => seg.trim() !== '');
                            quoteInfo = originalMessage ? { id: originalMessage.id, text: originalMessage.text.replace(/<br>/g, '\n'), sender: originalMessage.sender } : null;
                            if (replySegments.length > 0) { await renderAnimatedReplies(contactId, replySegments, audioUrlMap, voiceData, quoteInfo, []); }
                        } else {
                            let replySegments;
                            // 【核心修复】直接使用已经处理过的 fullReplyContent 来分割，不再重复移除 VOICE 块。
                            // 之前的代码在这里进行了不必要的二次处理，可能导致 [INITIATE_OFFLINE_MODE] 指令被意外清除。
                            if (contact.offlineMode) {
                                replySegments = [fullReplyContent.trim()];
                            } else {
                                replySegments = fullReplyContent.split(/\\n|\n/).filter(seg => seg.trim() !== '');
                            }

                            if (replySegments.length > 0) {
                                let alternativesToAttach = [];
                                if (reAnswerInfo) {
                                    const oldRound = reAnswerInfo.roundMessages;
                                    const firstOldMessage = oldRound[0];
                                    const existingAlts = firstOldMessage.alternatives || [];
                                    if (firstOldMessage.alternatives) delete firstOldMessage.alternatives;
                                    alternativesToAttach = [oldRound, ...existingAlts];
                                    messages.splice(reAnswerInfo.startIndex, oldRound.length);
                                    saveChatData();
                                    renderChatRoom(contactId);
                                }
                                const isReAnswer = !!reAnswerInfo;
                                await renderAnimatedReplies(contactId, replySegments, audioUrlMap, voiceData, quoteInfo, alternativesToAttach, isReAnswer);
                            }
                        }

                        // 【新增】如果需要，在AI回复完全结束后，弹出线下模式提示框
                        if (shouldShowOfflinePrompt) {
                            // 使用 setTimeout 确保它在最后一条消息的入场动画之后显示
                            setTimeout(() => showAiOfflinePrompt(contactId), 500);
                        }
                    }
                }

             } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('API 回复失败:', error);
                    // 新增：调用自定义提示框显示错误信息
                    showCustomAlert(`API 调用失败: ${error.message}`);
                }
            } finally {
                isApiReplying = false;
                replyingContactId = null;
                abortController = null;

                // 【核心修复】无论流程如何，最后都强制移除加载气泡
                const chatRoomLoadingBubble = document.querySelector('.chat-messages .message-line.loading');
                if (chatRoomLoadingBubble) {
                    chatRoomLoadingBubble.remove();
                }

                // 【新增】在视频通话界面移除加载动画
                if (isVideoCallActive) {
                    const loadingElement = document.getElementById('video-call-loading');
                    if (loadingElement) {
                        loadingElement.remove();
                    }
                }
                
                // 刷新联系人列表，以更新最后一条消息的预览
                if (document.querySelector('.chat-contact-list-view')) {
                    renderContactList();
                }
                
                const contact = chatAppData.contacts.find(c => c.id === contactId);
                
                // 重新渲染当前聊天室的标题和按钮状态（例如API回复按钮的图标）
                const apiReplyBtn = document.getElementById('api-reply-btn');
                if (apiReplyBtn) { // 移除 contact 判断，确保任何情况下都能更新按钮
                     apiReplyBtn.title = 'API回复';
                     document.getElementById('api-reply-icon-default').style.display = 'block';
                     document.getElementById('api-reply-icon-stop').style.display = 'none';
                }
                
                // 新增：在AI回复结束后，检查是否需要自动总结
                if (contact) { // 确保 contact 存在再执行后续逻辑
                    await checkAndTriggerAutoSummary(contactId);

                // === 新增：印象分析触发逻辑 ===
                if (!reAnswerInfo) { // 只在正常回复时计数，重回时不计
                    const threshold = contact.impressionTurnThreshold || 0;
                    // 只有在阈值大于0时才进行计数和分析
                    if (threshold > 0) {
                        contact.turnCount = (contact.turnCount || 0) + 1;
                        console.log(`[回合计数] 与 ${contact.name} 的对话已进行 ${contact.turnCount}/${threshold} 回合。`);
                        if (contact.turnCount >= threshold) {
                            analyzeUserImpressions(contactId); // 异步调用，不会阻塞UI
                            contact.turnCount = 0; // 重置计数器
                        }
                        // 【核心修复】在此处添加 saveChatData() 调用
                        saveChatData(); 
                    }
                }
                // === 印象分析逻辑结束 ===

                }
            }

        };


        // ===================================
        // === 11. 档案 App 完整逻辑 开始 ===
        // ===================================


        // 默认头像 SVG (9:16比例占位) - [已修复] 彻底URL编码并使用单引号
        const DEFAULT_USER_AVATAR_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 16' fill='%2364748b'%3E%3Crect width='9' height='16' fill='%23f1f5f9'/%3E%3Ccircle cx='4.5' cy='6' r='3' fill='%2394a3b8'/%3E%3Cpath d='M0.5 12c0 2 8 2 8 0s-4-1-4-1-4 1-4 1z' fill='%2394a3b8'/%3E%3C/svg%3E`;
        const DEFAULT_CHAR_AVATAR_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 16' fill='%23a1a1aa'%3E%3Crect width='9' height='16' fill='%23fafafa'/%3E%3Ccircle cx='4.5' cy='6' r='3' fill='%23cbd5e1'/%3E%3Cpath d='M0.5 12c0 2 8 2 8 0s-4-1-4-1-4 1-4 1z' fill='%23cbd5e1'/%3E%3C/svg%3E`;


        // 初始化档案数据默认值
        window.archiveData = {
            user: {
                id: 'user',
                avatar: DEFAULT_USER_AVATAR_SVG,
                name: '默认用户',
                gender: '未知', // 新增：性别
                age: '未知',
                level: 'LV.1', // 新增：等级
                persona: '一个挣扎在无限世界中的普通人。'
                // 以下字段仅保留在数据结构中，但UI上不再显示
                // codename: 'Player',
                // ability: '尚未觉醒',
                // survivalDays: 0,
            },
            characters: []
        };

        // 异步加载档案数据
        async function loadArchiveData() {
            const savedData = await localforage.getItem('archiveData');
            if (savedData) {
                window.archiveData = JSON.parse(savedData);
            }
        };

        const saveArchiveData = async () => {
            await localforage.setItem('archiveData', JSON.stringify(archiveData));
        };
        
        // 获取档案详情模态框的元素
        const archiveModalOverlay = document.getElementById('archive-modal-overlay');
        const archiveDetailModal = document.getElementById('archive-detail-modal');
        const archiveDetailContent = document.getElementById('archive-detail-content');
        const archiveDetailCloseBtn = document.getElementById('archive-detail-close-btn');

        // 关闭档案详情模态框 (无论是详情模式还是编辑模式)
        const closeArchiveDetailModal = () => {
            archiveModalOverlay.classList.remove('visible');
            archiveDetailContent.innerHTML = '';
            // 关闭详情或编辑模式后，重新显示档案App的悬浮添加按钮
            archiveFab.classList.add('visible');
            // 【新增】返回档案App主页面
            modalTitle.textContent = '档案'; // 将通用模态框标题设回档案
            renderArchivePage(); // 重新渲染档案App的主页面
        };

        // 绑定档案详情模态框的关闭按钮
        archiveDetailCloseBtn.addEventListener('click', closeArchiveDetailModal);


        // 打开档案详情模态框 (显示模式)
        const openArchiveDetailModal = (profile) => {
            archiveFab.classList.remove('visible'); // 隐藏悬浮添加按钮
            
            const editIconSVG = `<svg t="1767094460951" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4994" width="16" height="16"><path d="M469.333333 128a42.666667 42.666667 0 0 1 0 85.333333H213.333333v597.333334h597.333334v-256l0.298666-4.992A42.666667 42.666667 0 0 1 896 554.666667v256a85.333333 85.333333 0 0 1-85.333333 85.333333H213.333333a85.333333 85.333333 0 0 1-85.333333-85.333333V213.333333a85.333333 85.333333 0 0 1 85.333333-85.333333z m414.72 12.501333a42.666667 42.666667 0 0 1 0 60.330667L491.861333 593.066667a42.666667 42.666667 0 0 1-60.330666-60.330667l392.192-392.192a42.666667 42.666667 0 0 1 60.330666 0z" fill="currentColor" p-id="4995"></path></svg>`;
            const editButtonHTML = `<button class="edit-char-btn" data-action="edit" data-id="${profile.id}">${editIconSVG}</button>`;
            let contentHTML = '';

            // 如果是 User 档案
            if (profile.id === 'user') {
                contentHTML = `
                    <div class="profile-detail-content">
                        <div class="profile-detail-header-section">
                            <div class="profile-detail-avatar-large" style="background-image: url('${profile.avatar}');"></div>
                            <div class="profile-detail-basic-info-display">
                                <span class="name">${profile.name} ${editButtonHTML}</span>
                                <span class="meta-info">性别: ${profile.gender}</span>
                                <span class="meta-info">年龄: ${profile.age}</span>
                                <span class="meta-info">等级: ${profile.level}</span>
                            </div>
                        </div>
                        <div class="profile-detail-extended-info-display">
                            <div class="field-group collapsible">
                                <div class="collapsible-header">
                                    <label>基础设定:</label>
                                    <button class="collapse-toggle" type="button" aria-label="展开/折叠">
                                        展开
                                    </button>
                                </div>
                                <div class="collapsible-content">
                                    <span>${profile.persona}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } 
            // 如果是 Char 档案
            else {
                let phasedPersonasHTML = '';
                if (profile.phasedPersonasEnabled && profile.phasedPersonas && profile.phasedPersonas.length > 0) {
                    phasedPersonasHTML = `
                        <div class="field-group">
                            <label>阶段性人设:</label>
                            ${profile.phasedPersonas.map(p => `
                                <span style="margin-bottom: 5px; display: block;"><strong>${p.range}:</strong> ${p.behavior}</span>
                            `).join('')}
                        </div>`;
                }

                let openingLinesHTML = '';
                if (profile.openingLines && profile.openingLines.length > 0) {
                    openingLinesHTML = `
                        <div class="field-group">
                            <label>开场白:</label>
                            ${profile.openingLines.map(line => `
                                <span style="margin-bottom: 5px; display: block;">- ${line}</span>
                            `).join('')}
                        </div>`;
                }

                contentHTML = `
                    <div class="profile-detail-content">
                        <div class="profile-detail-header-section">
                            <div class="profile-detail-avatar-large" style="background-image: url('${profile.avatar}');"></div>
                            <div class="profile-detail-basic-info-display">
                                <span class="name">${profile.name} ${editButtonHTML}</span>
                                <span class="meta-info">好感: <span id="archive-detail-favorability">${profile.favorability || 0}</span></span>
                                <span class="meta-info">年龄: ${profile.age}</span>
                            </div>
                        </div>
                        <div class="profile-detail-extended-info-display">
                            <div class="field-group collapsible">
                                <div class="collapsible-header">
                                    <label>基础设定:</label>
                                    <button class="collapse-toggle" type="button" aria-label="展开/折叠">
                                        展开
                                    </button>
                                </div>
                                <div class="collapsible-content">
                                    <span>${profile.persona}</span>
                                </div>
                            </div>
                            ${phasedPersonasHTML}
                            ${openingLinesHTML}
                        </div>
                    </div>
                `;
            }
            // 新增逻辑：获取并显示最新的好感度
            const contactId = profile.id;
            const messages = (chatAppData.messages && chatAppData.messages[contactId]) || [];
            let latestFavorability = profile.favorability || 0;
            // 从后往前遍历消息，找到最新的voiceData
            for (let i = messages.length - 1; i >= 0; i--) {
                if (messages[i].voiceData && messages[i].voiceData.favorability) {
                    latestFavorability = parseInt(messages[i].voiceData.favorability, 10);
                    break;
                }
            }
            const favorabilitySpan = archiveDetailContent.querySelector('#archive-detail-favorability');
            if (favorabilitySpan) {
                favorabilitySpan.textContent = latestFavorability;
            }

            archiveDetailContent.innerHTML = contentHTML;
            archiveModalOverlay.classList.add('visible');

            // 为详情页中的编辑按钮添加事件监听
            const editBtn = archiveDetailContent.querySelector('.edit-char-btn[data-action="edit"]');
            if (editBtn) {
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const profileId = e.currentTarget.dataset.id;
                    openCharEditModal(profileId);
                });
            }
            
            // 为折叠按钮添加事件监听
            const collapseToggles = archiveDetailContent.querySelectorAll('.collapse-toggle');
            collapseToggles.forEach(toggle => {
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const content = toggle.closest('.field-group').querySelector('.collapsible-content');
                    const isCollapsed = content.classList.toggle('collapsed');
                    toggle.classList.toggle('collapsed', isCollapsed);
                    toggle.textContent = isCollapsed ? '展开' : '收起';
                    
                    // 调整max-height以实现平滑过渡
                    if (!isCollapsed) {
                        content.style.maxHeight = content.scrollHeight + 'px';
                        // 动画结束后重置max-height为none，允许内容自由扩展
                        setTimeout(() => {
                            content.style.maxHeight = 'none';
                        }, 300);
                    } else {
                        content.style.maxHeight = content.scrollHeight + 'px';
                        // 触发重排
                        content.offsetHeight;
                        // 设置为0开始折叠动画
                        content.style.maxHeight = '0';
                    }
                });
                
                // 初始化时展开内容
                const content = toggle.closest('.field-group').querySelector('.collapsible-content');
                content.style.maxHeight = 'none';
                toggle.textContent = '收起';
            });
        };

        // 渲染档案App主页
        const renderArchivePage = () => {
            modalBody.innerHTML = ''; // 清空内容
            const container = document.createElement('div');
            container.className = 'archive-page-container';

            // 1. 渲染用户卡片
            const user = archiveData.user;
            // 编辑图标 SVG (移动到详情页)
            const editIconSVG = `<svg t="1767094460951" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4994" width="16" height="16"><path d="M469.333333 128a42.666667 42.666667 0 0 1 0 85.333333H213.333333v597.333334h597.333334v-256l0.298666-4.992A42.666667 42.666667 0 0 1 896 554.666667v256a85.333333 85.333333 0 0 1-85.333333 85.333333H213.333333a85.333333 85.333333 0 0 1-85.333333-85.333333V213.333333a85.333333 85.333333 0 0 1 85.333333-85.333333z m414.72 12.501333a42.666667 42.666667 0 0 1 0 60.330667L491.861333 593.066667a42.666667 42.666667 0 0 1-60.330666-60.330667l392.192-392.192a42.666667 42.666667 0 0 1 60.330666 0z" fill="#cdcdcd" p-id="4995"></path></svg>`;

            // 根据你的新需求，重新构造 user 卡片
            // 姓名下方是 性别、年龄、等级。下面直接显示基础设定（人设）
            const userCardHTML = `
                <div class="user-profile-card" data-id="user">
                    <div class="card-avatar" style="background-image: url('${user.avatar}');"></div>
                    <div class="card-info">
                        <div class="name">${user.name} <span style="font-size:12px; opacity:0.6; font-weight:500;">(User)</span></div>
                        <div class="meta-info" style="font-size: 13px; opacity: 0.7; margin: 4px 0 8px 0;">
                            <span>性别: ${user.gender || '未知'}</span> | 
                            <span>年龄: ${user.age || '未知'}</span> | 
                            <span>等级: ${user.level || 'LV.1'}</span>
                        </div>
                        <div class="bio">${user.persona}</div>
                    </div>
                </div>
            `;

            container.innerHTML += userCardHTML;

            // 2. 渲染角色卡片列表
            let charListHTML = '<div class="char-grid-container">';
            archiveData.characters.forEach(char => {
                // [修复] 将 url 内的引号从双引号改为单引号，以避免HTML属性解析错误
                charListHTML += `
                    <div class="char-card" data-id="${char.id}">
                        <div class="card-avatar" style="background-image: url('${char.avatar}');"></div>
                        <div class="card-info">
                            <div class="name">${char.name}</div>
                        </div>
                    </div>
                `;
            });


            charListHTML += '</div>';
            container.innerHTML += charListHTML;

            modalBody.appendChild(container);

            // 3. 绑定点击事件 (事件委托处理点击)
            modalBody.addEventListener('click', (e) => {
                // 如果点击的是卡片本身
                const card = e.target.closest('.user-profile-card, .char-card');
                if (card) {
                    const id = card.dataset.id;
                    if (id === 'user') {
                        openArchiveDetailModal(archiveData.user);
                    } else {
                        const character = archiveData.characters.find(c => c.id === id);
                        if (character) {
                            openArchiveDetailModal(character);
                        }
                    }
                }
            });
        };



        // 渲染档案编辑表单
        const renderCharEditForm = (profileData, isNew = false, isUser = false) => {
            let formContent = '';
            
            // 头像上传的通用部分
            const avatarSection = `
                <div class="profile-detail-avatar-large" id="char-edit-avatar-preview" style="background-image: url('${profileData.avatar}');"></div>
                <input type="file" id="char-edit-avatar-upload" accept="image/*" hidden>
            `;

            if (isUser) {
                formContent = `
                    <div class="profile-detail-content profile-edit-form">
                        <div class="profile-detail-header-section">
                            ${avatarSection}
                            <div class="profile-detail-basic-info-display">
                                <div class="modal-form-group">
                                    <label for="user-edit-name">姓名</label>
                                    <input type="text" id="user-edit-name" class="modal-input" value="${profileData.name || ''}">
                                </div>
                                <div class="modal-form-group">
                                    <label for="user-edit-gender">性别</label>
                                    <input type="text" id="user-edit-gender" class="modal-input" value="${profileData.gender || ''}">
                                </div>
                                <div class="modal-form-group">
                                    <label for="user-edit-age">年龄</label>
                                    <input type="text" id="user-edit-age" class="modal-input" value="${profileData.age || ''}">
                                </div>
                                <div class="modal-form-group">
                                    <label>等级</label>
                                    <input type="text" class="modal-input" value="${profileData.level || 'LV.1'}" readonly style="opacity:0.6; cursor:not-allowed;">
                                </div>
                            </div>
                        </div>
                        <div class="profile-detail-extended-info-display">
                            <div class="modal-form-group">
                                <label for="user-edit-persona">基础设定</label>
                                <textarea id="user-edit-persona" class="modal-input" style="min-height: 120px;">${profileData.persona || ''}</textarea>
                            </div>
                        </div>
                        <div class="button-container">
                            <button id="save-char-edit-btn" class="modal-button">保存档案</button>
                        </div>
                    </div>
                `;
            } else { // Char 档案的编辑表单
                formContent = `
                    <div class="profile-detail-content profile-edit-form">
                        <!-- 基础设定 -->
                        <div class="detail-section-header"><label>基础设定</label></div>
                        <div class="profile-detail-header-section" style="border:none; padding-bottom:0;">
                            ${avatarSection}
                            <div class="profile-detail-basic-info-display">
                                <div class="modal-form-group"><label for="char-edit-name">姓名</label><input type="text" id="char-edit-name" class="modal-input" value="${profileData.name || ''}"></div>
                                <div class="modal-form-group">
                                    <label for="char-edit-favorability">好感</label>
                                    <input type="number" id="char-edit-favorability" class="modal-input" min="-99" max="100" value="${profileData.favorability ?? ''}" placeholder="留空则由AI首次生成" ${isNew ? '' : 'readonly'} title="${isNew ? '' : '好感度初始值在创建后不可更改'}">
                                </div>
                                <div class="modal-form-group"><label for="char-edit-age">年龄</label><input type="text" id="char-edit-age" class="modal-input" value="${profileData.age || ''}"></div>
                            </div>
                        </div>
                        <div class="profile-detail-extended-info-display" style="gap:10px;">
                            <div class="modal-form-group"><label for="char-edit-persona">人设 (基础)</label><textarea id="char-edit-persona" class="modal-input" style="min-height: 100px;">${profileData.persona || ''}</textarea></div>
                        </div>
                        
                        <!-- 阶段性人设 -->
                        <div class="detail-section-header">
                            <label>阶段性人设</label>
                            <label class="switch-container">
                                <input type="checkbox" id="phased-persona-switch" ${profileData.phasedPersonasEnabled ? 'checked' : ''}>
                                <span class="switch-slider"></span>
                            </label>
                        </div>
                        <div id="phased-persona-list">
                            ${(profileData.phasedPersonas || []).map(p => {
                                // 【修复】使用更健壮的逻辑解析范围值，防止 'undefined' 出现
                                const rangeParts = (p.range || '0-20').split('-');
                                const startValue = rangeParts[0] || '';
                                const endValue = rangeParts[1] || '';
                                return `
                                <div class="dynamic-list-item phased-persona-item">
                                    <div class="range-input-container">
                                        <input type="number" class="modal-input range-start" min="-99" max="100" placeholder="-99" value="${startValue}">
                                        <span class="range-input-separator">-</span>
                                        <input type="number" class="modal-input range-end" min="-99" max="100" placeholder="100" value="${endValue}">
                                    </div>
                                    <input type="text" class="modal-input behavior-input" placeholder="在此范围内的表现" value="${p.behavior}">
                                    <button class="delete-item-btn" title="删除此条"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg></button>
                                </div>
                            `;
                            }).join('')}
                        </div>
                        <button id="add-phased-persona-btn" class="modal-button secondary" style="width:100%; margin-top:5px;">+ 添加阶段</button>
                        
                        <!-- 开场白 -->
                        <div class="detail-section-header" style="margin-top:20px;"><label>开场白</label></div>
                        <div id="opening-lines-list">
                             ${(profileData.openingLines || []).map(line => `
                                <div class="dynamic-list-item opening-line-item">
                                    <input type="text" class="modal-input opening-line-input" value="${line}">
                                    <button class="delete-item-btn" title="删除此条"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg></button>
                                </div>
                            `).join('')}
                        </div>
                        <button id="add-opening-line-btn" class="modal-button secondary" style="width:100%; margin-top:5px;">+ 添加开场白</button>
                        
                        <!-- 保存和删除按钮 -->
                        <div class="button-container" style="margin-top:30px;">
                            <button id="save-char-edit-btn" class="modal-button">保存档案</button>
                            ${!isNew ? `<button id="delete-char-btn" class="modal-button secondary" style="margin-left: 10px; background-color: #be123c;">删除角色</button>` : ''}
                        </div>
                    </div>
                `;
            }
            
            archiveDetailContent.innerHTML = formContent;
            archiveModalOverlay.classList.add('visible');
            
            // --- 通用和char特定的事件绑定 ---

            // 头像上传
            const charEditAvatarPreview = document.getElementById('char-edit-avatar-preview');
            const charEditAvatarUpload = document.getElementById('char-edit-avatar-upload');
            charEditAvatarPreview.addEventListener('click', () => charEditAvatarUpload.click());
            charEditAvatarUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    compressImage(file).then(compressedDataUrl => {
                        charEditAvatarPreview.style.backgroundImage = `url(${compressedDataUrl})`;
                        profileData.avatar = compressedDataUrl; // 更新临时数据
                        if (isUser) {
                            document.getElementById('avatar-box').style.backgroundImage = `url(${compressedDataUrl})`;
                        }
                    }).catch(error => {
                        console.error("档案头像压缩失败:", error);
                        showCustomAlert("图片压缩失败，请换张图片或稍后再试。");
                    });
                }
            });

            // Char特定的动态列表事件
            if (!isUser) {
                const phasedList = document.getElementById('phased-persona-list');
                const openingList = document.getElementById('opening-lines-list');
                const personaSwitch = document.getElementById('phased-persona-switch');
                
                // 开关控制
                const togglePhasedSection = () => {
                    const isEnabled = personaSwitch.checked;
                    phasedList.style.display = isEnabled ? 'block' : 'none';
                    document.getElementById('add-phased-persona-btn').style.display = isEnabled ? 'block' : 'none';
                };
                personaSwitch.addEventListener('change', togglePhasedSection);
                togglePhasedSection(); // 初始化显示状态

                // 添加阶段
                document.getElementById('add-phased-persona-btn').addEventListener('click', () => {
                    const newItem = document.createElement('div');
                    newItem.className = 'dynamic-list-item phased-persona-item';
                    newItem.innerHTML = `
                        <div class="range-input-container">
                            <input type="number" class="modal-input range-start" min="-99" max="100" placeholder="-99">
                            <span class="range-input-separator">-</span>
                            <input type="number" class="modal-input range-end" min="-99" max="100" placeholder="100">
                        </div>
                        <input type="text" class="modal-input behavior-input" placeholder="在此范围内的表现">
                        <button class="delete-item-btn" title="删除此条"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg></button>
                    `;
                    phasedList.appendChild(newItem);
                });
                
                // 添加开场白
                document.getElementById('add-opening-line-btn').addEventListener('click', () => {
                    const newItem = document.createElement('div');
                    newItem.className = 'dynamic-list-item opening-line-item';
                    newItem.innerHTML = `
                        <input type="text" class="modal-input opening-line-input" placeholder="输入一条开场白">
                        <button class="delete-item-btn" title="删除此条"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg></button>
                    `;
                    openingList.appendChild(newItem);
                });

                // 删除条目 (事件委托)
                archiveDetailContent.addEventListener('click', (e) => {
                    const deleteBtn = e.target.closest('.delete-item-btn');
                    if (deleteBtn) {
                        deleteBtn.parentElement.remove();
                    }
                });
            }

            // 保存按钮
            document.getElementById('save-char-edit-btn').addEventListener('click', () => {
                if (isUser) {
                    profileData.name = document.getElementById('user-edit-name').value.trim();
                    profileData.gender = document.getElementById('user-edit-gender').value.trim();
                    profileData.age = document.getElementById('user-edit-age').value.trim();
                    profileData.persona = document.getElementById('user-edit-persona').value.trim();
                    archiveData.user = profileData;
                } else {
                    profileData.name = document.getElementById('char-edit-name').value.trim();
                    // 在创建新角色时，读取并保存好感度初始值
                    if (isNew) {
                         const favorabilityValue = document.getElementById('char-edit-favorability').value;
                         // 如果输入框为空，则保存 null，否则转换为数字
                         profileData.favorability = favorabilityValue.trim() === '' ? null : parseInt(favorabilityValue, 10);
                    }
                    profileData.age = document.getElementById('char-edit-age').value.trim();
                    profileData.persona = document.getElementById('char-edit-persona').value.trim();

                    // 保存阶段性人设
                    profileData.phasedPersonasEnabled = document.getElementById('phased-persona-switch').checked;
                    profileData.phasedPersonas = [];
                    document.querySelectorAll('.phased-persona-item').forEach(item => {
                        const start = item.querySelector('.range-start').value.trim();
                        const end = item.querySelector('.range-end').value.trim();
                        const behavior = item.querySelector('.behavior-input').value.trim();
                        if ((start && end) || behavior) { // 范围或表现至少有一项不为空
                            const range = `${start || 0}-${end || 0}`; // 组合范围
                            profileData.phasedPersonas.push({ range, behavior });
                        }
                    });

                    // 保存开场白
                    profileData.openingLines = [];
                    document.querySelectorAll('.opening-line-input').forEach(input => {
                        const line = input.value.trim();
                        if (line) {
                            profileData.openingLines.push(line);
                        }
                    });

                    if (isNew) {
                        profileData.id = 'char_' + generateId();
                        archiveData.characters.push(profileData);
                    } else {
                        const charIndex = archiveData.characters.findIndex(c => c.id === profileData.id);
                        if (charIndex !== -1) {
                            if (!isNew) {
                            const charToUpdate = archiveData.characters[charIndex];
                            // 更新除好感度外的所有字段
                            charToUpdate.name = profileData.name;
                            charToUpdate.avatar = profileData.avatar;
                            charToUpdate.codename = profileData.codename; // 保持原有逻辑，以防其他地方用到
                            charToUpdate.age = profileData.age;
                            charToUpdate.persona = profileData.persona;
                            charToUpdate.phasedPersonasEnabled = profileData.phasedPersonasEnabled;
                            charToUpdate.phasedPersonas = profileData.phasedPersonas;
                            charToUpdate.openingLines = profileData.openingLines;
                        } else {
                            archiveData.characters.push(profileData);
                        }
                        }
                    }
                }
                
                if (!profileData.name) {
                    showCustomAlert('姓名不能为空！');
                    return;
                }

                saveArchiveData();
                closeArchiveDetailModal();
                renderArchivePage();
            });

            // 删除按钮
            const deleteBtn = document.getElementById('delete-char-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    showCustomConfirm(`确定要删除角色 "${profileData.name}" 吗？此操作不可逆。`, () => {
                        archiveData.characters = archiveData.characters.filter(char => char.id !== profileData.id);
                        saveArchiveData();
                        closeArchiveDetailModal();
                        renderArchivePage();
                    });
                });
            }
        };


        // 打开角色编辑模态框 (已兼容用户档案)
        const openCharEditModal = (profileId) => {
            let profile;
            let isUser = false;
            let isNew = profileId === null;

            if (isNew) { // 新建角色
                modalTitle.textContent = '添加新角色';
                profile = { // 直接创建一个新的临时对象
                    id: '',
                    avatar: DEFAULT_CHAR_AVATAR_SVG,
                    name: '新角色',
                    codename: '', age: '', ability: '', survivalDays: '', persona: ''
                };
                renderCharEditForm(profile, true, false);
                return;
            }

            // [修复] 对于编辑操作，创建数据副本，避免直接修改原始数据
            if (profileId === 'user') {
                profile = { ...archiveData.user }; // 创建用户档案的副本
                isUser = true;
            } else {
                const originalProfile = archiveData.characters.find(c => c.id === profileId);
                if (originalProfile) {
                    profile = { ...originalProfile }; // 创建角色档案的副本
                }
            }

            if (!profile) {
                showCustomAlert('未找到档案信息，请刷新重试。');
                closeArchiveDetailModal();
                return;
            }

            
            modalTitle.textContent = `编辑${isUser ? '用户' : '角色'}：${profile.name}`;
            renderCharEditForm(profile, false, isUser);
        };

        // 打开档案App主界面
        const openArchiveApp = (e) => {
            const clickedElement = e ? e.currentTarget : document.getElementById('app-archive');
            
            // 使用通用模态框打开档案App的主列表
            openModal('档案', '', clickedElement);
            
            // 显示档案悬浮按钮
            archiveFab.classList.add('visible');
            
            renderArchivePage();
        };

        // 关闭档案App主界面 (新增逻辑)
        const closeArchiveApp = () => {
            archiveFab.classList.remove('visible');
            closeModal(); // 使用通用的关闭模态框函数
        };
        
        // 绑定档案App图标点击事件
        document.getElementById('app-archive').addEventListener('click', openArchiveApp);
        
        // --- 核心修改：为档案悬浮按钮添加长按导入功能 ---
        (() => {
            let pressTimer = null;
            let isLongPress = false;
        
            const startPress = (e) => {
                isLongPress = false;
                pressTimer = setTimeout(() => {
                    isLongPress = true;
                    // 触发长按事件
                    e.preventDefault(); // 阻止默认行为，如在移动端弹出菜单
                    document.getElementById('character-card-import-input').click();
                }, 800); // 800毫秒定义为长按
            };

            const cancelPress = () => {
                clearTimeout(pressTimer);
            };
        
            // 桌面端鼠标事件
            archiveFab.addEventListener('mousedown', startPress);
            archiveFab.addEventListener('mouseup', cancelPress);
            archiveFab.addEventListener('mouseleave', cancelPress);

            // 移动端触摸事件
            archiveFab.addEventListener('touchstart', startPress, { passive: false }); // passive: false 允许 preventDefault
            archiveFab.addEventListener('touchend', cancelPress);
            archiveFab.addEventListener('touchmove', cancelPress, { passive: true }); // 滑动时取消长按

        })();

        // ===================================
        // === 11. 档案 App 完整逻辑 结束 ===
        // ===================================
        // ===================================
        // === 12. 消息长按菜单逻辑 (新增) ===
        // ===================================
        // 新增：多选模式状态
        let isInMultiSelectMode = false;
        let selectedMessageIds = new Set();
        let longPressedMessageElement = null; // 新增：存储长按的消息元素
        // 新增：辅助函数，用于查找最新的AI回复轮次
        const findLatestAIRound = (messages, filterFn = (msg) => true) => {
            if (!messages || messages.length === 0) return null;

            // 如果最后一条是用户发的，则不存在最新的AI轮次
            if (messages[messages.length - 1].sender === 'me') {
                return null;
            }

            let endIndex = messages.length - 1;
            let startIndex = endIndex;

            // 从后往前找，直到找到一个不是AI发的消息或者到头
            for (let i = endIndex - 1; i >= 0; i--) {
                // 使用过滤器，并确保是AI消息
                // 在单聊中，AI消息的sender是'them'
                // 在群聊中，AI消息的sender是角色ID（非'me'）
                if (filterFn(messages[i]) && messages[i].sender !== 'me') {
                    startIndex = i;
                } else {
                    break; // 遇到用户消息，停止查找
                }
            }

            const roundMessages = messages.slice(startIndex, endIndex + 1);
            return { startIndex, endIndex, roundMessages };
        };

        let currentQuoteInfo = null; // 新增：存储当前的引用信息 {id, text}

        const messageContextMenu = document.getElementById('message-context-menu');

        const contextMenuButtons = document.getElementById('context-menu-buttons');
        const chatMessagesContainer = document.getElementById('chat-app-content'); // 监听整个聊天内容区

        let longPressTimer = null;
        let pressStartX, pressStartY;

        const showContextMenu = (event) => {
            event.preventDefault();

            const messageId = longPressedMessageElement.dataset.messageId;
            let currentChattingId = null;
            for (const cId in chatAppData.messages) {
                if (chatAppData.messages[cId].find(m => m.id === messageId)) {
                    currentChattingId = cId;
                    break;
                }
            }
            if (!currentChattingId) return;

            const message = chatAppData.messages[currentChattingId].find(m => m.id === messageId);
            if (!message || message.type === 'retracted') return;

            // --- 按钮显隐控制 ---
            const editButton = contextMenuButtons.querySelector('[data-action="edit"]');
            const retractButton = contextMenuButtons.querySelector('[data-action="retract"]');
            const reAnswerButton = contextMenuButtons.querySelector('[data-action="re-answer"]');

            const isUserMessage = message.sender === 'me';
            
            // 需求2：编辑按钮始终显示
            editButton.style.display = 'flex'; 
            
            // 需求(上次的): 撤回按钮只对自己消息显示
            retractButton.style.display = isUserMessage ? 'flex' : 'none'; 
            
            // “重回”只对AI消息显示
            reAnswerButton.style.display = !isUserMessage ? 'flex' : 'none'; 

            const oldAlternatives = document.getElementById('alternative-replies-container');
            if (oldAlternatives) oldAlternatives.remove();
            
            messageContextMenu.classList.add('visible');
            
            const menuWidth = contextMenuButtons.offsetWidth;
            const menuHeight = contextMenuButtons.offsetHeight;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const padding = 10;

            let finalLeft = pressStartX;
            let finalTop = pressStartY;

            if (finalLeft + menuWidth / 2 > windowWidth - padding) finalLeft = windowWidth - padding - menuWidth / 2;
            if (finalLeft - menuWidth / 2 < padding) finalLeft = padding + menuWidth / 2;
            if (finalTop + menuHeight / 2 > windowHeight - padding) finalTop = windowHeight - padding - menuHeight / 2;
            if (finalTop - menuHeight / 2 < padding) finalTop = padding + menuHeight / 2;

            contextMenuButtons.style.left = `${finalLeft}px`;
            contextMenuButtons.style.top = `${finalTop}px`;

            const latestAIRound = findLatestAIRound(chatAppData.messages[currentChattingId]);
            if (latestAIRound) {
                const firstMessageOfRound = chatAppData.messages[currentChattingId][latestAIRound.startIndex];
                if (firstMessageOfRound.alternatives && firstMessageOfRound.alternatives.length > 0) {
                    const alternativesContainer = document.createElement('div');
                    alternativesContainer.id = 'alternative-replies-container';
                    alternativesContainer.innerHTML = firstMessageOfRound.alternatives.map((altRound, index) => {
                        const linesHTML = altRound.map(msg => `<div class="alt-reply-line">${msg.text.replace(/<br>/g, ' ')}</div>`).join('');
                        return `<div class="alternative-reply-card" data-alt-index="${index}">${linesHTML}</div>`;
                    }).join('');
                    messageContextMenu.appendChild(alternativesContainer);
                    
                    const menuRect = contextMenuButtons.getBoundingClientRect();
                    alternativesContainer.style.width = `${menuRect.width}px`;
                    alternativesContainer.style.left = `${menuRect.left}px`;
                    alternativesContainer.style.transform = 'none';

                    const altContainerHeight = alternativesContainer.offsetHeight;
                    const spaceAbove = menuRect.top;
                    if (spaceAbove > altContainerHeight + padding) {
                        alternativesContainer.style.bottom = `${window.innerHeight - menuRect.top + 10}px`;
                    } else {
                        alternativesContainer.style.top = `${menuRect.bottom + 10}px`;
                    }
                }
            }
        };


        const hideContextMenu = () => {
            messageContextMenu.classList.remove('visible');
        };

        const handlePressStart = (e) => {
            // 只在聊天气泡上触发
            const targetBubble = e.target.closest('.chat-bubble');
            if (!targetBubble) return;

            // 新增：记录被长按的消息元素
            longPressedMessageElement = targetBubble.closest('.message-line');

            if (e.type === 'touchstart') {

                pressStartX = e.touches[0].clientX;
                pressStartY = e.touches[0].clientY;
            } else {
                pressStartX = e.clientX;
                pressStartY = e.clientY;
            }

            // 清除之前的计时器
            clearTimeout(longPressTimer);
            
            // 启动长按计时器
            longPressTimer = setTimeout(() => {
                showContextMenu(e);
            }, 500); // 500毫秒算作长按
        };

        const handlePressEndOrMove = () => {
            // 如果手指/鼠标移动或抬起，则取消长按
            clearTimeout(longPressTimer);
        };

        // 绑定事件到聊天内容区域（使用事件委托）
        chatMessagesContainer.addEventListener('mousedown', handlePressStart);
        chatMessagesContainer.addEventListener('touchstart', handlePressStart, { passive: true });

        // 移动或抬起时取消长按
        chatMessagesContainer.addEventListener('mouseup', handlePressEndOrMove);
        chatMessagesContainer.addEventListener('mouseleave', handlePressEndOrMove);
        chatMessagesContainer.addEventListener('touchend', handlePressEndOrMove);
        chatMessagesContainer.addEventListener('touchmove', handlePressEndOrMove, { passive: true });
        

        // 阻止在长按菜单显示时，聊天内容区域的默认右键菜单（对桌面端更友好）
        chatMessagesContainer.addEventListener('contextmenu', (e) => {
            if (messageContextMenu.classList.contains('visible')) {
                e.preventDefault();
            }
        });


        // 点击空白处（遮罩层）关闭菜单
        messageContextMenu.addEventListener('click', (e) => {
            // 如果点击的是遮罩层本身，而不是按钮容器
            if (e.target === messageContextMenu) {
                hideContextMenu();
            }
        });

        // 【修复】将事件监听器绑定到整个菜单遮罩层，以捕获所有点击
        messageContextMenu.addEventListener('click', (e) => {
            const button = e.target.closest('.context-menu-button');
            const alternativeCard = e.target.closest('.alternative-reply-card');

            // 如果点击的是遮罩层背景，而不是任何按钮或卡片，则直接关闭菜单
            if (e.target === messageContextMenu) {
                hideContextMenu();
                return;
            }

            // 如果没有点击到有效目标，也直接返回
            if (!button && !alternativeCard) {
                return;
            }
            
            const messageId = longPressedMessageElement.dataset.messageId;

            let currentChattingId = null;
            for (const cId in chatAppData.messages) {
                if (chatAppData.messages[cId].some(m => m.id === messageId)) {
                    currentChattingId = cId;
                    break;
                }
            }
            if (!currentChattingId) return;

            const messages = chatAppData.messages[currentChattingId];
            const messageIndex = messages.findIndex(m => m.id === messageId);
            const message = messages[messageIndex];
            
            if (button) {
                const action = button.dataset.action;
                if (!message) return;

                if (action === 'copy') {
                    const textToCopy = message.text.replace(/<br\s*\/?>/gi, '\n');
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        showGlobalToast('已复制到剪贴板', { type: 'success', duration: 1500 });
                    }).catch(err => {
                        console.error('复制失败:', err);
                        showGlobalToast('复制失败', { type: 'error', duration: 1500 });
                    });

                } else if (action === 'quote') {
                    currentQuoteInfo = { id: message.id, text: message.text.replace(/<br>/g, '\n') };
                    const previewContainer = document.getElementById('quote-preview-container');
                    document.getElementById('quote-preview-content').textContent = currentQuoteInfo.text;
                    previewContainer.style.display = 'block';
                    document.getElementById('chat-input').focus();
                } else if (action === 're-answer') {
                    // 确保被长按的是AI的消息
                    if (message.sender === 'me') {
                        showCustomAlert('只能对AI的回复使用此功能。');
                        hideContextMenu();
                        return;
                    }

                    // 从当前点击的消息开始，向前和向后查找，确定整个AI回合的范围
                    let startIndex = messageIndex;
                    let endIndex = messageIndex;

                    // 向前查找回合起点
                    for (let i = messageIndex - 1; i >= 0; i--) {
                        // 在单聊中，AI消息的sender是'them'
                        // 在群聊中，AI消息的sender是角色ID（非'me'）
                        if (messages[i].sender !== 'me') {
                            startIndex = i;
                        } else {
                            // 遇到非AI消息，停止查找
                            break; 
                        }
                    }

                    // 向后查找回合终点
                    for (let i = messageIndex + 1; i < messages.length; i++) {
                        // 在单聊中，AI消息的sender是'them'
                        // 在群聊中，AI消息的sender是角色ID（非'me'）
                        if (messages[i].sender !== 'me') {
                            endIndex = i;
                        } else {
                            // 遇到非AI消息，停止查找
                            break;
                        }
                    }
                    
                    const roundMessages = messages.slice(startIndex, endIndex + 1);
                    const reAnswerInfo = { startIndex, endIndex, roundMessages };

                    triggerApiReply(currentChattingId, reAnswerInfo);

                } else if (action === 'select-multiple') {
                    isInMultiSelectMode = true;
                    selectedMessageIds.clear();
                    selectedMessageIds.add(messageId);
                    renderChatRoom(currentChattingId);
                } else if (action === 'retract') {
                    handleRetract(currentChattingId, messageIndex);
                } else if (action === 'edit') {
                    showEditModal(currentChattingId, messageId);
                } else if (action === 'delete') {
                    // 实现删除消息功能
                    const messageIndex = messages.findIndex(m => m.id === messageId);
                    if (messageIndex !== -1) {
                        // 从消息数组中删除该消息
                        messages.splice(messageIndex, 1);
                        // 更新聊天数据
                        chatAppData.messages[currentChattingId] = messages;
                        // 保存数据
                        saveChatData();
                        // 重新渲染聊天室
                        renderChatRoom(currentChattingId);
                        // 显示删除成功提示
                        showGlobalToast('消息已删除', { type: 'success', duration: 1500 });
                    }
                }
                
                hideContextMenu();
            
            } else if (alternativeCard) {
                const altIndex = parseInt(alternativeCard.dataset.altIndex, 10);
                const latestAIRound = findLatestAIRound(messages);
                if (latestAIRound) {
                    const firstMessageOfRound = messages[latestAIRound.startIndex];
                    const selectedAltRound = firstMessageOfRound.alternatives.splice(altIndex, 1)[0];
                    const newAlternatives = [...firstMessageOfRound.alternatives];
                    newAlternatives.push(latestAIRound.roundMessages);
                    selectedAltRound[0].alternatives = newAlternatives; // 将其他备选项和当前轮次附加到被选中的回复上
                    messages.splice(latestAIRound.startIndex, latestAIRound.roundMessages.length, ...selectedAltRound);
                    saveChatData();
                    renderChatRoom(currentChattingId);
                }
                hideContextMenu();
            }
        });

        // === 新增：处理新功能的辅助函数 ===

        // 更新多选工具栏状态
        function updateMultiSelectToolbar() {
            const toolbar = document.getElementById('multi-select-toolbar');
            const title = document.querySelector('.chat-room-view .chat-contact-title');
            const collectBtn = document.getElementById('multi-collect-btn');
            const deleteBtn = document.getElementById('multi-delete-btn');

            if (title) {
                title.textContent = `已选择 ${selectedMessageIds.size} 项`;
            }

            if (selectedMessageIds.size > 0) {
                collectBtn.classList.add('active');
                deleteBtn.classList.add('active');
            } else {
                collectBtn.classList.remove('active');
                deleteBtn.classList.remove('active');
            }
        }

        /**
         * 新增：处理用户撤回消息的函数
         * @param {string} contactId - 当前聊天对象的ID
         * @param {number} messageIndex - 要撤回的消息在数组中的索引
         */
        function handleRetract(contactId, messageIndex) {
            // 确保消息存在
            if (!chatAppData.messages[contactId] || !chatAppData.messages[contactId][messageIndex]) {
                console.error("无法找到要撤回的消息");
                return;
            }

            // 创建一条“已撤回”的系统提示消息
            const retractedMessage = {
                id: 'retracted_' + generateId(), // 生成一个新ID
                type: 'retracted', // 标记为撤回类型
                senderType: 'user', // 标记是用户撤回的
                timestamp: Date.now() // 记录撤回时间
            };

            // 在消息数组中，用“已撤回”消息替换掉原始消息
            chatAppData.messages[contactId].splice(messageIndex, 1, retractedMessage);
            
            // 保存数据
            saveChatData();

            // 关键：立即重新渲染聊天室，让UI更新
            renderChatRoom(contactId);

            // 给用户一个成功的反馈
            showGlobalToast('消息已撤回', { type: 'success', duration: 1500 });
        }


        // ============================================
        // === 核心修复：聊天室内交互的全局事件委托 ===
        // ============================================
        document.addEventListener('DOMContentLoaded', function() {
            const chatContent = document.getElementById('chat-app-content');
            if (!chatContent) return;
        
            chatContent.addEventListener('click', (e) => {
                // 1. 处理“重新进入线下模式”按钮点击
                const reEnterOfflineBtn = e.target.closest('.mode-switch-icon-button[data-action="re-enter-offline"]');
                if (reEnterOfflineBtn) {
                    const contactId = reEnterOfflineBtn.dataset.contactId;
                    const sessionId = reEnterOfflineBtn.dataset.sessionId;
                    if (contactId && sessionId) {
                        openOfflineChat(contactId, sessionId);
                    }
                    return; // 处理完毕，中断后续检查
                }
        
                // 此处可以继续添加其他需要事件委托的聊天室内元素点击逻辑...
        
            });
        });


        // 显示被撤回的内容
        function showRetractedContent(element, event) {
            const popover = document.getElementById('retracted-content-popover');
            const contentEl = document.getElementById('popover-original-content');
            const thoughtEl = document.getElementById('popover-inner-thought');

            contentEl.innerHTML = unescape(element.dataset.content); // unescape data
            thoughtEl.textContent = unescape(element.dataset.thought);

            popover.classList.add('visible');
            
            // 定位
            const rect = element.getBoundingClientRect();
            const popoverHeight = popover.offsetHeight;
            const popoverWidth = popover.offsetWidth;
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;

            let top = rect.top - popoverHeight - 10;
            if (top < 10) {
                top = rect.bottom + 10;
            }

            let left = rect.left + (rect.width / 2) - (popoverWidth / 2);
            if (left < 10) left = 10;
            if (left + popoverWidth > windowWidth - 10) {
                left = windowWidth - popoverWidth - 10;
            }

            popover.style.top = `${top}px`;
            popover.style.left = `${left}px`;
            
            // 点击外部关闭
            const closePopover = (e) => {
                if (!popover.contains(e.target)) {
                    popover.classList.remove('visible');
                    document.removeEventListener('click', closePopover, true);
                }
            };
            // 使用捕获阶段的事件监听器，确保它先于其他点击事件执行
            setTimeout(() => document.addEventListener('click', closePopover, true), 0);
        }

        // 显示编辑消息的模态窗
        function showEditModal(contactId, messageId) {
            const modal = document.getElementById('edit-message-modal');
            const textarea = document.getElementById('edit-message-textarea');
            const confirmBtn = document.getElementById('confirm-edit-btn');
            const cancelBtn = document.getElementById('cancel-edit-btn');

            const allMessages = chatAppData.messages[contactId];
            const message = allMessages.find(m => m.id === messageId);
            if (!message) return;

            // 如果是引用消息，恢复其原始指令格式以方便编辑
            if (message.quote) {
                textarea.value = `[QUOTE: ${message.quote.id} | ${message.text.replace(/<br\s*\/?>/gi, '\n')}]`;
            } else {
                textarea.value = message.text.replace(/<br\s*\/?>/gi, '\n');
            }

            modal.classList.add('visible');
            textarea.focus();

            const close = () => modal.classList.remove('visible');

            // 【核心修改】为确认按钮绑定新的、更智能的事件处理逻辑
            confirmBtn.onclick = () => {
                const rawNewText = textarea.value.trim();

                if (rawNewText) {
                    const quoteMatch = rawNewText.match(/^\[QUOTE:\s*(.*?)\s*\|\s*(.*?)\]/s);

                    if (quoteMatch) {
                        // 用户编辑成了引用格式
                        const quotedMessageId = quoteMatch[1].trim();
                        const replyText = quoteMatch[2].trim();
                        const originalMessage = allMessages.find(m => m.id === quotedMessageId);

                        if (originalMessage) {
                            // 更新当前消息
                            message.text = replyText.replace(/\n/g, '<br>');
                            message.quote = { 
                                id: originalMessage.id, 
                                text: originalMessage.text, 
                                sender: originalMessage.sender 
                            };
                        } else {
                            // 如果找不到引用的消息ID，则当作普通文本处理
                            message.text = rawNewText.replace(/\n/g, '<br>');
                            delete message.quote; // 确保移除旧的引用数据
                            showCustomAlert(`未找到ID为 "${quotedMessageId}" 的消息，已将内容作为普通文本保存。`);
                        }

                    } else {
                        // 用户编辑成了普通文本格式
                        message.text = rawNewText.replace(/\n/g, '<br>');
                        delete message.quote; // 移除可能存在的旧引用数据
                    }
                    
                    
                    saveChatData();
                    renderChatRoom(contactId);
                } else {
                    // 如果编辑后内容为空，可以选择删除该消息或提示用户
                    showCustomAlert("消息内容不能为空！");
                }

                close();
            };

            cancelBtn.onclick = close;
        }

        // === 新增：内心声音悬浮窗逻辑 (已修复) ===
        // 将变量声明移到外部，以便函数可以访问
        let innerVoiceOverlay, favorProgress, favorText, voiceStatus, voiceInner, trueFeelingField, voiceTrueFeeling, innerVoiceAvatarArea, innerVoiceCharName;

        function showInnerVoiceModal(voiceData, contactId) { // [修改] 增加 contactId 参数
            if (!voiceData || !innerVoiceOverlay) return; // 增加安全检查

            // [新增] 根据 contactId 查找角色信息
            const character = archiveData.characters.find(c => c.id === contactId);
            if (character) {
                // [新增] 设置头像和姓名
                innerVoiceAvatarArea.style.backgroundImage = `url('${character.avatar}')`;
                innerVoiceCharName.textContent = character.name;
            } else {
                // [新增] 如果找不到角色（例如系统消息），提供一个后备显示
                innerVoiceAvatarArea.style.backgroundImage = 'none';
                innerVoiceCharName.textContent = '未知角色';
            }

            const currentFavor = parseInt(voiceData.favorability, 10) || 0;

            // 新的好感度进度条逻辑
            let progressWidth = 0;
            if (currentFavor > 0) {
                // 好感度为正时，进度条宽度为好感度数值的百分比
                progressWidth = Math.min(currentFavor, 100); // 确保最大不超过100%
            }
            favorProgress.style.width = `${progressWidth}%`;
            
            // 设置数字并根据正负改变颜色
            favorText.textContent = currentFavor;
            if (currentFavor < 0) {
                favorText.style.color = '#ef4444'; // 负数时显示为红色
            } else {
                favorText.style.color = ''; // 恢复默认颜色
            }
            
            // 新增：如果档案详情页开着，同步更新好感度显示
            const archiveFavorabilitySpan = document.getElementById('archive-detail-favorability');
            if (archiveFavorabilitySpan && archiveFavorabilitySpan.closest('#archive-modal-overlay.visible')) {
                archiveFavorabilitySpan.textContent = currentFavor;
            }
            voiceStatus.textContent = voiceData.status || '...';
            voiceInner.textContent = voiceData.inner || '...';

            if (voiceData.trueFeeling) {
                voiceTrueFeeling.textContent = voiceData.trueFeeling;
                trueFeelingField.style.display = 'flex';
            } else {
                trueFeelingField.style.display = 'none';
            }
            
            innerVoiceOverlay.classList.add('visible');
        }


        // 使用 DOMContentLoaded 确保所有元素加载完毕后再执行
        document.addEventListener('DOMContentLoaded', function() {
            // 在这里初始化所有之前为 null 的元素
            innerVoiceOverlay = document.getElementById('inner-voice-overlay');
            favorProgress = document.getElementById('favor-progress');
            favorText = document.getElementById('favor-text');
            voiceStatus = document.getElementById('voice-status');
            voiceInner = document.getElementById('voice-inner');
            trueFeelingField = document.getElementById('true-feeling-field');
            voiceTrueFeeling = document.getElementById('voice-true-feeling');
            innerVoiceAvatarArea = document.getElementById('inner-voice-avatar-area');
            innerVoiceCharName = document.getElementById('inner-voice-char-name');
            const chatContent = document.getElementById('chat-app-content');

            // 【BUG修复】将 showInnerVoiceModal 函数定义移到这里
            function showInnerVoiceModal(voiceData, contactId) {
                if (!voiceData || !innerVoiceOverlay) return; 

                // 统一通过ID查找角色，这是最可靠的方式
                const character = archiveData.characters.find(c => c.id === contactId);

                if (character) {
                    // 如果找到了角色，则设置其头像和名字
                    innerVoiceAvatarArea.style.backgroundImage = `url('${character.avatar}')`;
                    innerVoiceCharName.textContent = character.name;
                } else {
                    // 如果在档案中找不到（例如系统联系人或已删除的角色），提供一个后备显示
                    innerVoiceAvatarArea.style.backgroundImage = 'none'; // 清空头像
                    innerVoiceCharName.textContent = '未知角色';
                }

                const currentFavor = parseInt(voiceData.favorability, 10) || 0;
                let progressWidth = 0;
                if (currentFavor > 0) {
                    progressWidth = Math.min(currentFavor, 100);
                }
                favorProgress.style.width = `${progressWidth}%`;
                
                favorText.textContent = currentFavor;
                if (currentFavor < 0) {
                    favorText.style.color = '#ef4444';
                } else {
                    favorText.style.color = '';
                }
                
                const archiveFavorabilitySpan = document.getElementById('archive-detail-favorability');
                if (archiveFavorabilitySpan && archiveFavorabilitySpan.closest('#archive-modal-overlay.visible')) {
                    archiveFavorabilitySpan.textContent = currentFavor;
                }
                // 新增：获取用户档案名并创建正则
                const userName = archiveData.user.name || '玩家';
                const userRegex = /\{\{user\}\}/g;

                // 修改：在设置文本前进行正则替换
                voiceStatus.textContent = (voiceData.status || '...').replace(userRegex, userName);
                voiceInner.textContent = (voiceData.inner || '...').replace(userRegex, userName);

                if (voiceData.trueFeeling) {
                    // 修改：同样对“真心话”进行正则替换
                    voiceTrueFeeling.textContent = voiceData.trueFeeling.replace(userRegex, userName);
                    trueFeelingField.style.display = 'flex';
                } else {
                    trueFeelingField.style.display = 'none';
                }
                
                innerVoiceOverlay.classList.add('visible');
            }


            // 绑定内心声音悬浮窗的关闭事件
            innerVoiceOverlay.addEventListener('click', (e) => {
                if (e.target === innerVoiceOverlay) {
                    innerVoiceOverlay.classList.remove('visible');
                }
            });

            // 绑定聊天区域的事件委托 (整合版)
            chatContent.addEventListener('click', (e) => {
                // 优先检查是否点击了可交互元素
                const avatar = e.target.closest('.chat-avatar[data-action="show-inner-voice"]');
                const retractNotice = e.target.closest('[data-action="view-retracted"]');
                const toggleBtn = e.target.closest('[data-action^="toggle-"]');
                const messageLine = e.target.closest('.message-line');

                // 1. 处理点击头像看心声
                if (avatar) {
                    const msgId = messageLine.dataset.messageId;
                    // 【修复】直接从当前打开的聊天室获取上下文，而不是遍历所有聊天记录
                    const currentChatId = document.querySelector('.chat-contact-title')?.dataset.contactId;

                    if (!currentChatId) return; // 安全检查，如果找不到当前聊天ID，则不执行

                    const message = (chatAppData.messages[currentChatId] || []).find(m => m.id === msgId);

                    if (message && message.voiceData) {
                        const mainContact = chatAppData.contacts.find(c => c.id === currentChatId);
                        // 判断是群聊（取消息发送者ID）还是私聊（取当前聊天ID）
                        const characterToDisplayId = (mainContact && mainContact.isGroup) ? message.sender : currentChatId;

                        if (characterToDisplayId) {
                            showInnerVoiceModal(message.voiceData, characterToDisplayId);
                        }
                    }
                    return; // 处理完心声逻辑后，直接返回
                }
                
                // 2. 处理多选模式下的点击
                if (isInMultiSelectMode && messageLine) {
                    const msgId = messageLine.dataset.messageId;
                    if (selectedMessageIds.has(msgId)) {
                        selectedMessageIds.delete(msgId);
                        messageLine.classList.remove('selected');
                    } else {
                        selectedMessageIds.add(msgId);
                        messageLine.classList.add('selected');
                    }
                    updateMultiSelectToolbar();
                    return; // 处理完多选逻辑后，直接返回
                }
                
                // 3. 处理点击查看撤回消息
                if (retractNotice) {
                    showRetractedContent(retractNotice, e);
                    return; // 处理完后直接返回
                }
                
                // 4. 处理点击折叠/展开模式块
                if (toggleBtn) {
                    const contactId = document.querySelector('.chat-contact-title').dataset.contactId;
                    const allMessages = chatAppData.messages[contactId];
                    const clickedMessageId = toggleBtn.closest('.message-line').dataset.messageId;
                    const clickedMessageIndex = allMessages.findIndex(m => m.id === clickedMessageId);
                    if (clickedMessageIndex === -1) return;
                    
                    const clickedMessage = allMessages[clickedMessageIndex];
                    let startIndex = -1, endIndex = -1;

                    if (clickedMessage.mode === 'offline' || clickedMessage.mode === 'video') {
                        startIndex = clickedMessageIndex;
                        const endMode = clickedMessage.mode === 'video' ? 'chat' : 'online';
                        for (let i = startIndex + 1; i < allMessages.length; i++) {
                            if (allMessages[i].type === 'mode_switch' && allMessages[i].mode === endMode) {
                                endIndex = i; break;
                            }
                        }
                    } else if (clickedMessage.mode === 'online' || clickedMessage.mode === 'chat') {
                        endIndex = clickedMessageIndex;
                        const startMode = clickedMessage.mode === 'chat' ? 'video' : 'offline';
                        for (let i = endIndex - 1; i >= 0; i--) {
                            if (allMessages[i].type === 'mode_switch' && allMessages[i].mode === startMode) {
                                startIndex = i; break;
                            }
                        }
                    }

                    if (startIndex !== -1 && endIndex !== -1) {
                        const startMessageObject = allMessages[startIndex];
                        startMessageObject.isFolded = !startMessageObject.isFolded;
                        saveChatData();
                        renderChatRoom(contactId);
                    }
                    return; // 处理完后直接返回
                }

                // 5. 如果以上都不是，则执行关闭工具面板的逻辑
                // 【核心修复】增加判断，如果点击事件源自于聊天底部操作区，则不执行关闭操作
                if (e.target.closest('.chat-footer')) {
                    return;
                }

                const toolPanel = document.getElementById('chat-tool-panel');
                const emojiPanel = document.getElementById('emoji-panel');
                if (toolPanel && toolPanel.classList.contains('visible')) {
                    toolPanel.classList.remove('visible');
                }
                if (emojiPanel && emojiPanel.classList.contains('visible')) {
                    emojiPanel.classList.remove('visible');
                }
            });
        });

        /**
         * 异步设置聊天壁纸，优先使用缓存，并处理平滑过渡。
         * @param {string} newWallpaperUrl 新壁纸的 URL (Data URL 或远程 URL)
         */
        function setChatWallpaper(newWallpaperUrl) {
            const currentWallpaperLayer = document.querySelector('#chat-wallpaper .wallpaper-layer.current');
            let nextWallpaperLayer = document.querySelector('#chat-wallpaper .wallpaper-layer:not(.current)'); // 获取非 current 的那个层

            // 确保找到 nextLayer，如果没有就创建一个
            if (!nextWallpaperLayer) {
                nextWallpaperLayer = document.createElement('div');
                nextWallpaperLayer.classList.add('wallpaper-layer');
                document.getElementById('chat-wallpaper').appendChild(nextWallpaperLayer);
            }

            // 如果当前显示的壁纸就是目标壁纸，则无需切换
            if (currentWallpaperLayer && currentWallpaperLayer.style.backgroundImage === `url("${newWallpaperUrl}")`) {
                currentWallpaperLayer.style.opacity = 1;
                return;
            }

            // 检查缓存
            if (wallpaperCache[newWallpaperUrl]) {
                nextWallpaperLayer.style.backgroundImage = `url("${wallpaperCache[newWallpaperUrl]}")`;
                performWallpaperTransition(currentWallpaperLayer, nextWallpaperLayer);
                return;
            }

            // 预加载新壁纸
            const img = new Image();
            img.src = newWallpaperUrl;
            img.onload = () => {
                const dataUrl = newWallpaperUrl.startsWith('data:image/') ? newWallpaperUrl : img.src; // 如果是Data URL直接用，否则取解码后的URL
                wallpaperCache[newWallpaperUrl] = dataUrl; // 存入缓存
                nextWallpaperLayer.style.backgroundImage = `url("${dataUrl}")`;
                performWallpaperTransition(currentWallpaperLayer, nextWallpaperLayer);
            };
            img.onerror = () => {
                console.error(`Failed to load wallpaper: ${newWallpaperUrl}`);
                // 加载失败，可以设置一个纯色背景作为Fallback，或者不改变
                nextWallpaperLayer.style.backgroundImage = 'none'; // 清除背景图片
                nextWallpaperLayer.style.backgroundColor = 'var(--bg-color-end)'; // 使用默认背景色
                performWallpaperTransition(currentWallpaperLayer, nextWallpaperLayer);
            };

            // 如果当前没有currentLayer，说明是第一次设置或者重置，直接显示nextLayer
            if (!currentWallpaperLayer) {
                nextWallpaperLayer.style.backgroundImage = `url("${newWallpaperUrl}")`;
                nextWallpaperLayer.classList.add('current');
                nextWallpaperLayer.style.opacity = 1;
            }
        }

        /**
         * 执行壁纸的淡入淡出切换动画
         * @param {HTMLElement} oldLayer 旧的壁纸图层
         * @param {HTMLElement} newLayer 新的壁纸图层
         */
        function performWallpaperTransition(oldLayer, newLayer) {
            // 确保旧层不是null，且不等于新层
            if (oldLayer && oldLayer !== newLayer) {
                oldLayer.style.opacity = 0; // 旧层开始淡出
                newLayer.classList.add('current'); // 新层变为 current
                newLayer.style.opacity = 1; // 新层淡入
                
                // 等待过渡动画结束后，将旧层的 current 类移除
                oldLayer.addEventListener('transitionend', function handler() {
                    oldLayer.classList.remove('current');
                    // 确保下次渲染时，这个旧层可以作为 next 层被选中
                    // 并且不会干扰下一次的 nextLayer 查找逻辑
                    oldLayer.removeEventListener('transitionend', handler);
                }, { once: true });
            } else if (!oldLayer) { // 第一次设置壁纸的情况
                 newLayer.classList.add('current');
                 newLayer.style.opacity = 1;
            }
        }

        // ===================================
        // === 14. GitHub 同步功能 (新增) ===
        // ===================================

        /**
         * 显示一个全局的顶部提示框 (Toast)
         * @param {string} message - 显示的消息文本
         * @param {object} [options] - 配置项
         * @param {'info'|'success'|'error'|'confirmation'} [options.type='info'] - 提示框类型
         * @param {number} [options.duration=3000] - 自动关闭的毫秒数 (对 confirmation 无效)
         * @param {function} [options.onConfirm] - 用户点击确认按钮的回调
         */
        function showGlobalToast(message, options = {}) {
            const { type = 'info', duration = 3000, onConfirm, confirmText = '确认', cancelText = '取消' } = options;
            const container = document.getElementById('toast-container');

            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            
            let buttonsHTML = '';
            if (type === 'confirmation') {
                buttonsHTML = `
                    <div class="toast-buttons">
                        <button class="confirm">${confirmText}</button>
                        <button class="cancel">${cancelText}</button>
                    </div>
                `;
            }


            toast.innerHTML = `
                <span>${message}</span>
                ${buttonsHTML}
            `;
            
            container.appendChild(toast);
            
            const removeToast = () => {
                toast.classList.add('hiding');
                toast.addEventListener('animationend', () => toast.remove(), { once: true });
            };

            if (type === 'confirmation') {
                const countdownBar = document.createElement('div');
                countdownBar.className = 'toast-countdown-bar';
                toast.appendChild(countdownBar);

                const confirmBtn = toast.querySelector('.confirm');
                const cancelBtn = toast.querySelector('.cancel');
                
                const timeoutId = setTimeout(removeToast, 5000); // 5秒后自动消失

                confirmBtn.onclick = () => {
                    clearTimeout(timeoutId);
                    if (onConfirm) onConfirm();
                    removeToast();
                };

                cancelBtn.onclick = () => {
                    clearTimeout(timeoutId);
                    removeToast();
                };
            } else {
                setTimeout(removeToast, duration);
            }
        }
        
        // --- GitHub 同步核心逻辑 (模拟) ---

        let isSyncing = false; // 防止重复同步
        
        // === 新增：全局消息提示框逻辑 (已重构为队列系统) ===
        let globalBannerQueue = [];
        let currentChatView = { active: false, contactId: null }; // 新增：用于精确追踪当前聊天视图

        let isBannerShowing = false;

        /**
         * 核心处理函数：处理队列中的下一个 Banner
         */
        function processBannerQueue() {
            // 如果当前有 banner 正在显示，或者队列为空，则不处理
            if (isBannerShowing || globalBannerQueue.length === 0) {
                return;
            }

            isBannerShowing = true;
            playSoundEffect('横幅消息提示.m4a'); // 新增：播放横幅消息音效
            const { contactId, messageText } = globalBannerQueue.shift(); // 取出队列中的第一条消息

            const container = document.getElementById('global-message-banner-container');
            const contact = chatAppData.contacts.find(c => c.id === contactId);
            if (!container || !contact) {
                isBannerShowing = false;
                processBannerQueue(); // 即使出错，也要尝试处理下一条
                return;
            }
            
            const banner = document.createElement('div');
            banner.className = 'global-message-banner';
            const displayName = contact.remark || contact.name;

            banner.innerHTML = `
                <div class="banner-avatar" style="background-image: url('${contact.avatar}')"></div>
                <div class="banner-info">
                    <div class="banner-name">${displayName}</div>
                    <div class="banner-message">${messageText}</div>
                </div>
            `;

            container.appendChild(banner);
            // 强制浏览器重绘以确保入场动画生效
            void banner.offsetWidth; 
            banner.classList.add('showing');
            
            const bannerTimeout = setTimeout(() => {
                banner.classList.remove('showing');
                banner.classList.add('hiding');
                banner.addEventListener('animationend', () => {
                    banner.remove();
                    isBannerShowing = false;
                    processBannerQueue(); // 当前banner消失后，处理队列中的下一条
                }, { once: true });
            }, 2000); // 弹窗持续4秒

            banner.addEventListener('click', () => {
                clearTimeout(bannerTimeout);
                banner.classList.remove('showing');
                banner.classList.add('hiding');
                banner.addEventListener('animationend', () => {
                    banner.remove();
                    isBannerShowing = false;
                    processBannerQueue(); // 即使是点击关闭，也要处理下一条
                }, { once: true });
                
                // 跳转到对应聊天
                if (!chatContainer.classList.contains('visible')) openChatApp();
                renderChatRoom(contactId);
            });
        }
        // ===================================
        // === 15. 表情包功能逻辑 (新增) ===
        // ===================================
        
        let emojiData = [];
        let currentEmojiGroupId = null;

        // 异步加载表情包数据
        async function loadEmojiData() {
            const savedData = await localforage.getItem('emojiData');
            emojiData = JSON.parse(savedData) || [];
            currentEmojiGroupId = emojiData.length > 0 ? emojiData[0].id : null;
        }

        const saveEmojiData = async () => {
            await localforage.setItem('emojiData', JSON.stringify(emojiData));
        };

        // 显示表情包面板
        const showEmojiPanel = () => {
            const toolPanel = document.getElementById('chat-tool-panel');
            const emojiPanel = document.getElementById('emoji-panel');
            if (toolPanel) toolPanel.classList.remove('visible');
            if (emojiPanel) {
                emojiPanel.classList.add('visible');
                renderEmojiPanel();
            }
        };

        // 隐藏表情包面板，返回工具面板
        const hideEmojiPanel = () => {
            const toolPanel = document.getElementById('chat-tool-panel');
            const emojiPanel = document.getElementById('emoji-panel');
            if (emojiPanel) emojiPanel.classList.remove('visible');
            // 【修改】只有在工具面板本来是打开的情况下，返回时才显示它
            // 这个逻辑已经被上面第一处修改覆盖了，但保留这个函数用于返回按钮
            if (toolPanel) toolPanel.classList.add('visible'); 
        };


        // 渲染整个表情包面板（包括网格和分组导航）
        const renderEmojiPanel = () => {
            renderEmojiGrid(currentEmojiGroupId);
            renderEmojiGroupBar();
        };

        // 渲染表情网格 (已修改为列表)
        const renderEmojiGrid = (groupId) => {
            const grid = document.getElementById('emoji-grid');
            grid.innerHTML = '';
            const group = emojiData.find(g => g.id === groupId);
            if (!group || !group.emojis || group.emojis.length === 0) {
                grid.innerHTML = `<span class="empty-text" style="text-align:center; padding: 40px 0;">该分组没有表情包</span>`;
                return;
            }

            group.emojis.forEach(emoji => {
                const item = document.createElement('div');
                item.className = 'emoji-item';
                // 新的HTML结构，包含图片容器和描述
                item.innerHTML = `
                    <div class="emoji-image-wrapper">
                        <img src="${emoji.url}" alt="${emoji.desc}">
                    </div>
                    <span class="emoji-desc">${emoji.desc}</span>
                `;
                // 点击发送表情
                item.addEventListener('click', () => {
                    // 获取当前聊天对象的ID
                    const currentChatRoom = document.querySelector('.chat-room-view');
                    if (!currentChatRoom) return;

                    const titleElement = currentChatRoom.querySelector('.chat-contact-title');
                    // 【核心修复】通过 data-contact-id 获取ID，而不是匹配文本
                    const contactId = titleElement ? titleElement.dataset.contactId : null;
                    if (!contactId) return;

                    const contact = chatAppData.contacts.find(c => c.id === contactId);
                    if (!contact) return;

                    // 创建一条特殊的图片消息，并添加 isSticker 标识
                    const newMessage = {
                        id: generateId(),
                        type: 'image', // 类型保持为 image
                        isSticker: true, // 【新增】这是一个关键标识，用于区分表情包
                        url: emoji.url, // 图片URL
                        text: `[表情: ${emoji.desc}]`, // AI能理解的文本
                        sender: 'me',
                        timestamp: Date.now()
                    };

                    if (!chatAppData.messages[contact.id]) {
                        chatAppData.messages[contact.id] = [];
                    }
                    chatAppData.messages[contact.id].push(newMessage);
                    
                    // 更新联系人列表的最后一条消息
                    const contactToUpdate = chatAppData.contacts.find(c => c.id === contact.id);
                    if(contactToUpdate) {
                        contactToUpdate.lastMessage = "[表情]";
                        contactToUpdate.lastActivityTime = Date.now();
                    }

                    saveChatData();
                    renderChatRoom(contact.id); // 重新渲染聊天室以显示新消息
                    hideEmojiPanel(); // 发送后自动返回输入框
                });
                grid.appendChild(item);
            });
        };


        // 渲染底部表情分组导航
        const renderEmojiGroupBar = () => {
            const bar = document.getElementById('emoji-group-bar');
            bar.innerHTML = '';
            if (emojiData.length === 0) return;

            emojiData.forEach(group => {
                const tab = document.createElement('div');
                tab.className = 'emoji-group-tab';
                if (group.id === currentEmojiGroupId) {
                    tab.classList.add('active');
                }
                // 使用第一个表情作为封面
                const coverUrl = group.emojis && group.emojis.length > 0 ? group.emojis[0].url : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                tab.innerHTML = `<img src="${coverUrl}" alt="${group.name}">`;
                tab.title = group.name;
                
                tab.addEventListener('click', (e) => {
                    e.stopPropagation(); // 【核心修复】阻止事件冒泡，防止关闭面板
                    currentEmojiGroupId = group.id;
                    renderEmojiPanel();
                });
                bar.appendChild(tab);
            });
        };

        // --- 表情包管理悬浮窗逻辑 ---

        const openEmojiManagement = () => {
            const managementOverlay = document.getElementById('emoji-management-modal-overlay');
            renderEmojiManagementModal();
            if (managementOverlay) {
                managementOverlay.classList.add('visible');
            } else {
                console.error("无法找到表情包管理悬浮窗元素: #emoji-management-modal-overlay");
            }
        };

        const closeEmojiManagement = () => {
            const managementOverlay = document.getElementById('emoji-management-modal-overlay');
            if (managementOverlay) {
                managementOverlay.classList.remove('visible');
            }
        };

        // --- 话题功能悬浮窗逻辑 ---

        const openTopicManagement = () => {
            const managementOverlay = document.getElementById('topic-management-modal-overlay');
            if (managementOverlay) {
                managementOverlay.classList.add('visible');
            } else {
                console.error("无法找到话题管理悬浮窗元素: #topic-management-modal-overlay");
            }
        };

        const closeTopicManagement = () => {
            const managementOverlay = document.getElementById('topic-management-modal-overlay');
            if (managementOverlay) {
                managementOverlay.classList.remove('visible');
            }
        };

        // 渲染管理悬浮窗内容
        const renderEmojiManagementModal = () => {
            const listContainer = document.getElementById('emoji-group-list');
            listContainer.innerHTML = '';
            if (emojiData.length === 0) {
                listContainer.innerHTML = `<span class="empty-text" style="text-align:center; display:block;">暂无分组</span>`;
                return;
            }

            emojiData.forEach(group => {
                const details = document.createElement('details');
                const summary = document.createElement('summary');
                summary.textContent = group.name;
                details.appendChild(summary);

                const content = document.createElement('div');
                content.className = 'emoji-group-content';
                const grid = document.createElement('div');
                grid.className = 'group-emoji-grid';
                
                if (group.emojis && group.emojis.length > 0) {
                    group.emojis.forEach(emoji => {
                        const item = document.createElement('div');
                        item.className = 'group-emoji-item';
                        item.innerHTML = `
                            <img src="${emoji.url}" alt="${emoji.desc}" title="双击删除">
                            <span>${emoji.desc}</span>
                        `;
                        item.querySelector('img').addEventListener('dblclick', () => {
                            if (confirm(`确定要删除表情 "${emoji.desc}" 吗？`)) {
                                group.emojis = group.emojis.filter(e => e.id !== emoji.id);
                                saveEmojiData();
                                renderEmojiManagementModal(); // 重新渲染以反映删除
                            }
                        });
                        grid.appendChild(item);
                    });
                } else {
                    grid.innerHTML = `<span class="empty-text">此分组为空</span>`;
                }
                
                content.appendChild(grid);
                details.appendChild(content);
                listContainer.appendChild(details);
            });
        };

        document.addEventListener('DOMContentLoaded', function() {
            // 保存新分组
            const saveGroupBtn = document.getElementById('save-emoji-group-btn');
            if (saveGroupBtn) {
                saveGroupBtn.addEventListener('click', () => {
                    const groupNameInput = document.getElementById('new-group-name');
                    const urlsInput = document.getElementById('bulk-add-urls');
                    const groupName = groupNameInput.value.trim();
                    const urlsText = urlsInput.value.trim();

                    if (!groupName) {
                        alert('分组名不能为空！');
                        return;
                    }
                    if (!urlsText) {
                        alert('请填写表情包链接！');
                        return;
                    }

                    const newEmojis = [];
                    const lines = urlsText.split('\n');
                    lines.forEach(line => {
                        line = line.trim();
                        if (!line) return;

                        let parts = line.split(/[:：]/);
                        let desc, url;
                        if (parts.length > 1) {
                            desc = parts[0].trim();
                            url = parts.slice(1).join(':').trim();
                        } else {
                            parts = line.split(/\s+/);
                            if (parts.length > 1) {
                                desc = parts[0].trim();
                                url = parts.slice(1).join(' ').trim();
                            } else {
                                desc = "emoji";
                                url = parts[0].trim();
                            }
                        }

                        if (url) {
                            newEmojis.push({
                                id: 'emoji_' + generateId(),
                                desc: desc,
                                url: url
                            });
                        }
                    });

                    if (newEmojis.length === 0) {
                        alert("未能解析出任何有效的表情包链接。");
                        return;
                    }

                    const newGroup = {
                        id: 'group_' + generateId(),
                        name: groupName,
                        emojis: newEmojis
                    };

                    emojiData.unshift(newGroup);
                    saveEmojiData();

                    groupNameInput.value = '';
                    urlsInput.value = '';

                    renderEmojiManagementModal();
                    // 如果聊天室是打开的，刷新主面板
                    if (document.getElementById('emoji-panel')) {
                        renderEmojiPanel();
                    }
                });
            }

            // 绑定管理面板的关闭按钮
            const closeManagementBtn = document.getElementById('close-emoji-management-btn');
            if (closeManagementBtn) {
                closeManagementBtn.addEventListener('click', closeEmojiManagement);
            }

            // 绑定话题管理面板的关闭按钮
            const closeTopicBtn = document.getElementById('close-topic-management-btn');
            if (closeTopicBtn) {
                closeTopicBtn.addEventListener('click', closeTopicManagement);
            }

            // 绑定话题设置保存按钮
            const saveTopicBtn = document.getElementById('save-topic-settings-btn');
            if (saveTopicBtn) {
                saveTopicBtn.addEventListener('click', () => {
                    // 保存话题设置的逻辑
                    const apiPreset = document.getElementById('topic-api-preset-select').value;
                    const autoInit = document.getElementById('topic-auto-init-switch').checked;
                    const frequency = document.getElementById('topic-frequency-select').value;
                    
                    // 这里可以添加保存设置的逻辑，例如保存到localStorage
                    console.log('保存话题设置:', { apiPreset, autoInit, frequency });
                    
                    // 显示保存成功提示
                    showGlobalToast('话题设置已保存', { type: 'success' });
                    
                    // 关闭话题管理面板
                    closeTopicManagement();
                });
            }

            // 实现AI主动发起话题开关与频率选择的联动效果
            const autoInitSwitch = document.getElementById('topic-auto-init-switch');
            const frequencySection = document.getElementById('topic-frequency-section');
            if (autoInitSwitch && frequencySection) {
                autoInitSwitch.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        frequencySection.style.display = 'block';
                    } else {
                        frequencySection.style.display = 'none';
                    }
                });
            }
        });

        // ===================================
        // === 15. 图库功能逻辑 (新增 & 修改) ===
        // ===================================

        let galleryData = [];
        let galleryManagementContactId = null; // 新增：记录当前管理的聊天ID

        // 异步加载图库数据
        async function loadGalleryData() {
            const savedData = await localforage.getItem('galleryData');
            galleryData = JSON.parse(savedData) || [];
        };

        const saveGalleryData = async () => {
            await localforage.setItem('galleryData', JSON.stringify(galleryData));
        };

        // 打开图库管理模态框 (新增 contactId 参数)
        function openGalleryManagement(contactId) {
            const overlay = document.getElementById('gallery-management-overlay');
            if (overlay) {
                galleryManagementContactId = contactId; // 保存当前聊天ID
                renderGalleryManagement(contactId);
                
                // 控制“当前聊天”选项的可用性
                const chatScopeRadio = overlay.querySelector('#scope-chat');
                const chatScopeLabel = overlay.querySelector('label[for="scope-chat"]');
                const globalScopeRadio = overlay.querySelector('#scope-global');
                if (contactId) {
                    chatScopeRadio.disabled = false;
                    chatScopeLabel.style.opacity = 1;
                    chatScopeLabel.style.cursor = 'pointer';
                } else {
                    chatScopeRadio.disabled = true;
                    chatScopeRadio.checked = false;
                    globalScopeRadio.checked = true; // 强制设为全局
                    chatScopeLabel.style.opacity = 0.5;
                    chatScopeLabel.style.cursor = 'not-allowed';
                }

                overlay.classList.add('visible');
            }
        }

        // 关闭图库管理模态框
        function closeGalleryManagement() {
            const overlay = document.getElementById('gallery-management-overlay');
            if (overlay) {
                overlay.classList.remove('visible');
                galleryManagementContactId = null; // 清空ID
            }
        }

        // 渲染图库管理界面 (新增 contactId 参数)
        function renderGalleryManagement(contactId) {
            const gridContainer = document.getElementById('gallery-grid-container');
            if (!gridContainer) return;

            // 根据 contactId 过滤要显示的图片
            const filteredData = galleryData.filter(item => 
                item.scope === 'global' || (item.scope === 'chat' && item.contactId === contactId)
            );

            gridContainer.innerHTML = '';
            if (filteredData.length === 0) {
                gridContainer.innerHTML = `<span class="empty-text">图库为空，请在上方添加新图片。</span>`;
                return;
            }

            filteredData.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'gallery-item';
                itemEl.innerHTML = `
                    <img src="${item.url}" class="gallery-item-image" alt="${item.name}">
                    <div class="gallery-item-name">${item.name}</div>
                    <button class="gallery-delete-btn" data-id="${item.id}" title="删除">&times;</button>
                `;
                gridContainer.appendChild(itemEl);
            });
        }

        // 为图库管理界面绑定事件 (使用事件委托)
        document.addEventListener('DOMContentLoaded', () => {
            const galleryOverlay = document.getElementById('gallery-management-overlay');
            if (!galleryOverlay) return;

            // 关闭按钮
            galleryOverlay.querySelector('#close-gallery-management').addEventListener('click', closeGalleryManagement);

            // 上传本地按钮
            galleryOverlay.querySelector('#gallery-upload-btn').addEventListener('click', () => {
                galleryOverlay.querySelector('#gallery-upload-input').click();
            });

            // 本地文件选择后
            galleryOverlay.querySelector('#gallery-upload-input').addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    compressImage(file).then(dataUrl => {
                        galleryOverlay.querySelector('#gallery-image-url').value = dataUrl;
                        showGlobalToast('图片已成功读取并转换为链接', { type: 'success' });
                    }).catch(err => {
                        showCustomAlert('图片处理失败: ' + err.message);
                    });
                }
                e.target.value = ''; // 重置以便再次选择相同文件
            });

            // 添加到图库按钮
            galleryOverlay.querySelector('#add-gallery-image-btn').addEventListener('click', () => {
                const nameInput = galleryOverlay.querySelector('#gallery-image-name');
                const urlInput = galleryOverlay.querySelector('#gallery-image-url');
                const scope = galleryOverlay.querySelector('input[name="gallery-scope"]:checked').value;
                const name = nameInput.value.trim();
                const url = urlInput.value.trim();

                if (!name || !url) {
                    showCustomAlert('图片名称和链接/上传文件都不能为空！');
                    return;
                }

                // 检查名称是否在相同的范围内重复
                const isDuplicate = galleryData.some(item => 
                    item.name === name && (item.scope === 'global' || item.contactId === galleryManagementContactId)
                );

                if (isDuplicate) {
                    showCustomAlert(`错误：图片名称 "${name}" 在全局或当前聊天中已存在，请使用其他名称。`);
                    return;
                }

                galleryData.unshift({
                    id: 'gallery_' + generateId(),
                    name: name,
                    url: url,
                    scope: scope, // 新增：保存范围
                    contactId: scope === 'chat' ? galleryManagementContactId : null // 新增：保存聊天ID
                });
                saveGalleryData();
                renderGalleryManagement(galleryManagementContactId); // 重新渲染列表

                // 清空输入框
                nameInput.value = '';
                urlInput.value = '';
                showGlobalToast('图片已成功添加到图库！', { type: 'success' });
            });

            // 删除图片按钮 (事件委托)
            galleryOverlay.querySelector('#gallery-grid-container').addEventListener('click', (e) => {
                const deleteBtn = e.target.closest('.gallery-delete-btn');
                if (deleteBtn) {
                    const idToDelete = deleteBtn.dataset.id;
                    showCustomConfirm('确定要删除这张图片吗？', () => {
                        galleryData = galleryData.filter(item => item.id !== idToDelete);
                        saveGalleryData();
                        renderGalleryManagement(galleryManagementContactId); // 使用当前上下文ID重新渲染
                        showGlobalToast('图片已删除。', { type: 'info' });
                    });
                }
            });
        });

        // ===================================
        // === 16. 聊天工具栏新功能核心逻辑 (已修正) ===
        // ===================================
        document.addEventListener('DOMContentLoaded', function() {
            // --- 通用悬浮窗控制 ---
            const imagePreviewOverlay = document.getElementById('image-preview-overlay');
            const voiceInputOverlay = document.getElementById('voice-input-overlay');
            const apiSwitchOverlay = document.getElementById('api-switch-overlay');

            function openPopup(overlay) {
                overlay.classList.add('visible');
            }
            function closePopup(overlay) {
                overlay.classList.remove('visible');
            }

            // --- 功能1: 图片上传 ---
            const imageUploadInput = document.getElementById('image-upload-input');
            const imagePreviewImg = document.getElementById('image-preview-img');
            const imageDescInput = document.getElementById('image-description-input');
            let currentImageFile = null;
            let imageContactId = null;

            window.handleImageToolClick = function(contactId) {
                imageContactId = contactId;
                imageUploadInput.click();
            }

            imageUploadInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    compressImage(file).then(compressedDataUrl => {
                        imagePreviewImg.src = compressedDataUrl;
                        currentImageFile = compressedDataUrl; // 保存为压缩后的 Data URL
                        openPopup(imagePreviewOverlay);
                    }).catch(error => {
                        console.error("聊天图片压缩失败:", error);
                        showCustomAlert("图片压缩失败，请换张图片或稍后再试。");
                    });
                }
                e.target.value = ''; // 重置输入框，以便能再次选择相同文件
            });

            document.getElementById('cancel-image-send').addEventListener('click', () => {
                closePopup(imagePreviewOverlay);
                imageDescInput.value = '';
                currentImageFile = null;
            });

            document.getElementById('confirm-image-send').addEventListener('click', () => {
                if (!currentImageFile || !imageContactId) return;

                const description = imageDescInput.value.trim();
                const newMessage = {
                    id: generateId(),
                    type: 'image',
                    url: currentImageFile,
                    text: description, // AI会读取这个描述，即使为空也传过去
                    sender: 'me',
                    timestamp: Date.now()
                };

                chatAppData.messages[imageContactId].push(newMessage);
                const contactToUpdate = chatAppData.contacts.find(c => c.id === imageContactId);
                contactToUpdate.lastMessage = '[图片]';
                contactToUpdate.lastActivityTime = Date.now();
                
                saveChatData();
                renderChatRoom(imageContactId);

                console.log("图片已发送，请在API调用处实现识图功能。");

                closePopup(imagePreviewOverlay);
                imageDescInput.value = '';
                currentImageFile = null;
            });

            // --- 功能2: 模拟语音 ---
            const voiceTextInput = document.getElementById('voice-text-input');
            let voiceContactId = null;

            window.handleVoiceToolClick = function(contactId) {
                voiceContactId = contactId;
                openPopup(voiceInputOverlay);
            }

            document.getElementById('cancel-voice-send').addEventListener('click', () => {
                closePopup(voiceInputOverlay);
                voiceTextInput.value = '';
            });
            
            document.getElementById('confirm-voice-send').addEventListener('click', () => {
                const text = voiceTextInput.value.trim();
                if (!text || !voiceContactId) return;

                const duration = Math.max(1, Math.round(text.length / 4)); // 模拟时长
                const newMessage = {
                    id: generateId(),
                    type: 'voice',
                    text: text, // 语音的文字内容
                    duration: `${duration}″`, // 语音时长
                    sender: 'me',
                    timestamp: Date.now()
                };
                
                chatAppData.messages[voiceContactId].push(newMessage);
                const contactToUpdate = chatAppData.contacts.find(c => c.id === voiceContactId);
                contactToUpdate.lastMessage = '[语音]';
                contactToUpdate.lastActivityTime = Date.now();

                saveChatData();
                renderChatRoom(voiceContactId);

                closePopup(voiceInputOverlay);
                voiceTextInput.value = '';
            });

            // 语音条点击展开/收起文字 (使用事件委托)
            // chatContent 是在另一个 DOMContentLoaded 事件中定义的，这里需要重新获取
            const chatAppContentForVoice = document.getElementById('chat-app-content');
            chatAppContentForVoice.addEventListener('click', (e) => {
                // 处理语音条点击
                const voiceBar = e.target.closest('.message-voice-bar[data-action="toggle-voice-text"]');
                if (voiceBar) {
                    const msgId = voiceBar.dataset.messageId;
                    const description = voiceBar.nextElementSibling;

                    const allMessages = Object.values(chatAppData.messages).flat();
                    const message = allMessages.find(m => m.id === msgId);
                    
                    // 【核心修改】找到了消息并且有可播放的 audioDataUrl
                    if (message && message.audioDataUrl) {
                        // 如果当前点击的语音正在播放，则暂停
                        if (!globalAudioPlayer.paused && globalAudioPlayer.dataset.playingMessageId === msgId) {
                            globalAudioPlayer.pause();
                            voiceBar.classList.remove('playing');
                        } else {
                            // 停止任何可能正在播放的其他语音
                            if (!globalAudioPlayer.paused) {
                                globalAudioPlayer.pause(); // 这会触发'pause'事件，清除旧的动画
                            }
                            
                            // 播放新的语音
                            globalAudioPlayer.audioType = 'voice_message'; // 【核心修改】为播放器打上“语音消息”标识
                            globalAudioPlayer.src = message.audioDataUrl;
                            globalAudioPlayer.dataset.playingMessageId = msgId; // 记录当前播放的ID
                            globalAudioPlayer.play().catch(err => console.error("音频播放失败:", err));

                            
                            // 更新UI
                            document.querySelectorAll('.message-voice-bar.playing').forEach(bar => bar.classList.remove('playing'));
                            voiceBar.classList.add('playing');
                        }
                    }
                    
                    // 切换文本描述的显示
                    if (description && description.classList.contains('voice-text-description')) {
                        const isVisible = description.style.display === 'block';
                        description.style.display = isVisible ? 'none' : 'block';
                    }

                    return;
                }


                // 【需求3新增】处理模式切换消息的点击折叠/展开
                const toggleBtn = e.target.closest('[data-action="toggle-offline-block"]');
                if (toggleBtn) {
                    if (isInMultiSelectMode) {
                        return; // 多选模式下不执行折叠/展开
                    }
                    
                    const contactId = document.querySelector('.chat-contact-title').dataset.contactId;
                    const allMessages = chatAppData.messages[contactId];
                    const clickedMessageId = toggleBtn.closest('.message-line').dataset.messageId;
                    const clickedMessageIndex = allMessages.findIndex(m => m.id === clickedMessageId);
                    const clickedMessage = allMessages[clickedMessageIndex];

                    let startIndex = -1, endIndex = -1;

                    // 需求1：无论点击哪个标记，都能找到完整的块
                    if (clickedMessage.mode === 'offline') { // 点击了“进入线下模式”
                        startIndex = clickedMessageIndex;
                        for (let i = startIndex + 1; i < allMessages.length; i++) {
                            if (allMessages[i].type === 'mode_switch') {
                                endIndex = i;
                                break;
                            }
                        }
                    } else if (clickedMessage.mode === 'online') { // 点击了“退出线下模式”
                        endIndex = clickedMessageIndex;
                        for (let i = endIndex - 1; i >= 0; i--) {
                            if (allMessages[i].type === 'mode_switch') {
                                startIndex = i;
                                break;
                            }
                        }
                    }
                    
                    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex + 1) {
                        showCustomAlert("此模式切换之间没有对话内容，无法折叠。");
                        return;
                    }
                    
                    const startMessageObject = allMessages[startIndex];

                    // 需求2 & 3: 切换状态并重新渲染，而不是手动操作DOM
                    // 切换折叠状态
                    startMessageObject.isFolded = !startMessageObject.isFolded;
                    saveChatData(); // 保存新的状态
                    renderChatRoom(contactId); // 重新渲染，新的渲染逻辑会根据 isFolded 正确显示
                }
            });

            // --- 功能3: API 切换 ---
            let apiSwitchContactId = null;

            window.handleApiSwitchToolClick = async function(contactId) {
                // 每次调用函数时都重新获取最新的DOM元素
                const apiPresetList = document.getElementById('api-preset-list');
                const apiSwitchOverlay = document.getElementById('api-switch-overlay');
                apiSwitchContactId = contactId;
                const presets = JSON.parse(await localforage.getItem('apiPresets')) || {};
                const currentContactSettings = chatAppData.contactApiSettings[contactId] || JSON.parse(await localforage.getItem('apiSettings')) || {};
                
                apiPresetList.innerHTML = '';
                if (Object.keys(presets).length === 0) {
                    apiPresetList.innerHTML = `<span class="empty-text" style="padding: 20px; text-align: center;">无可用预设，请先在API设置中保存。</span>`;
                    openPopup(apiSwitchOverlay);
                    return;
                }


                for (const name in presets) {
                    const preset = presets[name];
                    const item = document.createElement('div');
                    item.className = 'api-preset-item';
                    item.dataset.presetName = name;
                    
                    // 检查此预设是否为当前对话的设定
                    const isCurrentlySelected = JSON.stringify(preset) === JSON.stringify(currentContactSettings);
                    if (isCurrentlySelected) {
                        item.classList.add('selected');
                    }

                    item.innerHTML = `
                        <span>${name}</span>
                        <div class="api-preset-details">
                            <div class="model-selection-group">
                                <select class="modal-select api-model-select">
                                    ${preset.model ? `<option value="${preset.model}">${preset.model}</option>` : ''}
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

            // 使用克隆节点法来安全地绑定事件
            const newApiPresetList = apiPresetList.cloneNode(true);
            apiPresetList.parentNode.replaceChild(newApiPresetList, apiPresetList);

            newApiPresetList.addEventListener('click', async (e) => {
                const presetItem = e.target.closest('.api-preset-item');
                if (!presetItem) return;

                const presetName = presetItem.dataset.presetName;
                const presetData = presets[presetName];

                // 点击“拉取”按钮
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
                    return; // 处理完后直接返回
                }
                
                // 点击“应用此预设”按钮
                if (e.target.classList.contains('apply-preset-btn')) {
                    e.stopPropagation(); // 阻止展开/收起
                    const modelSelect = presetItem.querySelector('.api-model-select');
                    const selectedModel = modelSelect.value;
                    
                    // 1. 更新主预设列表中的模型
                    presets[presetName].model = selectedModel;
                    localStorage.setItem('apiPresets', JSON.stringify(presets));

                    // 2. 将这个完整的预设应用到当前聊天
                    chatAppData.contactApiSettings[contactId] = presets[presetName];
                    saveChatData();
                    
                    // 3. 关闭弹窗并提示
                    apiSwitchOverlay.classList.remove('visible');
                    showGlobalToast(`已为当前对话切换到预设: ${presetName}`, { type: 'success' });
                    return;
                }

                // 【核心修复】点击预设项本身，展开/收起
                // 只有当点击的目标不是详情区域内时，才执行折叠/展开操作
                if (!e.target.closest('.api-preset-details')) {
                    if (presetItem.classList.contains('expanded')) {
                        presetItem.classList.remove('expanded');
                    } else {
                        // 关闭其他所有已展开的项
                        newApiPresetList.querySelectorAll('.api-preset-item.expanded').forEach(p => p.classList.remove('expanded'));
                        presetItem.classList.add('expanded');
                    }
                }
                // 如果点击的是详情区域内的元素（如下拉框、按钮等），则不执行任何操作，让元素的默认行为或特定事件监听器生效。
            });


                openPopup(apiSwitchOverlay);
            }

            
            async function reconnectApi(preset, button) {
                if (!preset.url || !preset.key) {
                    showGlobalToast('预设缺少 URL 或 Key，无法连接。', {type: 'error'});
                    return;
                }
                button.textContent = '连接中...';
                button.disabled = true;

                try {
                    const response = await fetch(new URL('/v1/models', preset.url).href, {
                        headers: { 'Authorization': `Bearer ${preset.key}` }
                    });
                    if (!response.ok) throw new Error(`API错误: ${response.status}`);
                    const data = await response.json();
                    
                    showGlobalToast(`连接成功，拉取到 ${data.data.length} 个模型！`, {type: 'success'});
                } catch (error) {
                    console.error('API重连失败:', error);
                    showGlobalToast(`API 连接失败: ${error.message}`, {type: 'error'});
                } finally {
                    button.textContent = '重连';
                    button.disabled = false;
                }
            }

            document.getElementById('close-api-switch').addEventListener('click', () => {
                closePopup(apiSwitchOverlay);
            });
        });

        // ===================================
        // === 17. 线下模式核心功能逻辑 (新增) ===
        // ===================================
/**
 * 新增：打开并初始化线下聊天界面
 * @param {string} contactId 
 */
/**
 * 新增：显示线下模式的退出确认弹窗
 * @param {string} contactId 
 */
function showOfflineExitConfirm(contactId, sessionId) {
    const overlay = document.getElementById('offline-exit-confirm-overlay');
    const tempBtn = document.getElementById('offline-exit-temp-btn');
    const exitBtn = document.getElementById('offline-exit-confirm-btn');
    const cancelBtn = document.getElementById('offline-exit-cancel-btn');
    const offlineContainer = document.getElementById('offline-chat-container');

    const close = () => overlay.classList.remove('visible');

    // 使用克隆节点法，确保事件只绑定一次
    const newTempBtn = tempBtn.cloneNode(true);
    tempBtn.parentNode.replaceChild(newTempBtn, tempBtn);
    newTempBtn.onclick = () => {
        // “暂时离开”：只隐藏线下界面，不改变任何状态
        offlineContainer.classList.remove('visible');
        close();
    };

    const newExitBtn = exitBtn.cloneNode(true);
    exitBtn.parentNode.replaceChild(newExitBtn, exitBtn);
    newExitBtn.onclick = () => {
        // “退出线下模式”：找到对应的会话消息，更新其状态
        const contact = chatAppData.contacts.find(c => c.id === contactId);
        const sessionMessage = chatAppData.messages[contactId]?.find(m => m.id === sessionId);

        if (contact && sessionMessage) {
            sessionMessage.sessionState = 'ended'; // 关键：将会话状态标记为结束

            const exitNoticeMessage = {
                id: 'mode_switch_' + generateId(),
                type: 'mode_switch',
                text: '已退出线下模式',
                mode: 'online',
                timestamp: Date.now()
            };
            chatAppData.messages[contactId].push(exitNoticeMessage);

            // 检查是否还有其他活跃的线下会话
            const hasOtherActiveSessions = chatAppData.messages[contactId].some(
                m => m.type === 'mode_switch' && m.mode === 'offline' && m.sessionState === 'active'
            );
            contact.offlineMode = hasOtherActiveSessions; // 只有当所有会话都结束后，才将总状态设为false

            saveChatData();
            renderChatRoom(contact.id); // 刷新主聊天室
        }
        offlineContainer.classList.remove('visible');
        close();
        showGlobalToast("已退出线下模式", { type: 'success' });
    };

    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    newCancelBtn.onclick = close;

    overlay.onclick = (e) => {
        if (e.target === overlay) close();
    };

    overlay.classList.add('visible');
}

async function openOfflineChat(contactId, sessionId) {
    const sessionMessage = chatAppData.messages[contactId]?.find(m => m.id === sessionId);
    if (!sessionMessage) {
        showCustomAlert("错误：找不到对应的线下会话。");
        return;
    }

    // 根据会话消息的状态决定是否为只读
    const isReadOnly = sessionMessage.sessionState === 'ended';

    const offlineContainer = document.getElementById('offline-chat-container');
    const offlineMessagesContainer = document.getElementById('offline-chat-messages');
    const offlineFooter = document.getElementById('offline-chat-footer');
    const mainChatFooter = document.querySelector('.chat-room-view .chat-footer');
    const offlineBackButton = document.getElementById('offline-chat-back-btn');

    if (!offlineContainer || !mainChatFooter || !offlineBackButton) {
        console.error("无法找到线下聊天界面或其关键元素的元素。");
        return;
    }
    
    // 条件返回按钮逻辑
    const newOfflineBackButton = offlineBackButton.cloneNode(true);
    offlineBackButton.parentNode.replaceChild(newOfflineBackButton, offlineBackButton);
    newOfflineBackButton.addEventListener('click', () => {
        if (isReadOnly) {
            offlineContainer.classList.remove('visible');
        } else {
            showOfflineExitConfirm(contactId, sessionId); // 传递 sessionId
        }
    });
    
    // 初始化该会话的消息存储
    if (!chatAppData.offlineMessages[sessionId]) {
        chatAppData.offlineMessages[sessionId] = [];
    }

    // 辅助函数：渲染UI
    const renderOfflineMessagesUI = async () => {
        offlineMessagesContainer.innerHTML = ''; 
        const messagesToRender = chatAppData.offlineMessages[sessionId]; // 从会话ID读取消息
        
        const userAvatarUrl = await localforage.getItem('userProfileAvatar') || DEFAULT_USER_AVATAR_SVG;
        const charAvatarUrl = (chatAppData.contacts.find(c => c.id === contactId) || {}).avatar || DEFAULT_CHAR_AVATAR_SVG;
        
        let messagesHTML = '';
        for (const msg of messagesToRender) {
            const isSentByMe = msg.sender === 'me';
            const avatar = isSentByMe ? userAvatarUrl : charAvatarUrl;
            messagesHTML += `
                <div class="message-line ${isSentByMe ? 'sent' : 'received'}" data-message-id="${msg.id}">
                    <div class="chat-avatar" style="background-image: url('${avatar}')"></div>
                    <div class="chat-bubble ${isSentByMe ? 'sent' : 'received'}">${msg.text.replace(/\n/g, '<br>')}</div>
                </div>
            `;
        }
        offlineMessagesContainer.innerHTML = messagesHTML;
        if(messagesToRender.length > 0) {
            offlineMessagesContainer.scrollTop = offlineMessagesContainer.scrollHeight;
        }
    };
    
    await renderOfflineMessagesUI();

    if (isReadOnly) {
        offlineFooter.innerHTML = '';
        offlineFooter.style.display = 'none';
    } else {
        offlineFooter.style.display = 'flex';
        offlineFooter.innerHTML = mainChatFooter.innerHTML;
        const newSendBtn = offlineFooter.querySelector('#send-btn');
        const newApiBtn = offlineFooter.querySelector('#api-reply-btn');
        const newToolBtn = offlineFooter.querySelector('#chat-tool-toggle-btn');
        const newInput = offlineFooter.querySelector('#chat-input');
        
        if (newSendBtn && newInput) {
            const sendOfflineMessage = async () => {
                const text = newInput.value.trim();
                if (text) {
                    const newMessage = { id: generateId(), text: text, sender: 'me', timestamp: Date.now() };
                    chatAppData.offlineMessages[sessionId].push(newMessage); // 存入会话专属数组
                    await saveChatData();
                    newInput.value = '';
                    newInput.focus();
                    await renderOfflineMessagesUI();
                }
            };
            newSendBtn.onclick = sendOfflineMessage;
            newInput.onkeydown = (e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendOfflineMessage(); }
            };
        }

        if (newApiBtn) {
            newApiBtn.onclick = async () => {
                if (isApiReplying) return;
                const loadingBubble = document.createElement('div');
                loadingBubble.className = 'message-line received new-message-animate';
                loadingBubble.id = 'offline-loading-bubble';
                loadingBubble.innerHTML = `<div class="chat-avatar" style="background-image: url('${(chatAppData.contacts.find(c => c.id === contactId) || {}).avatar || DEFAULT_CHAR_AVATAR_SVG}')"></div><div class="chat-bubble received"><div class="loading-dots"><span></span><span></span><span></span></div></div>`;
                offlineMessagesContainer.appendChild(loadingBubble);
                offlineMessagesContainer.scrollTop = offlineMessagesContainer.scrollHeight;
                window.isOfflineReplyRound = true; 
                await triggerApiReply(contactId);
                window.isOfflineReplyRound = false; 
                await renderOfflineMessagesUI(); 
            };
        }
        
        if (newToolBtn) {
            newToolBtn.onclick = (e) => { e.stopPropagation(); openOfflineSettingsPopup(contactId); };
        }

        // === 新增：为线下消息容器绑定长按事件，复用线上逻辑 ===
        offlineMessagesContainer.addEventListener('mousedown', handlePressStart);
        offlineMessagesContainer.addEventListener('touchstart', handlePressStart, { passive: true });
        offlineMessagesContainer.addEventListener('mouseup', handlePressEndOrMove);
        offlineMessagesContainer.addEventListener('mouseleave', handlePressEndOrMove);
        offlineMessagesContainer.addEventListener('touchend', handlePressEndOrMove);
        offlineMessagesContainer.addEventListener('touchmove', handlePressEndOrMove, { passive: true });
        // === 新增结束 ===

    }

    
    offlineContainer.classList.add('visible');
    const inputElement = document.querySelector('#offline-chat-footer #chat-input');
    if (!isReadOnly && inputElement) inputElement.focus();
}


        // 点击工具栏“线下模式”按钮的入口函数
function handleOfflineModeClick(contactId) {
    if (contactId === 'system') {
        showCustomAlert('系统联系人无法使用线下模式。');
        return;
    }

    const contact = chatAppData.contacts.find(c => c.id === contactId);
    if (!contact) return;
    
    // 如果是第一次进入，则更新状态并打开界面
    contact.offlineMode = true; 
    
    const modeMessage = {
        id: 'mode_switch_' + generateId(),
        type: 'mode_switch',
        text: '已进入线下模式',
        mode: 'offline',
        sessionState: 'active', // 新增：为这个新会话设置活跃状态
        timestamp: Date.now()
    };

    if (!chatAppData.messages[contact.id]) {
        chatAppData.messages[contact.id] = [];
    }
    chatAppData.messages[contact.id].push(modeMessage);

    saveChatData();
    renderChatRoom(contact.id); // 刷新主聊天室以显示胶囊入口
    showGlobalToast("已进入线下模式", { type: 'success' });
    
    // 打开新的线下聊天界面，并传入会话ID
    openOfflineChat(contact.id, modeMessage.id);
}

        // 显示带“编辑”和“确定”的确认弹窗
        function showOfflineConfirm(contact, message) {
            const overlay = document.getElementById('offline-confirm-overlay');
            const messageEl = document.getElementById('offline-confirm-message');
            const editBtn = document.getElementById('offline-confirm-edit-btn');
            const okBtn = document.getElementById('offline-confirm-ok-btn');

            messageEl.textContent = message;
            overlay.classList.add('visible');

            // 移除旧监听器，防止重复执行
            const newOkBtn = okBtn.cloneNode(true);
            okBtn.parentNode.replaceChild(newOkBtn, okBtn);
            const newEditBtn = editBtn.cloneNode(true);
            editBtn.parentNode.replaceChild(newEditBtn, editBtn);
            
            const close = () => overlay.classList.remove('visible');

newOkBtn.onclick = () => {
    close(); // 先关闭确认弹窗

    if (contact.offlineMode) { // 如果当前是线下模式，则执行退出逻辑
        contact.offlineMode = false;
        const modeMessage = {
            id: 'mode_switch_' + generateId(), type: 'mode_switch', text: '已退出线下模式',
            mode: 'online', timestamp: Date.now()
        };
        chatAppData.messages[contact.id].push(modeMessage);
        saveChatData();
        renderChatRoom(contact.id);
        showGlobalToast("已退出线下模式", { type: 'success' });
    } else { // 如果当前是线上模式，则执行进入逻辑
        contact.offlineMode = true;
        const modeMessage = {
            id: 'mode_switch_' + generateId(), type: 'mode_switch', text: '已进入线下模式',
            mode: 'offline', timestamp: Date.now()
        };
        if (!chatAppData.messages[contact.id]) chatAppData.messages[contact.id] = [];
        chatAppData.messages[contact.id].push(modeMessage);
        saveChatData();
        renderChatRoom(contact.id); // 渲染主聊天室以显示胶囊入口
        showGlobalToast("已进入线下模式", { type: 'success' });
        
        // 关键：打开新的线下聊天界面
        openOfflineChat(contact.id);
    }
};


            newEditBtn.onclick = () => {
                close();
                // 延迟打开编辑窗口，避免闪烁
                setTimeout(() => openOfflineSettingsPopup(contact.id), 50);
            };

            // 点击遮罩层关闭
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    close();
                }
            }, { once: true });
        }

        // 打开线下模式设置的悬浮窗
        async function openOfflineSettingsPopup(contactId) {
            const overlay = document.getElementById('offline-settings-popup-overlay');
            const body = document.getElementById('offline-settings-popup-body');
            const closeBtn = document.getElementById('close-offline-settings-btn');
            
            const contact = chatAppData.contacts.find(c => c.id === contactId);
            if (!contact) return;

            // 复用侧边栏的HTML结构
    body.innerHTML = `
        <div class="modal-form-section">
            <div class="modal-form-group">
                <label>提示词预设</label>
                <div class="preset-controls">
                    <select id="popup-offline-preset-select" class="modal-select"></select>
                    <button id="popup-save-offline-preset-btn" class="modal-button">保存</button>
                    <button id="popup-update-offline-preset-btn" class="modal-button secondary">更新</button>
                    <button id="popup-delete-offline-preset-btn" class="modal-button danger">删除</button>
                </div>
            </div>
            <hr class="subtle-divider" style="width:100%; margin: 10px 0;">
            <div class="modal-form-group">
                <label for="popup-offline-prompt-input">主提示词 (Prompt)</label>
                <textarea id="popup-offline-prompt-input" class="modal-input" style="min-height: 100px;"></textarea>
            </div>
            <div class="modal-form-group">
                <label for="popup-offline-style-input">写作风格</label>
                <textarea id="popup-offline-style-input" class="modal-input" style="min-height: 100px;" placeholder="留空则不限制风格"></textarea>
            </div>
        </div>
    `;


            
            overlay.classList.add('visible');

            // --- 绑定设置逻辑 (包含原先侧边栏的完整逻辑) ---
            const OFFLINE_PRESET_KEY = 'offlineModePresets';
            const presetSelect = document.getElementById('popup-offline-preset-select');
            const promptInput = document.getElementById('popup-offline-prompt-input');
            const styleInput = document.getElementById('popup-offline-style-input');
            
            // 【需求1修复】将默认提示词逻辑完整迁移到这里
            const defaultOfflinePrompt = `你现在正在扮演名为 {{char}} 的角色，与用户进行线下面对面聊天。严格遵循以下规则：
1.  **【回复格式】你的整段回复必须作为一个**单一完整的消息**返回。你可以自由使用换行符（\`\\n\`）来组织段落以增强可读性，但系统会将你的所有内容呈现在一个气泡内。**
2.  **人称定义**：你（AI）是第三人称的 {{char}}，与你对话的用户是第二人称的“你”。
3.  **内容结构**：你的回复必须包含两部分——位于「」符号内的对话内容，和位于「」符号外的动作/表情/心理活动描写。
4.  **描写强制**：「」符号外的内容是**必须**的，不允许省略。这部分内容用于直接描写 {{char}} 的动作、表情、身体反应和内心想法，以增强场景感。
5.  **对话符号**：{{char}} 所说的每一句话都**必须**用「」括起来。
6.  **字数要求**：你的总回复（包括描写和对话）字数必须**大于300字**，以提供丰富、沉浸的场景体验。
7.  **禁止行为**：
    *   禁止代替用户（第二人称“你”）进行任何形式的回答或行为描写。
    *   禁止重复或引用用户的话。
    *   禁止使用比喻或隐喻，只进行直接描写。
8.  **人设核心**：严格遵循并深度扮演 {{char}} 的人设，确保所有生成内容（包括动作和对话）不脱离其性格设定。
9.  **场景感知**：牢记这是线下面对面场景，适当描写 {{char}} 在物理空间中的身体反应和与环境的互动。`;


            promptInput.placeholder = "留空则使用默认线下提示词（包含人称、字数、描写风格等规则）";

            const applyPresetUI = (preset) => {
                promptInput.value = (preset && preset.prompt) ? preset.prompt : '';
                styleInput.value = (preset && preset.style) ? preset.style : '';
            };

            const loadPresets = async () => {
                const presets = JSON.parse(await localforage.getItem(OFFLINE_PRESET_KEY)) || {};
                presetSelect.innerHTML = '<option value="">选择或新建预设...</option>';
                for (const name in presets) {
                    presetSelect.innerHTML += `<option value="${name}">${name}</option>`;
                }
                const selectedPresetName = contact.selectedOfflinePreset;
                if (selectedPresetName && presets[selectedPresetName]) {
                    presetSelect.value = selectedPresetName;
                    applyPresetUI(presets[selectedPresetName]);
                } else {
                    applyPresetUI(null);
                }
            };
            
            await loadPresets();

            presetSelect.addEventListener('change', async () => {
                const selectedName = presetSelect.value;
                const presets = JSON.parse(await localforage.getItem(OFFLINE_PRESET_KEY)) || {};
                applyPresetUI(presets[selectedName] || null);
                contact.selectedOfflinePreset = selectedName;
                saveChatData();
            });
            
            document.getElementById('popup-save-offline-preset-btn').addEventListener('click', async () => {
                showCustomPrompt("请输入新预设的名称：", '', async (name) => {
                    if (name && name.trim()) {
                        const presets = JSON.parse(await localforage.getItem(OFFLINE_PRESET_KEY)) || {};
                        presets[name.trim()] = {
                            prompt: promptInput.value.trim(),
                            style: styleInput.value
                        };
                        await localforage.setItem(OFFLINE_PRESET_KEY, JSON.stringify(presets));
                        contact.selectedOfflinePreset = name.trim();
                        saveChatData();
                        await loadPresets();
                        showGlobalToast(`线下预设 "${name.trim()}" 已保存！`, { type: 'success' });
                    }
                });
            });

            document.getElementById('popup-update-offline-preset-btn').addEventListener('click', async () => {
                const selectedName = presetSelect.value;
                if (!selectedName) {
                    showCustomAlert("请先选择一个要更新的预设。");
                    return;
                }
                showCustomConfirm(`确定要用当前内容更新预设 "${selectedName}" 吗？`, async () => {
                    const presets = JSON.parse(await localforage.getItem(OFFLINE_PRESET_KEY)) || {};
                    presets[selectedName] = {
                        prompt: promptInput.value.trim(),
                        style: styleInput.value
                    };
                    await localforage.setItem(OFFLINE_PRESET_KEY, JSON.stringify(presets));
                    showGlobalToast(`预设 "${selectedName}" 已更新！`, { type: 'success' });
                });
            });

            document.getElementById('popup-delete-offline-preset-btn').addEventListener('click', async () => {
                const selectedName = presetSelect.value;
                if (selectedName) {
                    showCustomConfirm(`确定要删除预设 "${selectedName}" 吗？`, async () => {
                        const presets = JSON.parse(await localforage.getItem(OFFLINE_PRESET_KEY)) || {};
                        delete presets[selectedName];
                        await localforage.setItem(OFFLINE_PRESET_KEY, JSON.stringify(presets));
                        if (contact.selectedOfflinePreset === selectedName) {
                            contact.selectedOfflinePreset = '';
                            saveChatData();
                        }
                        loadPresets();
                    });
                } else {
                    showCustomAlert("请先选择一个要删除的预设。");
                }
            });

            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            newCloseBtn.onclick = () => overlay.classList.remove('visible');
        }

        // ===================================
        // === 18. 聊天总结功能逻辑 (新增) ===
        // ===================================
        async function handleSummaryToolClick(contactId) {
            const popupOverlay = document.getElementById('summary-popup-overlay');
            if (!popupOverlay) return;

            const contactSettings = chatAppData.contactApiSettings[contactId] || {};
            const summaryConfig = contactSettings.summaryConfig || {};
            
            // 1. 获取UI元素
            const apiPresetSelect = document.getElementById('summary-api-preset');
            const promptTextarea = document.getElementById('summary-prompt');
            const contextSlider = document.getElementById('summary-context-slider');
            const contextValue = document.getElementById('summary-context-value');
            const thresholdSlider = document.getElementById('summary-threshold-slider');
            const thresholdValue = document.getElementById('summary-threshold-value');
            const manualSummaryBtn = document.getElementById('manual-summary-btn');
            const saveSettingsBtn = document.getElementById('save-summary-settings-btn');
            const closeBtn = document.getElementById('close-summary-popup-btn');

            // 2. 设置默认提示词 (已根据新需求优化)
            const defaultPrompt = `你是一个专业的对话总结助手。请根据以下聊天记录，直接返回一段50字以内的精简总结，不要包含任何开头的问候语或结尾的客套话。此外，请判断记录中是否存在极其重要的【事件锚点】，例如“明确的承诺”、“关键的约定”、“关系的重大转折”等。如果存在，请在总结后另起一行，以【事件锚点】开头，简要列出1-2个最关键的锚点；如果不存在任何称得上“极其重要”的事件，则无需生成【事件锚点】部分。`;
            promptTextarea.value = summaryConfig.prompt || defaultPrompt;

            // 3. 加载API预设
            const presets = JSON.parse(await localforage.getItem('apiPresets')) || {};
            apiPresetSelect.innerHTML = '<option value="">使用当前全局API设置</option>';
            for (const name in presets) {
                apiPresetSelect.innerHTML += `<option value="${name}">${name}</option>`;
            }
            apiPresetSelect.value = summaryConfig.apiPreset || "";

            // 4. 设置滑块值 (已根据新需求修改参数)
            contextSlider.min = 10;
            contextSlider.max = 300;
            contextSlider.step = 10;
            contextSlider.value = summaryConfig.contextLength || 20;
            contextValue.textContent = contextSlider.value;
            
            thresholdSlider.min = 0;
            thresholdSlider.max = 300;
            thresholdSlider.step = 10;
            thresholdSlider.value = summaryConfig.autoThreshold || 50;
            thresholdValue.textContent = thresholdSlider.value;
           
            // 5. 渲染历史总结
            renderSummaryList(contactId);

            // 6. 绑定事件
            const newManualBtn = manualSummaryBtn.cloneNode(true);
            manualSummaryBtn.parentNode.replaceChild(newManualBtn, manualSummaryBtn);
            newManualBtn.onclick = () => triggerManualSummary(contactId);

            const newSaveBtn = saveSettingsBtn.cloneNode(true);
            saveSettingsBtn.parentNode.replaceChild(newSaveBtn, saveSettingsBtn);
            newSaveBtn.onclick = () => saveSummarySettings(contactId);

            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            newCloseBtn.onclick = () => popupOverlay.classList.remove('visible');

            contextSlider.oninput = () => { contextValue.textContent = contextSlider.value; };
            thresholdSlider.oninput = () => { thresholdValue.textContent = thresholdSlider.value; };
            
            // 6.1 新增：为历史总结列表绑定事件委托
            const summaryListContainer = document.getElementById('summary-list-container');
            const newSummaryListContainer = summaryListContainer.cloneNode(true);
            summaryListContainer.parentNode.replaceChild(newSummaryListContainer, summaryListContainer);
            
            newSummaryListContainer.addEventListener('click', (e) => {
                const button = e.target.closest('.edit-mode-btn');
                if (!button) return;

                const summaryId = button.dataset.summaryId;
                const action = button.dataset.action;
                const allMessages = chatAppData.messages[contactId] || [];
                const summaryIndex = allMessages.findIndex(m => m.id === summaryId);

                if (summaryIndex === -1) return;

                if (action === 'edit-summary') {
                    const currentText = allMessages[summaryIndex].text;
                    showCustomPrompt('编辑总结内容:', currentText, (newText) => {
                        if (newText.trim()) {
                            allMessages[summaryIndex].text = newText.trim();
                            saveChatData();
                            renderChatRoom(contactId); // 刷新主聊天界面
                            renderSummaryList(contactId); // 刷新历史列表
                            showGlobalToast('总结已更新！', { type: 'success' });
                        }
                    });
                } else if (action === 'delete-summary') {
                    showCustomConfirm('确定要删除这条总结吗？此操作会影响AI的长期记忆。', () => {
                        allMessages.splice(summaryIndex, 1);
                        saveChatData();
                        renderChatRoom(contactId); // 刷新主聊天界面
                        renderSummaryList(contactId); // 刷新历史列表
                        showGlobalToast('总结已删除！', { type: 'success' });
                    });
                }
            });


            // 7. 显示弹窗
            popupOverlay.classList.add('visible');

        }

        function renderSummaryList(contactId) {
            const listContainer = document.getElementById('summary-list-container');
            const summaries = (chatAppData.messages[contactId] || []).filter(msg => msg.type === 'summary');
            
            if (summaries.length === 0) {
                listContainer.innerHTML = `<span class="empty-text">暂无历史总结</span>`;
                return;
            }

            // 从新到旧排序
            listContainer.innerHTML = summaries.reverse().map(summary => `
                <div class="summary-list-item" style="display: flex; flex-direction: column;">
                    <div class="summary-content" style="flex-grow: 1;">${summary.text.replace(/\n/g, '<br>')}</div>
                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px; margin-top: 6px;">
                         <div class="edit-mode-controls" style="flex-shrink: 0;">
                            <button class="edit-mode-btn" data-action="edit-summary" data-summary-id="${summary.id}" title="编辑"><svg style="width: 16px; height: 16px;" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
                            <button class="edit-mode-btn" data-action="delete-summary" data-summary-id="${summary.id}" title="删除"><svg style="width: 16px; height: 16px;" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></button>
                        </div>
                        <div class="summary-meta">${new Date(summary.timestamp).toLocaleString()}</div>
                    </div>
                </div>
            `).join('');
        }

        function saveSummarySettings(contactId) {
            const contactSettings = chatAppData.contactApiSettings[contactId] || {};
            contactSettings.summaryConfig = {
                apiPreset: document.getElementById('summary-api-preset').value,
                prompt: document.getElementById('summary-prompt').value,
                contextLength: parseInt(document.getElementById('summary-context-slider').value, 10),
                autoThreshold: parseInt(document.getElementById('summary-threshold-slider').value, 10)
            };
            chatAppData.contactApiSettings[contactId] = contactSettings;
            saveChatData();
            showGlobalToast('总结设置已保存！', { type: 'success' });
        }

        async function triggerManualSummary(contactId) {
            const manualSummaryBtn = document.getElementById('manual-summary-btn');
            if (manualSummaryBtn.disabled) return;

            manualSummaryBtn.disabled = true;
            manualSummaryBtn.textContent = '总结中...';

            try {
                // 1. 获取设置
                const contextLength = parseInt(document.getElementById('summary-context-slider').value, 10);
                const prompt = document.getElementById('summary-prompt').value;
                const apiPresetName = document.getElementById('summary-api-preset').value;
                
                // 2. 获取API配置
                const presets = JSON.parse(await localforage.getItem('apiPresets')) || {};
                let apiSettings;
                if (apiPresetName && presets[apiPresetName]) {
                    apiSettings = presets[apiPresetName];
                } else {
                    apiSettings = JSON.parse(await localforage.getItem('apiSettings')) || {};
                }

                if (!apiSettings.url || !apiSettings.key || !apiSettings.model) {
                    throw new Error('用于总结的API配置不完整（URL, Key, Model）。');
                }

                // 3. 筛选需要总结的消息
                const allMessages = chatAppData.messages[contactId] || [];
                // 筛选出非总结、非系统提示的普通消息
                const normalMessages = allMessages.filter(m => !m.type && m.sender); 
                if (normalMessages.length === 0) {
                    showGlobalToast('没有可供总结的聊天记录。', { type: 'info' });
                    return;
                }
                const messagesToSummarize = normalMessages.slice(-contextLength);

                // 4. 构建API请求体 (修正版)
                const contact = chatAppData.contacts.find(c => c.id === contactId);
                if (!contact) {
                    throw new Error('在准备总结时找不到联系人对象。');
                }

                // 将聊天记录格式化为纯文本字符串，以便AI明确理解这是待处理的“材料”而不是对话历史
                const chatLogString = messagesToSummarize.map(msg => {
                    const senderName = msg.sender === 'me' ? '用户' : (contact.name || '角色');
                    // 将<br>转回换行符，并处理可能的其他消息类型以避免错误
                    const textContent = (msg.text || (msg.type ? `[${msg.type}消息]` : '')).replace(/<br\s*\/?>/gi, '\n');
                    return `${senderName}: ${textContent}`;
                }).join('\n\n'); // 使用双换行分隔每条消息，使结构更清晰

                // 将指令和聊天记录合并为一个用户请求，使用Markdown代码块包裹记录，让界限更分明
                const fullUserPrompt = `${prompt}\n\n以下是需要总结的聊天记录：\n\n\`\`\`text\n${chatLogString}\n\`\`\``;
                
                // 使用单个 user 角色消息，让任务意图更清晰，避免模型将其理解为对话
                const finalMessages = [{ role: 'user', content: fullUserPrompt }];

                // 5. 调用API
                    const response = await fetch(new URL('/v1/chat/completions', apiSettings.url).href, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiSettings.key}` },
                        body: JSON.stringify({
                            model: apiSettings.model,
                            messages: finalMessages,
                            temperature: 0.3, // 总结任务建议使用较低的温度以确保准确性
                            stream: false
                        })
                    });

                if (!response.ok) {
                    throw new Error(`API 请求失败: ${response.status}`);
                }
                
                const result = await response.json();
                const summaryText = result.choices[0].message.content.trim();

                if (!summaryText) {
                    throw new Error('AI未能生成有效的总结内容。');
                }
                
                // 6. 创建并插入总结消息
                const summaryMessage = {
                    id: 'summary_' + generateId(),
                    type: 'summary',
                    text: summaryText,
                    timestamp: Date.now(),
                    summarizedMessageIds: messagesToSummarize.map(m => m.id) // 记录被总结的消息ID
                };

                // 找到最后一条被总结消息的位置，在其后插入总结
                const lastSummarizedMessageId = messagesToSummarize[messagesToSummarize.length - 1].id;
                const insertionIndex = allMessages.findIndex(m => m.id === lastSummarizedMessageId) + 1;
                allMessages.splice(insertionIndex, 0, summaryMessage);

                // 7. 标记已被总结的消息
                const summarizedIdsSet = new Set(messagesToSummarize.map(m => m.id));
                allMessages.forEach(msg => {
                    if (summarizedIdsSet.has(msg.id)) {
                        msg.summarized = true; // 添加标记
                    }
                });

                // 8. 保存并更新UI
                saveChatData();
                renderChatRoom(contactId); // 刷新聊天室显示总结
                renderSummaryList(contactId); // 刷新总结列表
                showGlobalToast('总结完成！', { type: 'success' });
                
            } catch (error) {
                console.error("总结失败:", error);
                showCustomAlert(`总结失败: ${error.message}`);
            } finally {
                manualSummaryBtn.disabled = false;
                manualSummaryBtn.textContent = '立即手动总结';
            }
        }
        async function checkAndTriggerAutoSummary(contactId) {
            const contactSettings = chatAppData.contactApiSettings[contactId] || {};
            const summaryConfig = contactSettings.summaryConfig || {};
            const threshold = summaryConfig.autoThreshold || 0;

            // 如果阈值为0，则禁用自动总结
            if (threshold <= 0) {
                return;
            }

            const allMessages = chatAppData.messages[contactId] || [];
            
            // 找到最后一条总结消息的索引
            let lastSummaryIndex = -1;
            for (let i = allMessages.length - 1; i >= 0; i--) {
                if (allMessages[i].type === 'summary') {
                    lastSummaryIndex = i;
                    break;
                }
            }

            // 计算自上次总结以来的消息数量 (只计算用户和AI的普通消息)
            const messagesSinceLastSummary = allMessages
                .slice(lastSummaryIndex + 1)
                .filter(m => !m.type && m.sender); // 过滤掉总结和系统提示

            if (messagesSinceLastSummary.length >= threshold) {
                showGlobalToast(`与Ta的对话已超过 ${threshold} 条，是否进行总结？`, {
                    type: 'confirmation',
                    confirmText: '总结', // 指定确认按钮的文本为“总结”
                    onConfirm: () => {
                        // 使用 setTimeout 确保 toast 消失动画结束后再开始耗时操作
                        setTimeout(() => triggerManualSummary(contactId), 300);
                    }
                });
            }
        }
        // ===================================
        // === 19. 存档功能逻辑 (新增) ===
        // ===================================
        
        // 打开存档悬浮窗的主函数
        function handleArchiveToolClick(contactId) {
            const popupOverlay = document.getElementById('chat-archive-overlay');
            if (!popupOverlay) return;
            // 渲染存档列表
            renderArchiveList(contactId);
            // 绑定事件 (使用克隆节点法移除旧监听器)
            const saveBtn = document.getElementById('save-archive-btn');
            const newSaveBtn = saveBtn.cloneNode(true);
            saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
            newSaveBtn.onclick = () => handleSaveArchive(contactId);
            const closeBtn = document.getElementById('close-archive-popup-btn');
            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            newCloseBtn.onclick = () => popupOverlay.classList.remove('visible');
            const listContainer = document.getElementById('archive-list-container');
            const newListContainer = listContainer.cloneNode(true); // 克隆并替换以清除旧监听
            listContainer.parentNode.replaceChild(newListContainer, listContainer);
            newListContainer.addEventListener('click', (e) => {
                const loadBtn = e.target.closest('.archive-load-btn');
                const deleteBtn = e.target.closest('.archive-delete-btn');

                if (loadBtn) {
                    const archiveId = loadBtn.dataset.archiveId;
                    handleLoadArchive(contactId, archiveId);
                } else if (deleteBtn) {
                    const archiveId = deleteBtn.dataset.archiveId;
                    const archives = chatAppData.archives[contactId];
                    const archiveToDelete = archives.find(a => a.id === archiveId);
                    if (archiveToDelete) {
                        showCustomConfirm(`确定要删除存档 "${archiveToDelete.title}" 吗？`, () => {
                            chatAppData.archives[contactId] = archives.filter(a => a.id !== archiveId);
                            saveChatData();
                            renderArchiveList(contactId);
                            showGlobalToast('存档已删除', { type: 'success' });
                        });
                    }
                }
            });
            // 显示弹窗
            popupOverlay.classList.add('visible');
        }
        // 渲染存档列表
        function renderArchiveList(contactId) {
            const listContainer = document.getElementById('archive-list-container');
            const archives = (chatAppData.archives && chatAppData.archives[contactId]) || [];
            if (archives.length === 0) {
                listContainer.innerHTML = `<span class="empty-text">暂无存档</span>`;
                return;
            }
            listContainer.innerHTML = archives.map(archive => `
                <div class="archive-card">
                    <div class="archive-card-info">
                        <span class="archive-card-title">${archive.title}</span>
                        <span class="archive-card-timestamp">${new Date(archive.timestamp).toLocaleString()} <small>(${(archive.data || []).length}条)</small></span>
                    </div>
                    <div class="archive-card-actions">
                        <button class="modal-button secondary archive-load-btn" data-archive-id="${archive.id}">读档</button>
                        <button class="modal-button archive-delete-btn" data-archive-id="${archive.id}">删除</button>
                    </div>
                </div>
            `).join('');
        }
        // 保存当前对话为存档
        function handleSaveArchive(contactId) {
            const titleInput = document.getElementById('archive-title-input');
            let title = titleInput.value.trim();

            if (!title) {
                title = new Date().toLocaleString();
            }

            // 深拷贝当前聊天记录
            const messagesToSave = JSON.parse(JSON.stringify(chatAppData.messages[contactId] || []));
            if (messagesToSave.length === 0) {
                showCustomAlert("当前没有聊天记录，无法存档。");
                return;
            }
            
            const newArchive = {
                id: 'archive_' + generateId(),
                title: title,
                timestamp: Date.now(),
                data: messagesToSave
            };

            // 初始化存档数据结构
            if (!chatAppData.archives) {
                chatAppData.archives = {};
            }
            if (!chatAppData.archives[contactId]) {
                chatAppData.archives[contactId] = [];
            }
            
            // 将新存档添加到最前面
            chatAppData.archives[contactId].unshift(newArchive);

            // 【修改】清空当前聊天记录
            chatAppData.messages[contactId] = [];
            
            // 更新联系人列表的最后一条消息预览
            const contact = chatAppData.contacts.find(c => c.id === contactId);
            if (contact) {
                contact.lastMessage = "对话已存档";
                contact.lastActivityTime = Date.now();
            }

            // 一次性保存所有更改
            saveChatData();

            // [新功能] 存档并清空后，检查并弹出开场白选择器
            const charForCheck = archiveData.characters.find(c => c.id === contactId);
            if (charForCheck && charForCheck.openingLines && charForCheck.openingLines.length > 0) {
                showOpeningRemarkSelector(contactId);
            } else {
                renderChatRoom(contactId); // 如果没有开场白，直接刷新
            }

            // 清空输入框并刷新存档列表
            titleInput.value = '';
            renderArchiveList(contactId);
            showGlobalToast('对话已成功存档！', { type: 'success' });

            // 【新增】存档成功后，立即关闭悬浮窗
            const popupOverlay = document.getElementById('chat-archive-overlay');
            if (popupOverlay) popupOverlay.classList.remove('visible');
        }

        // 从存档加载对话
        function handleLoadArchive(contactId, archiveId) {
            const archive = chatAppData.archives[contactId].find(a => a.id === archiveId);
            if (!archive) {
                showCustomAlert("未找到该存档。");
                return;
            }

            showCustomConfirm(
                `确定要读取存档 "${archive.title}" 吗？这将覆盖当前的聊天记录，操作不可逆。`,
                () => {
                    const loadedMessages = JSON.parse(JSON.stringify(archive.data));
                    
                    // 【核心修复】使用更稳健的方式更新数组，而不是直接替换引用
                    // 1. 获取当前消息数组的引用
                    const currentMessages = chatAppData.messages[contactId];
                    // 2. 清空该数组（保持引用不变）
                    currentMessages.length = 0; 
                    // 3. 将加载的数据推入该数组
                    currentMessages.push(...loadedMessages);

                    // 更新最后一条消息
                    const contact = chatAppData.contacts.find(c => c.id === contactId);
                    if (contact && loadedMessages.length > 0) {
                        const lastMsg = loadedMessages[loadedMessages.length - 1];
                        if (lastMsg.type === 'image') {
                           contact.lastMessage = '[图片]';
                        } else if (lastMsg.type === 'voice') {
                           contact.lastMessage = '[语音]';
                        } else if (lastMsg.type === 'summary') {
                           contact.lastMessage = '[对话总结]';
                        } else {
                           contact.lastMessage = (lastMsg.text || '').substring(0, 50); // 同样做截断
                        }
                        // 更新最后活跃时间，让该聊天在列表中置顶
                        contact.lastActivityTime = Date.now();
                    } else if (contact) {
                        contact.lastMessage = '';
                    }

                    saveChatData();

                    // 重新渲染聊天室并关闭弹窗
                    renderChatRoom(contactId);
                    const popupOverlay = document.getElementById('chat-archive-overlay');
                    if (popupOverlay) popupOverlay.classList.remove('visible');

                    showGlobalToast('存档读取成功！', { type: 'success' });
                }
            );
        }

        // =============================================
        // === 新增：视频通话功能核心逻辑 ===
        // =============================================
        
        let videoCallContactId = null; // 记录当前视频通话的联系人ID
        let isVideoCallActive = false; // 标记视频通话是否已接通

        // 1. 开始视频通话（用户点击按钮触发）
        function startVideoCall(contactId) {
            // 【核心修正】在这里获取DOM元素并统一变量名
            const videoCallOverlay = document.getElementById('video-call-overlay');
            const contact = chatAppData.contacts.find(c => c.id === contactId);
            const charProfile = archiveData.characters.find(c => c.id === contactId);
            // 【核心修正】使用正确的变量名 videoCallOverlay 进行判断
            if (!contact || !charProfile || !videoCallOverlay) return;

            // 【新增】在主聊天界面插入“视频通话”提示
            const startMessage = {
                id: 'mode_switch_' + generateId(),
                type: 'mode_switch',
                text: '视频通话',
                mode: 'video', // 标记为视频模式开始
                isFolded: false, // 初始不折叠
                timestamp: Date.now()
            };
            if (!chatAppData.messages[contactId]) {
                chatAppData.messages[contactId] = [];
            }
            chatAppData.messages[contactId].push(startMessage);
            saveChatData();
            // 如果当前在聊天室，刷新以显示提示
            if (currentChatView.active && currentChatView.contactId === contactId) {
                renderChatRoom(contactId);
            }


            videoCallContactId = contactId;
            isVideoCallActive = false; // 重置接通状态

            // 【核心修正】统一使用 videoCallOverlay 变量
            const bgElement = videoCallOverlay.querySelector('.video-call-background');
            const avatarElement = videoCallOverlay.querySelector('.char-avatar-large');

            // 需求1：背景是模糊的char头像
            bgElement.style.backgroundImage = `url(${charProfile.avatar})`;
            bgElement.style.filter = 'blur(20px) brightness(0.7)'; // 添加模糊
            bgElement.style.transform = 'scale(1.1)';


            // 需求1：屏幕中间偏上显示清晰的char头像
            avatarElement.style.backgroundImage = `url(${charProfile.avatar})`;
            
            // 显示并切换到呼叫中状态
            videoCallOverlay.classList.remove('connected');
            videoCallOverlay.classList.add('visible', 'calling');

            // 为两个挂断按钮添加点击事件
            const hangUpButtons = videoCallOverlay.querySelectorAll('.video-call-hang-up-btn');
            hangUpButtons.forEach(btn => {
                // 使用克隆节点法确保每次打开都绑定新的、干净的事件
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                // 【核心修改】呼叫时用户主动挂断，应视为 'ended' 或 'canceled'
                // 为了与需求对齐，我们统一用 'ended' 表示用户主动结束，'rejected' 表示对方结束
                newBtn.addEventListener('click', () => closeVideoCall('ended'));
            });

            // 调用API进行首轮回复（接通或挂断决策）
            triggerVideoCallAPI(contactId);

        }



        // 2. 处理视频通话的API请求（仅用于接通/挂断决策）
        async function triggerVideoCallAPI(contactId) {
            const contact = chatAppData.contacts.find(c => c.id === contactId);
            const charPersona = archiveData.characters.find(c => c.id === contactId);
            if (!contact || !charPersona) return;

            const globalApiSettings = JSON.parse(await localforage.getItem('apiSettings')) || {};
            const effectiveApiSettings = { ...globalApiSettings, ...chatAppData.contactApiSettings[contactId] };
            
            if (!effectiveApiSettings.url || !effectiveApiSettings.key || !effectiveApiSettings.model) {
                showCustomAlert('视频通话功能需要先配置有效的 API URL, Key 和 Model！');
                closeVideoCall();
                return;
            }
            
            // 视频通话专用的系统提示词（决策阶段）
            const videoCallPrompt = `你现在是 ${charPersona.name}，用户正向你发起视频通话。根据你的人设和与用户的上下文关系，自主决定是【接通】还是【挂断】。
**【核心规则】**
1.  **决策指令**:
    *   **若决定接通**: 你的回复**必须**在末尾附带 \`(接通)\` 指令。
    *   **若决定挂断**: 你的回复**必须**在末尾附带 \`(挂断)\` 指令。
    *   **注意**: 两个指令必须选择一个，且只能出现一次。

2.  **回复格式**: 你的回复必须遵循 \`(动作/状态) 对话内容\` 的格式。
    *   **括号内容**: 括号内的动作/状态使用第三人称（例如：他看着屏幕，点了点头），必须是直接的、白描式的动作或状态描述，不能使用任何比喻或环境描写。
    *   **括号外内容**: 括号外的对话内容使用第一人称（我）自称，对用户使用第二人称（你）。

3.  **人设与风格**: 严格保持 ${charPersona.name} 的人设和性格，不允许OOC。保持活人感，不得复述用户的话。

4.  **指令影响**:
    *   你选择 \`(接通)\` 后，系统会自动进入视频聊天界面，你的回复内容将作为视频聊天的第一句话。
    *   你选择 \`(挂断)\` 后，系统会自动挂断电话，你的回复内容将作为一条普通聊天消息发送给用户。

**【决策示例】**
*   **挂断示例**: \`(挂断)(他皱了皱眉，直接按下了拒绝按钮) 我现在有点事，晚点再说吧。\`
*   **接通示例**: \`(接通)(听到铃声，他立刻放下手中的书，脸上露出一丝微笑) 喂，是你呀。\`
`;

            // 我们只取最近的少量消息作为判断依据
            const recentMessages = (chatAppData.messages[contactId] || []).slice(-5);
            const apiMessages = await formatChatMessagesForAPI(contactId, recentMessages, charPersona);
            // 替换系统提示词为视频通话专用提示词
            apiMessages[0] = { role: 'system', content: videoCallPrompt };
            
            videoCallDecisionController = new AbortController(); // 初始化控制器
            try {
                const response = await fetch(new URL('/v1/chat/completions', effectiveApiSettings.url).href, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${effectiveApiSettings.key}` },
                    body: JSON.stringify({
                        model: effectiveApiSettings.model,
                        messages: apiMessages,
                        temperature: parseFloat(effectiveApiSettings.temp || 0.7),
                        stream: false // 决策性回复，不需要流式
                    }),
                    signal: videoCallDecisionController.signal // 传入 signal
                });

                if (!response.ok) throw new Error(`API 请求失败! 状态: ${response.status}.`);

                const result = await response.json();
                const aiMessage = result.choices[0].message.content.trim();

                 // 判断AI的决策
                if (aiMessage.includes('(接通)')) {
                    // AI决定接通
                    const firstMessage = aiMessage.replace('(接通)', '').trim();
                    handleVideoCallConnected(contactId, firstMessage); // 传入第一句对话
                } else if (aiMessage.includes('(挂断)')) {
                    // AI决定挂断
                    const postHangupMessage = aiMessage.replace('(挂断)', '').trim();
                    handleVideoCallRejected(contactId, postHangupMessage);
                } else {
                    // 如果AI没有给出明确指令，默认接通，并将完整回复作为第一句话
                    handleVideoCallConnected(contactId, aiMessage);
                }

            } catch (error) {
                console.error('视频通话API决策失败:', error);
                showCustomAlert(`连接失败: ${error.message}`);
                closeVideoCall(); // API失败时直接关闭界面
            }
        }

        
        // 3. 处理AI拒绝通话 (优化版)
        function handleVideoCallRejected(contactId, postHangupMessage) {
            const videoCallOverlay = document.getElementById('video-call-overlay');
            if (!videoCallOverlay) return;

            // 步骤1: 在通话界面显示“对方拒绝了您的视频请求”
            let notice = videoCallOverlay.querySelector('.rejection-notice');

            if (!notice) {
                notice = document.createElement('div');
                notice.className = 'rejection-notice';
                // 【核心修正】使用正确的 videoCallOverlay 变量
                videoCallOverlay.querySelector('#video-call-calling-state').appendChild(notice);
            }
            notice.textContent = '对方拒绝了您的视频请求';

            // 步骤2: 延迟关闭界面
            setTimeout(() => {
                // 步骤3: 结束视频通话进程，并传入 'rejected' 状态
                closeVideoCall('rejected');
                
                // 步骤4: 如果AI提供了挂断回复
                if (postHangupMessage) {
                    // 新增：移除所有括号及其内容，只保留纯对话文本
                    const pureTextMessage = postHangupMessage.replace(/\(.*?\)|（.*?）/g, '').trim();
                    
                    // 如果处理后仍有文本内容
                    if (pureTextMessage) {
                        const newMessage = {
                            id: generateId(),
                            text: pureTextMessage, // 使用处理后的纯文本
                            sender: 'them',
                            timestamp: Date.now()
                        };

                        if (!chatAppData.messages[contactId]) {
                            chatAppData.messages[contactId] = [];
                        }
                        chatAppData.messages[contactId].push(newMessage);
                        
                        const contactToUpdate = chatAppData.contacts.find(c => c.id === contactId);
                        if (contactToUpdate) {
                            contactToUpdate.lastMessage = pureTextMessage.substring(0, 50);
                            contactToUpdate.lastActivityTime = Date.now();
                        }
                        
                        saveChatData();
                        
                        // 步骤5: 刷新UI显示新消息
                        if (currentChatView.active && currentChatView.contactId === contactId) {
                            renderChatRoom(contactId);
                        } else if (document.querySelector('.chat-contact-list-view')) {
                            renderContactList();
                        }
                    }
                }
            }, 1500);
        }

        // 4. 处理AI接通通话
        async function handleVideoCallConnected(contactId, firstMessage) {
            const videoCallOverlay = document.getElementById('video-call-overlay');
            const charProfile = archiveData.characters.find(c => c.id === contactId);
            const userAvatar = await localforage.getItem('userProfileAvatar') || DEFAULT_USER_AVATAR_SVG;

            if (!charProfile || !videoCallOverlay) {
                closeVideoCall();
                return;
            }

            // 新增：在聊天界面插入“已拨通”提示
            const connectedMessage = {
                id: 'sys_notice_' + generateId(),
                type: 'system_notice', // 使用一个新类型来渲染居中提示
                text: '已拨通',
                timestamp: Date.now()
            };
            if (!chatAppData.messages[contactId]) {
                chatAppData.messages[contactId] = [];
            }
            // 确保这条消息在视频通话开始标记之后
            chatAppData.messages[contactId].push(connectedMessage);
            saveChatData();
            // 如果在聊天室，刷新以显示提示
            if (currentChatView.active && currentChatView.contactId === contactId) {
                renderChatRoom(contactId);
            }

            // 需求2：背景改为档案里的立绘，并且不模糊
            const bgElement = videoCallOverlay.querySelector('.video-call-background');
            bgElement.style.backgroundImage = `url(${charProfile.avatar})`; // 使用立绘
            bgElement.style.filter = 'brightness(0.8)'; // 移除模糊，只保留一点亮度降低
            bgElement.style.transform = 'scale(1)'; // 恢复正常尺寸

            // 设置用户小窗的头像
            videoCallOverlay.querySelector('.user-self-view').style.backgroundImage = `url(${userAvatar})`;

            // 清空对话区域
            document.getElementById('video-chat-dialogue-area').innerHTML = '';

            // 切换到接通状态
            videoCallOverlay.classList.remove('calling');
            videoCallOverlay.classList.add('connected');

            isVideoCallActive = true;
            // 将AI的第一句回复显示在对话区域
            if (firstMessage) {
                const dialogueArea = document.getElementById('video-chat-dialogue-area');
                const aiMsgElement = document.createElement('p');
                aiMsgElement.textContent = firstMessage;
                dialogueArea.appendChild(aiMsgElement);
                 // 视频通话消息也存入主聊天记录
                const newMessage = { id: generateId(), text: firstMessage, sender: 'them', timestamp: Date.now(), isVideoCallMessage: true };
                chatAppData.messages[videoCallContactId].push(newMessage);
                saveChatData();
            }

            // 为新输入栏绑定事件 (使用克隆节点法确保只绑定一次)
            const hangUpInBarBtn = document.getElementById('video-chat-hang-up-in-bar-btn');
            const input = document.getElementById('video-chat-input');
            const reAnswerBtn = document.getElementById('video-re-answer-btn');

            // 克隆并替换，以清除旧的事件监听器
            const newHangUpBtn = hangUpInBarBtn.cloneNode(true);
            hangUpInBarBtn.parentNode.replaceChild(newHangUpBtn, hangUpInBarBtn);
            const newReAnswerBtn = reAnswerBtn.cloneNode(true);
            reAnswerBtn.parentNode.replaceChild(newReAnswerBtn, reAnswerBtn);

            // 发送消息函数
            const sendVideoMessage = () => {
                const text = input.value.trim();
                if (text && videoCallContactId) {
                    const dialogueArea = document.getElementById('video-chat-dialogue-area');
                    // 直接将用户消息添加到对话区
                    const userMsgElement = document.createElement('p');
                    userMsgElement.textContent = `你: ${text}`;
                    dialogueArea.appendChild(userMsgElement);
                    dialogueArea.scrollTop = dialogueArea.scrollHeight;

                    // 将消息也存入主聊天记录
                    const newMessage = { id: generateId(), text, sender: 'me', timestamp: Date.now(), isVideoCallMessage: true };
                    chatAppData.messages[videoCallContactId].push(newMessage);
                    saveChatData();
                    input.value = '';
                    
                    // 触发AI回复
                    triggerApiReply(videoCallContactId);
                }
            };
            
            // 绑定事件
            newHangUpBtn.onclick = () => closeVideoCall('ended');
            
            input.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendVideoMessage();
                }
            };
            
            // 【核心修改】实现重回逻辑
            newReAnswerBtn.onclick = () => {
                const messages = chatAppData.messages[contactId] || [];
                // 使用过滤器只查找视频通话消息
                const videoMsgFilter = (msg) => msg.isVideoCallMessage === true;
                const latestAIRound = findLatestAIRound(messages, videoMsgFilter);
                
                if (latestAIRound) {
                    // 如果找到了，触发重回
                    triggerApiReply(contactId, latestAIRound);
                } else {
                    showCustomAlert('找不到可供重新生成的视频聊天回复。');
                }
            };
        }


        // 5. 关闭视频通话界面（通用函数）
        function closeVideoCall(reason) { // 增加 reason 参数
            // 中断正在进行的API决策请求
            if (videoCallDecisionController) {
                videoCallDecisionController.abort();
            }

            const activeContactId = videoCallContactId; // 保存ID，因为后面会清空
            const videoCallOverlay = document.getElementById('video-call-overlay');

            if(videoCallOverlay) {
                videoCallOverlay.classList.remove('visible', 'calling', 'connected');
                // 清理可能存在的拒绝通知
                const notice = videoCallOverlay.querySelector('.rejection-notice');
                if (notice) notice.remove();
            }

            videoCallContactId = null;
            isVideoCallActive = false;
            
            // 【核心修改】在主聊天界面插入“通话结束”等提示，并处理折叠
            if (activeContactId) {
                const messages = chatAppData.messages[activeContactId] || [];
                
                // 根据 reason 决定文本内容
                let endText = '通话结束';
                if (reason === 'rejected') {
                    endText = '对方拒绝了您的视频通话';
                } else if (reason === 'ended') {
                    endText = '结束通话';
                }

                const endMessage = {
                    id: 'mode_switch_' + generateId(),
                    type: 'mode_switch',
                    text: endText,
                    mode: 'chat', // 标记模式结束
                    timestamp: Date.now()
                };
                messages.push(endMessage);

                // 【核心修改】不再自动折叠，交由用户点击处理
                // 原有的 isFolded = true 逻辑已被移除

                saveChatData();
                // 如果当前在聊天室，刷新以显示提示
                if (currentChatView.active && currentChatView.contactId === activeContactId) {
                    renderChatRoom(activeContactId);
                }
            }
        }


        // 6. 绑定视频通话界面内的交互事件
        document.addEventListener('DOMContentLoaded', () => {
            const videoSendBtn = document.getElementById('video-send-btn');
            const videoApiReplyBtn = document.getElementById('video-api-reply-btn');
            const videoChatInput = document.getElementById('video-chat-input');
            
            if (videoSendBtn) {
                videoSendBtn.addEventListener('click', () => {
                    const text = videoChatInput.value.trim();
                    if (text && videoCallContactId) {
                        // 在视频通话中发送消息的逻辑，这里我们复用现有机制
                        // 1. 添加用户消息到主聊天记录
                        const newMessage = { id: generateId(), text, sender: 'me', timestamp: Date.now(), isVideoCallMessage: true };
                        chatAppData.messages[videoCallContactId].push(newMessage);
                        saveChatData();
                        videoChatInput.value = '';
                        // 2. 触发AI回复（此时AI会使用视频通话的上下文）
                        triggerApiReply(videoCallContactId);
                    }
                });
            }
            if (videoApiReplyBtn) {
                 videoApiReplyBtn.addEventListener('click', () => {
                    if (videoCallContactId) {
                        triggerApiReply(videoCallContactId);
                    }
                });
            }
        });
        // =============================================
        // === 新增：创建群聊功能核心逻辑 ===
        // =============================================
        let tempGroupAvatar = null; // 用于暂存上传的群头像

        // 打开创建群聊弹窗
        async function openCreateGroupPopup(initialContactId) {
            const overlay = document.getElementById('create-group-popup-overlay');
            const box = overlay.querySelector('.create-group-popup-box');
            const avatarPreview = document.getElementById('group-avatar-preview');
            const avatarUpload = document.getElementById('group-avatar-upload');
            const nameInput = document.getElementById('group-name-input');
            const memberList = document.getElementById('group-member-selection-list');
            const confirmBtn = document.getElementById('confirm-create-group-btn');
            const cancelBtn = document.getElementById('cancel-create-group-btn');

            // --- 1. 重置UI状态 ---
            nameInput.value = '';
            avatarPreview.style.backgroundImage = '';
            avatarPreview.querySelector('span').style.display = 'block';
            tempGroupAvatar = null;

            // --- 2. 渲染成员列表 ---
            // 包括自己和所有档案中的角色
            const currentUser = { id: 'user', name: '我', avatar: await localforage.getItem('userProfileAvatar') || DEFAULT_USER_AVATAR_SVG };
            const allPossibleMembers = [currentUser, ...archiveData.characters];

            memberList.innerHTML = allPossibleMembers.map(member => {
                // 预选自己和发起群聊的联系人
                const isChecked = member.id === 'user' || member.id === initialContactId;
                // 自己不能被取消勾选
                const isDisabled = member.id === 'user';
                
                return `
                    <label class="group-member-selection-item">
                        <div class="group-member-avatar" style="background-image: url('${member.avatar}')"></div>
                        <span class="group-member-name">${member.name}</span>
                        <input type="checkbox" class="group-member-checkbox" value="${member.id}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
                    </label>
                `;
            }).join('');
            
            // --- 3. 绑定事件 ---
            // 使用克隆节点法确保每次打开都绑定新的、干净的事件监听器
            const newConfirmBtn = confirmBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
            newConfirmBtn.onclick = handleCreateGroup;

            const newCancelBtn = cancelBtn.cloneNode(true);
            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
            newCancelBtn.onclick = closeCreateGroupPopup;

            const newAvatarPreview = avatarPreview.cloneNode(true);
            avatarPreview.parentNode.replaceChild(newAvatarPreview, avatarPreview);
            
            const newAvatarUpload = avatarUpload.cloneNode(true);
            avatarUpload.parentNode.replaceChild(newAvatarUpload, avatarUpload);
            
            // 【修复】确保点击预览区域时，触发的是我们正在监听的那个新的<input>
            newAvatarPreview.onclick = () => newAvatarUpload.click();

            newAvatarUpload.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    compressImage(file).then(dataUrl => {
                        tempGroupAvatar = dataUrl;
                        // 实时显示选好的头像
                        const previewElement = document.getElementById('group-avatar-preview');
                        if (previewElement) {
                             previewElement.style.backgroundImage = `url(${dataUrl})`;
                             const placeholder = previewElement.querySelector('span');
                             if (placeholder) placeholder.style.display = 'none';
                        }
                    });
                }
            };
            
            // 点击遮罩层关闭
            overlay.onclick = (e) => {
                if(e.target === overlay) closeCreateGroupPopup();
            };

            // --- 4. 显示弹窗 ---
            overlay.classList.add('visible');
        }

        // 关闭创建群聊弹窗
        function closeCreateGroupPopup() {
            const overlay = document.getElementById('create-group-popup-overlay');
            overlay.classList.remove('visible');
        }

        // 处理创建群聊的确认逻辑
        function handleCreateGroup() {
            // 【修复】使用更精确的选择器，确保从“创建群聊”弹窗中获取元素，避免ID冲突
            const nameInput = document.querySelector('#create-group-popup-overlay #group-name-input');
            const memberCheckboxes = document.querySelectorAll('#create-group-popup-overlay .group-member-checkbox:checked');
            
            let groupName = nameInput.value.trim();
            const selectedMemberIds = Array.from(memberCheckboxes).map(cb => cb.value);

            // 验证
            if (selectedMemberIds.length < 2) { 
                showCustomAlert('群聊成员至少需要2人！');
                return;
            }
            
            // 如果群聊名为空，则根据成员自动生成
            if (!groupName) {
                const memberNames = selectedMemberIds.map(id => {
                    if (id === 'user') return '你';
                    const char = archiveData.characters.find(c => c.id === id);
                    return char ? char.name : null;
                }).filter(Boolean);
                
                groupName = memberNames.slice(0, 3).join('、');
                if (memberNames.length > 3) {
                    groupName += '...';
                }
            }
            
            // 创建新的群聊对象
            const newGroup = {
                id: 'group_' + generateId(),
                name: groupName, // 使用最终确定的 groupName
                isGroup: true,
                members: selectedMemberIds,
                // 【修复】如果上传了头像(tempGroupAvatar有值)，就用它；否则使用默认图标
                avatar: tempGroupAvatar || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cccccc'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E`, 
                lastActivityTime: Date.now(),
                lastMessage: `你创建了群聊，包含${selectedMemberIds.length}位成员`,
                unreadCount: 0,
                // 新增：为群聊添加完整的设置属性，确保后续操作（如设置侧边栏）不会出错
                isAppGroup: false,
                isPinned: false,
                memberAvatars: {},
                memberNicknames: {},
                showGroupNames: true, // 默认显示群成员名称
                contextLength: 20,
                chatBgDay: '',
                chatBgNight: '',
                bubbleCss: '',
                realtimePerception: true,
                aiVisionEnabled: false,
                hideAvatars: false,
                boundWorldBookItems: [],
            };

            // 将群聊添加到 contacts 数组中
            chatAppData.contacts.unshift(newGroup);
            chatAppData.messages[newGroup.id] = [{
                id: 'sys_' + generateId(),
                type: 'system_notice',
                text: '你创建了群聊',
                timestamp: Date.now()
            }];
            
            saveChatData();
            closeCreateGroupPopup();
            renderContactList(); // 刷新联系人列表
            showGlobalToast('群聊创建成功！', { type: 'success' });
        }

        // =============================================
        // === 新增：每日随机天气图标功能 ===
        // =============================================
        (function() {
            // 1. 存储所有天气图标的SVG代码字符串
            // 为了代码整洁，我将长长的SVG代码放在一个数组里
            const weatherIcons = [
                // 0: 晴天
                `<svg t="1767287097812" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1223"><path d="M897.7 544.7H756.2c-15 0-27.2-12.2-27.2-27.2v-10.9c0-15 12.2-27.2 27.2-27.2h141.5c15 0 27.2 12.2 27.2 27.2v10.9c0 15-12.2 27.2-27.2 27.2zM717.6 358.1c-10.6 10.6-27.9 10.6-38.5 0l-7.7-7.7c-10.6-10.6-10.6-27.9 0-38.5l100.1-100.1c10.6-10.6 27.9-10.6 38.5 0l7.7 7.7c10.6 10.6 10.6 27.9 0 38.5L717.6 358.1z m-199.4-52.9h-10.9c-15 0-27.2-12.2-27.2-27.2V136.4c0-15 12.2-27.2 27.2-27.2h10.9c15 0 27.2 12.2 27.2 27.2V278c0 15-12.1 27.2-27.2 27.2z m-172.4 52.9c-10.7 10.6-27.9 10.6-38.6 0L206.8 258c-10.6-10.6-10.6-27.9 0-38.5l7.7-7.7c10.7-10.6 27.9-10.6 38.6 0l100.4 100.1c10.6 10.6 10.7 27.8 0.1 38.4l-0.1 0.1-7.7 7.7z m-50.1 148.5v10.9c0 15-12.2 27.2-27.2 27.2H126.4c-15 0.1-27.3-12.1-27.3-27.1v-11c0-15 12.2-27.2 27.2-27.2h142.1c15.1-0.1 27.3 12 27.3 27.2 0-0.1 0-0.1 0 0z m11.5 159.3c10.7-10.6 27.9-10.6 38.6 0l7.7 7.7c10.6 10.6 10.7 27.8 0.1 38.4l-0.1 0.1-100.4 100.1c-10.7 10.6-27.9 10.6-38.6 0l-7.7-7.7c-10.6-10.6-10.7-27.8-0.1-38.4l0.1-0.1 100.4-100.1z m200.1 52.9h11.1c15 0 27.2 12.2 27.2 27.2v141.5c0 15-12.2 27.2-27.2 27.2h-11.1c-15 0-27.2-12.2-27.2-27.2V746c0-15 12.2-27.2 27.2-27.2z m172.5-52.9c10.7-10.6 27.9-10.6 38.6 0L818.8 766c10.6 10.6 10.6 27.9 0 38.5l-7.7 7.7c-10.7 10.6-27.9 10.6-38.6 0L672 712.1c-10.6-10.6-10.7-27.8-0.1-38.4l0.1-0.1 7.8-7.7zM343.3 512c0 93.2 75.5 168.8 168.7 168.8 93.2 0 168.8-75.5 168.8-168.7v-0.2c0-93.2-75.5-168.7-168.7-168.8S343.3 418.7 343.3 512c0-0.1 0 0 0 0z" fill="#FFCD00" p-id="1224"></path></svg>`,
                // 1: 大雨
                `<svg t="1767287121162" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1436"><path d="M771.7 289.5c90.5 0 163.9 75.4 163.9 165.4 0 84.5-65.4 154.9-147.8 162.9h-541c-92.5-13.1-158.4-94-158.4-189.6 0-89.5 61.8-164.4 145.3-184.5 27.2-98 119.7-173 226.3-173 128.7 0 229.8 107.6 229.8 234.8 0 3-0.5 5.5-0.5 9.1 24.1-14 52.2-25.1 82.4-25.1z" fill="#E5E5E5" p-id="1437"></path><path d="M361.5 786.8c-4.6 0-9.3-1-13.7-3.2-15.6-7.6-22.1-26.4-14.5-42L370 666c7.6-15.6 26.4-22.1 42-14.5 15.6 7.6 22.1 26.4 14.5 42l-36.8 75.6c-5.3 11.2-16.5 17.7-28.2 17.7zM361.5 953.2c-4.6 0-9.3-1-13.7-3.2-15.6-7.6-22.1-26.4-14.5-42l36.8-75.6c7.6-15.6 26.4-22.1 42-14.5 15.6 7.6 22.1 26.4 14.5 42l-36.8 75.6c-5.4 11.2-16.6 17.7-28.3 17.7zM490.1 787.9c-4.6 0-9.3-1-13.7-3.2-15.6-7.6-22.1-26.4-14.5-42l18.5-38c7.6-15.6 26.4-22.1 42-14.5 15.6 7.6 22.1 26.4 14.5 42l-18.5 38c-5.4 11.2-16.6 17.7-28.3 17.7zM490.1 914.5c-4.6 0-9.3-1-13.7-3.2-15.6-7.6-22.1-26.4-14.5-42l18.5-38c7.6-15.6 26.4-22.1 42-14.5 15.6 7.6 22.1 26.4 14.5 42l-18.5 38c-5.4 11.2-16.6 17.7-28.3 17.7zM238.6 787.9c-4.6 0-9.3-1-13.7-3.2-15.6-7.6-22.1-26.4-14.5-42l18.5-38c7.6-15.6 26.4-22.1 42-14.5 15.6 7.6 22.1 26.4 14.5 42l-18.5 38c-5.4 11.2-16.6 17.7-28.3 17.7zM238.6 914.5c-4.6 0-9.3-1-13.7-3.2-15.6-7.6-22.1-26.4-14.5-42l18.5-38c7.6-15.6 26.4-22.1 42-14.5 15.6 7.6 22.1 26.4 14.5 42l-18.5 38c-5.4 11.2-16.6 17.7-28.3 17.7zM741.7 787.9c-4.6 0-9.3-1-13.7-3.2-15.6-7.6-22.1-26.4-14.5-42l18.5-38c7.6-15.6 26.4-22.1 42-14.5 15.6 7.6 22.1 26.4 14.5 42l-18.5 38c-5.4 11.2-16.6 17.7-28.3 17.7zM741.7 914.5c-4.6 0-9.3-1-13.7-3.2-15.6-7.6-22.1-26.4-14.5-42l18.5-38c7.6-15.6 26.4-22.1 42-14.5 15.6 7.6 22.1 26.4 14.5 42l-18.5 38c-5.4 11.2-16.6 17.7-28.3 17.7zM619.4 786.8c-4.6 0-9.3-1-13.7-3.2-15.6-7.6-22.1-26.4-14.5-42L628 666c7.6-15.6 26.4-22.1 42-14.5 15.6 7.6 22.1 26.4 14.5 42l-36.8 75.6c-5.5 11.2-16.7 17.7-28.3 17.7zM619.4 953.2c-4.6 0-9.3-1-13.7-3.2-15.6-7.6-22.1-26.4-14.5-42l36.8-75.6c7.6-15.6 26.4-22.1 42-14.5 15.6 7.6 22.1 26.4 14.5 42l-36.8 75.6c-5.5 11.2-16.7 17.7-28.3 17.7z" fill="#B3E2FF" p-id="1438"></path></svg>`,
                // 2: 中雨 (SVG代码与大雨相同，这里直接复用)
                `<svg t="1767287121162" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1436"><path d="M771.7 289.5c90.5 0 163.9 75.4 163.9 165.4 0 84.5-65.4 154.9-147.8 162.9h-541c-92.5-13.1-158.4-94-158.4-189.6 0-89.5 61.8-164.4 145.3-184.5 27.2-98 119.7-173 226.3-173 128.7 0 229.8 107.6 229.8 234.8 0 3-0.5 5.5-0.5 9.1 24.1-14 52.2-25.1 82.4-25.1z" fill="#E5E5E5" p-id="1437"></path><path d="M361.5 786.8c-4.6 0-9.3-1-13.7-3.2-15.6-7.6-22.1-26.4-14.5-42L370 666c7.6-15.6 26.4-22.1 42-14.5 15.6 7.6 22.1 26.4 14.5 42l-36.8 75.6c-5.3 11.2-16.5 17.7-28.2 17.7zM361.5 953.2c-4.6 0-9.3-1-13.7-3.2-15.6-7.6-22.1-26.4-14.5-42l36.8-75.6c7.6-15.6 26.4-22.1 42-14.5 15.6 7.6 22.1 26.4 14.5 42l-36.8 75.6c-5.4 11.2-16.6 17.7-28.3 17.7zM490.1 787.9c-4.6 0-9.3-1-13.7-3.2-15.6-7.6-22.1-26.4-14.5-42l18.5-38c7.6-15.6 26.4-22.1 42-14.5 15.6 7.6 22.1 26.4 14.5 42l-18.5 38c-5.4 11.2-16.6 17.7-28.3 17.7zM490.1 914.5c-4.6 0-9.3-1-13.7-3.2-15.6-7.6-22.1-26.4-14.5-42l18.5-38c7.6-15.6 26.4-22.1 42-14.5 15.6 7.6 22.1 26.4 14.5 42l-18.5 38c-5.4 11.2-16.6 17.7-28.3 17.7zM238.6 787.9c-4.6 0-9.3-1-13.7-3.2-15.6-7.6-22.1-26.4-14.5-42l18.5-38c7.6-15.6 26.4-22.1 42-14.5 15.6 7.6 22.1 26.4 14.5 42l-18.5 38c-5.4 11.2-16.6 17.7-28.3 17.7zM238.6 914.5c-4.6 0-9.3-1-13.7-3.2-15.6-7.6-22.1-26.4-14.5-42l18.5-38c7.6-15.6 26.4-22.1 42-14.5 15.6 7.6 22.1 26.4 14.5 42l-18.5 38c-5.4 11.2-16.6 17.7-28.3 17.7zM741.7 787.9c-4.6 0-9.3-1-13.7-3.2-15.6-7.6-22.1-26.4-14.5-42l18.5-38c7.6-15.6 26.4-22.1 42-14.5 15.6 7.6 22.1 26.4 14.5 42l-18.5 38c-5.4 11.2-16.6 17.7-28.3 17.7zM741.7 914.5c-4.6 0-9.3-1-13.7-3.2-15.6-7.6-22.1-26.4-14.5-42l18.5-38c7.6-15.6 26.4-22.1 42-14.5 15.6 7.6 22.1 26.4 14.5 42l-18.5 38c-5.4 11.2-16.6 17.7-28.3 17.7zM619.4 786.8c-4.6 0-9.3-1-13.7-3.2-15.6-7.6-22.1-26.4-14.5-42L628 666c7.6-15.6 26.4-22.1 42-14.5 15.6 7.6 22.1 26.4 14.5 42l-36.8 75.6c-5.5 11.2-16.7 17.7-28.3 17.7zM619.4 953.2c-4.6 0-9.3-1-13.7-3.2-15.6-7.6-22.1-26.4-14.5-42l36.8-75.6c7.6-15.6 26.4-22.1 42-14.5 15.6 7.6 22.1 26.4 14.5 42l-36.8 75.6c-5.5 11.2-16.7 17.7-28.3 17.7z" fill="#B3E2FF" p-id="1438"></path></svg>`,
                // 3: 小雨
                `<svg t="1767287166208" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1864"><path d="M766.9 293.6c88.8 0 160.9 74 160.9 162.4 0 82.9-64.2 152-145.1 159.9H251.6c-90.8-12.8-155.5-92.3-155.5-186.1 0-87.9 60.7-161.4 142.6-181.1 26.7-96.2 117.5-169.8 222.1-169.8 126.4 0 225.6 105.6 225.6 230.5 0 3-0.5 5.4-0.5 8.9 23.8-13.8 51.4-24.7 81-24.7z" fill="#E5E5E5" p-id="1865"></path><path d="M493.9 781.7c-4.5 0-9.1-1-13.5-3.1-15.3-7.5-21.7-25.9-14.3-41.3l36.1-74.2c7.5-15.3 25.9-21.7 41.3-14.3s21.7 25.9 14.3 41.3l-36.1 74.2c-5.3 11.1-16.3 17.4-27.8 17.4zM493.9 945.1c-4.5 0-9.1-1-13.5-3.1-15.3-7.5-21.7-25.9-14.3-41.3l36.1-74.2c7.5-15.3 25.9-21.7 41.3-14.3s21.7 25.9 14.3 41.3l-36.1 74.2c-5.3 11-16.3 17.4-27.8 17.4z" fill="#B3E2FF" p-id="1866"></path></svg>`,
                // 4: 下雪
                `<svg t="1767287181627" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2126"><path d="M761.5 283.8c86.9 0 157.5 72.5 157.5 158.9 0 81.2-62.8 148.8-142 156.5H257.2C168.3 586.6 105 508.9 105 417.1c0-86 59.4-158 139.6-177.3 26.1-94.2 115-166.2 217.4-166.2 123.7 0 220.8 103.4 220.8 225.6 0 2.9-0.5 5.3-0.5 8.7 23.2-13.5 50.2-24.1 79.2-24.1z" fill="#E5E5E5" p-id="2127"></path><path d="M583.4 827.2h-39.5l28-28c7.4-7.4 7.4-19.4 0-26.8-7.4-7.4-19.4-7.4-26.8 0l-28 28v-39.5c0-10.5-8.5-19-19-19s-19 8.5-19 19v39.5l-28-28c-7.4-7.4-19.4-7.4-26.8 0-7.4 7.4-7.4 19.4 0 26.8l28 28h-39.5c-10.5 0-19 8.5-19 19s8.5 19 19 19h39.5l-28 28c-7.4 7.4-7.4 19.4 0 26.8 3.7 3.7 8.6 5.6 13.4 5.6s9.7-1.9 13.4-5.6l28-28v39.5c0 10.5 8.5 19 19 19s19-8.5 19-19V892l28 28c3.7 3.7 8.6 5.6 13.4 5.6s9.7-1.9 13.4-5.6c7.4-7.4 7.4-19.4 0-26.8l-28-28h39.5c10.5 0 19-8.5 19-19s-8.5-19-19-19zM412.2 731.3c0-10.5-8.5-19-19-19h-39.5l28-28c7.4-7.4 7.4-19.4 0-26.8-7.4-7.4-19.4-7.4-26.8 0l-28 28V646c0-10.5-8.5-19-19-19s-19 8.5-19 19v39.5l-28-28c-7.4-7.4-19.4-7.4-26.8 0-7.4 7.4-7.4 19.4 0 26.8l28 28h-39.5c-10.5 0-19 8.5-19 19s8.5 19 19 19h39.5l-28 28c-7.4 7.4-7.4 19.4 0 26.8 3.7 3.7 8.6 5.6 13.4 5.6s9.7-1.9 13.4-5.6l28-28v39.5c0 10.5 8.5 19 19 19s19-8.5 19-19V777l28 28c3.7 3.7 8.6 5.6 13.4 5.6s9.7-1.9 13.4-5.6c7.4-7.4 7.4-19.4 0-26.8l-28-28h39.5c10.5 0 19-8.4 19-18.9zM773.1 712.3h-39.5l28-28c7.4-7.4 7.4-19.4 0-26.8-7.4-7.4-19.4-7.4-26.8 0l-28 28V646c0-10.5-8.5-19-19-19s-19 8.5-19 19v39.5l-28-28c-7.4-7.4-19.4-7.4-26.8 0-7.4 7.4-7.4 19.4 0 26.8l28 28h-39.5c-10.5 0-19 8.5-19 19s8.5 19 19 19H642l-28 28c-7.4 7.4-7.4 19.4 0 26.8 3.7 3.7 8.6 5.6 13.4 5.6s9.7-1.9 13.4-5.6l28-28v39.5c0 10.5 8.5 19 19 19s19-8.5 19-19V777l28 28c3.7 3.7 8.6 5.6 13.4 5.6 4.8 0 9.7-1.9 13.4-5.6 7.4-7.4 7.4-19.4 0-26.8l-28-28h39.5c10.5 0 19-8.5 19-19 0-10.4-8.5-18.9-19-18.9z" fill="#B3E2FF" p-id="2128"></path></svg>`,
                // 5: 大风
                `<svg t="1767287220969" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2509"><path d="M171.8 554.6h-57.2c-14.5 0-26.3-11.8-26.3-26.3s11.8-26.3 26.3-26.3h57.2c14.5 0 26.3 11.8 26.3 26.3 0 14.6-11.8 26.3-26.3 26.3zM572.7 554.6l-313.1-0.6c-14.5 0-26.3-11.8-26.3-26.4 0-14.5 11.8-26.3 26.3-26.3h0.1l313 0.6c34.7 0 62.9-36.2 62.9-80.6 0-30.6-13.4-58.2-35-72.1-12.2-7.9-15.7-24.2-7.9-36.4 7.9-12.2 24.2-15.7 36.4-7.9 36.5 23.5 59.1 68.1 59.1 116.3 0.1 73.7-51.7 133.4-115.5 133.4z" fill="#FFCD00" p-id="2510"></path><path d="M453.5 403.1H114.6c-14.5 0-26.3-11.8-26.3-26.3s11.8-26.3 26.3-26.3h338.9c21.8 0 40.3-24.5 40.3-53.4s-18.4-53.4-40.3-53.4c-14.5 0-26.3-11.8-26.3-26.3s11.8-26.3 26.3-26.3c51.2 0 92.9 47.6 92.9 106s-41.7 106-92.9 106z" fill="#FFCD00" p-id="2511"></path><path d="M783.8 227.4m-36.2 0a36.2 36.2 0 1 0 72.4 0 36.2 36.2 0 1 0-72.4 0Z" fill="#FFCD00" p-id="2512"></path><path d="M783.8 415.9m-36.2 0a36.2 36.2 0 1 0 72.4 0 36.2 36.2 0 1 0-72.4 0Z" fill="#FFCD00" p-id="2513"></path><path d="M783.8 604.4m-36.2 0a36.2 36.2 0 1 0 72.4 0 36.2 36.2 0 1 0-72.4 0Z" fill="#FFCD00" p-id="2514"></path><path d="M783.8 792.9m-36.2 0a36.2 36.2 0 1 0 72.4 0 36.2 36.2 0 1 0-72.4 0Z" fill="#FFCD00" p-id="2515"></path><path d="M899.6 326.4m-36.2 0a36.2 36.2 0 1 0 72.4 0 36.2 36.2 0 1 0-72.4 0Z" fill="#FFCD00" p-id="2516"></path><path d="M899.6 514.9m-36.2 0a36.2 36.2 0 1 0 72.4 0 36.2 36.2 0 1 0-72.4 0Z" fill="#FFCD00" p-id="2517"></path><path d="M899.6 703.5m-36.2 0a36.2 36.2 0 1 0 72.4 0 36.2 36.2 0 1 0-72.4 0Z" fill="#FFCD00" p-id="2518"></path><path d="M552.6 833h-438c-14.5 0-26.3-11.8-26.3-26.3s11.8-26.3 26.3-26.3h438c21.8 0 40.3-24.5 40.3-53.4 0-18.7-7.3-35.7-19.6-45.6-11.3-9.1-13.1-25.7-3.9-37 9.1-11.3 25.7-13.1 37-3.9 24.5 19.8 39.1 52.2 39.1 86.6 0 58.3-41.6 105.9-92.9 105.9z" fill="#FFCD00" p-id="2519"></path><path d="M475.1 696.1H114.6c-14.5 0-26.3-11.8-26.3-26.3s11.8-26.3 26.3-26.3h360.5c14.5 0 26.3 11.8 26.3 26.3 0 14.6-11.8 26.3-26.3 26.3z" fill="#FFCD00" p-id="2520"></path></svg>`,
                // 6: 阴天
                `<svg t="1767287249948" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2728"><path d="M791.8 488.2c97.5 0 176.6 81.3 176.6 178.3 0 91-70.4 166.9-159.3 175.5h-583C126.5 827.9 55.5 740.7 55.5 637.7c0-96.4 66.6-177.2 156.6-198.8 29.3-105.7 129-186.4 243.8-186.4 138.7 0 247.6 115.9 247.6 253 0 3.3-0.5 6-0.5 9.8 26-15.2 56.3-27.1 88.8-27.1z" fill="#E5E5E5" p-id="2729"></path></svg>`
            ];

            // 2. 定义设置天气图标的函数
            function setDailyWeatherIcon() {
                const container = document.getElementById('weather-icon-container');
                if (!container) {
                    console.error('Weather icon container not found!');
                    return;
                }

                // 使用日期（年、月、日）作为种子，确保每天的图标是固定且随机的
                const today = new Date();
                const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
                
                // 根据种子计算一个当天的“随机”索引
                // 使用取模运算，结果会是 0 到 (数组长度-1) 之间的一个整数
                const randomIndex = seed % weatherIcons.length;
                
                // 获取并设置SVG内容
                const selectedIconSVG = weatherIcons[randomIndex];
                container.innerHTML = selectedIconSVG;
            }

            // 3. 在DOM加载完成后执行函数
            // 使用 DOMContentLoaded 事件确保在操作DOM元素之前，它们已经存在于页面上
            document.addEventListener('DOMContentLoaded', setDailyWeatherIcon);
        })();

        // =====================================
        // === 新增：卡片相框上传功能逻辑 ===
        // =====================================
        // [新增] 页面加载时，尝试从 localStorage 加载已保存的小组件图片
        async function loadWidgetImage() {
            const savedImage = await localforage.getItem('homeScreenWidgetImage');
            if (savedImage) {
                const uploadContainer = document.getElementById('photo-upload-container');
                const uploadPlaceholderText = document.getElementById('photo-upload-placeholder-text');
                if (uploadContainer && uploadPlaceholderText) {
                    uploadContainer.style.backgroundImage = `url(${savedImage})`;
                    uploadPlaceholderText.style.display = 'none';
                    uploadContainer.style.border = 'none';
                }
            }
        }
        // [新增] 在脚本末尾调用加载函数
        loadWidgetImage();
        const uploadContainer = document.getElementById('photo-upload-container');
        const uploadInput = document.getElementById('photo-upload-input');
        const uploadPlaceholderText = document.getElementById('photo-upload-placeholder-text');

        if (uploadContainer && uploadInput) {
            // 点击容器时，触发隐藏的input点击事件
            uploadContainer.addEventListener('click', () => {
                uploadInput.click();
            });

            // 当用户选择了文件
            uploadInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    try {
                        const compressedDataUrl = await compressImage(file);
                        uploadContainer.style.backgroundImage = `url(${compressedDataUrl})`;
                        await localforage.setItem('homeScreenWidgetImage', compressedDataUrl);
                        if (uploadPlaceholderText) {
                            uploadPlaceholderText.style.display = 'none';
                        }
                        uploadContainer.style.border = 'none';
                    } catch (error) {
                        console.error("小组件图片压缩失败:", error);
                        showCustomAlert("图片压缩失败，请换张图片或稍后再试。");
                    };
                }
            });
        }
        // ===================================
        // === 20. 快捷回复功能逻辑 (新增) ===
        // ===================================
        document.addEventListener('DOMContentLoaded', function() {
            // --- 核心修复：将角色卡导入的事件监听移到此处 ---
            const cardImportInput = document.getElementById('character-card-import-input');
            if (cardImportInput) {
                cardImportInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        handleCharacterImport(file);
                    }
                    // 重置输入框，以便用户可以再次选择同一个文件
                    e.target.value = null; 
                });
            }
            // --- 修复结束 ---
            
            let quickReplyData = []; // 用于存储快捷回复数据 {id, title, content}
            const QUICK_REPLY_STORAGE_KEY = 'quickReplyData';

            // 获取 DOM 元素
            const quickReplyOverlay = document.getElementById('quick-reply-overlay');
            const quickReplyPopup = document.getElementById('quick-reply-popup');
            const addQuickReplyBtn = document.getElementById('add-quick-reply-btn');
            const quickReplyList = document.getElementById('quick-reply-list');
            
            const formOverlay = document.getElementById('quick-reply-form-overlay');
            const formTitle = document.getElementById('quick-reply-form-title');
            const formTitleInput = document.getElementById('quick-reply-form-title-input');
            const formTextarea = document.getElementById('quick-reply-form-textarea');
            const saveFormBtn = document.getElementById('save-quick-reply-form');
            const cancelFormBtn = document.getElementById('cancel-quick-reply-form');
            let editingReplyId = null; // 用于标记正在编辑的回复ID

            // 从 localforage 加载数据
            async function loadQuickReplyData() {
                const data = await localforage.getItem(QUICK_REPLY_STORAGE_KEY);
                quickReplyData = data ? JSON.parse(data) : [];
            }

            // 保存数据到 localforage
            async function saveQuickReplyData() {
                await localforage.setItem(QUICK_REPLY_STORAGE_KEY, JSON.stringify(quickReplyData));
            }

            // 渲染快捷回复列表
            function renderQuickReplyList() {
                quickReplyList.innerHTML = '';
                if (quickReplyData.length === 0) {
                    quickReplyList.innerHTML = `<span class="empty-text" style="text-align:center; display:block; padding: 40px 0;">点击右上角 + 添加一条快捷回复</span>`;
                    return;
                }

                quickReplyData.forEach(reply => {
                    const card = document.createElement('div');
                    card.className = 'quick-reply-card';
                    card.dataset.id = reply.id;
                    card.innerHTML = `
                        <span class="quick-reply-title">${reply.title}</span>
                        <div class="quick-reply-actions">
                            <button class="edit-quick-reply-btn" title="编辑">
                                <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                            </button>
                            <button class="delete-quick-reply-btn" title="删除">
                               <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                            </button>
                        </div>
                    `;
                    quickReplyList.appendChild(card);
                });
            }
            
            // 打开和关闭主悬浮窗
            window.openQuickReplyPopup = async function() { // 改为全局函数，以便其他地方调用
                await loadQuickReplyData();
                renderQuickReplyList();
                quickReplyOverlay.classList.add('visible');
            }

            function closeQuickReplyPopup() {
                quickReplyOverlay.classList.remove('visible');
            }

            // 打开和关闭编辑/添加表单
            function openQuickReplyForm(reply = null) {
                if (reply) { // 编辑模式
                    editingReplyId = reply.id;
                    formTitle.textContent = '编辑快捷回复';
                    formTitleInput.value = reply.title;
                    formTextarea.value = reply.content;
                } else { // 添加模式
                    editingReplyId = null;
                    formTitle.textContent = '添加快捷回复';
                    formTitleInput.value = '';
                    formTextarea.value = '';
                }
                formOverlay.classList.add('visible');
            }
            
            function closeQuickReplyForm() {
                formOverlay.classList.remove('visible');
            }
            
            // 发送用户消息的辅助函数
            function sendUserMessage(contactId, text) {
                const messages = chatAppData.messages[contactId] || [];
                const newMessage = { id: generateId(), text, sender: 'me', timestamp: Date.now() };
                messages.push(newMessage);
                
                const contactToUpdate = chatAppData.contacts.find(c => c.id === contactId);
                if (contactToUpdate) {
                    contactToUpdate.lastMessage = text;
                    contactToUpdate.lastActivityTime = Date.now();
                }

                saveChatData();
                renderChatRoom(contactId);
                
                // 保持输入框焦点，以便移动端键盘不收回
                const chatInput = document.getElementById('chat-input');
                if(chatInput) setTimeout(() => chatInput.focus(), 0);
            }

            // --- 绑定事件 ---

            // 点击遮罩层关闭
            quickReplyOverlay.addEventListener('click', (e) => {
                if (e.target === quickReplyOverlay) {
                    closeQuickReplyPopup();
                }
            });
            
            // 点击添加按钮
            addQuickReplyBtn.addEventListener('click', () => {
                openQuickReplyForm();
            });

            // 列表区域的事件委托
            quickReplyList.addEventListener('click', (e) => {
                const card = e.target.closest('.quick-reply-card');
                const editBtn = e.target.closest('.edit-quick-reply-btn');
                const deleteBtn = e.target.closest('.delete-quick-reply-btn');
                
                if (!card) return;
                const replyId = card.dataset.id;
                const reply = quickReplyData.find(r => r.id === replyId);

                if (editBtn) { // 点击编辑
                    e.stopPropagation();
                    openQuickReplyForm(reply);
                } else if (deleteBtn) { // 点击删除
                    e.stopPropagation();
                    showCustomConfirm(`确定要删除快捷回复 "${reply.title}" 吗？`, async () => {
                        quickReplyData = quickReplyData.filter(r => r.id !== replyId);
                        await saveQuickReplyData();
                        renderQuickReplyList();
                        showGlobalToast('删除成功', { type: 'success' });
                    });
                } else { // 点击卡片本身，发送消息
                    const currentContactId = document.querySelector('.chat-contact-title')?.dataset.contactId;
                    if (currentContactId && reply) {
                        sendUserMessage(currentContactId, reply.content);
                        closeQuickReplyPopup();
                    } else {
                        showCustomAlert('无法确定当前聊天对象。');
                    }
                }
            });

            // 表单的保存和取消按钮
            saveFormBtn.addEventListener('click', async () => {
                const title = formTitleInput.value.trim();
                const content = formTextarea.value.trim();
                if (!title || !content) {
                    showCustomAlert('标题和内容均不能为空！');
                    return;
                }

                if (editingReplyId) { // 编辑
                    const index = quickReplyData.findIndex(r => r.id === editingReplyId);
                    if (index !== -1) {
                        quickReplyData[index].title = title;
                        quickReplyData[index].content = content;
                    }
                } else { // 添加
                    quickReplyData.unshift({
                        id: 'qr_' + generateId(),
                        title: title,
                        content: content
                    });
                }
                await saveQuickReplyData();
                renderQuickReplyList();
                closeQuickReplyForm();
            });
            
            cancelFormBtn.addEventListener('click', closeQuickReplyForm);
            formOverlay.addEventListener('click', (e) => {
                if (e.target === formOverlay) closeQuickReplyForm();
            });

            // 初始化加载数据
            loadQuickReplyData();
        });

    // 定位功能悬浮窗控制函数
    function showLocationPopup() {
        const overlay = document.getElementById('location-overlay');
        overlay.classList.add('visible');
    }

    function hideLocationPopup() {
        const overlay = document.getElementById('location-overlay');
        overlay.classList.remove('visible');
    }

    // 初始化定位功能悬浮窗事件
    function initLocationPopup() {
        const overlay = document.getElementById('location-overlay');
        const closeBtn = document.getElementById('location-close-btn');
        
        if (overlay && closeBtn) {
            // 点击关闭按钮关闭悬浮窗
            closeBtn.addEventListener('click', hideLocationPopup);
            
            // 点击遮罩层关闭悬浮窗
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    hideLocationPopup();
                }
            });
        }
    }
            // === 新增：AI发起线下模式的功能 ===
        function showAiOfflinePrompt(contactId) {
            const overlay = document.getElementById('ai-offline-prompt-overlay');
            const yesBtn = document.getElementById('ai-offline-confirm-yes');
            const noBtn = document.getElementById('ai-offline-confirm-no');
            
            if (!overlay || !yesBtn || !noBtn) return;

            const close = () => overlay.classList.remove('visible');

            // 使用克隆节点法，防止重复绑定事件
            const newYesBtn = yesBtn.cloneNode(true);
            yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);
            newYesBtn.onclick = () => {
                close();
                const contact = chatAppData.contacts.find(c => c.id === contactId);
                if (contact) {
                    // 更新状态并添加进入线下模式的胶囊
                    contact.offlineMode = true;
                    const modeMessage = {
                        id: 'mode_switch_' + generateId(),
                        type: 'mode_switch',
                        text: '已进入线下模式', // 这段文本不会显示，只作为标记
                        mode: 'offline',
                        timestamp: Date.now()
                    };
                    if (!chatAppData.messages[contactId]) {
                        chatAppData.messages[contactId] = [];
                    }
                    chatAppData.messages[contactId].push(modeMessage);
                    saveChatData();
                    renderChatRoom(contactId); // 刷新聊天室以显示胶囊
                }
            };

            const newNoBtn = noBtn.cloneNode(true);
            noBtn.parentNode.replaceChild(newNoBtn, noBtn);
            newNoBtn.onclick = close;

            // 点击遮罩层也可以关闭
            overlay.onclick = (e) => {
                if(e.target === overlay) close();
            };

            overlay.classList.add('visible');
        }


        // === 新增：转账卡片点击处理函数 ===
        function openTransferActionPopup(cardElement) {
            const overlay = document.getElementById('transfer-action-overlay');
            const amountEl = document.getElementById('transfer-action-amount');
            const descEl = document.getElementById('transfer-action-description');
            const returnBtn = document.getElementById('transfer-action-return');
            const acceptBtn = document.getElementById('transfer-action-accept');

            const messageId = cardElement.dataset.messageId;
            const amount = cardElement.dataset.amount;
            const description = cardElement.dataset.description;

            // 填充并显示弹窗
            amountEl.textContent = `¥${parseFloat(amount).toFixed(2)}`;
            descEl.textContent = description || '无说明';
            overlay.classList.add('visible');

            // 使用克隆节点法安全地绑定事件，防止重复监听
            const newReturnBtn = returnBtn.cloneNode(true);
            returnBtn.parentNode.replaceChild(newReturnBtn, returnBtn);
            newReturnBtn.onclick = () => handleTransferAction(messageId, 'returned');
            
            const newAcceptBtn = acceptBtn.cloneNode(true);
            acceptBtn.parentNode.replaceChild(newAcceptBtn, acceptBtn);
            newAcceptBtn.onclick = () => handleTransferAction(messageId, 'accepted');

            // 点击遮罩层关闭弹窗
            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('visible');
                }
            };
        }

        async function handleTransferAction(messageId, status) {
            const overlay = document.getElementById('transfer-action-overlay');
            overlay.classList.remove('visible');

            const card = document.querySelector(`.transfer-card[data-message-id="${messageId}"]`);
            if (!card) return;

            // 1. 更新UI
            card.classList.add('processed');
            card.style.cursor = 'default';
            card.onclick = null; // 移除点击事件
            const statusEl = card.querySelector('.card-status');
            if (statusEl) {
                statusEl.textContent = status === 'accepted' ? '已收下' : '已退回';
            }

            // 2. 更新数据模型
            let contactId = null;
            // 遍历查找消息所属的联系人ID
            for (const cId in chatAppData.messages) {
                if (chatAppData.messages[cId].some(m => m.id === messageId)) {
                    contactId = cId;
                    break;
                }
            }
            if (!contactId) return;

            const message = chatAppData.messages[contactId].find(m => m.id === messageId);
            if (message) {
                // 为消息对象添加一个新属性来记录状态
                message.transferStatus = status;
                await saveChatData(); // 保存更改
            }
        }

    // 页面加载时初始化定位悬浮窗事件
    document.addEventListener('DOMContentLoaded', initLocationPopup);
