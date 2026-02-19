import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    MessageSquare,
    Heart,
    Share2,
    Bookmark,
    Clock,
    ArrowLeft,
    User,
    MoreHorizontal,
    Send,
    ThumbsUp,
    Trash2,
    Flag,
    AlertTriangle,
    Zap,
    BookOpen,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';
import { cn } from '@/lib/utils';

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [commentText, setCommentText] = useState('');
    const [isSharing, setIsSharing] = useState(false);

    // Queries
    const { data: blog, isLoading: blogLoading, isError } = useQuery({
        queryKey: ['blog', id],
        queryFn: async () => {
            const res = await fetch(`/api/blogs/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            if (!res.ok) throw new Error('Blog not found.');
            return res.json();
        }
    });

    const { data: comments, isLoading: commentsLoading } = useQuery({
        queryKey: ['blog-comments', id],
        queryFn: async () => {
            const res = await fetch(`/api/blogs/${id}/comments`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        },
        enabled: !!id
    });

    const { data: aiSummary, isLoading: summaryLoading } = useQuery({
        queryKey: ['blog-summary', id],
        queryFn: async () => {
            const res = await fetch(`/api/blogs/${id}/summary`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        },
        enabled: !!id && !!blog?.data // Only if blog exists
    });

    // Mutations
    const likeMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/blogs/${id}/like`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['blog', id]);
            toast.success('Favorite updated!');
        }
    });

    const commentMutation = useMutation({
        mutationFn: async (content) => {
            const res = await fetch(`/api/blogs/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ content })
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['blog-comments', id]);
            setCommentText('');
            toast.success('Comment posted!');
        }
    });

    const deleteCommentMutation = useMutation({
        mutationFn: async (commentId) => {
            const res = await fetch(`/api/blogs/${id}/comments/${commentId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['blog-comments', id]);
            toast.success('Comment removed.');
        }
    });

    if (blogLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-950">
                <Loader2 className="h-10 w-10 animate-spin text-rose-500" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-gray-950 text-white p-10">
                <AlertTriangle size={64} className="text-red-500 mb-6" />
                <h1 className="text-3xl font-black uppercase tracking-tighter">Broken Link</h1>
                <p className="mt-2 text-gray-500 font-bold">The article you're seeking has vanished or was never here.</p>
                <button
                    onClick={() => navigate('/blogs')}
                    className="mt-8 rounded-2xl bg-white px-8 py-3 font-black text-black hover:bg-gray-200 transition"
                >
                    Back to Feed
                </button>
            </div>
        );
    }

    const { data: blogData } = blog;

    return (
        <div className="min-h-screen bg-gray-950 text-white pb-20">
            {/* Header / Nav */}
            <div className="sticky top-0 z-50 border-b border-gray-900 bg-gray-950/80 p-4 backdrop-blur-xl transition hover:bg-gray-950 shadow-2xl">
                <div className="mx-auto flex max-w-4xl items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-white transition"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 px-2 py-1 rounded-md">Article Feed</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-white transition"><Bookmark size={20} /></button>
                        <button className="text-gray-400 hover:text-white transition"><Share2 size={20} /></button>
                        <button className="text-gray-400 hover:text-white transition"><MoreHorizontal size={20} /></button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="mx-auto mt-12 max-w-4xl px-4 md:px-0">
                {/* Meta data */}
                <div className="mb-10 text-center">
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <span className="rounded-full bg-rose-600/10 px-3 py-1 text-xs font-black text-rose-400 uppercase tracking-widest border border-rose-500/20">
                            {blogData.category}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-gray-700"></div>
                        <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                            <Clock size={12} />
                            {moment(blogData.createdAt).fromNow()}
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl text-white uppercase italic leading-none mb-6">
                        {blogData.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-rose-500/20 bg-gray-900">
                            <img src={blogData.author.avatar || "/default-avatar.png"} alt={blogData.author.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-black text-white hover:underline cursor-pointer">{blogData.author.name}</p>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Verified Contributor</p>
                        </div>
                    </div>
                </div>

                {/* Cover Image */}
                {blogData.image && (
                    <div className="mb-12 aspect-video overflow-hidden rounded-[2.5rem] border border-gray-900 shadow-2xl relative group">
                        <img src={blogData.image} alt="Cover" className="h-full w-full object-cover transition duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60"></div>
                    </div>
                )}

                {/* Article Grid */}
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
                    {/* Left Sidebar: Socials and Meta */}
                    <div className="lg:col-span-1 hidden lg:block sticky top-32 h-fit">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-600">Interaction</h4>
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={() => likeMutation.mutate()}
                                        className={cn(
                                            "flex items-center gap-3 text-sm font-bold transition-all p-2 rounded-xl border border-gray-900",
                                            blogData.likes.includes(localStorage.getItem('userId')) ? "text-rose-500 bg-rose-500/5 border-rose-500/20" : "text-gray-500 hover:text-white"
                                        )}
                                    >
                                        <Heart size={20} fill={blogData.likes.includes(localStorage.getItem('userId')) ? 'currentColor' : 'none'} />
                                        {blogData.likes.length} Likes
                                    </button>
                                    <button className="flex items-center gap-3 text-sm font-bold text-gray-500 hover:text-cyan-400 transition-all p-2 rounded-xl border border-gray-900 hover:bg-cyan-400/5 hover:border-cyan-400/20">
                                        <MessageSquare size={20} />
                                        {comments?.data?.length || 0} Discussions
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-600">Article Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {blogData.tags.map(tag => (
                                        <span key={tag} className="text-[10px] font-bold text-gray-400 bg-gray-900 border border-gray-800 px-2 py-1 rounded hover:text-white cursor-pointer transition">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Blog Content */}
                    <div className="lg:col-span-3">
                        {/* AI Summary Banner */}
                        {aiSummary?.data && (
                            <div className="mb-12 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-transparent p-6 border border-indigo-500/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 animate-pulse opacity-20">
                                    <Zap size={64} className="text-yellow-400" />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-2">
                                        <Zap size={14} /> Smart Summary (AI)
                                    </h3>
                                    <p className="text-gray-300 font-medium leading-relaxed italic border-l-2 border-indigo-500/40 pl-4">
                                        {aiSummary.data}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-loose selection:bg-rose-500/30">
                            {/* Content would be rendered from structured HTML or Markdown in a real app */}
                            <p className="first-letter:text-7xl first-letter:font-black first-letter:text-rose-500 first-letter:float-left first-letter:mr-4 first-letter:leading-[0.8]">
                                {blogData.content}
                            </p>
                        </div>

                        {/* Discussion Section */}
                        <div className="mt-20 border-t border-gray-900 pt-16">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4">
                                    Discussions
                                    <span className="text-sm font-bold bg-gray-900 text-gray-500 px-3 py-1 rounded-full">{comments?.data?.length || 0}</span>
                                </h2>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold text-gray-600">Sort by: Newest First</span>
                                </div>
                            </div>

                            {/* Comment Input */}
                            <div className="mb-12 rounded-[2rem] bg-gray-900/40 p-1 border border-gray-800 focus-within:border-rose-500/40 focus-within:bg-gray-900/60 transition shadow-2xl">
                                <div className="flex items-center gap-2">
                                    <div className="ml-4 h-8 w-8 rounded-full bg-rose-500 flex items-center justify-center shrink-0 shadow-lg shadow-rose-900/30">
                                        <User size={16} className="text-white" />
                                    </div>
                                    <input
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Add your thoughts to this discussion..."
                                        className="w-full bg-transparent p-5 text-sm font-bold text-white placeholder-gray-500 focus:outline-none"
                                        onKeyDown={(e) => e.key === 'Enter' && commentText.trim() && commentMutation.mutate(commentText)}
                                    />
                                    <button
                                        onClick={() => commentText.trim() && commentMutation.mutate(commentText)}
                                        disabled={commentMutation.isPending || !commentText.trim()}
                                        className="mr-2 rounded-2xl bg-white p-4 text-black hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50 active:scale-95"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Comments List */}
                            <div className="space-y-6">
                                {comments?.data?.map(comment => (
                                    <div key={comment._id} className="group relative flex gap-4 rounded-3xl p-6 transition hover:bg-gray-900/30 border border-transparent hover:border-gray-900">
                                        <div className="h-10 w-10 shrink-0 rounded-full border border-gray-800 bg-gray-900">
                                            <img src={comment.author.avatar || "/default-avatar.png"} alt={comment.author.name} className="h-full w-full rounded-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-black text-rose-500">{comment.author.name}</p>
                                                    <div className="h-1 w-1 rounded-full bg-gray-800"></div>
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{moment(comment.createdAt).fromNow()}</p>
                                                </div>
                                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition">
                                                    <button className="text-gray-600 hover:text-white"><Flag size={14} /></button>
                                                    {(comment.author._id === localStorage.getItem('userId')) && (
                                                        <button
                                                            onClick={() => deleteCommentMutation.mutate(comment._id)}
                                                            className="text-gray-600 hover:text-red-500"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium leading-relaxed text-gray-400">
                                                {comment.content}
                                            </p>
                                            <div className="mt-4 flex items-center gap-6">
                                                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-rose-500 transition">
                                                    <ThumbsUp size={12} />
                                                    Reply
                                                </button>
                                                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-rose-500 transition">
                                                    Like
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {comments?.data?.length === 0 && (
                                    <div className="flex flex-col items-center py-20 text-center rounded-3xl border border-dashed border-gray-900 bg-gray-950/20">
                                        <BookOpen size={48} className="text-gray-800 mb-4" />
                                        <h4 className="text-xl font-black uppercase text-gray-700">No voices yet</h4>
                                        <p className="text-gray-500 font-bold mt-2">Become the first to start the conversation.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Read more section */}
            <div className="mx-auto mt-32 max-w-6xl px-4 border-t border-gray-900 pt-20">
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-10 text-center">Beyond this horizon</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="group cursor-pointer">
                            <div className="aspect-video rounded-3xl bg-gray-900 mb-6 overflow-hidden border border-gray-800 shadow-xl">
                                <div className="h-full w-full bg-gradient-to-br from-rose-950/20 to-transparent group-hover:scale-110 transition duration-700"></div>
                            </div>
                            <h4 className="text-xl font-bold text-white group-hover:text-rose-500 transition line-clamp-2 uppercase italic mb-2 tracking-tighter">Theoretical insights into student productivity in Summer 2026</h4>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">3 days ago • 5 min read</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
