<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    private const SUPPORTED = ['en', 'bg'];

    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->route('locale');

        if ($locale && in_array($locale, self::SUPPORTED, true)) {
            app()->setLocale($locale);
        }

        return $next($request);
    }
}
