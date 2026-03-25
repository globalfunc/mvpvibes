<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BookingDay;
use App\Models\BookingSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingDayController extends Controller
{
    public function index(): Response
    {
        $settings = BookingSetting::current();
        $days     = BookingDay::orderBy('day_of_week')->get();

        return Inertia::render('admin/availability/index', [
            'days'     => $days,
            'settings' => $settings,
        ]);
    }

    public function update(Request $request, BookingDay $day): RedirectResponse
    {
        $data = $request->validate([
            'is_enabled' => ['required', 'boolean'],
            'start_hour' => ['nullable', 'integer', 'min:0', 'max:23'],
            'end_hour'   => ['nullable', 'integer', 'min:1', 'max:24'],
        ]);

        $day->update($data);

        return back()->with('success', 'Day updated.');
    }
}
