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
const rollWindowNode = document.getElementById('roll-window');
const rollTrackNode = document.getElementById('roll-track');
const rollResultNode = document.getElementById('roll-result');
const sellAllButton = document.getElementById('sell-all-btn');

const SAVE_COOKIE = 'caseRushSaveV1';
const SAVE_DAYS = 365;
const INCOME_AMOUNT = 70;
const INCOME_INTERVAL_MS = 90 * 1000;

const skins = {
    asiimov: {
        id: 'asiimov',
        name: 'AK-47 | Asiimov',
        rarity: 'covert',
        value: 120.0,
        image: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/images/ak-47-asiimov.png'
    },
    redline: {
        id: 'redline',
        name: 'AK-47 | Redline',
        rarity: 'classified',
        value: 38.5,
        image: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/images/ak-47-redline.png'
    },
    frontside: {
        id: 'frontside',
        name: 'AK-47 | Frontside Misty',
        rarity: 'restricted',
        value: 23.1,
        image: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/images/ak-47-frontside-misty.png'
    },
    elitebuild: {
        id: 'elitebuild',
        name: 'AK-47 | Elite Build',
        rarity: 'mil-spec',
        value: 7.2,
        image: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/images/ak-47-elite-build.png'
    },
    vulcan: {
        id: 'vulcan',
        name: 'AK-47 | Vulcan',
        rarity: 'covert',
        value: 210.0,
        image: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/images/ak-47-vulcan.png'
    },
    hyperbeast: {
        id: 'hyperbeast',
        name: 'M4A1-S | Hyper Beast',
        rarity: 'classified',
        value: 58.9,
        image: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/images/m4a1-s-hyper-beast.png'
    },
    nightmare: {
        id: 'nightmare',
        name: 'M4A1-S | Nightmare',
        rarity: 'restricted',
        value: 16.3,
        image: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/images/m4a1-s-nightmare.png'
    },
    decimator: {
        id: 'decimator',
        name: 'M4A4 | The Emperor',
        rarity: 'classified',
        value: 34.8,
        image: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/images/m4a4-the-emperor.png'
    },
    dragonlore: {
        id: 'dragonlore',
        name: 'AWP | Dragon Lore',
        rarity: 'covert',
        value: 1800.0,
        image: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/images/awp-dragon-lore.png'
    },
    asiimovawp: {
        id: 'asiimovawp',
        name: 'AWP | Asiimov',
        rarity: 'covert',
        value: 140.0,
        image: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/images/awp-asiimov.png'
    },
    atheris: {
        id: 'atheris',
        name: 'AWP | Atheris',
        rarity: 'restricted',
        value: 12.7,
        image: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/images/awp-atheris.png'
    },
    deagleblaze: {
        id: 'deagleblaze',
        name: 'Desert Eagle | Blaze',
        rarity: 'covert',
        value: 520.0,
        image: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/images/desert-eagle-blaze.png'
    },
    glockfade: {
        id: 'glockfade',
        name: 'Glock-18 | Fade',
        rarity: 'covert',
        value: 480.0,
        image: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/images/glock-18-fade.png'
    },
    uspprintstream: {
        id: 'uspprintstream',
        name: 'USP-S | Printstream',
        rarity: 'classified',
        value: 65.0,
        image: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/images/usp-s-printstream.png'
    },
    p250asiimov: {
        id: 'p250asiimov',
        name: 'P250 | Asiimov',
        rarity: 'restricted',
        value: 10.5,
        image: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/images/p250-asiimov.png'
    },
    fivezeblue: {
        id: 'fivezeblue',
        name: 'Five-SeveN | Case Hardened',
        rarity: 'classified',
        value: 42.4,
        image: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/images/five-seven-case-hardened.png'
    },
    mp9starlight: {
        id: 'mp9starlight',
        name: 'MP9 | Starlight Protector',
        rarity: 'classified',
        value: 68.2,
        image: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/images/mp9-starlight-protector.png'
    },
    mac10neon: {
        id: 'mac10neon',
        name: 'MAC-10 | Neon Rider',
        rarity: 'classified',
        value: 24.2,
        image: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/images/mac-10-neon-rider.png'
    },
    famasrollcage: {
        id: 'famasrollcage',
        name: 'FAMAS | Roll Cage',
        rarity: 'classified',
        value: 14.9,
        image: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/images/famas-roll-cage.png'
    },
    galilchatter: {
        id: 'galilchatter',
        name: 'Galil AR | Chatterbox',
        rarity: 'classified',
        value: 19.1,
        image: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/images/galil-ar-chatterbox.png'
    }
};

