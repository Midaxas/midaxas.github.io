const yearNode = document.getElementById('year');
const cashValue = document.getElementById('cash-value');
const inventoryValueNode = document.getElementById('inventory-value');
const openedValueNode = document.getElementById('opened-value');
const incomeAmountNode = document.getElementById('income-amount');
const incomeIntervalNode = document.getElementById('income-interval');
const incomeCountdownNode = document.getElementById('income-countdown');
const caseListNode = document.getElementById('case-list');
const marketListNode = document.getElementById('market-list');
const inventoryListNode = document.getElementById('inventory-list');
const historyListNode = document.getElementById('history-list');
const rollWindowNode = document.getElementById('roll-window');
const rollTrackNode = document.getElementById('roll-track');
const rollResultNode = document.getElementById('roll-result');
const sellAllButton = document.getElementById('sell-all-btn');

const SAVE_COOKIE = 'caseRushSaveV2';
const SAVE_DAYS = 365;
const INCOME_AMOUNT = 70;
const INCOME_INTERVAL_MS = 90 * 1000;
const API_SKINS_URL = 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json';
const API_CRATES_URL = 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/crates.json';

const fallbackImage = (label) => {
    return `https://dummyimage.com/600x340/1a2e87/b3c7ff.png&text=${encodeURIComponent(label)}`;
};

const skinCatalog = {
    elitebuild: {
        id: 'elitebuild',
        name: 'AK-47 | Elite Build',
        rarity: 'mil-spec',
        value: 7.2,
        image: fallbackImage('AK-47 | Elite Build')
    },
    p250asiimov: {
        id: 'p250asiimov',
        name: 'P250 | Asiimov',
        rarity: 'industrial',
        value: 6.8,
        image: fallbackImage('P250 | Asiimov')
    },
    frontside: {
        id: 'frontside',
        name: 'AK-47 | Frontside Misty',
        rarity: 'restricted',
        value: 24.5,
        image: fallbackImage('AK-47 | Frontside Misty')
    },
    nightmare: {
        id: 'nightmare',
        name: 'M4A1-S | Nightmare',
        rarity: 'restricted',
        value: 16.3,
        image: fallbackImage('M4A1-S | Nightmare')
    },
    redline: {
        id: 'redline',
        name: 'AK-47 | Redline',
        rarity: 'classified',
        value: 40.2,
        image: fallbackImage('AK-47 | Redline')
    },
    hyperbeast: {
        id: 'hyperbeast',
        name: 'M4A1-S | Hyper Beast',
        rarity: 'classified',
        value: 59.4,
        image: fallbackImage('M4A1-S | Hyper Beast')
    },
    mp9starlight: {
        id: 'mp9starlight',
        name: 'MP9 | Starlight Protector',
        rarity: 'classified',
        value: 68.2,
        image: fallbackImage('MP9 | Starlight Protector')
    },
    asiimovawp: {
        id: 'asiimovawp',
        name: 'AWP | Asiimov',
        rarity: 'covert',
        value: 142.0,
        image: fallbackImage('AWP | Asiimov')
    },
    deagleblaze: {
        id: 'deagleblaze',
        name: 'Desert Eagle | Blaze',
        rarity: 'covert',
        value: 530.0,
        image: fallbackImage('Desert Eagle | Blaze')
    },
    atheris: {
        id: 'atheris',
        name: 'AWP | Atheris',
        rarity: 'mil-spec',
        value: 12.7,
        image: fallbackImage('AWP | Atheris')
    },
    famasrollcage: {
        id: 'famasrollcage',
        name: 'FAMAS | Roll Cage',
        rarity: 'restricted',
        value: 14.9,
        image: fallbackImage('FAMAS | Roll Cage')
    },
    fivezeblue: {
        id: 'fivezeblue',
        name: 'Five-SeveN | Case Hardened',
        rarity: 'classified',
        value: 44.2,
        image: fallbackImage('Five-SeveN | Case Hardened')
    },
    uspprintstream: {
        id: 'uspprintstream',
        name: 'USP-S | Printstream',
        rarity: 'classified',
        value: 65.0,
        image: fallbackImage('USP-S | Printstream')
    },
    mac10neon: {
        id: 'mac10neon',
        name: 'MAC-10 | Neon Rider',
        rarity: 'classified',
        value: 24.2,
        image: fallbackImage('MAC-10 | Neon Rider')
    },
    glockfade: {
        id: 'glockfade',
        name: 'Glock-18 | Fade',
        rarity: 'covert',
        value: 480.0,
        image: fallbackImage('Glock-18 | Fade')
    },
    vulcan: {
        id: 'vulcan',
        name: 'AK-47 | Vulcan',
        rarity: 'covert',
        value: 210.0,
        image: fallbackImage('AK-47 | Vulcan')
    },
    asiimov: {
        id: 'asiimov',
        name: 'AK-47 | Asiimov',
        rarity: 'covert',
        value: 120.0,
        image: fallbackImage('AK-47 | Asiimov')
    },
    dragonlore: {
        id: 'dragonlore',
        name: 'AWP | Dragon Lore',
        rarity: 'covert',
        value: 1800.0,
        image: fallbackImage('AWP | Dragon Lore')
    },
    galilchatter: {
        id: 'galilchatter',
        name: 'Galil AR | Chatterbox',
        rarity: 'classified',
        value: 19.1,
        image: fallbackImage('Galil AR | Chatterbox')
    }
};

