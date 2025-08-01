import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

type Props = {
    stats: {
        users: number;
        payments: number;
    };
    chartData: {
        labels: string[];
        values: number[];
    };
};

export default function Dashboard({ stats, chartData }: Props) {
    const chartFormatted = chartData.labels.map((label, i) => ({
        name: label,
        value: chartData.values[i],
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold">Users</h2>
                            <p className="text-3xl mt-2">{stats.users}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold">Payments</h2>
                            <p className="text-3xl mt-2">{stats.payments}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold">Active Subscriptions</h2>
                            <p className="text-3xl mt-2">Coming Soon</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="min-h-[300px]">
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Monthly Overview</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartFormatted}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#4f46e5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
