import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BookingModal from '@/components/booking-modal';
import LandingFooter from '@/components/landing-footer';
import LifecycleDiagram from '@/components/lifecycle-diagram';
import NavMenu from '@/components/nav-menu';
import ServiceItem from '@/components/service-item';

type ProtocolStep = { num: string; title: string; desc: string };
type ServiceItem  = { title: string; description: string; features: string[] };
type DiffItem     = { title: string; desc: string };

type WelcomeProps = {
    autoOpenBooking?: boolean;
    prefillData?: { name: string; email: string };
    proposedStartUtc?: string;
    proposedEndUtc?: string;
    rescheduleSessionId?: number;
    rescheduleConfirmUrl?: string;
    rebookSessionId?: number;
};

export default function Welcome() {
    const {
        autoOpenBooking,
        prefillData,
        proposedStartUtc,
        proposedEndUtc,
        rescheduleSessionId,
        rescheduleConfirmUrl,
        rebookSessionId,
    } = usePage().props as WelcomeProps;

    const [bookingOpen, setBookingOpen] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (autoOpenBooking) {
            setBookingOpen(true);
        }
    }, [autoOpenBooking]);

    const protocolSteps = t('protocol.steps', { returnObjects: true }) as ProtocolStep[];
    const serviceItems  = t('services.items',  { returnObjects: true }) as ServiceItem[];
    const diffItems     = t('difference.items', { returnObjects: true }) as DiffItem[];

    return (
        <>
            <Head title="Mvp Vibes | From Idea to MVP Faster">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary overflow-x-hidden">
                <NavMenu />

                <main className="pt-20">
                    {/* Hero Section */}
                    <section className="relative h-230.25 flex items-center px-4 sm:px-8 overflow-hidden">
                        <div className="absolute inset-0 z-0">
                            <div className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-transparent z-10" />
                            <video
                                className="w-full h-full object-cover opacity-40"
                                autoPlay
                                loop
                                muted
                                playsInline
                                src="/assets/hero_small.webm"
                            />
                        </div>
                        <div className="relative z-20 max-w-5xl w-full">
                            <h1 className="font-headline font-bold text-4xl sm:text-6xl md:text-8xl leading-tight tracking-tighter text-white mb-6 sm:mb-8">
                                {t('hero.heading_part1')}{' '}
                                <br />
                                <span className="text-white/40">{t('hero.heading_part2')}</span>
                            </h1>
                            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start">
                                <button onClick={() => setBookingOpen(true)}
                                className="bg-primary text-on-primary px-6 py-3 sm:px-10 sm:py-5 font-headline font-bold text-base sm:text-lg hover:bg-on-surface-variant transition-colors">
                                    {t('hero.cta')}
                                </button>
                                <div className="flex items-center gap-3 py-4 sm:py-6">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-[ping_2s_linear_infinite] absolute inline-flex h-8 w-8 -top-2.5 -left-2.5 rounded-full bg-linear-to-tr from-emerald-400/80 to-transparent"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    </span>
                                    <span className="font-label text-xs uppercase tracking-[0.2em] text-white/60">
                                        {t('hero.status')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What We Do */}
                    <section className="py-12 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-20 items-end">
                            <div>
                                <span className="text-xs font-headline uppercase tracking-[0.4em] text-white/40 mb-4 block">
                                    {t('approach.label')}
                                </span>
                                <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 sm:mb-8 leading-none">
                                    {t('approach.heading')}
                                </h2>
                            </div>
                            <p className="font-body text-base sm:text-xl text-white/60 leading-relaxed mb-2">
                                {t('approach.description')}
                            </p>
                        </div>
                    </section>

                    {/* How It Works */}
                    <section className="py-12 sm:py-24 px-4 sm:px-8 bg-surface-container-low" id="devcycle">
                        <div className="max-w-7xl mx-auto">
                            <span className="text-xs font-headline uppercase tracking-[0.4em] text-white/40 mb-8 sm:mb-12 block">
                                {t('protocol.label')}
                            </span>
                            <div className="mx-auto">
                                <LifecycleDiagram steps={protocolSteps} />
                            </div>
                        </div>
                    </section>

                    {/* Services */}
                    <section className="py-12 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto" id="services">
                        <span className="text-xs font-headline uppercase tracking-[0.4em] text-white/40 mb-8 sm:mb-12 block">
                            {t('services.label')}
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            {serviceItems.map((item, cardIndex) => {
                                const images = [
                                    '/assets/service-images/mvp-development.jpg',
                                    '/assets/service-images/platform-redesign.jpg',
                                    '/assets/service-images/lead-generation4.png',
                                    '/assets/service-images/ai-integration.jpg',
                                ];
                                const icons = [
                                    ['check_circle', 'check_circle', 'check_circle', 'check_circle'],
                                    ['refresh', 'refresh', 'refresh', 'refresh'],
                                    ['hub', 'hub', 'hub', 'hub', 'hub'],
                                    ['auto_awesome', 'auto_awesome', 'auto_awesome', 'auto_awesome'],
                                ];

                                return (
                                    <ServiceItem
                                        key={cardIndex}
                                        image={images[cardIndex]}
                                        title={item.title}
                                        description={item.description}
                                        features={item.features}
                                        icons={icons[cardIndex]}
                                    />
                                );
                            })}
                        </div>
                    </section>

                    {/* Tech Stack */}
                    <section className="py-12 sm:py-24 px-4 sm:px-8 bg-surface-container-low" id="tech">
                        <div className="max-w-7xl mx-auto">
                            <span className="text-xs font-headline uppercase tracking-[0.4em] text-white/40 mb-8 sm:mb-12 block">
                                {t('stack.label')}
                            </span>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5">
                                {[
                                    { name: 'Laravel',     src: '/assets/tech-stack-png-big/Brand=laravel, Style=Dark.png' },
                                    { name: 'ReactJS',     src: '/assets/tech-stack-png-big/Brand=reactjs, Style=Dark.png' },
                                    { name: 'NextJS',      src: '/assets/tech-stack-png-big/Brand=nextjs, Style=Dark.png' },
                                    { name: 'Python',      src: '/assets/tech-stack-png-big/Brand=python, Style=Dark.png' },
                                    { name: 'Flutter',     src: '/assets/tech-stack-png-big/Brand=flutter, Style=Dark.png' },
                                    { name: 'Docker',      src: '/assets/tech-stack-png-big/Brand=docker, Style=Dark.png' },
                                    { name: 'TypeScript',  src: '/assets/tech-stack-png-big/Brand=typescript, Style=Dark.png' },
                                    { name: 'Ubuntu',      src: '/assets/tech-stack-png-big/Brand=ubuntu, Style=Dark.png' },
                                ].map(({ name, src }) => (
                                    <div
                                        key={name}
                                        className="bg-background aspect-square p-3 sm:p-6 md:p-8 flex flex-col items-center justify-center hover:bg-surface-container transition-all group border border-white/5"
                                    >
                                        <div className="w-10 h-10 sm:w-20 sm:h-20 md:w-32 md:h-32 mb-2 sm:mb-4 md:mb-6 transition-transform group-hover:scale-110">
                                            <img className="w-full h-full object-contain" alt={name} src={src} />
                                        </div>
                                        <h4 className="font-headline font-bold text-white uppercase tracking-widest text-[10px] sm:text-xs md:text-sm">
                                            {name}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Why Mvp Vibes */}
                    <section className="py-12 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto" id="why">
                        <span className="text-xs font-headline uppercase tracking-[0.4em] text-white/40 mb-8 sm:mb-12 block">
                            {t('difference.label')}
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-16">
                            {diffItems.map(({ title, desc }) => (
                                <div key={title} className="space-y-4">
                                    <div className="w-12 h-0.5 bg-primary mb-6" />
                                    <h5 className="font-headline font-bold text-xl text-white">{title}</h5>
                                    <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Final CTA */}
                    <section className="py-16 sm:py-32 px-4 sm:px-8 text-center border-t border-white/5">
                        <h2 className="font-headline font-bold text-3xl sm:text-5xl md:text-7xl text-white mb-8 sm:mb-10 tracking-tighter">
                            {t('cta.heading')}
                        </h2>
                        <button
                            onClick={() => setBookingOpen(true)}
                            className="bg-white text-black font-headline font-bold text-base sm:text-xl px-8 py-4 sm:px-12 sm:py-6 hover:scale-105 transition-transform"
                        >
                            {t('cta.button')}
                        </button>
                    </section>
                </main>

                <LandingFooter />
            </div>

            <BookingModal
                isOpen={bookingOpen}
                onClose={() => setBookingOpen(false)}
                prefillData={prefillData}
                proposedStartUtc={proposedStartUtc}
                proposedEndUtc={proposedEndUtc}
                rescheduleSessionId={rescheduleSessionId}
                rescheduleConfirmUrl={rescheduleConfirmUrl}
                rebookSessionId={rebookSessionId}
            />
        </>
    );
}
