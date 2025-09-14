import { Head, router, useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import React, { useEffect, useMemo, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CreateEditModal, { Customer } from './CreateEditModal';
import ViewDrawer from "./ViewDrawer";
import { Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import type { RequestPayload } from "@inertiajs/core";

const breadcrumbs: BreadcrumbItem[] = [{ title: "Customers", href: "/customers" }];

interface CustomerRow {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    city?: string | null;
    country?: string | null;
    is_active: boolean;
    created_at?: string;
}

interface IndexProps {
    customers: {
        data: CustomerRow[];
        current_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        is_active?: string | boolean;
        perPage?: string | number;
        sortBy?: string;
        sortDirection?: "asc" | "desc";
    };
}

export default function Index({ customers, filters }: IndexProps) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState<CustomerRow | null>(null);

    const mapCustomerRowToCustomer = (customerRow: CustomerRow | null): Customer | null => {
        if (!customerRow) return null;
        const nameParts = customerRow.name?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        return {
            id: customerRow.id,
            first_name: firstName,
            last_name: lastName,
            email: customerRow.email,
            phone: customerRow.phone ?? undefined, // Convert null to undefined
            city: customerRow.city ?? undefined,
            country: customerRow.country ?? undefined,
            is_active: customerRow.is_active,

        };
    };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const { data, setData } = useForm<{
        search: string;
        perPage: string;
        sortBy: string;
        sortDirection: "asc" | "desc";
        is_active: "" | boolean;
    }>({
        search: String(filters.search || ""),
        perPage: String(filters.perPage || "10"),
        sortBy: String(filters.sortBy || "id"),
        sortDirection: (filters.sortDirection as "asc" | "desc") || "desc",
        is_active: (typeof filters.is_active === "boolean" ? filters.is_active : "") as "" | boolean,
    });

    const columns = useMemo(
        () => [
            { key: "id", header: "ID", sortable: true },
            { key: "name", header: "Name", sortable: true },
            { key: "email", header: "Email", sortable: true },
            { key: "phone", header: "Phone", sortable: true },
            { key: "city", header: "City", sortable: true },
            { key: "country", header: "Country", sortable: true },
            {
                key: "is_active",
                header: "Active",
                sortable: true,
                render: (r: CustomerRow) => (r.is_active ? "Yes" : "No"),
            },
            { key: "created_at", header: "Created", sortable: true },
        ],
        []
    );

    const applyQuery = (extra: RequestPayload = {}) => {
        const params: RequestPayload = {
            ...(data.search ? { search: data.search } : {}),
            ...(data.perPage ? { perPage: data.perPage } : {}),
            ...(data.sortBy ? { sortBy: data.sortBy } : {}),
            ...(data.sortDirection ? { sortDirection: data.sortDirection } : {}),
            ...(data.is_active !== "" ? { is_active: data.is_active } : {}),
            ...extra,
        };

        router.get(route("customers.index"), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const onSort = (key: string) => {
        const nextDirection = data.sortBy === key && data.sortDirection === "asc" ? "desc" : "asc";
        setData("sortBy", key);
        setData("sortDirection", nextDirection);
        applyQuery({ sortBy: key, sortDirection: nextDirection });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData("search", value);
        applyQuery({ search: value });
    };

    const handleReset = () => {
        setData("search", "");
        setData("perPage", "10");
        setData("sortBy", "id");
        setData("sortDirection", "desc");
        setData("is_active", "");
        router.get(route("customers.index"), {}, { preserveState: true, preserveScroll: true });
    };

    const handleDeleteConfirm = () => {
        if (deleteId !== null) {
            router.delete(route("customers.destroy", deleteId), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setDeleteId(null);
                    router.reload({ only: ["flash"] });
                },
                onError: () => {
                    toast.error("Failed to delete customer.");
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Customers" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between w-full space-x-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Customers</h1>
                        <p className="mt-1 text-muted-foreground">Manage your customers</p>
                    </div>

                    <div className="flex items-center space-x-2 w-full max-w-3xl">
                        <input
                            type="text"
                            value={data.search}
                            onChange={handleChange}
                            className="flex-1 p-1.5 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200"
                            placeholder="Search Customers..."
                            name="search"
                        />
                        <select
                            className="h-8 px-2 text-sm border border-gray-300 rounded dark:bg-slate-900 dark:border-slate-700 dark:text-[#abc2d3]"
                            value={String(data.is_active)}
                            onChange={(e) => {
                                const newVal: "" | boolean = e.target.value === "" ? "" : e.target.value === "true";
                                setData("is_active", newVal);
                                applyQuery({ is_active: newVal });
                            }}
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                        <Button
                            onClick={handleReset}
                            className="h-8 p-1.5 bg-teal-600 hover:bg-gray-950 text-white rounded-lg flex-shrink-0"
                        >
                            <X size={16} />
                        </Button>
                        <Button
                            onClick={() => {
                                setCurrentCustomer(null);
                                setIsFormOpen(true);
                            }}
                            className="h-8 p-1.5"
                        >
                            <Plus size={16} />
                            Add Customer
                        </Button>
                    </div>
                </div>

                <DataTable
                    columns={columns as never}
                    rows={customers.data}
                    meta={{
                        current_page: customers.current_page,
                        per_page: customers.per_page,
                        total: customers.total,
                        links: customers.links,
                    }}
                    onSort={onSort}
                    sortBy={data.sortBy}
                    sortDirection={data.sortDirection}
                    onEdit={async (row: CustomerRow) => {
                        try {
                            setIsFormOpen(true);
                            const res = await fetch(route("customers.json", row.id));
                            if (!res.ok) throw new Error("Failed to fetch customer data");
                            const json = (await res.json()) as CustomerRow;
                            setCurrentCustomer(json);
                        } catch {
                            toast.error("Failed to load customer data");
                            setIsFormOpen(false);
                        }
                    }}
                    onView={async (row: CustomerRow) => {
                        try {
                            setIsViewOpen(true);
                            const res = await fetch(route("customers.json", row.id));
                            if (!res.ok) throw new Error("Failed to fetch customer data");
                            const json = (await res.json()) as CustomerRow;
                            setCurrentCustomer(json);
                        } catch {
                            toast.error("Failed to load customer data");
                            setIsViewOpen(false);
                        }
                    }}
                    onDelete={(row: CustomerRow) => {
                        setDeleteId(row.id);
                        setIsDeleteDialogOpen(true);
                    }}
                    onPageLinkClick={(url) => router.get(url, {}, { preserveState: true, preserveScroll: true })}
                    perPage={data.perPage}
                    onPerPageChange={(value) => {
                        setData("perPage", value);
                        applyQuery({ perPage: value });
                    }}
                />

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Customer</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this customer? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteConfirm}>
                                Delete
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>


                <CreateEditModal
                    open={isFormOpen}
                    onOpenChange={setIsFormOpen}
                    initial={mapCustomerRowToCustomer(currentCustomer)}
                />
                <ViewDrawer open={isViewOpen} onOpenChange={setIsViewOpen} customer={currentCustomer} />
            </div>
        </AppLayout>
    );
}
