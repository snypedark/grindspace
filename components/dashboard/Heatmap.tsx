"use client"

import { clsx } from 'clsx'

interface HeatmapProps {
  data?: Record<string, number>
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Intensity level styles for neumorphic heatmap
const INTENSITY_STYLES = [
  // Level 0: empty cell — inset
  { bg: '#E8EAF0', shadow: 'inset 2px 2px 5px #C5C8D6, inset -2px -2px 5px #FFFFFF' },
  // Level 1: lightest purple — raised
  { bg: '#DDD8FF', shadow: '2px 2px 5px #C5C8D6, -2px -2px 5px #FFFFFF' },
  // Level 2: medium purple — raised + glow
  { bg: '#C4BBFF', shadow: '2px 2px 5px #C5C8D6, -2px -2px 5px #FFFFFF, 0 0 4px rgba(125,111,247,0.2)' },
  // Level 3: saturated purple — raised + stronger glow
  { bg: '#9D93F9', shadow: '2px 2px 5px #C5C8D6, -2px -2px 5px #FFFFFF, 0 0 6px rgba(125,111,247,0.35)' },
  // Level 4: deep purple — raised + max glow
  { bg: '#7C6FF7', shadow: '2px 2px 5px #C5C8D6, -2px -2px 5px #FFFFFF, 0 0 8px rgba(125,111,247,0.5)' },
]

function getLast52Weeks(): { date: string; week: number; day: number }[] {
  const result = []
  const today = new Date()
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
            <div key={i} className="h-[13px] w-4 flex items-center justify-end">
              <span className="text-[9px] font-bold text-[#A8ABBE]">{d}</span>
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
                <div key={w} className="w-[13px] flex items-center justify-start">
                  {(date.getDate() <= 7) && (
                    <span className="text-[9px] font-bold text-[#A8ABBE] whitespace-nowrap">
                      {MONTHS[date.getMonth()]}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Grid */}
          <div
            className="grid gap-[2px]"
            style={{
              gridTemplateColumns: 'repeat(52, 13px)',
              gridTemplateRows: 'repeat(7, 13px)',
            }}
          >
            {CELLS.map((cell) => {
              const level = data[cell.date] ?? 0
              const style = INTENSITY_STYLES[level]
              return (
                <div
                  key={cell.date}
                  style={{
                    gridColumn: cell.week + 1,
                    gridRow: cell.day + 1,
                    width: 13,
                    height: 13,
                    borderRadius: 4,
                    background: style.bg,
                    boxShadow: style.shadow,
                    transition: 'transform 0.1s ease',
                  }}
                  className="hover:scale-125 cursor-pointer"
                  title={`${cell.date}${level > 0 ? ` · ${level * 30}+ min` : ' · No session'}`}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-[10px] font-bold text-[#A8ABBE]">Less</span>
        {INTENSITY_STYLES.map((style, i) => (
          <div
            key={i}
            style={{
              width: 13,
              height: 13,
              borderRadius: 4,
              background: style.bg,
              boxShadow: style.shadow,
            }}
          />
        ))}
        <span className="text-[10px] font-bold text-[#A8ABBE]">More</span>
      </div>
    </div>
  )
}
