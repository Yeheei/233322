// === Mall App (商城) ===
(function() {
    // 1. Mock Data
    const categories = ['FOOD', 'COFFEE', 'CLOTHES', 'COMMODITY', 'GIFTS', 'PLAY'];
    const categoryMeta = {
        FOOD: { title: 'FOOD', defaultEmoji: '🍱' },
        COFFEE: { title: 'COFFEE', defaultEmoji: '🥤' },
        CLOTHES: { title: 'CLOTHES', defaultEmoji: '👕' },
        COMMODITY: { title: 'COMMODITY', defaultEmoji: '🧻' },
        GIFTS: { title: 'GIFTS', defaultEmoji: '🎁' },
        PLAY: { title: 'PLAY', defaultEmoji: '🎟️' }
    };
    const categoryDisplayZh = {
        FOOD: '食物',
        COFFEE: '饮品',
        CLOTHES: '衣物',
        COMMODITY: '日用品',
        GIFTS: '礼物',
        PLAY: '娱乐'
    };

    const defaultProductsByCategory = {
        FOOD: [
            { id: 1, name: '关东煮拼盘', emoji: '🍢', price: 18.00, desc: '鱼丸、白萝卜、魔芋结，热乎入味。' },
            { id: 2, name: '芝士牛肉堡', emoji: '🍔', price: 26.00, desc: '厚切牛肉饼，拉丝芝士，现烤香脆。' },
            { id: 3, name: '海盐曲奇盒', emoji: '🍪', price: 19.90, desc: '黄油香浓，海盐点睛，酥到掉渣。' },
            { id: 4, name: '抹茶千层', emoji: '🍰', price: 32.00, desc: '薄饼层层叠叠，抹茶微苦回甘。' },
            { id: 5, name: '辣味鸡翅', emoji: '🍗', price: 24.00, desc: '外酥里嫩，甜辣酱汁，越吃越上头。' },
            { id: 6, name: '水果酸奶杯', emoji: '🥣', price: 16.50, desc: '草莓蓝莓加坚果，清爽不腻。' }
        ],
        COFFEE: [
            { id: 7, name: '冰美式咖啡', emoji: '🧊', price: 15.00, desc: '清爽干净，苦香回甘，解腻神器。' },
            { id: 8, name: '生椰拿铁', emoji: '🥥', price: 22.00, desc: '椰香浓郁，奶咖顺滑，冰饮更赞。' },
            { id: 9, name: '桂花乌龙', emoji: '🫖', price: 18.00, desc: '桂花清甜，乌龙回甘，冷热都好喝。' },
            { id: 10, name: '芒果气泡水', emoji: '🥭', price: 16.00, desc: '果香浓、气泡足，夏日一口降温。' },
            { id: 11, name: '草莓奶昔', emoji: '🍓', price: 20.00, desc: '浓稠顺滑，草莓酸甜，饱腹也满足。' },
            { id: 12, name: '热可可', emoji: '🍫', price: 17.00, desc: '巧克力浓度在线，暖手也暖心。' }
        ],
        CLOTHES: [
            { id: 13, name: '纯棉白T恤', emoji: '👕', price: 39.00, desc: '亲肤透气，日常百搭，版型利落。' },
            { id: 14, name: '牛仔直筒裤', emoji: '👖', price: 89.00, desc: '高腰显腿长，耐穿不挑人。' },
            { id: 15, name: '羊毛针织衫', emoji: '🧥', price: 129.00, desc: '柔软保暖，通勤休闲都能穿。' },
            { id: 16, name: '轻量跑步鞋', emoji: '👟', price: 159.00, desc: '回弹缓震，长走不累，透气不闷脚。' },
            { id: 17, name: '帆布托特包', emoji: '👜', price: 49.00, desc: '大容量耐磨，通勤上课都好装。' },
            { id: 18, name: '丝绸发圈', emoji: '🎀', price: 19.00, desc: '不易拉扯，温柔固定发型。' }
        ],
        COMMODITY: [
            { id: 19, name: '无香抽纸', emoji: '🧻', price: 12.90, desc: '柔韧不掉屑，居家必备。' },
            { id: 20, name: '柠檬洗洁精', emoji: '🧼', price: 14.00, desc: '去油快、泡沫细，淡淡柠檬香。' },
            { id: 21, name: '竹纤维抹布', emoji: '🧽', price: 9.90, desc: '吸水强、耐用不易发臭。' },
            { id: 22, name: '替换牙刷头', emoji: '🪥', price: 29.00, desc: '细软刷毛，清洁更到位。' },
            { id: 23, name: '香薰蜡烛', emoji: '🕯️', price: 39.00, desc: '木质香调，点燃后氛围感拉满。' },
            { id: 24, name: '一次性手套', emoji: '🧤', price: 11.00, desc: '做饭清洁都方便，贴合不易破。' }
        ],
        GIFTS: [
            { id: 25, name: '永生花礼盒', emoji: '💐', price: 99.00, desc: '持久不凋谢，送礼不踩雷。' },
            { id: 26, name: '手作巧克力', emoji: '🍫', price: 58.00, desc: '多口味混装，甜度刚刚好。' },
            { id: 27, name: '治愈小熊', emoji: '🧸', price: 69.00, desc: '软乎乎抱着睡，心情瞬间变好。' },
            { id: 28, name: '香氛礼袋', emoji: '🌸', price: 79.00, desc: '扩香片+喷雾组合，清新不刺鼻。' },
            { id: 29, name: '定制钥匙扣', emoji: '🔑', price: 35.00, desc: '刻字定制，小巧但很有心意。' },
            { id: 30, name: '星空水晶球', emoji: '🔮', price: 88.00, desc: '轻轻摇晃闪闪发光，摆桌绝美。' }
        ],
        PLAY: [
            { id: 31, name: '电影双人票', emoji: '🎬', price: 78.00, desc: '任选影片场次，约会看电影更划算。' },
            { id: 32, name: '电玩城代币包', emoji: '🕹️', price: 59.00, desc: '多币组合，抓娃娃一把过瘾。' },
            { id: 33, name: '攀岩体验课', emoji: '🧗', price: 129.00, desc: '教练带练，入门友好，解锁新运动。' },
            { id: 34, name: 'KTV小时券', emoji: '🎤', price: 68.00, desc: '包间限时畅唱，和朋友放肆嗨。' },
            { id: 35, name: '桌游畅玩卡', emoji: '🎲', price: 49.00, desc: '热门桌游随便选，周末消磨时间。' },
            { id: 36, name: '游乐园日票', emoji: '🎡', price: 199.00, desc: '多项目通玩，快乐从早到晚。' }
        ]
    };

    let activeCategory = 'FOOD';
    const defaultAllProducts = Object.values(defaultProductsByCategory).flat();
    let nextProductId = 1 + Math.max(0, ...defaultAllProducts.map((p) => p.id));

    const productsByCategory = {
        FOOD: (defaultProductsByCategory.FOOD || []).map((p) => ({ ...p, category: 'FOOD' })),
        COFFEE: (defaultProductsByCategory.COFFEE || []).map((p) => ({ ...p, category: 'COFFEE' })),
        CLOTHES: (defaultProductsByCategory.CLOTHES || []).map((p) => ({ ...p, category: 'CLOTHES' })),
        COMMODITY: (defaultProductsByCategory.COMMODITY || []).map((p) => ({ ...p, category: 'COMMODITY' })),
        GIFTS: (defaultProductsByCategory.GIFTS || []).map((p) => ({ ...p, category: 'GIFTS' })),
        PLAY: (defaultProductsByCategory.PLAY || []).map((p) => ({ ...p, category: 'PLAY' }))
    };

    const productById = new Map();
    Object.values(productsByCategory).flat().forEach((p) => productById.set(p.id, p));

    const PRODUCT_NAME_RE = /【商品名】([\s\S]*?)【\/商品名】/g;
    const PRODUCT_DESC_RE = /【商品介绍】([\s\S]*?)【\/商品介绍】/g;
    const PRODUCT_PRICE_RE = /【价格】([\s\S]*?)【\/价格】/g;

    const categoryEmojiOptions = {
        FOOD: ['🍜', '🍙', '🍪', '🍰', '🍔', '🍟', '🥟', '🍣', '🥗', '🍎', '🍌'],
        COFFEE: ['☕', '🧋', '🥤', '🧃', '🧊', '🍵', '🫖'],
        CLOTHES: ['👕', '👗', '👖', '🧥', '👟', '👠', '🧢', '🧴', '💄'],
        COMMODITY: ['🧻', '🧼', '🪥', '🧽', '🧺', '🧴', '🕯️', '🧹'],
        GIFTS: ['🎁', '💐', '🧸', '🍫', '🕯️', '📦', '💎'],
        PLAY: ['🎟️', '🎬', '🎡', '🎢', '🎮', '🎤', '🏓']
    };

    function pickCategoryEmoji(category) {
        const options = categoryEmojiOptions[category] || [];
        if (options.length === 0) return categoryMeta[category]?.defaultEmoji || '🛍️';
        return options[Math.floor(Math.random() * options.length)];
    }

    function collectRegexCaptures(text, re) {
        const results = [];
        if (!text) return results;
        re.lastIndex = 0;
        let match;
        while ((match = re.exec(text)) !== null) {
            results.push(String(match[1] ?? '').trim());
        }
        return results;
    }

    function normalizePrice(raw) {
        const cleaned = String(raw ?? '')
            .replace(/[￥¥,]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        const num = Number.parseFloat(cleaned);
        if (!Number.isFinite(num)) return null;
        return Math.max(0, Math.round(num * 100) / 100);
    }

    function parseGeneratedProducts(text) {
        const names = collectRegexCaptures(text, PRODUCT_NAME_RE);
        const descs = collectRegexCaptures(text, PRODUCT_DESC_RE);
        const prices = collectRegexCaptures(text, PRODUCT_PRICE_RE);
        const count = Math.min(names.length, descs.length, prices.length);
        const list = [];
        for (let i = 0; i < count; i++) {
            const name = names[i].trim();
            const desc = descs[i].trim();
            const price = normalizePrice(prices[i]);
            if (!name || !desc || price === null) continue;
            list.push({ name, desc, price });
        }
        return list;
    }

    const leadingEmojiRe = (() => {
        try {
            return new RegExp('^(\\p{Extended_Pictographic}(?:\\uFE0F|\\u200D\\p{Extended_Pictographic})*)', 'u');
        } catch {
            return null;
        }
    })();

    function splitEmojiAndName(rawName) {
        const value = String(rawName ?? '').trim();
        if (!value) return { emoji: null, name: '' };
        if (leadingEmojiRe) {
            const m = value.match(leadingEmojiRe);
            if (m && m[1]) {
                const rest = value.slice(m[1].length).trim().replace(/^[\s\-—–:：]+/, '').trim();
                return { emoji: m[1], name: rest || '' };
            }
        }
        return { emoji: null, name: value };
    }

    function truncateNameTo12(name) {
        const compact = String(name ?? '').replace(/\s+/g, '').trim();
        if (!compact) return '';
        return compact.length <= 12 ? compact : compact.slice(0, 12);
    }

    function fitSingleLineText(el, maxFontPx = 16, minFontPx = 11) {
        if (!el) return;
        const maxPx = Math.max(1, Number(maxFontPx) || 16);
        const minPx = Math.max(1, Number(minFontPx) || 11);
        el.style.fontSize = `${maxPx}px`;
        const available = el.clientWidth;
        if (!available) return;
        let safety = 32;
        while (safety-- > 0 && el.scrollWidth > available && Number.parseFloat(el.style.fontSize) > minPx) {
            const next = Math.max(minPx, Math.floor(Number.parseFloat(el.style.fontSize) - 1));
            el.style.fontSize = `${next}px`;
        }
    }

    function appendParsedProductsToCategory(category, parsedProducts) {
        if (!categories.includes(category)) return [];
        if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) return [];
        const created = [];
        parsedProducts.forEach((item) => {
            const rawName = String(item?.name ?? '').trim();
            const split = splitEmojiAndName(rawName);
            const name = truncateNameTo12(split.name || rawName);
            const desc = String(item?.desc ?? '').trim();
            const price = Number(item?.price);
            if (!name || !desc || !Number.isFinite(price)) return;
            const product = {
                id: nextProductId++,
                name,
                emoji: split.emoji || pickCategoryEmoji(category),
                price,
                desc,
                category
            };
            productsByCategory[category].push(product);
            productById.set(product.id, product);
            created.push(product);
        });
        return created;
    }

    function buildMallPrompt(category, count) {
        const n = Math.max(0, Math.min(30, Number(count) || 0));
        const categoryHint = {
            FOOD: '食物类，覆盖主食/甜点/零食/熟食/水果等，不局限于某一种。',
            COFFEE: '饮品类，覆盖咖啡/奶茶/茶饮/气泡水/矿泉水等。',
            CLOTHES: '穿搭美妆类，覆盖鞋/上衣/下装/外套/配饰/化妆品等。',
            COMMODITY: '日用品类，日常会用到的物品。',
            GIFTS: '礼物类，一般用于送礼的物品。',
            PLAY: '娱乐与服务类，覆盖票券/团购/体验项目等。'
        }[category] || '按分类语义生成。';

        return [
            `为分类 ${category} 生成 ${n} 个商品。`,
            '只输出内容本身，不要解释，不要编号，不要多余文字。',
            '每个商品按顺序输出三段：',
            '【商品名】...【/商品名】',
            '【商品介绍】...【/商品介绍】',
            '【价格】...【/价格】',
            '【商品名】必须以 1 个最匹配商品的 emoji 开头（该 emoji 将作为商品图标），后接空格再接名称。',
            '名称（不含 emoji 与空格）≤ 12 字。',
            '名称要具体：包含产地/品牌/口味/规格/材质/款式其一，避免只写“苹果”这种泛名。',
            categoryHint,
            '价格只写数字（可含两位小数），不要带￥/¥等符号。',
            '尽量不重复。'
        ].join('\n');
    }

    async function getMallAICompletion(prompt) {
        if (typeof getAICompletion === 'function') {
            const result = await getAICompletion(prompt, false);
            if (typeof result !== 'string') return null;
            return result.trim();
        }

        const lf = window.localforage;
        if (!lf) throw new Error('localforage 未加载，无法读取全局API设置。');
        const apiSettingsData = await lf.getItem('apiSettings');
        let apiSettings = {};
        if (apiSettingsData) {
            try {
                apiSettings = typeof apiSettingsData === 'string' ? JSON.parse(apiSettingsData) : apiSettingsData;
            } catch {
                apiSettings = {};
            }
        }
        if (!apiSettings.url || !apiSettings.key || !apiSettings.model) {
            throw new Error('请先在全局API设置中配置有效的 API URL、Key 和 Model。');
        }

        const response = await fetch(new URL('/v1/chat/completions', apiSettings.url).href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiSettings.key}`
            },
            body: JSON.stringify({
                model: apiSettings.model,
                messages: [{ role: 'user', content: String(prompt || '') }],
                temperature: parseFloat(apiSettings.temp || 0.7),
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`API 请求失败: ${response.status}`);
        }

        const result = await response.json();
        const content = result?.choices?.[0]?.message?.content;
        if (typeof content !== 'string') return null;
        return content.trim();
    }

    // Cart State
    let cart = {}; // Object to store cart items: { productId: { ...product, quantity: 1 } }
    const removedProductIds = new Set();

    // 2. Inject CSS
    const style = document.createElement('style');
    style.textContent = `
        #mall-app-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--bg-color-start, #f5f5f7);
            z-index: 3000;
            display: none;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: var(--text-color, #333);
        }
        #mall-app-overlay.visible {
            display: block;
            animation: mallFadeIn 0.3s ease;
        }
        @keyframes mallFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }

        /* Container for content that will be blurred */
        .mall-main-view {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            transition: filter 0.3s ease;
            box-sizing: border-box;
        }
        
        .mall-main-view.blurred {
            filter: blur(20px);
        }

        .mall-header {
            height: 60px;
            display: flex;
            align-items: center;
            padding: 0 16px;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(0,0,0,0.05);
            justify-content: space-between;
            z-index: 20;
            flex-shrink: 0;
        }
        .mall-title {
            font-size: 18px;
            font-weight: 600;
        }
        .mall-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            color: var(--text-color, #333);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s;
            width: 40px;
            height: 40px;
        }
        .mall-btn:hover {
            background-color: rgba(0,0,0,0.05);
        }

        /* Sidebar Styling */
        .mall-sidebar {
            position: absolute;
            top: 0;
            left: 0;
            width: fit-content;
            min-width: 200px;
            max-width: calc(100vw - 12px);
            height: 100%;
            background: rgba(255, 255, 255, 0.85); /* Slightly more opaque */
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            z-index: 100;
            border-right: 1px solid rgba(0,0,0,0.05);
            padding: 60px 0 20px 0; /* Adjusted padding */
            box-shadow: 2px 0 20px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }
        .mall-sidebar.open {
            transform: translateX(0);
        }
        .mall-sidebar-item {
            padding: 12px 16px;
            margin-bottom: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: background 0.2s;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px; /* Slightly smaller font */
            color: #555;
        }
        .mall-sidebar-item span {
            white-space: nowrap;
        }
        .mall-sidebar-item:hover {
            background: rgba(0,0,0,0.03);
        }
        .mall-sidebar-item.active {
            background: rgba(0,0,0,0.05); /* Light gray background */
            color: #333; /* Dark text */
            font-weight: 700; /* Bold */
        }
        .mall-sidebar-icon {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            fill: currentColor;
        }
        
        .mall-sidebar-separator {
            height: 1px;
            background: linear-gradient(to right, transparent, rgba(0,0,0,0.18), transparent);
            margin: 12px 14px;
            flex-shrink: 0;
        }

        /* Product Grid */
        .mall-content {
            flex: 1;
            overflow: hidden;
            display: flex;
            position: relative;
        }
        .mall-product-grid {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 20px;
            align-content: start;
        }
        .mall-product-grid.at-bottom {
            padding-bottom: 160px;
        }

        /* Card Styling */
        .mall-card {
            background: rgba(255, 255, 255, 0.6);
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            transition: transform 0.2s;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            padding: 10px;
            border: 1px solid rgba(255,255,255,0.5);
        }
        .mall-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        .mall-card-image-box {
            width: 100%;
            aspect-ratio: 1/1;
            background: rgba(0,0,0,0.03);
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 64px;
            margin-bottom: 10px;
            border: 1px solid rgba(0,0,0,0.02);
        }
        .mall-card-details {
            display: flex;
            flex-direction: column;
            padding: 0 4px;
        }
        .mall-card-name {
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 8px;
            text-align: left;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .mall-card-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 4px;
        }
        .mall-add-btn {
            background: transparent;
            border: none;
            padding: 0;
            cursor: pointer;
            color: #333;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.1s;
        }
        .mall-add-btn.in-cart {
            color: #ff3b30;
        }
        .mall-add-btn:active {
            transform: scale(0.9);
        }
        .mall-add-icon {
            width: 28px;
            height: 28px;
            fill: none;
            stroke: currentColor;
            stroke-width: 1.5;
        }
        .mall-price {
            font-weight: bold;
            color: #333;
            font-size: 16px;
        }

        .mall-card-desc {
            margin-top: -2px;
            margin-bottom: 8px;
            font-size: 12px;
            line-height: 1.35;
            color: #8c8c8c;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .mall-product-preview-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(255,255,255,0.001);
            backdrop-filter: blur(22px) saturate(170%);
            -webkit-backdrop-filter: blur(22px) saturate(170%);
            z-index: 260;
        }
        .mall-product-preview-card {
            position: fixed;
            transform-origin: center center;
            z-index: 261;
            will-change: transform;
        }
        .mall-product-preview-card.mall-card:hover {
            transform: none;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        .mall-product-preview-card .mall-card-image-box {
            aspect-ratio: 4 / 3;
            margin-bottom: 8px;
        }
        .mall-product-preview-card .mall-card-emoji {
            font-size: 56px;
        }
        .mall-product-preview-card .mall-card-desc {
            display: block;
            -webkit-line-clamp: unset;
            -webkit-box-orient: unset;
            overflow: visible;
            white-space: normal;
            margin-bottom: 10px;
        }

        /* Bottom Floating Bar */
        .mall-bottom-bar {
            position: fixed;
            bottom: 20px;
            left: 0;
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 50;
            pointer-events: none; /* Allow clicks through empty areas */
            background: transparent;
        }

        .mall-cart-capsule {
            pointer-events: auto;
            background: rgba(255, 255, 255, 0.16);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 50px;
            padding: 8px 20px 8px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            justify-content: space-between;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            border: 1px solid rgba(255,255,255,0.45);
            cursor: pointer;
            transition: transform 0.1s;
            flex: 1;
            margin-right: 20px;
            height: 56px;
            box-sizing: border-box;
        }
        .mall-cart-capsule:active {
            transform: scale(0.98);
        }

        .mall-cart-icon-btn {
            background: none;
            border: none;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            width: 28px;
            height: 28px;
        }
        .mall-cart-icon-btn svg {
            width: 24px;
            height: 24px;
            display: block;
        }
        .mall-cart-icon-btn,
        .mall-checkout-btn {
            color: var(--text-color, #333);
        }
        .mall-cart-icon-btn.mall-bump {
            animation: mallBump 240ms cubic-bezier(0.2, 0.9, 0.2, 1);
        }
        @keyframes mallBump {
            0% { transform: scale(1); }
            35% { transform: scale(1.12); }
            70% { transform: scale(0.97); }
            100% { transform: scale(1); }
        }
        .mall-cart-badge {
            position: absolute;
            top: -7px;
            right: -7px;
            min-width: 18px;
            height: 18px;
            padding: 0 5px;
            border-radius: 999px;
            background: #ff3b30;
            color: #fff;
            font-size: 11px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            opacity: 0;
            transform: scale(0.7);
            transition: opacity 140ms ease, transform 180ms cubic-bezier(0.2, 0.9, 0.2, 1);
            pointer-events: none;
            box-shadow: 0 6px 16px rgba(255, 59, 48, 0.35);
        }
        .mall-cart-badge.visible {
            opacity: 1;
            transform: scale(1);
        }

        .mall-cart-info {
            display: flex;
            margin-left: auto;
            flex-direction: column;
            align-items: flex-end;
            gap: 2px;
        }
        .mall-cart-count {
            font-size: 12px;
            color: #888;
        }
        .mall-cart-total {
            font-size: 18px;
            font-weight: 700;
            color: #333;
        }

        .mall-checkout-btn {
            pointer-events: auto;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.22);
            border: 1px solid rgba(255,255,255,0.45);
            backdrop-filter: blur(18px) saturate(180%);
            -webkit-backdrop-filter: blur(18px) saturate(180%);
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15); /* Shadow for floating button */
            transition: transform 0.1s;
            overflow: hidden; /* For round shape if svg is square */
        }
        .mall-checkout-btn svg {
            width: 24px;
            height: 24px;
            display: block;
        }
        .mall-checkout-btn:active {
            transform: scale(0.95);
        }

        /* Cart Popup */
        .mall-cart-popup {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            max-height: 60%;
            background: rgba(255, 255, 255, 0.72);
            backdrop-filter: blur(26px) saturate(180%);
            -webkit-backdrop-filter: blur(26px) saturate(180%);
            border-radius: 24px 24px 0 0;
            box-shadow: 0 14px 60px rgba(0,0,0,0.18);
            border: 1px solid rgba(255,255,255,0.55);
            border-bottom: none;
            z-index: 40;
            transform: translateY(120%);
            opacity: 0;
            pointer-events: none;
            transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.2s ease;
            display: flex;
            flex-direction: column;
            padding: 18px 0 84px 0;
        }
        .mall-cart-popup.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
        }
        .mall-cart-header {
            padding: 0 20px 16px 20px;
            border-bottom: 1px solid #eee;
            font-weight: 600;
            font-size: 16px;
            display: flex;
            justify-content: space-between;
        }
        .mall-cart-list {
            flex: 1;
            overflow-y: auto;
            padding: 10px 20px;
            font-size: 13px;
        }
        .mall-cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #f5f5f5;
        }
        .mall-cart-item:last-child {
            border-bottom: none;
        }
        .mall-cart-item-name {
            font-weight: 500;
            font-size: 13px;
        }
        .mall-cart-item-right {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .mall-cart-remove-btn {
            border: none;
            background: transparent;
            padding: 0;
            width: 16px;
            height: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #ff3b30;
        }
        .mall-cart-remove-btn svg {
            width: 14px;
            height: 14px;
            display: block;
        }

        /* Dark mode adaptation */
        @media (prefers-color-scheme: dark) {
            #mall-app-overlay {
                background-color: #1c1c1e;
                color: #fff;
            }
            .mall-header {
                background: rgba(28, 28, 30, 0.7);
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            .mall-btn {
                color: #fff;
            }
            .mall-sidebar {
                background: rgba(28, 28, 30, 0.85);
                border-right: 1px solid rgba(255,255,255,0.1);
            }
            .mall-sidebar-item {
                color: #aaa;
            }
            .mall-sidebar-item:hover {
                background: rgba(255,255,255,0.1);
            }
            .mall-sidebar-item.active {
                background: rgba(255,255,255,0.15);
                color: #fff;
            }
            .mall-sidebar-separator {
                background: linear-gradient(to right, transparent, rgba(255,255,255,0.22), transparent);
            }
            .mall-card {
                background: rgba(44, 44, 46, 0.6);
                border: 1px solid rgba(255,255,255,0.05);
            }
            .mall-card-desc {
                color: rgba(255,255,255,0.62);
            }
            .mall-card-image-box {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.05);
            }
            .mall-add-btn {
                color: #fff;
            }
            .mall-price {
                color: #fff;
            }
            .mall-cart-capsule {
                background: rgba(44, 44, 46, 0.16);
                color: #fff;
                border: 1px solid rgba(255,255,255,0.10);
            }
            .mall-cart-total {
                color: #fff;
            }
            .mall-cart-popup {
                background: rgba(28, 28, 30, 0.72);
                color: #fff;
                border: 1px solid rgba(255,255,255,0.10);
                border-bottom: none;
            }
            .mall-cart-icon-btn,
            .mall-checkout-btn {
                color: #fff;
            }
            .mall-checkout-btn {
                background: rgba(28, 28, 30, 0.22);
                border: 1px solid rgba(255,255,255,0.14);
            }
            .mall-cart-header {
                border-bottom: 1px solid #333;
            }
            .mall-cart-item {
                border-bottom: 1px solid #333;
            }
        }

        .mall-modal-backdrop {
            position: fixed;
            inset: 0;
            z-index: 5200;
            background: rgba(0,0,0,0.10);
            backdrop-filter: blur(22px) saturate(170%);
            -webkit-backdrop-filter: blur(22px) saturate(170%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 18px;
            box-sizing: border-box;
        }
        .mall-modal {
            width: min(520px, calc(100vw - 36px));
            max-height: calc(100vh - 96px);
            overflow: auto;
            background: rgba(255, 255, 255, 0.86);
            border: 1px solid rgba(255,255,255,0.55);
            border-radius: 18px;
            box-shadow: 0 20px 70px rgba(0,0,0,0.18);
            backdrop-filter: blur(18px) saturate(160%);
            -webkit-backdrop-filter: blur(18px) saturate(160%);
        }
        .mall-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 16px 10px 16px;
            border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .mall-modal-title {
            font-weight: 700;
            font-size: 14px;
            color: #333;
        }
        .mall-modal-close {
            width: 36px;
            height: 36px;
            border-radius: 999px;
            border: none;
            background: rgba(0,0,0,0.04);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
        }
        .mall-modal-close:hover {
            background: rgba(0,0,0,0.06);
        }
        .mall-modal-body {
            padding: 12px 16px 6px 16px;
        }
        .mall-gen-row {
            padding: 12px 12px;
            background: rgba(255,255,255,0.55);
            border: 1px solid rgba(0,0,0,0.05);
            border-radius: 14px;
            margin-bottom: 10px;
        }
        .mall-gen-row-top {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 8px;
        }
        .mall-gen-label {
            font-size: 13px;
            font-weight: 700;
            color: #333;
        }
        .mall-gen-value {
            font-size: 12px;
            color: #666;
            font-variant-numeric: tabular-nums;
        }
        .mall-gen-right {
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .mall-gen-check {
            width: 18px;
            height: 18px;
            color: #34C759;
            opacity: 0;
            transform: scale(0.86);
            transition: opacity 160ms ease, transform 180ms cubic-bezier(0.2, 0.9, 0.2, 1);
        }
        .mall-gen-row.done .mall-gen-check {
            opacity: 1;
            transform: scale(1);
        }
        .mall-gen-range {
            width: 100%;
            height: 12px;
            border-radius: 999px;
            -webkit-appearance: none;
            appearance: none;
            background: rgba(0,0,0,0.08);
            outline: none;
            cursor: pointer;
        }
        .mall-gen-range:disabled {
            cursor: default;
            opacity: 0.95;
        }
        .mall-gen-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 999px;
            background: rgba(255,255,255,0.96);
            border: 1px solid rgba(0,0,0,0.10);
            box-shadow: 0 8px 18px rgba(0,0,0,0.12);
        }
        .mall-gen-range:disabled::-webkit-slider-thumb {
            box-shadow: none;
            background: rgba(255,255,255,0.70);
        }
        .mall-gen-range::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 999px;
            background: rgba(255,255,255,0.96);
            border: 1px solid rgba(0,0,0,0.10);
            box-shadow: 0 8px 18px rgba(0,0,0,0.12);
        }
        .mall-gen-range::-moz-range-track {
            height: 12px;
            border-radius: 999px;
            background: transparent;
        }
        .mall-modal-footer {
            padding: 12px 16px 16px 16px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 10px;
        }
        .mall-modal-btn {
            border: none;
            cursor: pointer;
            padding: 10px 14px;
            border-radius: 999px;
            font-weight: 700;
            font-size: 13px;
            transition: transform 0.1s, background-color 0.2s;
        }
        .mall-modal-btn:active {
            transform: scale(0.98);
        }
        .mall-modal-btn.primary {
            background: rgba(0,0,0,0.82);
            color: #fff;
        }
        .mall-modal-btn.primary:hover {
            background: rgba(0,0,0,0.88);
        }
        .mall-modal-btn.secondary {
            background: rgba(0,0,0,0.06);
            color: #333;
        }
        .mall-modal-btn.secondary:hover {
            background: rgba(0,0,0,0.08);
        }
        @media (prefers-color-scheme: dark) {
            .mall-modal {
                background: rgba(28, 28, 30, 0.86);
                border: 1px solid rgba(255,255,255,0.10);
            }
            .mall-modal-header {
                border-bottom: 1px solid rgba(255,255,255,0.10);
            }
            .mall-modal-title {
                color: rgba(255,255,255,0.92);
            }
            .mall-modal-close {
                background: rgba(255,255,255,0.08);
                color: rgba(255,255,255,0.92);
            }
            .mall-modal-close:hover {
                background: rgba(255,255,255,0.10);
            }
            .mall-gen-row {
                background: rgba(44, 44, 46, 0.6);
                border: 1px solid rgba(255,255,255,0.10);
            }
            .mall-gen-label {
                color: rgba(255,255,255,0.92);
            }
            .mall-gen-value {
                color: rgba(255,255,255,0.62);
            }
            .mall-gen-range {
                background: rgba(255,255,255,0.14);
            }
            .mall-gen-range::-webkit-slider-thumb {
                background: rgba(255,255,255,0.88);
                border: 1px solid rgba(255,255,255,0.16);
                box-shadow: 0 10px 24px rgba(0,0,0,0.24);
            }
            .mall-gen-range:disabled::-webkit-slider-thumb {
                background: rgba(255,255,255,0.60);
                box-shadow: none;
            }
            .mall-gen-range::-moz-range-thumb {
                background: rgba(255,255,255,0.88);
                border: 1px solid rgba(255,255,255,0.16);
                box-shadow: 0 10px 24px rgba(0,0,0,0.24);
            }
            .mall-modal-btn.secondary {
                background: rgba(255,255,255,0.10);
                color: rgba(255,255,255,0.92);
            }
            .mall-modal-btn.secondary:hover {
                background: rgba(255,255,255,0.14);
            }
        }

        .mall-insert-backdrop {
            position: fixed;
            inset: 0;
            z-index: 5400;
            background: rgba(255,255,255,0.001);
            backdrop-filter: blur(22px) saturate(170%);
            -webkit-backdrop-filter: blur(22px) saturate(170%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 18px;
            box-sizing: border-box;
        }
        .mall-insert-panel {
            width: min(520px, calc(100vw - 36px));
            max-height: calc(100vh - 96px);
            overflow: auto;
        }
        .mall-insert-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 12px 10px 10px 10px;
            color: var(--text-color, #333);
        }
        .mall-insert-title {
            font-weight: 800;
            font-size: 14px;
        }
        .mall-insert-close {
            width: 36px;
            height: 36px;
            border-radius: 999px;
            border: none;
            background: rgba(0,0,0,0.04);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: inherit;
        }
        .mall-insert-close:hover {
            background: rgba(0,0,0,0.06);
        }
        .mall-insert-card.mall-card {
            padding: 12px;
            border-radius: 18px;
            box-shadow: 0 14px 46px rgba(0,0,0,0.14);
        }
        .mall-insert-card.mall-card:hover {
            transform: none;
            box-shadow: 0 14px 46px rgba(0,0,0,0.14);
        }
        .mall-insert-emoji-box {
            cursor: text;
        }
        .mall-insert-emoji {
            font-size: 56px;
            line-height: 1;
            outline: none;
            user-select: text;
        }
        .mall-insert-fields {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .mall-insert-input {
            width: 100%;
            box-sizing: border-box;
            border-radius: 14px;
            border: 1px solid rgba(0,0,0,0.08);
            background: rgba(255,255,255,0.70);
            padding: 10px 12px;
            font-size: 13px;
            outline: none;
            color: inherit;
        }
        .mall-insert-input:focus {
            border-color: rgba(118, 213, 235, 0.75);
            box-shadow: 0 0 0 3px rgba(118, 213, 235, 0.22);
        }
        .mall-insert-desc {
            min-height: 82px;
            resize: vertical;
            line-height: 1.45;
        }
        .mall-insert-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        .mall-insert-save {
            border: none;
            cursor: pointer;
            padding: 12px 14px;
            border-radius: 999px;
            font-weight: 800;
            font-size: 13px;
            background: rgba(0,0,0,0.82);
            color: #fff;
            transition: transform 0.1s, background-color 0.2s;
        }
        .mall-insert-save:active {
            transform: scale(0.98);
        }
        .mall-insert-save:hover {
            background: rgba(0,0,0,0.88);
        }

        @media (prefers-color-scheme: dark) {
            .mall-insert-close {
                background: rgba(255,255,255,0.08);
                color: rgba(255,255,255,0.92);
            }
            .mall-insert-close:hover {
                background: rgba(255,255,255,0.10);
            }
            .mall-insert-input {
                border: 1px solid rgba(255,255,255,0.10);
                background: rgba(44, 44, 46, 0.65);
                color: rgba(255,255,255,0.92);
            }
            .mall-insert-input:focus {
                border-color: rgba(118, 213, 235, 0.55);
                box-shadow: 0 0 0 3px rgba(118, 213, 235, 0.18);
            }
        }
    `;
    document.head.appendChild(style);

    // Icons
    const iconFood = `<svg class="mall-sidebar-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7528"><path d="M778.666667 138.666667a32 32 0 0 1 31.701333 27.648L810.666667 170.666667v682.666666a32 32 0 0 1-63.701334 4.352L746.666667 853.333333v-213.333333h-96a32 32 0 0 1-31.701334-27.648l-0.298666-4.352V298.666667a160 160 0 0 1 160-160z m-256 0a32 32 0 0 1 31.701333 27.648L554.666667 170.666667v170.666666c0 83.328-59.733333 152.661333-138.666667 167.68V853.333333a32 32 0 0 1-63.701333 4.352L352 853.333333v-344.32a170.752 170.752 0 0 1-138.453333-158.805333L213.333333 341.333333V170.666667a32 32 0 0 1 63.701334-4.352L277.333333 170.666667v170.666666c0 47.786667 31.402667 88.192 74.666667 101.802667V170.666667a32 32 0 0 1 63.701333-4.352L416 170.666667v272.426666a106.752 106.752 0 0 0 74.368-93.866666L490.666667 341.333333V170.666667a32 32 0 0 1 32-32zM746.666667 576V208.128a96.085333 96.085333 0 0 0-63.744 83.2L682.666667 298.666667v277.333333h64V208.128 576z" fill="currentColor"></path></svg>`;
    const iconCoffee = `<svg class="mall-sidebar-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2704"><path d="M822.4 913.536c-66.496-15.68-152.064-25.088-244.032-27.008v-205.696c97.92-5.568 188.992-42.112 258.944-104.256 74.112-65.792 115.84-152.704 118.08-245.44a20.864 20.864 0 0 0 0-3.328l0.064-4.736a21.12 21.12 0 0 0-1.536-7.936L917.056 20.928c-1.536-11.904-12.8-20.928-26.24-20.928H212.224c-13.504 0-24.832 8.96-26.24 20.928l-38.4 305.344c-0.384 3.2 0 6.528 1.024 9.6 3.584 90.944 45.12 176 117.952 240.64 69.952 62.208 161.088 98.688 258.88 104.32v205.376c-99.392 0.96-192.64 10.56-263.872 27.328-88.32 20.736-133.12 49.92-133.12 86.976 0 12.992 11.84 23.488 26.496 23.488h774.144c14.592 0 26.432-10.496 26.432-23.488 0-37.12-44.8-66.304-133.12-87.04zM211.392 323.52l4.096-32.576a21.76 21.76 0 0 0 1.216-0.96c73.408-65.28 192.896-65.28 266.304 0 0.96 0.832 1.984 1.536 3.072 2.24 45.376 36.16 102.656 54.272 160 54.272 61.376 0 122.752-20.736 169.472-62.272a21.12 21.12 0 0 0 0-32.256 28.096 28.096 0 0 0-36.352 0c-73.408 65.28-192.832 65.28-266.304 0a25.28 25.28 0 0 0-3.008-2.24c-80.192-63.872-197.568-71.36-286.464-22.4L244.928 55.616h613.056l34.368 274.304c-3.84 163.968-155.072 296.32-340.48 296.32-187.776 0-340.544-135.808-340.544-302.656z m-16.64 654.976c14.848-6.08 35.136-12.8 62.592-19.2 75.712-17.792 176.832-27.52 284.736-27.52s208.96 9.664 284.672 27.52c27.52 6.4 47.744 13.056 62.592 19.2H194.752z" fill="currentColor"></path></svg>`;
    const iconClothes = `<svg class="mall-sidebar-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13249"><path d="M752.8 143.2c3.2 0 6.3 1.3 8.5 3.5L955.6 341c5.5 5.5 5.5 14.3 0 19.8L864 452.5l-96-96V895H448v1H256V357.5l-96 96-91.6-91.6c-5.5-5.5-5.5-14.3 0-19.8L263 147.5c2.3-2.3 5.3-3.5 8.5-3.5H351c33.4 26.9 92.6 64 164.6 64 72.1 0 131.4-37.2 164.8-64.2l72.3-0.6h0.1z m0-64h-0.6l-83.8 0.7c-7.6 0.1-15 2.8-20.7 7.8-19.6 17-71.3 56.3-132.1 56.3-60.6 0-112.3-39.1-132-56.2-5.8-5.1-13.3-7.8-21-7.8h-91c-20.2 0-39.5 8-53.7 22.3L23.1 296.8c-30.5 30.5-30.5 79.8 0 110.3L128 512c8.8 8.8 20.4 13.3 32 13.3s23.2-4.4 32-13.3v416c0 17.7 14.3 32 32 32h288v-1h288c17.7 0 32-14.3 32-32V511c8.8 8.8 20.4 13.3 32 13.3s23.2-4.4 32-13.3l104.8-104.8c30.5-30.5 30.5-79.8 0-110.3L806.5 101.5c-14.2-14.2-33.6-22.3-53.7-22.3z" fill="currentColor"></path></svg>`;
    const iconCommodity = `<svg class="mall-sidebar-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14353"><path d="M696.7296 912.725333c-103.6288 0-207.394133 1.911467-311.022933-0.682666-72.0896-1.911467-142.1312-18.978133-206.4384-57.617067-9.966933-6.007467-19.6608-13.243733-28.2624-21.435733-18.0224-16.930133-29.9008-37.2736-29.764267-65.536 0.273067-145.544533-0.136533-209.169067-0.273067-354.7136 0-52.0192 1.774933-104.174933-0.4096-156.0576-2.048-48.878933 19.797333-79.735467 54.8864-101.717334 50.517333-31.675733 105.6768-48.196267 163.157334-54.203733 35.6352-3.822933 71.543467-7.645867 107.178666-6.144C522.922667 97.757867 599.381333 109.226667 669.149867 150.596267c39.594667 23.483733 66.7648 55.7056 61.166933 110.592-1.501867 14.199467-0.273067 28.808533-0.273067 43.144533 0 44.782933 0 44.782933 40.004267 44.782933 79.189333-0.136533-30.3104 0 48.878933-0.4096 30.72-0.136533 54.8864 13.380267 68.266667 43.8272 6.280533 14.336 9.147733 31.812267 9.284267 47.786667 0.682667 154.4192 0.546133 226.9184 0.273066 381.3376 0 45.738667-19.933867 78.506667-54.4768 88.610133-9.8304 2.8672-20.616533 2.8672-30.993066 2.8672-101.1712 0.136533-13.5168 0.136533-114.688 0.136534 0.136533 0 0.136533-0.273067 0.136533-0.546134zM168.891733 333.277867c-0.4096 3.140267-1.092267 5.870933-1.092266 8.6016 0 162.747733-0.273067 243.575467 0.546133 406.186666 0 11.332267 5.461333 26.487467 13.1072 33.314134 18.8416 16.657067 39.185067 32.631467 61.0304 43.4176 53.930667 26.350933 111.4112 37.000533 170.120533 37.137066 196.334933 0.546133 203.844267 0.136533 400.315734 0.136534 26.897067 0 35.771733-9.8304 35.771733-39.7312V442.641067c0-34.133333-7.918933-42.734933-39.048533-42.734934-195.925333 0-202.888533 0.4096-398.813867-0.136533-58.026667-0.136533-114.961067-10.103467-169.710933-31.9488-24.1664-9.557333-47.240533-22.391467-72.226134-34.542933z m371.370667 12.970666v3.003734c42.871467 0 85.742933-0.273067 128.6144 0.136533 11.605333 0.136533 15.837867-4.5056 15.701333-17.476267-0.546133-29.354667 0.546133-58.709333-0.682666-87.927466-0.4096-8.874667-4.5056-19.797333-10.24-25.941334-27.716267-30.037333-63.8976-42.871467-100.078934-52.4288-92.706133-24.439467-186.231467-25.531733-279.620266-3.959466-41.096533 9.557333-80.6912 23.893333-114.414934 53.6576-10.6496 9.4208-13.653333 20.343467-9.4208 35.089066 7.7824 27.0336 27.4432 40.004267 47.9232 51.473067 50.107733 28.125867 104.448 40.277333 159.607467 43.554133 53.930667 3.413333 108.407467 0.8192 162.6112 0.8192z" fill="currentColor"></path></svg>`;
    const iconGifts = `<svg class="mall-sidebar-icon" viewBox="0 0 1137 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="29387"><path d="M1135.142452 361.58628c0-57.196057-46.96342-103.728338-104.689952-103.728338l-30.177676 0c17.059174-26.554471 26.182729-57.38756 26.182729-89.711715 0.003072-44.940856-17.691033-87.18735-49.821636-118.9585-32.078374-31.719945-74.707875-49.187728-120.035835-49.187728-43.922918 0-84.252328 19.345951-119.868909 57.499185-23.783302 25.479184-45.446753 59.392715-64.514154 100.969459-17.11345-5.294509-35.72411-8.054412-54.706511-8.054412-19.031558 0-37.644265 2.754783-54.716752 8.042123-19.069449-41.573671-40.729827-75.481058-64.511081-100.95717-35.615557-38.153234-75.943943-57.499185-119.864813-57.499185-77.72892 0-145.290745 52.34088-164.2967 127.28327-1.192033 4.699517-0.407585 9.682704 2.171056 13.788253 2.578641 4.105549 6.726177 6.977077 11.476898 7.944836 12.89218 2.625749 26.425436 6.186485 40.225978 10.582873 4.684155 1.493113 9.778968 0.972879 14.065779-1.435764 4.286811-2.408643 7.38159-6.48859 8.543924-11.265937 9.871136-40.558805 46.122648-68.885964 88.156133-68.885964 55.479694 0 97.333964 76.670018 119.09163 127.878262-3.066104 6.287869-5.029271 13.069347-5.858779 20.262505-0.098312 0.412705-0.183311 0.830531-0.252948 1.251429-0.247828 1.030227-0.650293 2.929901-0.650293 5.285292 0 8.050316 1.776784 15.914249 5.246377 23.433066-25.727012-0.641076-70.702687-10.009387-142.334217-49.166222C284.052714 168.690016 218.537007 149.286716 159.276399 149.286716c-96.788128 0-144.740812 51.962993-150.014839 58.040925-0.124938 0.142348-0.247828 0.287767-0.36867 0.434211-6.680093 8.138387-9.757462 18.377169-8.66579 28.832031 1.093721 10.46408 6.2254 19.853896 14.460051 26.446942 6.997559 5.595589 15.792383 8.677055 24.765398 8.677055 11.874242 0 23.001927-5.234088 30.541226-14.360715 1.476728-1.69793 27.368617-30.395806 87.911377-30.395806 45.805182 0 98.956111 16.367918 157.964795 48.641892 71.328402 39.079005 133.05705 58.892962 183.469581 58.892962 6.2254 0 12.604413-0.403489 19.568177-1.251429 2.877673 1.943709 6.318592 3.038454 9.925412 3.038454l49.222547 0 0 136.466222L178.781083 472.749461l0-111.231794c0-13.914215 11.567017-25.234428 25.785385-25.234428l144.292264 0c0.00512 0 0.011265-0.001024 0.017409 0 9.792281 0 17.730972-7.938691 17.730972-17.730972 0-7.363156-4.487531-13.677652-10.876785-16.357677-16.577855-7.68267-30.463396-14.64029-43.685331-21.891821-14.312583-7.804536-28.696852-14.717096-43.974122-21.130928-2.173104-0.912458-4.505965-1.382512-6.863404-1.382512L204.566468 257.789329c-57.72858 0-104.694048 46.532281-104.694048 103.728338l0 171.927142c0 9.792281 7.938691 17.730972 17.730972 17.730972l47.506184 0 0 369.091784c0 57.198105 46.966492 103.732434 104.695072 103.732434l695.545875 0c57.729604 0 104.695072-46.533305 104.695072-103.732434L1070.045595 551.387766l47.714073 0c4.708733 0 9.223915-1.873048 12.550137-5.205414 3.326221-3.332366 5.190052-7.852668 5.180836-12.561401L1135.142452 361.58628zM991.000729 551.241323l0 369.094857c0 13.915239-11.53527 25.234428-25.715747 25.234428L656.963304 945.570607 656.963304 551.241323 991.000729 551.241323zM1056.309571 361.58628l0 111.231794L657.03499 472.818074l0-136.465198 373.488173 0C1044.74153 336.352877 1056.309571 347.67309 1056.309571 361.58628zM652.285293 232.670622c-8.512177 2.07172-20.320878 3.739951-34.773761 3.739951-5.044633 0-10.108723-0.226322-15.126729-0.674871-1.922204-2.101418-4.027718-3.939647-6.311423-5.506494 6.261243-0.809026 13.444161-1.321067 21.438152-1.321067C631.962367 228.909166 643.773115 230.586614 652.285293 232.670622zM856.257015 78.012591c50.15139 0 90.953927 40.247484 90.953927 89.717859 0 49.468327-40.802537 89.713763-90.953927 89.713763L738.192539 257.444213c3.771698-7.893631 5.729744-16.221474 5.729744-24.753109 0-9.199337-2.292922-18.360783-6.695454-26.944647C759.002929 154.539238 800.831597 78.012591 856.257015 78.012591zM578.125302 551.241323l0 394.330309L269.804648 945.571631c-14.179453 0-25.715747-11.320213-25.715747-25.234428L244.088901 551.241323 578.125302 551.241323z" fill="currentColor"></path></svg>`;
    const iconPlay = `<svg class="mall-sidebar-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="35873"><path d="M206.528 190.528a256 256 0 0 1 436.992 177.312v3.2l204.416 270.944a135.904 135.904 0 0 1-184.704 193.6l-5.504-3.84-270.656-204.192h1.152A256 256 0 0 1 206.528 190.528z m428.032 248.384l-0.64 2.368a254.848 254.848 0 0 1-65.344 111.296 254.848 254.848 0 0 1-111.296 65.344l-2.368 0.64 231.456 174.656a87.904 87.904 0 0 0 126.208-117.984l-3.168-4.608-174.848-231.712z m-43.36 136.288a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 0 1-45.248 45.248l-45.248-45.248a32 32 0 0 1 0-45.248z m-20.16-301.76c-17.92 48.672-58.816 109.184-115.616 165.984-56.832 56.864-117.376 97.76-165.952 115.552a208 208 0 0 0 281.568-281.504z m-330.56-48.96a208 208 0 0 0 15.616 308.288c39.136-8.256 110.272-49.536 176.704-115.968s107.712-137.568 115.968-176.736a208 208 0 0 0-308.288-15.616z" fill="currentColor"></path></svg>`;
    const iconSpeakeasy = `<svg class="mall-sidebar-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3179"><path d="M785.213 568.668c-24.568 8.743-105.373 31.863-272.906 31.863-171.184 0-251.825-24.14-274.44-32.416l-29.226 310.403c-0.557 3.145 0 6.303 0 6.719 0 24.855 49.954 46.855 126.629 60.321l0.004 0.001h0.001c49.744 8.737 110.731 13.884 176.635 13.884 164.917 0 299.089-32.213 303.174-72.322 0.544-2.428 0.682-4.993 0.313-7.725l-30.184-310.728zM720.698 277.999c10.537-83.084 13.6-196.416-44.535-212.012-66.652-17.881-99.84 104.062-114.897 191.428-16.158-0.74-32.575-1.164-49.266-1.164-8.378 0-16.683 0.115-24.933 0.306-15.125-87.303-48.313-208.393-114.748-190.57-56.979 15.285-55.17 124.45-45.155 207.01-130.356 25.17-219.522 76.12-219.522 134.889 0 83.742 181.038 151.634 404.358 151.634s404.358-67.891 404.358-151.634c0-55.108-78.41-103.34-195.66-129.887zM512 458.43c-130.271 0-235.875-30.172-235.875-67.393 0-17.633 23.721-33.679 62.518-45.69 2.672 13.692 4.573 21.888 4.573 21.888l57.503-9.649c-9.016-54.03-22.508-154.168-0.286-162.44 24.719-9.195 44.508 96.903 53.233 153.556l44.494-7.466s-0.506-6.495-1.678-17.443A827.34 827.34 0 0 1 512 323.64c13.611 0 26.932 0.347 39.911 0.98-1.111 10.456-1.59 16.616-1.59 16.616l44.494 7.466c8.726-56.653 28.515-162.75 53.234-153.555 22.222 8.27 8.73 108.409-0.286 162.44l57.503 9.648s1.154-4.985 2.92-13.615c25.061 10.705 39.691 23.57 39.691 37.416 0.001 37.223-105.607 67.395-235.877 67.395z" fill="currentColor"></path></svg>`;
    const iconLogistics = `<svg class="mall-sidebar-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5343"><path d="M906.24 110.592H458.752c-52.736 0-95.744 43.008-95.744 95.744v45.568h-97.28c-34.816 0-67.584 15.36-90.112 42.496l-131.072 158.72c-17.408 20.992-26.624 47.104-26.624 74.24v281.088c0 54.784 44.544 99.84 99.84 99.84h67.072c2.048 0 3.584-1.024 5.12-1.024 14.336 46.592 56.832 80.384 108.032 80.384 50.688 0 93.184-33.792 107.52-79.36h225.28c0.512 0 1.024-0.512 2.048-0.512 14.336 46.08 56.832 79.872 108.032 79.872 50.688 0 93.184-33.28 107.52-79.36h53.248c54.784 0 99.84-44.544 99.84-99.84V205.824c0-52.736-42.496-95.232-95.232-95.232zM431.616 205.824c0-14.848 12.288-27.136 27.136-27.136H906.24c14.848 0 27.136 12.288 27.136 27.136V549.888H458.752c-14.848 0-27.136-12.288-27.136-27.136V205.824zM297.984 918.528c-25.088 0-45.056-20.48-45.056-45.056 0-25.088 20.48-45.056 45.056-45.056s45.056 20.48 45.056 45.056c0.512 24.576-19.968 45.056-45.056 45.056z m442.88 0c-25.088 0-45.056-20.48-45.056-45.056 0-25.088 20.48-45.056 45.056-45.056 25.088 0 45.056 20.48 45.056 45.056 0 24.576-19.968 45.056-45.056 45.056z m161.28-79.36h-53.248c-14.336-46.08-56.832-79.36-107.52-79.36s-93.184 33.792-108.032 79.872c-0.512 0-1.024-0.512-2.048-0.512H406.528h-0.512c-14.336-46.08-56.832-79.36-107.52-79.36-51.2 0-93.696 33.792-108.032 80.384-2.048-0.512-3.584-1.024-5.12-1.024H117.248c-17.408 0-31.232-14.336-31.232-31.232v-281.088c0-11.264 4.096-22.016 11.264-30.72l131.072-158.72c9.216-11.264 23.04-17.408 37.376-17.408H363.52v202.752c0 52.736 43.008 95.744 95.744 95.744h474.624v189.44c-0.512 17.408-14.848 31.232-31.744 31.232z m-634.88-394.752c14.848 11.776 17.408 32.768 6.144 48.128l-54.784 71.168c-6.656 8.704-16.896 13.312-27.136 13.312-7.168 0-14.848-2.56-20.992-7.168-14.848-11.776-17.408-32.768-6.144-48.128L219.136 450.56c11.776-14.848 33.28-17.408 48.128-6.144z" fill="currentColor"></path></svg>`;
    const iconBackpack = `<svg class="mall-sidebar-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16818"><path d="M954.06048 575.776v255.136a125.76 125.76 0 0 1-135.872 127.584H205.86848a125.824 125.824 0 0 1-135.872-127.584v-255.136A97.056 97.056 0 0 1 1.74048 512V268.448a61.568 61.568 0 0 1 68.256-75.424h204.128a125.856 125.856 0 0 1 135.872-127.584h204.128a125.856 125.856 0 0 1 135.872 127.584h204.128a61.536 61.536 0 0 1 68.224 75.392V512a97.216 97.216 0 0 1-68.288 63.776zM137.61248 830.944a82.24 82.24 0 0 0 68.256 63.776h612.352a82.272 82.272 0 0 0 68.256-63.776v-255.136h-136.512v63.776c0 24.352-3.2 34.752-33.824 34.752s-33.824-10.4-33.824-34.752v-63.776H341.70848v63.776c0 24.352-3.2 34.752-33.824 34.752s-33.824-10.4-33.824-34.752v-63.776H137.58048l0.032 255.136zM614.09248 129.28h-204.128a66.496 66.496 0 0 0-68.256 63.776h340.608A57.408 57.408 0 0 0 614.09248 129.28z m339.968 127.584H69.96448V512h204.128v-63.776c0-24.352 3.2-17.408 33.824-17.408s33.824-6.944 33.824 17.408V512h340.608v-63.776c0-24.352 3.2-17.408 33.824-17.408s33.824-6.944 33.824 17.408V512h204.128V256.864zM409.96448 767.136h204.128c30.624 0 46.56 1.92 68.256 0 25.504-2.24-37.632 63.776-68.256 63.776h-204.128c-30.624 0-93.76-65.44-68.256-63.776 29.344 1.856 37.632 0 68.256 0z" fill="currentColor"></path></svg>`;
    const iconWallet = `<svg class="mall-sidebar-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5787"><path d="M894.72 963.584H130.304c-49.152 0-88.832-39.936-88.832-88.832v-550.4c0-49.152 39.936-88.832 88.832-88.832h764.416c49.152 0 88.832 39.936 88.832 88.832v550.4c0.256 48.896-39.68 88.832-88.832 88.832zM130.304 296.704c-15.104 0-27.392 12.288-27.392 27.392v550.4c0 15.104 12.288 27.392 27.392 27.392h764.416c15.104 0 27.392-12.288 27.392-27.392v-550.4c0-15.104-12.288-27.392-27.392-27.392H130.304z" fill="currentColor" p-id="5788"></path><path d="M686.848 599.04m-38.4 0a38.4 38.4 0 1 0 76.8 0 38.4 38.4 0 1 0-76.8 0Z" fill="currentColor" p-id="5789"></path><path d="M941.824 747.008H674.816c-81.408 0-147.712-66.304-147.712-147.712s66.304-147.712 147.712-147.712H924.16v61.44h-249.344c-47.616 0-86.272 38.656-86.272 86.272s38.656 86.272 86.272 86.272h267.008v61.44zM426.24 286.464l-33.536-51.456 257.024-167.68c42.752-27.904 100.864-16.128 129.536 25.856l103.168 151.552-50.688 34.56-103.168-151.552c-9.984-14.592-30.208-18.688-45.056-8.96l-257.28 167.68z" fill="currentColor" p-id="5790"></path></svg>`;

    const iconInsert = `<svg class="mall-sidebar-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5296"><path d="M985.148915 473.225694a38.851087 38.851087 0 0 0-38.7999 38.7999v365.937315a68.693227 68.693227 0 0 1-68.539665 68.539665h-731.977006a68.693227 68.693227 0 0 1-68.539665-68.539665v-731.977005a68.693227 68.693227 0 0 1 68.539665-68.539666H511.923222a38.748713 38.748713 0 1 0 0-77.446238H145.985906A146.139465 146.139465 0 0 0 0.000003 145.985904v731.977005a146.139465 146.139465 0 0 0 146.03709 145.883529h731.977006a146.139465 146.139465 0 0 0 145.985904-145.985903v-365.886129a38.595151 38.595151 0 0 0-38.851088-38.748712z m-751.428143 105.95751l20.474882 165.744164a38.595151 38.595151 0 0 0 33.578805 33.578805l165.744164 20.474882c1.689178 0 3.224794 0.307123 5.11872 0.307123a38.44159 38.44159 0 0 0 27.436341-11.414746l461.452637-461.452637a147.623894 147.623894 0 0 0 0-208.843789l-32.350312-32.350313a147.982204 147.982204 0 0 0-208.843789 0l-461.452637 461.452637a39.362959 39.362959 0 0 0-11.209998 32.503874z m576.777406-459.55871a69.512222 69.512222 0 0 1 49.6004 20.474881l32.350312 32.350313a69.92172 69.92172 0 0 1 0 99.200799l-448.195151 448.195152-117.065134-14.639541-14.63954-117.065133 448.195152-448.195151a71.303774 71.303774 0 0 1 49.753961-20.32132z" fill="currentColor" p-id="5297"></path></svg>`;
    const iconGenerate = `<svg class="mall-sidebar-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1417"><path d="M144 464a32 32 0 0 1 32 32v16c0 185.216 155.744 336 348.576 336 88.096 0 170.88-31.584 234.464-87.36l8.192-7.392 11.68-10.944a32 32 0 0 1 45.216 1.536l21.856 23.36a32 32 0 0 1-1.504 45.248l-11.712 10.912c-82.272 76.928-191.776 120.64-308.16 120.64-141.12 0-267.104-63.968-348.608-163.84v35.84a32 32 0 0 1-32 32h-32a32 32 0 0 1-32-32v-320a32 32 0 0 1 32-32h32z m361.216-384c138.624 0 262.368 63.36 342.784 162.304V208a32 32 0 0 1 32-32h32a32 32 0 0 1 32 32v320a32 32 0 0 1-32 32h-32a32 32 0 0 1-32-32V512c0-185.376-153.28-336-342.784-336-90.88 0-175.968 34.752-239.456 95.552l-7.52 7.424-11.2 11.424a32 32 0 0 1-45.28 0.384l-22.816-22.4a32 32 0 0 1-0.384-45.28l11.2-11.424A440.96 440.96 0 0 1 505.216 80z" fill="currentColor" p-id="1418"></path></svg>`;

    // Collapse Icon
    const iconCollapse = `<svg t="1770734962386" class="icon" viewBox="0 0 1265 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4140" width="24" height="24"><path d="M374.894 536.327c0 0.004 0 0.018 0 0.023 0 183.665 148.891 332.559 332.559 332.559 183.665 0 332.559-148.891 332.559-332.559 0-0.005 0-0.019 0-0.023 0-0.003 0-0.017 0-0.022 0-183.665-148.891-332.559-332.559-332.559-183.665 0-332.559 148.891-332.559 332.559 0 0.005 0 0.019 0 0.023z" fill="#c8eff8" p-id="4141"></path><path d="M496.886 536.327c0 116.292 94.271 210.564 210.564 210.564s210.564-94.271 210.564-210.564c0 0 0 0 0 0 0-116.292-94.271-210.564-210.564-210.564-116.292 0-210.564 94.271-210.564 210.564 0 0 0 0 0 0z" fill="#76D5eb" p-id="4142"></path></svg>`;

    // Cart Icon
    const iconCart = `<svg viewBox="0 0 1024 1024" width="24" height="24" fill="currentColor"><path d="M396.8 695.466667c8.533333 4.266667 21.333333 4.266667 29.866667 4.266666h379.733333c55.466667 0 106.666667-38.4 123.733333-89.6l76.8-256c12.8-38.4 4.266667-81.066667-21.333333-115.2-25.6-34.133333-59.733333-51.2-102.4-51.2H375.466667c-25.6 0-46.933333 8.533333-64 17.066667l-25.6-115.2C277.333333 38.4 230.4 4.266667 179.2 4.266667h-128c-25.6 0-42.666667 17.066667-42.666667 42.666666s17.066667 42.666667 42.666667 42.666667h128c8.533333 0 17.066667 8.533333 21.333333 17.066667l85.333334 413.866666 17.066666 76.8c4.266667 17.066667 12.8 34.133333 21.333334 51.2l-29.866667 59.733334c-17.066667 34.133333-12.8 72.533333 4.266667 102.4 17.066667 25.6 42.666667 42.666667 76.8 46.933333-17.066667 17.066667-25.6 38.4-25.6 64 0 51.2 42.666667 98.133333 98.133333 98.133333s98.133333-42.666667 98.133333-98.133333c0-25.6-8.533333-46.933333-25.6-64h221.866667c-17.066667 17.066667-25.6 38.4-25.6 64 0 51.2 42.666667 98.133333 98.133333 98.133333s98.133333-42.666667 98.133334-98.133333c0-25.6-8.533333-46.933333-25.6-64h46.933333c25.6 0 42.666667-17.066667 42.666667-42.666667s-17.066667-42.666667-42.666667-42.666666H388.266667c-8.533333 0-17.066667-4.266667-17.066667-8.533334s-4.266667-12.8 0-21.333333l25.6-46.933333z m409.6 260.266666c-17.066667 0-34.133333-12.8-34.133333-34.133333s12.8-34.133333 34.133333-34.133333 34.133333 12.8 34.133333 34.133333-12.8 34.133333-34.133333 34.133333z m-362.666667 0c-17.066667 0-34.133333-12.8-34.133333-34.133333s12.8-34.133333 34.133333-34.133333 34.133333 12.8 34.133334 34.133333-17.066667 34.133333-34.133334 34.133333zM332.8 324.266667c0-12.8 4.266667-25.6 8.533333-34.133334 8.533333-8.533333 21.333333-17.066667 34.133334-17.066666h507.733333c12.8 0 25.6 4.266667 34.133333 17.066666 8.533333 12.8 8.533333 25.6 8.533334 38.4l-76.8 256c-4.266667 17.066667-21.333333 29.866667-42.666667 29.866667H426.666667c-21.333333 0-38.4-12.8-42.666667-34.133333l-8.533333-42.666667-8.533334-46.933333-34.133333-166.4z"></path></svg>`;

    // Checkout Icon
    const iconCheckout = `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M780.5 573.7h-6c-8 0-16 0.9-23 2.8-10-30.1-40-51.7-75-51.7h-6c-8 0-16 0.9-23 2.8-9-31-40-52.7-75-52.7h-6c-7 0-14 0.9-20 1.9V354.6c0-40.5-35-72.4-78-72.4h-6c-43 0-78 32.9-78 72.4v337.7l-32-29.2c-30-27.3-81-27.3-110 0l-4 3.8c-15 14.1-23 32-23 51.7 0 19.8 8 37.6 22 50.8l152 158c13 14.1 32 22.6 52 22.6h349.1c35 0 64-24.5 68-57.4 1-1.9 1-4.7 1-6.6V646.2c-1.1-39.5-36.1-72.5-79.1-72.5z m25 307.6h-5c0 1.9-1 3.8-1 5.6 0 4.7-5 8.5-10 8.5h-349c-3 0-6-0.9-9-3.8l-153-159.9c-4-3.8-6-7.5-6-12.2s2-9.4 6-12.2l4-3.8c4-3.8 9-5.6 15-5.6s11 1.9 15 5.6l81 74.3c8 7.5 21 9.4 31 5.6 11-4.7 18-14.1 18-25.4V355.5c0-10.3 9-17.9 21-17.9h6c11 0 21 8.5 21 17.9v185.3c0 14.1 12 26.3 27 27.3 15 0.9 28-8.5 31-22.6 1-8.5 10-15.1 20-15.1h6c11 0 21 8.5 21 17.9v43.3c0 14.1 12 26.3 27 27.3 15 0.9 28-8.5 31-22.6 1-8.5 10-15.1 20-15.1h6c11 0 21 8.5 21 17.9v41.4c0 14.1 12 26.3 27 27.3 15 0.9 28-8.5 31-22.6 1-8.5 10-15.1 20-15.1h6c11 0 21 8.5 21 17.9v233.3zM466.5 218.1c16 0 29-12.2 29-27.3v-89.4c0-15.1-13-27.3-29-27.3s-29 12.2-29 27.3v88.4c0 16.1 13 28.3 29 28.3zM611.5 327.3c0 15.1 13 27.3 29 27.3h97c16 0 29-12.2 29-27.3 0-15.1-13-27.3-29-27.3h-97c-16 0-29 12.2-29 27.3zM550.5 255.8c6 5.6 14 8.5 21 8.5s15-2.8 20-7.5l68-63c11-10.3 12-28.2 1-38.6-11-10.4-29-11.3-41-0.9l-68 63c-11 10.3-12 28.1-1 38.5zM270.5 193.7l68 63c6 4.7 13 7.5 20 7.5h1c16 0 29-12.2 29-27.3 0-9.4-5-17.9-13-22.6l-65-60.2c-11-10.3-30-10.3-41 0.9-11 11.4-11 28.3 1 38.7zM319.5 327.3c0-15.1-13-27.3-29-27.3h-97c-16 0-29 12.2-29 27.3 0 15.1 13 27.3 29 27.3h97c16 0 29-12.3 29-27.3z" fill="currentColor"></path></svg>`;

    // 3. Create Overlay
    const overlay = document.createElement('div');
    overlay.id = 'mall-app-overlay';

    overlay.innerHTML = `
        <div id="mall-sidebar" class="mall-sidebar">
            <div class="mall-sidebar-item active">
                ${iconFood}
                <span>FOOD</span>
            </div>
            <div class="mall-sidebar-item">
                ${iconCoffee}
                <span>COFFEE</span>
            </div>
            <div class="mall-sidebar-item">
                ${iconClothes}
                <span>CLOTHES</span>
            </div>
            <div class="mall-sidebar-item">
                ${iconCommodity}
                <span>COMMODITY</span>
            </div>
            <div class="mall-sidebar-item">
                ${iconGifts}
                <span>GIFTS</span>
            </div>
            <div class="mall-sidebar-item">
                ${iconPlay}
                <span>PLAY</span>
            </div>
            <div class="mall-sidebar-item">
                ${iconSpeakeasy}
                <span>SPEAKEASY</span>
            </div>
            <div class="mall-sidebar-separator"></div>
            <div class="mall-sidebar-item">
                ${iconLogistics}
                <span>LOGISTICS</span>
            </div>
            <div class="mall-sidebar-item">
                ${iconBackpack}
                <span>BACKPACK</span>
            </div>
            <div class="mall-sidebar-item">
                ${iconWallet}
                <span>WALLET</span>
            </div>
            <div class="mall-sidebar-separator"></div>
            <div class="mall-sidebar-item">
                ${iconInsert}
                <span>INSERT</span>
            </div>
            <div class="mall-sidebar-item">
                ${iconGenerate}
                <span>GENERATE</span>
            </div>
        </div>
        
        <div id="mall-main-view" class="mall-main-view">
            <div class="mall-header">
                <button id="mall-sidebar-toggle" class="mall-btn" title="菜单">
                    ${iconCollapse}
                </button>
                <span class="mall-title" id="mall-title">商城</span>
                <button id="mall-close-btn" class="mall-btn" title="关闭">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
            </div>
            <div class="mall-content">
                <div class="mall-product-grid" id="mall-product-grid">
                    <!-- Products rendered here -->
                </div>
            </div>
            
            <div class="mall-bottom-bar">
                <div class="mall-cart-capsule" id="mall-cart-trigger">
                    <button class="mall-cart-icon-btn" type="button">
                        ${iconCart}
                        <span class="mall-cart-badge" id="mall-cart-badge"></span>
                    </button>
                    <div class="mall-cart-info">
                        <span class="mall-cart-total">￥0</span>
                        <span class="mall-cart-count">×0</span>
                    </div>
                </div>
                <button class="mall-checkout-btn" id="mall-checkout-btn" type="button">
                    ${iconCheckout}
                </button>
            </div>
        </div>

        <div class="mall-cart-popup" id="mall-cart-popup">
            <div class="mall-cart-header">
                <span>购物车</span>
                <span id="mall-cart-close" style="cursor:pointer; color:#888;">✕</span>
            </div>
            <div class="mall-cart-list" id="mall-cart-list">
                <!-- Cart items rendered here -->
                <div style="text-align:center; color:#999; margin-top:20px;">购物车为空</div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // 4. Render Products
    const grid = document.getElementById('mall-product-grid');
    const addIcon = `<svg class="mall-add-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`;
    const removeIcon = `<svg class="mall-add-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>`;
    const cartRemoveIcon = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M18 6L6 18"></path>
            <path d="M6 6l12 12"></path>
        </svg>
    `;
    
    // Global function for adding to cart (attached to window for inline onclick access if needed, but better to use event delegation or closure)
    function triggerCartBump() {
        const iconBtn = document.querySelector('.mall-cart-icon-btn');
        if (!iconBtn) return;
        iconBtn.classList.remove('mall-bump');
        void iconBtn.offsetWidth;
        iconBtn.classList.add('mall-bump');
    }
    window.mallAddToCart = function(productId) {
        const product = productById.get(productId);
        if (!product) return;

        if (cart[productId]) {
            cart[productId].quantity++;
        } else {
            cart[productId] = { ...product, quantity: 1 };
        }
        updateCartUI();
        triggerCartBump();
    };
    window.mallRemoveFromCart = function(productId) {
        if (!cart[productId]) return;
        cart[productId].quantity--;
        if (cart[productId].quantity <= 0) {
            delete cart[productId];
        }
        updateCartUI();
    };
    window.mallRemoveItemFromCart = function(productId) {
        if (!cart[productId]) return;
        delete cart[productId];
        updateCartUI();
    };
    window.mallToggleCartFromCard = function(productId) {
        if (cart[productId] && cart[productId].quantity > 0) {
            window.mallRemoveFromCart(productId);
        } else {
            window.mallAddToCart(productId);
        }
    };

    function syncGridBottomSafeArea() {
        if (!grid) return;
        const scrollable = grid.scrollHeight > grid.clientHeight + 4;
        const atBottom = grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 2;
        const shouldApply = scrollable && atBottom && grid.scrollTop > 0;
        grid.classList.toggle('at-bottom', shouldApply);
    }

    let gridScrollRaf = 0;
    function requestSyncGridBottomSafeArea() {
        if (gridScrollRaf) return;
        gridScrollRaf = window.requestAnimationFrame(() => {
            gridScrollRaf = 0;
            syncGridBottomSafeArea();
        });
    }

    if (grid) {
        grid.addEventListener('scroll', requestSyncGridBottomSafeArea, { passive: true });
        window.addEventListener('resize', requestSyncGridBottomSafeArea);
    }

    function renderProducts() {
        const visibleProducts = (productsByCategory[activeCategory] || []).filter((p) => !removedProductIds.has(p.id));
        grid.innerHTML = visibleProducts.map(product => `
            <div class="mall-card" data-product-id="${product.id}">
                <div class="mall-card-image-box">
                    <div class="mall-card-emoji">${product.emoji}</div>
                </div>
                <div class="mall-card-details">
                    <div class="mall-card-name">${product.name}</div>
                    <div class="mall-card-bottom">
                        <button class="mall-add-btn" data-product-id="${product.id}" onclick="event.stopPropagation(); window.mallToggleCartFromCard(${product.id})">
                            ${addIcon}
                        </button>
                        <span class="mall-price">￥${product.price.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `).join('');
        updateCartUI();
        requestSyncGridBottomSafeArea();
        window.requestAnimationFrame(() => {
            document.querySelectorAll('#mall-product-grid .mall-card-name').forEach((el) => fitSingleLineText(el, 16, 11));
        });
    }
    renderProducts();

    let activeProductPreview = null;
    function openProductPreview(productId, cardEl) {
        if (!cardEl || activeProductPreview) return;
        const product = productById.get(productId);
        if (!product) return;

        const originRect = cardEl.getBoundingClientRect();

        const backdrop = document.createElement('div');
        backdrop.className = 'mall-product-preview-backdrop';
        backdrop.addEventListener('click', () => closeProductPreview());
        backdrop.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });

        const clone = cardEl.cloneNode(true);
        clone.classList.add('mall-product-preview-card');
        clone.style.left = `${originRect.left}px`;
        clone.style.top = `${originRect.top}px`;
        clone.style.width = `${originRect.width}px`;
        clone.style.height = `${originRect.height}px`;
        clone.style.transform = 'translate(0px, 0px) scale(1)';
        clone.style.cursor = 'default';
        clone.addEventListener('click', (e) => e.stopPropagation());

        const addBtn = clone.querySelector('.mall-add-btn');
        if (addBtn) addBtn.style.display = 'none';

        const nameEl = clone.querySelector('.mall-card-name');
        if (nameEl) {
            const descEl = document.createElement('div');
            descEl.className = 'mall-card-desc';
            descEl.textContent = product.desc || '';
            nameEl.insertAdjacentElement('afterend', descEl);
        }

        backdrop.appendChild(clone);
        overlay.appendChild(backdrop);

        cardEl.style.visibility = 'hidden';

        const maxWidth = Math.min(420, window.innerWidth - 40);
        const maxHeight = window.innerHeight - 120;
        clone.style.height = 'auto';
        clone.style.maxHeight = 'none';

        const previewNameEl = clone.querySelector('.mall-card-name');
        fitSingleLineText(previewNameEl, 18, 12);

        const previewDescEl = clone.querySelector('.mall-card-desc');
        let descFontPx = 13;
        if (previewDescEl) {
            previewDescEl.style.fontSize = `${descFontPx}px`;
            previewDescEl.style.lineHeight = '1.45';
        }

        let previewRect = clone.getBoundingClientRect();
        let scaleW = maxWidth / previewRect.width;
        let scaleH = maxHeight / previewRect.height;
        let scale = Math.min(scaleW, scaleH);

        while (scale < 0.72 && previewDescEl && descFontPx > 11) {
            descFontPx -= 1;
            previewDescEl.style.fontSize = `${descFontPx}px`;
            previewDescEl.style.lineHeight = descFontPx <= 11 ? '1.25' : '1.35';
            previewRect = clone.getBoundingClientRect();
            scaleW = maxWidth / previewRect.width;
            scaleH = maxHeight / previewRect.height;
            scale = Math.min(scaleW, scaleH);
        }

        const targetX = window.innerWidth / 2 - (previewRect.left + previewRect.width / 2);
        const targetY = window.innerHeight / 2 - (previewRect.top + previewRect.height / 2);
        const toTransform = `translate(${targetX}px, ${targetY}px) scale(${scale})`;

        clone.animate(
            [
                { transform: 'translate(0px, 0px) scale(1)' },
                { transform: toTransform }
            ],
            { duration: 360, easing: 'cubic-bezier(0.2, 0.9, 0.2, 1)', fill: 'forwards' }
        );

        activeProductPreview = { backdrop, clone, originEl: cardEl, toTransform };
    }

    function closeProductPreview() {
        if (!activeProductPreview) return;
        const { backdrop, clone, originEl, toTransform } = activeProductPreview;
        activeProductPreview = null;

        const anim = clone.animate(
            [
                { transform: toTransform },
                { transform: 'translate(0px, 0px) scale(1)' }
            ],
            { duration: 260, easing: 'cubic-bezier(0.2, 0.9, 0.2, 1)', fill: 'forwards' }
        );

        anim.onfinish = () => {
            if (originEl) originEl.style.visibility = '';
            if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
        };
    }

    if (grid) {
        grid.addEventListener('click', (e) => {
            const sidebarEl = document.getElementById('mall-sidebar');
            if (sidebarEl && sidebarEl.classList.contains('open')) {
                sidebarEl.classList.remove('open');
                document.getElementById('mall-main-view')?.classList.remove('blurred');
                return;
            }
            const cardEl = e.target.closest('.mall-card[data-product-id]');
            if (!cardEl) return;
            const productId = Number(cardEl.dataset.productId);
            if (!productId) return;
            openProductPreview(productId, cardEl);
        });
    }

    // Cart Logic
    function updateCartUI() {
        const cartItems = Object.values(cart);
        const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Update Bottom Bar
        const countEl = document.querySelector('.mall-cart-count');
        const totalEl = document.querySelector('.mall-cart-total');
        const badgeEl = document.getElementById('mall-cart-badge');
        if (countEl) countEl.textContent = `×${totalCount}`;
        if (totalEl) totalEl.textContent = `￥${totalPrice}`; // Intentionally not fixed decimal for integer look if user wanted simple "￥n", but price usually has decimals. User said "￥n". I'll keep decimals if present or Math.round? User said "￥n", I will strip decimals if .00, else show. Actually mock data has .00. Let's stick to integer if possible or simple string.
        if (totalEl) totalEl.textContent = `￥${totalPrice % 1 === 0 ? totalPrice : totalPrice.toFixed(2)}`;
        if (badgeEl) {
            badgeEl.textContent = totalCount > 99 ? '99+' : String(totalCount);
            badgeEl.classList.toggle('visible', totalCount > 0);
        }

        const cardButtons = document.querySelectorAll('.mall-add-btn[data-product-id]');
        cardButtons.forEach((btn) => {
            const productId = Number(btn.dataset.productId);
            const hasInCart = Boolean(cart[productId] && cart[productId].quantity > 0);
            btn.classList.toggle('in-cart', hasInCart);
            btn.innerHTML = hasInCart ? removeIcon : addIcon;
        });

        // Update Popup List
        const listEl = document.getElementById('mall-cart-list');
        if (listEl) {
            if (cartItems.length === 0) {
                listEl.innerHTML = '<div style="text-align:center; color:#999; margin-top:20px;">购物车为空</div>';
            } else {
                listEl.innerHTML = cartItems.map(item => `
                    <div class="mall-cart-item">
                        <span class="mall-cart-item-name">${item.emoji} ${item.name}</span>
                        <div class="mall-cart-item-right">
                            <span>￥${item.price}</span>
                            <span style="color:#888;">x${item.quantity}</span>
                            <button class="mall-cart-remove-btn" type="button" onclick="event.stopPropagation(); window.mallRemoveItemFromCart(${item.id})">
                                ${cartRemoveIcon}
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    let generateModalState = null;
    function closeGenerateModal() {
        if (!generateModalState) return;
        if (generateModalState.isGenerating) return;
        const { backdrop } = generateModalState;
        generateModalState = null;
        if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    }

    function updateRangeVisual(rangeEl, value, maxValue) {
        if (!rangeEl) return;
        const maxV = Math.max(1, Number(maxValue) || 30);
        const v = Math.max(0, Math.min(maxV, Number(value) || 0));
        rangeEl.max = String(maxV);
        rangeEl.value = String(v);
        const pct = Math.max(0, Math.min(100, (v / maxV) * 100));
        const isDark = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
        const fill = isDark ? 'rgba(118, 213, 235, 0.65)' : 'rgba(118, 213, 235, 0.85)';
        const track = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.08)';
        rangeEl.style.background = `linear-gradient(90deg, ${fill} 0%, ${fill} ${pct}%, ${track} ${pct}%, ${track} 100%)`;
    }

    function animateRangeToValue(rangeEl, targetValue, maxValue) {
        if (!rangeEl) return;
        const maxV = Math.max(1, Number(maxValue) || 30);
        const safeTarget = Math.max(0, Math.min(maxV, Number(targetValue) || 0));
        const start = Number(rangeEl.value) || 0;
        const delta = safeTarget - start;
        if (delta <= 0) {
            updateRangeVisual(rangeEl, safeTarget, maxV);
            return;
        }
        const steps = Math.min(28, Math.max(8, Math.ceil(delta)));
        let currentStep = 0;
        const tick = () => {
            currentStep++;
            const next = start + (delta * currentStep) / steps;
            updateRangeVisual(rangeEl, next, maxV);
            if (currentStep >= steps) return;
            window.setTimeout(tick, 18);
        };
        tick();
    }

    function openGenerateModal() {
        if (generateModalState) return;

        const doneSvg = `
            <svg class="mall-gen-check" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        `;

        const rowsHTML = categories
            .map((cat) => {
                return `
                    <div class="mall-gen-row" data-category="${cat}">
                        <div class="mall-gen-row-top">
                            <div class="mall-gen-label">${categoryDisplayZh[cat] || cat}</div>
                            <div class="mall-gen-value">
                                <span class="mall-gen-right">
                                    <span class="mall-gen-value-text">0/30</span>
                                    ${doneSvg}
                                </span>
                            </div>
                        </div>
                        <input class="mall-gen-range" type="range" min="0" max="30" value="0" step="1" />
                    </div>
                `;
            })
            .join('');

        const backdrop = document.createElement('div');
        backdrop.className = 'mall-modal-backdrop';
        backdrop.innerHTML = `
            <div class="mall-modal" role="dialog" aria-modal="true">
                <div class="mall-modal-header">
                    <div class="mall-modal-title">生成商品</div>
                    <button class="mall-modal-close" type="button" aria-label="关闭">✕</button>
                </div>
                <div class="mall-modal-body">
                    ${rowsHTML}
                </div>
                <div class="mall-modal-footer">
                    <button class="mall-modal-btn secondary" type="button" data-action="cancel">取消</button>
                    <button class="mall-modal-btn primary" type="button" data-action="start">开始生成</button>
                </div>
            </div>
        `;

        const modal = backdrop.querySelector('.mall-modal');
        if (modal) modal.addEventListener('click', (e) => e.stopPropagation());

        backdrop.addEventListener('click', () => closeGenerateModal());

        const closeBtn = backdrop.querySelector('.mall-modal-close');
        if (closeBtn) closeBtn.addEventListener('click', () => closeGenerateModal());

        const cancelBtn = backdrop.querySelector('[data-action="cancel"]');
        if (cancelBtn) cancelBtn.addEventListener('click', () => closeGenerateModal());

        const ranges = Array.from(backdrop.querySelectorAll('.mall-gen-row'));
        ranges.forEach((row) => {
            const range = row.querySelector('input[type="range"]');
            const textEl = row.querySelector('.mall-gen-value-text');
            const sync = () => {
                const v = Math.max(0, Math.min(30, Number(range?.value) || 0));
                if (textEl) textEl.textContent = `${v}/30`;
                if (row) row.classList.remove('done');
                updateRangeVisual(range, v, 30);
            };
            if (range) range.addEventListener('input', sync);
            sync();
        });

        const startBtn = backdrop.querySelector('[data-action="start"]');
        if (startBtn) {
            startBtn.addEventListener('click', async () => {
                if (!generateModalState) return;
                if (generateModalState.isGenerating) return;
                generateModalState.isGenerating = true;

                const selection = {};
                ranges.forEach((row) => {
                    const cat = row.getAttribute('data-category');
                    const range = row.querySelector('input[type="range"]');
                    const v = Math.max(0, Math.min(30, Number(range?.value) || 0));
                    if (cat) selection[cat] = v;
                });

                ranges.forEach((row) => {
                    const range = row.querySelector('input[type="range"]');
                    if (range) range.disabled = true;
                });
                if (startBtn) startBtn.disabled = true;
                if (cancelBtn) cancelBtn.disabled = true;
                if (closeBtn) closeBtn.disabled = true;

                try {
                    for (const cat of categories) {
                        const target = selection[cat] || 0;
                        const row = backdrop.querySelector(`.mall-gen-row[data-category="${cat}"]`);
                        if (!row) continue;
                        const range = row.querySelector('input[type="range"]');
                        const textEl = row.querySelector('.mall-gen-value-text');
                        if (!target) {
                            if (textEl) textEl.textContent = `0/30`;
                            if (range) {
                                updateRangeVisual(range, 0, 30);
                                range.disabled = true;
                            }
                            continue;
                        }
                        row.classList.remove('done');
                        if (range) updateRangeVisual(range, 0, target);
                        if (textEl) textEl.textContent = `0/${target}`;

                        const prompt = buildMallPrompt(cat, target);
                        const aiText = await getMallAICompletion(prompt);
                        const parsed = parseGeneratedProducts(aiText || '').slice(0, target);
                        const created = appendParsedProductsToCategory(cat, parsed);
                        const done = Math.min(target, created.length);

                        if (range) animateRangeToValue(range, done, target);
                        if (textEl) textEl.textContent = `${done}/${target}`;
                        row.classList.add('done');

                        if (activeCategory === cat) renderProducts();
                    }
                } catch (err) {
                    const msg = err instanceof Error ? err.message : String(err);
                    if (typeof showGlobalToast === 'function') {
                        showGlobalToast(`生成失败：${msg}`, { type: 'error' });
                    } else {
                        alert(`生成失败：${msg}`);
                    }
                } finally {
                    generateModalState.isGenerating = false;
                    closeGenerateModal();
                }
            });
        }

        overlay.appendChild(backdrop);
        generateModalState = { backdrop, isGenerating: false };
    }

    let insertModalState = null;
    function closeInsertModal() {
        if (!insertModalState) return;
        const { backdrop } = insertModalState;
        insertModalState = null;
        if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    }

    function showMallToast(message, type = 'info') {
        if (typeof showGlobalToast === 'function') {
            showGlobalToast(String(message || ''), { type });
            return;
        }
        alert(String(message || ''));
    }

    function openInsertModal() {
        if (insertModalState) return;

        const optionsHTML = categories
            .map((cat) => `<option value="${cat}">${categoryDisplayZh[cat] || cat}</option>`)
            .join('');

        const backdrop = document.createElement('div');
        backdrop.className = 'mall-insert-backdrop';
        backdrop.innerHTML = `
            <div class="mall-insert-panel" role="dialog" aria-modal="true">
                <div class="mall-insert-header">
                    <div class="mall-insert-title">手动添加商品</div>
                    <button class="mall-insert-close" type="button" aria-label="关闭">✕</button>
                </div>
                <div class="mall-card mall-insert-card">
                    <div class="mall-card-image-box mall-insert-emoji-box" title="输入 emoji">
                        <div class="mall-card-emoji mall-insert-emoji" contenteditable="true" spellcheck="false"></div>
                    </div>
                    <div class="mall-card-details mall-insert-fields">
                        <input class="mall-insert-input mall-insert-name" type="text" placeholder="商品名称" />
                        <textarea class="mall-insert-input mall-insert-desc" placeholder="商品详情"></textarea>
                        <div class="mall-insert-row">
                            <input class="mall-insert-input mall-insert-price" type="number" inputmode="decimal" step="0.01" placeholder="价格" />
                            <select class="mall-insert-input mall-insert-category">
                                ${optionsHTML}
                            </select>
                        </div>
                        <button class="mall-insert-save" type="button">保存</button>
                    </div>
                </div>
            </div>
        `;

        const panel = backdrop.querySelector('.mall-insert-panel');
        if (panel) panel.addEventListener('click', (e) => e.stopPropagation());
        backdrop.addEventListener('click', () => closeInsertModal());

        const closeBtn = backdrop.querySelector('.mall-insert-close');
        if (closeBtn) closeBtn.addEventListener('click', () => closeInsertModal());

        const emojiEl = backdrop.querySelector('.mall-insert-emoji');
        const nameEl = backdrop.querySelector('.mall-insert-name');
        const descEl = backdrop.querySelector('.mall-insert-desc');
        const priceEl = backdrop.querySelector('.mall-insert-price');
        const categoryEl = backdrop.querySelector('.mall-insert-category');
        const saveBtn = backdrop.querySelector('.mall-insert-save');

        if (categoryEl) categoryEl.value = activeCategory;

        let currentDefaultEmoji = pickCategoryEmoji(activeCategory);
        if (emojiEl) emojiEl.textContent = currentDefaultEmoji;

        if (categoryEl) {
            categoryEl.addEventListener('change', () => {
                const nextCat = String(categoryEl.value || '').trim();
                const nextDefault = pickCategoryEmoji(nextCat);
                const current = String(emojiEl?.textContent || '').trim();
                if (!current || current === currentDefaultEmoji) {
                    if (emojiEl) emojiEl.textContent = nextDefault;
                }
                currentDefaultEmoji = nextDefault;
            });
        }

        const doSave = () => {
            const category = String(categoryEl?.value || '').trim();
            if (!categories.includes(category)) {
                showMallToast('请选择分类。', 'error');
                return;
            }
            const rawName = String(nameEl?.value || '').trim();
            if (!rawName) {
                showMallToast('请填写商品名称。', 'error');
                nameEl?.focus();
                return;
            }
            const name = truncateNameTo12(rawName);
            const desc = String(descEl?.value || '').trim();
            const price = normalizePrice(priceEl?.value);
            if (price === null) {
                showMallToast('请填写有效价格。', 'error');
                priceEl?.focus();
                return;
            }

            const emoji = String(emojiEl?.textContent || '').trim() || pickCategoryEmoji(category);
            const product = { id: nextProductId++, name, emoji, price, desc, category };
            productsByCategory[category].push(product);
            productById.set(product.id, product);
            removedProductIds.delete(product.id);

            if (activeCategory === category) {
                renderProducts();
            } else {
                updateCartUI();
            }

            showMallToast(`已添加到 ${categoryDisplayZh[category] || category}`, 'success');

            if (nameEl) nameEl.value = '';
            if (descEl) descEl.value = '';
            if (priceEl) priceEl.value = '';
            currentDefaultEmoji = pickCategoryEmoji(category);
            if (emojiEl) emojiEl.textContent = currentDefaultEmoji;
            nameEl?.focus();
        };

        if (saveBtn) saveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            doSave();
        });

        overlay.appendChild(backdrop);
        insertModalState = { backdrop };
        window.setTimeout(() => nameEl?.focus(), 0);
    }

    // 5. Event Listeners
    const appMallIcon = document.getElementById('app-mall');
    const closeBtn = document.getElementById('mall-close-btn');
    const sidebarToggle = document.getElementById('mall-sidebar-toggle');
    const sidebar = document.getElementById('mall-sidebar');
    const mainView = document.getElementById('mall-main-view');
    const titleEl = document.getElementById('mall-title');
    const cartTrigger = document.getElementById('mall-cart-trigger');
    const cartPopup = document.getElementById('mall-cart-popup');
    const cartClose = document.getElementById('mall-cart-close');
    const checkoutBtn = document.getElementById('mall-checkout-btn');

    function setActiveCategory(category) {
        if (!categories.includes(category)) return;
        activeCategory = category;
        if (titleEl) titleEl.textContent = `商城 · ${categoryDisplayZh[category] || categoryMeta[category]?.title || category}`;
        if (sidebar) {
            sidebar.querySelectorAll('.mall-sidebar-item').forEach((item) => {
                const label = item.querySelector('span')?.textContent?.trim();
                item.classList.toggle('active', label === category);
            });
        }
        renderProducts();
    }

    setActiveCategory(activeCategory);

    if (appMallIcon) {
        appMallIcon.addEventListener('click', () => {
            overlay.classList.add('visible');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('visible');
            closeProductPreview();
            sidebar.classList.remove('open');
            mainView.classList.remove('blurred');
            cartPopup.classList.remove('open'); // Close cart popup too
        });
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
            mainView.classList.toggle('blurred');
        });
    }

    if (sidebar) {
        sidebar.addEventListener('click', (e) => {
            const item = e.target.closest('.mall-sidebar-item');
            if (!item) return;
            const label = item.querySelector('span')?.textContent?.trim();
            if (!label) return;
            if (label === 'INSERT') {
                openInsertModal();
                sidebar.classList.remove('open');
                mainView.classList.remove('blurred');
                return;
            }
            if (label === 'GENERATE') {
                openGenerateModal();
                sidebar.classList.remove('open');
                mainView.classList.remove('blurred');
                return;
            }
            if (categories.includes(label)) {
                setActiveCategory(label);
                sidebar.classList.remove('open');
                mainView.classList.remove('blurred');
            }
        });
    }

    if (cartTrigger) {
        cartTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            cartPopup.classList.toggle('open');
        });
    }

    if (cartClose) {
        cartClose.addEventListener('click', () => {
            cartPopup.classList.remove('open');
        });
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const cartItemIds = Object.keys(cart).map((id) => Number(id));
            cartItemIds.forEach((id) => removedProductIds.add(id));
            cart = {};
            cartPopup.classList.remove('open');
            renderProducts();
            if (typeof showGlobalToast === 'function') {
                showGlobalToast('下单成功！', { type: 'success' });
            }
        });
    }

    // Close sidebar when clicking outside
    mainView.addEventListener('click', (e) => {
        if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('open');
            mainView.classList.remove('blurred');
            return;
        }
        // Also close cart popup if clicking outside of it (on main view)
        if (cartPopup.classList.contains('open') && !cartPopup.contains(e.target) && !cartTrigger.contains(e.target)) {
            cartPopup.classList.remove('open');
        }
    });

})();
