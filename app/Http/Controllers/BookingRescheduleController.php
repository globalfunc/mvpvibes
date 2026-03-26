<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Models\BookableUser;
use App\Models\BookedSession;
use App\Models\BookingSetting;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Inertia\Response;

class BookingRescheduleController extends Controller
{
    /**
     * Show the landing page with the booking modal pre-opened for reschedule confirmation.
     * Signed URL — sent to user when admin reschedules their session.
     */
    public function show(BookedSession $session): Response
    {
        $user = $session->bookableUser;

        $confirmUrl = config('app.url').URL::signedRoute('booking.reschedule.confirm', ['session' => $session->id], now()->addDays(7), absolute: false);

        return Inertia::render('welcome', [
            'autoOpenBooking'      => true,
            'prefillData'          => ['name' => $user->name, 'email' => $user->email],
            'proposedStartUtc'     => $session->proposed_start_utc?->toISOString(),
            'proposedEndUtc'       => $session->proposed_end_utc?->toISOString(),
            'rescheduleSessionId'  => $session->id,
            'rescheduleConfirmUrl' => $confirmUrl,
        ]);
    }

    /**
     * Confirm the proposed reschedule.
     * Signed URL — creates a new booking from proposed fields.
     */
    public function confirm(Request $request, BookedSession $session): JsonResponse
    {
        if (! $session->proposed_start_utc || ! $session->proposed_end_utc) {
            return response()->json(['error' => 'No proposed time available.'], 422);
        }

        $settings = BookingSetting::current();

        // Check proposed slot is still available
        $buffer   = $settings->buffer_minutes;
        $conflict = BookedSession::active()
            ->where('id', '!=', $session->id)
            ->where(function ($q) use ($session, $buffer) {
                $q->where('start_utc', '<', $session->proposed_end_utc->copy()->addMinutes($buffer))
                  ->where('end_utc', '>', $session->proposed_start_utc->copy()->subMinutes($buffer));
            })
            ->exists();

        if ($conflict) {
            return response()->json(['error' => 'Proposed slot is no longer available.'], 409);
        }

        // Create a new booking session for the proposed time
        BookedSession::create([
            'bookable_user_id' => $session->bookable_user_id,
            'start_utc'        => $session->proposed_start_utc,
            'end_utc'          => $session->proposed_end_utc,
            'status'           => BookingStatus::Confirmed,
        ]);

        // Soft-delete the superseded session so only the new one remains active
        $session->delete();

        return response()->json(['message' => 'Booking confirmed.'], 201);
    }

    /**
     * Show the landing page with the booking modal pre-opened for fresh rebooking.
     * Signed URL — sent to user when admin cancels their session.
     */
    public function rebook(BookedSession $session): Response
    {
        $user = $session->bookableUser;

        return Inertia::render('welcome', [
            'autoOpenBooking' => true,
            'prefillData'     => ['name' => $user->name, 'email' => $user->email],
            'rebookSessionId' => $session->id,
        ]);
    }
}
