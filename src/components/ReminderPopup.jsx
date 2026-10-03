import { useEffect, useState } from 'react'

function getTimeInfo(dueAt) {
  const now = new Date()
  const due = new Date(dueAt)
  const diffMs = now - due
  const diffMin = Math.floor(Math.abs(diffMs) / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  let timeAgo
  if (diffMin < 1) timeAgo = 'just now'
  else if (diffMin < 60) timeAgo = `${diffMin} min`
  else if (diffHr < 24) timeAgo = `${diffHr} hr`
  else timeAgo = `${diffDay} day${diffDay > 1 ? 's' : ''}`

  const timeStr = due.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return { timeAgo, timeStr, diffMs }
}

function playAlertSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime

    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(880, now)
    gain1.gain.setValueAtTime(0.15, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.15)

    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1100, now + 0.2)
    gain2.gain.setValueAtTime(0.15, now + 0.2)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.2)
    osc2.stop(now + 0.35)

    setTimeout(() => ctx.close(), 600)
  } catch {
    /* silent fail */
  }
}

export default function ReminderPopup({ tasks, onDismiss }) {
  const [overdueTasks, setOverdueTasks] = useState([])
  const [dismissedIds, setDismissedIds] = useState([])
  const [, forceTick] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [lastAlertedIds, setLastAlertedIds] = useState([])

  useEffect(() => {
    const checkOverdue = () => {
      const now = new Date()
      const overdue = tasks.filter((t) => {
        if (t.done || !t.dueAt) return false
        if (dismissedIds.includes(t.id)) return false
        return new Date(t.dueAt) < now
      })
      setOverdueTasks(overdue)

      const newIds = overdue.map((t) => t.id)
      const hasNew = newIds.some((id) => !lastAlertedIds.includes(id))
      if (hasNew && overdue.length > 0 && soundEnabled) {
        playAlertSound()
        setLastAlertedIds(newIds)
      }

      if (overdue.length > 0 && 'Notification' in window) {
        if (Notification.permission === 'default') {
          Notification.requestPermission()
        } else if (Notification.permission === 'granted') {
          const newest = overdue[0]
          const info = getTimeInfo(newest.dueAt)
          new Notification('🔔 Task Reminder', {
            body: `Not done yet: "${newest.text}" — overdue by ${info.timeAgo}`,
            icon: '/vite.svg',
            tag: `task-${newest.id}`,
          })
        }
      }
    }

    checkOverdue()
    const interval = setInterval(checkOverdue, 30000)
    return () => clearInterval(interval)
  }, [tasks, dismissedIds, soundEnabled, lastAlertedIds])

  useEffect(() => {
    const t = setInterval(() => forceTick((n) => n + 1), 10000)
    return () => clearInterval(t)
  }, [])

  const dismiss = (id) => {
    setDismissedIds([...dismissedIds, id])
    setOverdueTasks(overdueTasks.filter((t) => t.id !== id))
    if (onDismiss) onDismiss()
  }

  const dismissAll = () => {
    const ids = overdueTasks.map((t) => t.id)
    setDismissedIds([...dismissedIds, ...ids])
    setOverdueTasks([])
  }

  if (overdueTasks.length === 0) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={dismissAll}
    >
      <div
        className="bg-gradient-to-br from-herb-paper to-herb-paperDark
          border-[3px] border-red-400 rounded-3xl max-w-md w-full
          shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_0_4px_rgba(255,100,100,0.3)]
          overflow-hidden animate-task-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-red-500 text-white px-5 py-4 flex items-center gap-3">
          <span className="text-3xl animate-bounce">🔔</span>
          <div className="flex-1">
            <div className="font-shippori text-lg font-bold tracking-wide">
              Reminder!
            </div>
            <div className="text-xs opacity-90">
              You have {overdueTasks.length} unfinished task
              {overdueTasks.length > 1 ? 's' : ''}
            </div>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30
              flex items-center justify-center text-lg cursor-pointer
              transition-colors"
            title={soundEnabled ? 'Mute sound' : 'Enable sound'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto p-4">
          {overdueTasks.map((task) => {
            const info = getTimeInfo(task.dueAt)
            return (
              <div
                key={task.id}
                className="flex items-start gap-2 px-3 py-2.5 rounded-xl mb-2
                  bg-red-50 border border-red-200 last:mb-0"
              >
                <span className="text-red-500 text-lg mt-0.5">⏰</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-herb-ink break-words">
                    {task.text}
                  </div>
                  <div className="text-[10px] text-red-600 font-bold mt-1 flex flex-col gap-0.5">
                    <span>📅 {info.timeStr}</span>
                    <span className="flex items-center gap-1">
                      ⏳ Overdue by{' '}
                      <span className="bg-red-200 text-red-700 px-1.5 rounded font-mono">
                        {info.timeAgo}
                      </span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => dismiss(task.id)}
                  className="text-red-500 font-bold text-lg cursor-pointer
                    w-6 h-6 flex items-center justify-center rounded-full
                    hover:bg-red-100 transition-colors flex-shrink-0"
                  title="Dismiss"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>

        <div className="px-4 py-3 bg-red-50 border-t-2 border-dashed border-red-200
          flex justify-between items-center gap-2">
          <span className="text-[10px] text-red-600 italic">
            Time to finish it! 🌿
          </span>
          <button
            onClick={dismissAll}
            className="text-xs font-bold text-white px-4 py-1.5 rounded-full
              bg-red-500 hover:bg-red-600 transition-colors cursor-pointer
              shadow-[0_3px_0_#7f1d1d] active:translate-y-0.5 active:shadow-none"
          >
            OK, Got it!
          </button>
        </div>
      </div>
    </div>
  )
}