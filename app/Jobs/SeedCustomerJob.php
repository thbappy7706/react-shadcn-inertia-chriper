<?php

namespace App\Jobs;

use App\Models\Customer;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Str;

class SeedCustomerJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $batchSize,
        public int $startIndex
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Customer::factory()
            ->count($this->batchSize)
            ->sequence(
                fn ($sequence) => [
                    'first_name' => fake()->firstName,
                    'last_name'  => fake()->lastName,
                    'email'      => 'customer' . ($this->startIndex + $sequence->index) . '@example.com',
                ]
            )
            ->create();
    }
}
