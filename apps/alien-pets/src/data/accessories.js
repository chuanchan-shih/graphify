// 飾品清單 — 對應企劃書第九章 9.3
export const RARITY = {
  common: { label: '普通', color: '#888888', glow: 'shadow-none' },
  rare: { label: '稀有', color: '#4AB8D8', glow: 'shadow-[0_0_18px_rgba(74,184,216,0.55)]' },
  epic: { label: '史詩', color: '#9B72CF', glow: 'shadow-[0_0_22px_rgba(155,114,207,0.6)]' },
  legendary: { label: '傳說', color: '#FFB454', glow: 'shadow-[0_0_28px_rgba(255,180,84,0.7)]' },
}

export const ACCESSORIES = [
  { id: 'lion_collar', emoji: '🦁', name: '獅子項圈', location: '動物園附近', rarity: 'rare', drop: 25, fact: 'The lion is the king of the jungle.' },
  { id: 'bow_clip', emoji: '🎀', name: '蝴蝶結髮夾', location: '寵物店附近', rarity: 'common', drop: 50, fact: 'Pets are friends, not toys.' },
  { id: 'maple_ring', emoji: '🍁', name: '楓葉戒指', location: '公園附近', rarity: 'epic', drop: 10, fact: 'Nature is the best playground.' },
  { id: 'book_bag', emoji: '📚', name: '書本背包', location: '學校附近', rarity: 'common', drop: 50, fact: 'Every day is a chance to learn.' },
  { id: 'shell_bracelet', emoji: '🐚', name: '貝殼手鍊', location: '海邊附近', rarity: 'legendary', drop: 3, fact: 'The ocean is full of mysteries.' },
  { id: 'lantern_earring', emoji: '🏮', name: '燈籠耳環', location: '廟口附近', rarity: 'epic', drop: 10, fact: 'Temples are places of peace.' },
  { id: 'taco_apron', emoji: '🌮', name: '夜市圍裙', location: '夜市附近', rarity: 'rare', drop: 20, fact: "Night markets are Taiwan's treasure." },
  { id: 'flower_crown', emoji: '🌸', name: '花圃頭飾', location: '花圃附近', rarity: 'common', drop: 55, fact: 'Flowers bloom with care.' },
  { id: 'train_cap', emoji: '🚂', name: '火車帽', location: '車站附近', rarity: 'rare', drop: 22, fact: 'Trains connect people and places.' },
  { id: 'mountain_cape', emoji: '🏔️', name: '山嵐披風', location: '山區附近', rarity: 'epic', drop: 8, fact: 'Mountains teach us to be patient.' },
  { id: 'fishing_rod', emoji: '🎣', name: '釣魚竿背飾', location: '漁港附近', rarity: 'rare', drop: 18, fact: 'Fishing requires calm and focus.' },
  { id: 'shrine_bell', emoji: '⛩️', name: '神社鈴鐺', location: '神社附近', rarity: 'legendary', drop: 2, fact: 'Old shrines hold ancient stories.' },
]

export const ACCESSORIES_BY_ID = Object.fromEntries(ACCESSORIES.map((a) => [a.id, a]))

// v0.1：抽飾品（先選地點主題，再依該地點 drop 機率決定是否獲得；若沒抽中，回傳該地點普通飾品 1 件）
export function rollAccessory() {
  const pool = ACCESSORIES.slice()
  // 加權抽：drop 數值愈大愈容易
  const totalWeight = pool.reduce((s, a) => s + a.drop, 0)
  let roll = Math.random() * totalWeight
  for (const a of pool) {
    if (roll < a.drop) return a
    roll -= a.drop
  }
  return pool[0]
}
