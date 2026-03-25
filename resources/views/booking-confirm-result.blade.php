<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{{ $success ? 'Booking Confirmed' : 'Confirmation Failed' }} — MVP Vibes</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter',Arial,sans-serif;color:#e5e7eb;min-height:100vh;display:flex;align-items:center;justify-content:center;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1f2937;max-width:560px;width:100%;">
      <tr><td style="padding:40px 48px 32px;border-bottom:1px solid #1f2937;">
        <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:#6b7280;">MVP VIBES // SCOPING SESSION</p>
        @if($success)
          <h1 style="margin:0;font-size:28px;font-weight:700;color:#fff;letter-spacing:-0.02em;">Booking confirmed.</h1>
        @else
          <h1 style="margin:0;font-size:28px;font-weight:700;color:#fff;letter-spacing:-0.02em;">Unable to confirm.</h1>
        @endif
      </td></tr>
      <tr><td style="padding:40px 48px;">
        @if($success)
          <div style="display:inline-block;width:56px;height:56px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);text-align:center;line-height:56px;font-size:28px;margin-bottom:24px;">✓</div>
          <p style="margin:0 0 16px;color:#9ca3af;font-size:15px;line-height:1.6;">
            Your scoping session is now confirmed. We look forward to speaking with you.
          </p>
          <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
            If you have any questions in the meantime, simply reply to your confirmation email.
          </p>
        @else
          <p style="margin:0 0 16px;color:#9ca3af;font-size:15px;line-height:1.6;">
            {{ $message ?? 'This confirmation link is no longer valid.' }}
          </p>
          <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
            If you believe this is an error, please reply to your confirmation email.
          </p>
        @endif
      </td></tr>
      <tr><td style="padding:24px 48px;border-top:1px solid #1f2937;">
        <p style="margin:0;font-size:12px;color:#4b5563;">© MVP Vibes. All rights reserved.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>
