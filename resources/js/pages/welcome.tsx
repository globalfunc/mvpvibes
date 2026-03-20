import { useState } from 'react';
import { Head } from '@inertiajs/react';
import LandingFooter from '@/components/landing-footer';
import NavMenu from '@/components/nav-menu';
import BookingModal from '@/components/booking-modal';

export default function Welcome() {
    const [bookingOpen, setBookingOpen] = useState(false);

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

            <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary">
                <NavMenu />

                <main className="pt-20">
                    {/* Hero Section */}
                    <section className="relative h-230.25 flex items-center px-8 overflow-hidden">
                        <div className="absolute inset-0 z-0">
                            <div className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-transparent z-10" />
                            <video
                                className="w-full h-full object-cover opacity-40"
                                autoPlay
                                loop
                                muted
                                playsInline
                                src="/storage/assets/hero_small.webm"
                            />
                        </div>
                        <div className="relative z-20 max-w-5xl">
                            <h1 className="font-headline font-bold text-6xl md:text-8xl leading-tight tracking-tighter text-white mb-8">
                                From idea to MVP —{' '}
                                <br />
                                <span className="text-white/40">faster than your coffee gets cold.</span>
                            </h1>
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <button className="bg-primary text-on-primary px-10 py-5 font-headline font-bold text-lg hover:bg-on-surface-variant transition-colors">
                                    START BUILDING NOW
                                </button>
                                <div className="flex items-center gap-3 py-4">
                                    {/* <div className="w-2 h-2 bg-emerald-400 shadow-[0_0_10px_rgba(255,255,255,0.8)] rounded-full" /> */}
                                    <span class="relative flex h-3 w-3">
                                        <span class="animate-[ping_2s_linear_infinite] absolute inline-flex h-8 w-8 -top-2.5 -left-2.5 rounded-full bg-gradient-to-tr from-emerald-400/80 to-transparent"></span>

                                        <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    </span>
                                    <span className="font-label text-xs uppercase tracking-[0.2em] text-white/60">
                                        Currently accepting 2 new projects
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What We Do */}
                    <section className="py-24 px-8 max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-end">
                            <div>
                                <span className="text-xs font-headline uppercase tracking-[0.4em] text-white/40 mb-4 block">
                                    01 // THE APPROACH
                                </span>
                                <h2 className="font-headline text-4xl md:text-5xl font-bold text-white mb-8 leading-none">
                                    AI-Accelerated
                                    <br />
                                    Development.
                                </h2>
                            </div>
                            <p className="font-body text-xl text-white/60 leading-relaxed mb-2">
                                We combine the raw speed of specialized AI agents with the precision of senior human
                                architects. This hybrid workflow eliminates the traditional 6-month dev cycle,
                                delivering production-ready MVPs in weeks, not months.
                            </p>
                        </div>
                    </section>

                    {/* How It Works */}
                    <section className="py-24 px-8 bg-surface-container-low" id="services">
                        <div className="max-w-7xl mx-auto">
                            <span className="text-xs font-headline uppercase tracking-[0.4em] text-white/40 mb-12 block">
                                02 // THE PROTOCOL
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-white/10 border border-white/10">
                                {[
                                    { num: '01', title: 'Discovery', desc: 'Mapping your vision into a technical blueprint.' },
                                    { num: '02', title: 'Scope', desc: 'Defining the leanest path to market fit.' },
                                    { num: '03', title: 'AI Build', desc: 'Rapid scaffolding using high-fidelity AI agents.' },
                                    { num: '04', title: 'Review', desc: 'Human-led auditing and security hardening.' },
                                    { num: '05', title: 'Launch', desc: 'Deployment to high-performance cloud infrastructure.' },
                                ].map(({ num, title, desc }) => (
                                    <div
                                        key={num}
                                        className="bg-background p-10 hover:bg-surface-container transition-colors group"
                                    >
                                        <div className="text-white/20 font-headline font-black text-4xl mb-6 group-hover:text-primary transition-colors">
                                            {num}
                                        </div>
                                        <h3 className="font-headline font-bold text-xl text-white mb-4">{title}</h3>
                                        <p className="text-sm text-white/50">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Services */}
                    <section className="py-24 px-8 max-w-7xl mx-auto">
                        <span className="text-xs font-headline uppercase tracking-[0.4em] text-white/40 mb-12 block">
                            03 // CORE SERVICES
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Card 1 */}
                            <div className="glass-card p-1 flex flex-col group">
                                <img
                                    className="w-full h-64 object-cover grayscale opacity-50 group-hover:opacity-80 transition-opacity"
                                    alt="Abstract futuristic interface with glowing data lines"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHEEF6KQFAIYaQoUl6wgc-OtLcMxODv-__u6mfOu0pWh3Nh8-PYWiAkWQ3E2-yUcuNwLnsLbg5x9O95QoH6BLMf1rZtS3Jl00-RrxYVH4OgRDAXiDiFXaW5oRVmaymEzC54Ua_xXjY4PGDAWakVILaeHxPN1nG91inyh6sdUT992JLuEpD9IFC-fj5n_JllAOOYEnPlQvDv9HI0tP8okJ8k44AxSsayDvYRbkyBvggtJO1mLQel1phUVTHk9v6VuRfzHnqA1F4Qj5d"
                                />
                                <div className="p-10">
                                    <h3 className="font-headline font-bold text-3xl text-white mb-2">MVP Development</h3>
                                    <p className="text-white/60 mb-8">
                                        End-to-end creation of your flagship product from zero.
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-3 text-sm text-white/80">
                                            <span
                                                className="material-symbols-outlined text-primary"
                                                style={{ fontVariationSettings: "'FILL' 1" }}
                                            >
                                                check_circle
                                            </span>
                                            Custom UI/UX Architecture
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-white/80">
                                            <span
                                                className="material-symbols-outlined text-primary"
                                                style={{ fontVariationSettings: "'FILL' 1" }}
                                            >
                                                check_circle
                                            </span>
                                            Scalable Backend Logic
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="glass-card p-1 flex flex-col group">
                                <img
                                    className="w-full h-64 object-cover grayscale opacity-50 group-hover:opacity-80 transition-opacity"
                                    alt="High tech server room with neon blue lights"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5Lt09Jd531RomPs2SBPBsAQLHgc0PTJaJFBVjcUevPj9kOgHeAaI09cm4ID5pS2uDWKaKdA4IdSuNgMY5jtkc3WSfHcFMHN1YgetDB-25awN3Rfye9nQuQtXzn83IYdPXQ3BiYOiCFcS6mvbg2BU6W74j60GCS9URMeNqbVzto_9K71mldV7mdgUIdxqEV5KF6_slhPgtHLChkM6tJmgBs9bVKuv4qap-WDErzZLP0QlO6VaLe12Qa53TZQu-1L8zYn638bd3vTFK"
                                />
                                <div className="p-10">
                                    <h3 className="font-headline font-bold text-3xl text-white mb-2">
                                        Rebuild &amp; Refresh
                                    </h3>
                                    <p className="text-white/60 mb-8">Modernizing legacy codebases for the AI era.</p>
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-3 text-sm text-white/80">
                                            <span
                                                className="material-symbols-outlined text-primary"
                                                style={{ fontVariationSettings: "'FILL' 1" }}
                                            >
                                                refresh
                                            </span>
                                            Tech Stack Migration
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-white/80">
                                            <span
                                                className="material-symbols-outlined text-primary"
                                                style={{ fontVariationSettings: "'FILL' 1" }}
                                            >
                                                refresh
                                            </span>
                                            Performance Optimization
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="glass-card p-1 flex flex-col group">
                                <img
                                    className="w-full h-64 object-cover grayscale opacity-50 group-hover:opacity-80 transition-opacity"
                                    alt="AI neural network visualization with bright connections"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA62E8KTTom7x_DEErR8NTiVGezsF-klhvNaNpDkvT2S1wQlhW8Z9vinuMIjX4KXw0b8eyI_P0ukrxjkEXkYxVd7uHl4Y5yJ049XlRXN7quLe-k_VK1JgJdWt6WI0YCai1elUBix-44_0zH3jbEZlbeN01VKRRdYMi7ifZVgfVIRrk4eRc0zMtONodd9R04BzKSZor07dK_RdmiiEdPNePifILoYS4jq8eUAnHf8sMK-gN9cCK-h-2plgUS7Frcbq-TFpBo3Jiqb0io"
                                />
                                <div className="p-10">
                                    <h3 className="font-headline font-bold text-3xl text-white mb-2">
                                        AI Lead Generation
                                    </h3>
                                    <p className="text-white/60 mb-8">
                                        Automated pipelines to fuel your growth engine.
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-3 text-sm text-white/80">
                                            <span
                                                className="material-symbols-outlined text-primary"
                                                style={{ fontVariationSettings: "'FILL' 1" }}
                                            >
                                                hub
                                            </span>
                                            Targeted Scrapers
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-white/80">
                                            <span
                                                className="material-symbols-outlined text-primary"
                                                style={{ fontVariationSettings: "'FILL' 1" }}
                                            >
                                                hub
                                            </span>
                                            Dynamic Outreach Agents
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Card 4 */}
                            <div className="glass-card p-1 flex flex-col group">
                                <img
                                    className="w-full h-64 object-cover grayscale opacity-50 group-hover:opacity-80 transition-opacity"
                                    alt="Microchip macro photography with sharp details"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGNwDuNF_AziOaDV-vCjfBgV5b0Yoo7sZoctnOMiPfurkArB0Ci2_RHXfGD19zV0pFv5LDrcdHJFSShxqF5djdtdmHaESIT5s_m0RwXbBcb-h9di_70POvk9aEZ2JUNMRKuApPctx3ub6ogeOG--bAJpi3-MPNsFmmtksolS08bD3vhf4xmHnxXioukZgzbOfhyDk_f-icfrGamaxgNcQSjf9ctM0psN-l7pa604jwpK6wVxlTv6l0vWW_zvqysIVwR5ci2vzoiaZD"
                                />
                                <div className="p-10">
                                    <h3 className="font-headline font-bold text-3xl text-white mb-2">AI Integration</h3>
                                    <p className="text-white/60 mb-8">
                                        Injecting intelligence into your existing workflows.
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-3 text-sm text-white/80">
                                            <span
                                                className="material-symbols-outlined text-primary"
                                                style={{ fontVariationSettings: "'FILL' 1" }}
                                            >
                                                auto_awesome
                                            </span>
                                            LLM Implementation
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-white/80">
                                            <span
                                                className="material-symbols-outlined text-primary"
                                                style={{ fontVariationSettings: "'FILL' 1" }}
                                            >
                                                auto_awesome
                                            </span>
                                            Custom RAG Pipelines
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Tech Stack */}
                    <section className="py-24 px-8 bg-surface-container-low" id="tech">
                        <div className="max-w-7xl mx-auto">
                            <span className="text-xs font-headline uppercase tracking-[0.4em] text-white/40 mb-12 block">
                                04 // THE STACK
                            </span>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5">
                                {[
                                    {
                                        name: 'Laravel',
                                        src: '/storage/assets/tech-stack-png-big/Brand=laravel, Style=Dark.png',
                                    },
                                    {
                                        name: 'ReactJS',
                                        src: '/storage/assets/tech-stack-png-big/Brand=reactjs, Style=Dark.png',
                                    },
                                    {
                                        name: 'NextJS',
                                        src: '/storage/assets/tech-stack-png-big/Brand=nextjs, Style=Dark.png',
                                    },
                                    {
                                        name: 'Python',
                                        src: '/storage/assets/tech-stack-png-big/Brand=python, Style=Dark.png',
                                    },
                                    {
                                        name: 'Flutter',
                                        src: '/storage/assets/tech-stack-png-big/Brand=flutter, Style=Dark.png',
                                    },
                                    {
                                        name: 'Docker',
                                        src: '/storage/assets/tech-stack-png-big/Brand=docker, Style=Dark.png',
                                    },
                                    {
                                        name: 'TypeScript',
                                        src: '/storage/assets/tech-stack-png-big/Brand=typescript, Style=Dark.png',
                                    },
                                    {
                                        name: 'Ubuntu',
                                        src: '/storage/assets/tech-stack-png-big/Brand=ubuntu, Style=Dark.png',
                                    },
                                ].map(({ name, src }) => (
                                    <div
                                        key={name}
                                        className="bg-background aspect-square p-8 flex flex-col items-center justify-center hover:bg-surface-container transition-all group border border-white/5"
                                    >
                                        <div className="w-32 h-32 mb-6 transition-transform group-hover:scale-110">
                                            <img className="w-full h-full object-contain" alt={name} src={src} />
                                        </div>
                                        <h4 className="font-headline font-bold text-white uppercase tracking-widest text-sm">
                                            {name}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Why Mvp Vibes */}
                    <section className="py-24 px-8 max-w-7xl mx-auto" id="why">
                        <span className="text-xs font-headline uppercase tracking-[0.4em] text-white/40 mb-12 block">
                            05 // THE DIFFERENCE
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                            {[
                                {
                                    title: 'Human-verified',
                                    desc: 'Every line of AI-generated code is audited by senior engineers with a decade of experience.',
                                },
                                {
                                    title: 'Non-technical founders',
                                    desc: "We speak your language, not just code. We bridge the gap between business vision and tech.",
                                },
                                {
                                    title: 'End-to-end ownership',
                                    desc: 'From first pixel to production launch, we own the process so you can focus on growth.',
                                },
                                {
                                    title: 'Transparent process',
                                    desc: "Real-time dashboards show you exactly what's being built and how fast we're moving.",
                                },
                                {
                                    title: 'Affordable pricing',
                                    desc: 'Fixed-fee models optimized for early-stage startups. No hidden costs or scope creep.',
                                },
                                {
                                    title: 'Privacy',
                                    desc: 'Your intellectual property stays yours. We use local AI models for maximum security.',
                                },
                            ].map(({ title, desc }) => (
                                <div key={title} className="space-y-4">
                                    <div className="w-12 h-0.5 bg-primary mb-6" />
                                    <h5 className="font-headline font-bold text-xl text-white">{title}</h5>
                                    <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Final CTA */}
                    <section className="py-32 px-8 text-center border-t border-white/5">
                        <h2 className="font-headline font-bold text-5xl md:text-7xl text-white mb-10 tracking-tighter">
                            Ready to shift gears?
                        </h2>
                        <button
                            onClick={() => setBookingOpen(true)}
                            className="bg-white text-black font-headline font-bold text-xl px-12 py-6 hover:scale-105 transition-transform"
                        >
                            BOOK A SCOPING SESSION
                        </button>
                    </section>
                </main>

                <LandingFooter />
            </div>

            <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
        </>
    );
}
