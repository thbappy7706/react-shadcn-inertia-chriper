<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    public function definition(): array
    {
        return [
            'first_name'       => $this->faker->firstName(),
            'last_name'        => $this->faker->lastName(),
            'username'         => $this->faker->unique()->userName(),
            'email'            => $this->faker->unique()->safeEmail(),
            'phone'            => $this->faker->phoneNumber(),

            'street_address'   => $this->faker->streetAddress(),
            'city'             => $this->faker->city(),
            'state'            => $this->faker->state(),
            'postal_code'      => $this->faker->postcode(),
            'country'          => $this->faker->country(),

            'date_of_birth'    => $this->faker->date('Y-m-d', '-20 years'),
            'gender'           => $this->faker->randomElement(['male', 'female', 'other']),
            'profile_photo'    => $this->faker->imageUrl(200, 200, 'people', true, 'Customer'),

            'company_name'     => $this->faker->company(),
            'vat_number'       => strtoupper(Str::random(10)),
            'currency'         => $this->faker->randomElement(['USD', 'EUR', 'GBP', 'BDT']),
            'account_balance'  => $this->faker->randomFloat(2, 0, 5000),

            'is_active'        => $this->faker->boolean(90),
            'last_login_at'    => $this->faker->optional()->dateTimeThisYear(),
            'preferred_language'=> $this->faker->randomElement(['en', 'es', 'fr', 'de', 'bn']),

            'last_ip'          => $this->faker->ipv4(),
            'extra_info'       => [
                'notes' => $this->faker->sentence(),
                'referrer' => $this->faker->word(),
            ],
        ];
    }
}
