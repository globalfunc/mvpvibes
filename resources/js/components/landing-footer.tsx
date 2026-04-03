import { useTranslation } from 'react-i18next';

export default function LandingFooter() {
    const { t } = useTranslation();

    return (
        <footer className="w-full py-12 px-8 border-t border-white/5 bg-[#131313]">
            <div className="flex flex-col md:flex-row justify-start items-center gap-6 w-full max-w-7xl mx-auto">
                <div className="text-lg font-bold text-white">
                    <a href="/" className="flex flex-col items-center justify-between">
                        <img src="/assets/Untitled design (7).png" alt="MVP Vibes" title="MVP Vibes" className="max-h-32 w-auto" />
                        <span>MVP Vibes</span>
                    </a>
                </div>
                <div className="flex gap-8 justify-center items-center">
                    <a className="font-body text-xs tracking-tight text-white/40 hover:text-white transition-colors" href="#">
                        {t('footer.twitter')}
                    </a>
                    <a className="font-body text-xs tracking-tight text-white/40 hover:text-white transition-colors" href="#">
                        {t('footer.linkedin')}
                    </a>
                    <a className="font-body text-xs tracking-tight text-white/40 hover:text-white transition-colors" href="#">
                        {t('footer.github')}
                    </a>
                    <a className="font-body text-xs tracking-tight text-white/40 hover:text-white transition-colors" href="#">
                        {t('footer.contact')}
                    </a>
                </div>
            </div>
            <p className="flex font-body text-xs tracking-tight justify-center text-center text-white/50 self-baseline">
                    {t('footer.copyright')}
                </p>
        </footer>
    );
}
