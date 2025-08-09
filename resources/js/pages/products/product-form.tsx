import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomTextarea } from '@/components/ui/custom-textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Products', href: route('products.create') }];

export default function ProductForm({ ...props }) {
    const { product,isView,isEdit } = props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        featured_image: null as File | null,
        _method: isEdit ? 'PUT' : 'POST',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isEdit) {
            post(route('products.update', product.id), {
                forceFormData: true,
                onSuccess: () => reset(),
            });
        } else {
            post(route('products.store'), {
                onSuccess: () => reset(),
            });
        }

    };
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setData('featured_image', e.target.files[0]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Products" />

            <div className={'mt-2 mr-2 ml-auto'}>
                <Button variant="outline" className="bg-primary text-white shadow-lg hover:bg-primary/90 hover:text-gray-100 dark:text-black">
                  <ArrowLeft className="h-4 w-4"/>
                    <Link href={route('products.index')}>Back to List</Link>
                </Button>
            </div>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{isView ? 'View': isEdit ? 'Edit' : 'Create' } Product</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4" autoComplete="off">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder={'Product Name'}
                                        autoFocus
                                        tabIndex={1}
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Product Description</Label>
                                    <CustomTextarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        id="description"
                                        name="description"
                                        placeholder={'Product Description'}
                                        tabIndex={2}
                                        rows={4}
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">Product Price</Label>
                                    <Input
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        id="price"
                                        name="price"
                                        type="text"
                                        placeholder={'Product Price'}
                                        autoFocus
                                        tabIndex={3}
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.price} />
                                </div>


                                {(isView || isEdit) && product.featured_image && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="featured_image">Current Featured Image</Label>
                                        <img src={`/${product.featured_image}`} alt="Featured Image" className="h-40 w-50 rounded-lg border" />
                                    </div>
                                )}


                                {!isView && (
                                    <Button type="submit" className="mt-4 w-fit cursor-pointer" tabIndex={4}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        {processing ? (isEdit ? 'Updating... ' : 'Creating...') : isEdit ? 'Update' : 'Create'} Product
                                    </Button>
                                )}

                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
