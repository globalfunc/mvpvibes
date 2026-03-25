import AdminLayout from '@/layouts/admin-layout';

type Stats = {
    total: number;
    pending: number;
    upcoming: number;
    cancelled: number;
};

type Session = {
    id: number;
    name: string;
    email: string;
    start_utc: string;
    end_utc: string;
    status: string;
};

type Props = {
    stats: Stats;
    recent: Session[];
    adminTimezone: string;
};

const STATUS_COLORS: Record<string, string> = {
    pending:     'bg-amber-500/15 text-amber-400 border-amber-500/20',
    confirmed:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    rescheduled: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    cancelled:   'bg-red-500/15 text-red-400/70 border-red-500/20',
};

function formatDateTime(utcIso: string, timezone: string): { date: string; time: string } {
    const d = new Date(utcIso);
    const date = d.toLocaleDateString('en-GB', { timeZone: timezone, weekday: 'short', month: 'short', day: 'numeric' });
    const time = d.toLocaleTimeString('en-GB', { timeZone: timezone, hour: '2-digit', minute: '2-digit' });
    return { date, time };
}

export default function Dashboard({ stats, recent, adminTimezone }: Props) {
    const statCards = [
        { label: 'Total',     value: stats.total,     icon: 'calendar_month' },
        { label: 'Pending',   value: stats.pending,   icon: 'hourglass_empty', highlight: true },
        { label: 'Upcoming',  value: stats.upcoming,  icon: 'event_upcoming' },
        { label: 'Cancelled', value: stats.cancelled, icon: 'cancel' },
    ];

    return (
        <AdminLayout title="Dashboard">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map(({ label, value, icon, highlight }) => (
                    <div
                        key={label}
                        className={`border p-6 flex flex-col gap-3 ${highlight && value > 0 ? 'border-amber-500/30 bg-amber-500/5' : 'border-border'}`}
                    >
                        <span className={`material-symbols-outlined text-2xl ${highlight && value > 0 ? 'text-amber-400' : 'text-muted-foreground'}`}>
                            {icon}
                        </span>
                        <div>
                            <div className="text-3xl font-bold tracking-tight">{value}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border border-border">
                <div className="px-6 py-4 border-b border-border">
                    <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Recent Sessions</h2>
                </div>

                {recent.length === 0 ? (
                    <div className="px-6 py-12 text-center text-muted-foreground text-sm">No sessions yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                                    <th className="text-left px-6 py-3">Date</th>
                                    <th className="text-left px-6 py-3">Time</th>
                                    <th className="text-left px-6 py-3">Name</th>
                                    <th className="text-left px-6 py-3">Email</th>
                                    <th className="text-left px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent.map((session) => {
                                    const { date, time } = formatDateTime(session.start_utc, adminTimezone);
                                    return (
                                        <tr key={session.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 font-medium">{date}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{time}</td>
                                            <td className="px-6 py-4">{session.name}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{session.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border ${STATUS_COLORS[session.status] ?? 'border-border text-muted-foreground'}`}>
                                                    {session.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