const cases = [
    {
        id: 'alpha-case',
        name: 'Alpha Strike Case',
        price: 60,
        loot: [
            { skinId: 'elitebuild', weight: 24 },
            { skinId: 'p250asiimov', weight: 20 },
            { skinId: 'frontside', weight: 16 },
            { skinId: 'nightmare', weight: 14 },
            { skinId: 'redline', weight: 10 },
            { skinId: 'hyperbeast', weight: 8 },
            { skinId: 'mp9starlight', weight: 4 },
            { skinId: 'asiimovawp', weight: 3 },
            { skinId: 'deagleblaze', weight: 1 }
        ]
    },
    {
        id: 'sniper-case',
        name: 'Longshot Vault Case',
        price: 105,
        loot: [
            { skinId: 'atheris', weight: 23 },
            { skinId: 'famasrollcage', weight: 20 },
            { skinId: 'fivezeblue', weight: 14 },
            { skinId: 'uspprintstream', weight: 12 },
            { skinId: 'asiimovawp', weight: 11 },
            { skinId: 'mac10neon', weight: 9 },
            { skinId: 'glockfade', weight: 6 },
            { skinId: 'vulcan', weight: 4 },
            { skinId: 'dragonlore', weight: 1 }
        ]
    },
    {
        id: 'elite-case',
        name: 'Blacksite Elite Case',
        price: 175,
        loot: [
            { skinId: 'galilchatter', weight: 20 },
            { skinId: 'frontside', weight: 17 },
            { skinId: 'redline', weight: 14 },
            { skinId: 'uspprintstream', weight: 12 },
            { skinId: 'asiimov', weight: 9 },
            { skinId: 'vulcan', weight: 8 },
            { skinId: 'deagleblaze', weight: 7 },
            { skinId: 'glockfade', weight: 7 },
            { skinId: 'dragonlore', weight: 1 }
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
    cash: 650,
    inventory: [],
    openedCases: 0,
    soldSkins: 0,
    nextId: 1,
    lastIncomeAt: Date.now()
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

applyPassiveIncome();
renderAll();
setInterval(tickIncomeCountdown, 1000);

function formatMoney(value) {
    return `$${value.toFixed(2)}`;
}

function clampInventorySize() {
    if (state.inventory.length > 80) {
        state.inventory = state.inventory.slice(-80);
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
            lastIncomeAt: Number(parsed.lastIncomeAt) || Date.now()
        };
    } catch (error) {
        return { ...defaultState };
    }
}

function applyPassiveIncome() {
    const now = Date.now();
    const elapsed = now - state.lastIncomeAt;
    const ticks = Math.floor(elapsed / INCOME_INTERVAL_MS);

    if (ticks > 0) {
        state.cash += ticks * INCOME_AMOUNT;
        state.lastIncomeAt += ticks * INCOME_INTERVAL_MS;
        setRollMessage(`Passive payout received: ${formatMoney(ticks * INCOME_AMOUNT)}.`, 'log-good');
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
        saveState();
        renderStats();
        setRollMessage(`Income drop collected: ${formatMoney(INCOME_AMOUNT)}.`, 'log-good');
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
            return skins[option.skinId];
        }
    }

    return skins[lootTable[lootTable.length - 1].skinId];
}

function rarityBadgeClass(rarity) {
    return rarity.toLowerCase().replace(/\s+/g, '-');
}

function cardImageMarkup(skin, className) {
    const safeName = skin.name.replace(/"/g, '&quot;');
    return `<img class="${className}" src="${skin.image}" alt="${safeName}" loading="lazy" onerror="this.onerror=null;this.src='https://dummyimage.com/600x340/132335/9bbbd1.png&text=${encodeURIComponent(skin.name)}';">`;
}

function renderStats() {
    if (cashValue) {
        cashValue.textContent = formatMoney(state.cash);
    }
    if (openedValueNode) {
        openedValueNode.textContent = String(state.openedCases);
    }

    const inventoryValue = state.inventory.reduce((sum, item) => {
        const skin = skins[item.skinId];
        return skin ? sum + skin.value : sum;
    }, 0);

    if (inventoryValueNode) {
        inventoryValueNode.textContent = formatMoney(inventoryValue);
    }
}

function renderCases() {
    if (!caseListNode) return;

    caseListNode.innerHTML = cases.map((caseDef) => {
        const canAfford = state.cash >= caseDef.price;
        return `
            <article class="case-card">
                <h3>${caseDef.name}</h3>
                <div class="case-meta">
                    <span>Price: <strong>${formatMoney(caseDef.price)}</strong></span>
                    <button class="btn" data-open-case="${caseDef.id}" ${!canAfford || isRolling ? 'disabled' : ''}>Open Case</button>
                </div>
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
        const skin = skins[skinId];
        const buyPrice = skin.value * 1.14;
        return `
            <article class="skin-row">
                ${cardImageMarkup(skin, 'skin-thumb')}
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
        inventoryListNode.innerHTML = '<p class="empty-note">No skins yet. Open a case or buy from market.</p>';
        if (sellAllButton) sellAllButton.disabled = true;
        return;
    }

    if (sellAllButton) sellAllButton.disabled = false;

    inventoryListNode.innerHTML = state.inventory.slice().reverse().map((item) => {
        const skin = skins[item.skinId];
        if (!skin) return '';

        const sellPrice = skin.value * 0.92;

        return `
            <article class="inventory-card">
                ${cardImageMarkup(skin, 'skin-thumb')}
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

function renderAll() {
    renderStats();
    renderCases();
    renderMarket();
    renderInventory();
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
    const skin = skins[skinId];
    if (!skin || isRolling) return;

    const buyPrice = skin.value * 1.14;

    if (state.cash < buyPrice) {
        setRollMessage('Not enough cash for this market buy.', 'log-bad');
        return;
    }

    state.cash -= buyPrice;
    addSkinToInventory(skinId, 'market');
    saveState();
    renderAll();
    setRollMessage(`Bought ${skin.name} for ${formatMoney(buyPrice)}.`, 'log-good');
}

function sellSkin(uid) {
    const index = state.inventory.findIndex((item) => item.uid === uid);
    if (index < 0) return;

    const item = state.inventory[index];
    const skin = skins[item.skinId];
    if (!skin) return;

    const sellPrice = skin.value * 0.92;
    state.cash += sellPrice;
    state.inventory.splice(index, 1);
    state.soldSkins += 1;
    saveState();
    renderAll();
    setRollMessage(`Sold ${skin.name} for ${formatMoney(sellPrice)}.`, 'log-good');
}

function sellAllSkins() {
    if (!state.inventory.length) return;

    const payout = state.inventory.reduce((sum, item) => {
        const skin = skins[item.skinId];
        if (!skin) return sum;
        return sum + skin.value * 0.92;
    }, 0);

    state.cash += payout;
    state.soldSkins += state.inventory.length;
    state.inventory = [];
    saveState();
    renderAll();
    setRollMessage(`Sold entire inventory for ${formatMoney(payout)}.`, 'log-good');
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
                ${cardImageMarkup(skin, '')}
                <p>${skin.name}</p>
            </article>
        `;
    }).join('');
}

function spinToWinner(winner, poolSkins) {
    const spinItems = [];
    const totalItems = 38;
    const winnerIndex = 30;

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
        rollTrackNode.style.transition = 'transform 4.2s cubic-bezier(0.11, 0.78, 0.16, 1)';
        rollTrackNode.style.transform = `translateX(${targetX}px)`;
    });

    return new Promise((resolve) => {
        window.setTimeout(() => resolve(), 4300);
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
    saveState();
    renderAll();

    const casePool = caseDef.loot.map((entry) => skins[entry.skinId]).filter(Boolean);
    const winner = chooseWeightedSkin(caseDef.loot);

    setRollMessage(`Opening ${caseDef.name}...`, '');
    await spinToWinner(winner, casePool);

    addSkinToInventory(winner.id, caseDef.id);
    state.openedCases += 1;
    saveState();
    renderAll();

    isRolling = false;
    setRollMessage(`You unboxed ${winner.name} (${formatMoney(winner.value)}).`, 'log-good');
}

if (sellAllButton) {
    sellAllButton.addEventListener('click', sellAllSkins);
}
