export default function FriendsPage() {
    return (
        <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-slide-up">
            <div>
                <h2 className="text-xl font-bold text-text-primary">Friends</h2>
                <p className="text-sm text-text-secondary mt-0.5">Your accountability squad 👥</p>
            </div>
            <div className="bg-white rounded-2xl border border-border shadow-card p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[300px]">
                <span className="text-4xl">👥</span>
                <h3 className="text-base font-semibold text-text-primary">Friends coming soon</h3>
                <p className="text-sm text-text-secondary max-w-xs">
                    Add friends, compare progress, and challenge each other will live here.
                </p>
            </div>
        </div>
    );
}
