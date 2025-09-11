import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input as TextInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';
import React, { useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

export interface Customer {
    id?: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
    phone?: string;
    street_address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    date_of_birth?: string;
    gender?: string;
    profile_photo?: string;
    company_name?: string;
    vat_number?: string;
    currency?: string;
    account_balance?: string;
    is_active?: boolean;
    preferred_language?: string;
    last_ip?: string;
    extra_info?: Record<string, unknown>;
}

interface CreateEditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initial: Customer | null;
}

type FormFields = Omit<Customer, 'extra_info'> & {
    extra_info: string;
    _method: 'POST' | 'PUT';
};

export default function CreateEditModal({ open, onOpenChange, initial }: CreateEditModalProps) {
    const isEdit = Boolean(initial?.id);

    const { data, setData, processing, errors, reset } = useForm<FormFields>({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        phone: '',
        street_address: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        date_of_birth: '',
        gender: '',
        profile_photo: '',
        company_name: '',
        vat_number: '',
        currency: 'USD',
        account_balance: '',
        is_active: true,
        preferred_language: 'en',
        last_ip: '',
        extra_info: '',
        _method: 'POST',
    });

    // Populate form on edit
    useEffect(() => {
        if (initial) {
            setData({
                first_name: initial.first_name ?? '',
                last_name: initial.last_name ?? '',
                username: initial.username ?? '',
                email: initial.email ?? '',
                phone: initial.phone ?? '',
                street_address: initial.street_address ?? '',
                city: initial.city ?? '',
                state: initial.state ?? '',
                postal_code: initial.postal_code ?? '',
                country: initial.country ?? '',
                date_of_birth: initial.date_of_birth ?? '',
                gender: initial.gender ?? '',
                profile_photo: initial.profile_photo ?? '',
                company_name: initial.company_name ?? '',
                vat_number: initial.vat_number ?? '',
                currency: initial.currency ?? 'USD',
                account_balance: initial.account_balance ?? '',
                is_active: initial.is_active ?? true,
                preferred_language: initial.preferred_language ?? 'en',
                last_ip: initial.last_ip ?? '',
                extra_info: initial.extra_info ? JSON.stringify(initial.extra_info) : '',
                _method: 'PUT',
            });
        }
    }, [initial, setData]);

    // Reset form on modal close
    useEffect(() => {
        if (!open) reset();
    }, [open, reset]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(data).forEach(([key, rawValue]) => {
            if (rawValue == null) return;

            if (key === 'extra_info' && typeof rawValue === 'string' && rawValue) {
                try {
                    formData.append(key, JSON.stringify(JSON.parse(rawValue)));
                } catch {
                    formData.append(key, rawValue);
                }
            } else if (typeof rawValue === 'boolean') {
                formData.append(key, rawValue ? '1' : '0');
            } else {
                formData.append(key, String(rawValue));
            }
        });

        const url = isEdit && initial?.id ? route('customers.update', initial.id) : route('customers.store');

        router.post(url, formData, {
            forceFormData: true,
            onSuccess: () => {
                setData((prev) => ({ ...prev, _method: 'POST' }));
                onOpenChange(false);
            },
        });
    };

    // Fields that are strings (excluding is_active, extra_info, _method)
    const stringFields: Array<[keyof Omit<FormFields, 'is_active' | 'extra_info' | '_method'>, string, string?]> = [
        ['first_name', 'First name'],
        ['last_name', 'Last name'],
        ['username', 'Username'],
        ['email', 'Email', 'email'],
        ['phone', 'Phone'],
        ['street_address', 'Street address'],
        ['city', 'City'],
        ['state', 'State'],
        ['postal_code', 'Postal code'],
        ['country', 'Country'],
        ['date_of_birth', 'Date of birth', 'date'],
        ['gender', 'Gender'],
        ['profile_photo', 'Profile photo'],
        ['company_name', 'Company name'],
        ['vat_number', 'VAT number'],
        ['currency', 'Currency'],
        ['account_balance', 'Account balance'],
        ['preferred_language', 'Preferred language'],
        ['last_ip', 'Last IP'],
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1400px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2 md:grid-cols-3">
                        {stringFields.map(([field, label, type = 'text']) => (
                            <div key={field}>
                                <Label htmlFor={field}>{label}</Label>
                                <TextInput id={field} type={type} value={data[field] ?? ''} onChange={(e) => setData(field, e.target.value)} />
                                {errors[field] && <div className="mt-1 text-xs text-red-600">{errors[field]}</div>}
                            </div>
                        ))}

                        {/* is_active as Switch */}
                        <div>
                            <Label htmlFor="is_active">Active</Label>
                            <div className="mt-2 flex items-center gap-2">
                                <Toggle
                                    id="is_active"
                                    pressed={data.is_active}
                                    onPressedChange={(pressed) => setData('is_active', pressed)}
                                    variant="outline"
                                    size="default"
                                >
                                    {data.is_active ? 'Enabled' : 'Disabled'}
                                </Toggle>
                            </div>
                        </div>

                        {/* Extra info field */}
                        <div className="md:col-span-2">
                            <Label htmlFor="extra_info">Extra info (JSON)</Label>
                            <TextInput id="extra_info" value={data.extra_info} onChange={(e) => setData('extra_info', e.target.value)} />
                            {errors.extra_info && <div className="mt-1 text-xs text-red-600">{errors.extra_info}</div>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
