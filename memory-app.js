// ===================================
// === 13. 记忆 App 完整逻辑 (新增) ===
// ===================================
const memoryAppIcon = document.getElementById('app-memory');

// 渲染聊天收藏馆页面
const renderCollectionHall = () => {
    const container = document.querySelector('.memory-page.collection-hall');
    if (!container) return;
    
    const collections = JSON.parse(localStorage.getItem('memoryCollections')) || [];

    if (collections.length === 0) {
        container.innerHTML = `<span class="empty-text" style="text-align:center; display:block; padding: 40px 0;">聊天收藏馆是空的</span>`;
        return;
    }

    container.innerHTML = collections.map(col => `
        <div class="collection-card" data-collection-id="${col.id}">
            <div class="chat-contact-avatar" style="background-image: url('${col.charAvatar}')"></div>
            <div style="flex-grow:1;">
                <div class="collection-card-char-name">${col.charName}</div>
                <div class="collection-card-info">${col.messages.length} 条消息 · ${new Date(col.timestamp).toLocaleString()}</div>
            </div>
        </div>
    `).join('');

    // 为每个卡片绑定点击事件
    container.querySelectorAll('.collection-card').forEach(card => {
        card.addEventListener('click', () => {
            openCollectionDetail(card.dataset.collectionId);
        });
    });
};

// 渲染帖子收藏页面
const renderInstanceMemory = () => {
    const container = document.querySelector('.memory-page.instance-memory');
    if (!container) return;
    container.innerHTML = `<span class="empty-text" style="text-align:center; display:block; padding: 40px 0;">帖子收藏功能待开发...</span>`;
};

