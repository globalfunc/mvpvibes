<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\BookedSessionController;
use App\Http\Controllers\Admin\BookingDayController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SettingsController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function () {

    // Guest-only routes
    Route::middleware('guest:admin')->group(function () {
        Route::get('login', [AuthController::class, 'showLogin'])->name('login');
        Route::post('login', [AuthController::class, 'login'])->name('login.post');
    });

    // Authenticated admin routes
    Route::middleware('admin.auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');

        Route::get('/', fn () => redirect()->route('admin.dashboard'));

        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('settings', [SettingsController::class, 'edit'])->name('settings.edit');
        Route::put('settings', [SettingsController::class, 'update'])->name('settings.update');

        Route::get('availability', [BookingDayController::class, 'index'])->name('availability.index');
        Route::put('availability/{day}', [BookingDayController::class, 'update'])->name('availability.update');

        Route::get('booked-sessions', [BookedSessionController::class, 'index'])->name('booked-sessions.index');
        Route::delete('booked-sessions/{session}', [BookedSessionController::class, 'destroy'])->name('booked-sessions.destroy');
        Route::post('booked-sessions/{session}/reschedule', [BookedSessionController::class, 'reschedule'])->name('booked-sessions.reschedule');
    });
});
