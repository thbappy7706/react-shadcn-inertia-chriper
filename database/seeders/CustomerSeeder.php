<?php

namespace Database\Seeders;

use App\Jobs\SeedCustomerJob;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $totalProducts = 100000;
        $batchSize = 1000;

        $batches = ceil($totalProducts / $batchSize);

        for ($i = 0; $i < $batches; $i++) {
            $remainingProducts = $totalProducts - ($i * $batchSize);
            $currentBatchSize = min($batchSize, $remainingProducts);

            SeedCustomerJob::dispatch($currentBatchSize, $i * $batchSize);
        }

        Artisan::call('queue:work --stop-when-empty');
    }
}
