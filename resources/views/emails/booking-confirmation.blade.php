<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Booking Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter',Arial,sans-serif;color:#e5e7eb;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1f2937;max-width:600px;width:100%;">
      <!-- Header -->
      <tr><td style="padding:40px 48px 32px;border-bottom:1px solid #1f2937;">
        <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:#6b7280;">MVP VIBES // SCOPING SESSION</p>
        <h1 style="margin:0;font-size:28px;font-weight:700;color:#fff;letter-spacing:-0.02em;">You're on the calendar.</h1>
      </td></tr>
      <!-- Body -->
      <tr><td style="padding:40px 48px;">
        <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.6;">Hi {{ $name }},</p>
        <p style="margin:0 0 32px;color:#9ca3af;font-size:15px;line-height:1.6;">
          Your scoping session has been booked. We'll review your submission and be in touch to confirm the details.
        </p>
        <!-- Booking details box -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #1f2937;margin-bottom:32px;">
          <tr><td style="padding:24px 28px;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#6b7280;">DATE</p>
            <p style="margin:0 0 20px;font-size:17px;font-weight:600;color:#fff;">{{ $date }}</p>
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#6b7280;">TIME</p>
            <p style="margin:0 0 20px;font-size:17px;font-weight:600;color:#fff;">{{ $startTime }} — {{ $endTime }}</p>
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#6b7280;">TIMEZONE</p>
            <p style="margin:0;font-size:14px;color:#6b7280;">{{ $timezone }}</p>
          </td></tr>
        </table>
        <!-- Confirm button -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
          <tr><td align="center">
            <a href="{!! $confirmUrl !!}"
               style="display:inline-block;background:#10b981;color:#000;font-size:13px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;padding:16px 40px;">
              CONFIRM MY BOOKING
            </a>
          </td></tr>
        </table>
        <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
          Please confirm your booking by clicking the button above. If you have any questions, simply reply to this email.
        </p>
      </td></tr>
      <!-- Footer -->
      <tr><td style="padding:24px 48px;border-top:1px solid #1f2937;">
        <p style="margin:0;font-size:12px;color:#4b5563;">© MVP Vibes. All rights reserved.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>
