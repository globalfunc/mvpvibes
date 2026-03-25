import { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import BookingCalendar from '@/components/booking-calendar';
import TimezoneSelector from '@/components/timezone-selector';
import type { DaySchedule, TimeSlot, SlotDateTime } from '@/types/booking';
import { groupSlotsByDate } from '@/lib/slot-utils';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    prefillData?: { name: string; email: string };
    proposedStartUtc?: string;
    proposedEndUtc?: string;
    rescheduleSessionId?: number;
    rescheduleConfirmUrl?: string;
    rebookSessionId?: number;
}

export default function BookingModal({
    isOpen,
    onClose,
    prefillData,
    proposedStartUtc,
    proposedEndUtc,
    rescheduleSessionId,
    rescheduleConfirmUrl,
    rebookSessionId,
}: BookingModalProps) {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [schedule, setSchedule] = useState<DaySchedule[]>([]);
    const [loadingSchedule, setLoadingSchedule] = useState(false);

    const [userTimezone, setUserTimezone] = useState(
        () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    );

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [name, setName] = useState(prefillData?.name ?? '');
    const [email, setEmail] = useState(prefillData?.email ?? '');
    const [idea, setIdea] = useState('');

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const isReschedule = !!rescheduleSessionId && !!rescheduleConfirmUrl;
    const isPrefilled = !!prefillData;

    // Fetch schedule from API
    const fetchSchedule = async (tz: string) => {
        setLoadingSchedule(true);
        try {
            const res = await fetch('/api/booking/schedule');
            const data = await res.json();
            const grouped = groupSlotsByDate(data.slots as SlotDateTime[], tz);
            setSchedule(grouped);

            // Pre-select proposed slot if provided
            if (proposedStartUtc && proposedEndUtc) {
                for (const day of grouped) {
                    const slot = day.slots.find((s) => s.startUtc === proposedStartUtc);
                    if (slot) {
                        setSelectedDate(day.date);
                        setSelectedSlot(slot);
                        break;
                    }
                }
            }
        } finally {
            setLoadingSchedule(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
            document.body.style.overflow = 'hidden';
            fetchSchedule(userTimezone);
            // Prefill from props
            if (prefillData) {
                setName(prefillData.name);
                setEmail(prefillData.email);
            }
        } else {
            setVisible(false);
            const timer = setTimeout(() => {
                setMounted(false);
                setSubmitted(false);
                setSelectedDate(null);
                setSelectedSlot(null);
                setName('');
                setEmail('');
                setIdea('');
                setFieldErrors({});
                setSchedule([]);
            }, 300);
            document.body.style.overflow = '';
            return () => clearTimeout(timer);
        }
        return () => { document.body.style.overflow = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Re-group when timezone changes
    const handleTimezoneChange = async (tz: string) => {
        setUserTimezone(tz);
        setSelectedDate(null);
        setSelectedSlot(null);
        await fetchSchedule(tz);
    };

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const canSubmit = !!(selectedDate && selectedSlot && name.trim() && email.trim()) && !submitting;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit || !selectedSlot) return;

        setFieldErrors({});
        setSubmitting(true);

        try {
            if (isReschedule && rescheduleConfirmUrl) {
                // Confirm reschedule — POST to the signed URL passed from the server
                const res = await fetch(rescheduleConfirmUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-XSRF-TOKEN': getCsrfToken(),
                    },
                    body: JSON.stringify({}),
                });
                if (res.ok) {
                    setSubmitted(true);
                } else {
                    const data = await res.json();
                    setFieldErrors({ start_utc: data.error ?? 'Failed to confirm reschedule.' });
                }
            } else {
                // Regular booking or rebook
                const res = await fetch('/api/booking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-XSRF-TOKEN': getCsrfToken(),
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim(),
                        idea: idea.trim(),
                        start_utc: selectedSlot.startUtc,
                        end_utc: selectedSlot.endUtc,
                    }),
                });

                if (res.status === 201) {
                    setSubmitted(true);
                } else if (res.status === 422) {
                    const data = await res.json();
                    const errors: Record<string, string> = {};
                    for (const [key, msgs] of Object.entries(data.errors ?? {})) {
                        errors[key] = (msgs as string[])[0];
                    }
                    setFieldErrors(errors);
                } else {
                    setFieldErrors({ start_utc: 'Something went wrong. Please try again.' });
                }
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        setSelectedSlot(null);
    };

    if (!mounted) return null;

    const successTitle = isReschedule ? 'New booking confirmed!' : t('booking.success_title');

    return (
        <div
            className={`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 md:p-8 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/85 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal panel */}
            <div
                className={`relative w-full max-w-5xl bg-background border border-white/10 my-4 transition-all duration-300 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
            >
                {/* Header */}
                <div className="flex items-start justify-between px-8 md:px-12 py-8 border-b border-white/10">
                    <div>
                        <p className="text-[10px] font-headline uppercase tracking-[0.4em] text-white/30 mb-2">
                            {t('booking.header_label')}
                        </p>
                        <h2 className="font-headline font-bold text-3xl md:text-4xl text-white tracking-tight leading-none">
                            {t('booking.title')}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-12 h-12 border border-white/20 flex items-center justify-center text-white/50
                                   hover:border-white/60 hover:text-white transition-colors shrink-0 ml-6"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {submitted ? (
                    // ── Success state ──────────────────────────────────────
                    <div className="flex flex-col items-center justify-center px-12 py-24 text-center gap-8">
                        <div className="relative">
                            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-emerald-400 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    check_circle
                                </span>
                            </div>
                            <div className="absolute inset-0 bg-emerald-400/20 blur-xl animate-pulse" />
                        </div>
                        <div>
                            <h3 className="font-headline font-bold text-3xl text-white mb-3 tracking-tight">
                                {successTitle}
                            </h3>
                            <p className="text-white/50 font-body text-base max-w-md leading-relaxed">
                                <Trans
                                    i18nKey="booking.success_message"
                                    values={{ email }}
                                    components={[<span />, <span className="text-emerald-400" />]}
                                />
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="border border-white/20 text-white/60 font-headline text-sm tracking-widest uppercase px-10 py-4 hover:border-white/50 hover:text-white transition-colors"
                        >
                            {t('booking.close')}
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Proposed time banner */}
                        {isReschedule && proposedStartUtc && (
                            <div className="px-8 md:px-12 py-4 bg-emerald-500/10 border-b border-emerald-500/20">
                                <p className="text-emerald-400 text-sm font-headline tracking-wide">
                                    <span className="material-symbols-outlined text-base align-middle mr-2" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                                    Admin proposed a new time — review it below and confirm.
                                </p>
                            </div>
                        )}

                        {/* Calendar section */}
                        <div className="px-8 md:px-12 py-10 border-b border-white/10">
                            {loadingSchedule ? (
                                <div className="flex items-center justify-center h-48 gap-3 text-white/30">
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                    <span className="font-headline text-sm tracking-widest uppercase">Loading schedule…</span>
                                </div>
                            ) : (
                                <BookingCalendar
                                    schedule={schedule}
                                    selectedDate={selectedDate}
                                    selectedSlot={selectedSlot}
                                    onDateSelect={handleDateSelect}
                                    onSlotSelect={setSelectedSlot}
                                    userTimezone={userTimezone}
                                />
                            )}

                            {/* Timezone selector */}
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <TimezoneSelector
                                    label="Your timezone"
                                    value={userTimezone}
                                    onChange={handleTimezoneChange}
                                    className="max-w-sm"
                                />
                            </div>

                            {fieldErrors.start_utc && (
                                <p className="text-red-400 text-xs mt-3">{fieldErrors.start_utc}</p>
                            )}
                        </div>

                        {/* Form section */}
                        <form onSubmit={handleSubmit} className="px-8 md:px-12 py-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div>
                                    <label className="block text-[10px] font-headline uppercase tracking-[0.35em] text-white/35 mb-3">
                                        {t('booking.label_name')}
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        readOnly={isPrefilled}
                                        placeholder={t('booking.placeholder_name')}
                                        className={`w-full bg-transparent border border-white/15 px-5 py-4 text-white font-body text-base
                                                   placeholder:text-white/20 focus:outline-none focus:border-emerald-400/60 transition-colors
                                                   ${isPrefilled ? 'opacity-60 cursor-default' : ''}`}
                                    />
                                    {fieldErrors.name && (
                                        <p className="text-red-400 text-xs mt-1.5">{fieldErrors.name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-headline uppercase tracking-[0.35em] text-white/35 mb-3">
                                        {t('booking.label_email')}
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        readOnly={isPrefilled}
                                        placeholder={t('booking.placeholder_email')}
                                        className={`w-full bg-transparent border border-white/15 px-5 py-4 text-white font-body text-base
                                                   placeholder:text-white/20 focus:outline-none focus:border-emerald-400/60 transition-colors
                                                   ${isPrefilled ? 'opacity-60 cursor-default' : ''}`}
                                    />
                                    {fieldErrors.email && (
                                        <p className="text-red-400 text-xs mt-1.5">{fieldErrors.email}</p>
                                    )}
                                </div>
                            </div>

                            {!isReschedule && (
                                <div className="mb-10">
                                    <label className="block text-[10px] font-headline uppercase tracking-[0.35em] text-white/35 mb-3">
                                        {t('booking.label_idea')}
                                    </label>
                                    <textarea
                                        value={idea}
                                        onChange={(e) => setIdea(e.target.value)}
                                        rows={5}
                                        placeholder={t('booking.placeholder_idea')}
                                        className="w-full bg-transparent border border-white/15 px-5 py-4 text-white font-body text-base
                                                   placeholder:text-white/20 focus:outline-none focus:border-emerald-400/60 transition-colors resize-none"
                                    />
                                    {fieldErrors.idea && (
                                        <p className="text-red-400 text-xs mt-1.5">{fieldErrors.idea}</p>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-6">
                                {/* Selection summary */}
                                <div className="text-xs font-label tracking-wider uppercase">
                                    {selectedDate && selectedSlot ? (
                                        <span className="flex items-center gap-2 text-emerald-400">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                                            {t('booking.slot_selected')}
                                        </span>
                                    ) : (
                                        <span className="text-white/25">{t('booking.slot_prompt')}</span>
                                    )}
                                </div>

                                {/* Submit button */}
                                <div className="relative shrink-0">
                                    {canSubmit && (
                                        <div className="absolute inset-0 bg-emerald-500 blur-md animate-pulse opacity-40 pointer-events-none" />
                                    )}
                                    <button
                                        type="submit"
                                        disabled={!canSubmit}
                                        className={`relative px-12 py-5 font-headline font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300
                                            ${canSubmit
                                                ? 'bg-emerald-500 text-black hover:bg-emerald-400 cursor-pointer'
                                                : 'bg-white/8 text-white/25 cursor-not-allowed border border-white/10'
                                            }`}
                                    >
                                        {submitting ? 'Confirming…' : isReschedule ? 'Confirm New Time' : t('booking.confirm')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}
