import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Calendar,
    Clock,
    MapPin,
    User,
    Plus,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Trash2,
    Edit,
    Download,
    Filter,
    BookOpen,
    AlertCircle,
    Loader2,
    Zap,
    TrendingUp,
    LayoutGrid,
    Square
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';
import { cn } from '@/lib/utils';

// --- System Configuration ---
const CONFIG = {
    CHRONOS_RANGE: Array.from({ length: 14 }, (_, i) => `${8 + i}:00`),
    WEEK_SYMPHONY: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    ANIMATION_DELAY: 150
};

/**
 * @component SessionCard
 * @description Renders a single academic session block with dynamic positioning.
 */
const SessionCard = ({ session, index, onDelete }) => {
    const startPoint = useMemo(() => {
        const [h, m] = session.startTime.split(':').map(Number);
        return (h - 8) * 60 + m;
    }, [session.startTime]);

    const durationHeight = useMemo(() => {
        const [h1, m1] = session.startTime.split(':').map(Number);
        const [h2, m2] = session.endTime.split(':').map(Number);
        return ((h2 - 8) * 60 + m2) - startPoint;
    }, [session.startTime, session.endTime, startPoint]);

    const themeColor = `hsl(${(index * 137) % 360}, 60%, 20%)`;
    const accentColor = `hsl(${(index * 137) % 360}, 70%, 50%)`;

    return (
        <div
            className="absolute left-1 right-1 rounded-2xl p-4 shadow-2xl transition-all hover:scale-[1.03] hover:z-20 cursor-crosshair border-l-4 group overflow-hidden"
            style={{
                top: `${startPoint}px`,
                height: `${durationHeight}px`,
                backgroundColor: themeColor,
                borderColor: accentColor
            }}
        >
            <div className="flex items-start justify-between">
                <div className="min-w-0">
                    <h4 className="text-[10px] font-black uppercase tracking-tighter text-white truncate leading-none mb-1">
                        {session.subject}
                    </h4>
                    <span className="text-[8px] font-bold text-white/50 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-widest">
                        {session.courseCode}
                    </span>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(session._id); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-black/40 rounded-lg text-white/40 hover:text-red-400"
                >
                    <Trash2 size={12} />
                </button>
            </div>

            <div className="mt-auto space-y-1.5 pt-4">
                <div className="flex items-center gap-2 text-[9px] font-black text-white/40 uppercase">
                    <MapPin size={10} className="text-white/20" />
                    <span className="truncate">{session.room || "Node TBA"}</span>
                </div>
            </div>

            <div className="absolute bottom-[-10px] right-[-10px] opacity-10 group-hover:opacity-20 transition-opacity">
                <Square size={60} className="fill-white" />
            </div>
        </div>
    );
};

/**
 * @component ScheduleInsight
 * @description Dynamic analysis of the user's workload.
 */
const ScheduleInsight = ({ data }) => (
    <div className="mt-16 rounded-[3rem] border border-gray-900 bg-gray-900/5 p-12 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <TrendingUp size={180} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="h-24 w-24 shrink-0 rounded-[2rem] bg-cyan-600 flex items-center justify-center text-white shadow-2xl shadow-cyan-900/40">
                <Zap size={48} />
            </div>
            <div className="flex-1">
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Neural Workload Matrix</h3>
                <p className="max-w-2xl text-gray-500 font-medium text-lg leading-relaxed italic border-l-4 border-cyan-900 pl-8">
                    Heuristic analysis complete. <span className="text-white font-black underline decoration-2 decoration-cyan-500 underline-offset-8">Wednesday</span> presents a critical bottleneck with 4 sequential sessions.
                    Optimal synchronization suggests offloading <span className="text-cyan-400">Machine Learning</span> tasks to the Monday buffer.
                </p>
            </div>
            <button className="shrink-0 rounded-[1.5rem] bg-white px-10 py-5 text-sm font-black uppercase tracking-widest text-black hover:bg-gray-100 transition-all active:scale-95 shadow-xl">
                Recalibrate Sync
            </button>
        </div>
    </div>
);

