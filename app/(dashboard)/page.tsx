"use client"

import { useSessions } from '@/hooks/useSessions'
import { useGoals } from '@/hooks/useGoals'
import { useAuth } from '@/lib/AuthContext'
import { StatCard } from '@/components/dashboard/StatCard'
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
      <div className="h-10 bg-gray-100 rounded-xl w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 h-56 bg-gray-100 rounded-2xl" />
        <div className="lg:col-span-2 h-56 bg-gray-100 rounded-2xl" />
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
        <h2 className="text-xl font-bold text-text-primary">Your Dashboard</h2>
        <p className="text-sm text-text-secondary mt-0.5">
          Week of {weekLabel} — {stats.streak > 0 ? `${stats.streak} day streak 🔥` : 'Start your streak today!'}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="animate-fade-slide-up stagger-1">
          <StatCard
            label="Total XP"
            value={`${stats.totalXP.toLocaleString()} XP`}
            numericValue={stats.totalXP}
            icon={<Zap size={18} />}
            trend={stats.totalXP > 0 ? { value: `${totalHours}h total`, positive: true } : undefined}
            accent
          />
        </div>
        <div className="animate-fade-slide-up stagger-2">
          <StatCard
            label="Hours This Week"
            value={`${weeklyTotal}h`}
            numericValue={Math.round(weeklyTotal)}
            icon={<Clock size={18} />}
            trend={weeklyTotal > 0 ? { value: `${totalSessions} total sessions`, positive: true } : undefined}
          />
        </div>
        <div className="animate-fade-slide-up stagger-3">
          <StatCard
            label="Current Streak"
            value={`${stats.streak} day${stats.streak !== 1 ? 's' : ''} 🔥`}
            numericValue={stats.streak}
            icon={<Flame size={18} />}
            trend={stats.streak > 0 ? { value: 'Keep it up!', positive: true } : undefined}
          />
        </div>
        <div className="animate-fade-slide-up stagger-4">
          <StatCard
            label="Sessions Logged"
            value={`${totalSessions}`}
            numericValue={totalSessions}
            icon={<Trophy size={18} />}
            trend={totalSessions > 0 ? { value: 'All time', positive: true } : undefined}
          />
        </div>
      </div>

      {/* Today Focus + Weekly Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Today focus — 2/5 */}
        <div className="lg:col-span-2 animate-fade-slide-up stagger-2">
          <TodayFocusCard todayMinutes={stats.todayMinutes} />
        </div>

        {/* Weekly Chart — 3/5 */}
        <div className="lg:col-span-3 animate-fade-slide-up stagger-3">
          <div className="bg-white rounded-2xl border border-border shadow-card p-5 h-full hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Weekly Hours</h3>
                <p className="text-xs text-text-secondary">Daily breakdown · this week</p>
              </div>
              <span className="text-2xl font-bold text-accent">{weeklyTotal}h</span>
            </div>
            <div style={{ height: '160px' }}>
              <WeeklyChart data={stats.weeklyChartData} />
            </div>
          </div>
        </div>
      </div>

      {/* Skill Distribution + Goals Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Skill Distribution */}
        <div className="animate-fade-slide-up stagger-4">
          <div className="bg-white rounded-2xl border border-border shadow-card p-5 h-full hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-text-primary">Skill Mix</h3>
              <p className="text-xs text-text-secondary">All time · {totalHours}h total</p>
            </div>
            <SkillDistribution distribution={stats.skillDistribution} />
          </div>
        </div>

        {/* Goals */}
        <div className="animate-fade-slide-up stagger-4">
          <div className="bg-white rounded-2xl border border-border shadow-card p-5 h-full hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Daily Goals</h3>
                <p className="text-xs text-text-secondary">Today&apos;s progress</p>
              </div>
              <button
                onClick={() => addGoal('New goal', 120)}
                className="text-xs text-accent font-medium hover:underline"
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
        <div className="bg-white rounded-2xl border border-border shadow-card p-5 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Recent Sessions</h3>
            <p className="text-xs text-text-secondary">Your last 5 logs</p>
          </div>
          <ActivityFeed sessions={sessions} username={profile?.username ?? 'You'} />
        </div>
      </div>

      {/* Heatmap */}
      <div className="animate-fade-slide-up stagger-6">
        <div className="bg-white rounded-2xl border border-border shadow-card p-5 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Activity Heatmap</h3>
              <p className="text-xs text-text-secondary">12 months · session frequency</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <span className="font-semibold text-text-primary">{totalSessions}</span> sessions this year
            </div>
          </div>
          <Heatmap data={stats.heatmapData} />
        </div>
      </div>
    </div>
  )
}
