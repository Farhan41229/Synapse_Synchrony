import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Calendar,
    MapPin,
    User,
    Clock,
    Users,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Share2,
    Heart,
    Download,
    Coffee,
    Zap,
    Mic2,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';
import { cn } from '@/lib/utils';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('details');

    const { data: event, isLoading: eventLoading, isError } = useQuery({
        queryKey: ['event', id],
        queryFn: async () => {
            const res = await fetch(`/api/events/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            if (!res.ok) throw new Error('Event data could not be retrieved.');
            return res.json();
        }
    });

    const registerMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/events/${id}/register`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Registration failed.');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['event', id]);
            toast.success('You have successfully registered for this event!');
        },
        onError: (err) => toast.error(err.message)
    });

    if (eventLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-950">
                <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-gray-950 text-white p-10">
                <AlertCircle size={64} className="text-red-500 mb-6" />
                <h1 className="text-2xl font-black uppercase tracking-tighter text-white">Event Unavailable</h1>
                <p className="mt-2 text-gray-500 font-bold max-w-md text-center">This event has either expired, been cancelled, or does not exist in our system.</p>
                <button
                    onClick={() => navigate('/events')}
                    className="mt-8 rounded-2xl bg-cyan-600 px-8 py-3 font-black text-white hover:bg-cyan-700 transition"
                >
                    Back to Schedule
                </button>
            </div>
        );
    }

    const { data: eventData } = event;
    const isPast = moment(eventData.startDate).isBefore(moment());
    const isRegistered = eventData.participants?.includes(localStorage.getItem('userId'));

    return (
        <div className="min-h-screen bg-gray-950 text-white selection:bg-cyan-500/30">
            {/* Massive Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <img
                    src={eventData.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80"}
                    alt={eventData.title}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>

                {/* Hero Content */}
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-20">
                    <div className="mx-auto max-w-6xl">
                        <button
                            onClick={() => navigate(-1)}
                            className="mb-8 flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-cyan-400 hover:text-white transition"
                        >
                            <ArrowLeft size={18} />
                            Return to explorer
                        </button>

                        <div className="flex items-center gap-4 mb-4">
                            <span className="rounded-lg bg-cyan-600/90 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-xl backdrop-blur-md">
                                {eventData.eventType}
                            </span>
                            {isPast && (
                                <span className="rounded-lg bg-red-600/90 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-xl backdrop-blur-md">
                                    Concluded
                                </span>
                            )}
                        </div>

                        <h1 className="text-5xl font-black md:text-8xl tracking-tighter uppercase italic text-white mb-6 drop-shadow-2xl">
                            {eventData.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-10 mt-10">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                                    <Calendar size={24} className="text-cyan-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">When</p>
                                    <p className="font-bold text-lg">{moment(eventData.startDate).format('MMMM Do [at] h:mm A')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                                    <MapPin size={24} className="text-cyan-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Where</p>
                                    <p className="font-bold text-lg">{eventData.location || "Auditorium Hub"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body Grid */}
            <div className="mx-auto max-w-6xl px-8 py-20">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">

                    {/* Left: Main Details */}
                    <div className="lg:col-span-2">
                        {/* Dynamic Tabs */}
                        <div className="mb-12 flex gap-10 border-b border-gray-900 overflow-x-auto no-scrollbar pb-4">
                            {['details', 'agenda', 'speakers', 'attendees'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "text-xs font-black uppercase tracking-[0.2em] transition-all relative pb-2 whitespace-nowrap",
                                        activeTab === tab ? "text-cyan-400" : "text-gray-600 hover:text-white"
                                    )}
                                >
                                    {tab}
                                    {activeTab === tab && <div className="absolute bottom-0 left-0 h-1 w-full bg-cyan-400 rounded-full"></div>}
                                </button>
                            ))}
                        </div>

                        <div className="prose prose-invert prose-lg max-w-none">
                            {activeTab === 'details' && (
                                <div className="space-y-10 animate-fade-in">
                                    <div>
                                        <h3 className="text-3xl font-black uppercase tracking-tighter mb-6">About the event</h3>
                                        <p className="text-gray-400 font-medium leading-[2] text-xl">
                                            {eventData.description}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8 pt-10 border-t border-gray-900">
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400">Speaker / Guest</h4>
                                            <p className="text-2xl font-black uppercase leading-none">{eventData.organiser?.name || "Dr. Faisal Ahmed"}</p>
                                            <p className="text-sm text-gray-600 font-bold uppercase">Senior Software Architect</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400">Duration</h4>
                                            <p className="text-2xl font-black uppercase leading-none">120 Minutes</p>
                                            <p className="text-sm text-gray-600 font-bold uppercase">Hybrid Session</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'agenda' && (
                                <div className="space-y-8 py-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex gap-6 p-6 rounded-3xl bg-gray-900 border border-gray-800 hover:border-cyan-500/50 transition">
                                            <div className="h-12 w-12 shrink-0 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                                                <Clock size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-500 uppercase">Part {i} • {i + 8}:00 PM</p>
                                                <h4 className="text-lg font-black uppercase text-white tracking-widest mt-1">Foundational insights into collaborative synergy</h4>
                                                <p className="mt-2 text-sm text-gray-400 font-medium leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec vehicula felis. Phasellus at erat sem.</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'speakers' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                                    <div className="p-8 rounded-[3rem] bg-gray-900 border border-gray-800 text-center flex flex-col items-center">
                                        <div className="h-32 w-32 rounded-full border-4 border-cyan-500/20 p-2 mb-6">
                                            <img src="/api/placeholder/speaker1" className="h-full w-full rounded-full object-cover bg-gray-800" />
                                        </div>
                                        <h4 className="text-2xl font-black uppercase italic tracking-tighter">Irfan Chowdhury</h4>
                                        <p className="text-xs font-bold uppercase text-cyan-400 tracking-widest mt-2 mb-4">Founder, Synapse Synchrony</p>
                                        <div className="flex gap-4">
                                            <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition"><Share2 size={12} /></div>
                                            <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition"><User size={12} /></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Actions / Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 space-y-8">
                            {/* Registration Card */}
                            <div className="rounded-[4rem] bg-cyan-600 p-10 text-white shadow-2xl shadow-cyan-900/40 border border-white/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 animate-pulse opacity-20">
                                    <Zap size={100} />
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-cyan-950/80">Reserve your spot</h3>
                                    <div className="flex items-center gap-3 mb-8">
                                        <Users size={32} />
                                        <div>
                                            <p className="text-4xl font-black tracking-tighter leading-none">{eventData.participants?.length || 120}</p>
                                            <p className="text-[10px] uppercase font-bold text-cyan-950/60 tracking-widest mt-1">Confirmed Attendees</p>
                                        </div>
                                    </div>

                                    {isRegistered ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-center gap-2 rounded-3xl bg-white/20 px-8 py-5 text-lg font-black uppercase tracking-widest backdrop-blur-md">
                                                <CheckCircle2 size={24} />
                                                Registered
                                            </div>
                                            <button className="w-full rounded-3xl bg-transparent border border-white/40 py-4 text-xs font-black uppercase tracking-[0.3em] hover:bg-white/10 transition">
                                                View Ticket
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => registerMutation.mutate()}
                                            disabled={registerMutation.isPending || isPast}
                                            className="w-full rounded-3xl bg-white px-8 py-6 text-xl font-black uppercase tracking-[0.2em] text-cyan-600 shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                        >
                                            {registerMutation.isPending ? 'Processing...' : 'Register Now'}
                                        </button>
                                    )}

                                    <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-widest text-cyan-950/40">
                                        By registering, you agree to our community guidelines.
                                    </p>
                                </div>
                            </div>

                            {/* Shared Media / Links */}
                            <div className="rounded-[3rem] bg-gray-900 border border-gray-800 p-8 space-y-6">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Quick Actions</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    <button className="flex items-center justify-between p-4 rounded-2xl bg-gray-950 hover:bg-black transition border border-gray-800">
                                        <span className="text-xs font-bold uppercase text-gray-300">Add to Apple Calendar</span>
                                        <Download size={14} className="text-gray-600" />
                                    </button>
                                    <button className="flex items-center justify-between p-4 rounded-2xl bg-gray-950 hover:bg-black transition border border-gray-800">
                                        <span className="text-xs font-bold uppercase text-gray-300">Invite Friends</span>
                                        <Share2 size={14} className="text-gray-600" />
                                    </button>
                                    <button className="flex items-center justify-between p-4 rounded-2xl bg-gray-950 hover:bg-black transition border border-gray-800">
                                        <span className="text-xs font-bold uppercase text-gray-300">Save to bookmarks</span>
                                        <Bookmark size={14} className="text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Community Highlights */}
                            <div className="p-8 text-center bg-gray-900 border border-gray-800 rounded-[3rem]">
                                <Coffee size={32} className="mx-auto mb-4 text-gray-600" />
                                <h4 className="text-sm font-black uppercase tracking-widest mb-2">After-Event Social</h4>
                                <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase">Join us for informal networking at the student lounge immediately following the seminar.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations Section */}
            <div className="mx-auto mt-20 max-w-6xl px-8 border-t border-gray-950 pt-20">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic">Other events you'll love</h2>
                    <button className="text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:underline">View full calendar</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="group cursor-pointer rounded-3xl bg-gray-900 border border-transparent hover:border-cyan-500/40 p-1 overflow-hidden transition-all duration-500">
                            <div className="aspect-video rounded-2xl bg-gray-950 mb-6 overflow-hidden relative">
                                <div className="h-full w-full bg-gradient-to-tr from-cyan-950/20 to-transparent group-hover:scale-110 transition duration-700"></div>
                                <div className="absolute top-4 left-4 bg-gray-950/60 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/5 text-gray-300">Workshop</div>
                            </div>
                            <div className="p-4 pt-0">
                                <h4 className="text-xl font-black text-white group-hover:text-cyan-400 transition line-clamp-2 uppercase italic mb-2 tracking-tighter leading-none">Synergistic approaches to academic excellence</h4>
                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] flex items-center gap-1">
                                    <Clock size={10} /> June 12th • 4:00 PM
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Massive Bottom Spacing */}
            <div className="h-64"></div>
        </div>
    );
};

export default EventDetails;
