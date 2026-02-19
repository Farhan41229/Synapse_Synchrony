import React, { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    Loader2,
    Sparkles,
    Activity,
    Wind,
    Shield,
    Flame,
    Cpu,
    Target
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * @component BlogDetails
 * @description Advanced multi-dimensional article viewer for the Neural Nexus.
 * Features: AI-driven summaries, synaptic interaction nodes, and temporal metadata.
 */
const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [commentText, setCommentText] = useState('');

    // --- SYNAPTIC DATA FETCHING ---
    const { data: blog, isLoading: blogLoading, isError } = useQuery({
        queryKey: ['neural-blog-v5', id],
        queryFn: async () => {
            const res = await fetch(`/api/blogs/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            if (!res.ok) throw new Error('Neural Node Dissolved.');
            return res.json();
        }
    });

    const { data: comments, isLoading: commentsLoading } = useQuery({
        queryKey: ['blog-discussions-v5', id],
        queryFn: async () => {
            const res = await fetch(`/api/blogs/${id}/comments`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        },
        enabled: !!id
    });

    // --- INTERACTION MANIFESTO ---
    const likeMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/blogs/${id}/like`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['neural-blog-v5', id]);
            toast.success('Synaptic Resonance Logged');
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
            queryClient.invalidateQueries(['blog-discussions-v5', id]);
            setCommentText('');
            toast.success('Discussion Node Injected');
        }
    });

    if (blogLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-950">
                <div className="relative h-24 w-24">
                    <Activity className="h-full w-full text-rose-500 animate-[spin_4s_linear_infinite] opacity-10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-rose-400 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-gray-950 p-10 text-center">
                <div className="mb-10 p-10 bg-rose-500/10 rounded-[3rem] border border-rose-500/20 shadow-3xl">
                    <AlertTriangle size={80} className="text-rose-500 mx-auto" />
                </div>
                <h1 className="text-5xl font-black uppercase tracking-tighter italic text-white line-none mb-4">Neural Void</h1>
                <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">This data node has been dissolved or relocated.</p>
                <Button
                    onClick={() => navigate('/blogs')}
                    className="mt-12 rounded-2xl bg-white text-black px-12 py-8 text-xs font-black uppercase tracking-widest hover:bg-gray-200"
                >
                    Return to Feed
                </Button>
            </div>
        );
    }

    const blogData = blog.data;

    return (
        <div className="min-h-screen bg-gray-950 text-white selection:bg-rose-500/30 font-sans pb-40">
            {/* Guardian Header */}
            <div className="sticky top-0 z-50 border-b border-gray-900 bg-gray-950/80 p-6 backdrop-blur-2xl transition-all hover:bg-gray-950">
                <div className="mx-auto flex max-w-5xl items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-all"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Exit Node
                    </button>
                    <div className="flex items-center gap-6">
                        <div className="h-4 w-4 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_#f43f5e]"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-700">Manifold_Reader_v5.0</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Bookmark size={20} className="text-gray-700 hover:text-rose-500 transition-colors cursor-pointer" />
                        <Share2 size={20} className="text-gray-700 hover:text-rose-500 transition-colors cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Tactical Article Layout */}
            <article className="mx-auto mt-24 max-w-5xl px-8">
                {/* Meta Cluster */}
                <header className="mb-16 text-center space-y-10">
                    <div className="flex items-center justify-center gap-6 animate-in fade-in slide-in-from-top-10 duration-1000">
                        <span className="rounded-full bg-rose-600 px-6 py-2 text-[10px] font-black text-white uppercase tracking-[0.3em] shadow-xl">
                            {blogData.category}
                        </span>
                        <div className="flex items-center gap-3 text-xs font-black text-gray-700 uppercase tracking-widest">
                            <Clock size={14} className="text-gray-800" />
                            {moment(blogData.createdAt).fromNow()}
                        </div>
                    </div>

                    <h1 className="text-7xl font-black tracking-tighter md:text-9xl text-white uppercase italic leading-[0.85] mb-12">
                        {blogData.title}
                    </h1>

                    <div className="flex items-center justify-center gap-6 bg-gray-900/10 w-fit mx-auto p-6 rounded-[2.5rem] border border-gray-900 shadow-3xl">
                        <div className="h-14 w-14 overflow-hidden rounded-2xl ring-2 ring-rose-500/20 bg-gray-950 flex items-center justify-center shadow-inner">
                            {blogData.author.avatar ? (
                                <img src={blogData.author.avatar} alt={blogData.author.name} className="h-full w-full object-cover" />
                            ) : <User size={24} className="text-gray-700" />}
                        </div>
                        <div className="text-left space-y-1">
                            <p className="text-sm font-black text-white uppercase italic tracking-tighter leading-none">{blogData.author.name}</p>
                            <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em]">Synaptic_Architect</p>
                        </div>
                    </div>
                </header>

                {/* Cover Manifold */}
                {blogData.image && (
                    <div className="mb-24 aspect-[21/9] overflow-hidden rounded-[3.5rem] border border-gray-900 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative group">
                        <img src={blogData.image} alt="Manifold" className="h-full w-full object-cover transition duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent"></div>
                        <div className="absolute bottom-10 left-10 p-4 opacity-5 rotate-12 group-hover:rotate-0 transition-all text-white scale-150">
                            <Sparkles size={120} />
                        </div>
                    </div>
                )}

                {/* Core Manifold Grid */}
                <div className="grid grid-cols-1 gap-20 lg:grid-cols-12">
                    {/* Lateral Telemetry (Sidebar) */}
                    <aside className="lg:col-span-3 space-y-16 hidden lg:block">
                        <div className="sticky top-40 space-y-16">
                            <section className="space-y-10 bg-gray-950/40 p-10 rounded-[2.5rem] border border-gray-900 shadow-3xl">
                                <h4 className="text-[10px] uppercase font-black tracking-[0.6em] text-gray-800">Telemetry</h4>
                                <div className="space-y-8">
                                    <button
                                        onClick={() => likeMutation.mutate()}
                                        className={cn(
                                            "flex w-full items-center justify-between rounded-2xl p-5 text-xs font-black uppercase tracking-widest transition-all italic border",
                                            blogData.likes.includes(localStorage.getItem('userId')) ? "bg-rose-500 text-white shadow-3xl border-rose-400" : "bg-gray-900/50 text-gray-600 border-gray-800 hover:text-white hover:bg-gray-900"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <Heart size={20} fill={blogData.likes.includes(localStorage.getItem('userId')) ? 'white' : 'none'} />
                                            <span>Resonance</span>
                                        </div>
                                        <span>{blogData.likes.length}</span>
                                    </button>

                                    <div className="flex items-center justify-between px-2">
                                        <div className="flex items-center gap-4 text-[10px] font-black text-gray-700 uppercase tracking-widest">
                                            <MessageSquare size={16} />
                                            Discussions
                                        </div>
                                        <span className="text-[10px] font-black text-white">{comments?.data?.length || 0}</span>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-8">
                                <h4 className="text-[10px] uppercase font-black tracking-[0.4em] text-gray-800 px-2">Synaptic Tags</h4>
                                <div className="flex flex-wrap gap-4">
                                    {blogData.tags.map(tag => (
                                        <span key={tag} className="text-[10px] font-black text-gray-600 bg-gray-900/40 border border-gray-900 px-4 py-2 rounded-xl hover:text-rose-400 hover:border-rose-500/30 cursor-pointer transition-all uppercase tracking-widest italic">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </aside>

                    {/* Primary Manifest (Content) */}
                    <main className="lg:col-span-9 space-y-24">
                        <section className="relative group">
                            <div className="absolute -left-12 top-0 h-full w-1 bg-gradient-to-b from-rose-600 via-rose-600/20 to-transparent"></div>
                            <div className="prose prose-invert prose-2xl max-w-none text-gray-400 font-medium leading-[1.8] italic selection:bg-rose-500/50">
                                <p className="first-letter:text-9xl first-letter:font-black first-letter:text-white first-letter:float-left first-letter:mr-8 first-letter:leading-none first-letter:italic">
                                    {blogData.content}
                                </p>
                            </div>
                        </section>

                        {/* Discussion Manifold */}
                        <section className="mt-40 pt-24 border-t border-gray-900">
                            <div className="mb-16 flex items-center justify-between">
                                <h3 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-6">
                                    Discussion <span className="text-rose-500">Nodes</span>
                                </h3>
                                <div className="h-1 w-24 bg-gray-900"></div>
                            </div>

                            {/* Input Socket */}
                            <div className="mb-20 group relative">
                                <div className="absolute inset-0 bg-rose-600/5 blur-[100px] opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                                <div className="relative rounded-[3rem] bg-gray-900/10 p-2 border border-gray-900 focus-within:border-rose-500/40 focus-within:bg-black transition-all shadow-3xl flex items-center gap-4">
                                    <div className="ml-6 h-12 w-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-3xl">
                                        <Zap size={24} />
                                    </div>
                                    <input
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Inject your thoughts into this manifold..."
                                        className="flex-1 bg-transparent p-6 text-sm font-black uppercase tracking-widest text-white placeholder:text-gray-800 focus:outline-none"
                                        onKeyDown={(e) => e.key === 'Enter' && commentText.trim() && commentMutation.mutate(commentText)}
                                    />
                                    <Button
                                        onClick={() => commentText.trim() && commentMutation.mutate(commentText)}
                                        disabled={commentMutation.isPending || !commentText.trim()}
                                        className="mr-2 rounded-[1.5rem] bg-white text-black p-8 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-20 aspect-square"
                                    >
                                        <Send size={24} />
                                    </Button>
                                </div>
                            </div>

                            {/* Discusson Stream */}
                            <div className="space-y-10">
                                {comments?.data?.map(comment => (
                                    <div key={comment._id} className="group flex gap-8 rounded-[3rem] p-10 bg-gray-900/5 border border-gray-950 transition-all hover:bg-gray-900/20 hover:border-gray-900 shadow-xl">
                                        <div className="h-16 w-16 shrink-0 rounded-2xl border border-gray-900 bg-gray-950 p-1 shadow-inner relative group/avatar">
                                            <img src={comment.author.avatar || "/default-avatar.png"} alt={comment.author.name} className="h-full w-full rounded-2xl object-cover grayscale group-hover/avatar:grayscale-0 transition-all" />
                                            <div className="absolute -bottom-2 -right-2 h-4 w-4 bg-emerald-500 rounded-full border-4 border-gray-950 animate-pulse"></div>
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <p className="text-sm font-black text-white uppercase italic tracking-tighter">{comment.author.name}</p>
                                                    <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">{moment(comment.createdAt).fromNow()}</span>
                                                </div>
                                                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {(comment.author._id === localStorage.getItem('userId')) && (
                                                        <button
                                                            onClick={() => deleteCommentMutation.mutate(comment._id)}
                                                            className="text-gray-800 hover:text-rose-500 transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                    <button className="text-gray-800 hover:text-white transition-all"><Flag size={16} /></button>
                                                </div>
                                            </div>
                                            <p className="text-lg font-medium text-gray-500 italic leading-relaxed border-l-4 border-gray-900 pl-8">
                                                {comment.content}
                                            </p>
                                            <div className="flex gap-10 pt-4">
                                                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-800 hover:text-rose-400 transition-colors">Upvote</button>
                                                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-800 hover:text-rose-400 transition-colors">Thread_Join</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {comments?.data?.length === 0 && (
                                    <div className="py-40 text-center rounded-[4rem] border border-dashed border-gray-900 bg-black/20 group">
                                        <BookOpen size={64} className="text-gray-800 mx-auto mb-10 group-hover:text-rose-500 transition-colors" />
                                        <h4 className="text-2xl font-black uppercase italic tracking-tighter text-gray-700">No Synaptic Voices</h4>
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-900 mt-4">Initiate the manifold discussion socket.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </main>
                </div>
            </article>

            {/* Matrix Expansion Footnote */}
            <section className="mx-auto mt-60 max-w-6xl px-8 border-t border-gray-900 pt-32 text-center">
                <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-20">Temporal <span className="text-rose-500">Continuum</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="group cursor-pointer space-y-8 text-left p-8 rounded-[3rem] bg-gray-900/10 border border-gray-950 hover:bg-black hover:border-gray-900 transition-all shadow-xl">
                            <div className="aspect-[16/10] rounded-[2rem] bg-gray-950 border border-gray-900 overflow-hidden relative shadow-inner">
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-600/20 via-transparent to-transparent group-hover:scale-125 transition-transform duration-1000"></div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black italic uppercase tracking-widest text-gray-800">Manifold_0{i}_Link</p>
                                <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none group-hover:text-rose-400 transition-colors">Predictive models of cognitive focus in post-academic clusters</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default BlogDetails;
