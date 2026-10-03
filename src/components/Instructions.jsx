import { useState } from 'react'

export default function Instructions() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-gradient-to-br from-herb-paper to-herb-paperDark
          border-2 border-herb-jadeDark rounded-2xl px-5 py-3
          shadow-[0_6px_18px_rgba(42,63,31,0.2),0_0_0_3px_rgba(212,175,55,0.25)]
          hover:bg-herb-sage/20 hover:-translate-y-0.5
          active:translate-y-0.5 active:shadow-[0_3px_0_rgba(42,63,31,0.2)]
          transition-all cursor-pointer
          flex items-center justify-center gap-2"
      >
        <span className="text-lg">📖</span>
        <span className="font-shippori text-sm md:text-base font-bold text-herb-jadeDark tracking-wider">
          Show User Guide
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50
            flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-gradient-to-br from-herb-paper to-herb-paperDark
              border-[3px] border-herb-jadeDark rounded-3xl
              max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden
              shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_0_4px_rgba(212,175,55,0.4)]
              animate-task-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-5 py-4
              bg-herb-moss/10 border-b-2 border-herb-jadeDark/30">
              <div className="font-shippori text-lg font-bold text-herb-jadeDark tracking-wider flex items-center gap-2">
                <span className="text-gold">❋</span>
                User Guide
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-herb-jadeDark text-2xl font-bold cursor-pointer
                  w-9 h-9 flex items-center justify-center rounded-full
                  hover:bg-herb-moss/20 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <h2 className="font-shippori text-base font-bold text-herb-jadeDark mb-2 tracking-wider flex items-center gap-2">
                <span className="text-gold text-sm">❋</span>
                How to Use
              </h2>
              <ul className="space-y-1.5 mb-5">
                <Bullet><b>Adding a task:</b> Type your task in the input box, then click <b>+ Add</b> or press <b>Enter</b>.</Bullet>
                <Bullet><b>Setting due date & time:</b> Use the <b>Kailan</b> (When) date-time picker below the input.</Bullet>
                <Bullet><b>Marking as Done:</b> Click the circle on the left of the task.</Bullet>
                <Bullet><b>Back to Not Done:</b> Click the circle again — it toggles.</Bullet>
                <Bullet><b>Deleting a task:</b> Click the <b>×</b> button on the right.</Bullet>
                <Bullet><b>Clearing all:</b> Click <b>Clear All</b> above the list.</Bullet>
              </ul>

              <h2 className="font-shippori text-base font-bold text-herb-jadeDark mb-2 tracking-wider flex items-center gap-2">
                <span className="text-gold text-sm">❋</span>
                Features
              </h2>
              <ul className="space-y-1.5 mb-5">
                <Bullet>Add unlimited tasks</Bullet>
                <Bullet>Set due date and time</Bullet>
                <Bullet>Mark as Done / Not Done</Bullet>
                <Bullet>Delete individual tasks</Bullet>
                <Bullet>Clear all tasks at once</Bullet>
                <Bullet>Task counter (Total, Done, Pending, Overdue)</Bullet>
                <Bullet>Live date & time display</Bullet>
                <Bullet>7-day productivity tracker</Bullet>
                <Bullet>Reminder popup with countdown</Bullet>
                <Bullet>Sound alert for overdue tasks</Bullet>
                <Bullet>Browser notifications</Bullet>
                <Bullet>Auto-save (survives page refresh)</Bullet>
              </ul>

              <div className="bg-spice-cinnamon/10 border border-spice-cinnamonDark/35 rounded-2xl px-3.5 py-2.5
                text-xs text-spice-cinnamonDark leading-relaxed">
                🌿 <b>Tip:</b> Mark tasks as <b>Done</b> to see your productivity grow on the chart below!
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Bullet({ children }) {
  return (
    <li className="text-sm text-herb-inkSoft font-medium pl-5 relative leading-relaxed
      before:content-['🌿'] before:absolute before:left-0 before:text-[11px]">
      {children}
    </li>
  )
}