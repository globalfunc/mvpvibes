<?php

namespace App\Models;

use App\Enums\BookingStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class BookedSession extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'bookable_user_id',
        'start_utc',
        'end_utc',
        'status',
        'user_confirmed_at',
        'proposed_start_utc',
        'proposed_end_utc',
        'reschedule_reason',
    ];

    protected function casts(): array
    {
        return [
            'start_utc'          => 'datetime',
            'end_utc'            => 'datetime',
            'user_confirmed_at'  => 'datetime',
            'proposed_start_utc' => 'datetime',
            'proposed_end_utc'   => 'datetime',
            'status'             => BookingStatus::class,
        ];
    }

    public function bookableUser(): BelongsTo
    {
        return $this->belongsTo(BookableUser::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', '!=', BookingStatus::Cancelled);
    }

    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where('status', '!=', BookingStatus::Cancelled)
            ->where('start_utc', '>', now());
    }

    public function isCancelled(): bool
    {
        return $this->status === BookingStatus::Cancelled;
    }
}