const cases = [
    {
        id: 'alpha-case',
        apiName: 'Recoil Case',
        name: 'Alpha Strike Case',
        price: 60,
        image: fallbackImage('Alpha Strike Case'),
        loot: [
            { skinId: 'p250asiimov', weight: 24 },
            { skinId: 'elitebuild', weight: 20 },
            { skinId: 'nightmare', weight: 18 },
            { skinId: 'frontside', weight: 14 },
            { skinId: 'redline', weight: 10 },
            { skinId: 'hyperbeast', weight: 8 },
            { skinId: 'mp9starlight', weight: 6 }
        ]
    },
    {
        id: 'sniper-case',
        apiName: 'Kilowatt Case',
        name: 'Longshot Vault Case',
        price: 105,
        image: fallbackImage('Longshot Vault Case'),
        loot: [
            { skinId: 'atheris', weight: 23 },
            { skinId: 'famasrollcage', weight: 19 },
            { skinId: 'mac10neon', weight: 16 },
            { skinId: 'fivezeblue', weight: 14 },
            { skinId: 'uspprintstream', weight: 11 },
            { skinId: 'asiimovawp', weight: 9 },
            { skinId: 'vulcan', weight: 8 }
        ]
    },
    {
        id: 'elite-case',
        apiName: 'Operation Broken Fang Case',
        name: 'Blacksite Elite Case',
        price: 175,
        image: fallbackImage('Blacksite Elite Case'),
        loot: [
            { skinId: 'galilchatter', weight: 20 },
            { skinId: 'frontside', weight: 17 },
            { skinId: 'redline', weight: 16 },
            { skinId: 'uspprintstream', weight: 14 },
            { skinId: 'asiimov', weight: 11 },
            { skinId: 'deagleblaze', weight: 10 },
            { skinId: 'glockfade', weight: 8 },
            { skinId: 'dragonlore', weight: 4 }
        ]
    }
];

const marketSkins = [
    'elitebuild',
    'nightmare',
    'frontside',
    'redline',
    'atheris',
    'uspprintstream',
    'asiimovawp',
    'vulcan'
];

const defaultState = {
    cash: 700,
    inventory: [],
    openedCases: 0,
    soldSkins: 0,
    nextId: 1,
    lastIncomeAt: Date.now(),
    history: []
};

let state = loadState();
let isRolling = false;

