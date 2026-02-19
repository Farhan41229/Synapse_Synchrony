import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Calendar,
    Clock,
    BookOpen,
    Users,
    Plus,
    Trash2,
    ExternalLink,
    Download,
    Search,
    Star,
    Activity,
    Layout,
    ArrowRight,
    MapPin,
    Target,
    Zap,
    Wind,
    Shield,
    Flame,
    Cpu,
    Sparkles,
    CalendarDays
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// --- TEMPORAL LATTICE MANIFEST ---
const LATTICE_MOCK = {
    DAYS: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    SESSIONS: [
        { id: 'S-101', title: 'Neural Architectures', type: 'Lecture', time: '08:00', duration: '90m', location: 'Hall-07', priority: 'High', color: 'accent-cyan' },
        { id: 'S-102', title: 'Synaptic Lab', type: 'Lab', time: '10:00', duration: '120m', location: 'Node-4', priority: 'Critical', color: 'accent-rose' },
        { id: 'S-103', title: 'Data Flow Theory', type: 'Lecture', time: '14:00', duration: '60m', location: 'Hall-02', priority: 'Medium', color: 'accent-indigo' }
    ]
};

/**
 * @component SessionManifestNode
 * @description High-fidelity session node for the Temporal Lattice.
 */
const SessionManifestNode = ({ session, onSelect }) => (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-gray-900 bg-gray-950/40 p-10 transition-all hover:bg-black hover:border-cyan-500/30 cursor-pointer shadow-3xl">
        <div className={cn("absolute -right-8 -top-8 h-40 w-40 blur-[80px] opacity-10",
            session.color === 'accent-cyan' ? 'bg-cyan-600' :
                session.color === 'accent-rose' ? 'bg-rose-600' : 'bg-indigo-600')}></div>

        <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-5">
                <div className={cn("p-4 rounded-2xl shadow-2xl border border-white/5",
                    session.color === 'accent-cyan' ? 'bg-cyan-600/10 text-cyan-500' :
                        session.color === 'accent-rose' ? 'bg-rose-600/10 text-rose-500' : 'bg-indigo-600/10 text-indigo-500')}>
                    {session.type === 'Lecture' ? <BookOpen size={24} /> : <Cpu size={24} />}
                </div>
                <div>
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">{session.title}</h4>
                    <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">{session.type} Protocol</p>
                </div>
            </div>
            <div className={cn("text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/5",
                session.priority === 'Critical' ? 'bg-rose-500/10 text-rose-500' :
                    session.priority === 'High' ? 'bg-orange-500/10 text-orange-500' : 'bg-emerald-500/10 text-emerald-500')}>
                {session.priority}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-8 relative z-10 border-t border-gray-900 pt-8 mt-4">
            <div className="flex items-center gap-3">
                <Clock size={16} className="text-gray-700" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{session.time} ({session.duration})</span>
            </div>
            <div className="flex items-center gap-3">
                <MapPin size={16} className="text-gray-700" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{session.location}</span>
            </div>
        </div>
    </div>
);

