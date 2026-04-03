import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import LanguageSwitch from '@/components/language-switch';
import BookingModal from '@/components/booking-modal';

const NAV_LINKS = [
    { href: '#devcycle', labelKey: 'nav.how_it_works', sectionId: 'devcycle' },
    { href: '#services', labelKey: 'nav.services',     sectionId: 'services'  },
    { href: '#why',      labelKey: 'nav.why_us',       sectionId: 'why'       },
];

export default function NavMenu() {
    const { t } = useTranslation();
    const { locale } = usePage().props as { locale: string };
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [bookingOpen, setBookingOpen] = useState(false);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        NAV_LINKS.forEach(({ sectionId }) => {
            const el = document.getElementById(sectionId);
            if (!el) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveSection(sectionId);
                },
                { threshold: 0.4 },
            );
            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, []);

    return (
        <>
            <style>{`
                @keyframes border-grow {
                    from { transform: scaleX(0); }
                    to   { transform: scaleX(1); }
                }
                .nav-active-border::after {
                    content: '';
                    display: block;
                    height: 2px;
                    background: white;
                    margin-top: 3px;
                    transform-origin: left;
                    animation: border-grow 0.3s ease-out forwards;
                }
            `}</style>
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#131313]/60 backdrop-blur-2xl">
                <div className="flex justify-between items-center px-8 h-20 w-full mx-auto">
                    <a href="/" className="flex items-center justify-between h-full">
                        <img src="/assets/Untitled design (7).png" alt="MVP Vibes" title="MVP Vibes" className="h-3/4 w-auto" />
                        <div>MVP Vibes</div>
                    </a>
                    <div className="hidden md:flex items-center gap-12">
                        {NAV_LINKS.map(({ href, labelKey, sectionId }) => {
                            const isActive = activeSection === sectionId;
                            return (
                                <a
                                    key={sectionId}
                                    href={href}
                                    className={`font-headline uppercase tracking-widest text-sm transition-colors ${
                                        isActive
                                            ? 'text-white nav-active-border'
                                            : 'text-white/60 hover:text-white'
                                    }`}
                                >
                                    {t(labelKey)}
                                </a>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageSwitch locale={locale} />
                        <button onClick={() => setBookingOpen(true)}
                            className="bg-emerald-500 text-on-primary px-6 py-2 font-headline uppercase tracking-widest text-xs font-bold hover:scale-95 transition-all duration-200">
                            {t('nav.get_started')}
                        </button>
                    </div>
                </div>
            </nav>
            <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
        </>
    );
}
