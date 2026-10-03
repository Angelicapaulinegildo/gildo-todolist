import { useState, useEffect } from 'react'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'
import Instructions from './components/Instructions'
import ProductivityTracker from './components/ProductivityTracker'
import ReminderPopup from './components/ReminderPopup'

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('gildo-tasks')
    return saved ? JSON.parse(saved) : []
  })
  const [now, setNow] = useState(new Date())
  const [notifPermission, setNotifPermission] = useState('default')

  useEffect(() => {
    localStorage.setItem('gildo-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission)
    }
  }, [])

  const requestNotifPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission()
      setNotifPermission(perm)
    }
  }

  const addTask = (text, dueAt) => {
    const newTask = {
      id: Date.now(),
      text,
      done: false,
      dueAt,
      createdAt: new Date().toISOString(),
      completedAt: null,
    }
    setTasks([newTask, ...tasks])
  }

  const toggleTask = (id) => {
    setTasks(tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            done: !t.done,
            completedAt: !t.done ? new Date().toISOString() : null,
          }
        : t
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const clearAll = () => {
    if (tasks.length === 0) return
    if (confirm('Sigurado ka bang gusto mong i-clear lahat ng tasks?')) {
      setTasks([])
    }
  }

  const total = tasks.length
  const done = tasks.filter((t) => t.done).length
  const pending = total - done
  const overdue = tasks.filter((t) => !t.done && t.dueAt && new Date(t.dueAt) < now).length

  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

  return (
    <div className="min-h-screen bg-herb-bg overflow-x-hidden flex flex-col items-center py-6 px-4 gap-4 relative">

      <div className="fixed top-[5%] left-[8%] text-3xl opacity-25 animate-float-herb pointer-events-none z-0">🌿</div>
      <div className="fixed top-[15%] right-[10%] text-4xl opacity-20 animate-float-herb pointer-events-none z-0" style={{ animationDelay: '1s' }}>🍃</div>
      <div className="fixed bottom-[10%] left-[12%] text-4xl opacity-25 animate-float-herb pointer-events-none z-0" style={{ animationDelay: '2s' }}>🌱</div>
      <div className="fixed bottom-[15%] right-[8%] text-3xl opacity-20 animate-float-herb pointer-events-none z-0" style={{ animationDelay: '3s' }}>🍃</div>

      <header className="text-center relative z-10 mb-2">
        <h1 className="font-shippori text-2xl md:text-4xl font-bold text-herb-jadeDark tracking-wider
          flex items-center justify-center gap-2
          [text-shadow:1px_1px_0_rgba(212,175,55,0.4)]">
          <span className="text-xl md:text-3xl animate-leaf-sway inline-block">🌿</span>
          Gildo's To-Do List
          <span className="text-xl md:text-3xl animate-leaf-sway inline-block">🌿</span>
        </h1>
        <p className="font-klee text-xs md:text-sm text-herb-inkSoft font-semibold tracking-widest mt-1">
          for a more productive day ✨
        </p>

        <div className="mt-3 inline-flex flex-col items-center gap-0.5
          bg-gradient-to-br from-herb-paper to-herb-paperDark
          border-2 border-herb-jadeDark rounded-2xl px-4 py-2
          shadow-[0_3px_0_rgba(42,63,31,0.15)]">
          <div className="font-shippori text-sm md:text-base font-bold text-herb-jadeDark tracking-wide">
            📅 {dateStr}
          </div>
          <div className="font-mono text-xs md:text-sm font-bold text-herb-mossDark tracking-widest">
            🕐 {timeStr}
          </div>
        </div>

        {notifPermission === 'default' && (
          <div className="mt-3">
            <button
              onClick={requestNotifPermission}
              className="text-xs font-bold text-white px-4 py-2 rounded-full
                bg-spice-cinnamon hover:bg-spice-cinnamonDark transition-colors cursor-pointer
                shadow-[0_3px_0_#8b5428] active:translate-y-0.5 active:shadow-none
                flex items-center gap-1.5 mx-auto"
            >
              🔔 Enable Reminders
            </button>
          </div>
        )}
        {notifPermission === 'granted' && (
          <div className="mt-3 text-xs text-herb-mossDark font-bold tracking-wide">
            ✅ Reminders enabled
          </div>
        )}
        {notifPermission === 'denied' && (
          <div className="mt-3 text-xs text-red-500 font-bold tracking-wide">
            ⚠️ Reminders blocked — i-enable sa browser settings
          </div>
        )}
      </header>

      <div className="w-full max-w-2xl bg-gradient-to-br from-herb-paper via-[#f5efd8] to-herb-paperDark
        border-[3px] border-herb-jadeDark rounded-3xl p-5
        shadow-[0_10px_28px_rgba(42,63,31,0.3),0_0_0_4px_rgba(212,175,55,0.3)]
        relative z-10">

        <div className="grid grid-cols-4 gap-2 mb-4">
          <StatBox label="Total" value={total} color="bg-herb-jade text-white" />
          <StatBox label="Done" value={done} color="bg-herb-moss text-white" />
          <StatBox label="Pending" value={pending} color="bg-chamomile text-spice-cinnamonDark" />
          <StatBox label="Overdue" value={overdue} color={overdue > 0 ? "bg-red-500 text-white animate-pulse" : "bg-red-100 text-red-600"} />
        </div>

        <TaskInput onAdd={addTask} />

        {tasks.length > 0 && (
          <div className="flex justify-between items-center mb-3 px-1">
            <span className="text-xs text-herb-inkSoft font-semibold tracking-wide">
              {total} {total === 1 ? 'task' : 'tasks'}
            </span>
            <button
              onClick={clearAll}
              className="text-xs text-red-600 font-bold px-3 py-1 rounded-full
                bg-red-100 hover:bg-red-200 transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <ProductivityTracker tasks={tasks} />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <Instructions />
      </div>

      <footer className="text-center text-xs text-herb-inkSoft relative z-10 pb-4 mt-2">
        🌿 DCIT 26 · Application Development & Emerging Technologies
      </footer>

      <ReminderPopup tasks={tasks} />
    </div>
  )
}

function StatBox({ label, value, color }) {
  return (
    <div className={`${color} rounded-2xl px-2 py-2 text-center border-2 border-herb-jadeDark/30
      shadow-[0_3px_0_rgba(42,63,31,0.15)] transition-all`}>
      <div className="text-lg md:text-2xl font-bold font-shippori">{value}</div>
      <div className="text-[9px] font-bold tracking-widest opacity-90 uppercase">{label}</div>
    </div>
  )
}