export default function LandingFooter() {
    return (
        <footer className="w-full py-12 px-8 border-t border-white/5 bg-[#131313]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full max-w-7xl mx-auto">
                <div className="text-lg font-bold text-white">Mvp Vibes</div>
                <div className="flex gap-8">
                    <a className="font-body text-xs tracking-tight text-white/40 hover:text-white transition-colors" href="#">
                        Twitter
                    </a>
                    <a className="font-body text-xs tracking-tight text-white/40 hover:text-white transition-colors" href="#">
                        LinkedIn
                    </a>
                    <a className="font-body text-xs tracking-tight text-white/40 hover:text-white transition-colors" href="#">
                        Github
                    </a>
                    <a className="font-body text-xs tracking-tight text-white/40 hover:text-white transition-colors" href="#">
                        Contact
                    </a>
                </div>
                <p className="font-body text-xs tracking-tight text-white/50">
                    © 2024 Mvp Vibes. Built for the high-performance engine.
                </p>
            </div>
        </footer>
    );
}
