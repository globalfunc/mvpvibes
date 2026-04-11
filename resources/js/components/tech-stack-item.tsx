import { useState } from 'react';

type TechStackItemProps = {
    name: string;
    src: string;
    description: string;
};

export default function TechStackItem({ name, src, description }: TechStackItemProps) {
    const [active, setActive] = useState(false);

    return (
        <div
            className="relative bg-background aspect-square p-3 sm:p-6 md:p-8 flex flex-col items-center justify-center border border-white/5 overflow-hidden cursor-pointer select-none"
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            onClick={() => setActive((prev) => !prev)}
        >
            {/* Icon — always visible */}
            <div className="w-10 h-10 sm:w-20 sm:h-20 md:w-32 md:h-32 mb-2 sm:mb-4 md:mb-6">
                <img className="w-full h-full object-contain" alt={name} src={src} />
            </div>

            {/* Label — kept invisible (not hidden) so layout stays stable */}
            <h4 className={`font-headline font-bold text-white uppercase tracking-widest text-[10px] sm:text-xs md:text-sm ${active ? 'invisible' : 'visible'}`}>
                {name}
            </h4>

            {/* Description panel — slides up from bottom over the label area, icon stays visible */}
            <div
                className={`absolute bottom-0 left-0 right-0 h-[52%] flex items-end p-3 sm:p-5 md:p-6 transition-transform duration-300 ease-in-out ${
                    active ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                <p className="font-body text-white/70 text-[9px] sm:text-[11px] md:text-xs leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
}
