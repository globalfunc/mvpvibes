<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('booked_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bookable_user_id')->constrained('bookable_users')->cascadeOnDelete();
            $table->dateTime('start_utc');
            $table->dateTime('end_utc');
            $table->enum('status', ['pending', 'confirmed', 'rescheduled', 'cancelled'])->default('pending');
            $table->dateTime('proposed_start_utc')->nullable();
            $table->dateTime('proposed_end_utc')->nullable();
            $table->text('reschedule_reason')->nullable();
            $table->timestamps();

            $table->index(['start_utc', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booked_sessions');
    }
};
