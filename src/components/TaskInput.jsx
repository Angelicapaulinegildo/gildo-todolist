import { useState } from 'react'

export default function TaskInput({ onAdd }) {
  const [text, setText] = useState('')
  const [dueAt, setDueAt] = useState('')

  const handleAdd = () => {
    if (text.trim() === '') return
    onAdd(text.trim(), dueAt || null)
    setText('')
    setDueAt('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type your task here..."
          className="flex-1 px-4 py-3 rounded-2xl border-2 border-herb-jadeDark
            bg-herb-paper text-herb-ink placeholder:text-herb-inkSoft/60
            focus:outline-none focus:ring-4 focus:ring-herb-sage/40
            font-quicksand font-medium transition-all"
        />
        <button
          onClick={handleAdd}
          className="px-5 py-3 rounded-2xl bg-herb-jade text-white font-bold
            border-2 border-herb-jadeDark
            shadow-[0_4px_0_#2d5a3d]
            hover:bg-herb-jade/90 hover:-translate-y-0.5
            active:translate-y-1 active:shadow-none
            transition-all cursor-pointer whitespace-nowrap"
        >
          + Add
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs font-bold text-herb-inkSoft tracking-wide whitespace-nowrap">
          📅 When:
        </label>
        <input
          type="datetime-local"
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl border-2 border-herb-jadeDark/40
            bg-herb-paper text-herb-ink text-sm
            focus:outline-none focus:ring-2 focus:ring-herb-sage/40
            font-quicksand font-medium cursor-pointer"
        />
        {dueAt && (
          <button
            onClick={() => setDueAt('')}
            className="text-xs text-red-600 font-bold px-2.5 py-1.5 rounded-full
              bg-red-100 hover:bg-red-200 transition-colors cursor-pointer"
            title="Clear date"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}