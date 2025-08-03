import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React, { FormEventHandler, useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Posts Create', href: route('posts.create') }];

type CreateForm = {
    title: string;
    content: string;
    status: boolean;
    picture: File | string;
    category_id: string;
};

interface Category {
    id: number;
    title: string;
}

interface CreateProps {
    categories: Category[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function CreatePosts({ categories }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm<CreateForm>({
        title: '',
        content: '',
        status: false,
        picture: '',
        category_id: '',
    });

    const [preview, setPreview] = useState<string>('');

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('posts.store'));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('picture', file);
            setPreview(URL.createObjectURL(file));
        }
    };



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Posts" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex justify-end">Create New Post</div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-10 md:min-h-min dark:border-sidebar-border">
                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    autoFocus
                                    tabIndex={1}
                                    placeholder="Title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Content"
                                    tabIndex={2}
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                />
                                <InputError message={errors.content} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="picture">Picture</Label>
                                <Input
                                    id="picture"
                                    type="file"
                                    placeholder="Picture"
                                    onChange={handleFileChange}
                                />
                                {preview && (
                                    <div className="mb-3">
                                        <p className="text-sm mb-1">Image Preview:</p>
                                        <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded" />
                                    </div>
                                )}
                                <InputError message={errors.picture} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category_id">Category</Label>
                                <select
                                    id="category_id"
                                    className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((list) => (
                                        <option key={list.id} value={list.id.toString()}>{list.title}</option>
                                    ))}
                                </select>
                                <InputError message={errors.category_id} />
                            </div>

                            <div className="flex items-center gap-2 p-2">
                                <input
                                    type="checkbox"
                                    id="poststatus"
                                    checked={data.status}
                                    onChange={e => setData('status', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-primary"
                                />
                                <Label htmlFor="poststatus">Published</Label>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-center">
                            <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
