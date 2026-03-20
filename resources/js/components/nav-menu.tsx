export default function NavMenu() {
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#131313]/60 backdrop-blur-2xl">
            <div className="flex justify-between items-center px-8 h-20 w-full mx-auto">
                <div className="text-2xl font-black tracking-tighter text-white">Mvp Vibes</div>
                <div className="hidden md:flex items-center gap-12">
                    <a
                        className="font-headline uppercase tracking-widest text-sm text-white border-b-2 border-white pb-1"
                        href="#services"
                    >
                        Services
                    </a>
                    <a
                        className="font-headline uppercase tracking-widest text-sm text-white/60 hover:text-white transition-colors"
                        href="#tech"
                    >
                        Tech Stack
                    </a>
                    <a
                        className="font-headline uppercase tracking-widest text-sm text-white/60 hover:text-white transition-colors"
                        href="#why"
                    >
                        Why Us
                    </a>
                </div>
                <button className="bg-primary text-on-primary px-6 py-2 font-headline uppercase tracking-widest text-xs font-bold hover:scale-95 transition-all duration-200">
                    Get Started
                </button>
            </div>
        </nav>
    );
}
