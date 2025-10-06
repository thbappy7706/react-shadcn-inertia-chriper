<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomersCrudTest extends TestCase
{
    use RefreshDatabase;

    protected function authenticate(): User
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        return $user;
    }

    public function test_index_displays_customers_list(): void
    {
        $this->authenticate();
        Customer::factory()->count(3)->create();

        $response = $this->get(route('customers.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('customers/index')
            ->has('customers')
        );
    }

    public function test_store_creates_customer(): void
    {
        $this->authenticate();

        $payload = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'username' => 'johndoe',
            'email' => 'john@example.com',
            'phone' => '123456789',
            'is_active' => true,
        ];

        $response = $this->post(route('customers.store'), $payload);

        $response->assertRedirect(route('customers.index'));
        $this->assertDatabaseHas('customers', [
            'email' => 'john@example.com',
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);
    }

    public function test_update_updates_customer(): void
    {
        $this->authenticate();

        $customer = Customer::factory()->create([
            'email' => 'old@example.com',
            'first_name' => 'Old',
            'last_name' => 'Name',
        ]);

        $payload = [
            'first_name' => 'New',
            'last_name' => 'Name',
            'username' => $customer->username, // keep unique
            'email' => 'new@example.com',
            'is_active' => false,
        ];

        $response = $this->put(route('customers.update', $customer), $payload);

        $response->assertRedirect(route('customers.index'));
        $this->assertDatabaseHas('customers', [
            'id' => $customer->id,
            'email' => 'new@example.com',
            'first_name' => 'New',
        ]);
    }

    public function test_destroy_soft_deletes_customer(): void
    {
        $this->authenticate();

        $customer = Customer::factory()->create();

        $response = $this->delete(route('customers.destroy', $customer));

        $response->assertRedirect();
        $this->assertSoftDeleted('customers', [
            'id' => $customer->id,
        ]);
    }
}
