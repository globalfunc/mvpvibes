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
        Schema::create('booking_days', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('day_of_week')->unsigned()->comment('0=Sunday, 1=Monday, ..., 6=Saturday');
            $table->boolean('is_enabled')->default(true);
            $table->tinyInteger('start_hour')->unsigned()->nullable()->comment('Override global min_hour for this day');
            $table->tinyInteger('end_hour')->unsigned()->nullable()->comment('Override global max_hour for this day');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_days');
    }
};
