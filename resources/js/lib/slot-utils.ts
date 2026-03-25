import type { DaySchedule, SlotDateTime, BookingSettings } from '@/types/booking';

/** Convert a UTC ISO string to "HH:MM" in the given IANA timezone */
export function utcToLocalTime(utcIso: string, timezone: string): string {
    return new Date(utcIso).toLocaleTimeString('en-GB', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

/** Get the local date string (YYYY-MM-DD) for a UTC ISO string in the given timezone */
function utcToLocalDate(utcIso: string, timezone: string): string {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date(utcIso));

    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
    return `${get('year')}-${get('month')}-${get('day')}`;
}

/**
 * Group a flat array of slots into per-date buckets using the user's timezone.
 * Dates with zero available slots are excluded.
 */
export function groupSlotsByDate(
    slots: SlotDateTime[],
    timezone: string,
): DaySchedule[] {
    const map = new Map<string, SlotDateTime[]>();

    for (const slot of slots) {
        const date = utcToLocalDate(slot.startUtc, timezone);
        if (!map.has(date)) map.set(date, []);
        map.get(date)!.push(slot);
    }

    const result: DaySchedule[] = [];
    map.forEach((daySlots, date) => {
        const hasAvailable = daySlots.some((s) => s.available !== false);
        if (hasAvailable) {
            result.push({ date, slots: daySlots });
        }
    });

    return result.sort((a, b) => a.date.localeCompare(b.date));
}

/** Check if a slot overlaps with any booked range (including buffer) */
export function isSlotBlocked(
    slotStartMs: number,
    slotEndMs: number,
    bookedRanges: Array<{ start: number; end: number }>,
    bufferMinutes: number,
): boolean {
    const bufferMs = bufferMinutes * 60 * 1000;
    for (const range of bookedRanges) {
        if (slotStartMs < range.end + bufferMs && slotEndMs > range.start) {
            return true;
        }
    }
    return false;
}

/**
 * Client-side mirror of the backend schedule algo — used for admin previews.
 * `date` is YYYY-MM-DD in the admin timezone.
 */
export function generateSlotsForDate(
    date: string,
    settings: BookingSettings,
    bookedRanges: Array<{ start: number; end: number }> = [],
): SlotDateTime[] {
    const { timezone, slotDurationMinutes, bufferMinutes } = settings;

    // Build start/end UTC timestamps for this date in admin tz
    const startLocal = new Date(
        new Date(`${date}T${String(settings.minHour).padStart(2, '0')}:00:00`).toLocaleString('en-US', { timeZone: timezone }),
    );
    const endLocal = new Date(
        new Date(`${date}T${String(settings.maxHour).padStart(2, '0')}:00:00`).toLocaleString('en-US', { timeZone: timezone }),
    );

    // Convert to proper UTC by using Intl offset trick
    const toUtcMs = (localDateStr: string, hour: number): number => {
        // Use a reference point: create the time in the admin tz
        const isoStr = `${localDateStr}T${String(hour).padStart(2, '0')}:00:00`;
        // Get UTC time by formatting through Intl
        const d = new Date(isoStr);
        const utcStr = d.toLocaleString('sv-SE', { timeZone: timezone });
        const offsetMs = d.getTime() - new Date(utcStr).getTime();
        return d.getTime() - offsetMs;
    };

    const startMs = toUtcMs(date, settings.minHour);
    const endMs = toUtcMs(date, settings.maxHour);
    const durationMs = slotDurationMinutes * 60 * 1000;

    const slots: SlotDateTime[] = [];
    let t = startMs;

    while (t + durationMs <= endMs) {
        const slotStart = t;
        const slotEnd = t + durationMs;

        slots.push({
            startUtc: new Date(slotStart).toISOString(),
            endUtc: new Date(slotEnd).toISOString(),
            available: !isSlotBlocked(slotStart, slotEnd, bookedRanges, bufferMinutes),
        });

        t += durationMs;
    }

    return slots;
}
