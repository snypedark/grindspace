"use client"

import { clsx } from 'clsx'

interface HeatmapProps {
  data?: Record<string, number> // date string (YYYY-MM-DD) → intensity 0–4
}

const INTENSITY_CLASSES = [
  'bg-gray-100',
  'bg-indigo-100',
  'bg-indigo-200',
  'bg-indigo-400',
  'bg-indigo-600',
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getLast52Weeks(): { date: string; week: number; day: number }[] {
  const result = []
  const today = new Date()
  // Start from 52 weeks ago, aligned to Monday
  const start = new Date(today)
  start.setDate(today.getDate() - 363)
  const dayOfWeek = start.getDay() === 0 ? 6 : start.getDay() - 1
  start.setDate(start.getDate() - dayOfWeek)

  for (let w = 0; w < 52; w++) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(start)
      date.setDate(start.getDate() + w * 7 + d)
      result.push({
        date: date.toISOString().slice(0, 10),
        week: w,
        day: d,
      })
    }
  }
  return result
}

const CELLS = getLast52Weeks()

export function Heatmap({ data = {} }: HeatmapProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 items-start min-w-max">
        {/* Day labels */}
        <div className="flex flex-col gap-px pt-5">
          {['M', '', 'W', '', 'F', '', ''].map((d, i) => (
            <div key={i} className="h-3 w-4 flex items-center justify-end">
              <span className="text-[9px] text-text-secondary">{d}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col">
          {/* Month labels */}
          <div className="flex gap-px mb-1.5">
            {Array.from({ length: 52 }, (_, w) => {
              const cell = CELLS[w * 7]
              const date = new Date(cell.date)
              return (
                <div key={w} className="w-3 flex items-center justify-start">
                  {(date.getDate() <= 7) && (
                    <span className="text-[9px] text-text-secondary whitespace-nowrap">
                      {MONTHS[date.getMonth()]}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Grid — 7 rows × 52 cols */}
          <div
            className="grid gap-px"
            style={{
              gridTemplateColumns: 'repeat(52, 12px)',
              gridTemplateRows: 'repeat(7, 12px)',
            }}
          >
            {CELLS.map((cell) => {
              const level = data[cell.date] ?? 0
              return (
                <div
                  key={cell.date}
                  style={{ gridColumn: cell.week + 1, gridRow: cell.day + 1 }}
                  className={clsx(
                    'w-3 h-3 rounded-sm transition-transform duration-100 hover:scale-110 cursor-pointer',
                    INTENSITY_CLASSES[level]
                  )}
                  title={`${cell.date}${level > 0 ? ` · ${level * 30}+ min` : ' · No session'}`}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 justify-end">
        <span className="text-[10px] text-text-secondary">Less</span>
        {INTENSITY_CLASSES.map((cls, i) => (
          <div key={i} className={clsx('w-3 h-3 rounded-sm', cls)} />
        ))}
        <span className="text-[10px] text-text-secondary">More</span>
      </div>
    </div>
  )
}
