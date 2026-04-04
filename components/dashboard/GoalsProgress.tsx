import { ProgressBar } from '@/components/ui/ProgressBar'
import type { Goal } from '@/types/goal'
import type { Session } from '@/types/session'
import { calcGoalProgress } from '@/lib/calculations'

interface GoalsProgressProps {
  goals: Goal[]
  sessions: Session[]
  onAddGoal?: () => void
}

export function GoalsProgress({ goals, sessions, onAddGoal }: GoalsProgressProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-text-secondary mb-3">No goals yet</p>
        {onAddGoal && (
          <button
            onClick={onAddGoal}
            className="text-xs text-accent font-medium hover:underline"
          >
            + Add your first goal
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => {
        const { current, percentage } = calcGoalProgress(goal, sessions)
        const currentHours = Math.round((current / 60) * 10) / 10
        const targetHours = Math.round((goal.target_minutes / 60) * 10) / 10
        return (
          <div key={goal.id} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <span
                className="text-xs font-medium text-text-primary truncate max-w-[200px]"
                title={goal.title}
              >
                {goal.title}
              </span>
              <span className="text-xs text-text-secondary shrink-0 ml-2">
                {currentHours}h / {targetHours}h
              </span>
            </div>
            <ProgressBar value={percentage} showValue={false} size="sm" />
          </div>
        )
      })}
    </div>
  )
}
