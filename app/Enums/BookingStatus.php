<?php

namespace App\Enums;

enum BookingStatus: string
{
    case Pending     = 'pending';
    case Confirmed   = 'confirmed';
    case Rescheduled = 'rescheduled';
    case Cancelled   = 'cancelled';
}
