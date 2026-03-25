<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Models\BookedSession;
use App\Models\BookingSetting;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $settings = BookingSetting::current();

        $total     = BookedSession::count();
        $pending   = BookedSession::where('status', BookingStatus::Pending)->count();
        $upcoming  = BookedSession::upcoming()->count();
        $cancelled = BookedSession::where('status', BookingStatus::Cancelled)->count();

        $recent = BookedSession::with('bookableUser')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(fn ($s) => [
                'id'         => $s->id,
                'name'       => $s->bookableUser->name,
                'email'      => $s->bookableUser->email,
                'start_utc'  => $s->start_utc->toISOString(),
                'end_utc'    => $s->end_utc->toISOString(),
                'status'     => $s->status->value,
            ]);

        return Inertia::render('admin/dashboard', [
            'stats'          => compact('total', 'pending', 'upcoming', 'cancelled'),
            'recent'         => $recent,
            'adminTimezone'  => $settings->timezone,
        ]);
    }
}
