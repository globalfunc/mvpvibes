<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $forceDark = config('app.force_dark_mode', false);
        View::share('appearance', $forceDark ? 'dark' : ($request->cookie('appearance') ?? 'system'));
        View::share('forceDarkMode', $forceDark);

        return $next($request);
    }
}