// 打开记忆App
memoryAppIcon.addEventListener('click', function(e) {
    const contentHTML = `
        <div class="memory-page collection-hall active"></div>
        <div class="memory-page instance-memory"></div>
        <div class="memory-page album-memory"></div>

        <div class="memory-nav-bar">
            <button class="memory-nav-btn active" id="memory-nav-collection">
                <svg t="1767699709538" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2244"><path d="M358.4 379.733333c-51.2 51.2-51.2 132.266667 0 179.2l119.466667 119.466667c17.066667 17.066667 42.666667 17.066667 59.733333 0l119.466667-123.733333c51.2-51.2 51.2-132.266667 0-179.2-34.133333-34.133333-98.133333-46.933333-145.066667-17.066667-51.2-25.6-110.933333-17.066667-153.6 21.333333z m59.733333 119.466667c-17.066667-17.066667-17.066667-42.666667 0-59.733333 17.066667-17.066667 42.666667-17.066667 59.733334 0 17.066667 17.066667 42.666667 17.066667 59.733333 0 17.066667-17.066667 42.666667-17.066667 59.733333 0 17.066667 17.066667 17.066667 42.666667 0 59.733333l-85.333333 89.6-93.866667-89.6zM85.333333 512c0 234.666667 192 426.666667 426.666667 426.666667h384c17.066667 0 34.133333-8.533333 42.666667-25.6 8.533333-17.066667 4.266667-34.133333-8.533334-46.933334l-85.333333-85.333333c64-76.8 98.133333-170.666667 98.133333-268.8 0-234.666667-192-426.666667-426.666666-426.666667S85.333333 277.333333 85.333333 512z m183.466667 243.2c-132.266667-132.266667-132.266667-349.866667 0-482.133333s349.866667-132.266667 482.133333 0 132.266667 349.866667 0 482.133333c-17.066667 17.066667-17.066667 42.666667 0 59.733333l38.4 38.4H512c-89.6 0-179.2-34.133333-243.2-98.133333z" p-id="2245"></path></svg>
                <span>聊天</span>
            </button>
            <button class="memory-nav-btn" id="memory-nav-instance">
                <svg t="1767714505308" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1601" width="16" height="16"><path d="M766.67 818.38H150.84c-36.6 0-66.37-29.62-66.37-66.02V321.24c0-17.53 14.28-31.73 31.9-31.73s31.9 14.21 31.9 31.73v431.12c0 1.34 1.23 2.56 2.57 2.56h615.84c1.35 0 2.57-1.22 2.57-2.56V312.78c0-17.53 14.28-31.73 31.9-31.73s31.9 14.21 31.9 31.73v439.58c-0.01 36.41-29.78 66.02-66.38 66.02z" p-id="1602"></path><path d="M575.72 327.59H337.54c-17.62 0-31.9-14.21-31.9-31.73 0-17.53 14.28-31.73 31.9-31.73h238.18c17.62 0 31.9 14.21 31.9 31.73s-14.28 31.73-31.9 31.73zM790.5 924.16H238.87c-64.78 0-68.06-45.46-68.06-54.58 0-17.53 14.28-31.73 31.9-31.73 14.43 0 26.62 9.53 30.56 22.61 1.48 0.14 3.33 0.24 5.6 0.24H790.5c67.49 0 89.33-57.01 89.33-84.61l0.02-373.6c0.01-2.28 0.03-5.31-0.05-8.11-10.81-5.08-18.28-16.03-18.28-28.71 0-17.53 14.28-31.73 31.9-31.73 17.07 0 28.07 7.42 34.29 13.65 16.17 16.18 16.04 38.78 15.94 55.28l-0.01 3.41V776.1c-0.01 59.7-48.68 148.06-153.14 148.06zM893.42 397.4h0.04-0.04z" p-id="1603"></path><path d="M117.69 352.51c-6.39 0-12.85-1.91-18.46-5.87-14.36-10.16-17.72-29.97-7.51-44.25l114.39-160.03c5.86-8.2 15.28-13.15 25.39-13.34 10.08-0.14 19.72 4.4 25.88 12.37L361.31 275.7c10.75 13.89 8.14 33.81-5.82 44.5-13.96 10.69-33.99 8.1-44.74-5.79l-77.62-100.33-89.41 125.08c-6.23 8.71-16.05 13.35-26.03 13.35zM801.22 347.51c-9.73 0-19.34-4.41-25.6-12.77L680.66 208 600.5 314.13c-10.58 14.01-30.58 16.84-44.67 6.31-14.08-10.53-16.92-30.42-6.34-44.43l105.77-140.03c6.03-7.98 15.48-12.67 25.5-12.67h0.06c10.05 0.02 19.51 4.75 25.52 12.77l120.43 160.74c10.53 14.05 7.61 33.93-6.52 44.41a31.891 31.891 0 0 1-19.03 6.28zM312.02 585.68c-17.62 0-31.9-14.21-31.9-31.73V465.1c0-17.53 14.28-31.73 31.9-31.73s31.9 14.21 31.9 31.73v88.85c0 17.52-14.29 31.73-31.9 31.73zM622.51 581.45c-17.62 0-31.9-14.21-31.9-31.73v-88.85c0-17.53 14.28-31.73 31.9-31.73s31.9 14.21 31.9 31.73v88.85c0 17.52-14.28 31.73-31.9 31.73z" p-id="1604"></path></svg>
                <span>帖子</span>
            </button>
            <button class="memory-nav-btn" id="memory-nav-album">
                <svg t="1767699942234" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2801"><path d="M668.1 227.3H207.8C93.2 227.3 0 320.6 0 435.1v296.4c0 114.6 93.2 207.8 207.8 207.8H668c114.6 0 207.8-93.2 207.8-207.8V435.1c0.1-114.5-93.1-207.8-207.7-207.8z m139.8 504.2c0 77.1-62.7 139.8-139.8 139.8H207.8c-57.3 0-106.7-34.7-128.3-84.2l217.8-217.8 134.2 134.2c13.3 13.3 34.8 13.3 48.1 0l88.2-88.2 96.6 96.6c13.3 13.3 34.8 13.3 48.1 0 13.3-13.3 13.3-34.8 0-48.1L592 543.2c-13.3-13.3-34.8-13.3-48.1 0l-88.2 88.2-134.3-134.2c-13.3-13.3-34.8-13.3-48.1 0L68 702.6V435.1c0-77.1 62.7-139.8 139.8-139.8H668c77.1 0 139.8 62.7 139.8 139.8v296.4z" p-id="2802"></path><path d="M627.440143 485.154298a53.1 53.1 0 1 0 75.093429-75.096051 53.1 53.1 0 1 0-75.093429 75.096051Z" p-id="2803"></path><path d="M675.1 84.6h-288c-18.8 0-34 15.2-34 34s15.2 34 34 34h288c154.9 0 280.9 126 280.9 280.9v149.8c0 18.8 15.2 34 34 34s34-15.2 34-34V433.6c0-192.4-156.5-349-348.9-349z" p-id="2804"></path></svg>
                <span>相册</span>
            </button>
        </div>
    `;

    openModal('记忆', contentHTML, this);

    // 首次打开时，渲染聊天收藏馆
    renderCollectionHall();

    // 绑定导航按钮事件
    const collectionBtn = document.getElementById('memory-nav-collection');
    const instanceBtn = document.getElementById('memory-nav-instance');
    const albumBtn = document.getElementById('memory-nav-album'); // 新增

    const collectionPage = document.querySelector('.memory-page.collection-hall');
    const instancePage = document.querySelector('.memory-page.instance-memory');
    const albumPage = document.querySelector('.memory-page.album-memory'); // 新增

    const allBtns = [collectionBtn, instanceBtn, albumBtn];
    const allPages = [collectionPage, instancePage, albumPage];

    const switchTab = (activeIndex) => {
        allBtns.forEach((btn, index) => {
            btn.classList.toggle('active', index === activeIndex);
        });
        allPages.forEach((page, index) => {
            page.classList.toggle('active', index === activeIndex);
        });
    };

    collectionBtn.addEventListener('click', () => {
        switchTab(0);
        renderCollectionHall();
    });

    instanceBtn.addEventListener('click', () => {
        switchTab(1);
        renderInstanceMemory();
    });

    albumBtn.addEventListener('click', () => {
        switchTab(2);
        // 渲染相册页面的函数（这里先放一个占位符）
        albumPage.innerHTML = `<span class="empty-text" style="text-align:center; display:block; padding: 40px 0;">相册功能待开发...</span>`;
    });

});

