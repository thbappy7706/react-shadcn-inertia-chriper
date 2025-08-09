"use client";

import * as React from "react";
import { Head, router } from '@inertiajs/react';
import { route } from "ziggy-js";
import { columns, UserRow } from "./columns";
import DataTable from '@/components/ui/DataTable';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Posts', href: '/posts' }];


/**
 * Props for the Users index page.  The `users` prop is a paginated
 * collection returned from Laravel.  It contains the current page of
 * results as well as meta information like total count and per page
 * values.  The `filters` prop exposes the current filters used to
 * construct the query so that we can preserve them when making new
 * requests.
 */
interface UsersIndexProps {
    users: {
        data: UserRow[];
        current_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        sortBy?: string;
        sortDirection?: string;
        perPage?: number;
    };
}

export default function UsersIndex({ users, filters }: UsersIndexProps) {
    /**
     * Update the query string and request a new page when the user searches.
     * We always reset the page to 1 when a new search is performed.
     */
    const handleSearch = (value: string) => {
        router.get(
            route("users.index"),
            {
                ...filters,
                search: value,
                page: 1,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    /**
     * Called whenever the sort state changes.  We send the ID of the
     * column along with the direction (asc/desc).  If there is no
     * sorting information we clear sortBy and sortDirection.
     */
    const handleSort = (sorting: { id: string; desc: boolean }[]) => {
        const sort = sorting[0];
        router.get(
            route("users.index"),
            {
                ...filters,
                sortBy: sort ? sort.id : undefined,
                sortDirection: sort ? (sort.desc ? "desc" : "asc") : undefined,
                page: users.current_page,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    /**
     * Navigate to a specific page.  We preserve existing filters so that
     * pagination works in conjunction with search and sorting.
     */
    const handlePageChange = (page: number) => {
        router.get(
            route("users.index"),
            {
                ...filters,
                page,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    /**
     * Update the number of results per page.  When the page size
     * changes we reset the page back to 1 to avoid requesting an
     * out‑of‑range page.
     */
    const handlePageSizeChange = (size: number) => {
        router.get(
            route("users.index"),
            {
                ...filters,
                perPage: size,
                page: 1,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />

            <div className="container mx-auto py-8">
                <h1 className="text-2xl font-bold mb-4">Users</h1>
                <DataTable<UserRow>
                    columns={columns}
                    data={users.data}
                    page={users.current_page}
                    pageSize={users.per_page}
                    totalRecords={users.total}
                    onSearch={handleSearch}
                    onSort={handleSort}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    initialSort={
                        filters.sortBy
                            ? [
                                {
                                    id: filters.sortBy,
                                    desc: filters.sortDirection === "desc",
                                },
                            ]
                            : []
                    }
                    searchPlaceholder="Search users…"
                />
            </div>
        </AppLayout>


    );
}
