import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input as TextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import React, { useEffect } from "react";
import { router, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

type FormFields = Omit<Customer, "extra_info"> & {
    extra_info: string;
};

export default function CreateEditModal({
                                            open,
                                            onOpenChange,
                                            initial,
                                        }: CreateEditModalProps) {
    const isEdit = Boolean(initial?.id);

    const { data, setData, processing, errors, reset } = useForm<FormFields>({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        phone: "",
        street_address: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        date_of_birth: "",
        gender: "other",
        profile_photo: "",
        company_name: "",
        vat_number: "",
        currency: "USD",
        account_balance: "",
        is_active: true,
        preferred_language: "en",
        last_ip: "",
        extra_info: "",
    });

    useEffect(() => {
        if (initial) {
            setData({
                first_name: initial.first_name ?? "",
                last_name: initial.last_name ?? "",
                username: initial.username ?? "",
                email: initial.email ?? "",
                phone: initial.phone ?? "",
                street_address: initial.street_address ?? "",
                city: initial.city ?? "",
                state: initial.state ?? "",
                postal_code: initial.postal_code ?? "",
                country: initial.country ?? "",
                date_of_birth: initial.date_of_birth ?? "",
                gender: initial.gender ?? "other",
                profile_photo: initial.profile_photo ?? "",
                company_name: initial.company_name ?? "",
                vat_number: initial.vat_number ?? "",
                currency: initial.currency ?? "USD",
                account_balance: initial.account_balance ?? "",
                is_active: initial.is_active ?? true,
                preferred_language: initial.preferred_language ?? "en",
                last_ip: initial.last_ip ?? "",
                extra_info: initial.extra_info ? JSON.stringify(initial.extra_info) : "",
            });
        }
    }, [initial, setData]);

    useEffect(() => {
        if (!open) reset();
    }, [open, reset]);

    const appendFormData = (fd: FormData, key: string, value: unknown) => {
        if (value === undefined || value === null) return;
        if (value instanceof File) return fd.append(key, value);
        if (Array.isArray(value))
            return value.forEach((v, i) => appendFormData(fd, `${key}[${i}]`, v));
        if (typeof value === "object")
            return Object.entries(value as Record<string, unknown>).forEach(([k, v]) =>
                appendFormData(fd, `${key}[${k}]`, v)
            );
        if (typeof value === "boolean") return fd.append(key, value ? "1" : "0");
        fd.append(key, String(value));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();

        Object.entries(data).forEach(([key, rawValue]) => {
            if (rawValue == null) return;

            if (key === "extra_info") {
                if (typeof rawValue === "string" && rawValue.trim() !== "") {
                    try {
                        const parsed = JSON.parse(rawValue);
                        appendFormData(formData, "extra_info", parsed);
                    } catch {
                        formData.append("extra_info", rawValue);
                    }
                }
                return;
            }

            appendFormData(formData, key, rawValue as unknown);
        });

        const url =
            isEdit && initial?.id
                ? route("customers.update", initial.id)
                : route("customers.store");

        if (isEdit) {
            formData.append("_method", "PUT");
        }

        router.post(url, formData, {
            forceFormData: true,
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    };

    const stringFields: Array<
        [keyof Omit<FormFields, "is_active" | "extra_info" | "gender" | "currency" | "account_balance">, string, string?]
    > = [
        ["first_name", "First name"],
        ["last_name", "Last name"],
        ["username", "Username"],
        ["email", "Email", "email"],
        ["phone", "Phone"],
        ["street_address", "Street address"],
        ["city", "City"],
        ["state", "State"],
        ["postal_code", "Postal code"],
        ["country", "Country"],
        ["date_of_birth", "Date of birth", "date"],
        ["profile_photo", "Profile photo"],
        ["company_name", "Company name"],
        ["vat_number", "VAT number"],
        ["preferred_language", "Preferred language"],
        ["last_ip", "Last IP"],
    ];


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1400px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Customer" : "Add Customer"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2 md:grid-cols-3">
                        {stringFields.map(([field, label, type = "text"]) => (
                            <div key={field}>
                                <Label htmlFor={field}>{label}</Label>
                                <TextInput
                                    id={field}
                                    type={type}
                                    value={data[field] ?? ""}
                                    onChange={(e) => setData(field, e.target.value)}
                                />
                                {errors[field] && <div className="mt-1 text-xs text-red-600">{errors[field]}</div>}
                            </div>
                        ))}

                        {/* Gender */}
                        <div>
                            <Label htmlFor="gender">Gender</Label>
                            <Select value={data.gender} onValueChange={(value) => setData("gender", value  )}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.gender && <div className="mt-1 text-xs text-red-600">{errors.gender}</div>}
                        </div>

                        {/* Currency */}
                        <div>
                            <Label htmlFor="currency">Currency</Label>
                            <Select value={data.currency} onValueChange={(val) => setData("currency", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                    <SelectItem value="GBP">GBP</SelectItem>
                                    <SelectItem value="JPY">JPY</SelectItem>
                                    <SelectItem value="AUD">AUD</SelectItem>
                                    <SelectItem value="CAD">CAD</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.currency && <div className="mt-1 text-xs text-red-600">{errors.currency}</div>}
                        </div>

                        {/* Account Balance */}
                        <div>
                            <Label htmlFor="account_balance">Account Balance</Label>
                            <TextInput
                                id="account_balance"
                                type="number"
                                step="0.01"
                                value={data.account_balance}
                                onChange={(e) => setData("account_balance", e.target.value)}
                            />
                            {errors.account_balance && (
                                <div className="mt-1 text-xs text-red-600">{errors.account_balance}</div>
                            )}
                        </div>

                        {/* is_active */}
                        <div>
                            <Label htmlFor="is_active">Active</Label>
                            <div className="mt-2 flex items-center gap-2">
                                <Toggle
                                    id="is_active"
                                    pressed={data.is_active}
                                    onPressedChange={(pressed) => setData("is_active", pressed)}
                                    variant="outline"
                                    size="default"
                                >
                                    {data.is_active ? "Enabled" : "Disabled"}
                                </Toggle>
                            </div>
                        </div>

                        {/* Extra info */}
                        <div className="md:col-span-2">
                            <Label htmlFor="extra_info">Extra info (JSON)</Label>
                            <TextInput
                                id="extra_info"
                                value={data.extra_info}
                                onChange={(e) => setData("extra_info", e.target.value)}
                            />
                            {errors.extra_info && (
                                <div className="mt-1 text-xs text-red-600">{errors.extra_info}</div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
