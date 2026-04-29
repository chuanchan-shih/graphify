import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore.js'
import { questionsForUnit, UNITS } from '../data/units.js'
import PetSVG from './PetSVG.jsx'
import { PETS_BY_ID } from '../data/pets.js'

export default function PracticeModal({ sessionId, onClose }) {
  const session = useStore((s) => s.sessions.find((x) => x.id === sessionId))
  const completeSession = useStore((s) => s.completeSession)
  const makeupSession = useStore((s) => s.makeupSession)
  const activePetId = useStore((s) => s.activePetId)
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [picked, setPicked] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [done, setDone] = useState(false)

  const pet = PETS_BY_ID[activePetId]
  const questions = useMemo(
    () => (session ? questionsForUnit(session.unitId) : []),
    [session]
  )
  const unit = session ? UNITS[session.grade]?.find((u) => u.id === session.unitId) : null

  if (!session) return null
  const q = questions[idx]
  const totalCount = questions.length || 1

  const choose = (i) => {
    if (showFeedback) return
    setPicked(i)
    setShowFeedback(true)
    const correct = i === q.answer
    setAnswers((a) => [...a, correct])
  }

  const next = () => {
    setShowFeedback(false)
    setPicked(null)
    if (idx + 1 < totalCount) {
      setIdx(idx + 1)
    } else {
      const accuracy = Math.round(
        (answers.filter(Boolean).length / Math.max(totalCount, 1)) * 100
      )
      // session.status 為 pending 用 complete；missed 用 makeup
      const isPast = new Date(`${session.date}T${session.time}:00`) < new Date()
      if (isPast && session.status !== 'completed') {
        makeupSession(session.id, accuracy)
      } else {
        completeSession(session.id, accuracy)
      }
      setDone(true)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-md bg-cream m-3 rounded-3xl p-5 shadow-soft"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {!done ? (
            <>
              <div className="flex items-center justify-between text-xs text-muted mb-2">
                <div>{unit?.name}</div>
                <div>
                  {idx + 1} / {totalCount}
                </div>
              </div>
              <div className="h-1.5 bg-white rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${((idx + (showFeedback ? 1 : 0)) / totalCount) * 100}%` }}
                />
              </div>

              <div className="flex gap-3 items-center mb-3">
                <PetSVG petId={activePetId} size={70} bobbing={false} emotion="idle" />
                <div className="font-display text-lg leading-tight">{q.q}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                {q.options.map((o, i) => {
                  const isCorrect = i === q.answer
                  const isPicked = picked === i
                  let cls =
                    'rounded-2xl p-3 text-base font-bold border bg-white border-ink/10 active:scale-95 transition'
                  if (showFeedback && isCorrect) cls += ' bg-success/15 border-success'
                  if (showFeedback && isPicked && !isCorrect)
                    cls += ' bg-warn/15 border-warn'
                  return (
                    <button key={i} className={cls} onClick={() => choose(i)}>
                      {o}
                    </button>
                  )
                })}
              </div>

              {showFeedback && (
                <div className="text-center mb-3">
                  <div className="font-display text-lg">
                    {picked === q.answer ? `✨ ${pet.name}：${pet.catchphrase}` : '再試試看～'}
                  </div>
                  <button className="btn-primary mt-2 px-6" onClick={next}>
                    {idx + 1 < totalCount ? '下一題' : '完成練習'}
                  </button>
                </div>
              )}

              <button className="text-xs text-muted underline w-full" onClick={onClose}>
                先離開
              </button>
            </>
          ) : (
            <Result
              answers={answers}
              pet={pet}
              isMakeup={session.status === 'makeup' || (session.isMakeup ?? false)}
              onClose={onClose}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function Result({ answers, pet, isMakeup, onClose }) {
  const correct = answers.filter(Boolean).length
  const total = answers.length
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 12 }}
        className="mx-auto"
      >
        <PetSVG petId={pet.id} size={180} emotion="happy" bobbing />
      </motion.div>
      <div className="font-display text-2xl mt-2">+1 飼料 🍖</div>
      <div className="text-muted text-sm mb-3">
        正確 {correct} / {total}　{isMakeup ? '（補做完成）' : ''}
      </div>
      <div className="card text-sm text-left mb-3">
        <div className="font-bold mb-1">{pet.name} 說：</div>
        <div>「{pet.catchphrase}」謝謝你！{pet.foodEmoji} {pet.food} 好好吃～</div>
      </div>
      <button className="btn-primary px-6" onClick={onClose}>
        回去找 {pet.name}
      </button>
    </div>
  )
}
