import { Avatar } from '@/components/ui/Avatar'
import type { Session } from '@/types/session'

interface ActivityFeedProps {
  sessions: Session[]
  username?: string
}

const SKILL_GRADIENTS: Record<string, { gradient: string; text: string }> = {
  Coding: { gradient: "linear-gradient(135deg, #9D93F9, #5B51E0)", text: "#7C6FF7" },
  Design: { gradient: "linear-gradient(135deg, #F5A0C0, #E65A96)", text: "#F07AAB" },
  Writing: { gradient: "linear-gradient(135deg, #7EDCB5, #3DB889)", text: "#5EC8A0" },
  Math: { gradient: "linear-gradient(135deg, #FFB88C, #E8926A)", text: "#F7A97C" },
  Research: { gradient: "linear-gradient(135deg, #88C8F7, #3A97E8)", text: "#5EB0F0" },
  Language: { gradient: "linear-gradient(135deg, #F5A0C0, #E65A96)", text: "#F07AAB" },
  Music: { gradient: "linear-gradient(135deg, #FFB88C, #E8926A)", text: "#F7A97C" },
  Reading: { gradient: "linear-gradient(135deg, #7EDCB5, #3DB889)", text: "#5EC8A0" },
  Business: { gradient: "linear-gradient(135deg, #88C8F7, #3A97E8)", text: "#5EB0F0" },
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
        <p className="text-sm font-semibold text-[#7B80A0]">No sessions yet — log your first one!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sessions.slice(0, 5).map((item, i) => {
        const skillStyle = SKILL_GRADIENTS[item.skill_name || '']
        return (
          <div
            key={item.id}
            className="flex items-start gap-3 animate-fade-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <Avatar name={username} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8EAF0]"
                  style={{
                    boxShadow: "3px 3px 8px #C5C8D6, -3px -3px 8px #FFFFFF",
                    color: skillStyle?.text ?? "#7B80A0",
                  }}
                >
                  {item.skill_name || 'Uncategorized'}
                </span>
                <span className="text-xs font-bold text-[#3B3F5C]">
                  {Math.round(item.duration_mins / 60 * 10) / 10}h logged
                </span>
                <span className="text-xs font-semibold text-[#A8ABBE] ml-auto">
                  {timeAgo(item.logged_at)}
                </span>
              </div>
              {item.notes && (
                <p className="text-xs text-[#7B80A0] mt-0.5 truncate font-medium">{item.notes}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
