import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { EllipsisVertical, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Posts', href: '/posts' }];

interface Post {
    id: number;
    title: string;
    content: string | null;
    status: boolean;
    slug: string;
    picture: string;
    posts_count?: number;
    category_id: number;
    category: {
        id: number;
        title: string;
    };
}

interface Category {
    id: number;
    title: string;
}

interface Props {
    posts: {
        data: Post[];
    };
    categories: Category[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function PostIndex({ posts, flash }: Props) {

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
                        <p className="mt-1 text-muted-foreground">Manage Your Post</p>
                    </div>

                    <Button variant="outline" className="bg-primary text-white shadow-lg hover:bg-primary/90 hover:text-gray-100 dark:text-black">
                        <Plus className="h-4 w-4" />
                        <Link href={route('posts.create')}>Add New Posts</Link>

                    </Button>
                </div>

                <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="font h-12 px-4 text-left align-middle font-medium text-muted-foreground">Photo</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Content</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">11</td>
                                    <td className="p-4 align-middle font-medium">11</td>
                                    <td className="p-4 align-middle font-medium">11</td>
                                    <td className="p-4 align-middle font-medium">11</td>
                                    <td className="p-4 align-middle font-medium">11</td>
                                    <td className="p-4 text-right align-middle font-medium">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <EllipsisVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>View</DropdownMenuItem>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
