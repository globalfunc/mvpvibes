import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import TimezoneSelector from '@/components/timezone-selector';
import { generateSlotsForDate } from '@/lib/slot-utils';
import { utcToLocalTime } from '@/lib/slot-utils';
import type { BookingSettings } from '@/types/booking';

type Props = {
    settings: {
        timezone: string;
        min_hour: number;
        max_hour: number;
        slot_duration_minutes: number;
        buffer_minutes: number;
    };
    availableTimezones: string[];
};

function todayStr(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function AdminSettings({ settings }: Props) {
    const [timezone, setTimezone] = useState(settings.timezone);
    const [minHour, setMinHour] = useState(settings.min_hour);
    const [maxHour, setMaxHour] = useState(settings.max_hour);
    const [slotDuration, setSlotDuration] = useState(settings.slot_duration_minutes);
    const [bufferMinutes, setBufferMinutes] = useState(settings.buffer_minutes);
    const [processing, setProcessing] = useState(false);
    const [flash, setFlash] = useState<string | null>(null);

    const previewSettings: BookingSettings = useMemo(() => ({
        timezone,
        minHour,
        maxHour,
        slotDurationMinutes: slotDuration,
        bufferMinutes,
    }), [timezone, minHour, maxHour, slotDuration, bufferMinutes]);

    const previewSlots = useMemo(
        () => generateSlotsForDate(todayStr(), previewSettings),
        [previewSettings],
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.put('/admin/settings', {
            timezone,
            min_hour: minHour,
            max_hour: maxHour,
            slot_duration_minutes: slotDuration,
            buffer_minutes: bufferMinutes,
        }, {
            onSuccess: () => { setFlash('Settings saved.'); setTimeout(() => setFlash(null), 3000); },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout title="Settings">
            <div className="max-w-2xl">
                {flash && (
                    <div className="mb-4 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                        {flash}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="border border-border p-6 flex flex-col gap-6">
                        <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Booking Settings</h2>

                        <TimezoneSelector
                            label="Admin timezone"
                            value={timezone}
                            onChange={setTimezone}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
                                    Start hour
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    max={23}
                                    value={minHour}
                                    onChange={(e) => setMinHour(Number(e.target.value))}
                                    className="w-full bg-transparent border border-input px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
                                    End hour
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={24}
                                    value={maxHour}
                                    onChange={(e) => setMaxHour(Number(e.target.value))}
                                    className="w-full bg-transparent border border-input px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
                                    Slot duration (min)
                                </label>
                                <select
                                    value={slotDuration}
                                    onChange={(e) => setSlotDuration(Number(e.target.value))}
                                    className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                >
                                    {[15, 30, 60, 120].map((v) => (
                                        <option key={v} value={v}>{v} min</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
                                    Buffer (min)
                                </label>
                                <select
                                    value={bufferMinutes}
                                    onChange={(e) => setBufferMinutes(Number(e.target.value))}
                                    className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                >
                                    {[0, 15, 30, 60].map((v) => (
                                        <option key={v} value={v}>{v} min</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Live preview */}
                    <div className="border border-border p-6">
                        <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                            Slot preview — today ({timezone})
                        </h3>
                        {previewSlots.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No slots generated. Check your hours.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {previewSlots.map((slot) => (
                                    <span
                                        key={slot.startUtc}
                                        className="px-3 py-1.5 text-xs border border-border text-muted-foreground font-mono"
                                    >
                                        {utcToLocalTime(slot.startUtc, timezone)} – {utcToLocalTime(slot.endUtc, timezone)}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="self-start px-8 py-3 bg-primary text-primary-foreground text-sm font-medium
                                   hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                        {processing ? 'Saving…' : 'Save Settings'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
