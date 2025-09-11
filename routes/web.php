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

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [

            'stats' => [
                'users' => User::count(),
                'payments' => Payment::count(),
            ],
            'chartData' => [
                'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                'values' => [10, 20, 15, 30, 25],
            ],

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
