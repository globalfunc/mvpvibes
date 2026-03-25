export interface SlotDateTime {
    startUtc: string;
    endUtc: string;
    available: boolean;
}

export interface TimeSlot {
    startUtc: string;
    endUtc: string;
    available?: boolean;
}

export interface DaySchedule {
    date: string; // YYYY-MM-DD in user timezone
    slots: TimeSlot[];
}

export interface BookingSettings {
    timezone: string;
    minHour: number;
    maxHour: number;
    slotDurationMinutes: number;
    bufferMinutes: number;
}
