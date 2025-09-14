<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('customer')?->id;

        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:255', 'unique:customers,username,'.($id ?? 'null')],
            'email' => ['required', 'email', 'max:255', 'unique:customers,email,'.($id ?? 'null')],
            'phone' => ['nullable', 'string', 'max:255'],
            'street_address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'country' => ['nullable', 'string', 'max:255'],
            'date_of_birth' => ['nullable', 'date'],
            'gender' => ['nullable', 'in:male,female,other'],
            'profile_photo' => ['nullable', 'string', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'vat_number' => ['nullable', 'string', 'max:255'],
            'currency' => ['nullable', 'string', 'max:10'],
            'account_balance' => ['nullable', 'numeric'],
            'is_active' => ['nullable', 'boolean'],
            'last_login_at' => ['nullable', 'date'],
            'preferred_language' => ['nullable', 'string', 'max:10'],
            'last_ip' => ['nullable', 'ip'],
            'extra_info' => ['nullable', 'array'],
        ];
    }
}

