<?php

namespace App\Mail;

use App\Models\BookedSession;
use App\Models\BookingSetting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CancellationNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public BookedSession $session,
        public string $signedUrl,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your Scoping Session Has Been Cancelled — MVP Vibes');
    }

    public function content(): Content
    {
        $settings  = BookingSetting::current();
        $adminTz   = new \DateTimeZone($settings->timezone);
        $startLocal = $this->session->start_utc->copy()->setTimezone($adminTz);
        $endLocal   = $this->session->end_utc->copy()->setTimezone($adminTz);

        return new Content(
            view: 'emails.cancellation-notification',
            with: [
                'name'      => $this->session->bookableUser->name,
                'reason'    => $this->session->reschedule_reason,
                'date'      => $startLocal->format('l, F j, Y'),
                'startTime' => $startLocal->format('H:i'),
                'endTime'   => $endLocal->format('H:i'),
                'timezone'  => $settings->timezone,
                'signedUrl' => $this->signedUrl,
            ],
        );
    }
}
