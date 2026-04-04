import { Avatar } from '@/components/ui/Avatar'
import type { Session } from '@/types/session'

interface ActivityFeedProps {
  sessions: Session[]
  username?: string
}

const SKILL_COLORS: Record<string, string> = {
  Coding: 'bg-indigo-100 text-indigo-700',
  Design: 'bg-purple-100 text-purple-700',
  Writing: 'bg-emerald-100 text-emerald-700',
  Math: 'bg-amber-100 text-amber-700',
  Research: 'bg-sky-100 text-sky-700',
  Language: 'bg-pink-100 text-pink-700',
  Music: 'bg-orange-100 text-orange-700',
  Reading: 'bg-teal-100 text-teal-700',
  Business: 'bg-lime-100 text-lime-700',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

export function ActivityFeed({ sessions, username = 'You' }: ActivityFeedProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-text-secondary">No sessions yet — log your first one!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sessions.slice(0, 5).map((item, i) => (
        <div
          key={item.id}
          className="flex items-start gap-3 animate-fade-slide-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <Avatar name={username} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  SKILL_COLORS[item.skill] ?? 'bg-gray-100 text-gray-600'
                }`}
              >
                {item.skill}
              </span>
              <span className="text-xs font-medium text-text-primary">
                {Math.round(item.duration_minutes / 60 * 10) / 10}h logged
              </span>
              <span className="text-xs text-text-secondary ml-auto">
                {timeAgo(item.created_at)}
              </span>
            </div>
            {item.note && (
              <p className="text-xs text-text-secondary mt-0.5 truncate">{item.note}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
