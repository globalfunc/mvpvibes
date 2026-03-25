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

class RescheduleNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public BookedSession $session,
        public string $signedUrl,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your Scoping Session Has Been Rescheduled — MVP Vibes');
    }

    public function content(): Content
    {
        $settings  = BookingSetting::current();
        $adminTz   = new \DateTimeZone($settings->timezone);

        $origStart = $this->session->start_utc->copy()->setTimezone($adminTz);
        $origEnd   = $this->session->end_utc->copy()->setTimezone($adminTz);
        $propStart = $this->session->proposed_start_utc?->copy()->setTimezone($adminTz);
        $propEnd   = $this->session->proposed_end_utc?->copy()->setTimezone($adminTz);

        return new Content(
            view: 'emails.reschedule-notification',
            with: [
                'name'              => $this->session->bookableUser->name,
                'reason'            => $this->session->reschedule_reason,
                'originalDate'      => $origStart->format('l, F j, Y'),
                'originalStartTime' => $origStart->format('H:i'),
                'originalEndTime'   => $origEnd->format('H:i'),
                'proposedDate'      => $propStart?->format('l, F j, Y'),
                'proposedStartTime' => $propStart?->format('H:i'),
                'proposedEndTime'   => $propEnd?->format('H:i'),
                'timezone'          => $settings->timezone,
                'signedUrl'         => $this->signedUrl,
            ],
        );
    }
}
