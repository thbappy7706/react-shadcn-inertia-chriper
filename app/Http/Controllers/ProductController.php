<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::query()->latest()->get();
        return inertia('products/index', [
            'products' => $products
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('products/product-form');

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        try {
            if ($request->file('featured_image')) {
                $featuredImage = $request->file('featured_image');
                $featuredImageOriginalName = $featuredImage->getClientOriginalName();
                $featuredImage = $featuredImage->store('products', 'public');
            }

            $product = Product::create([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'featured_image' => $featuredImage ?? null,
                'featured_image_original_name' => $featuredImageOriginalName ?? null,
            ]);
            if ($product) {
                return redirect()->route('products.index')->with('success', 'Product created successfully!');

            } else {
                return redirect()->back()->with('error', 'Product is failed to create!');

            }

        } catch (Exception $exception) {
            Log::error('Product Creation Failure: ' . $exception->getMessage());
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return inertia('products/product-form', [
            'product' => $product,
            'isView' => true
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        return inertia('products/product-form', [
            'product' => $product,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        try {
            if ($product) {
                $product->name = $request->name;
                $product->description = $request->description;
                $product->price = $request->price;

                if ($request->file('featured_image')) {
                    $featuredImage = $request->file('featured_image');
                    $featuredImageOriginalName = $featuredImage->getClientOriginalName();
                    $featuredImage = $featuredImage->store('products', 'public');

                    $product->featured_image = $featuredImage;
                    $product->featured_image_original_name = $featuredImageOriginalName;
                }

                $product->save();

                return redirect()->route('products.index')->with('success', 'Product updated successfully.');
            }
            return redirect()->back()->with('error', 'Unable to update product. Please try again!');

        } catch (Exception $e) {
            Log::error('Product update failed: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        try {
            if ($product) {
                $product->delete();

                return redirect()->back()->with('success', 'Product deleted successfully.');
            }
            return redirect()->back()->with('error', 'Unable to delete product. Please try again!');

        } catch (Exception $e) {
            Log::error('Product deletion failed: ' . $e->getMessage());
        }

    }
}
