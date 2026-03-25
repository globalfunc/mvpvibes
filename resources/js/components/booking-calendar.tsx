import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { DaySchedule, TimeSlot } from '@/types/booking';
import { utcToLocalTime } from '@/lib/slot-utils';

export type { DaySchedule, TimeSlot };

interface BookingCalendarProps {
    schedule: DaySchedule[];
    selectedDate: string | null;
    selectedSlot: TimeSlot | null;
    onDateSelect: (date: string) => void;
    onSlotSelect: (slot: TimeSlot) => void;
    userTimezone: string;
}

function toDateStr(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDisplayDate(dateStr: string, locale: string): string {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function BookingCalendar({
    schedule,
    selectedDate,
    selectedSlot,
    onDateSelect,
    onSlotSelect,
    userTimezone,
}: BookingCalendarProps) {
    const { t, i18n } = useTranslation();

    const dayNames = useMemo(() => {
        const fmt = new Intl.DateTimeFormat(i18n.language, { weekday: 'short' });
        return Array.from({ length: 7 }, (_, i) =>
            fmt.format(new Date(2024, 0, 7 + i)).toUpperCase(),
        );
    }, [i18n.language]);

    const monthNames = useMemo(() => {
        const fmt = new Intl.DateTimeFormat(i18n.language, { month: 'long' });
        return Array.from({ length: 12 }, (_, i) =>
            fmt.format(new Date(2024, i, 1)),
        );
    }, [i18n.language]);

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    // Dates that have at least one available slot
    const availableDates = useMemo(
        () => new Set(schedule.filter((d) => d.slots.some((s) => s.available !== false)).map((d) => d.date)),
        [schedule],
    );

    const calendarDays = useMemo(() => {
        const firstDay = new Date(viewYear, viewMonth, 1);
        const lastDay = new Date(viewYear, viewMonth + 1, 0);
        const startDow = firstDay.getDay();

        const days: (Date | null)[] = [];
        for (let i = 0; i < startDow; i++) days.push(null);
        for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(viewYear, viewMonth, d));
        while (days.length % 7 !== 0) days.push(null);

        return days;
    }, [viewYear, viewMonth]);

    const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

    const prevMonth = () => {
        if (isCurrentMonth) return;
        if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
        else setViewMonth((m) => m - 1);
    };

    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
        else setViewMonth((m) => m + 1);
    };

    const selectedDaySchedule = useMemo(
        () => (selectedDate ? schedule.find((d) => d.date === selectedDate) ?? null : null),
        [selectedDate, schedule],
    );

    const displayTz = userTimezone.replace(/_/g, ' ');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* ── Calendar ── */}
            <div>
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={prevMonth}
                        disabled={isCurrentMonth}
                        className="w-12 h-12 border border-white/20 flex items-center justify-center text-white/60
                                   hover:border-emerald-400 hover:text-emerald-400 disabled:opacity-20
                                   disabled:cursor-not-allowed transition-colors"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <span className="font-headline font-bold text-white tracking-[0.2em] uppercase text-sm">
                        {monthNames[viewMonth]} {viewYear}
                    </span>
                    <button
                        onClick={nextMonth}
                        className="w-12 h-12 border border-white/20 flex items-center justify-center text-white/60
                                   hover:border-emerald-400 hover:text-emerald-400 transition-colors"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-1">
                    {dayNames.map((d) => (
                        <div key={d} className="text-center text-[10px] font-headline tracking-widest text-white/25 py-2">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((date, idx) => {
                        if (!date) return <div key={`e-${idx}`} className="aspect-square" />;

                        const dateStr = toDateStr(date);
                        const isAvailable = availableDates.has(dateStr);
                        const isPast = date < today;
                        const isSelected = selectedDate === dateStr;
                        const isToday = date.getTime() === today.getTime();
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                        const isDisabled = isPast || isWeekend || !isAvailable;

                        return (
                            <button
                                key={dateStr}
                                disabled={isDisabled}
                                onClick={() => onDateSelect(dateStr)}
                                className={[
                                    'aspect-square flex items-center justify-center text-sm font-headline font-bold border transition-all duration-150',
                                    isSelected
                                        ? 'bg-emerald-500 border-emerald-400 text-black'
                                        : isDisabled
                                          ? 'border-transparent text-white/15 cursor-not-allowed'
                                          : 'border-white/15 text-white hover:border-emerald-400 hover:text-emerald-400 hover:bg-emerald-400/10 cursor-pointer',
                                    isToday && !isSelected ? 'border-white/40' : '',
                                ].join(' ')}
                            >
                                {date.getDate()}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Time Slots ── */}
            <div className="border-l border-white/10 pl-10">
                {selectedDate ? (
                    <>
                        <div className="mb-6">
                            <h3 className="font-headline font-bold text-white text-xl mb-1">
                                {formatDisplayDate(selectedDate, i18n.language)}
                            </h3>
                            <p className="text-[10px] font-headline tracking-[0.25em] uppercase text-white/30">
                                Times shown in {displayTz}
                            </p>
                        </div>

                        {selectedDaySchedule ? (
                            <div className="grid grid-cols-2 gap-3">
                                {selectedDaySchedule.slots.map((slot) => {
                                    const localStart = utcToLocalTime(slot.startUtc, userTimezone);
                                    const localEnd = utcToLocalTime(slot.endUtc, userTimezone);
                                    const isUnavailable = slot.available === false;
                                    const isActive = selectedSlot?.startUtc === slot.startUtc;

                                    return (
                                        <button
                                            key={slot.startUtc}
                                            onClick={() => !isUnavailable && onSlotSelect(slot)}
                                            disabled={isUnavailable}
                                            className={[
                                                'p-5 border text-left transition-all duration-150 font-headline group',
                                                isActive
                                                    ? 'bg-emerald-500 border-emerald-400 text-black'
                                                    : isUnavailable
                                                      ? 'border-white/8 text-white/20 cursor-not-allowed'
                                                      : 'border-white/15 text-white hover:border-emerald-400 hover:bg-emerald-400/10',
                                            ].join(' ')}
                                        >
                                            <div className="font-bold text-lg leading-none">{localStart}</div>
                                            <div className={`text-xs mt-1.5 font-label tracking-wider ${isActive ? 'text-black/50' : isUnavailable ? 'text-white/20' : 'text-white/35'}`}>
                                                — {localEnd}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-white/30 text-sm font-body">No slots available for this date.</p>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-48 gap-4">
                        <div className="w-12 h-12 border border-white/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white/20">calendar_month</span>
                        </div>
                        <p className="text-white/25 font-headline tracking-[0.2em] uppercase text-xs text-center leading-loose">
                            {t('booking.calendar_select_line1')}<br />{t('booking.calendar_select_line2')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
