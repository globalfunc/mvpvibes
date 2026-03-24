import { useTranslation } from 'react-i18next';

export default function LandingFooter() {
    const { t } = useTranslation();

    return (
        <footer className="w-full py-12 px-8 border-t border-white/5 bg-[#131313]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full max-w-7xl mx-auto">
                <div className="text-lg font-bold text-white">Mvp Vibes</div>
                <div className="flex gap-8">
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
                <p className="font-body text-xs tracking-tight text-white/50">
                    {t('footer.copyright')}
                </p>
            </div>
        </footer>
    );
}