// 打开收藏详情弹窗
const openCollectionDetail = (collectionId) => {
    const collections = JSON.parse(localStorage.getItem('memoryCollections')) || [];
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return;

    const overlay = document.getElementById('collection-detail-overlay');
    const modalBody = document.getElementById('collection-detail-body');
    const modalTitle = document.getElementById('collection-detail-title'); // 【修复】获取标题元素
    
    modalTitle.textContent = `与 ${collection.charName} 的收藏`; // 【修复】设置标题

    const messagesHTML = collection.messages.map(msg => {
        const isSent = msg.sender === 'me';
        const avatarUrl = isSent ? collection.userAvatar : collection.charAvatar;
        let quoteHTML = msg.quote ? `<div class="quoted-message-in-bubble">${msg.quote.text}</div>` : '';

        // 【核心修改】根据消息类型生成不同的内容
        let bubbleContentHTML = '';
        if (msg.type === 'voice') {
            const isPlaying = !globalAudioPlayer.paused && globalAudioPlayer.dataset.playingMessageId === msg.id;
            bubbleContentHTML = `
                <div class="message-voice-bar ${isPlaying ? 'playing' : ''}" data-message-id="${msg.id}">
                     <div class="voice-wave-icon">
                        <div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div>
                    </div>
                    <span class="duration">${msg.duration}</span>
                </div>
                `;
        } else if (msg.type === 'image') {
            const imageClass = msg.isSticker ? 'message-sticker' : 'message-image';
            bubbleContentHTML = `<img src="${msg.url}" class="${imageClass}" alt="图片">`;
        } else {
            bubbleContentHTML = (msg.text || '').replace(/\n/g, '<br>');
        }
        
        return `
        <div class="message-line ${isSent ? 'sent' : 'received'}">
            <div class="chat-avatar" style="background-image: url('${avatarUrl}')"></div>
            <div class="chat-bubble ${isSent ? 'sent' : 'received'} ${msg.type === 'image' ? 'image-bubble' : ''}">
                ${quoteHTML}
                ${bubbleContentHTML}
            </div>
        </div>
        `;
    }).join('');

    modalBody.innerHTML = messagesHTML;
        const newModalBody = modalBody.cloneNode(true);
    modalBody.parentNode.replaceChild(newModalBody, modalBody);
    newModalBody.addEventListener('click', e => {
        const voiceBar = e.target.closest('.message-voice-bar');
        if (voiceBar) {
            const msgId = voiceBar.dataset.messageId;
            const message = collection.messages.find(m => m.id === msgId);
            if (message && message.audioDataUrl) {
                if (!globalAudioPlayer.paused && globalAudioPlayer.dataset.playingMessageId === msgId) {
                    globalAudioPlayer.pause();
                } else {
                    if (!globalAudioPlayer.paused) {
                        globalAudioPlayer.pause();
                    }
                    globalAudioPlayer.src = message.audioDataUrl;
                    globalAudioPlayer.dataset.playingMessageId = msgId;
                    globalAudioPlayer.play().catch(err => console.error("音频播放失败:", err));
                    
                    document.querySelectorAll('.message-voice-bar.playing').forEach(bar => bar.classList.remove('playing'));
                    voiceBar.classList.add('playing');
                }
            } else if (message) {
                showGlobalToast('此语音无本地缓存，无法播放。', { type: 'error' });
            }
        }
    });
    overlay.classList.add('visible');
};

// 关闭收藏详情弹窗 (使用事件委托修复)
document.addEventListener('click', (e) => {
    const overlay = document.getElementById('collection-detail-overlay');
    if (!overlay) return;

    // 点击关闭按钮
    if (e.target.closest('#collection-detail-close-btn')) {
        overlay.classList.remove('visible');
    }
    // 点击遮罩层本身
    if (e.target.id === 'collection-detail-overlay') {
        overlay.classList.remove('visible');
    }
});
