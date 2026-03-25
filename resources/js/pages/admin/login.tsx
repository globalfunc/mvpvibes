import { useState, FormEvent } from 'react';
import { router } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

type Props = {
    errors?: { email?: string; password?: string };
    status?: string;
};

export default function AdminLogin({ errors = {}, status }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post('/admin/login', { email, password }, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                            <AppLogoIcon className="size-9 fill-current text-white" />
                        </div>
                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium text-white">Admin Login</h1>
                            <p className="text-center text-sm text-white/50">
                                Sign in to manage bookings
                            </p>
                        </div>
                    </div>

                    {status && (
                        <div className="text-center text-sm font-medium text-emerald-400">
                            {status}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <label className="text-xs font-headline uppercase tracking-[0.25em] text-white/50" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    placeholder="admin@example.com"
                                    className="w-full bg-transparent border border-white/15 px-4 py-3 text-white text-sm
                                               placeholder:text-white/20 focus:outline-none focus:border-emerald-400/60 transition-colors"
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-xs">{errors.email}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <label className="text-xs font-headline uppercase tracking-[0.25em] text-white/50" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="w-full bg-transparent border border-white/15 px-4 py-3 text-white text-sm
                                               placeholder:text-white/20 focus:outline-none focus:border-emerald-400/60 transition-colors"
                                />
                                {errors.password && (
                                    <p className="text-red-400 text-xs">{errors.password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-2 w-full bg-emerald-500 text-black font-headline font-bold text-sm tracking-[0.15em] uppercase
                                           py-3 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {processing ? 'Signing in…' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
