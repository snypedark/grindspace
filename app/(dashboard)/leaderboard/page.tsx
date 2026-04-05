"use client"

import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useAuth } from '@/lib/AuthContext'
import { Avatar } from '@/components/ui/Avatar'
import { Loader2, Trophy, Medal, Award } from 'lucide-react'
import { clsx } from 'clsx'

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy size={18} className="text-yellow-500" />
  if (rank === 2) return <Medal size={18} className="text-gray-400" />
  if (rank === 3) return <Award size={18} className="text-amber-600" />
  return null
}

export default function LeaderboardPage() {
  const { entries, loading, myRank } = useLeaderboard()
  const { user } = useAuth()

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-slide-up">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[22px] font-[900] text-[#3B3F5C] tracking-[-0.03em]">Leaderboard</h2>
          <p className="text-[13px] font-medium text-[#7B80A0] mt-0.5">
            {myRank ? `You're #${myRank} · ` : ''}See how you stack up globally 🏆
          </p>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#A8ABBE]">
          Updates every 15s
        </p>
      </div>

      {loading ? (
        <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-12 flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-[#7B80A0]" />
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-8 text-center">
          <span className="text-4xl block mb-3">🏆</span>
          <h3 className="text-base font-bold text-[#3B3F5C]">No users yet</h3>
          <p className="text-sm font-medium text-[#7B80A0] max-w-xs mx-auto mt-1">
            Log your first session to appear on the leaderboard.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {entries.map((entry) => {
            const isMe = user?.id === entry.id
            return (
              <div
                key={entry.id}
                className={clsx(
                  "bg-[#E8EAF0] rounded-[18px] p-4 flex items-center gap-4 transition-all duration-220",
                  isMe
                    ? "shadow-[5px_5px_14px_rgba(92,81,224,0.2),-2px_-2px_6px_rgba(255,255,255,0.6)]"
                    : "shadow-neu hover:-translate-y-0.5 hover:shadow-neu-hover"
                )}
              >
                {/* Rank */}
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-[10px] shrink-0 text-sm font-[900] text-[#3B3F5C]"
                  style={{
                    boxShadow: entry.rank <= 3
                      ? "inset 4px 4px 10px #C5C8D6, inset -4px -4px 10px #FFFFFF"
                      : "4px 4px 10px #C5C8D6, -4px -4px 10px #FFFFFF",
                    background: "#E8EAF0",
                  }}
                >
                  {getRankIcon(entry.rank) ?? `#${entry.rank}`}
                </div>

                {/* Avatar */}
                <Avatar src={entry.avatar_url} name={entry.username} size="md" />

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#3B3F5C] truncate">
                    {entry.username}
                    {isMe && <span className="text-[10px] font-bold text-[#7C6FF7] ml-1.5">(You)</span>}
                  </p>
                </div>

                {/* XP */}
                <div className="text-right shrink-0">
                  <p className="text-lg font-[900] tracking-[-0.04em] text-[#3B3F5C]">
                    {entry.xp.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#A8ABBE]">XP</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
