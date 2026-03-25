<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BookingSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/settings/index', [
            'settings'           => BookingSetting::current(),
            'availableTimezones' => \DateTimeZone::listIdentifiers(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'timezone'              => ['required', 'string', 'timezone'],
            'min_hour'              => ['required', 'integer', 'min:0', 'max:23'],
            'max_hour'              => ['required', 'integer', 'min:1', 'max:24'],
            'slot_duration_minutes' => ['required', 'integer', 'in:15,30,60,120'],
            'buffer_minutes'        => ['required', 'integer', 'in:0,15,30,60'],
        ]);

        $settings = BookingSetting::current();
        $settings->update($data);

        return back()->with('success', 'Settings updated.');
    }
}
