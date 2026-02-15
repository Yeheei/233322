// square-card.js

(async function() {
    const STORAGE_KEY = 'squareCardData';
    const DEFAULT_DATA = {
        avatar: '', // Default empty or a placeholder if needed
        background: '', // Default empty (frosted glass)
        text: '雪是零落的诗篇 ❄️。'
    };

    let currentData = { ...DEFAULT_DATA };
    let longPressTimer;
    const LONG_PRESS_DURATION = 800; // ms

    // DOM Elements
    let cardContainer;
    let cardAvatar;
    let cardDate;
    let cardText;
    let cardBg;
    
    // Modal Elements
    let editModal;
    let avatarInput;
    let bgInput;
    let textInput;
    let saveBtn;
    let cancelBtn;
    let avatarPreview;
    let bgPreview;

    async function init() {
        // Load data
        try {
            const storedData = await localforage.getItem(STORAGE_KEY);
            if (storedData) {
                currentData = { ...DEFAULT_DATA, ...storedData };
            }
        } catch (err) {
            console.error('Failed to load square card data:', err);
        }

        // Initialize DOM references
        cardContainer = document.getElementById('square-card');
        if (!cardContainer) return;

        cardBg = cardContainer.querySelector('.square-card-bg');
        cardAvatar = cardContainer.querySelector('.square-card-avatar');
        cardDate = cardContainer.querySelector('.square-card-date');
        cardText = cardContainer.querySelector('.square-card-text-content');

        // Render initial state
        renderCard();
        updateDate();

        // Setup Event Listeners
        setupCardInteractions();
        setupEditModal();

        // Update date every minute
        setInterval(updateDate, 60000);
    }

    function updateDate() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[now.getDay()];
        
        if (cardDate) {
            cardDate.innerHTML = `<div class="date-num">${month}/${date}</div><div class="date-day">${dayName}</div>`;
        }
    }

    function renderCard() {
        // Background
        if (currentData.background) {
            cardBg.style.backgroundImage = `url('${currentData.background}')`;
            cardContainer.classList.add('has-bg');
        } else {
            cardBg.style.backgroundImage = '';
            cardContainer.classList.remove('has-bg');
        }

        // Avatar
        if (currentData.avatar) {
            cardAvatar.style.backgroundImage = `url('${currentData.avatar}')`;
        } else {
            cardAvatar.style.backgroundImage = ''; // Or a default icon
            // Optional: Set a default color or icon if empty
            cardAvatar.style.backgroundColor = 'rgba(255,255,255,0.2)';
        }

        // Text
        if (cardText) {
            cardText.textContent = currentData.text || '';
        }
    }

    function setupCardInteractions() {
        const startLongPress = (e) => {
            // Check if it's a left click or touch
            if (e.type === 'mousedown' && e.button !== 0) return;

            longPressTimer = setTimeout(() => {
                showEditModal();
            }, LONG_PRESS_DURATION);
        };

        const cancelLongPress = () => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        };

        // Mouse events
        cardContainer.addEventListener('mousedown', startLongPress);
        cardContainer.addEventListener('mouseup', cancelLongPress);
        cardContainer.addEventListener('mouseleave', cancelLongPress);

        // Touch events
        cardContainer.addEventListener('touchstart', (e) => {
            startLongPress(e);
        }, { passive: true });
        cardContainer.addEventListener('touchend', cancelLongPress);
        cardContainer.addEventListener('touchmove', cancelLongPress);

        // Prevent context menu
        cardContainer.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    function setupEditModal() {
        // Create modal HTML if not exists (or assume it's in index.html, but let's inject it to be safe/modular)
        if (!document.getElementById('square-card-edit-modal')) {
            const modalHTML = `
                <div id="square-card-edit-modal" class="edit-modal hidden">
                    <div class="edit-modal-content glass-panel">
                        <h3>编辑卡片</h3>
                        
                        <div class="form-group">
                            <label>头像</label>
                            <div class="image-upload-preview" id="edit-avatar-preview">
                                <span>点击上传</span>
                            </div>
                            <input type="file" id="edit-avatar-input" accept="image/*" style="display: none;">
                        </div>

                        <div class="form-group">
                            <label>背景图</label>
                            <div class="image-upload-preview" id="edit-bg-preview">
                                <span>点击上传</span>
                            </div>
                            <input type="file" id="edit-bg-input" accept="image/*" style="display: none;">
                        </div>

                        <div class="form-group">
                            <label>文字内容</label>
                            <textarea id="edit-text-input" rows="3"></textarea>
                        </div>

                        <div class="modal-actions">
                            <button id="edit-cancel-btn">取消</button>
                            <button id="edit-save-btn">保存</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        editModal = document.getElementById('square-card-edit-modal');
        avatarInput = document.getElementById('edit-avatar-input');
        bgInput = document.getElementById('edit-bg-input');
        textInput = document.getElementById('edit-text-input');
        saveBtn = document.getElementById('edit-save-btn');
        cancelBtn = document.getElementById('edit-cancel-btn');
        avatarPreview = document.getElementById('edit-avatar-preview');
        bgPreview = document.getElementById('edit-bg-preview');

        // Avatar Upload
        avatarPreview.addEventListener('click', () => avatarInput.click());
        avatarInput.addEventListener('change', (e) => handleImageUpload(e, avatarPreview));

        // Background Upload
        bgPreview.addEventListener('click', () => bgInput.click());
        bgInput.addEventListener('change', (e) => handleImageUpload(e, bgPreview));

        // Save & Cancel
        saveBtn.addEventListener('click', saveChanges);
        cancelBtn.addEventListener('click', hideEditModal);

        // Close on click outside
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) hideEditModal();
        });
    }

    function handleImageUpload(event, previewElement) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target.result;
            previewElement.style.backgroundImage = `url('${result}')`;
            previewElement.textContent = ''; // Hide "Click to upload" text
            previewElement.dataset.tempUrl = result; // Store temporarily
        };
        reader.readAsDataURL(file);
    }

    function showEditModal() {
        // Populate current values
        textInput.value = currentData.text || '';
        
        if (currentData.avatar) {
            avatarPreview.style.backgroundImage = `url('${currentData.avatar}')`;
            avatarPreview.textContent = '';
            avatarPreview.dataset.tempUrl = currentData.avatar;
        } else {
            avatarPreview.style.backgroundImage = '';
            avatarPreview.textContent = '点击上传';
            delete avatarPreview.dataset.tempUrl;
        }

        if (currentData.background) {
            bgPreview.style.backgroundImage = `url('${currentData.background}')`;
            bgPreview.textContent = '';
            bgPreview.dataset.tempUrl = currentData.background;
        } else {
            bgPreview.style.backgroundImage = '';
            bgPreview.textContent = '点击上传';
            delete bgPreview.dataset.tempUrl;
        }

        editModal.classList.remove('hidden');
    }

    function hideEditModal() {
        editModal.classList.add('hidden');
    }

    async function saveChanges() {
        const newAvatar = avatarPreview.dataset.tempUrl || '';
        const newBg = bgPreview.dataset.tempUrl || '';
        const newText = textInput.value;

        currentData = {
            avatar: newAvatar,
            background: newBg,
            text: newText
        };

        // Save to storage
        try {
            await localforage.setItem(STORAGE_KEY, currentData);
        } catch (err) {
            console.error('Failed to save data:', err);
        }

        // Update UI
        renderCard();
        hideEditModal();
    }

    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
