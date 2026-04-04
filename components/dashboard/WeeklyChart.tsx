interface DayData {
  day: string
  hours: number
}

interface WeeklyChartProps {
  data?: DayData[]
}

const DEFAULT_DATA: DayData[] = [
  { day: 'Mon', hours: 0 },
  { day: 'Tue', hours: 0 },
  { day: 'Wed', hours: 0 },
  { day: 'Thu', hours: 0 },
  { day: 'Fri', hours: 0 },
  { day: 'Sat', hours: 0 },
  { day: 'Sun', hours: 0 },
]

const MAX_HOURS = 8

export function WeeklyChart({ data = DEFAULT_DATA }: WeeklyChartProps) {
  const maxHours = Math.max(...data.map((d) => d.hours), MAX_HOURS)

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-end justify-between gap-2.5 flex-1 pb-2">
        {data.map((d) => {
          const pct = (d.hours / maxHours) * 100
          return (
            <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1 group">
              <span className="text-[10px] text-[#7B80A0] opacity-0 group-hover:opacity-100 transition-opacity duration-150 font-bold">
                {d.hours > 0 ? `${d.hours}h` : '–'}
              </span>
              <div className="w-full flex items-end justify-center" style={{ height: '120px' }}>
                <div
                  className="w-full max-w-[36px] rounded-t-xl relative overflow-hidden transition-all duration-200"
                  style={{
                    height: `${Math.max(pct, d.hours > 0 ? 8 : 4)}%`,
                    minHeight: d.hours > 0 ? '8px' : '4px',
                    background: '#E8EAF0',
                    boxShadow: d.hours > 0
                      ? undefined
                      : 'inset 2px 2px 6px #C5C8D6, inset -2px -2px 6px #FFFFFF',
                  }}
                >
                  {d.hours > 0 && (
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-t-xl"
                      style={{
                        height: '100%',
                        background: 'linear-gradient(135deg, #9D93F9, #7C6FF7, #5B51E0)',
                        boxShadow: '0 0 8px rgba(125, 111, 247, 0.3)',
                        transition: 'height 0.7s cubic-bezier(0.4,0,0.2,1)',
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div
        className="flex justify-between gap-2.5 pt-3"
        style={{ boxShadow: "0 -1px 0 0 transparent" }}
      >
        {data.map((d) => (
          <span
            key={d.day}
            className="flex-1 text-center text-[10px] text-[#A8ABBE] font-bold uppercase tracking-wider"
          >
            {d.day}
          </span>
        ))}
      </div>
    </div>
  )
}
