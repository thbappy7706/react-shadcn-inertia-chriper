<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // Extract filter & sorting parameters from the request
        $search         = $request->input('search');
        $sortBy         = $request->input('sortBy', 'id');
        $sortDirection  = $request->input('sortDirection', 'asc');
        $perPage        = max(1, (int) $request->input('perPage', 10));

        // Build the query.  We always start with a new instance so that
        // subsequent requests do not reuse stale constraints.
        $query = User::query();

        // Apply a simple search across name and email.  You can extend this
        // closure with additional columns depending on your use case.
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        // Whitelist columns that can be sorted to avoid injection.  Adjust
        // this array when adding new sortable columns to your table.
        $allowedSorts = ['id', 'name', 'email', 'created_at'];
        if (in_array($sortBy, $allowedSorts, true)) {
            $query->orderBy($sortBy, strtolower($sortDirection) === 'desc' ? 'desc' : 'asc');
        }

        // When dealing with very large datasets an offset based paginator
        // (paginate/simplePaginate) can become inefficient because it must
        // perform a count query and then skip rows using an OFFSET.  Laravel
        // offers cursor based pagination which uses a "where" clause to
        // efficiently walk through indexes without scanning previous pages.  The
        // official docs recommend it for large result sets【635900188828860†L456-L461】.  To
        // enable cursor pagination just pass useCursor=1 in the query string.
        $useCursor = $request->boolean('useCursor', false);
        if ($useCursor) {
            // cursorPaginate requires the query to be ordered by at least one
            // unique column.  We order by the chosen sort column and fall back
            // to the primary key when necessary to ensure deterministic order.
            if (!in_array($sortBy, $allowedSorts, true)) {
                $sortBy = 'id';
            }
            $users = $query->orderBy($sortBy, strtolower($sortDirection) === 'desc' ? 'desc' : 'asc')
                ->cursorPaginate($perPage)
                ->withQueryString();
        } else {
            // For moderate datasets we can use the default paginator.  If you
            // don't need to display the total number of pages you can use
            // simplePaginate() which issues a single query instead of two
            // (one for the data and one for the count)【635900188828860†L378-L386】.
            $users = $query->paginate($perPage)->appends($request->except('page'));
        }

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => [
                'search'        => $search,
                'sortBy'        => $sortBy,
                'sortDirection' => $sortDirection,
                'perPage'       => $perPage,
            ],
        ]);
    }

}
