import React, { useState, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Upload, X, Image, Tag, Globe, Lock, Loader2, Save, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const blogSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters.').max(150),
    content: z.string().min(50, 'Content must be at least 50 characters.'),
    category: z.string().min(1, 'Please select a category.'),
    tags: z.string().optional(),
    isPublished: z.boolean().default(false),
});

const CATEGORIES = [
    'Technology', 'Science', 'Mathematics', 'Engineering',
    'Medical', 'Business', 'Arts', 'Social Science', 'Other',
];

const BlogEditor = ({ blog, onSuccess, onCancel }) => {
    const queryClient = useQueryClient();
    const [coverImage, setCoverImage] = useState(blog?.image ?? null);
    const [previewMode, setPreviewMode] = useState(false);
    const fileInputRef = useRef(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: blog?.title ?? '',
            content: blog?.content ?? '',
            category: blog?.category ?? '',
            tags: blog?.tags?.join(', ') ?? '',
            isPublished: blog?.isPublished ?? false,
        },
    });

    const { mutate: saveBlog, isPending } = useMutation({
        mutationFn: async (formData) => {
            const payload = {
                ...formData,
                tags: formData.tags
                    ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
                    : [],
                image: coverImage,
            };

            const url = blog?._id
                ? `/api/blogs/${blog._id}`
                : '/api/blogs';
            const method = blog?._id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message ?? 'Failed to save blog.');
            }

            return res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
            queryClient.invalidateQueries({ queryKey: ['my-blogs'] });
            toast.success(blog?._id ? 'Blog updated successfully!' : 'Blog published!');
            onSuccess?.(data);
        },
        onError: (err) => toast.error(err.message),
    });

    const handleImageUpload = useCallback(async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.error('Invalid image format. Use JPEG, PNG, or WebP.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be smaller than 5 MB.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch('/api/blogs/upload-image', {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setCoverImage(data.url);
            toast.success('Image uploaded!');
        } catch (err) {
            toast.error(err.message ?? 'Image upload failed.');
        }
    }, []);

    const contentValue = watch('content');
    const titleValue = watch('title');
    const wordCount = contentValue?.trim().split(/\s+/).filter(Boolean).length ?? 0;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const onSubmit = (formData) => saveBlog(formData);

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-semibold text-white">
                        {blog?._id ? 'Edit Blog' : 'Write Blog'}
                    </h1>
                    <span className="text-xs text-gray-400">
                        {wordCount} words • {readTime} min read
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setPreviewMode(!previewMode)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                        {previewMode ? <EyeOff size={16} /> : <Eye size={16} />}
                        {previewMode ? 'Edit' : 'Preview'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setValue('isPublished', false);
                            handleSubmit(onSubmit)();
                        }}
                        disabled={isPending || !isDirty}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-50 transition-colors"
                    >
                        <Save size={16} />
                        Save Draft
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setValue('isPublished', true);
                            handleSubmit(onSubmit)();
                        }}
                        disabled={isPending}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50 transition-colors"
                    >
                        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
                        Publish
                    </button>
                </div>
            </div>

            {previewMode ? (
                <div className="max-w-3xl mx-auto px-6 py-10">
                    {coverImage && (
                        <img
                            src={coverImage}
                            alt="Blog cover"
                            className="w-full h-64 object-cover rounded-2xl mb-8"
                        />
                    )}
                    <h1 className="text-4xl font-bold text-white mb-4">
                        {titleValue || 'Untitled Blog'}
                    </h1>
                    <div className="prose prose-invert max-w-none">
                        {contentValue?.split('\n').map((line, i) => (
                            <p key={i}>{line || <br />}</p>
                        ))}
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto px-6 py-8 space-y-6">
                    {/* Cover Image */}
                    <div
                        className={cn(
                            'relative w-full h-52 rounded-2xl border-2 border-dashed cursor-pointer',
                            'flex flex-col items-center justify-center gap-3',
                            'hover:border-violet-500 transition-colors',
                            coverImage ? 'border-transparent' : 'border-gray-700'
                        )}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {coverImage ? (
                            <>
                                <img
                                    src={coverImage}
                                    alt="Cover"
                                    className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCoverImage(null);
                                    }}
                                    className="absolute top-3 right-3 p-1.5 bg-gray-900/80 rounded-lg text-gray-300 hover:text-white"
                                >
                                    <X size={16} />
                                </button>
                            </>
                        ) : (
                            <>
                                <Image size={32} className="text-gray-600" />
                                <span className="text-sm text-gray-500">Click to add a cover image</span>
                            </>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleImageUpload}
                    />

                    {/* Title */}
                    <div>
                        <input
                            {...register('title')}
                            placeholder="Your blog title..."
                            className={cn(
                                'w-full bg-transparent text-3xl font-bold text-white placeholder-gray-600',
                                'border-none outline-none resize-none',
                                errors.title && 'text-red-400'
                            )}
                        />
                        {errors.title && (
                            <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Category + Tags */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <select
                                {...register('category')}
                                className={cn(
                                    'w-full px-4 py-2.5 rounded-xl bg-gray-900 border text-sm text-white',
                                    errors.category ? 'border-red-500' : 'border-gray-700'
                                )}
                            >
                                <option value="">Select a category</option>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="text-xs text-red-400 mt-1">{errors.category.message}</p>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700">
                                <Tag size={14} className="text-gray-500" />
                                <input
                                    {...register('tags')}
                                    placeholder="AI, React, Python (comma-separated)"
                                    className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <textarea
                            {...register('content')}
                            placeholder="Start writing your blog post..."
                            rows={24}
                            className={cn(
                                'w-full bg-transparent text-base text-gray-200 placeholder-gray-600',
                                'border-none outline-none resize-none leading-relaxed',
                                errors.content && 'text-red-400'
                            )}
                        />
                        {errors.content && (
                            <p className="text-xs text-red-400 mt-1">{errors.content.message}</p>
                        )}
                    </div>

                    {/* Visibility toggle */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                        <input type="checkbox" id="isPublished" {...register('isPublished')} className="hidden" />
                        <button
                            type="button"
                            onClick={() => setValue('isPublished', !watch('isPublished'))}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-colors',
                                watch('isPublished')
                                    ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                                    : 'bg-gray-900 border-gray-700 text-gray-400'
                            )}
                        >
                            {watch('isPublished') ? <Globe size={14} /> : <Lock size={14} />}
                            {watch('isPublished') ? 'Public' : 'Draft'}
                        </button>
                        <span className="text-xs text-gray-500">
                            {watch('isPublished')
                                ? 'This blog will be visible to everyone.'
                                : 'This blog is saved as a draft.'}
                        </span>
                    </div>
                </form>
            )}
        </div>
    );
};

export default BlogEditor;
