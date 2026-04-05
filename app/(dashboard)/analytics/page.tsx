"use client"

import { useSessions } from '@/hooks/useSessions'
import { useAuth } from '@/lib/AuthContext'
import { WeeklyChart } from '@/components/dashboard/WeeklyChart'
import { SkillDistribution } from '@/components/dashboard/SkillDistribution'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Loader2, Clock, Zap, BarChart3, Target } from 'lucide-react'

export default function AnalyticsPage() {
  const { user, profile } = useAuth()
  const { sessions, stats, loading } = useSessions()

  if (!user) return null

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-[#7B80A0]" />
      </div>
    )
  }

  const totalHours = Math.round((stats.totalXP / 60) * 10) / 10
  const totalSessions = sessions.length
  const avgDuration = totalSessions > 0
    ? Math.round(sessions.reduce((s, x) => s + x.duration_mins, 0) / totalSessions)
    : 0
  const longestSession = sessions.length > 0
    ? Math.max(...sessions.map((s) => s.duration_mins))
    : 0

  // Monthly hours (last 4 weeks)
  const weeklyHoursData: { week: string; hours: number }[] = []
  for (let w = 3; w >= 0; w--) {
    const now = new Date()
    const weekEnd = new Date(now)
    weekEnd.setDate(now.getDate() - w * 7)
    const weekStart = new Date(weekEnd)
    weekStart.setDate(weekEnd.getDate() - 6)
    weekStart.setHours(0, 0, 0, 0)
    weekEnd.setHours(23, 59, 59, 999)

    const mins = sessions
      .filter((s) => {
        const d = new Date(s.logged_at)
        return d >= weekStart && d <= weekEnd
      })
      .reduce((sum, s) => sum + s.duration_mins, 0)

    const label = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    weeklyHoursData.push({ week: label, hours: Math.round((mins / 60) * 10) / 10 })
  }

  // Daily goal progress (2h default)
  const dailyGoalMinutes = 120
  const dailyProgress = Math.min(100, Math.round((stats.todayMinutes / dailyGoalMinutes) * 100))

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-slide-up">
      <div>
        <h2 className="text-[22px] font-[900] text-[#3B3F5C] tracking-[-0.03em]">Analytics</h2>
        <p className="text-[13px] font-medium text-[#7B80A0] mt-0.5">Deep insights into your progress 📊</p>
      </div>

      {/* Key Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[18px]">
        {[
          {
            label: 'Total Hours',
            value: `${totalHours}h`,
            icon: <Clock size={20} />,
            gradient: "linear-gradient(135deg, #7EDCB5, #5EC8A0, #3DB889)",
            shadow: "4px 4px 10px rgba(94,200,160,0.25), -2px -2px 6px rgba(255,255,255,0.6)",
          },
          {
            label: 'Total XP',
            value: `${stats.totalXP.toLocaleString()}`,
            icon: <Zap size={20} />,
            gradient: "linear-gradient(135deg, #9D93F9, #7C6FF7, #5B51E0)",
            shadow: "4px 4px 10px rgba(92,81,224,0.25), -2px -2px 6px rgba(255,255,255,0.6)",
          },
          {
            label: 'Sessions',
            value: `${totalSessions}`,
            icon: <BarChart3 size={20} />,
            gradient: "linear-gradient(135deg, #FFB88C, #F7A97C, #E8926A)",
            shadow: "4px 4px 10px rgba(247,169,124,0.25), -2px -2px 6px rgba(255,255,255,0.6)",
          },
          {
            label: 'Avg Duration',
            value: `${avgDuration}m`,
            icon: <Target size={20} />,
            gradient: "linear-gradient(135deg, #F5A0C0, #F07AAB, #E65A96)",
            shadow: "4px 4px 10px rgba(240,122,171,0.25), -2px -2px 6px rgba(255,255,255,0.6)",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-[22px] hover:-translate-y-0.5 hover:shadow-neu-hover transition-all duration-220"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-[#A8ABBE] uppercase tracking-[0.1em] mb-1.5">{stat.label}</p>
                <p className="text-[30px] font-[900] leading-none tracking-[-0.04em] text-[#3B3F5C]">{stat.value}</p>
              </div>
              <div
                className="flex items-center justify-center w-11 h-11 rounded-[10px] shrink-0 text-white"
                style={{ background: stat.gradient, boxShadow: stat.shadow }}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[18px]">
        {/* Weekly Hours Chart */}
        <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-[22px] hover:-translate-y-0.5 hover:shadow-neu-hover transition-all duration-220">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#3B3F5C]">This Week</h3>
              <p className="text-xs font-medium text-[#7B80A0]">Daily breakdown</p>
            </div>
            <span className="text-[26px] font-[900] tracking-[-0.04em] bg-gradient-to-br from-[#9D93F9] to-[#5B51E0] bg-clip-text text-transparent">
              {stats.weeklyHours}h
            </span>
          </div>
          <div style={{ height: '160px' }}>
            <WeeklyChart data={stats.weeklyChartData} />
          </div>
        </div>

        {/* Skill Distribution */}
        <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-[22px] hover:-translate-y-0.5 hover:shadow-neu-hover transition-all duration-220">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#3B3F5C]">Skill Breakdown</h3>
            <p className="text-xs font-medium text-[#7B80A0]">All time · {totalHours}h total</p>
          </div>
          <SkillDistribution distribution={stats.skillDistribution} />
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[18px]">
        {/* Today's Progress */}
        <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-[22px]">
          <h3 className="text-sm font-bold text-[#3B3F5C] mb-3">Today&apos;s Progress</h3>
          <div className="flex items-end justify-between mb-3">
            <span className="text-[26px] font-[900] tracking-[-0.04em] text-[#3B3F5C]">
              {Math.round((stats.todayMinutes / 60) * 10) / 10}h
            </span>
            <span className="text-xs font-semibold text-[#A8ABBE]">
              / {Math.round((dailyGoalMinutes / 60) * 10) / 10}h goal
            </span>
          </div>
          <ProgressBar value={dailyProgress} showValue color="purple" />
        </div>

        {/* Streak */}
        <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-[22px]">
          <h3 className="text-sm font-bold text-[#3B3F5C] mb-3">Current Streak</h3>
          <p className="text-[36px] font-[900] tracking-[-0.04em] text-[#3B3F5C] leading-none">
            {stats.streak}
          </p>
          <p className="text-xs font-semibold text-[#7B80A0] mt-1">
            {stats.streak === 1 ? 'day' : 'days'} in a row {stats.streak > 0 ? '🔥' : ''}
          </p>
        </div>

        {/* Longest Session */}
        <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-[22px]">
          <h3 className="text-sm font-bold text-[#3B3F5C] mb-3">Longest Session</h3>
          <p className="text-[36px] font-[900] tracking-[-0.04em] text-[#3B3F5C] leading-none">
            {longestSession > 0 ? `${longestSession}m` : '–'}
          </p>
          <p className="text-xs font-semibold text-[#7B80A0] mt-1">
            {longestSession > 0 ? `${Math.round((longestSession / 60) * 10) / 10}h personal best` : 'No sessions logged'}
          </p>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-[22px]">
        <h3 className="text-sm font-bold text-[#3B3F5C] mb-4">Last 4 Weeks</h3>
        <div className="space-y-3">
          {weeklyHoursData.map((w) => (
            <div key={w.week} className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#7B80A0] w-20 shrink-0">{w.week}</span>
              <div
                className="flex-1 h-3 rounded-full overflow-hidden bg-[#E8EAF0]"
                style={{ boxShadow: "inset 3px 3px 8px #C5C8D6, inset -3px -3px 8px #FFFFFF" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, (w.hours / 40) * 100)}%`,
                    background: "linear-gradient(135deg, #9D93F9, #7C6FF7, #5B51E0)",
                    boxShadow: "0 0 8px rgba(125, 111, 247, 0.4)",
                  }}
                />
              </div>
              <span className="text-xs font-bold text-[#3B3F5C] w-10 text-right shrink-0">{w.hours}h</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
