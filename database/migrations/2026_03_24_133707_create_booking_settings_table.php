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
        Schema::create('booking_settings', function (Blueprint $table) {
            $table->id();
            $table->string('timezone', 100)->default('Europe/Sofia');
            $table->tinyInteger('min_hour')->unsigned()->default(9);
            $table->tinyInteger('max_hour')->unsigned()->default(17);
            $table->smallInteger('slot_duration_minutes')->unsigned()->default(60);
            $table->smallInteger('buffer_minutes')->unsigned()->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_settings');
    }
};
