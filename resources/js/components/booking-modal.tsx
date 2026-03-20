import { useState, useEffect, useMemo } from 'react';
import BookingCalendar, { DaySchedule, TimeSlot, BookingCalendarScheduleProps } from '@/components/booking-calendar';

// ─── Hardcoded schedule (swap with backend data later) ────────────────────────
function generateDefaultSchedule(): DaySchedule[] {
    const slots: TimeSlot[] = Array.from({ length: 7 }, (_, i) => ({
        startHour: 10 + i,
        endHour: 11 + i,
    }));

    const schedule: DaySchedule[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= 60; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dow = date.getDay();
        if (dow >= 1 && dow <= 5) {
            schedule.push({
                date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
                slots,
            });
        }
    }
    return schedule;
}

const DEFAULT_SCHEDULE = generateDefaultSchedule();

// ─── Types ────────────────────────────────────────────────────────────────────
interface BookingModalProps extends Partial<BookingCalendarScheduleProps> {
    isOpen: boolean;
    onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function BookingModal({ isOpen, onClose, schedule = DEFAULT_SCHEDULE }: BookingModalProps) {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [idea, setIdea] = useState('');

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
            document.body.style.overflow = 'hidden';
        } else {
            setVisible(false);
            const t = setTimeout(() => {
                setMounted(false);
                setSubmitted(false);
                setSelectedDate(null);
                setSelectedSlot(null);
                setName('');
                setEmail('');
                setIdea('');
            }, 300);
            document.body.style.overflow = '';
            return () => clearTimeout(t);
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const canSubmit = !!(selectedDate && selectedSlot && name.trim() && email.trim());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        // TODO: wire to backend endpoint
        console.log({ selectedDate, selectedSlot, name, email, idea });
        setSubmitted(true);
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        setSelectedSlot(null);
    };

    if (!mounted) return null;

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
                            MVP VIBES // SCOPING SESSION
                        </p>
                        <h2 className="font-headline font-bold text-3xl md:text-4xl text-white tracking-tight leading-none">
                            Book a Scoping Session
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-12 h-12 border border-white/20 flex items-center justify-center text-white/50
                                   hover:border-white/60 hover:text-white transition-colors flex-shrink-0 ml-6"
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
                                You're on the calendar.
                            </h3>
                            <p className="text-white/50 font-body text-base max-w-md leading-relaxed">
                                We'll review your submission and send a confirmation to{' '}
                                <span className="text-emerald-400">{email}</span> within 24 hours.
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="border border-white/20 text-white/60 font-headline text-sm tracking-widest uppercase px-10 py-4 hover:border-white/50 hover:text-white transition-colors"
                        >
                            CLOSE
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Calendar section */}
                        <div className="px-8 md:px-12 py-10 border-b border-white/10">
                            <BookingCalendar
                                schedule={schedule}
                                selectedDate={selectedDate}
                                selectedSlot={selectedSlot}
                                onDateSelect={handleDateSelect}
                                onSlotSelect={setSelectedSlot}
                            />
                        </div>

                        {/* Form section */}
                        <form onSubmit={handleSubmit} className="px-8 md:px-12 py-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div>
                                    <label className="block text-[10px] font-headline uppercase tracking-[0.35em] text-white/35 mb-3">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full bg-transparent border border-white/15 px-5 py-4 text-white font-body text-base
                                                   placeholder:text-white/20 focus:outline-none focus:border-emerald-400/60 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-headline uppercase tracking-[0.35em] text-white/35 mb-3">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="john@example.com"
                                        className="w-full bg-transparent border border-white/15 px-5 py-4 text-white font-body text-base
                                                   placeholder:text-white/20 focus:outline-none focus:border-emerald-400/60 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="mb-10">
                                <label className="block text-[10px] font-headline uppercase tracking-[0.35em] text-white/35 mb-3">
                                    Briefly describe your idea, goals, and what problem you're trying to solve.
                                </label>
                                <textarea
                                    value={idea}
                                    onChange={(e) => setIdea(e.target.value)}
                                    rows={5}
                                    placeholder="We're building a platform that..."
                                    className="w-full bg-transparent border border-white/15 px-5 py-4 text-white font-body text-base
                                               placeholder:text-white/20 focus:outline-none focus:border-emerald-400/60 transition-colors resize-none"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                {/* Selection summary */}
                                <div className="text-xs font-label tracking-wider uppercase">
                                    {selectedDate && selectedSlot ? (
                                        <span className="flex items-center gap-2 text-emerald-400">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                                            Slot selected — ready to confirm
                                        </span>
                                    ) : (
                                        <span className="text-white/25">Select a date &amp; time slot above</span>
                                    )}
                                </div>

                                {/* Submit button with pulsating glow */}
                                <div className="relative flex-shrink-0">
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
                                        CONFIRM BOOKING
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
