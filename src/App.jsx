import { useMemo, useState } from 'react'

const STORAGE_KEY = 'habit-tracker-habits-v1'

function getTodayISO() {
  return new Date().toISOString().split('T')[0]
}

function App() {
  const [screen, setScreen] = useState('welcome')
  const [habitInput, setHabitInput] = useState('')
  const [habits, setHabits] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  })

  const today = getTodayISO()

  const trackerSummary = useMemo(() => {
    const completed = habits.filter((h) => h.log?.[today]).length
    return { completed, total: habits.length }
  }, [habits, today])

  const persist = (nextHabits) => {
    setHabits(nextHabits)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHabits))
  }

  const addHabit = (event) => {
    event.preventDefault()
    const name = habitInput.trim()
    if (!name) return

    const newHabit = {
      id: crypto.randomUUID(),
      name,
      createdAt: today,
      log: {},
    }

    persist([newHabit, ...habits])
    setHabitInput('')
  }

  const toggleToday = (habitId) => {
    persist(
      habits.map((habit) => {
        if (habit.id !== habitId) return habit

        return {
          ...habit,
          log: {
            ...habit.log,
            [today]: !habit.log?.[today],
          },
        }
      }),
    )
  }

  if (screen === 'welcome') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-50 to-indigo-100 p-4">
        <section className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">
          <img
            src="/welcome-hero.svg"
            alt="Habit Tracker Magical Mysteries Revealed Through Daily Habits"
            className="h-auto w-full object-cover"
          />
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <h1 className="text-3xl font-extrabold text-indigo-700">Welcome to Habit Tracker</h1>
            <p className="max-w-2xl text-slate-600">
              Turn tiny daily actions into magical long-term progress.
            </p>
            <button
              type="button"
              className="rounded-xl bg-indigo-600 px-7 py-3 text-lg font-bold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
              onClick={() => setScreen('tracker')}
            >
              Let&apos;s Go
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Today&apos;s Tracker</h2>
          <p className="mt-2 text-slate-600">
            Completed today: <span className="font-semibold text-indigo-700">{trackerSummary.completed}</span> /
            {' '}
            <span className="font-semibold">{trackerSummary.total}</span>
          </p>
        </header>

        <form onSubmit={addHabit} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <label htmlFor="habit" className="mb-2 block text-sm font-medium text-slate-700">
            Add a new daily habit
          </label>
          <div className="flex gap-3">
            <input
              id="habit"
              value={habitInput}
              onChange={(event) => setHabitInput(event.target.value)}
              placeholder="e.g., Read 10 pages"
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 outline-none ring-indigo-300 focus:ring"
            />
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </form>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Daily Check-in</h3>
          <ul className="mt-4 space-y-3">
            {habits.length === 0 && (
              <li className="rounded-lg border border-dashed border-slate-300 p-4 text-slate-500">
                No habits yet—add one to start tracking.
              </li>
            )}
            {habits.map((habit) => {
              const done = Boolean(habit.log?.[today])
              return (
                <li key={habit.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <span className="font-medium text-slate-800">{habit.name}</span>
                  <button
                    type="button"
                    onClick={() => toggleToday(habit.id)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      done
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {done ? 'Did it ✅' : 'Mark Done'}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </main>
  )
}

export default App
