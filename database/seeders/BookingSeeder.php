<?php

namespace Database\Seeders;

use App\Models\BookingDay;
use App\Models\BookingSetting;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        // Create default booking settings
        BookingSetting::firstOrCreate([], [
            'timezone'              => 'Europe/Sofia',
            'min_hour'              => 9,
            'max_hour'              => 17,
            'slot_duration_minutes' => 60,
            'buffer_minutes'        => 0,
        ]);

        // Create 7 booking day records (Sun=0 ... Sat=6)
        // Mon–Fri enabled, Sat/Sun disabled
        $days = [
            0 => false, // Sunday
            1 => true,  // Monday
            2 => true,  // Tuesday
            3 => true,  // Wednesday
            4 => true,  // Thursday
            5 => true,  // Friday
            6 => false, // Saturday
        ];

        foreach ($days as $dow => $enabled) {
            BookingDay::firstOrCreate(
                ['day_of_week' => $dow],
                [
                    'is_enabled' => $enabled,
                    'start_hour' => null,
                    'end_hour'   => null,
                ]
            );
        }
    }
}
