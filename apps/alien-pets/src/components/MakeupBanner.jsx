import { useMemo, useState } from 'react'
import { useStore, classifySession } from '../store/useStore.js'
import PracticeModal from './PracticeModal.jsx'
import { UNITS } from '../data/units.js'

export default function MakeupBanner() {
  const sessions = useStore((s) => s.sessions)
  const [open, setOpen] = useState(false)
  const [practiceId, setPracticeId] = useState(null)

  const missed = useMemo(
    () => sessions.filter((s) => classifySession(s) === 'missed'),
    [sessions]
  )

  if (!missed.length) return null

  return (
    <>
      <button
        className="mx-4 mt-3 mb-1 w-[calc(100%-2rem)] flex items-center gap-2 rounded-2xl bg-warn/15 border border-warn/30 text-warn px-3 py-2"
        onClick={() => setOpen(true)}
      >
        <span className="text-lg">⚠️</span>
        <span className="text-sm font-bold">
          你有 {missed.length} 個練習還沒完成，補做一下？
        </span>
        <span className="ml-auto text-xs">查看 ›</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-end justify-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full sm:max-w-md bg-cream rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-xl">補做清單</h3>
              <button className="text-muted text-sm" onClick={() => setOpen(false)}>
                關閉
              </button>
            </div>
            <p className="text-xs text-muted mb-3">
              完成補做仍可獲得 +1 飼料；7 天後過期。
            </p>
            <ul className="space-y-2">
              {missed.map((s) => {
                const unit = UNITS[s.grade]?.find((u) => u.id === s.unitId)
                return (
                  <li key={s.id} className="card flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-warn text-white">
                      !
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate">{unit?.name}</div>
                      <div className="text-xs text-muted">
                        {s.date} · {s.grade} · {s.time}
                      </div>
                    </div>
                    <button
                      className="btn-primary px-3 py-1.5 text-sm"
                      onClick={() => {
                        setPracticeId(s.id)
                        setOpen(false)
                      }}
                    >
                      補做
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
      {practiceId && (
        <PracticeModal sessionId={practiceId} onClose={() => setPracticeId(null)} />
      )}
    </>
  )
}
