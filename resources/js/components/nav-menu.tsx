import { useTranslation } from 'react-i18next';
import { usePage, router } from '@inertiajs/react';

export default function NavMenu() {
    const { t } = useTranslation();
    const { locale } = usePage().props as { locale: string };

    const switchLocale = () => {
        const next = locale === 'en' ? 'bg' : 'en';
        router.visit(`/${next}`);
    };

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#131313]/60 backdrop-blur-2xl">
            <div className="flex justify-between items-center px-8 h-20 w-full mx-auto">
                <div className="text-2xl font-black tracking-tighter text-white">Mvp Vibes</div>
                <div className="hidden md:flex items-center gap-12">
                    <a
                        className="font-headline uppercase tracking-widest text-sm text-white border-b-2 border-white pb-1"
                        href="#services"
                    >
                        {t('nav.services')}
                    </a>
                    <a
                        className="font-headline uppercase tracking-widest text-sm text-white/60 hover:text-white transition-colors"
                        href="#tech"
                    >
                        {t('nav.tech_stack')}
                    </a>
                    <a
                        className="font-headline uppercase tracking-widest text-sm text-white/60 hover:text-white transition-colors"
                        href="#why"
                    >
                        {t('nav.why_us')}
                    </a>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={switchLocale}
                        className="font-headline uppercase tracking-widest text-xs text-white/40 hover:text-white transition-colors"
                    >
                        {locale === 'en' ? 'BG' : 'EN'}
                    </button>
                    <button className="bg-primary text-on-primary px-6 py-2 font-headline uppercase tracking-widest text-xs font-bold hover:scale-95 transition-all duration-200">
                        {t('nav.get_started')}
                    </button>
                </div>
            </div>
        </nav>
    );
}
