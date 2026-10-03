export default function ProductivityTracker({ tasks }) {
  const days = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    d.setHours(0, 0, 0, 0)
    days.push(d)
  }

  const counts = days.map((day) => {
    const next = new Date(day)
    next.setDate(day.getDate() + 1)

    return tasks.filter((t) => {
      if (!t.done || !t.completedAt) return false
      const completed = new Date(t.completedAt)
      return completed >= day && completed < next
    }).length
  })

  const maxCount = Math.max(...counts, 1)
  const totalThisWeek = counts.reduce((sum, c) => sum + c, 0)

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="w-full bg-gradient-to-br from-herb-paper to-herb-paperDark
      border-2 border-herb-jadeDark rounded-2xl px-5 py-4
      shadow-[0_6px_18px_rgba(42,63,31,0.2),0_0_0_3px_rgba(212,175,55,0.25)]">

      <div className="flex justify-between items-center mb-3">
        <h2 className="font-shippori text-base font-bold text-herb-jadeDark tracking-wider flex items-center gap-2">
          <span className="text-gold text-sm">❋</span>
          Productivity (7 Days)
        </h2>
        <span className="bg-gold text-spice-cinnamonDark text-xs font-bold px-2.5 py-0.5 rounded-full
          shadow-[0_0_0_1.5px_#8b6f1a]">
          {totalThisWeek} done
        </span>
      </div>

      <div className="flex justify-between items-end gap-1.5 h-24 mb-2">
        {days.map((day, i) => {
          const isToday = i === days.length - 1
          const count = counts[i]
          const height = count === 0 ? 4 : Math.max((count / maxCount) * 100, 15)

          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
              <span className={`text-[10px] font-bold ${count > 0 ? 'text-herb-jadeDark' : 'text-herb-inkSoft/50'}`}>
                {count > 0 ? count : ''}
              </span>
              <div
                className={`w-full rounded-t-md transition-all duration-500
                  ${count > 0
                    ? isToday
                      ? 'bg-gradient-to-t from-herb-jade to-chamomile'
                      : 'bg-gradient-to-t from-herb-jade to-herb-moss'
                    : 'bg-herb-sage/30'
                  }`}
                style={{ height: `${height}%` }}
                title={`${count} task${count !== 1 ? 's' : ''} done`}
              />
            </div>
          )
        })}
      </div>

      <div className="flex justify-between items-center gap-1.5">
        {days.map((day, i) => {
          const isToday = i === days.length - 1
          return (
            <div key={i} className={`flex-1 text-center text-[9px] font-bold tracking-wide
              ${isToday ? 'text-herb-jadeDark' : 'text-herb-inkSoft'}`}>
              {isToday ? 'Today' : dayNames[day.getDay()]}
            </div>
          )
        })}
      </div>

      {totalThisWeek === 0 && (
        <div className="text-center text-xs text-herb-inkSoft italic mt-2 opacity-70">
          Mark tasks as DONE to see your productivity grow 🌿
        </div>
      )}
    </div>
  )
}