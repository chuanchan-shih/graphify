// 6 隻初始星靈 — 對應 GDD §4.1～4.3
export const PETS = [
  {
    id: 'fire',
    name: '炎仔',
    element: '🔥',
    elementName: '火',
    color: '#FF6B35',
    accent: '#FFB199',
    personality: '衝動・直接',
    food: '辣椒乾',
    foodEmoji: '🌶️',
    catchphrase: '讓我來！',
    evolveLevel: 15,
    evolved: { name: '炎虎', material: '火焰水晶', amount: 3 },
  },
  {
    id: 'water',
    name: '水泡泡',
    element: '💧',
    elementName: '水',
    color: '#4AB8D8',
    accent: '#BFE7F4',
    personality: '溫柔・愛哭',
    food: '小魚乾',
    foodEmoji: '🐟',
    catchphrase: '嗚嗚嗚…',
    evolveLevel: 15,
    evolved: { name: '泡泡魚', material: '深海珍珠', amount: 3 },
  },
  {
    id: 'grass',
    name: '草球',
    element: '🌿',
    elementName: '草',
    color: '#52C46A',
    accent: '#B6E5BE',
    personality: '熱心・過度',
    food: '果乾',
    foodEmoji: '🍇',
    catchphrase: '交給我！',
    evolveLevel: 15,
    evolved: { name: '藤蔓獸', material: '古老種子', amount: 3 },
  },
  {
    id: 'elec',
    name: '閃電鼠',
    element: '⚡',
    elementName: '電',
    color: '#FFD166',
    accent: '#FFE9A8',
    personality: '活潑・好動',
    food: '電池糖',
    foodEmoji: '🔋',
    catchphrase: '嗖！',
    evolveLevel: 15,
    evolved: { name: '雷電貂', material: '閃電核心', amount: 3 },
  },
  {
    id: 'light',
    name: '小光球',
    element: '✨',
    elementName: '光',
    color: '#FFC857',
    accent: '#FFF0A0',
    personality: '好奇・黏人',
    food: '星砂糖',
    foodEmoji: '🌟',
    catchphrase: '哇～',
    evolveLevel: 15,
    evolved: { name: '光翼精', material: '星塵粉末', amount: 3 },
  },
  {
    id: 'dark',
    name: '影子貓',
    element: '🌑',
    elementName: '暗',
    color: '#9B72CF',
    accent: '#D5C2EC',
    personality: '孤僻・試探',
    food: '黑巧克力',
    foodEmoji: '🍫',
    catchphrase: '…（轉頭）',
    evolveLevel: 20,
    evolved: { name: '暗影豹', material: '黑暗寶石', amount: 5 },
  },
]

export const PETS_BY_ID = Object.fromEntries(PETS.map((p) => [p.id, p]))

// 親密度等級表 — GDD §4.7
export const AFFECTION_TIERS = [
  { level: 1, title: '初次見面', min: 0, max: 4 },
  { level: 2, title: '有點熟悉', min: 5, max: 9 },
  { level: 3, title: '好朋友', min: 10, max: 14 },
  { level: 4, title: '親密夥伴', min: 15, max: 19 },
  { level: 5, title: '靈魂契約', min: 20, max: 999 },
]

export function affectionTier(value) {
  return AFFECTION_TIERS.find((t) => value >= t.min && value <= t.max) || AFFECTION_TIERS[0]
}

export function nextTierProgress(value) {
  const tier = affectionTier(value)
  if (tier.level === 5) return { ratio: 1, current: 20, target: 20 }
  const span = tier.max - tier.min + 1
  const inTier = Math.min(value - tier.min, span - 1)
  return { ratio: inTier / span, current: value, target: tier.max + 1 }
}
