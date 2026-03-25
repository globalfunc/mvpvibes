import { useMemo, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TimezoneSelectorProps {
    value: string;
    onChange: (tz: string) => void;
    label?: string;
    className?: string;
}

function getUtcOffset(tz: string): string {
    try {
        const parts = new Intl.DateTimeFormat('en', {
            timeZone: tz,
            timeZoneName: 'shortOffset',
        }).formatToParts(new Date());
        return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
    } catch {
        return '';
    }
}

export default function TimezoneSelector({ value, onChange, label, className }: TimezoneSelectorProps) {
    const [open, setOpen] = useState(false);

    const timezones = useMemo(() => {
        const all: string[] = Intl.supportedValuesOf('timeZone');
        const groups = new Map<string, string[]>();
        for (const tz of all) {
            const region = tz.includes('/') ? tz.split('/')[0] : 'Other';
            if (!groups.has(region)) groups.set(region, []);
            groups.get(region)!.push(tz);
        }
        return groups;
    }, []);

    const currentOffset = getUtcOffset(value);

    return (
        <div className={className}>
            {label && (
                <label className="block text-[10px] font-headline uppercase tracking-[0.35em] text-white/35 mb-3">
                    {label}
                </label>
            )}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="w-full flex items-center justify-between bg-transparent border border-white/15 px-5 py-3 text-white font-body text-sm
                                   hover:border-emerald-400/60 focus:outline-none focus:border-emerald-400/60 transition-colors"
                    >
                        <span className="truncate">{value.replace(/_/g, ' ')}</span>
                        <span className="ml-2 text-white/40 text-xs shrink-0">
                            {currentOffset} <ChevronsUpDown className="inline h-3 w-3 ml-1" />
                        </span>
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0 bg-zinc-900 border-white/15 text-white"
                    align="start"
                >
                    <Command className="bg-zinc-900 text-white">
                        <CommandInput
                            placeholder="Search timezone..."
                            className="text-white placeholder:text-white/30 border-b border-white/10"
                        />
                        <CommandList>
                            <CommandEmpty className="text-white/40 text-sm">No timezone found.</CommandEmpty>
                            {Array.from(timezones.entries()).map(([region, tzList]) => (
                                <CommandGroup
                                    key={region}
                                    heading={region}
                                    className="[&_[cmdk-group-heading]]:text-white/30"
                                >
                                    {tzList.map((tz) => (
                                        <CommandItem
                                            key={tz}
                                            value={tz}
                                            onSelect={() => {
                                                onChange(tz);
                                                setOpen(false);
                                            }}
                                            className={cn(
                                                'text-white/80 hover:bg-white/5 cursor-pointer',
                                                value === tz && 'bg-emerald-500/10 text-emerald-400',
                                            )}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-3 w-3',
                                                    value === tz ? 'opacity-100 text-emerald-400' : 'opacity-0',
                                                )}
                                            />
                                            <span>{tz.replace(/_/g, ' ')}</span>
                                            <span className="ml-auto text-white/30 text-xs">{getUtcOffset(tz)}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
