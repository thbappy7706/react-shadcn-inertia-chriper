<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Customer::query();

        // Search across multiple columns
        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%");
            });
        }

        // Filters
        if ($request->filled('is_active')) {
            $query->where('is_active', (bool) $request->boolean('is_active'));
        }
        if ($request->filled('country')) {
            $query->where('country', $request->string('country'));
        }

        // Sorting
        $sortBy = $request->get('sortBy', 'id');
        $sortDirection = $request->get('sortDirection', 'desc');
        $allowedSorts = [
            'id', 'first_name', 'last_name', 'email', 'phone', 'city', 'country', 'is_active', 'created_at',
        ];
        if (! in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'id';
        }
        $sortDirection = $sortDirection === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortDirection);

        // Pagination
        $perPage = (int) ($request->get('perPage', 10));
        if ($perPage === -1) {
            $customers = $query->get();
        } else {
            $customers = $query->paginate($perPage)->withQueryString();
        }

        // Shape data for table
        $transform = fn (Customer $c) => [
            'id' => $c->id,
            'name' => trim($c->first_name.' '.$c->last_name),
            'email' => $c->email,
            'phone' => $c->phone,
            'city' => $c->city,
            'country' => $c->country,
            'is_active' => $c->is_active,
            'created_at' => $c->created_at?->format('Y-m-d'),
        ];

        if ($customers instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            $customers->getCollection()->transform($transform);
        } else {
            $customers = [
                'data' => $query->get()->map($transform),
                'total' => $query->count(),
                'per_page' => -1,
                'current_page' => 1,
            ];
        }

        return Inertia::render('customers/index', [
            'customers' => $customers,
            'filters' => $request->only(['search', 'is_active', 'country', 'perPage', 'sortBy', 'sortDirection']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('customers/customer-form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $customer = Customer::create($request->all());
        if ($customer) {
            return redirect()->route('customers.index')->with('success', 'Customer created successfully!');
        }

        return back()->with('error', 'Failed to create customer.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer): Response
    {
        return Inertia::render('customers/customer-form', [
            'customer' => $customer,
            'isView' => true,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer): Response
    {
        return Inertia::render('customers/customer-form', [
            'customer' => $customer,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CustomerRequest $request, Customer $customer): \Illuminate\Http\RedirectResponse
    {
        $customer->update($request->validated());

        return redirect()->route('customers.index')->with('success', 'Customer updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer): \Illuminate\Http\RedirectResponse
    {
        $customer->delete();

        return redirect()->back()->with('success', 'Customer deleted successfully.');
    }

    public function json(Customer $customer): JsonResponse
    {
        return response()->json($customer);
    }
}
