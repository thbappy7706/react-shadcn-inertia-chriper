import { columns, Payment } from'@/components/payments/ columns'
import { DataTable } from '@/components/payments/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payment',
        href: '/payments',
    },
];

export default function Payments({ payments }: { payments: Payment[] }) {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const [data, setData] = useState<Payment[]>([payments]);
    useEffect(() => {
        setData(payments);
    }, [payments]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={payments} />
            </div>
        </AppLayout>
    );
}
