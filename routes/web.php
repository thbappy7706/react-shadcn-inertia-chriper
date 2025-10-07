<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProductController;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'stats' => [
                'users' => User::count(),
                'payments' => Payment::count(),
                'subscriptions' => 250,
                'revenue' => 12450,
            ],
            'chartData' => [
                'monthly' => [
                    'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    'values' => [100, 70, 35, 30, 25, 18, 56, 27, 98, 55, 45, 75],
                ],
                'revenue' => [
                    'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    'values' => [1200, 2100, 1800, 2400, 3000, 2800],
                ],
                'usersByRegion' => [
                    ['name' => 'North America', 'value' => 400],
                    ['name' => 'Europe', 'value' => 300],
                    ['name' => 'Asia', 'value' => 200],
                    ['name' => 'Others', 'value' => 100],
                ],
            ],
        ]);
    })->name('dashboard');



    Route::get('dashboard', function () {
        // Basic stats etc.
        $stats = [
            'users' => \App\Models\User::count(),
            'payments' => \App\Models\Payment::count(),
            'subscriptions' => 250,
            'revenue' => 12450,
        ];

        $chartData = [
            'monthly' => [
                'labels' => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                'values' => [100,70,35,30,25,18,56,27,98,55,45,75],
            ],
            'revenue' => [
                'labels' => ['Jan','Feb','Mar','Apr','May','Jun'],
                'values' => [1200,2101,1800,2400,3000,2800],
            ],
            'usersByRegion' => [
                ['name'=>'North America','value'=>400],
                ['name'=>'Europe','value'=>300],
                ['name'=>'Asia','value'=>200],
                ['name'=>'Others','value'=>100],
            ],
        ];

        // Fetch weather
        $latitude = 23.8103;
        $longitude = 90.4125;
        $resp = Http::get('https://api.open-meteo.com/v1/forecast', [
            'latitude' => $latitude,
            'longitude' => $longitude,
            'hourly' => 'temperature_2m,relative_humidity_2m',
            'current_weather' => 'true',
        ]);

        $weather = null;
        if ($resp->ok()) {
            $weather = $resp->json();
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'chartData' => $chartData,
            'weather' => $weather,
        ]);
    })->name('dashboard');


    Route::resource('payments', PaymentController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('posts', PostController::class);
    Route::resource('products', ProductController::class);
    Route::resource('customers', CustomerController::class);
    Route::get('customers/{customer}/json', [CustomerController::class, 'json'])->name('customers.json');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
