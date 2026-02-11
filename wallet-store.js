(() => {
    const STORAGE_KEY = 'walletData';
    const DEFAULT_DATA = {
        version: 1,
        balanceAmount: 0,
        pointsAmount: 0,
        balanceLedger: [],
        pointsLedger: []
    };

    function parseStoredData(raw) {
        if (!raw) return null;
        try {
            return typeof raw === 'string' ? JSON.parse(raw) : raw;
        } catch {
            return null;
        }
    }

    function normalizeNumber(value, fallback = 0) {
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }

    function roundToMoney(value) {
        return Math.round(normalizeNumber(value, 0) * 100) / 100;
    }

    function normalizeLedger(list) {
        if (!Array.isArray(list)) return [];
        return list
            .filter(Boolean)
            .map((e) => ({
                id: String(e.id || ''),
                amount: normalizeNumber(e.amount, 0),
                title: typeof e.title === 'string' ? e.title : '',
                note: typeof e.note === 'string' ? e.note : '',
                source: typeof e.source === 'string' ? e.source : '',
                meta: e.meta && typeof e.meta === 'object' ? e.meta : null,
                timestamp: normalizeNumber(e.timestamp, Date.now())
            }))
            .filter((e) => e.id);
    }

    function normalizeWalletData(data) {
        const safe = data && typeof data === 'object' ? data : {};
        const balanceAmount = roundToMoney(safe.balanceAmount);
        const pointsAmount = normalizeNumber(safe.pointsAmount, 0);
        return {
            version: 1,
            balanceAmount,
            pointsAmount,
            balanceLedger: normalizeLedger(safe.balanceLedger),
            pointsLedger: normalizeLedger(safe.pointsLedger)
        };
    }

    async function getWalletData() {
        const raw = await localforage.getItem(STORAGE_KEY);
        const parsed = parseStoredData(raw);
        if (!parsed) return { ...DEFAULT_DATA };
        return normalizeWalletData(parsed);
    }

    async function setWalletData(next) {
        const normalized = normalizeWalletData(next);
        await localforage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        window.dispatchEvent(new CustomEvent('wallet:changed', { detail: { data: normalized } }));
        return normalized;
    }

    function generateId(prefix) {
        return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    }

    function createEntry(amount, info = {}) {
        const ts = Date.now();
        const title = typeof info.title === 'string' ? info.title : '';
        const note = typeof info.note === 'string' ? info.note : '';
        const source = typeof info.source === 'string' ? info.source : '';
        const meta = info.meta && typeof info.meta === 'object' ? info.meta : null;
        return {
            id: generateId('wallet'),
            amount: normalizeNumber(amount, 0),
            title,
            note,
            source,
            meta,
            timestamp: ts
        };
    }

    function trimLedger(ledger, maxSize = 200) {
        if (!Array.isArray(ledger)) return [];
        if (ledger.length <= maxSize) return ledger;
        return ledger.slice(0, maxSize);
    }

    async function addBalance(delta, info = {}) {
        const data = await getWalletData();
        const d = roundToMoney(delta);
        data.balanceAmount = roundToMoney(data.balanceAmount + d);
        data.balanceLedger = trimLedger([createEntry(d, info), ...(data.balanceLedger || [])]);
        return await setWalletData(data);
    }

    async function addPoints(delta, info = {}) {
        const data = await getWalletData();
        const d = normalizeNumber(delta, 0);
        data.pointsAmount = normalizeNumber(data.pointsAmount, 0) + d;
        data.pointsLedger = trimLedger([createEntry(d, info), ...(data.pointsLedger || [])]);
        return await setWalletData(data);
    }

    window.walletStore = {
        getWalletData,
        addBalance,
        addPoints
    };
})();
