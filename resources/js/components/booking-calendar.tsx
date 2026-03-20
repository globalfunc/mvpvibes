import { useState, useMemo } from 'react';

export interface TimeSlot {
    startHour: number; // Hour in Sofia (Europe/Sofia) timezone
    endHour: number;
}

export interface DaySchedule {
    date: string; // YYYY-MM-DD
    slots: TimeSlot[];
}

export interface BookingCalendarScheduleProps {
    schedule: DaySchedule[];
}

interface BookingCalendarProps extends BookingCalendarScheduleProps {
    selectedDate: string | null;
    selectedSlot: TimeSlot | null;
    onDateSelect: (date: string) => void;
    onSlotSelect: (slot: TimeSlot) => void;
}

const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

function getSofiaUtcOffset(dateStr: string): number {
    const refDate = new Date(`${dateStr}T12:00:00Z`);
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Sofia',
        hour: '2-digit',
        hour12: false,
    }).formatToParts(refDate);
    const sofiaHour = parseInt(parts.find((p) => p.type === 'hour')!.value);
    return sofiaHour - 12;
}

function sofiaHourToLocalTime(dateStr: string, sofiaHour: number): string {
    const offset = getSofiaUtcOffset(dateStr);
    const utcHour = sofiaHour - offset;
    const slotDate = new Date(`${dateStr}T${String(utcHour).padStart(2, '0')}:00:00Z`);
    return slotDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function toDateStr(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDisplayDate(dateStr: string): string {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function getLocalTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, ' ');
}

export default function BookingCalendar({
    schedule,
    selectedDate,
    selectedSlot,
    onDateSelect,
    onSlotSelect,
}: BookingCalendarProps) {
    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    const availableDates = useMemo(() => new Set(schedule.map((d) => d.date)), [schedule]);

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

    const localTz = getLocalTimezone();

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
                        {MONTH_NAMES[viewMonth]} {viewYear}
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
                    {DAY_NAMES.map((d) => (
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
                                {formatDisplayDate(selectedDate)}
                            </h3>
                            <p className="text-[10px] font-headline tracking-[0.25em] uppercase text-white/30">
                                Times shown in {localTz}
                            </p>
                        </div>

                        {selectedDaySchedule ? (
                            <div className="grid grid-cols-2 gap-3">
                                {selectedDaySchedule.slots.map((slot) => {
                                    const localStart = sofiaHourToLocalTime(selectedDate, slot.startHour);
                                    const localEnd = sofiaHourToLocalTime(selectedDate, slot.endHour);
                                    const isActive = selectedSlot?.startHour === slot.startHour;

                                    return (
                                        <button
                                            key={slot.startHour}
                                            onClick={() => onSlotSelect(slot)}
                                            className={[
                                                'p-5 border text-left transition-all duration-150 font-headline group',
                                                isActive
                                                    ? 'bg-emerald-500 border-emerald-400 text-black'
                                                    : 'border-white/15 text-white hover:border-emerald-400 hover:bg-emerald-400/10',
                                            ].join(' ')}
                                        >
                                            <div className="font-bold text-lg leading-none">{localStart}</div>
                                            <div className={`text-xs mt-1.5 font-label tracking-wider ${isActive ? 'text-black/50' : 'text-white/35'}`}>
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
                            Select a date<br />to view slots
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
