(() => {
    const entry = document.getElementById('app-forum');
    const overlay = document.getElementById('forum-overlay');
    const backBtn = document.getElementById('forum-back-btn');
    const avatarBtn = document.getElementById('forum-avatar-btn');
    const avatarEl = document.getElementById('forum-avatar');
    const menu = document.getElementById('forum-menu');
    const generateBtn = document.getElementById('forum-generate-btn');
    const body = document.getElementById('forum-body');
    const titleEl = overlay.querySelector('.forum-title');

    if (!entry || !overlay || !backBtn || !avatarBtn || !avatarEl || !menu || !generateBtn || !body || !titleEl) return;

    let locked = false;
    let scrollY = 0;
    let homeScrollY = 0;
    let menuOpen = false;
    let viewStack = ['home'];
    let contentRegex = null;
    let forums = [];
    let currentForumId = '';
    let forumFabEl = null;
    let composeDraft = { title: '', text: '', images: [], tags: [], anonymous: false };
    let publishing = false;

    const FORUM_STORAGE_KEYS = {
        forums: 'forumForums',
        currentForumId: 'forumCurrentForumId',
        background: 'forumBackground'
    };

    const getForumBackgroundStorageKey = (forumId) => `${FORUM_STORAGE_KEYS.background}_${forumId}`;

    const saveForumBackground = async (forumId, dataUrl) => {
        try {
            await localforage.setItem(getForumBackgroundStorageKey(forumId), dataUrl);
        } catch (e) {}
    };

    const loadForumBackground = async (forumId) => {
        try {
            return await localforage.getItem(getForumBackgroundStorageKey(forumId));
        } catch (e) {
            return null;
        }
    };

    const openImagePickerDialog = () => {
        const input = document.getElementById('forum-background-input');
        if (!input) return;
        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async () => {
                const dataUrl = reader.result;
                const forumId = getCurrentForum()?.id;
                if (forumId) {
                    await saveForumBackground(forumId, dataUrl);
                    const bgEl = overlay.querySelector('.forum-background');
                    if (bgEl) {
                        bgEl.style.backgroundImage = `url(${dataUrl})`;
                    }
                    overlay.classList.add('forum-overlay--has-background');
                }
            };
            reader.readAsDataURL(file);
            input.value = '';
        };
        input.click();
    };

    const getDefaultForums = () => ([
        {
            id: 'darkweb',
            name: '暗网论坛',
            deletable: false,
            theme: [
                '这是一个模拟“系统论坛交流地”的空间，属于“水母生存系统”世界观的一部分。',
                '一部分人被拉入一个名为“水母生存系统”的游戏中；他们会不定期被拉入平行世界（不同世界观）完成副本任务，才可以回到原本世界。',
                '系统存在积分制度与大量游戏元素：道具、异能、状态、惩罚/奖励、成长路线等。',
                '论坛用户主要是“穿越者/被选中者”，在这里交流副本情报、道具机制、异能研究、积分交易与生存策略。'
            ].join('\n'),
            rule: [
                '禁止泄露真实身份与现实定位；不发布可追踪的现实信息。',
                '情报分享需标注来源与时间；对未知内容用“猜测/推测/确认”进行区分。',
                '不鼓励无意义引战；争议内容需给出可验证的证据或副本记录。',
                '允许讨论道具/异能/副本机制，但禁止发布会导致大规模伤亡的恶意诱导方案。'
            ].join('\n'),
            boundRoleIds: [],
            promptTemplate: [
                '你正在扮演“暗网论坛”的内容生成器。世界观：水母生存系统将一部分人卷入生存游戏，并不定期把人拉进平行世界副本完成任务；存在积分、道具、异能与大量系统规则。论坛用于穿越者交流情报与策略。',
                '输出为一条论坛帖子（可含标题与正文），语言为中文，风格偏真实论坛：简洁、带细节、略带紧张感；允许使用论坛黑话与系统术语。',
                '若给定“绑定角色”，以该角色口吻发布；否则以匿名路人口吻发布。',
                '避免空泛宣传，尽量给出可执行的信息（例如副本提示、道具使用方法、积分规则猜测、幸存者建议等）。'
            ].join('\n')
        },
        {
            id: 'normal',
            name: '普通论坛',
            deletable: false,
            theme: '日常交流与分享。',
            rule: '友善交流，避免泄露隐私与人身攻击。',
            boundRoleIds: [],
            promptTemplate: ''
        }
    ]);

    const normalizeForum = (f) => {
        const id = typeof f?.id === 'string' ? f.id.trim() : '';
        const name = typeof f?.name === 'string' ? f.name.trim() : '';
        if (!id || !name) return null;
        return {
            id,
            name,
            deletable: !!f.deletable,
            theme: typeof f.theme === 'string' ? f.theme : '',
            rule: typeof f.rule === 'string' ? f.rule : '',
            boundRoleIds: Array.isArray(f.boundRoleIds) ? f.boundRoleIds.filter(x => typeof x === 'string' && x.trim()) : [],
            promptTemplate: typeof f.promptTemplate === 'string' ? f.promptTemplate : ''
        };
    };

    const ensureForums = async () => {
        const defaults = getDefaultForums();
        const defaultIds = new Set(defaults.map(d => d.id));
        let saved = [];
        try {
            const raw = await localforage.getItem(FORUM_STORAGE_KEYS.forums);
            if (typeof raw === 'string' && raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) saved = parsed;
            } else if (Array.isArray(raw)) {
                saved = raw;
            }
        } catch (e) {}

        const normalizedSaved = saved.map(normalizeForum).filter(Boolean);
        const byId = new Map();
        for (const d of defaults) byId.set(d.id, { ...d });
        for (const s of normalizedSaved) {
            if (byId.has(s.id)) {
                const base = byId.get(s.id);
                byId.set(s.id, {
                    ...base,
                    name: s.name || base.name,
                    theme: s.theme || base.theme,
                    rule: s.rule || base.rule,
                    boundRoleIds: s.boundRoleIds,
                    promptTemplate: s.promptTemplate || base.promptTemplate,
                    deletable: base.deletable
                });
            } else {
                byId.set(s.id, { ...s, deletable: true });
            }
        }

        const customOrder = [];
        for (const s of normalizedSaved) {
            if (defaultIds.has(s.id)) continue;
            if (!customOrder.includes(s.id)) customOrder.push(s.id);
        }
        const allCustom = Array.from(byId.values()).filter(f => !defaultIds.has(f.id));
        const customById = new Map(allCustom.map(f => [f.id, f]));
        const customFromSaved = customOrder.map(id => customById.get(id)).filter(Boolean);
        const customRemaining = allCustom.filter(f => !customOrder.includes(f.id));
        forums = [
            ...defaults.map(d => byId.get(d.id)).filter(Boolean),
            ...customFromSaved,
            ...customRemaining
        ];

        try {
            const storedCurrent = await localforage.getItem(FORUM_STORAGE_KEYS.currentForumId);
            currentForumId = typeof storedCurrent === 'string' && storedCurrent ? storedCurrent : defaults[0].id;
        } catch (e) {
            currentForumId = defaults[0].id;
        }
        if (!forums.some(f => f.id === currentForumId)) currentForumId = defaults[0].id;

        try {
            await localforage.setItem(FORUM_STORAGE_KEYS.forums, JSON.stringify(forums));
            await localforage.setItem(FORUM_STORAGE_KEYS.currentForumId, currentForumId);
        } catch (e) {}
    };

    const getCurrentForum = () => forums.find(f => f.id === currentForumId) || forums[0] || null;

    let dialogOverlayEl = null;
    const closeDialog = () => {
        if (dialogOverlayEl && dialogOverlayEl.parentNode) dialogOverlayEl.parentNode.removeChild(dialogOverlayEl);
        dialogOverlayEl = null;
    };

    const openDialog = ({ title, bodyHtml, onMount }) => {
        closeDialog();
        dialogOverlayEl = document.createElement('div');
        dialogOverlayEl.className = 'forum-dialog-overlay';
        dialogOverlayEl.innerHTML = `
            <div class="forum-dialog" role="dialog" aria-modal="true" aria-label="${escapeHtml(title || '')}">
                <div class="forum-dialog-header">
                    <div class="forum-dialog-title">${escapeHtml(title || '')}</div>
                    <button type="button" class="forum-dialog-close" data-forum-dialog-close aria-label="关闭">×</button>
                </div>
                <div class="forum-dialog-body">${bodyHtml || ''}</div>
                <div class="forum-dialog-footer">
                    <button type="button" class="modal-button glass" data-forum-dialog-cancel>取消</button>
                    <button type="button" class="modal-button" data-forum-dialog-confirm>确定</button>
                </div>
            </div>
        `;
        overlay.appendChild(dialogOverlayEl);

        const closeBtn = dialogOverlayEl.querySelector('[data-forum-dialog-close]');
        const cancelBtn = dialogOverlayEl.querySelector('[data-forum-dialog-cancel]');
        if (closeBtn) closeBtn.addEventListener('click', closeDialog);
        if (cancelBtn) cancelBtn.addEventListener('click', closeDialog);
        dialogOverlayEl.addEventListener('click', (e) => {
            if (e.target === dialogOverlayEl) closeDialog();
        });
        if (typeof onMount === 'function') onMount(dialogOverlayEl);
    };

    const loadArchiveCharacters = async () => {
        try {
            if (window.archiveData && Array.isArray(window.archiveData.characters)) {
                return window.archiveData.characters.filter(c => c && c.id && c.id !== 'user');
            }
        } catch (e) {}
        try {
            const raw = await localforage.getItem('archiveData');
            const data = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : null;
            const chars = data && Array.isArray(data.characters) ? data.characters : [];
            return chars.filter(c => c && c.id && c.id !== 'user');
        } catch (e) {
            return [];
        }
    };

    const openBindRoleDialog = async () => {
        const currentForum = getCurrentForum();
        const selected = new Set((currentForum && Array.isArray(currentForum.boundRoleIds)) ? currentForum.boundRoleIds : []);
        const chars = await loadArchiveCharacters();

        const listHtml = chars.length
            ? `
                <div class="forum-role-list">
                    ${chars.map(c => {
                        const id = escapeHtml(String(c.id));
                        const name = escapeHtml(String(c.name || '未命名'));
                        const avatar = escapeHtml(String(c.avatar || ''));
                        const checked = selected.has(String(c.id)) ? 'checked' : '';
                        return `
                            <label class="forum-role-item">
                                <input type="checkbox" class="forum-role-checkbox" value="${id}" ${checked} />
                                <span class="forum-role-avatar" style="${avatar ? `background-image:url('${avatar}');` : ''}"></span>
                                <span class="forum-role-name">${name}</span>
                            </label>
                        `;
                    }).join('')}
                </div>
            `
            : `<div class="empty-text" style="padding: 14px 0; text-align:center; opacity:0.7;">档案中没有角色</div>`;

        openDialog({
            title: '绑定角色',
            bodyHtml: listHtml,
            onMount: (root) => {
                const confirmBtn = root.querySelector('[data-forum-dialog-confirm]');
                if (!confirmBtn) return;
                confirmBtn.addEventListener('click', async () => {
                    const values = Array.from(root.querySelectorAll('input.forum-role-checkbox:checked'))
                        .map(el => String(el.value || '').trim())
                        .filter(Boolean);
                    const idx = forums.findIndex(f => f.id === currentForumId);
                    if (idx >= 0) {
                        forums[idx] = { ...forums[idx], boundRoleIds: values };
                        try {
                            await localforage.setItem(FORUM_STORAGE_KEYS.forums, JSON.stringify(forums));
                        } catch (e) {}
                    }
                    closeDialog();
                });
            }
        });
    };

    const createCustomForumId = () => `custom_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

    const openCreateForumDialog = async () => {
        const chars = await loadArchiveCharacters();
        const listHtml = chars.length
            ? `
                <div class="forum-role-list" data-forum-create-roles>
                    ${chars.map(c => {
                        const id = escapeHtml(String(c.id));
                        const name = escapeHtml(String(c.name || '未命名'));
                        const avatar = escapeHtml(String(c.avatar || ''));
                        return `
                            <label class="forum-role-item">
                                <input type="checkbox" class="forum-role-checkbox" value="${id}" />
                                <span class="forum-role-avatar" style="${avatar ? `background-image:url('${avatar}');` : ''}"></span>
                                <span class="forum-role-name">${name}</span>
                            </label>
                        `;
                    }).join('')}
                </div>
            `
            : `<div class="empty-text" style="padding: 14px 0; text-align:center; opacity:0.7;">档案中没有角色</div>`;

        openDialog({
            title: '自定义论坛',
            bodyHtml: `
                <div class="modal-form-group" style="gap: 12px;">
                    <div class="modal-form-group">
                        <label>论坛名称</label>
                        <input class="modal-input" data-forum-name placeholder="请输入论坛名称" />
                    </div>
                    <div class="modal-form-group">
                        <label>论坛主题</label>
                        <textarea class="modal-input" data-forum-theme rows="4" placeholder="请输入论坛主题"></textarea>
                    </div>
                    <div class="modal-form-group">
                        <label>论坛规范</label>
                        <textarea class="modal-input" data-forum-rule rows="4" placeholder="请输入论坛规范"></textarea>
                    </div>
                    <div class="modal-form-group">
                        <label>绑定角色</label>
                        ${listHtml}
                    </div>
                </div>
            `,
            onMount: (root) => {
                const confirmBtn = root.querySelector('[data-forum-dialog-confirm]');
                if (!confirmBtn) return;
                confirmBtn.addEventListener('click', async () => {
                    const name = String(root.querySelector('[data-forum-name]')?.value || '').trim();
                    if (!name) return;
                    const theme = String(root.querySelector('[data-forum-theme]')?.value || '').trim();
                    const rule = String(root.querySelector('[data-forum-rule]')?.value || '').trim();
                    const roleIds = Array.from(root.querySelectorAll('input.forum-role-checkbox:checked'))
                        .map(el => String(el.value || '').trim())
                        .filter(Boolean);
                    const next = {
                        id: createCustomForumId(),
                        name,
                        deletable: true,
                        theme,
                        rule,
                        boundRoleIds: roleIds,
                        promptTemplate: ''
                    };
                    forums = [...forums, next];
                    try {
                        await localforage.setItem(FORUM_STORAGE_KEYS.forums, JSON.stringify(forums));
                    } catch (e) {}
                    closeDialog();
                    openSwitchForumDialog();
                });
            }
        });
    };

    const openSwitchForumDialog = () => {
        const listHtml = `
            <div class="forum-switch-list">
                ${forums.map(f => {
                    const active = f.id === currentForumId;
                    const theme = String(f.theme || '').trim().replace(/\s+/g, ' ');
                    const themeText = theme ? escapeHtml(theme.slice(0, 44)) : '';
                    return `
                        <div class="forum-switch-card" role="button" tabindex="0" data-forum-switch-id="${escapeHtml(f.id)}">
                            <div class="forum-switch-meta">
                                <div class="forum-switch-name">${escapeHtml(f.name)}${active ? '（当前）' : ''}</div>
                                ${themeText ? `<div class="forum-switch-theme">${themeText}</div>` : `<div class="forum-switch-theme" style="opacity:0.55;">无主题</div>`}
                            </div>
                            ${f.deletable ? `<button type="button" class="forum-switch-delete" data-forum-delete-id="${escapeHtml(f.id)}" aria-label="删除">×</button>` : `<span class="forum-switch-badge">默认</span>`}
                        </div>
                    `;
                }).join('')}
                <div class="forum-switch-card forum-switch-create" role="button" tabindex="0" data-forum-create>
                    <div class="forum-switch-meta">
                        <div class="forum-switch-name">自定义论坛</div>
                        <div class="forum-switch-theme" style="opacity:0.7;">点击创建新的论坛主题</div>
                    </div>
                    <span class="forum-switch-badge">+</span>
                </div>
            </div>
        `;

        openDialog({
            title: '切换论坛',
            bodyHtml: listHtml,
            onMount: (root) => {
                const footer = root.querySelector('.forum-dialog-footer');
                const confirmBtn = root.querySelector('[data-forum-dialog-confirm]');
                if (footer) footer.style.display = 'none';
                if (confirmBtn) confirmBtn.style.display = 'none';

                root.addEventListener('click', async (e) => {
                    const createBtn = e.target.closest('[data-forum-create]');
                    if (createBtn) {
                        e.preventDefault();
                        openCreateForumDialog();
                        return;
                    }
                    const delBtn = e.target.closest('[data-forum-delete-id]');
                    if (delBtn) {
                        e.preventDefault();
                        e.stopPropagation();
                        const id = delBtn.dataset.forumDeleteId;
                        if (!id) return;
                        forums = forums.filter(f => f.id !== id);
                        if (id === currentForumId) currentForumId = forums[0]?.id || 'darkweb';
                        try {
                            await localforage.setItem(FORUM_STORAGE_KEYS.forums, JSON.stringify(forums));
                            await localforage.setItem(FORUM_STORAGE_KEYS.currentForumId, currentForumId);
                        } catch (e2) {}
                        openSwitchForumDialog();
                        return;
                    }
                    const btn = e.target.closest('[data-forum-switch-id]');
                    if (!btn) return;
                    e.preventDefault();
                    const id = btn.dataset.forumSwitchId;
                    if (!id) return;
                    currentForumId = id;
                    try {
                        await localforage.setItem(FORUM_STORAGE_KEYS.currentForumId, currentForumId);
                    } catch (e2) {}
                    closeDialog();
                    await loadLikedPostIds();
                    await loadPostsForCurrentForum();
        const backgroundUrl = await loadForumBackground(currentForumId);
        const bgEl = overlay.querySelector('.forum-background');
        if (bgEl) {
            if (backgroundUrl) {
                bgEl.style.backgroundImage = `url(${backgroundUrl})`;
                overlay.classList.add('forum-overlay--has-background');
            } else {
                bgEl.style.backgroundImage = 'none';
                overlay.classList.remove('forum-overlay--has-background');
            }
        }
                    viewStack = ['home'];
                    renderHome();
                });
            }
        });
    };

    const escapeHtml = (s) => String(s)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    const heartOutlineSvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
    const heartSolidSvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 21.23l-1.06-0.96C5.14 15.24 2 12.39 2 8.99 2 6.24 4.24 4 6.99 4c1.54 0 3.04 0.72 4.01 1.86C11.97 4.72 13.47 4 15.01 4 17.76 4 20 6.24 20 8.99c0 3.4-3.14 6.25-8.94 11.28L12 21.23z"></path></svg>';
    const commentSvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path></svg>';
    const shareSvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>';

    let likedPostIds = new Set();
    let aiInteractingPostIds = new Set();

    const getLikedPostIdsStorageKey = (forumId) => `forumLikedPostIds_${String(forumId || 'default')}`;
    const getForumPostsStorageKey = (forumId) => `forumPosts_${String(forumId || 'default')}`;

    const getDefaultPosts = () => ([]);

    let forumPosts = getDefaultPosts();

    const getRandomAvatarBase = () => {
        try {
            if (typeof MOMENTS_ASSETS !== 'undefined' && MOMENTS_ASSETS && typeof MOMENTS_ASSETS.avatars === 'string' && MOMENTS_ASSETS.avatars) {
                return MOMENTS_ASSETS.avatars;
            }
        } catch (e) {}
        return 'https://api.dicebear.com/7.x/avataaars/svg?seed=';
    };

    const buildRandomAvatarUrl = (seed) => `${getRandomAvatarBase()}${encodeURIComponent(String(seed || 'seed'))}`;

    const loadLikedPostIds = async () => {
        try {
            const raw = await localforage.getItem(getLikedPostIdsStorageKey(currentForumId));
            const parsed = typeof raw === 'string' && raw ? JSON.parse(raw) : raw;
            const list = Array.isArray(parsed) ? parsed : [];
            likedPostIds = new Set(list.filter(x => typeof x === 'string' && x.trim()));
        } catch (e) {
            likedPostIds = new Set();
        }
    };

    const saveLikedPostIds = async () => {
        try {
            await localforage.setItem(getLikedPostIdsStorageKey(currentForumId), JSON.stringify(Array.from(likedPostIds)));
        } catch (e) {}
    };

    const loadPostsForCurrentForum = async () => {
        try {
            const raw = await localforage.getItem(getForumPostsStorageKey(currentForumId));
            const parsed = typeof raw === 'string' && raw ? JSON.parse(raw) : raw;
            if (Array.isArray(parsed)) {
                forumPosts = parsed;
                return;
            }
        } catch (e) {}
        forumPosts = getDefaultPosts();
    };

    const savePostsForCurrentForum = async () => {
        try {
            await localforage.setItem(getForumPostsStorageKey(currentForumId), JSON.stringify(forumPosts));
        } catch (e) {}
    };

    const buildContentRegex = (patterns) => {
        const normalized = (patterns || [])
            .map(s => (typeof s === 'string' ? s.trim() : ''))
            .filter(Boolean);

        const defaults = [
            'https?:\\/\\/[^\\s]+',
            '#[^#\\s]{1,30}#',
            '@[\\w\\u4e00-\\u9fa5_-]{1,20}'
        ];

        const sources = (normalized.length ? normalized : defaults).map(p => `(?:${p})`);
        try {
            return new RegExp(sources.join('|'), 'g');
        } catch (e) {
            try {
                return new RegExp(defaults.map(p => `(?:${p})`).join('|'), 'g');
            } catch (e2) {
                return null;
            }
        }
    };

    const loadRegexPatternsFromApp = async () => {
        try {
            const raw = await localforage.getItem('regexAppData');
            const data = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(data)) return [];
            const patterns = [];
            for (const cat of data) {
                const items = cat && Array.isArray(cat.items) ? cat.items : [];
                for (const it of items) {
                    const p = it && typeof it.pattern === 'string' ? it.pattern.trim() : '';
                    if (p) patterns.push(p);
                }
            }
            return patterns;
        } catch (e) {
            return [];
        }
    };

    const refreshContentRegex = async () => {
        const patterns = await loadRegexPatternsFromApp();
        contentRegex = buildContentRegex(patterns);
    };

    const renderTextWithRegex = (text) => {
        const s = String(text ?? '');
        const tagRe = /#[\w\u4e00-\u9fa5_-]{1,20}(?!#)/g;
        const tokens = [];

        try {
            for (const m of s.matchAll(tagRe)) {
                const idx = m.index ?? -1;
                const raw = m[0] ?? '';
                if (idx < 0 || !raw) continue;
                tokens.push({ type: 'tag', start: idx, end: idx + raw.length, text: raw });
            }
        } catch (e) {}

        if (contentRegex) {
            try {
                for (const m of s.matchAll(contentRegex)) {
                    const idx = m.index ?? -1;
                    const raw = m[0] ?? '';
                    if (idx < 0 || !raw) continue;
                    tokens.push({ type: 'hit', start: idx, end: idx + raw.length, text: raw });
                }
            } catch (e) {}
        }

        if (!tokens.length) return escapeHtml(s);
        tokens.sort((a, b) => (a.start - b.start) || ((a.type === 'tag' ? -1 : 1) - (b.type === 'tag' ? -1 : 1)));

        let out = '';
        let lastIndex = 0;
        for (const t of tokens) {
            if (t.start < lastIndex) continue;
            if (t.start > lastIndex) out += escapeHtml(s.slice(lastIndex, t.start));
            if (t.type === 'tag') out += `<span class="forum-tag-pill">${escapeHtml(t.text)}</span>`;
            else out += `<span class="forum-regex-hit">${escapeHtml(t.text)}</span>`;
            lastIndex = t.end;
        }
        out += escapeHtml(s.slice(lastIndex));
        return out;
    };

    const getPostLikeCount = (postId) => {
        const post = forumPosts.find(p => p.id === postId);
        if (!post) return 0;
        const base = Number.isFinite(parseInt(String(post.likes ?? 0), 10)) ? parseInt(String(post.likes ?? 0), 10) : 0;
        return Math.max(0, base + (likedPostIds.has(postId) ? 1 : 0));
    };

    const normalizePostTags = (tags) => {
        const list = Array.isArray(tags) ? tags : [];
        const out = [];
        for (const raw of list) {
            const t = String(raw || '').trim().replace(/^#+/, '').slice(0, 20);
            if (!t) continue;
            if (!/^[\w\u4e00-\u9fa5_-]{1,20}$/.test(t)) continue;
            if (!out.includes(t)) out.push(t);
            if (out.length >= 8) break;
        }
        return out;
    };

    const renderPostTags = (post) => {
        const tags = normalizePostTags(post && post.tags);
        if (!tags.length) return '';
        return `<div class="forum-post-tags">${tags.map(t => `<span class="forum-tag-pill">${escapeHtml('#' + t)}</span>`).join('')}</div>`;
    };

    const renderPostImages = (post) => {
        const images = Array.isArray(post && post.images) ? post.images : [];
        if (!images.length) return '';
        const maxShow = 3;
        const show = images.slice(0, maxShow);
        const more = images.length - show.length;
        return `
            <div class="forum-post-images">
                ${show.map((src, idx) => `
                    <div class="forum-post-image">
                        <img src="${escapeHtml(String(src || ''))}" alt="图片${idx + 1}">
                        ${(more > 0 && idx === show.length - 1) ? `<div class="forum-post-image-more">+${more}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    };

    const renderPostCard = (post, isDetail = false) => {
        const postId = String(post.id || '');
        const liked = likedPostIds.has(postId);
        const interacting = aiInteractingPostIds.has(postId);
        const likeCount = getPostLikeCount(postId);
        const commentCount = Array.isArray(post.comments) ? post.comments.length : 0;
        
        let avatarUrl;
        if (post.isMine && currentUserAvatar && !post.anonymous) {
            avatarUrl = currentUserAvatar;
        } else {
            avatarUrl = post.anonymous
                ? buildRandomAvatarUrl(`forum|post|anon|${currentForumId}|${postId}`)
                : buildRandomAvatarUrl(`forum|post|${currentForumId}|${postId}|${post.authorName || ''}`);
        }

        const titleHtml = post.title 
            ? `<div class="forum-post-title" style="font-weight:bold;font-size:1.1em;margin-bottom:8px;color:var(--text-color);">${escapeHtml(post.title)}</div>` 
            : '';
        
        const contentStyle = isDetail 
            ? '' 
            : 'display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis;';

        return `
        <div class="forum-post-card" role="button" tabindex="0" data-post-id="${escapeHtml(postId)}">
            <div class="forum-post-header">
                <div class="forum-post-avatar" style="background-image: url('${escapeHtml(avatarUrl)}'); background-size: cover; background-position: center;"></div>
                <div class="forum-post-meta">
                    <div class="forum-post-name">${escapeHtml(post.authorName)}${post.anonymous ? '<span class="forum-anon-badge">匿名</span>' : ''}${interacting ? '<span class="forum-ai-badge">AI</span>' : ''}</div>
                </div>
            </div>
            ${titleHtml}
            <div class="forum-post-content" style="${contentStyle}">${renderTextWithRegex(post.content)}</div>
            ${renderPostTags(post)}
            ${renderPostImages(post)}
            <div class="forum-post-actions" role="group" aria-label="帖子互动">
                <button type="button" class="forum-post-action-btn" data-forum-like data-post-id="${escapeHtml(postId)}" style="color:${liked ? '#ff375f' : 'var(--text-color)'}">
                    <span data-forum-like-icon>${liked ? heartSolidSvg : heartOutlineSvg}</span>
                    <span class="forum-post-action-label" data-forum-like-label>${escapeHtml(likeCount > 0 ? String(likeCount) : '赞')}</span>
                </button>
                <button type="button" class="forum-post-action-btn" data-forum-comment data-post-id="${escapeHtml(postId)}">
                    ${commentSvg}
                    <span class="forum-post-action-label" data-forum-comment-label>${escapeHtml(commentCount > 0 ? String(commentCount) : '评')}</span>
                </button>
                <button type="button" class="forum-post-action-btn" data-forum-share data-post-id="${escapeHtml(postId)}">
                    ${shareSvg}
                    <span class="forum-post-action-label">转</span>
                </button>
            </div>
        </div>
        `;
    };

    const renderPostDetail = (postId) => {
        const post = forumPosts.find(p => p.id === postId);
        if (!post) {
            titleEl.textContent = '帖子详情';
            body.innerHTML = `<span class="empty-text" style="opacity: 0.6; text-align: center; display: block; padding: 24px 0;">帖子不存在</span>`;
            return;
        }
        titleEl.textContent = '帖子详情';
        body.innerHTML = `
            <div class="forum-detail">
                ${renderPostCard(post, true)}
                <div class="forum-comments">
                    <div class="forum-comments-title">评论区</div>
                    ${post.comments.map(c => `
                        <div class="forum-comment">
                            <div class="forum-comment-avatar" style="background-image: url('${escapeHtml(c.anonymous ? buildRandomAvatarUrl(`forum|comment|anon|${currentForumId}|${post.id}|${c.id}`) : buildRandomAvatarUrl(`forum|comment|${currentForumId}|${post.id}|${c.id}|${c.authorName || ''}`))}'); background-size: cover; background-position: center;"></div>
                            <div class="forum-comment-body">
                                <div class="forum-comment-name">${escapeHtml(c.authorName)}${c.anonymous ? '<span class="forum-anon-badge">匿名</span>' : ''}</div>
                                <div class="forum-comment-content">${renderTextWithRegex(c.content)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    };

    const renderHome = () => {
        titleEl.textContent = '论坛';
        const currentForum = getCurrentForum();
        const forumName = currentForum ? String(currentForum.name || '').trim() : '';
        const forumTheme = currentForum ? String(currentForum.theme || '').trim() : '';
        body.innerHTML = `
            ${currentForum ? `
                <div class="forum-current-card">
                    <div class="forum-current-name">${escapeHtml(forumName || '未命名论坛')}</div>
                    ${forumTheme ? `<div class="forum-current-theme">${escapeHtml(forumTheme)}</div>` : ''}
                </div>
            ` : ''}
            <div class="forum-feed">
                ${forumPosts.map(p => renderPostCard(p)).join('')}
            </div>
        `;
    };

    const ensureForumFab = () => {
        if (forumFabEl) return forumFabEl;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'forum-fab';
        btn.className = 'forum-fab';
        btn.setAttribute('aria-label', '发帖');
        btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>';
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate('compose');
        });
        overlay.appendChild(btn);
        forumFabEl = btn;
        return forumFabEl;
    };

    const syncForumFabVisibility = (view) => {
        if (!forumFabEl) return;
        const isVisible = overlay.classList.contains('visible');
        const shouldShow = isVisible && view === 'home';
        forumFabEl.classList.toggle('visible', shouldShow);
    };

    const hashStringToInt = (s) => {
        const str = String(s || '');
        let h = 0;
        for (let i = 0; i < str.length; i += 1) {
            h = (h * 31 + str.charCodeAt(i)) | 0;
        }
        return Math.abs(h);
    };

    const buildAnonNickname = (seed) => {
        const h = hashStringToInt(seed);
        const left = ['雾里', '夜行', '无名', '旁观', '漂流', '灰光', '第七', '旧梦', '逆流', '临界', '静默', '边缘'];
        const right = ['目击者', '路人', '信使', '存活者', '记录员', '回声', '来客', '手记', '耳语', '碎片', '影子', '看客'];
        return `${left[h % left.length]}${right[Math.floor(h / 97) % right.length]}`;
    };

    const createUserPostId = () => `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

    const publishComposeDraft = async (submitBtn) => {
        if (publishing) return;
        const title = String(composeDraft && composeDraft.title ? composeDraft.title : '').trim();
        const text = String(composeDraft && composeDraft.text ? composeDraft.text : '').trim();
        const images = Array.isArray(composeDraft && composeDraft.images) ? composeDraft.images.filter(Boolean).slice(0, 6) : [];
        const tags = Array.isArray(composeDraft && composeDraft.tags) ? composeDraft.tags : [];
        const anonymous = !!(composeDraft && composeDraft.anonymous);
        if (!text && !images.length) {
            showForumToast('写点文字或添加图片再发帖', { type: 'info', duration: 1600 });
            return;
        }

        publishing = true;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = '发布中...';
        }
        try {
            const postId = createUserPostId();
            const authorName = anonymous ? buildAnonNickname(`forum|anon|${currentForumId}|${postId}`) : await loadForumUserName();
            const post = {
                id: postId,
                title,
                authorName: String(authorName || '路人').trim() || '路人',
                anonymous,
                content: text,
                likes: 0,
                comments: [],
                images,
                tags: normalizePostTags(tags),
                isMine: true,
                createdAt: Date.now()
            };
            forumPosts.unshift(post);
            await savePostsForCurrentForum();
            composeDraft = { title: '', text: '', images: [], tags: [], anonymous: false };
            showForumToast('已发布', { type: 'success', duration: 1400 });
            back();
            triggerAiInteractionForPost(postId);
        } catch (e) {
            showForumToast('发帖失败', { type: 'error', duration: 2000 });
        } finally {
            publishing = false;
            if (submitBtn && document.body.contains(submitBtn)) {
                submitBtn.disabled = false;
                submitBtn.textContent = '发帖';
            }
        }
    };

    const renderCompose = () => {
        titleEl.textContent = '发帖';
        const text = String(composeDraft && composeDraft.text ? composeDraft.text : '');
        const anonymous = !!(composeDraft && composeDraft.anonymous);

        body.innerHTML = `
            <div class="forum-compose">
                <div class="forum-compose-card">
                    <input id="forum-compose-title" class="forum-compose-title" placeholder="标题（可选）" value="${escapeHtml(String(composeDraft && composeDraft.title ? composeDraft.title : ''))}" style="width:100%;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.1);padding:12px 0;font-size:1.1em;font-weight:bold;color:var(--text-color);outline:none;border-radius:0;margin-bottom:8px;" />
                    <textarea id="forum-compose-text" class="forum-compose-text" placeholder="写点什么...">${escapeHtml(text)}</textarea>
                    <div class="forum-compose-images">
                        <div class="forum-compose-row">
                            <button id="forum-compose-add-image" type="button" class="modal-button glass">添加图片</button>
                            <div class="forum-compose-hint">最多 6 张</div>
                        </div>
                        <div id="forum-compose-image-grid" class="forum-compose-image-grid"></div>
                        <input id="forum-compose-image-input" type="file" accept="image/*" multiple style="display:none" />
                    </div>
                    <div class="forum-compose-tags">
                        <div class="forum-compose-row">
                            <button id="forum-compose-add-tag" type="button" class="forum-compose-tag-add-btn">#</button>
                            <div id="forum-compose-tag-list" class="forum-compose-tag-list"></div>
                        </div>
                    </div>
                    <div class="forum-compose-row switch-group">
                        <label for="forum-compose-anon-toggle">匿名发帖</label>
                        <label class="switch-container">
                            <input type="checkbox" id="forum-compose-anon-toggle" ${anonymous ? 'checked' : ''}>
                            <span class="switch-slider"></span>
                        </label>
                    </div>
                    <div class="forum-compose-actions">
                        <button id="forum-compose-submit" type="button" class="modal-button">发帖</button>
                    </div>
                </div>
            </div>
        `;

        const titleInput = document.getElementById('forum-compose-title');
        const textEl = document.getElementById('forum-compose-text');
        const addImageBtn = document.getElementById('forum-compose-add-image');
        const imageInput = document.getElementById('forum-compose-image-input');
        const imageGrid = document.getElementById('forum-compose-image-grid');
        const addTagBtn = document.getElementById('forum-compose-add-tag');
        const tagList = document.getElementById('forum-compose-tag-list');
        const anonToggle = document.getElementById('forum-compose-anon-toggle');
        const submitBtn = document.getElementById('forum-compose-submit');

        const renderTags = () => {
            const list = Array.isArray(composeDraft.tags) ? composeDraft.tags : [];
            tagList.innerHTML = list.length
                ? list.map(t => `<button type="button" class="forum-compose-tag">${escapeHtml(String(t || ''))}<span data-remove-tag="${escapeHtml(String(t || ''))}">×</span></button>`).join('')
                : `<span class="forum-compose-hint">点击 # 添加标签</span>`;
        };

        const renderImages = () => {
            const list = Array.isArray(composeDraft.images) ? composeDraft.images : [];
            imageGrid.innerHTML = list.length
                ? list.map((src, idx) => `
                    <div class="forum-compose-image">
                        <img src="${escapeHtml(String(src || ''))}" alt="图片${idx + 1}">
                        <button type="button" class="forum-compose-image-remove" data-remove-image="${idx}" aria-label="删除图片">×</button>
                    </div>
                `).join('')
                : '';
        };

        renderTags();
        renderImages();

        titleInput.addEventListener('input', () => {
            composeDraft.title = String(titleInput.value || '');
        });

        textEl.addEventListener('input', () => {
            composeDraft.text = String(textEl.value || '');
        });

        addImageBtn.addEventListener('click', () => imageInput.click());
        imageInput.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files || []);
            if (!files.length) return;
            const existing = Array.isArray(composeDraft.images) ? composeDraft.images : [];
            if (existing.length >= 6) {
                showForumToast('最多添加 6 张图片', { type: 'info', duration: 1600 });
                imageInput.value = '';
                return;
            }
            for (const file of files) {
                if ((Array.isArray(composeDraft.images) ? composeDraft.images : []).length >= 6) break;
                let dataUrl = '';
                if (typeof compressImage === 'function') {
                    dataUrl = await compressImage(file);
                } else {
                    dataUrl = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(String(reader.result || ''));
                        reader.onerror = () => resolve('');
                        reader.readAsDataURL(file);
                    });
                }
                if (dataUrl) {
                    composeDraft.images = [...(Array.isArray(composeDraft.images) ? composeDraft.images : []), dataUrl];
                }
            }
            imageInput.value = '';
            renderImages();
        });

        imageGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-remove-image]');
            if (!btn) return;
            e.preventDefault();
            const idx = parseInt(String(btn.dataset.removeImage || ''), 10);
            if (!Number.isFinite(idx)) return;
            const list = Array.isArray(composeDraft.images) ? composeDraft.images : [];
            composeDraft.images = list.filter((_, i) => i !== idx);
            renderImages();
        });

        addTagBtn.addEventListener('click', () => {
            const raw = window.prompt('输入标签（不需要#）', '');
            if (raw == null) return;
            const t = String(raw).trim().replace(/^#+/, '').slice(0, 20);
            if (!t) return;
            const next = Array.isArray(composeDraft.tags) ? [...composeDraft.tags] : [];
            if (!next.includes(t)) next.push(t);
            composeDraft.tags = next;
            renderTags();
        });

        tagList.addEventListener('click', (e) => {
            const rm = e.target.closest('[data-remove-tag]');
            if (!rm) return;
            e.preventDefault();
            const t = String(rm.dataset.removeTag || '');
            const list = Array.isArray(composeDraft.tags) ? composeDraft.tags : [];
            composeDraft.tags = list.filter(x => String(x) !== t);
            renderTags();
        });

        anonToggle.addEventListener('change', () => {
            composeDraft.anonymous = !!anonToggle.checked;
        });

        submitBtn.addEventListener('click', () => publishComposeDraft(submitBtn));
    };

    const renderProfile = () => {
        titleEl.textContent = '';
        body.innerHTML = `
            <div class="forum-profile">
                <div id="forum-profile-bg" class="forum-profile-bg" aria-hidden="true"></div>
                <div class="forum-profile-vignette" aria-hidden="true"></div>
                <div class="forum-profile-content">
                    <div class="forum-profile-identity">
                        <button id="forum-profile-avatar-btn" class="forum-profile-avatar-btn" type="button" aria-label="修改头像">
                            <div id="forum-profile-avatar" class="forum-profile-avatar"></div>
                        </button>
                        <div id="forum-profile-name" class="forum-profile-name">水母用户</div>
                        <div id="forum-profile-signature" class="forum-profile-signature">点击写个个性签名</div>
                        <button id="forum-profile-bg-btn" class="forum-profile-link-btn" type="button">更换背景</button>
                    </div>
                    <div class="forum-profile-posts">
                        <div class="forum-profile-section-title">我的帖子</div>
                        <div id="forum-profile-post-list" class="forum-feed"></div>
                    </div>
                </div>
                <input id="forum-profile-avatar-input" type="file" accept="image/*" style="display:none" />
                <input id="forum-profile-bg-input" type="file" accept="image/*" style="display:none" />
            </div>
        `;
        initProfileView();
    };

    const initProfileView = async () => {
        const bgEl = document.getElementById('forum-profile-bg');
        const avatarBtn = document.getElementById('forum-profile-avatar-btn');
        const avatarView = document.getElementById('forum-profile-avatar');
        const avatarInput = document.getElementById('forum-profile-avatar-input');
        const bgBtn = document.getElementById('forum-profile-bg-btn');
        const bgInput = document.getElementById('forum-profile-bg-input');
        const nameEl = document.getElementById('forum-profile-name');
        const sigEl = document.getElementById('forum-profile-signature');
        const postListEl = document.getElementById('forum-profile-post-list');

        if (!bgEl || !avatarBtn || !avatarView || !avatarInput || !bgBtn || !bgInput || !nameEl || !sigEl || !postListEl) return;

        try {
            const bg = await localforage.getItem('forumProfileBg');
            if (bg) bgEl.style.backgroundImage = `url(${bg})`;
        } catch (e) {}

        try {
            const avatar = (await localforage.getItem('forumProfileAvatar')) || (await localforage.getItem('homeScreenAvatar'));
            if (avatar) avatarView.style.backgroundImage = `url(${avatar})`;
        } catch (e) {}

        const applyEditableFallback = async (el, storageKey, emptyText) => {
            const current = (el.textContent || '').trim();
            const next = window.prompt('请输入内容', current || '');
            if (next === null) return;
            const v = String(next).trim();
            el.textContent = v || emptyText;
            try {
                await localforage.setItem(storageKey, v || '');
            } catch (e) {}
        };

        const loadText = async (key) => {
            try {
                const v = await localforage.getItem(key);
                return typeof v === 'string' ? v : '';
            } catch (e) {
                return '';
            }
        };

        const updateMyPosts = (profileName) => {
            const mine = forumPosts.filter(p => p.isMine === true);
            if (!mine.length) {
                postListEl.innerHTML = `<span class="empty-text" style="opacity: 0.6; display: block; padding: 10px 0;">暂无帖子</span>`;
                return;
            }
            postListEl.innerHTML = mine.map(p => renderPostCard(p)).join('');
        };

        const savedName = (await loadText('forumProfileName')) || '水母用户';
        nameEl.textContent = savedName;

        const savedSig = (await loadText('forumProfileSignature')) || '';
        sigEl.textContent = savedSig ? savedSig : '点击写个个性签名';

        if (typeof makeEditable === 'function') {
            makeEditable('forum-profile-name', 'forumProfileName');
            makeEditable('forum-profile-signature', 'forumProfileSignature');
        } else {
            nameEl.addEventListener('click', () => applyEditableFallback(nameEl, 'forumProfileName', '水母用户'));
            sigEl.addEventListener('click', () => applyEditableFallback(sigEl, 'forumProfileSignature', '点击写个个性签名'));
        }

        nameEl.addEventListener('input', () => updateMyPosts(nameEl.textContent));
        nameEl.addEventListener('blur', () => updateMyPosts(nameEl.textContent));

        updateMyPosts(savedName);

        avatarBtn.addEventListener('click', () => avatarInput.click());
        bgBtn.addEventListener('click', () => bgInput.click());

        avatarInput.addEventListener('change', async (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file || typeof compressImage !== 'function') return;
            const compressed = await compressImage(file);
            avatarView.style.backgroundImage = `url(${compressed})`;
            avatarEl.style.backgroundImage = `url(${compressed})`;
            await localforage.setItem('forumProfileAvatar', compressed);
            currentUserAvatar = compressed;
            avatarInput.value = '';
        });

        bgInput.addEventListener('change', async (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file || typeof compressImage !== 'function') return;
            const compressed = await compressImage(file);
            bgEl.style.backgroundImage = `url(${compressed})`;
            await localforage.setItem('forumProfileBg', compressed);
            bgInput.value = '';
        });
    };

    const renderPlaceholder = (title, text) => {
        titleEl.textContent = title;
        body.innerHTML = `<span class="empty-text" style="opacity: 0.6; text-align: center; display: block; padding: 24px 0;">${text}</span>`;
    };

    const getLeaderboardData = async () => {
        try {
            const raw = await localforage.getItem('forumLeaderboardData');
            if (raw) {
                const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
                if (data && Array.isArray(data.ranking)) return data;
            }
        } catch (e) {}
        return null;
    };

    const generateLeaderboardData = async () => {
        const userName = await loadForumUserName();
        const api = await loadApiConfig();

        let totalPoints = 0;
        try {
            const walletRaw = await localforage.getItem('walletData');
            const wallet = typeof walletRaw === 'string' && walletRaw ? JSON.parse(walletRaw) : walletRaw;
            if (wallet && Array.isArray(wallet.pointsLedger)) {
                totalPoints = wallet.pointsLedger.reduce((sum, item) => {
                    const amt = Number.isFinite(parseInt(String(item.amount || 0), 10)) ? parseInt(String(item.amount || 0), 10) : 0;
                    return amt > 0 ? sum + amt : sum;
                }, 0);
            }
        } catch (e) {}

        const prompt = `
你正在生成一个“暗网论坛”的积分排行榜数据。
当前用户昵称：${userName}
当前用户总获取积分（历史累计）：${totalPoints}

请生成以下数据：
1. Top 30 用户排名（Name, Points - 降序排列）。积分在 ${Math.max(2000, totalPoints + 1000)}-1000000 之间。
2. 当前用户（${userName}）的排名与积分（Points）。
   - 用户的积分必须严格显示为 ${totalPoints}。
   - 请根据这个积分数值，将用户插入到合理的排名位置（取决于数值大小）。
   - 排名在1-1000000之间。
   - 必须用中文回复。
3. 10-20 条关于排行榜或最近活动的讨论评论（Name, Content）。

要求：
- 风格：黑客、神秘、暗网风格。
- 用户名：使用英文、数字或神秘代号。
- 讨论内容：关于排名变化、新任务、大佬动向等。

输出格式（严格遵守）：
[LEADERBOARD]
Rank: 1 | Name: <name> | Points: <points>
Rank: 2 | Name: <name> | Points: <points>
...
[/LEADERBOARD]

[MY_RANK]
Rank: <rank> | Name: ${userName} | Points: ${totalPoints}
[/MY_RANK]

[DISCUSSION]
Name: <name> | Content: <content>
Name: <name> | Content: <content>
...
[/DISCUSSION]
`.trim();

        const response = await fetch(new URL('/v1/chat/completions', api.url).href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api.key}`
            },
            body: JSON.stringify({
                model: api.model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.9
            })
        });

        if (!response.ok) throw new Error('API请求失败: ' + response.status);
        const result = await response.json();
        const content = result.choices[0].message.content || '';

        const ranking = [];
        const discussions = [];
        let myRank = null;

        // Parse Leaderboard
        const lbMatch = content.match(/\[LEADERBOARD\]([\s\S]*?)\[\/LEADERBOARD\]/);
        if (lbMatch) {
            const lines = lbMatch[1].trim().split('\n');
            for (const line of lines) {
                const m = line.match(/Rank:\s*(\d+)\s*\|\s*Name:\s*(.*?)\s*\|\s*Points:\s*(\d+)/);
                if (m) {
                    ranking.push({
                        rank: parseInt(m[1]),
                        name: m[2].trim(),
                        points: parseInt(m[3]),
                        isMe: false
                    });
                }
            }
        }

        // Parse My Rank
        const myMatch = content.match(/\[MY_RANK\]([\s\S]*?)\[\/MY_RANK\]/);
        if (myMatch) {
            const m = myMatch[1].match(/Rank:\s*(\d+)\s*\|\s*Name:\s*(.*?)\s*\|\s*Points:\s*(\d+)/);
            if (m) {
                myRank = {
                    rank: parseInt(m[1]),
                    name: m[2].trim(),
                    points: parseInt(m[3]),
                    isMe: true
                };
            }
        }

        // Parse Discussion
        const discMatch = content.match(/\[DISCUSSION\]([\s\S]*?)\[\/DISCUSSION\]/);
        if (discMatch) {
            const lines = discMatch[1].trim().split('\n');
            for (const line of lines) {
                const m = line.match(/Name:\s*(.*?)\s*\|\s*Content:\s*(.*)/);
                if (m) {
                    discussions.push({
                        name: m[1].trim(),
                        content: m[2].trim()
                    });
                }
            }
        }

        if (ranking.length === 0) throw new Error('解析排行榜失败');

        const data = { ranking, myRank, discussions, updatedAt: Date.now() };
        await localforage.setItem('forumLeaderboardData', JSON.stringify(data));
        return data;
    };

    const renderLeaderboard = async () => {
        titleEl.textContent = '积分排名';
        body.innerHTML = '<div class="loading-spinner"></div>';
        
        let data = await getLeaderboardData();
        
        const render = (d) => {
            body.innerHTML = `
                <div class="forum-leaderboard">
                    <div class="forum-leaderboard-header">
                        <div class="forum-leaderboard-title">排行榜</div>
                        <button type="button" class="modal-button glass small" id="forum-leaderboard-gen-btn">刷新榜单</button>
                    </div>
                    ${d ? `
                    <div class="forum-leaderboard-list">
                        ${d.ranking.map(r => `
                            <div class="forum-leaderboard-item ${r.isMe ? 'is-me' : ''}">
                                <div class="leaderboard-rank">${r.rank}</div>
                                <div class="leaderboard-info">
                                    <div class="leaderboard-name">${escapeHtml(r.name)}</div>
                                    <div class="leaderboard-points">${r.points} 积分</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    ${d.myRank ? `
                        <div class="forum-leaderboard-me-sticky">
                            <div class="leaderboard-rank">${d.myRank.rank}</div>
                            <div class="leaderboard-info">
                                <div class="leaderboard-name">我 (${escapeHtml(d.myRank.name)})</div>
                                <div class="leaderboard-points">${d.myRank.points} 积分</div>
                            </div>
                        </div>
                    ` : ''}
                    <div class="forum-leaderboard-discussion">
                        <div class="forum-leaderboard-title">讨论区</div>
                        <div class="forum-discussion-list">
                            ${d.discussions.map(disc => `
                                <div class="forum-discussion-item">
                                    <span class="discussion-name">${escapeHtml(disc.name)}:</span>
                                    <span class="discussion-content">${escapeHtml(disc.content)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : `<div class="empty-text" style="padding:20px;text-align:center;">暂无数据，请刷新生成</div>`}
                </div>
                <style>
                    .forum-leaderboard {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        overflow: hidden;
                        padding: 0 16px 16px;
                    }
                    .forum-leaderboard-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 12px;
                        flex-shrink: 0;
                    }
                    .forum-leaderboard-title {
                        font-size: 16px;
                        font-weight: bold;
                        color: var(--text-color);
                    }
                    .forum-leaderboard-list {
                        overflow-y: auto;
                        background: rgba(0,0,0,0.1);
                        border-radius: 16px;
                        padding: 8px;
                        margin-bottom: 8px;
                        max-height: 30%;
                    }
                    .forum-leaderboard-item {
                        display: flex;
                        align-items: center;
                        padding: 8px;
                        border-bottom: 1px solid rgba(255,255,255,0.05);
                    }
                    .forum-leaderboard-item:last-child {
                        border-bottom: none;
                    }
                    .forum-leaderboard-item.is-me {
                        background: rgba(255, 255, 255, 0.08);
                        backdrop-filter: blur(12px);
                        -webkit-backdrop-filter: blur(12px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 16px;
                    }
                    .leaderboard-rank {
                        font-size: 18px;
                        font-weight: bold;
                        width: 40px;
                        text-align: center;
                        margin-right: 12px;
                        color: var(--accent-color);
                    }
                    .leaderboard-info {
                        flex: 1;
                    }
                    .leaderboard-name {
                        font-size: 14px;
                        margin-bottom: 2px;
                    }
                    .leaderboard-points {
                        font-size: 12px;
                        opacity: 0.7;
                    }
                    .forum-leaderboard-me-sticky {
                        background: rgba(255, 255, 255, 0.08);
                        backdrop-filter: blur(12px);
                        -webkit-backdrop-filter: blur(12px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 16px;
                        padding: 8px 16px;
                        display: flex;
                        align-items: center;
                        margin-bottom: 16px;
                        flex-shrink: 0;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    }
                    .forum-leaderboard-discussion {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        overflow: hidden;
                        padding-bottom: 16px;
                    }
                    .forum-discussion-list {
                        flex: 1;
                        overflow-y: auto;
                        background: rgba(0,0,0,0.05);
                        border-radius: 16px;
                        padding: 8px;
                    }
                    .forum-discussion-item {
                        font-size: 13px;
                        padding: 6px 0;
                        border-bottom: 1px dashed rgba(255,255,255,0.1);
                    }
                    .discussion-name {
                        font-weight: bold;
                        margin-right: 6px;
                        color: var(--accent-color);
                    }
                    .discussion-content {
                        opacity: 0.8;
                    }
                </style>
            `;
            
            const genBtn = document.getElementById('forum-leaderboard-gen-btn');
            if (genBtn) {
                genBtn.addEventListener('click', async () => {
                    genBtn.disabled = true;
                    genBtn.textContent = '生成中...';
                    try {
                        const newData = await generateLeaderboardData();
                        render(newData);
                        showForumToast('榜单已更新', { type: 'success' });
                    } catch (e) {
                        showForumToast('生成失败: ' + e.message, { type: 'error' });
                        genBtn.disabled = false;
                        genBtn.textContent = '刷新榜单';
                    }
                });
            }
        };

        render(data);
    };

    const renderByView = (view) => {
        ensureForumFab();
        syncForumFabVisibility(view);
        overlay.classList.toggle('profile-view', view === 'profile');
        if (view === 'profile' || view === 'compose' || view === 'leaderboard') closeMenu();
        if (typeof view === 'string' && view.startsWith('post:')) {
            const postId = view.slice(5);
            return renderPostDetail(postId);
        }
        if (view === 'home') return renderHome();
        if (view === 'profile') return renderProfile();
        if (view === 'compose') return renderCompose();
        if (view === 'leaderboard') return renderLeaderboard();
        if (view === 'bind-role') return renderPlaceholder('绑定角色', '绑定角色（占位）');
        if (view === 'switch-forum') return renderPlaceholder('切换论坛', '切换论坛（占位）');
        return renderHome();
    };

    const navigate = (view) => {
        if (viewStack[viewStack.length - 1] === 'home') {
            homeScrollY = window.scrollY || document.documentElement.scrollTop || 0;
        }
        viewStack.push(view);
        renderByView(view);
    };

    const back = () => {
        if (viewStack.length <= 1) {
            closeForum();
            return;
        }
        viewStack.pop();
        const prev = viewStack[viewStack.length - 1];
        renderByView(prev);
        if (prev === 'home') {
            window.scrollTo(0, homeScrollY);
        }
    };

    const lockScroll = () => {
        if (locked) return;
        locked = true;
        scrollY = window.scrollY || document.documentElement.scrollTop || 0;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
    };

    const unlockScroll = () => {
        if (!locked) return;
        locked = false;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
    };

    const syncAvatar = async () => {
        try {
            const avatar = (await localforage.getItem('forumProfileAvatar')) || (await localforage.getItem('homeScreenAvatar'));
            currentUserAvatar = avatar || '';
            if (avatar) {
                avatarEl.style.backgroundImage = `url(${avatar})`;
            } else {
                avatarEl.style.backgroundImage = '';
            }
        } catch (e) {
            avatarEl.style.backgroundImage = '';
            currentUserAvatar = '';
        }
    };

    const openForum = async () => {
        await syncAvatar();
        await ensureForums();
        await refreshContentRegex();
        await loadLikedPostIds();
        await loadPostsForCurrentForum();
        ensureForumFab();
        overlay.classList.add('visible');
        overlay.setAttribute('aria-hidden', 'false');
        overlay.classList.remove('profile-view');
        lockScroll();
        closeMenu();
        viewStack = ['home'];
        homeScrollY = 0;
        renderHome();
        syncForumFabVisibility('home');
    };

    const closeForum = () => {
        closeMenu();
        overlay.classList.remove('visible');
        overlay.classList.remove('profile-view');
        overlay.setAttribute('aria-hidden', 'true');
        unlockScroll();
        syncForumFabVisibility('');
    };

    const openMenu = () => {
        if (menuOpen) return;
        menuOpen = true;
        overlay.classList.add('menu-open');
        menu.setAttribute('aria-hidden', 'false');

        // Inject leaderboard button for darkweb
        const leaderboardBtn = menu.querySelector('[data-action="leaderboard"]');
        if (currentForumId === 'darkweb') {
            if (!leaderboardBtn) {
                const btn = document.createElement('button');
                btn.className = 'forum-menu-item';
                btn.type = 'button';
                btn.dataset.action = 'leaderboard';
                // Simple chart icon
                btn.innerHTML = `
                    <svg class="forum-menu-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11V3H8v6H2v12h20V11h-6zm-6-6h4v14h-4V5zm-6 6h4v8H4v-8zm16 8h-4v-6h4v6z"></path></svg>
                    <span>积分排名</span>
                `;
                const bgBtn = document.createElement('button');
                bgBtn.className = 'forum-menu-item';
                bgBtn.type = 'button';
                bgBtn.dataset.action = 'background-image';
                bgBtn.innerHTML = `
                    <svg class="forum-menu-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M864 128H160c-17.7 0-32 14.3-32 32v704c0 17.7 14.3 32 32 32h704c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32z m-32 704H192V192h640v640z" fill="#2c2c2c"></path><path d="M384 320c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64z m384 448H256l128-256 128 128 160-192 128 256z" fill="#2c2c2c" opacity=".5"></path></svg>
                    <span>背景图片</span>
                `;
                const switchBtn = menu.querySelector('[data-action="switch-forum"]');
                if (switchBtn) {
                    menu.insertBefore(btn, switchBtn);
                    menu.insertBefore(bgBtn, switchBtn);
                } else {
                    menu.appendChild(btn);
                    menu.appendChild(bgBtn);
                }
            }
        } else {
            if (leaderboardBtn) {
                leaderboardBtn.remove();
            }
        }
    };

    const closeMenu = () => {
        if (!menuOpen) return;
        menuOpen = false;
        overlay.classList.remove('menu-open');
        menu.setAttribute('aria-hidden', 'true');
    };

    const toggleMenu = () => {
        if (menuOpen) closeMenu();
        else openMenu();
    };

    body.addEventListener('click', async (e) => {
        const likeBtn = e.target.closest('button[data-forum-like]');
        if (likeBtn) {
            e.preventDefault();
            e.stopPropagation();
            const postId = likeBtn.dataset.postId;
            if (!postId) return;
            if (likedPostIds.has(postId)) likedPostIds.delete(postId);
            else likedPostIds.add(postId);
            await saveLikedPostIds();

            const liked = likedPostIds.has(postId);
            likeBtn.style.color = liked ? '#ff375f' : 'var(--text-color)';
            const iconEl = likeBtn.querySelector('[data-forum-like-icon]');
            if (iconEl) iconEl.innerHTML = liked ? heartSolidSvg : heartOutlineSvg;
            const labelEl = likeBtn.querySelector('[data-forum-like-label]');
            if (labelEl) {
                const nextCount = getPostLikeCount(postId);
                labelEl.textContent = nextCount > 0 ? String(nextCount) : '赞';
            }
            return;
        }

        const commentBtn = e.target.closest('button[data-forum-comment]');
        if (commentBtn) {
            e.preventDefault();
            e.stopPropagation();
            const postId = commentBtn.dataset.postId;
            if (!postId) return;
            const current = viewStack[viewStack.length - 1] || '';
            if (!(typeof current === 'string' && current.startsWith('post:'))) {
                navigate(`post:${postId}`);
            }
            return;
        }

        const shareBtn = e.target.closest('button[data-forum-share]');
        if (shareBtn) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        const card = e.target.closest('[data-post-id]');
        if (!card) return;
        if (e.target.closest('.forum-post-actions')) return;
        const postId = card.dataset.postId;
        if (!postId) return;
        const current = viewStack[viewStack.length - 1] || '';
        if (typeof current === 'string' && current.startsWith('post:')) return;
        navigate(`post:${postId}`);
    });

    const safeJsonParse = (raw, fallback) => {
        try {
            if (raw == null) return fallback;
            if (typeof raw === 'string') return raw ? JSON.parse(raw) : fallback;
            return raw;
        } catch (e) {
            return fallback;
        }
    };

    const loadApiConfig = async () => {
        const [apiPresetsRaw, diarySettingsRaw, apiSettingsRaw] = await Promise.all([
            localforage.getItem('apiPresets'),
            localforage.getItem('diary_settings'),
            localforage.getItem('apiSettings')
        ]);
        const apiPresets = safeJsonParse(apiPresetsRaw, {}) || {};
        const diarySettings = safeJsonParse(diarySettingsRaw, {}) || {};
        const apiSettings = safeJsonParse(apiSettingsRaw, {}) || {};

        const presetName = diarySettings && diarySettings.apiPresetName ? String(diarySettings.apiPresetName) : '';
        const preset = presetName && apiPresets && apiPresets[presetName] ? apiPresets[presetName] : null;
        const cfg = preset && preset.url ? preset : apiSettings;
        const url = cfg && cfg.url ? String(cfg.url) : '';
        const key = cfg && cfg.key ? String(cfg.key) : '';
        const model = cfg && cfg.model ? String(cfg.model) : '';
        if (!url || !key || !model) throw new Error('API未配置，请先在设置中配置 API Preset 或 APISettings');
        return { url, key, model };
    };

    const loadForumUserName = async () => {
        try {
            const raw = await localforage.getItem('forumProfileName');
            const s = typeof raw === 'string' ? raw.trim() : '';
            return s || '水母用户';
        } catch (e) {
            return '水母用户';
        }
    };

    const buildForumGenPrompt = ({ forum, boundRoles, userName, leaderboardData }) => {
        const name = forum ? String(forum.name || '').trim() : '';
        const theme = forum ? String(forum.theme || '').trim() : '';
        const rule = forum ? String(forum.rule || '').trim() : '';
        const template = forum ? String(forum.promptTemplate || '').trim() : '';

        const rolesText = (boundRoles || []).map(r => {
            const id = r && r.id ? String(r.id) : '';
            const rn = r && r.name ? String(r.name) : '';
            const persona = r && r.persona ? String(r.persona) : '';
            return `- RoleId: ${id}\n  Name: ${rn}\n  Persona: ${persona}`;
        }).join('\n');

        let leaderboardContext = '';
        if (leaderboardData && Array.isArray(leaderboardData.ranking)) {
            const top5 = leaderboardData.ranking.slice(0, 5).map(r => `${r.rank}. ${r.name} (${r.points})`).join(', ');
            let userRank = '未上榜';
            if (leaderboardData.myRank) {
                userRank = `${leaderboardData.myRank.rank} (${leaderboardData.myRank.points})`;
            }
            leaderboardContext = `当前排行榜 Top5: ${top5} ... 用户排名: ${userRank}`;
        }

        return `
你正在为一个论坛生成帖子与评论
论坛名称：${name || '论坛'}
论坛主题：
${theme || '（无）'}

论坛规范：
${rule || '（无）'}

系统提示词（仅供你理解世界观与写法）：
${template || '（无）'}

${leaderboardContext ? `排行榜参考信息（可选择性在帖子/评论中提及）：\n${leaderboardContext}` : ''}

重要要求（必须严格遵守）：
1) 只允许输出下面规定的块标签格式，禁止输出任何额外说明/Markdown/空闲聊天
2) 必须生成 5-10 条帖子，总评论数 5-20 条，且每条帖子都要给出点赞数
3) 文风要活人感：多口语化，句末不加句号，要有生活细节和自己的故事线
4) 绑定角色可以发帖，也可以小概率在别人帖子里评论，但整体比例要小
5) 严禁代替用户“${userName}”发帖或回复，输出中禁止出现 RoleId: user 或 AuthorName: ${userName}
6) 可以适当在帖子正文最后加入标签，标签格式为 #标签（不需要结尾#），但不要求每条都加
7) 匿名功能：每条帖子/评论都必须给出 Anonymous: true/false
8) 每个帖子必须有一个简短的标题 (Title)

绑定角色列表（可用来发帖/评论，若使用必须写 RoleId）：
${rolesText || '（无绑定角色）'}

输出格式（严格按此格式，字段名大小写与顺序要一致）：
[FORUM_POST]
PostId: <唯一id>
Title: <标题>
AuthorName: <昵称>
RoleId: <可选，绑定角色才写，否则留空>
Anonymous: <true|false>
Text: <<<
帖子正文（可多行）
>>>
LikeCount: <整数>
[COMMENTS]
[COMMENT]
CommentId: <唯一id>
UserName: <昵称>
RoleId: <可选，绑定角色才写，否则留空>
Anonymous: <true|false>
Text: <<<
评论正文（可多行）
>>>
[/COMMENT]
[/COMMENTS]
[/FORUM_POST]
`.trim();
    };

    const parseForumGenResult = (content) => {
        const text = String(content || '');
        const posts = [];
        const postRe = /\[FORUM_POST\]\s*PostId:\s*(.*?)\s*Title:\s*(.*?)\s*AuthorName:\s*(.*?)\s*RoleId:\s*(.*?)\s*Anonymous:\s*(true|false)\s*Text:\s*<<<([\s\S]*?)>>>\s*LikeCount:\s*(\d+)\s*\[COMMENTS\]([\s\S]*?)\[\/COMMENTS\]\s*\[\/FORUM_POST\]/gi;
        const commentRe = /\[COMMENT\]\s*CommentId:\s*(.*?)\s*UserName:\s*(.*?)\s*RoleId:\s*(.*?)\s*Anonymous:\s*(true|false)\s*Text:\s*<<<([\s\S]*?)>>>\s*\[\/COMMENT\]/gi;
        let m;
        while ((m = postRe.exec(text)) !== null) {
            const postId = String(m[1] || '').trim();
            const title = String(m[2] || '').trim();
            const authorName = String(m[3] || '').trim();
            const roleId = String(m[4] || '').trim();
            const anonymous = String(m[5] || '').trim() === 'true';
            const bodyText = String(m[6] || '').trim();
            const likeCount = parseInt(String(m[7] || '0'), 10);
            const commentsBlock = String(m[8] || '');
            const comments = [];
            let c;
            while ((c = commentRe.exec(commentsBlock)) !== null) {
                const commentId = String(c[1] || '').trim();
                const userName = String(c[2] || '').trim();
                const cRoleId = String(c[3] || '').trim();
                const cAnon = String(c[4] || '').trim() === 'true';
                const cText = String(c[5] || '').trim();
                comments.push({
                    id: commentId || '',
                    authorName: userName || '路人',
                    roleId: cRoleId || '',
                    anonymous: cAnon,
                    content: cText
                });
            }
            posts.push({
                id: postId || '',
                title: title,
                authorName: authorName || '路人',
                roleId: roleId || '',
                anonymous,
                content: bodyText,
                likes: Number.isFinite(likeCount) ? likeCount : 0,
                comments
            });
        }
        return posts;
    };

    const buildForumInteractionPrompt = ({ forum, boundRoles, userName, post, leaderboardData }) => {
        const name = forum ? String(forum.name || '').trim() : '';
        const theme = forum ? String(forum.theme || '').trim() : '';
        const rule = forum ? String(forum.rule || '').trim() : '';
        const template = forum ? String(forum.promptTemplate || '').trim() : '';
        const postText = post ? String(post.content || '').trim() : '';
        const postTags = normalizePostTags(post && post.tags).map(t => `#${t}`).join(' ');

        const rolesText = (boundRoles || []).map(r => {
            const id = r && r.id ? String(r.id) : '';
            const rn = r && r.name ? String(r.name) : '';
            const persona = r && r.persona ? String(r.persona) : '';
            return `- RoleId: ${id}\n  Name: ${rn}\n  Persona: ${persona}`;
        }).join('\n');

        let leaderboardContext = '';
        if (leaderboardData && Array.isArray(leaderboardData.ranking)) {
            const top5 = leaderboardData.ranking.slice(0, 5).map(r => `${r.rank}. ${r.name} (${r.points})`).join(', ');
            let userRank = '未上榜';
            if (leaderboardData.myRank) {
                userRank = `${leaderboardData.myRank.rank} (${leaderboardData.myRank.points})`;
            }
            leaderboardContext = `当前排行榜 Top5: ${top5} ... 用户排名: ${userRank}`;
        }

        return `
你正在为一个论坛帖子生成“互动”（评论与点赞增量）
论坛名称：${name || '论坛'}
论坛主题：
${theme || '（无）'}

论坛规范：
${rule || '（无）'}

系统提示词（仅供你理解世界观与写法）：
${template || '（无）'}

${leaderboardContext ? `排行榜参考信息（可选择性在评论中提及）：\n${leaderboardContext}` : ''}

帖子内容：
<<<
${postText || '（无）'}
>>>
帖子标签：${postTags || '（无）'}

重要要求（必须严格遵守）：
1) 只允许输出下面规定的块标签格式，禁止输出任何额外说明/Markdown/空闲聊天
2) 点赞增量 LikeDelta 为 0-1000000 的整数
3) 生成 5-30 条评论，文风像真实论坛，口语化，句末不加句号
4) 绑定角色可以来评论，要严格遵守角色人设，禁止OOC
5) 严禁代替用户“${userName}”评论，输出中禁止出现 RoleId: user 或 UserName: ${userName}
6) 匿名功能：每条评论都必须给出 Anonymous: true/false

绑定角色列表（可用来评论，若使用必须写 RoleId）：
${rolesText || '（无绑定角色）'}

输出格式（严格按此格式，字段名大小写与顺序要一致）：
[FORUM_INTERACTION]
PostId: ${post && post.id ? String(post.id) : ''}
LikeDelta: <整数>
[COMMENTS]
[COMMENT]
CommentId: <唯一id>
UserName: <昵称>
RoleId: <可选，绑定角色才写，否则留空>
Anonymous: <true|false>
Text: <<<
评论正文（可多行）
>>>
[/COMMENT]
[/COMMENTS]
[/FORUM_INTERACTION]
`.trim();
    };

    const parseForumInteractionResult = (content) => {
        const text = String(content || '');
        const rootRe = /\[FORUM_INTERACTION\]\s*PostId:\s*(.*?)\s*LikeDelta:\s*(-?\d+)\s*\[COMMENTS\]([\s\S]*?)\[\/COMMENTS\]\s*\[\/FORUM_INTERACTION\]/i;
        const commentRe = /\[COMMENT\]\s*CommentId:\s*(.*?)\s*UserName:\s*(.*?)\s*RoleId:\s*(.*?)\s*Anonymous:\s*(true|false)\s*Text:\s*<<<([\s\S]*?)>>>\s*\[\/COMMENT\]/gi;
        const m = rootRe.exec(text);
        if (!m) return null;
        const likeDelta = parseInt(String(m[2] || '0'), 10);
        const commentsBlock = String(m[3] || '');
        const comments = [];
        let c;
        while ((c = commentRe.exec(commentsBlock)) !== null) {
            comments.push({
                id: String(c[1] || '').trim(),
                authorName: String(c[2] || '').trim() || '路人',
                roleId: String(c[3] || '').trim(),
                anonymous: String(c[4] || '').trim() === 'true',
                content: String(c[5] || '').trim()
            });
        }
        return {
            likeDelta: Number.isFinite(likeDelta) ? likeDelta : 0,
            comments
        };
    };

    const triggerAiInteractionForPost = async (postId) => {
        const pid = String(postId || '').trim();
        if (!pid) return;
        if (aiInteractingPostIds.has(pid)) return;
        const idx = forumPosts.findIndex(p => String(p && p.id ? p.id : '') === pid);
        if (idx < 0) return;

        aiInteractingPostIds.add(pid);
        renderByView(viewStack[viewStack.length - 1] || 'home');

        try {
            const forum = getCurrentForum();
            if (!forum) throw new Error('论坛未初始化');
            const userName = await loadForumUserName();
            const chars = await loadArchiveCharacters();
            const bound = new Set(Array.isArray(forum.boundRoleIds) ? forum.boundRoleIds : []);
            const boundRoles = chars.filter(c => bound.has(String(c.id || ''))).map(c => ({
                id: String(c.id || '').trim(),
                name: String(c.name || '').trim(),
                persona: String(c.persona || '').trim(),
                avatar: String(c.avatar || '').trim()
            })).filter(r => r.id && r.name);

            const api = await loadApiConfig();
            const post = forumPosts.find(p => String(p && p.id ? p.id : '') === pid);
            if (!post) return;
            const leaderboardData = await getLeaderboardData();
            const prompt = buildForumInteractionPrompt({ forum, boundRoles, userName, post, leaderboardData });

            const response = await fetch(new URL('/v1/chat/completions', api.url).href, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${api.key}`
                },
                body: JSON.stringify({
                    model: api.model,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.9
                })
            });
            if (!response.ok) throw new Error('API请求失败: ' + response.status);
            const result = await response.json();
            const content = result && result.choices && result.choices[0] && result.choices[0].message ? String(result.choices[0].message.content || '') : '';
            const parsed = parseForumInteractionResult(content);
            if (!parsed) throw new Error('互动解析失败');

            const likeDelta = Math.max(0, Math.min(120, Number.isFinite(parseInt(String(parsed.likeDelta || 0), 10)) ? parseInt(String(parsed.likeDelta || 0), 10) : 0));
            const comments = Array.isArray(parsed.comments) ? parsed.comments : [];
            const safeComments = comments
                .filter(c => c && c.authorName && String(c.authorName).trim() && String(c.roleId || '').trim() !== 'user' && String(c.authorName).trim() !== userName)
                .slice(0, 8)
                .map((c, cIdx) => ({
                    id: c.id ? String(c.id).trim() : `c_${pid}_ai_${Date.now().toString(36)}_${cIdx}`,
                    authorName: String(c.authorName || '路人').trim() || '路人',
                    roleId: String(c.roleId || '').trim(),
                    anonymous: !!c.anonymous,
                    content: String(c.content || '').trim()
                }))
                .filter(c => c.content);

            const currentIdx = forumPosts.findIndex(p => String(p && p.id ? p.id : '') === pid);
            if (currentIdx < 0) return;
            const current = forumPosts[currentIdx];
            const baseLikes = Number.isFinite(parseInt(String(current.likes ?? 0), 10)) ? parseInt(String(current.likes ?? 0), 10) : 0;
            const existingCommentIds = new Set(Array.isArray(current.comments) ? current.comments.map(x => String(x && x.id ? x.id : '')) : []);
            const mergedComments = Array.isArray(current.comments) ? [...current.comments] : [];
            for (const c of safeComments) {
                if (!c || !c.id) continue;
                if (existingCommentIds.has(c.id)) continue;
                mergedComments.push(c);
                existingCommentIds.add(c.id);
            }
            forumPosts[currentIdx] = {
                ...current,
                likes: Math.max(0, baseLikes + likeDelta),
                comments: mergedComments
            };

            await savePostsForCurrentForum();
            renderByView(viewStack[viewStack.length - 1] || 'home');
        } catch (e) {
            const msg = e && e.message ? String(e.message) : '';
            if (msg.includes('API未配置')) showForumToast('未配置API，已跳过AI互动', { type: 'info', duration: 1800 });
            else showForumToast('AI互动生成失败', { type: 'error', duration: 1800 });
        } finally {
            aiInteractingPostIds.delete(pid);
            renderByView(viewStack[viewStack.length - 1] || 'home');
        }
    };

    const showForumToast = (msg, opts) => {
        if (typeof showGlobalToast === 'function') {
            showGlobalToast(String(msg || ''), opts || { type: 'info', duration: 2200 });
            return;
        }
        if (typeof showCustomAlert === 'function') {
            showCustomAlert(String(msg || ''));
            return;
        }
        window.alert(String(msg || ''));
    };

    let generating = false;
    const setGeneratingState = (on) => {
        generating = !!on;
        try {
            generateBtn.disabled = generating;
            const svg = generateBtn.querySelector('svg');
            if (svg) svg.style.animation = generating ? 'forumSpin 1s linear infinite' : '';
        } catch (e) {}
    };

    const ensureGenerateSpinStyle = () => {
        if (document.getElementById('forum-spin-style')) return;
        const styleEl = document.createElement('style');
        styleEl.id = 'forum-spin-style';
        styleEl.textContent = '@keyframes forumSpin{to{transform:rotate(360deg)}}.forum-generate-icon{transform-origin:50% 50%}';
        document.head.appendChild(styleEl);
    };

    entry.addEventListener('click', (e) => {
        e.preventDefault();
        openForum();
    });

    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        back();
    });

    avatarBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (generating) return;
        toggleMenu();
    });

    generateBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (generating) return;
        ensureGenerateSpinStyle();
        setGeneratingState(true);
        try {
            const forum = getCurrentForum();
            if (!forum) throw new Error('论坛未初始化');

            const userName = await loadForumUserName();
            const chars = await loadArchiveCharacters();
            const bound = new Set(Array.isArray(forum.boundRoleIds) ? forum.boundRoleIds : []);
            const boundRoles = chars.filter(c => bound.has(String(c.id || ''))).map(c => ({
                id: String(c.id || '').trim(),
                name: String(c.name || '').trim(),
                persona: String(c.persona || '').trim(),
                avatar: String(c.avatar || '').trim()
            })).filter(r => r.id && r.name);

            const api = await loadApiConfig();
            const leaderboardData = await getLeaderboardData();
            const prompt = buildForumGenPrompt({ forum, boundRoles, userName, leaderboardData });

            const response = await fetch(new URL('/v1/chat/completions', api.url).href, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${api.key}`
                },
                body: JSON.stringify({
                    model: api.model,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.9
                })
            });
            if (!response.ok) throw new Error('API请求失败: ' + response.status);
            const result = await response.json();
            const content = result && result.choices && result.choices[0] && result.choices[0].message ? String(result.choices[0].message.content || '') : '';

            let posts = parseForumGenResult(content);
            posts = posts
                .filter(p => p && p.authorName && String(p.authorName).trim() && String(p.roleId || '').trim() !== 'user' && String(p.authorName).trim() !== userName)
                .map((p, idx) => {
                    const postId = p.id ? String(p.id).trim() : `ai_${Date.now().toString(36)}_${idx}`;
                    const comments = Array.isArray(p.comments) ? p.comments : [];
                    const normalizedComments = comments
                        .filter(c => c && c.authorName && String(c.authorName).trim() && String(c.roleId || '').trim() !== 'user' && String(c.authorName).trim() !== userName)
                        .map((c, cIdx) => ({
                            id: c.id ? String(c.id).trim() : `c_${postId}_${cIdx}`,
                            authorName: String(c.authorName || '路人').trim() || '路人',
                            roleId: String(c.roleId || '').trim(),
                            anonymous: !!c.anonymous,
                            content: String(c.content || '').trim()
                        }));
                    return {
                        id: postId,
                        title: p.title || '',
                        authorName: String(p.authorName || '路人').trim() || '路人',
                        roleId: String(p.roleId || '').trim(),
                        anonymous: !!p.anonymous,
                        content: String(p.content || '').trim(),
                        likes: Math.max(0, Number.isFinite(parseInt(String(p.likes || 0), 10)) ? parseInt(String(p.likes || 0), 10) : 0),
                        comments: normalizedComments
                    };
                });

            const postCount = posts.length;
            const totalComments = posts.reduce((n, p) => n + (Array.isArray(p.comments) ? p.comments.length : 0), 0);
            if (postCount < 5 || postCount > 10) throw new Error('生成数量不符合要求：帖子需 5-10 条');
            if (totalComments < 5 || totalComments > 20) throw new Error('生成数量不符合要求：总评论需 5-20 条');

            const existingIds = new Set(forumPosts.map(p => String(p && p.id ? p.id : '')));
            for (let i = posts.length - 1; i >= 0; i -= 1) {
                const p = posts[i];
                if (!p || !p.id) continue;
                if (existingIds.has(p.id)) continue;
                forumPosts.unshift(p);
                existingIds.add(p.id);
            }

            await savePostsForCurrentForum();
            const currentView = viewStack[viewStack.length - 1] || 'home';
            renderByView(currentView);
            showForumToast('已生成帖子', { type: 'success', duration: 1600 });
        } catch (err) {
            const msg = err && err.message ? String(err.message) : '生成失败';
            showForumToast(msg, { type: 'error', duration: 2400 });
        } finally {
            setGeneratingState(false);
            closeMenu();
        }
    });

    menu.addEventListener('click', (e) => {
        if (generating) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        const item = e.target.closest('.forum-menu-item');
        if (!item) return;
        const action = item.dataset.action || '';
        closeMenu();
        if (action === 'bind-role') {
            openBindRoleDialog();
            return;
        }
        if (action === 'switch-forum') {
            openSwitchForumDialog();
            return;
        }
        if (action === 'background-image') {
            openImagePickerDialog();
            return;
        }
        navigate(action || 'home');
    });

    overlay.addEventListener('click', (e) => {
        if (!menuOpen) return;
        if (generating) return;
        if (menu.contains(e.target)) return;
        if (avatarBtn.contains(e.target)) return;
        if (generateBtn.contains(e.target)) return;
        closeMenu();
        e.stopPropagation();
    }, true);
})();
