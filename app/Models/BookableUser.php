<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BookableUser extends Model
{
    protected $fillable = ['name', 'email', 'idea'];

    public function bookedSessions(): HasMany
    {
        return $this->hasMany(BookedSession::class);
    }
}
