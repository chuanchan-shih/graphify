import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GRADES, UNITS } from '../data/units.js'
import { useStore } from '../store/useStore.js'

const DURATIONS = [15, 30, 45, 60]

export default function AddSessionModal({ date, onClose }) {
  const addSession = useStore((s) => s.addSession)
  const [grade, setGrade] = useState('小三')
  const [unitId, setUnitId] = useState(UNITS['小三'][0].id)
  const [time, setTime] = useState('16:00')
  const [duration, setDuration] = useState(30)
  const [repeat, setRepeat] = useState('once')

  const submit = () => {
    addSession({ date, grade, unitId, time, duration, repeat })
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full sm:max-w-md bg-cream rounded-t-3xl sm:rounded-3xl p-5 shadow-soft"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="font-display text-xl mb-3">新增練習｜{date}</h3>

          <label className="block text-sm font-bold mb-1 mt-3">年級</label>
          <div className="flex flex-wrap gap-2">
            {GRADES.map((g) => (
              <button
                key={g}
                onClick={() => {
                  setGrade(g)
                  setUnitId(UNITS[g][0].id)
                }}
                className={
                  'chip ' + (grade === g ? 'bg-primary text-white' : '')
                }
              >
                {g}
              </button>
            ))}
          </div>

          <label className="block text-sm font-bold mb-1 mt-3">單元</label>
          <select
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
            className="w-full rounded-xl border border-ink/10 bg-white p-2"
          >
            {UNITS[grade].map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <div className="flex gap-3 mt-3">
            <div className="flex-1">
              <label className="block text-sm font-bold mb-1">時間</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-ink/10 bg-white p-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold mb-1">時長</label>
              <div className="flex gap-1.5">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={
                      'flex-1 rounded-xl py-2 text-sm border ' +
                      (duration === d
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white border-ink/10')
                    }
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <label className="block text-sm font-bold mb-1 mt-3">重複</label>
          <div className="flex gap-2">
            {[
              { v: 'once', t: '僅此一次' },
              { v: 'daily', t: '每天' },
              { v: 'weekly', t: '每週同日' },
            ].map((o) => (
              <button
                key={o.v}
                onClick={() => setRepeat(o.v)}
                className={
                  'chip ' + (repeat === o.v ? 'bg-primary text-white' : '')
                }
              >
                {o.t}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mt-5">
            <button className="btn-ghost flex-1" onClick={onClose}>
              取消
            </button>
            <button className="btn-primary flex-1" onClick={submit}>
              確認加入
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
