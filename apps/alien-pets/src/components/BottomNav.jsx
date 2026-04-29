import { useStore } from '../store/useStore.js'

const TABS = [
  { id: 'calendar', icon: '📅', label: '日曆' },
  { id: 'pet', icon: '🐾', label: '我的星靈' },
  { id: 'treasure', icon: '🗺️', label: '尋寶' },
]

export default function BottomNav({ tab, onChange }) {
  const activePetId = useStore((s) => s.activePetId)
  const unlocked = useStore((s) => s.isTreasureUnlocked(activePetId))
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 bg-white/90 backdrop-blur border-t border-ink/5 pb-[env(safe-area-inset-bottom)]"
      role="tablist"
    >
      <div className="grid grid-cols-3 max-w-md mx-auto">
        {TABS.map((t) => {
          const locked = t.id === 'treasure' && !unlocked
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={
                'flex flex-col items-center justify-center py-2.5 transition ' +
                (active ? 'text-primary' : 'text-ink/60 hover:text-ink')
              }
            >
              <span className="text-2xl relative">
                {t.icon}
                {locked && (
                  <span className="absolute -top-1 -right-2 text-xs">🔒</span>
                )}
              </span>
              <span className="text-[11px] font-bold mt-0.5">{t.label}</span>
              {active && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
