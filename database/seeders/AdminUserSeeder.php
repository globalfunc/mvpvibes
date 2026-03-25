<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email    = env('ADMIN_EMAIL', 'admin@mvpvibes.com');
        $password = env('ADMIN_PASSWORD', 'changeme123!');
        $name     = env('ADMIN_NAME', 'Admin');

        AdminUser::firstOrCreate(
            ['email' => $email],
            [
                'name'     => $name,
                'password' => Hash::make($password),
            ]
        );
    }
}
