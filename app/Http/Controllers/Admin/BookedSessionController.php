<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Mail\CancellationNotificationMail;
use App\Mail\RescheduleNotificationMail;
use App\Models\BookedSession;
use App\Models\BookingSetting;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Inertia\Response;

class BookedSessionController extends Controller
{
    public function index(Request $request): Response
    {
        $settings = BookingSetting::current();

        $query = BookedSession::with('bookableUser')->orderByDesc('start_utc');

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $sessions = $query->paginate(20)->through(fn ($s) => [
            'id'                  => $s->id,
            'name'                => $s->bookableUser->name,
            'email'               => $s->bookableUser->email,
            'idea'                => $s->bookableUser->idea,
            'start_utc'           => $s->start_utc->toISOString(),
            'end_utc'             => $s->end_utc->toISOString(),
            'proposed_start_utc'  => $s->proposed_start_utc?->toISOString(),
            'proposed_end_utc'    => $s->proposed_end_utc?->toISOString(),
            'status'              => $s->status->value,
            'reschedule_reason'   => $s->reschedule_reason,
        ]);

        return Inertia::render('admin/booked-sessions/index', [
            'sessions'      => $sessions,
            'adminTimezone' => $settings->timezone,
            'filters'       => ['status' => $request->status ?? 'all'],
        ]);
    }

    public function destroy(Request $request, BookedSession $session): RedirectResponse
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:1000'],
        ]);

        $session->update([
            'status'             => BookingStatus::Cancelled,
            'reschedule_reason'  => $request->reason,
        ]);

        $rebookUrl = config('app.url').URL::signedRoute('booking.rebook', ['session' => $session->id], now()->addDays(7), absolute: false);

        Mail::to($session->bookableUser->email)
            ->queue(new CancellationNotificationMail($session, $rebookUrl));

        return back()->with('success', 'Session cancelled and notification sent.');
    }

    public function reschedule(Request $request, BookedSession $session): RedirectResponse
    {
        $request->validate([
            'reason'               => ['required', 'string', 'max:1000'],
            'proposed_start_utc'   => ['required', 'date', 'after:now'],
            'proposed_end_utc'     => ['required', 'date', 'after:proposed_start_utc'],
        ]);

        $proposedStart = Carbon::parse($request->proposed_start_utc)->utc();
        $proposedEnd   = Carbon::parse($request->proposed_end_utc)->utc();

        $session->update([
            'status'              => BookingStatus::Rescheduled,
            'reschedule_reason'   => $request->reason,
            'proposed_start_utc'  => $proposedStart,
            'proposed_end_utc'    => $proposedEnd,
        ]);

        $rescheduleUrl = config('app.url').URL::signedRoute('booking.reschedule.show', ['session' => $session->id], now()->addDays(7), absolute: false);

        Mail::to($session->bookableUser->email)
            ->queue(new RescheduleNotificationMail($session, $rescheduleUrl));

        return back()->with('success', 'Reschedule notification sent.');
    }
}