const AcademicSchedule = () => {
    const queryClient = useQueryClient();
    const [activeSemester, setActiveSemester] = useState('Summer 2026');
    const [renderLayout, setRenderLayout] = useState('grid');
    const [activeDayPtr, setActiveDayPtr] = useState(moment().day() === 0 ? 6 : moment().day() - 1);

    // --- Kinetic Data Retrieval ---
    const { data: matrix, isLoading: matrixLoading } = useQuery({
        queryKey: ['schedule-matrix', activeSemester],
        queryFn: async () => {
            const res = await fetch(`/api/schedule/grouped?semester=${activeSemester}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        }
    });

    const expungeSessionMutation = useMutation({
        mutationFn: async (id) => {
            const res = await fetch(`/api/schedule/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['schedule-matrix']);
            toast.success('Neural link severed. Session expunged.');
        }
    });

    if (matrixLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-950">
                <div className="relative">
                    <Loader2 className="h-16 w-16 animate-spin text-cyan-600 opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-cyan-500 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 p-8 text-white md:p-14 selection:bg-cyan-500/30">
            {/* Command Header */}
            <header className="mb-14 flex flex-col justify-between gap-10 md:flex-row md:items-end">
                <div className="flex items-center gap-6">
                    <div className="rounded-[2.5rem] bg-cyan-600/10 p-6 text-cyan-400 shadow-3xl border border-cyan-500/20">
                        <BookOpen size={48} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">Astro <br /> <span className="text-cyan-500">Calendar</span></h1>
                        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-gray-600">
                            Temporal efficiency manifold active.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 rounded-2xl bg-gray-900/50 p-2 border border-gray-800">
                        {['grid', 'day'].map(view => (
                            <button
                                key={view}
                                onClick={() => setRenderLayout(view)}
                                className={cn(
                                    "rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all",
                                    renderLayout === view ? "bg-white text-black shadow-2xl" : "text-gray-500 hover:text-white"
                                )}
                            >
                                {view} View
                            </button>
                        ))}
                    </div>

                    <select
                        value={activeSemester}
                        onChange={(e) => setActiveSemester(e.target.value)}
                        className="rounded-2xl border border-gray-800 bg-gray-950 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all cursor-pointer"
                    >
                        <option>Summer 2026</option>
                        <option>Spring 2026</option>
                        <option>Winter 2025</option>
                    </select>

                    <button className="flex items-center gap-3 rounded-2xl bg-cyan-600 px-8 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-cyan-500 transition-all active:scale-95 shadow-2xl shadow-cyan-900/20">
                        <Plus size={20} /> New Objective
                    </button>
                </div>
            </header>

            {/* View Engine: Matrix Grid */}
            {renderLayout === 'grid' ? (
                <div className="overflow-x-auto rounded-[3.5rem] border border-gray-900 bg-black/40 backdrop-blur-3xl shadow-[0_0_80px_-20px_rgba(0,0,0,0.8)]">
                    <div className="min-w-[1200px]">
                        {/* Days Ribbon */}
                        <div className="grid grid-cols-[100px_repeat(7,1fr)] border-b border-gray-900 bg-gray-900/20">
                            <div className="p-6 text-center text-[10px] font-black uppercase tracking-widest text-gray-800 border-r border-gray-900">UTC-8</div>
                            {CONFIG.WEEK_SYMPHONY.map((day, i) => (
                                <div
                                    key={day}
                                    className={cn(
                                        "p-6 text-center text-[10px] font-black uppercase tracking-[0.4em] transition-all",
                                        i === activeDayPtr ? "text-cyan-400 bg-cyan-500/5" : "text-gray-600"
                                    )}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Chronos Canvas */}
                        <div className="relative grid grid-cols-[100px_repeat(7,1fr)]" style={{ height: '840px' }}>
                            {/* Temporal Markers */}
                            <div className="border-r border-gray-900">
                                {CONFIG.CHRONOS_RANGE.map((time, i) => (
                                    <div
                                        key={time}
                                        className="h-[60px] flex items-center justify-center text-[9px] font-black text-gray-800 uppercase tracking-tighter"
                                        style={{ borderBottom: '1px solid rgba(31, 41, 55, 0.4)' }}
                                    >
                                        {time}
                                    </div>
                                ))}
                            </div>

                            {/* Session Field */}
                            {CONFIG.WEEK_SYMPHONY.map((day, dIdx) => (
                                <div key={day} className="relative border-r border-gray-900/40 last:border-0 h-full">
                                    {/* Sub-grid indicators */}
                                    {CONFIG.CHRONOS_RANGE.map((_, i) => (
                                        <div key={i} className="h-[60px] border-b border-gray-900/10"></div>
                                    ))}

                                    {/* Session Instances */}
                                    {matrix?.data?.[day]?.map((slot, i) => (
                                        <SessionCard
                                            key={slot._id}
                                            session={slot}
                                            index={i}
                                            onDelete={expungeSessionMutation.mutate}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* Specialized Day View */
                <div className="space-y-10">
                    <div className="flex items-center justify-between rounded-[2.5rem] bg-gray-900/10 p-10 border border-gray-900 backdrop-blur-xl">
                        <button
                            onClick={() => setActiveDayPtr(p => p === 0 ? 6 : p - 1)}
                            className="h-16 w-16 rounded-3xl bg-gray-950 border border-gray-800 flex items-center justify-center hover:bg-gray-800 transition shadow-xl"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter italic">
                            {CONFIG.WEEK_SYMPHONY[activeDayPtr]}
                        </h2>
                        <button
                            onClick={() => setActiveDayPtr(p => p === 6 ? 0 : p + 1)}
                            className="h-16 w-16 rounded-3xl bg-gray-950 border border-gray-800 flex items-center justify-center hover:bg-gray-800 transition shadow-xl"
                        >
                            <ChevronRight size={32} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {matrix?.data?.[CONFIG.WEEK_SYMPHONY[activeDayPtr]]?.map((slot, i) => (
                            <div
                                key={slot._id}
                                className="group relative flex flex-col justify-between rounded-[3rem] border border-gray-900 bg-gray-900/20 p-10 shadow-3xl transition-all hover:border-cyan-500/40"
                            >
                                <div className="absolute -top-10 -right-10 h-40 w-40 bg-cyan-500/5 blur-[50px] group-hover:bg-cyan-500/10 transition-colors"></div>

                                <div>
                                    <div className="mb-10 flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 bg-cyan-500/10 px-4 py-1.5 rounded-full">
                                            {slot.courseCode}
                                        </span>
                                        <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-gray-600 hover:text-white"><Edit size={18} /></button>
                                            <button className="text-gray-600 hover:text-red-500"><Trash2 size={18} /></button>
                                        </div>
                                    </div>

                                    <h3 className="text-4xl font-black text-white italic leading-none mb-10 uppercase">{slot.subject}</h3>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-6">
                                            <div className="h-12 w-12 rounded-2xl bg-gray-950 flex items-center justify-center text-gray-500 border border-gray-800">
                                                <Clock size={20} />
                                            </div>
                                            <span className="text-sm font-black text-gray-400 uppercase tracking-widest">{slot.startTime} — {slot.endTime}</span>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="h-12 w-12 rounded-2xl bg-gray-950 flex items-center justify-center text-gray-500 border border-gray-800">
                                                <MapPin size={20} />
                                            </div>
                                            <span className="text-sm font-black text-gray-400 uppercase tracking-widest">{slot.room || 'Spatial Buffer Unknown'}</span>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="h-12 w-12 rounded-2xl bg-gray-950 flex items-center justify-center text-gray-500 border border-gray-800">
                                                <User size={20} />
                                            </div>
                                            <span className="text-sm font-black text-gray-400 uppercase tracking-widest">{slot.instructor || 'Staff Node'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-14 pt-8 border-t border-gray-900 flex items-center justify-between">
                                    <div className="flex-1 h-1.5 bg-gray-950 rounded-full overflow-hidden mr-4">
                                        <div className="h-full bg-cyan-500 w-1/3 animate-pulse"></div>
                                    </div>
                                    <span className="text-[9px] font-black text-gray-800 uppercase tracking-widest">Active Link</span>
                                </div>
                            </div>
                        ))}

                        {(!matrix?.data || matrix.data[CONFIG.WEEK_SYMPHONY[activeDayPtr]]?.length === 0) && (
                            <div className="col-span-full py-40 flex flex-col items-center justify-center rounded-[4rem] border border-dashed border-gray-900 bg-gray-950/20">
                                <AlertCircle size={80} className="text-gray-800 mb-8" />
                                <h4 className="text-2xl font-black text-gray-700 uppercase italic tracking-tighter">Temporal Null Space</h4>
                                <p className="text-sm font-bold text-gray-800 uppercase tracking-widest mt-2">Zero academic oscillations logged for this cycle.</p>
                                <button className="mt-10 px-8 py-3 rounded-2xl bg-gray-900 text-cyan-500 font-black uppercase text-[10px] tracking-widest hover:bg-gray-800 transition-colors">Bridge Gap</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <ScheduleInsight data={matrix?.data} />

            <footer className="mt-40 text-center py-20 border-t border-gray-900">
                <p className="text-[10px] font-black uppercase tracking-[1em] text-gray-800">SYNC_MANIFOLD_41229_v2.0</p>
            </footer>
        </div>
    );
};

export default AcademicSchedule;

