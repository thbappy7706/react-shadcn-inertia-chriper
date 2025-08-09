import { Head, Link, router, usePage } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { EllipsisVertical, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Products', href: '/products' }];

interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    featured_image: string;
    created_at: string;
}

export default function Index({ ...props }: { products: Product[] }) {
    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8084/';

    const { products } = props;
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);


    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);


    const handleDeleteConfirm = () => {
        if (deleteId !== null) {
            router.delete(route('products.destroy', deleteId), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setDeleteId(null);
                    router.reload({ only: ['flash'] });
                },
                onError: () => {
                    toast.error('Failed to delete category.');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Products" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                        <p className="mt-1 text-muted-foreground">Manage Your Products</p>
                    </div>

                    <Button variant="outline" className="bg-primary text-white shadow-lg hover:bg-primary/90 hover:text-gray-100 dark:text-black">
                        <Plus className="h-4 w-4" />
                        <Link href={route('products.create')}>Add New Products</Link>
                    </Button>
                </div>

                <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="font h-12 px-4 text-left align-middle font-medium text-muted-foreground">#</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Featured Image</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created Date</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {products.map((row, index) => (
                                    <tr key={index} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium">{index + 1}</td>
                                        <td className="p-4 align-middle font-medium">{row.name}</td>
                                        <td className="p-4 align-middle font-medium">{row.description}</td>
                                        <td className="p-4 align-middle font-medium">{row.price}</td>
                                        <td className="p-4 align-middle font-medium">
                                            <img className="h-16 w-16 object-cover" src={`${baseUrl}${row.featured_image}`} alt="Featured" />
                                        </td>
                                        <td className="p-4 align-middle font-medium">{row.created_at}</td>

                                        <td className="p-4 text-right align-middle font-medium">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <EllipsisVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Link href={route('products.show', row.id)}>View</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Link href={route('products.edit', row.id)}>Edit</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem  onClick={() => {
                                                        setDeleteId(row.id);
                                                        setIsDeleteDialogOpen(true);
                                                    }}>
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this Product? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteConfirm}>
                                Delete
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </AppLayout>
    );
}
