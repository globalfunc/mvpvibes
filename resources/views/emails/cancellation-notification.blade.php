<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Session Cancelled</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter',Arial,sans-serif;color:#e5e7eb;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1f2937;max-width:600px;width:100%;">
      <!-- Header -->
      <tr><td style="padding:40px 48px 32px;border-bottom:1px solid #1f2937;">
        <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:#6b7280;">MVP VIBES // SCOPING SESSION</p>
        <h1 style="margin:0;font-size:28px;font-weight:700;color:#fff;letter-spacing:-0.02em;">Your session has been cancelled.</h1>
      </td></tr>
      <!-- Body -->
      <tr><td style="padding:40px 48px;">
        <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.6;">Hi {{ $name }},</p>
        <p style="margin:0 0 8px;color:#9ca3af;font-size:15px;line-height:1.6;">Your session has been cancelled for the following reason:</p>
        <blockquote style="margin:0 0 32px;padding:16px 20px;border-left:3px solid #ef4444;background:#0a0a0a;color:#d1d5db;font-size:14px;line-height:1.6;">
          {{ $reason }}
        </blockquote>
        <!-- Cancelled session -->
        <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#6b7280;">CANCELLED SESSION</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #1f2937;margin-bottom:32px;">
          <tr><td style="padding:20px 24px;">
            <p style="margin:0;font-size:15px;color:#6b7280;text-decoration:line-through;">{{ $date }} &nbsp; {{ $startTime }}–{{ $endTime }}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#4b5563;">{{ $timezone }}</p>
          </td></tr>
        </table>
        <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.6;">
          You're welcome to book a new session at a time that works for you.
        </p>
        <!-- CTA -->
        <a href="{!! $signedUrl !!}" style="display:inline-block;padding:16px 32px;background:#10b981;color:#000;font-weight:700;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;margin-bottom:24px;">
          BOOK A NEW SESSION
        </a>
        <p style="margin:0;color:#6b7280;font-size:12px;line-height:1.6;">
          This link expires in 7 days. If you have any questions, simply reply to this email.
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
