import { useRef, useEffect } from 'react';

type ServiceItemProps = {
    image: string;
    title: string;
    description: string;
    features: string[];
    icons: string[];
};

export default function ServiceItem({ image, title, description, features, icons }: ServiceItemProps) {
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const img = imgRef.current;

        if (!img) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-in-view');
                    } else {
                        entry.target.classList.remove('is-in-view');
                    }
                });
            },
            { root: null, rootMargin: '-80px 0px 0px 0px', threshold: 0.5 }
        );

        observer.observe(img);

        return () => observer.disconnect();
    }, []);

    return (
        <div className="glass-card p-1 flex flex-col group">
            <img
                ref={imgRef}
                className="w-full h-96 object-cover grayscale opacity-50 transition-all duration-700 [&.is-in-view]:grayscale-0 [&.is-in-view]:opacity-80"
                alt={title}
                src={image}
            />
            <div className="p-5 sm:p-10">
                <h3 className="font-headline font-bold text-3xl text-white mb-2">{title}</h3>
                <p className="text-white/60 mb-8">{description}</p>
                <ul className="space-y-4">
                    {features.map((feature, fi) => (
                        <li key={fi} className="flex items-center gap-3 text-sm text-white/80">
                            <span
                                className="material-symbols-outlined text-primary"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                {icons[fi]}
                            </span>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
