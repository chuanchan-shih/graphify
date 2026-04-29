import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore.js'
import PetSVG from './PetSVG.jsx'
import { PETS_BY_ID } from '../data/pets.js'
import { rollAccessory, RARITY, ACCESSORIES_BY_ID } from '../data/accessories.js'

const PHASES = {
  idle: 'idle',
  searching: 'searching',
  reveal: 'reveal',
}

export default function TreasureView() {
  const activePetId = useStore((s) => s.activePetId)
  const pets = useStore((s) => s.pets)
  const grantAccessory = useStore((s) => s.grantAccessory)
  const treasureLog = useStore((s) => s.treasureLog)
  const isTreasureUnlocked = useStore((s) => s.isTreasureUnlocked(activePetId))
  const pet = PETS_BY_ID[activePetId]
  const petState = pets[activePetId]

  const [phase, setPhase] = useState(PHASES.idle)
  const [reward, setReward] = useState(null)
  const [duplicate, setDuplicate] = useState(false)

  if (!isTreasureUnlocked) {
    return (
      <div className="px-4 pt-6 pb-32 text-center">
        <div className="text-5xl mb-2">🔒</div>
        <h2 className="font-display text-2xl">尋寶尚未解鎖</h2>
        <p className="text-muted mt-2">
          {pet.name} 跟你的親密度需達到 Lv.5（滿 20 點）才能一起去探索台灣。
        </p>
        <div className="card mt-4 inline-block">
          目前親密度：{petState.affection} / 20
        </div>
        <p className="text-xs text-muted mt-4">
          小提示：完成練習 → 餵 {pet.name} → 親密度上升
        </p>
      </div>
    )
  }

  const dispatch = () => {
    setPhase(PHASES.searching)
    setTimeout(() => {
      const acc = rollAccessory()
      const dup = petState.ownedAccessories.includes(acc.id)
      setReward(acc)
      setDuplicate(dup)
      grantAccessory(activePetId, acc.id)
      setPhase(PHASES.reveal)
    }, 2500)
  }

  const reset = () => {
    setReward(null)
    setDuplicate(false)
    setPhase(PHASES.idle)
  }

  return (
    <div className="px-4 pt-4 pb-32">
      <div className="card relative overflow-hidden">
        <div className="text-center">
          <h2 className="font-display text-2xl">尋寶 · 派遣 {pet.name}</h2>
          <p className="text-sm text-muted">在台灣各個熟悉的地方尋找飾品</p>
        </div>

        <div className="my-4 h-56 relative flex items-end justify-center">
          <AnimatePresence mode="wait">
            {phase === PHASES.idle && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <PetSVG petId={activePetId} size={180} bobbing />
              </motion.div>
            )}
            {phase === PHASES.searching && (
              <motion.div
                key="searching"
                initial={{ x: -180 }}
                animate={{ x: 180 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.5, ease: 'easeInOut' }}
                className="absolute"
              >
                <PetSVG petId={activePetId} size={140} bobbing />
                <div className="text-center text-xs mt-1">🎒 出發中…</div>
              </motion.div>
            )}
            {phase === PHASES.reveal && reward && (
              <motion.div
                key="reveal"
                initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 12 }}
                className="text-center"
              >
                <div
                  className={
                    'inline-flex flex-col items-center justify-center w-40 h-40 rounded-full bg-white ' +
                    RARITY[reward.rarity].glow
                  }
                >
                  <div className="text-6xl">{reward.emoji}</div>
                </div>
                <div className="font-display text-xl mt-2">{reward.name}</div>
                <div
                  className="text-sm font-bold"
                  style={{ color: RARITY[reward.rarity].color }}
                >
                  {RARITY[reward.rarity].label}
                </div>
                <div className="text-xs text-muted mt-1">{reward.location}</div>
                <div className="text-xs text-muted italic mt-1 max-w-xs">
                  💡 {reward.fact}
                </div>
                {duplicate && (
                  <div className="text-xs text-warn mt-1">已擁有，但 {pet.name} 仍很開心！</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-center">
          {phase === PHASES.idle && (
            <button className="btn-primary px-8 py-3" onClick={dispatch}>
              🚀 派遣 {pet.name} 去尋寶
            </button>
          )}
          {phase === PHASES.searching && (
            <div className="text-muted text-sm">{pet.name} 正在尋找寶箱…</div>
          )}
          {phase === PHASES.reveal && (
            <button className="btn-primary px-8 py-3" onClick={reset}>
              再派遣一次
            </button>
          )}
        </div>
      </div>

      <Collection ownedIds={petState.ownedAccessories} />

      {treasureLog.length > 0 && (
        <div className="card mt-4">
          <h3 className="font-display text-lg mb-2">尋寶紀錄</h3>
          <ul className="text-sm text-muted space-y-1">
            {treasureLog.slice(0, 6).map((log, i) => {
              const acc = ACCESSORIES_BY_ID[log.accessoryId]
              return (
                <li key={i}>
                  {acc?.emoji} {acc?.name}
                  {log.duplicate ? '（重複）' : ''}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

function Collection({ ownedIds }) {
  const allIds = Object.keys(ACCESSORIES_BY_ID)
  return (
    <div className="card mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-lg">飾品收藏</h3>
        <span className="text-sm text-muted">
          {ownedIds.length} / {allIds.length}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {allIds.map((id) => {
          const acc = ACCESSORIES_BY_ID[id]
          const owned = ownedIds.includes(id)
          const r = RARITY[acc.rarity]
          return (
            <div
              key={id}
              className={
                'aspect-square rounded-2xl flex items-center justify-center text-3xl border ' +
                (owned ? 'bg-white border-ink/10 ' + r.glow : 'bg-ink/5 border-transparent')
              }
              title={acc.name + ' · ' + r.label}
            >
              <span className={owned ? '' : 'opacity-20 grayscale'}>{acc.emoji}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
