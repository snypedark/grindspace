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
      <div className="flex items-end justify-between gap-2 flex-1 pb-2">
        {data.map((d) => {
          const pct = (d.hours / maxHours) * 100
          return (
            <div key={d.day} className="flex flex-col items-center gap-1 flex-1 group">
              <span className="text-[10px] text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-150 font-medium">
                {d.hours > 0 ? `${d.hours}h` : '–'}
              </span>
              <div className="w-full flex items-end justify-center" style={{ height: '120px' }}>
                <div
                  className="w-full max-w-[36px] rounded-t-lg bg-accent-light group-hover:bg-accent/20 transition-colors duration-200 relative overflow-hidden"
                  style={{ height: `${Math.max(pct, d.hours > 0 ? 8 : 4)}%`, minHeight: d.hours > 0 ? '8px' : '4px' }}
                >
                  {d.hours > 0 && (
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-accent rounded-t-lg"
                      style={{
                        height: '100%',
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
      <div className="flex justify-between gap-2 pt-2 border-t border-border">
        {data.map((d) => (
          <span
            key={d.day}
            className="flex-1 text-center text-[10px] text-text-secondary font-medium"
          >
            {d.day}
          </span>
        ))}
      </div>
    </div>
  )
}
