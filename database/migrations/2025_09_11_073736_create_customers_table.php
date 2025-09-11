<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();

            // Basic Info
            $table->string('first_name');
            $table->string('last_name');
            $table->string('username')->unique()->nullable();
            $table->string('email')->unique();
            $table->string('phone')->nullable();

            // Address
            $table->string('street_address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->string('country')->nullable();

            // Profile
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->string('profile_photo')->nullable();

            // Business/Account
            $table->string('company_name')->nullable();
            $table->string('vat_number')->nullable();
            $table->string('currency', 10)->default('USD');
            $table->decimal('account_balance', 12, 2)->default(0);

            // Status & Meta
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_login_at')->nullable();
            $table->string('preferred_language', 10)->default('en');

            // Tracking
            $table->ipAddress('last_ip')->nullable();
            $table->json('extra_info')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
