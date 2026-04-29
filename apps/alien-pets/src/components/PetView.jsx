import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PetSVG from './PetSVG.jsx'
import { useStore } from '../store/useStore.js'
import { PETS, PETS_BY_ID, affectionTier, nextTierProgress } from '../data/pets.js'
import { ACCESSORIES_BY_ID, RARITY } from '../data/accessories.js'

const TIER_REWARD_TEXT = {
  1: '解鎖第一個飾品欄位',
  2: '星靈會對你微笑',
  3: '星靈主動跑向你',
  4: '解鎖第二個飾品欄位',
  5: '🗺️ 解鎖尋寶！可派出尋找飾品',
}

export default function PetView() {
  const activePetId = useStore((s) => s.activePetId)
  const setActivePet = useStore((s) => s.setActivePet)
  const pets = useStore((s) => s.pets)
  const foodCount = useStore((s) => s.foodCount)
  const feedPet = useStore((s) => s.feedPet)
  const playWith = useStore((s) => s.playWith)
  const toggleEquip = useStore((s) => s.toggleEquip)

  const pet = PETS_BY_ID[activePetId]
  const petState = pets[activePetId]
  const tier = affectionTier(petState.affection)
  const progress = nextTierProgress(petState.affection)

  const [emotion, setEmotion] = useState('idle')
  const [bubble, setBubble] = useState(null)
  const [particles, setParticles] = useState([])

  // 飢餓判斷：超過 4 小時沒餵
  useEffect(() => {
    const last = petState.lastFedAt ? new Date(petState.lastFedAt).getTime() : 0
    const hungry = Date.now() - last > 4 * 3600 * 1000
    if (hungry && emotion === 'idle') setEmotion('hungry')
  }, [petState.lastFedAt, emotion])

  const onFeed = () => {
    if (foodCount <= 0) {
      setBubble('我好餓！要先去完成英語練習換飼料喔～')
      setEmotion('sad')
      setTimeout(() => {
        setBubble(null)
        setEmotion('idle')
      }, 2200)
      return
    }
    feedPet(activePetId)
    setEmotion('happy')
    setBubble(`${pet.foodEmoji} ${pet.food} 好好吃！`)
    burst()
    setTimeout(() => {
      setEmotion('idle')
      setBubble(null)
    }, 1800)
  }

  const onPlay = () => {
    playWith(activePetId)
    setEmotion('happy')
    setBubble(`${pet.catchphrase}`)
    burst('hearts')
    setTimeout(() => {
      setEmotion('idle')
      setBubble(null)
    }, 1500)
  }

  const burst = (kind = 'food') => {
    const items = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: 50 + Math.random() * 50 - 25,
      y: -40 - Math.random() * 40,
      emoji: kind === 'hearts' ? '💖' : pet.foodEmoji,
    }))
    setParticles(items)
    setTimeout(() => setParticles([]), 1200)
  }

  const equipped = useMemo(
    () =>
      petState.equipped
        .map((id) => ACCESSORIES_BY_ID[id])
        .filter(Boolean),
    [petState.equipped]
  )

  return (
    <div className="px-4 pb-32 pt-4">
      {/* 星靈切換 */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {PETS.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePet(p.id)}
            className={
              'shrink-0 px-3 py-2 rounded-2xl font-display flex items-center gap-2 ' +
              (p.id === activePetId
                ? 'bg-primary text-white shadow-soft'
                : 'bg-white text-ink shadow-soft')
            }
          >
            <span className="text-xl">{p.element}</span>
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      {/* 主舞台 */}
      <div className="card mt-3 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${pet.accent}55, transparent 70%)`,
          }}
        />
        <div className="relative flex flex-col items-center pt-2">
          <AnimatePresence>
            {bubble && (
              <motion.div
                key={bubble}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl px-3 py-2 text-sm shadow-soft mb-1"
              >
                {bubble}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <PetSVG
              petId={activePetId}
              size={240}
              emotion={emotion}
              equippedAccessories={equipped}
              bobbing={emotion === 'idle' || emotion === 'hungry'}
            />
            {/* 粒子 */}
            <AnimatePresence>
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{ opacity: 0, x: p.x, y: p.y, scale: 1.2 }}
                  transition={{ duration: 1 }}
                  className="absolute left-1/2 top-1/2 text-2xl pointer-events-none"
                >
                  {p.emoji}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="font-display text-xl mt-1">{pet.name}</div>
          <div className="text-xs text-muted">
            {pet.elementName}屬性 · {pet.personality}
          </div>
        </div>

        {/* 親密度 */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <div className="font-bold">
              親密度 Lv.{tier.level} · {tier.title}
            </div>
            <div className="text-muted">
              {progress.current} / {progress.target}
            </div>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden mt-1">
            <motion.div
              animate={{ width: `${Math.round(progress.ratio * 100)}%` }}
              className="h-full bg-primary"
            />
          </div>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className={n <= tier.level ? 'text-primary' : 'text-ink/15'}>
                ★
              </span>
            ))}
            <span className="text-xs text-muted ml-2">{TIER_REWARD_TEXT[tier.level]}</span>
          </div>
        </div>

        {/* 互動按鈕 */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={onFeed} className="btn-primary py-3">
            🍖 餵食（用 1 飼料）
          </button>
          <button onClick={onPlay} className="btn-ghost py-3">
            🎾 玩耍
          </button>
        </div>
      </div>

      {/* 飾品穿戴 */}
      <Wardrobe
        owned={petState.ownedAccessories}
        equipped={petState.equipped}
        onToggle={(id) => toggleEquip(activePetId, id)}
        slots={Math.min(3, Math.max(1, tier.level - 1))}
      />
    </div>
  )
}

function Wardrobe({ owned, equipped, onToggle, slots }) {
  if (!owned.length) {
    return (
      <div className="card mt-4 text-center text-muted">
        還沒有飾品～親密度滿星後可以開始尋寶
      </div>
    )
  }
  return (
    <div className="card mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-lg">穿戴飾品</h3>
        <span className="text-xs text-muted">
          已穿 {equipped.length} / {slots}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {owned.map((id) => {
          const acc = ACCESSORIES_BY_ID[id]
          if (!acc) return null
          const on = equipped.includes(id)
          const r = RARITY[acc.rarity]
          return (
            <button
              key={id}
              onClick={() => onToggle(id)}
              className={
                'rounded-2xl px-3 py-2 flex items-center gap-2 border ' +
                (on
                  ? 'bg-primary/10 border-primary'
                  : 'bg-white border-ink/10') +
                ' ' +
                r.glow
              }
            >
              <span className="text-2xl">{acc.emoji}</span>
              <div className="text-left">
                <div className="text-sm font-bold">{acc.name}</div>
                <div className="text-[10px]" style={{ color: r.color }}>
                  {r.label} · {acc.location}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
