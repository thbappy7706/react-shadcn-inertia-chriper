<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        return inertia('payments/index',[
            'payments' => Payment::all()

        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    public function show(string $id)
    {
        $payment = Payment::findOrFail($id);
        return Inertia::render('payments/Show', [
            'payment' => $payment,
        ]);
    }

    public function edit(string $id)
    {
        $payment = Payment::findOrFail($id);
        return Inertia::render('payments/Edit', [
            'payment' => $payment,
        ]);
    }

    public function destroy(string $id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return redirect()->route('payments.index')
            ->with('success', 'Payment deleted successfully.');
    }
}
