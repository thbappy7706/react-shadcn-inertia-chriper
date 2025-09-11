import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Customers', href: route('customers.create') }];

export default function CustomerForm({ ...props }) {
    const { customer, isView, isEdit } = props as { customer?: any; isView?: boolean; isEdit?: boolean };
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: customer?.first_name || '',
        last_name: customer?.last_name || '',
        email: customer?.email || '',
        phone: customer?.phone || '',
        city: customer?.city || '',
        country: customer?.country || '',
        is_active: customer?.is_active ?? true,
        _method: isEdit ? 'PUT' as const : 'POST' as const,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isEdit && customer) {
            post(route('customers.update', customer.id), { onSuccess: () => reset() });
        } else {
            post(route('customers.store'), { onSuccess: () => reset() });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Customer' : isView ? 'View Customer' : 'Create Customer'} />
            <div className="max-w-3xl mx-auto p-4">
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>{isEdit ? 'Edit' : isView ? 'View' : 'Create'} Customer</CardTitle>
                        <Link href={route('customers.index')} className="text-sm inline-flex items-center gap-2">
                            <ArrowLeft size={16} /> Back to list
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="first_name">First name</Label>
                                    <Input id="first_name" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} disabled={isView} />
                                    {errors.first_name && <InputError message={errors.first_name} />}
                                </div>
                                <div>
                                    <Label htmlFor="last_name">Last name</Label>
                                    <Input id="last_name" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} disabled={isView} />
                                    {errors.last_name && <InputError message={errors.last_name} />}
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} disabled={isView} />
                                    {errors.email && <InputError message={errors.email} />}
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} disabled={isView} />
                                    {errors.phone && <InputError message={errors.phone} />}
                                </div>
                                <div>
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" value={data.city} onChange={(e) => setData('city', e.target.value)} disabled={isView} />
                                </div>
                                <div>
                                    <Label htmlFor="country">Country</Label>
                                    <Input id="country" value={data.country} onChange={(e) => setData('country', e.target.value)} disabled={isView} />
                                </div>
                            </div>

                            {!isView && (
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? <LoaderCircle className="animate-spin" /> : 'Save'}
                                    </Button>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}


