<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingDay extends Model
{
    protected $fillable = [
        'day_of_week',
        'is_enabled',
        'start_hour',
        'end_hour',
    ];

    protected function casts(): array
    {
        return [
            'day_of_week' => 'integer',
            'is_enabled'  => 'boolean',
            'start_hour'  => 'integer',
            'end_hour'    => 'integer',
        ];
    }

    public function effectiveStartHour(BookingSetting $settings): int
    {
        return $this->start_hour ?? $settings->min_hour;
    }

    public function effectiveEndHour(BookingSetting $settings): int
    {
        return $this->end_hour ?? $settings->max_hour;
    }

    public static function dayName(int $dow): string
    {
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][$dow];
    }
}
