<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

// Redirect bare root to default locale
Route::redirect('/', '/en');

Route::prefix('{locale}')
    ->where(['locale' => 'en|bg'])
    ->group(function () {
        Route::inertia('/', 'welcome', [
            'canRegister' => Features::enabled(Features::registration()),
        ])->name('home');
    });

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
