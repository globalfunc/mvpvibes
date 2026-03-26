<?php

namespace App\Mail;

use App\Models\BookedSession;
use App\Models\BookingSetting;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\URL;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public BookedSession $session) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your Scoping Session is Booked — MVP Vibes');
    }

    public function content(): Content
    {
        $settings  = BookingSetting::current();
        $adminTz   = new \DateTimeZone($settings->timezone);
        $startLocal = $this->session->start_utc->copy()->setTimezone($adminTz);
        $endLocal   = $this->session->end_utc->copy()->setTimezone($adminTz);

        $confirmUrl = config('app.url').URL::signedRoute('booking.confirm', ['session' => $this->session->id], absolute: false);

        return new Content(
            view: 'emails.booking-confirmation',
            with: [
                'name'       => $this->session->bookableUser->name,
                'date'       => $startLocal->format('l, F j, Y'),
                'startTime'  => $startLocal->format('H:i'),
                'endTime'    => $endLocal->format('H:i'),
                'timezone'   => $settings->timezone,
                'confirmUrl' => $confirmUrl,
            ],
        );
    }
}
