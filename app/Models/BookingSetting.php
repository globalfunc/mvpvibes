<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingSetting extends Model
{
    protected $fillable = [
        'timezone',
        'min_hour',
        'max_hour',
        'slot_duration_minutes',
        'buffer_minutes',
    ];

    protected function casts(): array
    {
        return [
            'min_hour'              => 'integer',
            'max_hour'              => 'integer',
            'slot_duration_minutes' => 'integer',
            'buffer_minutes'        => 'integer',
        ];
    }

    public static function current(): self
    {
        return static::firstOrCreate([], [
            'timezone'              => 'Europe/Sofia',
            'min_hour'              => 9,
            'max_hour'              => 17,
            'slot_duration_minutes' => 60,
            'buffer_minutes'        => 0,
        ]);
    }
}
