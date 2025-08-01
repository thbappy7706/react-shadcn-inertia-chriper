import { columns, Payment } from '@/components/payments/ columns';
import { DataTable } from '@/components/payments/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payment',
        href: '/payments',
    },
];

interface PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

export default function Hello({ payments }: { payments: Payment[] }) {
    const page = usePage<PageProps>();
    const { flash } = page.props;

    const [data, setData] = useState<Payment[]>(payments);

    useEffect(() => {
        setData(payments);
    }, [payments]);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments" />
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} />
            </div>
        </AppLayout>
    );
}
