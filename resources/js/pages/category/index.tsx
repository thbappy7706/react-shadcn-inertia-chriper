import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm,router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import React, { useState,useEffect } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


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

export default function Category({categories,flash} :Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            setShowToast(true);
        } else if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
        }
    }, [flash]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const { data, setData, post,put,processing, reset } = useForm({
        title: '',
    });


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingCategory) {
            console.log("updated");
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
                    setIsOpen(false)
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

    const handleDelete = (id: number) => {
        router.delete(`/categories/${id}`, {
            onSuccess: () => {
                router.reload();
                console.log("success");
            },
            onError: () => {
                console.error("Failed to delete post.");
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Category" />

            {showToast && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
                } text-white animate-in fade-in slide-in-from-top-5`}>
                    {toastType === 'success' ? (
                        <CheckCircle2 className="h-5 w-5" />
                    ) : (
                        <XCircle className="h-5 w-5" />
                    )}
                    <span>{toastMessage}</span>
                </div>)}

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Category</h1>

                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <form>
                            <DialogTrigger asChild>
                                <Button variant="outline">
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


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <Card key={category.id} className="hover:bg-accent/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-medium">{category.title}</CardTitle>

                                <div className="flex gap-2">
                                    <Button variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(category)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(category.id)}
                                        className="text-destructive hover:text-destructive/90"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                            </CardHeader>
                            <CardContent>
                                {category.posts_count !== undefined && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {category.posts_count} Category
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                    ) )}

                </div>



            </div>
        </AppLayout>
    );
}
