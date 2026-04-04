"use client"

import { useSessions } from '@/hooks/useSessions'
import { useGoals } from '@/hooks/useGoals'
import { useAuth } from '@/lib/AuthContext'
import { StatCard, ICON_STYLES } from '@/components/dashboard/StatCard'
import { WeeklyChart } from '@/components/dashboard/WeeklyChart'
import { GoalsProgress } from '@/components/dashboard/GoalsProgress'
import { Heatmap } from '@/components/dashboard/Heatmap'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { SkillDistribution } from '@/components/dashboard/SkillDistribution'
import { TodayFocusCard } from '@/components/dashboard/TodayFocusCard'
import { Zap, Clock, Flame, Trophy } from 'lucide-react'

function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto animate-pulse">
      <div className="h-10 bg-[#E8EAF0] rounded-[18px] w-48" style={{ boxShadow: "inset 4px 4px 10px #C5C8D6, inset -4px -4px 10px #FFFFFF" }} />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[18px]">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-[#E8EAF0] rounded-[18px]" style={{ boxShadow: "inset 4px 4px 10px #C5C8D6, inset -4px -4px 10px #FFFFFF" }} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-[18px]">
        <div className="lg:col-span-3 h-56 bg-[#E8EAF0] rounded-[18px]" style={{ boxShadow: "inset 4px 4px 10px #C5C8D6, inset -4px -4px 10px #FFFFFF" }} />
        <div className="lg:col-span-2 h-56 bg-[#E8EAF0] rounded-[18px]" style={{ boxShadow: "inset 4px 4px 10px #C5C8D6, inset -4px -4px 10px #FFFFFF" }} />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { profile } = useAuth()
  const { sessions, stats, loading: sessionsLoading } = useSessions()
  const { goals, addGoal } = useGoals()

  if (sessionsLoading) return <DashboardSkeleton />

  const totalHours = Math.round((stats.totalXP / 60) * 10) / 10
  const weeklyTotal = stats.weeklyHours
  const totalSessions = sessions.length

  const weekLabel = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(
    (() => { const d = new Date(); d.setDate(d.getDate() - (d.getDay() === 0 ? 6 : d.getDay() - 1)); return d })()
  )

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">

      {/* Header */}
      <div className="animate-fade-slide-up">
        <h2 className="text-[22px] font-[900] text-[#3B3F5C] tracking-[-0.03em]">Your Dashboard</h2>
        <p className="text-[13px] font-medium text-[#7B80A0] mt-0.5">
          Week of {weekLabel} — {stats.streak > 0 ? `${stats.streak} day streak 🔥` : 'Start your streak today!'}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[18px]">
        <div className="animate-fade-slide-up stagger-1">
          <StatCard
            label="Total XP"
            value={`${stats.totalXP.toLocaleString()} XP`}
            numericValue={stats.totalXP}
            icon={<Zap size={20} />}
            trend={stats.totalXP > 0 ? { value: `${totalHours}h total`, positive: true } : undefined}
            iconGradient={ICON_STYLES.purple.gradient}
            iconShadow={ICON_STYLES.purple.shadow}
          />
        </div>
        <div className="animate-fade-slide-up stagger-2">
          <StatCard
            label="Hours This Week"
            value={`${weeklyTotal}h`}
            numericValue={Math.round(weeklyTotal)}
            icon={<Clock size={20} />}
            trend={weeklyTotal > 0 ? { value: `${totalSessions} total sessions`, positive: true } : undefined}
            iconGradient={ICON_STYLES.green.gradient}
            iconShadow={ICON_STYLES.green.shadow}
          />
        </div>
        <div className="animate-fade-slide-up stagger-3">
          <StatCard
            label="Current Streak"
            value={`${stats.streak} day${stats.streak !== 1 ? 's' : ''} 🔥`}
            numericValue={stats.streak}
            icon={<Flame size={20} />}
            trend={stats.streak > 0 ? { value: 'Keep it up!', positive: true } : undefined}
            iconGradient={ICON_STYLES.orange.gradient}
            iconShadow={ICON_STYLES.orange.shadow}
          />
        </div>
        <div className="animate-fade-slide-up stagger-4">
          <StatCard
            label="Sessions Logged"
            value={`${totalSessions}`}
            numericValue={totalSessions}
            icon={<Trophy size={20} />}
            trend={totalSessions > 0 ? { value: 'All time', positive: true } : undefined}
            iconGradient={ICON_STYLES.pink.gradient}
            iconShadow={ICON_STYLES.pink.shadow}
          />
        </div>
      </div>

      {/* Today Focus + Weekly Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-[18px]">
        <div className="lg:col-span-2 animate-fade-slide-up stagger-2">
          <TodayFocusCard todayMinutes={stats.todayMinutes} />
        </div>

        <div className="lg:col-span-3 animate-fade-slide-up stagger-3">
          <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-[22px] h-full hover:-translate-y-0.5 hover:shadow-neu-hover transition-all duration-220">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#3B3F5C]">Weekly Hours</h3>
                <p className="text-xs font-medium text-[#7B80A0]">Daily breakdown · this week</p>
              </div>
              <span className="text-[26px] font-[900] tracking-[-0.04em] bg-gradient-to-br from-[#9D93F9] to-[#5B51E0] bg-clip-text text-transparent">{weeklyTotal}h</span>
            </div>
            <div style={{ height: '160px' }}>
              <WeeklyChart data={stats.weeklyChartData} />
            </div>
          </div>
        </div>
      </div>

      {/* Skill Distribution + Goals Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[18px]">
        <div className="animate-fade-slide-up stagger-4">
          <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-[22px] h-full hover:-translate-y-0.5 hover:shadow-neu-hover transition-all duration-220">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-[#3B3F5C]">Skill Mix</h3>
              <p className="text-xs font-medium text-[#7B80A0]">All time · {totalHours}h total</p>
            </div>
            <SkillDistribution distribution={stats.skillDistribution} />
          </div>
        </div>

        <div className="animate-fade-slide-up stagger-4">
          <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-[22px] h-full hover:-translate-y-0.5 hover:shadow-neu-hover transition-all duration-220">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#3B3F5C]">Daily Goals</h3>
                <p className="text-xs font-medium text-[#7B80A0]">Today&apos;s progress</p>
              </div>
              <button
                onClick={() => addGoal('New goal', 120)}
                className="text-xs font-bold bg-gradient-to-br from-[#9D93F9] to-[#5B51E0] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                + Add goal
              </button>
            </div>
            <GoalsProgress goals={goals} sessions={sessions} />
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="animate-fade-slide-up stagger-5">
        <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-[22px] hover:-translate-y-0.5 hover:shadow-neu-hover transition-all duration-220">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#3B3F5C]">Recent Sessions</h3>
            <p className="text-xs font-medium text-[#7B80A0]">Your last 5 logs</p>
          </div>
          <ActivityFeed sessions={sessions} username={profile?.username ?? 'You'} />
        </div>
      </div>

      {/* Heatmap */}
      <div className="animate-fade-slide-up stagger-6">
        <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-[22px] hover:-translate-y-0.5 hover:shadow-neu-hover transition-all duration-220">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#3B3F5C]">Activity Heatmap</h3>
              <p className="text-xs font-medium text-[#7B80A0]">12 months · session frequency</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#7B80A0] font-medium">
              <span className="font-bold text-[#3B3F5C]">{totalSessions}</span> sessions this year
            </div>
          </div>
          <Heatmap data={stats.heatmapData} />
        </div>
      </div>
    </div>
  )
}
