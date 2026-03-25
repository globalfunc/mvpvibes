import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { utcToLocalTime } from '@/lib/slot-utils';

type Session = {
    id: number;
    name: string;
    email: string;
    idea: string | null;
    start_utc: string;
    end_utc: string;
    proposed_start_utc: string | null;
    proposed_end_utc: string | null;
    status: string;
    reschedule_reason: string | null;
};

type PaginatedSessions = {
    data: Session[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    current_page: number;
    last_page: number;
};

type Props = {
    sessions: PaginatedSessions;
    adminTimezone: string;
    filters: { status: string };
};

const STATUS_TABS = ['all', 'pending', 'confirmed', 'rescheduled', 'cancelled'];

const STATUS_COLORS: Record<string, string> = {
    pending:     'bg-amber-500/15 text-amber-400 border-amber-500/20',
    confirmed:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    rescheduled: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    cancelled:   'bg-red-500/15 text-red-400/70 border-red-500/20',
};

function formatDateTime(utcIso: string, timezone: string) {
    const d = new Date(utcIso);
    const date = d.toLocaleDateString('en-GB', { timeZone: timezone, weekday: 'short', month: 'short', day: 'numeric' });
    const time = d.toLocaleTimeString('en-GB', { timeZone: timezone, hour: '2-digit', minute: '2-digit' });
    return `${date} ${time}`;
}

// ── Cancel Modal ──────────────────────────────────────────────────────────────
function CancelModal({ session, onClose, adminTimezone }: { session: Session; onClose: () => void; adminTimezone: string }) {
    const [reason, setReason] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) return;
        setProcessing(true);
        router.delete(`/admin/booked-sessions/${session.id}`, {
            data: { reason },
            onSuccess: onClose,
            onFinish: () => setProcessing(false),
            preserveScroll: true,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md bg-background border border-border p-6 flex flex-col gap-4">
                <h3 className="font-semibold">Cancel Session</h3>
                <p className="text-sm text-muted-foreground">
                    {session.name} — {formatDateTime(session.start_utc, adminTimezone)}
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
                            Reason (sent to client)
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            required
                            className="w-full bg-transparent border border-input px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-border hover:border-primary transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || !reason.trim()}
                            className="px-4 py-2 text-sm bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 disabled:opacity-50 transition-colors"
                        >
                            {processing ? 'Cancelling…' : 'Confirm Cancel'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Reschedule Modal ──────────────────────────────────────────────────────────
function RescheduleModal({ session, onClose, adminTimezone }: { session: Session; onClose: () => void; adminTimezone: string }) {
    const [reason, setReason] = useState('');
    const [proposedDate, setProposedDate] = useState('');
    const [proposedTime, setProposedTime] = useState('');
    const [durationMin, setDurationMin] = useState(60);
    const [processing, setProcessing] = useState(false);

    const proposedStartUtc = proposedDate && proposedTime
        ? new Date(`${proposedDate}T${proposedTime}:00`).toISOString()
        : null;
    const proposedEndUtc = proposedStartUtc
        ? new Date(new Date(proposedStartUtc).getTime() + durationMin * 60000).toISOString()
        : null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim() || !proposedStartUtc || !proposedEndUtc) return;
        setProcessing(true);
        router.post(`/admin/booked-sessions/${session.id}/reschedule`, {
            reason,
            proposed_start_utc: proposedStartUtc,
            proposed_end_utc: proposedEndUtc,
        }, {
            onSuccess: onClose,
            onFinish: () => setProcessing(false),
            preserveScroll: true,
        });
    };

    const canSubmit = reason.trim() && proposedDate && proposedTime && !processing;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md bg-background border border-border p-6 flex flex-col gap-4">
                <h3 className="font-semibold">Reschedule Session</h3>
                <p className="text-sm text-muted-foreground">
                    {session.name} — {formatDateTime(session.start_utc, adminTimezone)}
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
                            Reason (sent to client)
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={2}
                            required
                            className="w-full bg-transparent border border-input px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
                                Proposed date
                            </label>
                            <input
                                type="date"
                                value={proposedDate}
                                onChange={(e) => setProposedDate(e.target.value)}
                                required
                                className="w-full bg-transparent border border-input px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
                                Time ({adminTimezone})
                            </label>
                            <input
                                type="time"
                                value={proposedTime}
                                onChange={(e) => setProposedTime(e.target.value)}
                                required
                                className="w-full bg-transparent border border-input px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
                            Duration (min)
                        </label>
                        <select
                            value={durationMin}
                            onChange={(e) => setDurationMin(Number(e.target.value))}
                            className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none"
                        >
                            {[15, 30, 60, 120].map((v) => <option key={v} value={v}>{v} min</option>)}
                        </select>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-border hover:border-primary transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className="px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            {processing ? 'Sending…' : 'Send Proposal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminBookedSessions({ sessions, adminTimezone, filters }: Props) {
    const { flash } = usePage().props as { flash?: { success?: string } };
    const [cancelSession, setCancelSession] = useState<Session | null>(null);
    const [rescheduleSession, setRescheduleSession] = useState<Session | null>(null);

    const handleTabChange = (status: string) => {
        router.get('/admin/booked-sessions', { status }, { preserveScroll: true, replace: true });
    };

    return (
        <AdminLayout title="Booked Sessions">
            {flash?.success && (
                <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                    {flash.success}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 border-b border-border">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`px-4 py-2.5 text-xs font-medium uppercase tracking-wider capitalize transition-colors
                            ${filters.status === tab
                                ? 'border-b-2 border-primary text-foreground -mb-px'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="border border-border overflow-x-auto">
                {sessions.data.length === 0 ? (
                    <div className="px-6 py-12 text-center text-muted-foreground text-sm">No sessions found.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                                <th className="text-left px-6 py-3">Date / Time</th>
                                <th className="text-left px-6 py-3">Name</th>
                                <th className="text-left px-6 py-3">Email</th>
                                <th className="text-left px-6 py-3">Idea</th>
                                <th className="text-left px-6 py-3">Status</th>
                                <th className="text-right px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.data.map((session) => (
                                <tr key={session.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs whitespace-nowrap">
                                        {formatDateTime(session.start_utc, adminTimezone)}
                                    </td>
                                    <td className="px-6 py-4 font-medium">{session.name}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{session.email}</td>
                                    <td className="px-6 py-4 text-muted-foreground max-w-48 truncate" title={session.idea ?? ''}>
                                        {session.idea ? (session.idea.length > 40 ? session.idea.slice(0, 40) + '…' : session.idea) : '—'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border ${STATUS_COLORS[session.status] ?? 'border-border text-muted-foreground'}`}>
                                            {session.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            {session.status !== 'cancelled' && (
                                                <>
                                                    <button
                                                        onClick={() => setRescheduleSession(session)}
                                                        className="px-3 py-1 text-xs border border-border hover:border-blue-400 hover:text-blue-400 transition-colors"
                                                    >
                                                        Reschedule
                                                    </button>
                                                    <button
                                                        onClick={() => setCancelSession(session)}
                                                        className="px-3 py-1 text-xs border border-border hover:border-red-400 hover:text-red-400 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {sessions.last_page > 1 && (
                <div className="flex gap-1">
                    {sessions.links.map((link, i) => (
                        <button
                            key={i}
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                            className={`px-3 py-1.5 text-xs border transition-colors
                                ${link.active ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:border-foreground'}
                                disabled:opacity-30 disabled:cursor-not-allowed`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            {cancelSession && (
                <CancelModal
                    session={cancelSession}
                    adminTimezone={adminTimezone}
                    onClose={() => setCancelSession(null)}
                />
            )}
            {rescheduleSession && (
                <RescheduleModal
                    session={rescheduleSession}
                    adminTimezone={adminTimezone}
                    onClose={() => setRescheduleSession(null)}
                />
            )}
        </AdminLayout>
    );
}
