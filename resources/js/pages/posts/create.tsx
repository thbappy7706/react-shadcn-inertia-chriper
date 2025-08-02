import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Posts Create', href: route('posts.create') },
];

export default function createPosts() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Posts" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">

            </div>
        </AppLayout>
    );
}

