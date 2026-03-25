<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Mail\BookingConfirmationMail;
use App\Models\BookableUser;
use App\Models\BookedSession;
use App\Models\BookingDay;
use App\Models\BookingSetting;
use Carbon\Carbon;
use Carbon\CarbonTimeZone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class BookingController extends Controller
{
    public function schedule(): JsonResponse
    {
        $settings    = BookingSetting::current();
        $adminTz     = new \DateTimeZone($settings->timezone);
        $duration    = $settings->slot_duration_minutes;
        $buffer      = $settings->buffer_minutes;

        // Load enabled booking days keyed by day_of_week
        $bookingDays = BookingDay::where('is_enabled', true)
            ->get()
            ->keyBy('day_of_week');

        // Preload all active sessions in the next 60 days (UTC)
        $windowEnd = Carbon::now('UTC')->addDays(61)->startOfDay();
        $activeSessions = BookedSession::active()
            ->where('start_utc', '>=', now('UTC'))
            ->where('start_utc', '<', $windowEnd)
            ->get(['start_utc', 'end_utc'])
            ->map(fn ($s) => [
                'start' => $s->start_utc->valueOf(), // ms timestamp for comparison
                'end'   => $s->end_utc->valueOf(),
            ])
            ->toArray();

        $slots = [];
        $today = Carbon::now($adminTz)->startOfDay();

        for ($i = 1; $i <= 60; $i++) {
            $date   = $today->copy()->addDays($i);
            $dow    = (int) $date->format('N') % 7; // 0=Sun, 1=Mon ... 6=Sat

            if (! isset($bookingDays[$dow])) {
                continue;
            }

            $day        = $bookingDays[$dow];
            $startHour  = $day->effectiveStartHour($settings);
            $endHour    = $day->effectiveEndHour($settings);

            $t   = $date->copy()->setTime($startHour, 0, 0)->setTimezone('UTC');
            $end = $date->copy()->setTime($endHour, 0, 0)->setTimezone('UTC');

            while ($t->copy()->addMinutes($duration)->lte($end)) {
                $slotStart = $t->copy();
                $slotEnd   = $t->copy()->addMinutes($duration);

                $startMs = $slotStart->valueOf();
                $endMs   = $slotEnd->valueOf();
                $bufferMs = $buffer * 60 * 1000;

                $blocked = false;
                foreach ($activeSessions as $session) {
                    if ($startMs < ($session['end'] + $bufferMs) && $endMs > $session['start']) {
                        $blocked = true;
                        break;
                    }
                }

                $slots[] = [
                    'startUtc'  => $slotStart->toISOString(),
                    'endUtc'    => $slotEnd->toISOString(),
                    'available' => ! $blocked,
                ];

                $t->addMinutes($duration);
            }
        }

        return response()->json(['slots' => $slots]);
    }

    public function confirmUser(BookedSession $session): \Illuminate\Contracts\View\View|\Illuminate\Http\RedirectResponse
    {
        if ($session->isCancelled()) {
            return view('booking-confirm-result', ['success' => false, 'message' => 'This booking has been cancelled.']);
        }

        if (! $session->user_confirmed_at) {
            $session->update([
                'user_confirmed_at' => now(),
                'status'            => BookingStatus::Confirmed,
            ]);
        }

        return view('booking-confirm-result', ['success' => true]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'       => ['required', 'string', 'max:255'],
            'email'      => ['required', 'email', 'max:255'],
            'idea'       => ['nullable', 'string', 'max:2000'],
            'start_utc'  => ['required', 'date', 'after:now'],
            'end_utc'    => ['required', 'date', 'after:start_utc'],
        ]);

        $startUtc = Carbon::parse($data['start_utc'])->utc();
        $endUtc   = Carbon::parse($data['end_utc'])->utc();

        $settings = BookingSetting::current();

        // Verify duration matches configured slot duration
        $diffMinutes = (int) $startUtc->diffInMinutes($endUtc);
        if ($diffMinutes !== $settings->slot_duration_minutes) {
            return response()->json([
                'errors' => ['start_utc' => ['Invalid slot duration.']],
            ], 422);
        }

        // Verify the slot falls on an enabled booking day
        $adminTz = new \DateTimeZone($settings->timezone);
        $startInAdminTz = $startUtc->copy()->setTimezone($adminTz);
        $dow = (int) $startInAdminTz->format('N') % 7;

        $bookingDay = BookingDay::where('day_of_week', $dow)->where('is_enabled', true)->first();
        if (! $bookingDay) {
            return response()->json([
                'errors' => ['start_utc' => ['Selected day is not available for booking.']],
            ], 422);
        }

        // Verify the slot start aligns to the grid
        $startHour    = $bookingDay->effectiveStartHour($settings);
        $dayStartUtc  = $startInAdminTz->copy()->setTime($startHour, 0, 0)->setTimezone('UTC');
        $offsetMinutes = $dayStartUtc->diffInMinutes($startUtc, false);
        if ($offsetMinutes < 0 || $offsetMinutes % $settings->slot_duration_minutes !== 0) {
            return response()->json([
                'errors' => ['start_utc' => ['Selected time does not align to a valid slot.']],
            ], 422);
        }

        // Check the slot is not already booked (with buffer)
        $buffer   = $settings->buffer_minutes;
        $conflict = BookedSession::active()
            ->where(function ($q) use ($startUtc, $endUtc, $buffer) {
                $q->where('start_utc', '<', $endUtc->copy()->addMinutes($buffer))
                  ->where('end_utc', '>', $startUtc->copy()->subMinutes($buffer));
            })
            ->exists();

        if ($conflict) {
            return response()->json([
                'errors' => ['start_utc' => ['This slot is no longer available.']],
            ], 422);
        }

        $bookableUser = BookableUser::create([
            'name'  => $data['name'],
            'email' => $data['email'],
            'idea'  => $data['idea'] ?? null,
        ]);

        $session = BookedSession::create([
            'bookable_user_id' => $bookableUser->id,
            'start_utc'        => $startUtc,
            'end_utc'          => $endUtc,
            'status'           => BookingStatus::Pending,
        ]);

        Mail::to($bookableUser->email)->queue(new BookingConfirmationMail($session));

        return response()->json(['message' => 'Booking confirmed.'], 201);
    }
}
