import { useEffect, useRef, useState } from 'react'
import { useStore, classifySession } from '../store/useStore.js'
import { UNITS } from '../data/units.js'

// 每分鐘掃描一次 sessions，在預定時間前 5 分鐘 / 時間到時送瀏覽器通知
export default function ReminderWatcher() {
  const sessions = useStore((s) => s.sessions)
  const notified = useRef({})
  const [perm, setPerm] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'denied')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      sessions.forEach((s) => {
        if (classifySession(s) !== 'pending') return
        const dt = new Date(`${s.date}T${s.time}:00`)
        const diff = dt.getTime() - now.getTime()
        const unit = UNITS[s.grade]?.find((u) => u.id === s.unitId)
        const key5 = `${s.id}-5`
        const key0 = `${s.id}-0`
        if (diff > 0 && diff <= 5 * 60 * 1000 && !notified.current[key5]) {
          notify('再 5 分鐘！', `${unit?.name || '練習'} 即將開始`)
          notified.current[key5] = true
        }
        if (diff <= 0 && diff > -60 * 1000 && !notified.current[key0]) {
          notify('時間到 ⏰', `${unit?.name || '練習'} 開始囉～`)
          notified.current[key0] = true
        }
      })
    }
    tick()
    const id = setInterval(tick, 60 * 1000)
    return () => clearInterval(id)
  }, [sessions])

  if (perm === 'granted' || typeof Notification === 'undefined') return null

  return (
    <button
      className="mx-4 mt-2 mb-1 w-[calc(100%-2rem)] flex items-center gap-2 rounded-2xl bg-accent/15 border border-accent/40 text-ink px-3 py-2"
      onClick={async () => {
        const r = await Notification.requestPermission()
        setPerm(r)
      }}
    >
      <span className="text-lg">🔔</span>
      <span className="text-sm">開啟練習提醒通知，星靈才不會餓著～</span>
      <span className="ml-auto text-xs text-primary font-bold">開啟</span>
    </button>
  )
}

function notify(title, body) {
  try {
    if (typeof Notification === 'undefined') return
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/icon.png' })
    }
  } catch (_) {
    // 忽略瀏覽器限制
  }
}
