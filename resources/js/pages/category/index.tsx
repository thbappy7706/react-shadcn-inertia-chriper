import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';

interface Category {
    id: number;
    title: string;
    posts_count?: number;
}

interface Props {
    categories: Category[];
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Category', href: '/categories' }];

export default function Category({ categories, flash }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);

    const { data, setData, post, put, processing, reset } = useForm({
        title: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingCategory) {
            console.log('updated');
            put(route('categories.update', editingCategory.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setEditingCategory(null);
                },
            });
        } else {
            post(route('categories.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (categories: Category) => {
        setEditingCategory(categories);
        setData({
            title: categories.title,
        });
        setIsOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (deleteCategoryId !== null) {
            router.delete(`/categories/${deleteCategoryId}`, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setDeleteCategoryId(null);
                    router.reload();
                    console.log('Deleted successfully');
                },
                onError: () => {
                    console.error('Failed to delete post.');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Category" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Category</h1>

                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <form>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="bg-primary text-white shadow-lg hover:bg-primary/90 hover:text-gray-100 dark:text-black"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add New Category
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Category</DialogTitle>
                                    <DialogDescription>Make changes to your category here. Click save when you&apos;re done.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name-1">Title</Label>
                                        <Input id="title" value={data.title} required onChange={(e) => setData('title', e.target.value)} />
                                    </div>

                                    <Button className="float-end" type="submit" disabled={processing}>
                                        Submit
                                    </Button>
                                </form>
                            </DialogContent>
                        </form>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <Card key={category.id} className="transition-colors hover:bg-accent/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-medium">{category.title}</CardTitle>

                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setDeleteCategoryId(category.id);
                                            setIsDeleteDialogOpen(true);
                                        }}
                                        className="text-destructive hover:text-destructive/90"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>

                                </div>
                            </CardHeader>
                            <CardContent>
                                {category.posts_count !== undefined && (
                                    <p className="mt-2 text-sm text-muted-foreground">{category.posts_count} Category</p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogDescription>Are you sure you want to delete this category? This action cannot be undone.</DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </AppLayout>
    );
}