const AcademicSchedule = () => {
    const queryClient = useQueryClient();
    const [activeDay, setActiveDay] = useState('Mon');

    return (
        <div className="min-h-screen bg-gray-950 p-10 text-white md:p-16 lg:p-24 selection:bg-cyan-500/30 font-sans">
            {/* Command Header */}
            <header className="mb-24 flex flex-col justify-between gap-16 md:flex-row md:items-end p-12 bg-gray-900/10 rounded-[4rem] border border-gray-900 shadow-3xl">
                <div className="flex items-center gap-10">
                    <div className="h-20 w-20 bg-white text-black flex items-center justify-center rounded-[2rem] shadow-3xl">
                        <CalendarDays size={40} />
                    </div>
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.8em] text-cyan-500">Temporal Lattice v4.2</span>
                        </div>
                        <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-none text-white">Academic <br /> <span className="text-cyan-500">Manifold</span></h1>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-2xl border-gray-800 bg-gray-950 px-10 py-8 text-xs font-black uppercase tracking-widest text-white hover:bg-gray-800 transition-all">
                        Full Matrix
                    </Button>
                    <Button className="rounded-2xl bg-cyan-600 px-10 py-8 text-xs font-black uppercase tracking-widest text-white hover:bg-cyan-500 shadow-3xl">
                        Update Lattice
                    </Button>
                </div>
            </header>

            {/* Tactical Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                {/* Navigation Column */}
                <div className="lg:col-span-3 space-y-16">
                    <section className="bg-gray-900/10 rounded-[4rem] border border-gray-900 p-12">
                        <h3 className="text-xs font-black text-gray-700 uppercase tracking-[0.6em] px-4 mb-12 italic">Temporal Index</h3>
                        <div className="space-y-4">
                            {LATTICE_MOCK.DAYS.map(day => (
                                <button
                                    key={day}
                                    onClick={() => setActiveDay(day)}
                                    className={cn(
                                        "w-full flex items-center justify-between rounded-[2rem] p-6 text-sm font-black uppercase tracking-widest transition-all italic border border-transparent",
                                        activeDay === day ? "bg-white text-black shadow-3xl scale-105" : "text-gray-600 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {day}
                                    {activeDay === day && <ArrowRight size={16} />}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="bg-indigo-600 rounded-[3rem] p-12 shadow-[0_0_80px_rgba(99,102,241,0.2)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                            <Rocket size={140} />
                        </div>
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-8 relative z-10">Lattice Overwatch</h3>
                        <p className="text-indigo-100/80 text-lg font-medium italic leading-relaxed mb-10 border-l-4 border-indigo-400 pl-8 relative z-10">
                            The manifold is currently synchronized across all academic sectors. No collisions detected.
                        </p>
                        <div className="flex items-center gap-4 relative z-10 bg-black/20 p-4 rounded-2xl w-fit">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Status: Locked</span>
                        </div>
                    </section>
                </div>

                {/* Session Stream */}
                <div className="lg:col-span-9 space-y-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {LATTICE_MOCK.SESSIONS.map(session => (
                            <SessionManifestNode key={session.id} session={session} />
                        ))}

                        <div className="group flex flex-col items-center justify-center rounded-[3rem] border border-gray-900 border-dashed bg-gray-900/5 p-16 transition-all hover:bg-white/5 hover:border-cyan-500/40 cursor-pointer shadow-3xl">
                            <div className="h-20 w-20 rounded-full border-2 border-gray-800 flex items-center justify-center text-gray-700 transition-all group-hover:scale-110 group-hover:border-white group-hover:text-white">
                                <Plus size={40} />
                            </div>
                            <span className="mt-8 text-[11px] font-black uppercase tracking-[0.4em] text-gray-700 group-hover:text-white transition-colors">Inject New Node</span>
                        </div>
                    </div>

                    <div className="rounded-[4rem] border border-gray-900 bg-black/40 p-24 relative overflow-hidden group shadow-3xl">
                        <div className="absolute top-0 right-0 p-24 opacity-5 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-700 scale-150">
                            <Activity size={240} className="text-cyan-500" />
                        </div>
                        <div className="relative z-10 space-y-12">
                            <h3 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none text-center">Temporal Matrix Insights</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                {[
                                    { label: 'Avg Density', val: '4.2h/day', icon: Zap, color: 'text-cyan-500' },
                                    { label: 'Peak Flux', val: 'Mon-10:00', icon: Flame, color: 'text-rose-500' },
                                    { label: 'Sync Score', val: '98%', icon: Shield, color: 'text-emerald-500' }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-gray-950/40 p-10 rounded-[2.5rem] border border-gray-900 flex flex-col items-center text-center group-hover:border-white/5 transition-all">
                                        <div className={cn("mb-6", stat.color)}>
                                            <stat.icon size={32} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">{stat.label}</p>
                                        <span className="text-3xl font-black text-white italic italic tracking-tighter">{stat.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="mt-40 pt-20 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="flex items-center gap-8 bg-gray-900/10 px-8 py-4 rounded-full border border-gray-900">
                    <div className="h-3 w-3 rounded-full bg-cyan-500 animate-[pulse_3s_infinite] shadow-[0_0_10px_#06b6d4]"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.8em] text-gray-800">Manifold Sync Lock Active</span>
                </div>
                <div className="flex gap-20 text-[10px] font-black uppercase tracking-[0.2em] text-gray-800">
                    <span className="hover:text-white transition-colors cursor-pointer italic">Lattice Schema</span>
                    <span className="hover:text-white transition-colors cursor-pointer italic">Temporal Logs</span>
                    <span className="text-gray-900">Hash: 0x41229_v42</span>
                </div>
            </footer>
        </div>
    );
};

const Rocket = Sparkles; // Fallback mapping

export default AcademicSchedule;