if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
}
if (incomeAmountNode) {
    incomeAmountNode.textContent = formatMoney(INCOME_AMOUNT);
}
if (incomeIntervalNode) {
    incomeIntervalNode.textContent = `${Math.floor(INCOME_INTERVAL_MS / 1000)}s`;
}

bootstrap();

async function bootstrap() {
    await hydrateImagesFromApi();
    applyPassiveIncome();
    renderAll();
    setInterval(tickIncomeCountdown, 1000);
    setRollMessage('Choose a case and click open.', '');
}

function formatMoney(value) {
    return `$${value.toFixed(2)}`;
}

function addHistory(text, kind = 'info') {
    const entry = {
        text,
        kind,
        time: Date.now()
    };

    state.history.push(entry);
    if (state.history.length > 25) {
        state.history = state.history.slice(-25);
    }
}

function clampInventorySize() {
    if (state.inventory.length > 100) {
        state.inventory = state.inventory.slice(-100);
    }
}

function saveState() {
    clampInventorySize();
    const serialized = encodeURIComponent(JSON.stringify(state));
    document.cookie = `${SAVE_COOKIE}=${serialized};max-age=${SAVE_DAYS * 24 * 60 * 60};path=/;samesite=lax`;
}

function getCookie(name) {
    const prefix = `${name}=`;
    const chunks = document.cookie.split(';');
    for (const chunk of chunks) {
        const trimmed = chunk.trim();
        if (trimmed.startsWith(prefix)) {
            return trimmed.slice(prefix.length);
        }
    }
    return null;
}

function loadState() {
    const raw = getCookie(SAVE_COOKIE);
    if (!raw) {
        return { ...defaultState };
    }

    try {
        const parsed = JSON.parse(decodeURIComponent(raw));
        return {
            cash: Number(parsed.cash) || defaultState.cash,
            inventory: Array.isArray(parsed.inventory) ? parsed.inventory : [],
            openedCases: Number(parsed.openedCases) || 0,
            soldSkins: Number(parsed.soldSkins) || 0,
            nextId: Number(parsed.nextId) || 1,
            lastIncomeAt: Number(parsed.lastIncomeAt) || Date.now(),
            history: Array.isArray(parsed.history) ? parsed.history : []
        };
    } catch (error) {
        return { ...defaultState };
    }
}

async function hydrateImagesFromApi() {
    try {
        const [skinsResponse, cratesResponse] = await Promise.all([
            fetch(API_SKINS_URL),
            fetch(API_CRATES_URL)
        ]);

        if (!skinsResponse.ok || !cratesResponse.ok) {
            throw new Error('api-unavailable');
        }

        const [skinsData, cratesData] = await Promise.all([
            skinsResponse.json(),
            cratesResponse.json()
        ]);

        const imageBySkinName = new Map();
        skinsData.forEach((item) => {
            if (item && item.name && item.image) {
                imageBySkinName.set(item.name, item.image);
            }
        });

        Object.values(skinCatalog).forEach((skin) => {
            const image = imageBySkinName.get(skin.name);
            if (image) {
                skin.image = image;
            }
        });

        const imageByCaseName = new Map();
        cratesData.forEach((crate) => {
            if (crate && crate.name && crate.image) {
                imageByCaseName.set(crate.name, crate.image);
            }
        });

        cases.forEach((caseDef) => {
            const image = imageByCaseName.get(caseDef.apiName);
            if (image) {
                caseDef.image = image;
            }
        });
    } catch (error) {
        addHistory('Image API unavailable. Fallback images enabled.', 'bad');
    }
}

function applyPassiveIncome() {
    const now = Date.now();
    const elapsed = now - state.lastIncomeAt;
    const ticks = Math.floor(elapsed / INCOME_INTERVAL_MS);

    if (ticks > 0) {
        const payout = ticks * INCOME_AMOUNT;
        state.cash += payout;
        state.lastIncomeAt += ticks * INCOME_INTERVAL_MS;
        addHistory(`Offline payout received: ${formatMoney(payout)}.`, 'good');
        saveState();
    }

    tickIncomeCountdown();
}

