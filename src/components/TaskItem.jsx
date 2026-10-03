function formatDueDate(iso) {
  if (!iso) return null
  const d = new Date(iso)
  if (isNaN(d.getTime())) return null

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate())

  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24))

  let dayLabel
  if (diffDays === 0) dayLabel = 'Today'
  else if (diffDays === 1) dayLabel = 'Tomorrow'
  else if (diffDays === -1) dayLabel = 'Yesterday'
  else {
    dayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const timeLabel = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return { dayLabel, timeLabel, isPast: d < now, fullDate: d }
}

export default function TaskItem({ task, onToggle, onDelete }) {
  const dueInfo = formatDueDate(task.dueAt)

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-2xl mb-2
        border-2 transition-all animate-task-in
        ${task.done
          ? 'bg-herb-sage/30 border-herb-sageDark/40'
          : 'bg-herb-paper border-herb-jadeDark/30'
        }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={`w-6 h-6 mt-0.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
          transition-all cursor-pointer
          ${task.done
            ? 'bg-herb-jade border-herb-jadeDark'
            : 'bg-white border-herb-inkSoft hover:border-herb-jade'
          }`}
        title={task.done ? 'Mark as not done' : 'Mark as done'}
      >
        {task.done && <span className="text-white text-xs font-bold">✓</span>}
      </button>

      <div className="flex-1 min-w-0">
        <div
          className={`font-medium transition-all break-words
            ${task.done
              ? 'text-herb-inkSoft line-through opacity-60'
              : 'text-herb-ink'
            }`}
        >
          {task.text}
        </div>

        {dueInfo && (
          <div className={`flex items-center gap-1 mt-0.5 text-[11px] font-semibold
            ${dueInfo.isPast && !task.done
              ? 'text-red-600'
              : 'text-herb-mossDark'
            }`}>
            📅 {dueInfo.dayLabel} · 🕐 {dueInfo.timeLabel}
            {dueInfo.isPast && !task.done && (
              <span className="ml-1 text-red-500">(overdue)</span>
            )}
          </div>
        )}
      </div>

      <span
        className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider flex-shrink-0
          ${task.done
            ? 'bg-herb-jade text-white'
            : 'bg-chamomile text-spice-cinnamonDark'
          }`}
      >
        {task.done ? 'DONE' : 'NOT DONE'}
      </span>

      <button
        onClick={() => onDelete(task.id)}
        className="w-7 h-7 rounded-full bg-red-400 hover:bg-red-500 text-white
          flex items-center justify-center text-sm font-bold
          transition-all cursor-pointer flex-shrink-0"
        title="Delete task"
      >
        ×
      </button>
    </div>
  )
}