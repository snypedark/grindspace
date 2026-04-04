import { clsx } from 'clsx'

interface SkillDistributionProps {
  distribution: { skill: string; hours: number; percentage: number }[]
}

const BAR_COLORS = [
  'bg-indigo-500',
  'bg-purple-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-sky-500',
  'bg-rose-400',
]

export function SkillDistribution({ distribution }: SkillDistributionProps) {
  if (distribution.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-text-secondary">Log sessions to see your skill mix</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {distribution.map((item, i) => (
        <div key={item.skill} className="flex items-center gap-3">
          <span className="text-xs font-medium text-text-secondary w-16 shrink-0">
            {item.skill}
          </span>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={clsx(
                'h-full rounded-full transition-all duration-700 ease-smooth',
                BAR_COLORS[i % BAR_COLORS.length]
              )}
              style={{ width: `${item.percentage}%` }}
            />
          </div>
          <div className="flex items-center gap-1 w-16 justify-end shrink-0">
            <span className="text-xs text-text-primary font-semibold">{item.hours}h</span>
            <span className="text-[10px] text-text-secondary">({item.percentage}%)</span>
          </div>
        </div>
      ))}
    </div>
  )
}