function tickIncomeCountdown() {
    const now = Date.now();
    const passed = now - state.lastIncomeAt;

    if (passed >= INCOME_INTERVAL_MS) {
        state.cash += INCOME_AMOUNT;
        state.lastIncomeAt = now;
        addHistory(`Passive payout collected: ${formatMoney(INCOME_AMOUNT)}.`, 'good');
        saveState();
        renderStats();
        renderHistory();
    }

    const remaining = Math.max(0, INCOME_INTERVAL_MS - (Date.now() - state.lastIncomeAt));
    if (incomeCountdownNode) {
        incomeCountdownNode.textContent = `${Math.ceil(remaining / 1000)}s`;
    }
}

function chooseWeightedSkin(lootTable) {
    const totalWeight = lootTable.reduce((acc, item) => acc + item.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const option of lootTable) {
        roll -= option.weight;
        if (roll <= 0) {
            return skinCatalog[option.skinId];
        }
    }

    return skinCatalog[lootTable[lootTable.length - 1].skinId];
}

function rarityBadgeClass(rarity) {
    return rarity.toLowerCase().replace(/\s+/g, '-');
}

function safeImg(url, alt, className) {
    const safeAlt = alt.replace(/"/g, '&quot;');
    return `<img class="${className}" src="${url}" alt="${safeAlt}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackImage(alt)}';">`;
}

function renderStats() {
    if (cashValue) {
        cashValue.textContent = formatMoney(state.cash);
    }
    if (openedValueNode) {
        openedValueNode.textContent = String(state.openedCases);
    }

    const inventoryValue = state.inventory.reduce((sum, item) => {
        const skin = skinCatalog[item.skinId];
        return skin ? sum + skin.value : sum;
    }, 0);

    if (inventoryValueNode) {
        inventoryValueNode.textContent = formatMoney(inventoryValue);
    }
}

function caseOddsText(caseDef) {
    const bucket = {
        'mil-spec': 0,
        restricted: 0,
        classified: 0,
        covert: 0,
        industrial: 0,
        consumer: 0
    };

    let total = 0;
    caseDef.loot.forEach((entry) => {
        const skin = skinCatalog[entry.skinId];
        if (!skin) return;
        const key = skin.rarity;
        bucket[key] = (bucket[key] || 0) + entry.weight;
        total += entry.weight;
    });

    if (!total) return 'Odds unavailable';

    const entries = Object.entries(bucket)
        .filter(([, value]) => value > 0)
        .sort((a, b) => b[1] - a[1])
        .map(([rarity, value]) => `${rarity}: ${Math.round((value / total) * 100)}%`);

    return entries.join(' · ');
}

function renderCases() {
    if (!caseListNode) return;

    caseListNode.innerHTML = cases.map((caseDef) => {
        const canAfford = state.cash >= caseDef.price;
        return `
            <article class="case-card">
                ${safeImg(caseDef.image, caseDef.name, 'case-thumb')}
                <div class="case-title">
                    <h3>${caseDef.name}</h3>
                    <p class="case-sub">Price: <strong>${formatMoney(caseDef.price)}</strong></p>
                    <p class="case-sub">${caseOddsText(caseDef)}</p>
                </div>
                <button class="btn" data-open-case="${caseDef.id}" ${!canAfford || isRolling ? 'disabled' : ''}>Open</button>
            </article>
        `;
    }).join('');

    caseListNode.querySelectorAll('[data-open-case]').forEach((button) => {
        button.addEventListener('click', () => {
            const caseId = button.getAttribute('data-open-case');
            const caseDef = cases.find((entry) => entry.id === caseId);
            if (!caseDef) return;
            openCase(caseDef);
        });
    });
}

function renderMarket() {
    if (!marketListNode) return;

    marketListNode.innerHTML = marketSkins.map((skinId) => {
        const skin = skinCatalog[skinId];
        const buyPrice = skin.value * 1.13;
        return `
            <article class="skin-row">
                ${safeImg(skin.image, skin.name, 'skin-thumb')}
                <div>
                    <h3>${skin.name}</h3>
                    <p class="skin-meta"><span class="rarity ${rarityBadgeClass(skin.rarity)}">${skin.rarity}</span> <span class="skin-value">${formatMoney(skin.value)}</span></p>
                </div>
                <button class="btn ghost" data-buy-skin="${skin.id}" ${state.cash < buyPrice || isRolling ? 'disabled' : ''}>Buy ${formatMoney(buyPrice)}</button>
            </article>
        `;
    }).join('');

    marketListNode.querySelectorAll('[data-buy-skin]').forEach((button) => {
        button.addEventListener('click', () => {
            const skinId = button.getAttribute('data-buy-skin');
            buySkin(skinId);
        });
    });
}

function renderInventory() {
    if (!inventoryListNode) return;

    if (!state.inventory.length) {
        inventoryListNode.innerHTML = '<p class="empty-note">No skins yet. Open cases or buy from market.</p>';
        if (sellAllButton) sellAllButton.disabled = true;
        return;
    }

    if (sellAllButton) sellAllButton.disabled = false;

    inventoryListNode.innerHTML = state.inventory.slice().reverse().map((item) => {
        const skin = skinCatalog[item.skinId];
        if (!skin) return '';

        const sellPrice = skin.value * 0.92;

        return `
            <article class="inventory-card">
                ${safeImg(skin.image, skin.name, 'skin-thumb')}
                <div>
                    <h3>${skin.name}</h3>
                    <p class="skin-meta"><span class="rarity ${rarityBadgeClass(skin.rarity)}">${skin.rarity}</span> <span class="skin-value">Sell ${formatMoney(sellPrice)}</span></p>
                </div>
                <button class="btn" data-sell-item="${item.uid}">Sell</button>
            </article>
        `;
    }).join('');

    inventoryListNode.querySelectorAll('[data-sell-item]').forEach((button) => {
        button.addEventListener('click', () => {
            const uid = Number(button.getAttribute('data-sell-item'));
            sellSkin(uid);
        });
    });
}

function renderHistory() {
    if (!historyListNode) return;

    if (!state.history.length) {
        historyListNode.innerHTML = '<p class="empty-note">No actions yet.</p>';
        return;
    }

    historyListNode.innerHTML = state.history
        .slice()
        .reverse()
        .map((item) => {
            const stamp = new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const kindClass = item.kind === 'good' ? 'log-good' : item.kind === 'bad' ? 'log-bad' : '';
            return `<article class="history-item ${kindClass}"><p>${item.text}</p><p class="history-time">${stamp}</p></article>`;
        })
        .join('');
}

function renderAll() {
    renderStats();
    renderCases();
    renderMarket();
    renderInventory();
    renderHistory();
}

function addSkinToInventory(skinId, source) {
    state.inventory.push({
        uid: state.nextId,
        skinId,
        source,
        acquiredAt: Date.now()
    });
    state.nextId += 1;
}

function buySkin(skinId) {
    const skin = skinCatalog[skinId];
    if (!skin || isRolling) return;

    const buyPrice = skin.value * 1.13;
    if (state.cash < buyPrice) {
        setRollMessage('Not enough cash for this listing.', 'log-bad');
        return;
    }

    state.cash -= buyPrice;
    addSkinToInventory(skinId, 'market');
    addHistory(`Bought ${skin.name} for ${formatMoney(buyPrice)}.`, 'good');
    saveState();
    renderAll();
    setRollMessage(`Bought ${skin.name} for ${formatMoney(buyPrice)}.`, 'log-good');
}

function sellSkin(uid) {
    const index = state.inventory.findIndex((item) => item.uid === uid);
    if (index < 0) return;

    const item = state.inventory[index];
    const skin = skinCatalog[item.skinId];
    if (!skin) return;

    const sellPrice = skin.value * 0.92;
    state.cash += sellPrice;
    state.inventory.splice(index, 1);
    state.soldSkins += 1;
    addHistory(`Sold ${skin.name} for ${formatMoney(sellPrice)}.`, 'good');
    saveState();
    renderAll();
    setRollMessage(`Sold ${skin.name} for ${formatMoney(sellPrice)}.`, 'log-good');
}

function sellAllSkins() {
    if (!state.inventory.length) return;

    const payout = state.inventory.reduce((sum, item) => {
        const skin = skinCatalog[item.skinId];
        return skin ? sum + skin.value * 0.92 : sum;
    }, 0);

    state.cash += payout;
    const count = state.inventory.length;
    state.soldSkins += count;
    state.inventory = [];
    addHistory(`Sold ${count} skins for ${formatMoney(payout)}.`, 'good');
    saveState();
    renderAll();
    setRollMessage(`Sold all skins for ${formatMoney(payout)}.`, 'log-good');
}

function setRollMessage(text, className) {
    if (!rollResultNode) return;
    rollResultNode.textContent = text;
    rollResultNode.classList.remove('log-good', 'log-bad');
    if (className) {
        rollResultNode.classList.add(className);
    }
}

function renderRollStrip(items) {
    if (!rollTrackNode) return;

    rollTrackNode.style.transition = 'none';
    rollTrackNode.style.transform = 'translateX(0px)';
    rollTrackNode.innerHTML = items.map((skin) => {
        return `
            <article class="roll-item">
                ${safeImg(skin.image, skin.name, '')}
                <p>${skin.name}</p>
            </article>
        `;
    }).join('');
}

function spinToWinner(winner, poolSkins) {
    const spinItems = [];
    const totalItems = 42;
    const winnerIndex = 33;

    for (let i = 0; i < totalItems; i += 1) {
        const randomSkin = poolSkins[Math.floor(Math.random() * poolSkins.length)];
        spinItems.push(randomSkin);
    }

    spinItems[winnerIndex] = winner;
    renderRollStrip(spinItems);

    const itemWidth = 118;
    const gap = 12;
    const step = itemWidth + gap;
    const centerOffset = (rollWindowNode ? rollWindowNode.clientWidth : 720) / 2 - itemWidth / 2;
    const targetX = -(winnerIndex * step) + centerOffset;

    requestAnimationFrame(() => {
        if (!rollTrackNode) return;
        rollTrackNode.style.transition = 'transform 4.4s cubic-bezier(0.08, 0.75, 0.13, 1)';
        rollTrackNode.style.transform = `translateX(${targetX}px)`;
    });

    return new Promise((resolve) => {
        window.setTimeout(() => resolve(), 4500);
    });
}

async function openCase(caseDef) {
    if (isRolling) return;

    if (state.cash < caseDef.price) {
        setRollMessage('You need more cash for this case.', 'log-bad');
        return;
    }

    isRolling = true;
    state.cash -= caseDef.price;
    addHistory(`Opened ${caseDef.name} for ${formatMoney(caseDef.price)}.`, 'info');
    saveState();
    renderAll();

    const casePool = caseDef.loot.map((entry) => skinCatalog[entry.skinId]).filter(Boolean);
    const winner = chooseWeightedSkin(caseDef.loot);

    setRollMessage(`Opening ${caseDef.name}...`, '');
    await spinToWinner(winner, casePool);

    addSkinToInventory(winner.id, caseDef.id);
    state.openedCases += 1;
    addHistory(`Unboxed ${winner.name} worth ${formatMoney(winner.value)}.`, 'good');

    isRolling = false;
    saveState();
    renderAll();
    setRollMessage(`You unboxed ${winner.name} (${formatMoney(winner.value)}).`, 'log-good');
}

if (sellAllButton) {
    sellAllButton.addEventListener('click', sellAllSkins);
}
