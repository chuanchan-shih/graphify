import { useState } from 'react'
import TopBar from './components/TopBar.jsx'
import BottomNav from './components/BottomNav.jsx'
import CalendarView from './components/CalendarView.jsx'
import PetView from './components/PetView.jsx'
import TreasureView from './components/TreasureView.jsx'
import MakeupBanner from './components/MakeupBanner.jsx'
import ReminderWatcher from './components/ReminderWatcher.jsx'

export default function App() {
  const [tab, setTab] = useState('pet')

  return (
    <div className="min-h-full max-w-md mx-auto relative">
      <TopBar />
      <ReminderWatcher />
      <MakeupBanner />

      {tab === 'calendar' && <CalendarView />}
      {tab === 'pet' && <PetView />}
      {tab === 'treasure' && <TreasureView />}

      <BottomNav tab={tab} onChange={setTab} />
    </div>
  )
}
