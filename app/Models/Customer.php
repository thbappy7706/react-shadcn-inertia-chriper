<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    /** @use HasFactory<\Database\Factories\CustomerFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'first_name',
        'last_name',
        'username',
        'email',
        'phone',
        'street_address',
        'city',
        'state',
        'postal_code',
        'country',
        'date_of_birth',
        'gender',
        'profile_photo',
        'company_name',
        'vat_number',
        'currency',
        'account_balance',
        'is_active',
        'last_login_at',
        'preferred_language',
        'last_ip',
        'extra_info',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'last_login_at' => 'datetime',
        'account_balance' => 'decimal:2',
        'is_active' => 'boolean',
        'extra_info' => 'array',
    ];
}
