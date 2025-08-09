<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
//    public function index()
//    {
//        $products = Product::query()->latest()->paginate(5);
//        $products->getCollection()->transform(fn($product) => [
//            'id' => $product->id,
//            'name' => Str::title($product->name),
//            'description' => Str::limit($product->description, 50, '...'),
//            'price' => $product->price,
//            'featured_image' => $product->featured_image,
//            'featured_image_original_name' => $product->featured_image_original_name,
//            'created_at' => $product->created_at->format('d M Y'),
//        ]);
//
//        return inertia('products/index', [
//            'products' => $products
//        ]);
//    }

    public function index(Request $request)
    {
        // Initialize the query builder for products
        $productsQuery = Product::query();

        // Apply search filter if the 'search' request is filled
        if ($request->filled('search')) {
            $search = $request->search;
            $productsQuery->where(fn($query) =>
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")
                ->orWhere('price', 'like', "%{$search}%")
            );
        }

        // Get the total count of products before applying pagination
        $totalCount = $productsQuery->count();


        $perPage = (int) ($request->perPage ?? 5);

        // Check if 'perPage' is -1, meaning we want to fetch all products
        if ($perPage === -1) {
            $products = $productsQuery->latest()->get()->map(fn($product) => [
                'id'                           => $product->id,
                'name'                         => $product->name,
                'description'                  => $product->description,
                'price'                        => $product->price,
                'featured_image'               => $product->featured_image,
                'featured_image_original_name' => $product->featured_image_original_name,
                'created_at'                   => $product->created_at->format('d M Y'),
            ]);
            // Prepare the full response with all products
            return inertia('products/index', [
                'products'      => [
                    'data'     => $products,
                    'total'    => $totalCount,
                    'per_page' => $perPage,
                    'from'     => 1,
                    'to'       => $totalCount,
                    'links'    => [],
                ],
                'filters'       => $request->only(['search', 'perPage']),
                'totalCount'    => $totalCount,
                'filteredCount' => $totalCount,
            ]);
        }

        // Paginate the results if perPage is not -1
        $products = $productsQuery->latest()->paginate($perPage)->withQueryString();

        // Transform the paginated results
        $products->getCollection()->transform(fn($product) => [
            'id'                           => $product->id,
            'name'                         => $product->name,
            'description'                  => $product->description,
            'price'                        => $product->price,
            'featured_image'               => $product->featured_image,
            'featured_image_original_name' => $product->featured_image_original_name,
            'created_at'                   => $product->created_at->format('d M Y'),
        ]);

        // Get the filtered count after the search
        $filteredCount = $productsQuery->count();

        // Return the final response for paginated products
        return inertia('products/index', [
            'products'      => $products,
            'filters'       => $request->only(['search', 'perPage']),
            'totalCount'    => $totalCount,
            'filteredCount' => $filteredCount,
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
