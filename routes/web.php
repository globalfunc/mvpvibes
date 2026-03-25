<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\BookingRescheduleController;
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

// Public booking API (JSON)
Route::prefix('api/booking')->group(function () {
    Route::get('schedule', [BookingController::class, 'schedule'])->name('booking.schedule');
    Route::post('/', [BookingController::class, 'store'])->name('booking.store');
});

// Signed user-confirmation link (sent in booking confirmation email)
Route::get('/booking/confirm/{session}', [BookingController::class, 'confirmUser'])
    ->name('booking.confirm')
    ->middleware('signed');

// Signed reschedule / cancel confirmation links
Route::get('/booking/reschedule/{session}', [BookingRescheduleController::class, 'show'])
    ->name('booking.reschedule.show')
    ->middleware('signed');
Route::post('/booking/reschedule/{session}/confirm', [BookingRescheduleController::class, 'confirm'])
    ->name('booking.reschedule.confirm')
    ->middleware('signed');
Route::get('/booking/rebook/{session}', [BookingRescheduleController::class, 'rebook'])
    ->name('booking.rebook')
    ->middleware('signed');

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
