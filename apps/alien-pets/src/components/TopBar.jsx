import { motion } from 'framer-motion'
import { useStore } from '../store/useStore.js'

export default function TopBar() {
  const foodCount = useStore((s) => s.foodCount)
  const streak = useStore((s) => s.streakDays)
  return (
    <div className="px-4 pt-3 pb-1 flex items-center gap-2">
      <div className="font-display text-base flex-1 truncate">
        🌱 外來寵物 英語學院
      </div>
      <motion.div
        key={foodCount}
        initial={{ scale: 1.4 }}
        animate={{ scale: 1 }}
        className="chip"
      >
        🍖 <span className="font-display">{foodCount}</span>
      </motion.div>
      <div className="chip" title="連勝天數">
        🔥 <span className="font-display">{streak}</span>
      </div>
    </div>
  )
}
