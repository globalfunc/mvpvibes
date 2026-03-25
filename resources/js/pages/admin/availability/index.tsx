import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { generateSlotsForDate, utcToLocalTime } from '@/lib/slot-utils';
import type { BookingSettings } from '@/types/booking';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type BookingDay = {
    id: number;
    day_of_week: number;
    is_enabled: boolean;
    start_hour: number | null;
    end_hour: number | null;
};

type Settings = {
    timezone: string;
    min_hour: number;
    max_hour: number;
    slot_duration_minutes: number;
    buffer_minutes: number;
};

type Props = {
    days: BookingDay[];
    settings: Settings;
};

function nextDateForDow(dow: number): string {
    const today = new Date();
    const diff = (dow - today.getDay() + 7) % 7 || 7;
    const d = new Date(today);
    d.setDate(today.getDate() + diff);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function DayCard({ day, settings }: { day: BookingDay; settings: Settings }) {
    const [enabled, setEnabled] = useState(day.is_enabled);
    const [startHour, setStartHour] = useState<string>(day.start_hour?.toString() ?? '');
    const [endHour, setEndHour] = useState<string>(day.end_hour?.toString() ?? '');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const effectiveStart = startHour !== '' ? Number(startHour) : settings.min_hour;
    const effectiveEnd = endHour !== '' ? Number(endHour) : settings.max_hour;

    const previewBookingSettings: BookingSettings = useMemo(() => ({
        timezone: settings.timezone,
        minHour: effectiveStart,
        maxHour: effectiveEnd,
        slotDurationMinutes: settings.slot_duration_minutes,
        bufferMinutes: settings.buffer_minutes,
    }), [settings, effectiveStart, effectiveEnd]);

    const previewDate = useMemo(() => nextDateForDow(day.day_of_week), [day.day_of_week]);
    const previewSlots = useMemo(
        () => enabled ? generateSlotsForDate(previewDate, previewBookingSettings) : [],
        [enabled, previewDate, previewBookingSettings],
    );

    const handleSave = () => {
        setSaving(true);
        router.put(`/admin/availability/${day.id}`, {
            is_enabled: enabled,
            start_hour: startHour !== '' ? Number(startHour) : null,
            end_hour: endHour !== '' ? Number(endHour) : null,
        }, {
            onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2000); },
            onFinish: () => setSaving(false),
            preserveScroll: true,
        });
    };

    return (
        <div className={`border p-5 flex flex-col gap-4 transition-colors ${enabled ? 'border-border' : 'border-border/40 opacity-60'}`}>
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{DAY_NAMES[day.day_of_week]}</h3>
                <button
                    type="button"
                    onClick={() => setEnabled(!enabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none
                        ${enabled ? 'bg-emerald-500' : 'bg-muted'}`}
                >
                    <span
                        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform
                            ${enabled ? 'translate-x-4' : 'translate-x-0.5'}`}
                    />
                </button>
            </div>

            {enabled && (
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">
                            Start (override)
                        </label>
                        <input
                            type="number"
                            min={0}
                            max={23}
                            value={startHour}
                            onChange={(e) => setStartHour(e.target.value)}
                            placeholder={`Default (${settings.min_hour})`}
                            className="w-full bg-transparent border border-input px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">
                            End (override)
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={24}
                            value={endHour}
                            onChange={(e) => setEndHour(e.target.value)}
                            placeholder={`Default (${settings.max_hour})`}
                            className="w-full bg-transparent border border-input px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                    </div>
                </div>
            )}

            {previewSlots.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {previewSlots.map((slot) => (
                        <span key={slot.startUtc} className="px-2 py-1 text-[10px] border border-border text-muted-foreground font-mono">
                            {utcToLocalTime(slot.startUtc, settings.timezone)}
                        </span>
                    ))}
                </div>
            )}

            <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="self-start px-4 py-1.5 text-xs border border-border hover:border-primary hover:text-primary
                           disabled:opacity-50 transition-colors"
            >
                {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
            </button>
        </div>
    );
}

export default function AdminAvailability({ days, settings }: Props) {
    return (
        <AdminLayout title="Availability">
            <p className="text-sm text-muted-foreground">
                Configure which days are bookable. Leave start/end blank to use global defaults from Settings.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {days.map((day) => (
                    <DayCard key={day.id} day={day} settings={settings} />
                ))}
            </div>
        </AdminLayout>
    );
}
