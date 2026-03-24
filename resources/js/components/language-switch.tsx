import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';

// All locales sorted alphabetically by country name.
// To enable a locale: set `enabled: true` and ensure the route exists.
const LOCALES = [
    { code: 'bg', label: 'BG', country: 'Bulgaria', flag: '🇧🇬', enabled: true  },
    { code: 'de', label: 'DE', country: 'Germany',  flag: '🇩🇪', enabled: false },
    { code: 'en', label: 'EN', country: 'England',  flag: '🇬🇧', enabled: true  },
    { code: 'fr', label: 'FR', country: 'France',   flag: '🇫🇷', enabled: false },
    { code: 'it', label: 'IT', country: 'Italy',    flag: '🇮🇹', enabled: false },
    { code: 'pl', label: 'PL', country: 'Poland',   flag: '🇵🇱', enabled: false },
    { code: 'ro', label: 'RO', country: 'Romania',  flag: '🇷🇴', enabled: false },
    { code: 'es', label: 'ES', country: 'Spain',    flag: '🇪🇸', enabled: false },
];

interface Props {
    locale: string;
}

export default function LanguageSwitch({ locale }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const select = (code: string) => {
        setOpen(false);
        if (code !== locale) router.visit(`/${code}`);
    };

    return (
        <>
            <style>{`
                @keyframes locale-dropdown-in {
                    from { opacity: 0; transform: translateY(-4px); }
                    to   { opacity: 1; transform: translateY(0);    }
                }
                .locale-dropdown {
                    animation: locale-dropdown-in 0.15s ease-out forwards;
                }
            `}</style>
            <div ref={ref} className="relative">
                <button
                    onClick={() => setOpen((o) => !o)}
                    className="flex items-center gap-1.5 font-headline uppercase tracking-widest text-xs text-white/40 hover:text-white transition-colors"
                >
                    <span className="text-base leading-none">{current.flag}</span>
                    <span>{current.label}</span>
                    <svg
                        className={`w-2.5 h-2.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                        viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5"
                    >
                        <path d="M1 1l4 4 4-4" strokeLinecap="square" />
                    </svg>
                </button>

                {open && (
                    <div className="locale-dropdown absolute right-0 top-full mt-3 w-36 bg-[#131313] border border-white/10 py-1">
                        {LOCALES.filter((l) => l.enabled).map((l) => (
                            <button
                                key={l.code}
                                onClick={() => select(l.code)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 font-headline uppercase tracking-widest text-xs transition-colors ${
                                    l.code === locale
                                        ? 'text-white bg-white/5'
                                        : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <span className="text-base leading-none">{l.flag}</span>
                                <span>{l.label}</span>
                                {l.code === locale && (
                                    <span className="ml-auto w-1 h-1 bg-white rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
