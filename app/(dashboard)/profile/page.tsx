import { MOCK_USER } from "@/constants/config";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function ProfilePage() {
    const xpPct = Math.round((MOCK_USER.xp / MOCK_USER.xpToNext) * 100);

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-slide-up">
            <div>
                <h2 className="text-xl font-bold text-text-primary">Profile</h2>
                <p className="text-sm text-text-secondary mt-0.5">Your GrindSpace identity</p>
            </div>

            {/* Profile card */}
            <div className="bg-white rounded-2xl border border-border shadow-card p-6 flex flex-col sm:flex-row gap-6 items-start">
                <Avatar name={MOCK_USER.name} size="xl" />
                <div className="flex-1 space-y-3">
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">{MOCK_USER.name}</h3>
                        <p className="text-sm text-text-secondary">@{MOCK_USER.username}</p>
                    </div>
                    <div className="flex gap-6 text-sm">
                        <div>
                            <p className="font-semibold text-text-primary">Level {MOCK_USER.level}</p>
                            <p className="text-xs text-text-secondary">Current level</p>
                        </div>
                        <div>
                            <p className="font-semibold text-text-primary">{MOCK_USER.streak} days</p>
                            <p className="text-xs text-text-secondary">Streak 🔥</p>
                        </div>
                        <div>
                            <p className="font-semibold text-text-primary">#{MOCK_USER.rank}</p>
                            <p className="text-xs text-text-secondary">Global rank</p>
                        </div>
                    </div>
                    <div className="max-w-sm">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-text-primary">{MOCK_USER.xp.toLocaleString()} XP</span>
                            <span className="text-text-secondary">{MOCK_USER.xpToNext.toLocaleString()} XP to Level {MOCK_USER.level + 1}</span>
                        </div>
                        <ProgressBar value={xpPct} showValue={false} />
                    </div>
                </div>
            </div>
        </div>
    );
}
