import { useMemo, useState } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns'
import { useStore, classifySession } from '../store/useStore.js'
import AddSessionModal from './AddSessionModal.jsx'
import PracticeModal from './PracticeModal.jsx'
import { UNITS } from '../data/units.js'

function dayClass(state, isToday, inMonth) {
  const base = 'relative w-full aspect-square rounded-2xl flex items-center justify-center text-sm transition'
  let bg = 'bg-white/60 hover:bg-white text-ink'
  if (!inMonth) bg = 'bg-transparent text-muted/60'
  if (state === 'done') bg = 'bg-success text-white shadow-soft'
  if (state === 'pending') bg = 'bg-white text-ink ring-2 ring-accent/60'
  if (state === 'missed') bg = 'bg-warn/15 text-warn ring-1 ring-warn/30'
  const today = isToday ? 'ring-2 ring-primary' : ''
  return `${base} ${bg} ${today}`
}

export default function CalendarView() {
  const sessions = useStore((s) => s.sessions)
  const [cursor, setCursor] = useState(new Date())
  const [selected, setSelected] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [openAdd, setOpenAdd] = useState(false)
  const [practiceId, setPracticeId] = useState(null)

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 })
    const arr = []
    let d = start
    while (d <= end) {
      arr.push(d)
      d = addDays(d, 1)
    }
    return arr
  }, [cursor])

  const sessionsByDate = useMemo(() => {
    const map = {}
    for (const s of sessions) {
      ;(map[s.date] ||= []).push(s)
    }
    return map
  }, [sessions])

  const dayState = (dateStr) => {
    const list = sessionsByDate[dateStr] || []
    if (!list.length) return null
    const states = list.map(classifySession)
    if (states.every((x) => x === 'done')) return 'done'
    if (states.some((x) => x === 'missed')) return 'missed'
    return 'pending'
  }

  const today = new Date()
  const selectedSessions = sessionsByDate[selected] || []

  return (
    <div className="px-4 pb-32 pt-4">
      <div className="flex items-center justify-between mb-3">
        <button className="btn-ghost px-3 py-2" onClick={() => setCursor(subMonths(cursor, 1))}>
          ‹
        </button>
        <h2 className="font-display text-xl">{format(cursor, 'yyyy 年 M 月')}</h2>
        <button className="btn-ghost px-3 py-2" onClick={() => setCursor(addMonths(cursor, 1))}>
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted mb-1">
        {['日', '一', '二', '三', '四', '五', '六'].map((w) => (
          <div key={w} className="py-1">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const dateStr = format(d, 'yyyy-MM-dd')
          const inMonth = isSameMonth(d, cursor)
          const state = dayState(dateStr)
          const isToday = isSameDay(d, today)
          const selectedFlag = dateStr === selected
          return (
            <button
              key={dateStr}
              onClick={() => setSelected(dateStr)}
              className={
                dayClass(state, isToday, inMonth) +
                (selectedFlag ? ' ring-2 ring-primary scale-[1.03]' : '')
              }
            >
              <span className="font-display">{format(d, 'd')}</span>
              {state && (
                <span
                  className={
                    'absolute bottom-1.5 w-1.5 h-1.5 rounded-full ' +
                    (state === 'done'
                      ? 'bg-white'
                      : state === 'pending'
                        ? 'bg-accent'
                        : 'bg-warn')
                  }
                />
              )}
            </button>
          )
        })}
      </div>

      {/* 該天清單 */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-lg">{format(parseISO(selected), 'M 月 d 日')}</h3>
          <button className="btn-primary px-3 py-1.5 text-sm" onClick={() => setOpenAdd(true)}>
            ＋ 新增練習
          </button>
        </div>

        {selectedSessions.length === 0 ? (
          <div className="card text-center text-muted">
            這天還沒有練習～點右上角新增一個吧！
          </div>
        ) : (
          <ul className="space-y-2">
            {selectedSessions.map((s) => {
              const state = classifySession(s)
              const unit = UNITS[s.grade]?.find((u) => u.id === s.unitId)
              return (
                <li key={s.id} className="card flex items-center gap-3">
                  <div
                    className={
                      'w-10 h-10 rounded-xl flex items-center justify-center font-display text-white ' +
                      (state === 'done'
                        ? 'bg-success'
                        : state === 'missed'
                          ? 'bg-warn'
                          : 'bg-accent')
                    }
                  >
                    {state === 'done' ? '✓' : state === 'missed' ? '!' : '⏰'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate">{unit?.name || '練習'}</div>
                    <div className="text-xs text-muted">
                      {s.grade} · {s.time} · {s.duration} 分鐘
                      {s.isMakeup ? '（補做）' : ''}
                    </div>
                  </div>
                  {state !== 'done' && (
                    <button
                      className="btn-primary px-3 py-1.5 text-sm"
                      onClick={() => setPracticeId(s.id)}
                    >
                      開始
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {openAdd && <AddSessionModal date={selected} onClose={() => setOpenAdd(false)} />}
      {practiceId && (
        <PracticeModal
          sessionId={practiceId}
          onClose={() => setPracticeId(null)}
        />
      )}
    </div>
  )
}
