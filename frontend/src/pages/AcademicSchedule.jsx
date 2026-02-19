import React, { useState, useEffect, useMemo } from 'react';
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
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';
import { cn } from '@/lib/utils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = Array.from({ length: 14 }, (_, i) => `${8 + i}:00`);

const AcademicSchedule = () => {
    const queryClient = useQueryClient();
    const [selectedSemester, setSelectedSemester] = useState('Summer 2026');
    const [viewMode, setViewMode] = useState('weekly'); // Weekly or Day view
    const [currentDayIndex, setCurrentDayIndex] = useState(moment().day() === 0 ? 6 : moment().day() - 1);

    // Queries
    const { data: schedule, isLoading } = useQuery({
        queryKey: ['schedule', selectedSemester],
        queryFn: async () => {
            const res = await fetch(`/api/schedule/grouped?semester=${selectedSemester}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        }
    });

    const deleteClassMutation = useMutation({
        mutationFn: async (id) => {
            const res = await fetch(`/api/schedule/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['schedule']);
            toast.success('Class removed from your schedule.');
        },
        onError: (err) => toast.error(err.message)
    });

    // Helper to calculate position in the grid
    const getSlotPosition = (time) => {
        const [hour, minute] = time.split(':').map(Number);
        const startOffset = 8; // Grid starts at 8 AM
        return (hour - startOffset) * 60 + minute;
    };

    const getSlotHeight = (start, end) => {
        const startPos = getSlotPosition(start);
        const endPos = getSlotPosition(end);
        return endPos - startPos;
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-950">
                <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 p-6 text-white md:p-10">
            {/* Header Content */}
            <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-cyan-600/20 p-4 text-cyan-400 shadow-xl shadow-cyan-900/10">
                        <BookOpen size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white">Academic Calendar</h1>
                        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-gray-500">
                            <Calendar size={14} />
                            Efficiently track your course workload.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 rounded-xl bg-gray-900 p-1 border border-gray-800">
                        <button
                            onClick={() => setViewMode('weekly')}
                            className={cn(
                                "rounded-lg px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all",
                                viewMode === 'weekly' ? "bg-gray-800 text-white shadow-md" : "text-gray-500 hover:text-white"
                            )}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setViewMode('day')}
                            className={cn(
                                "rounded-lg px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all",
                                viewMode === 'day' ? "bg-gray-800 text-white shadow-md" : "text-gray-500 hover:text-white"
                            )}
                        >
                            Day
                        </button>
                    </div>

                    <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-bold text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        <option>Summer 2026</option>
                        <option>Spring 2026</option>
                        <option>Winter 2025</option>
                    </select>

                    <button className="flex items-center gap-2 rounded-xl bg-gray-900 border border-gray-800 px-4 py-2 text-sm font-bold text-gray-400 hover:bg-gray-800 transition-colors">
                        <Download size={16} />
                        Export
                    </button>

                    <button className="flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-cyan-700 transition">
                        <Plus size={18} />
                        Add Subject
                    </button>
                </div>
            </div>

            {/* View Mode: Weekly */}
            {viewMode === 'weekly' && (
                <div className="overflow-x-auto overflow-y-hidden rounded-3xl border border-gray-800 bg-gray-900/40 backdrop-blur-md shadow-2xl">
                    <div className="min-w-[1000px]">
                        {/* Days Header */}
                        <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-800 bg-gray-900/60 font-bold uppercase tracking-widest text-gray-500">
                            <div className="p-4 text-center text-xs">Time</div>
                            {DAYS.map((day, i) => (
                                <div
                                    key={day}
                                    className={cn(
                                        "p-4 text-center text-xs border-l border-gray-800 transition-colors",
                                        i === currentDayIndex ? "text-cyan-400 bg-cyan-400/5" : ""
                                    )}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Schedule Grid */}
                        <div className="relative grid grid-cols-[80px_repeat(7,1fr)] bg-gray-950/20" style={{ height: '800px' }}>
                            {/* Time indicators column */}
                            <div className="relative border-r border-gray-800">
                                {TIME_SLOTS.map((time, i) => (
                                    <div
                                        key={time}
                                        className="absolute w-full border-b border-gray-800/30 text-[10px] font-bold text-gray-600 flex justify-center py-2"
                                        style={{ top: `${i * 60}px`, height: '60px' }}
                                    >
                                        {time}
                                    </div>
                                ))}
                            </div>

                            {/* Class slots per day */}
                            {DAYS.map((day, dayIdx) => (
                                <div key={day} className="relative border-r border-gray-800/50 last:border-0">
                                    {/* Horizontal grid lines for context */}
                                    {TIME_SLOTS.map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-full border-b border-gray-800/20"
                                            style={{ top: `${(i + 1) * 60}px` }}
                                        ></div>
                                    ))}

                                    {/* The colored class boxes */}
                                    {schedule?.data?.[day]?.map((slot, i) => (
                                        <div
                                            key={slot._id}
                                            className="absolute left-1 right-1 rounded-xl p-3 shadow-lg transition-transform hover:scale-[1.02] hover:z-10 cursor-pointer border group"
                                            style={{
                                                top: `${getSlotPosition(slot.startTime)}px`,
                                                height: `${getSlotHeight(slot.startTime, slot.endTime)}px`,
                                                backgroundColor: `hsl(${(i * 137) % 360}, 50%, 15%)`,
                                                borderColor: `hsl(${(i * 137) % 360}, 60%, 40%)`
                                            }}
                                        >
                                            <div className="flex items-start justify-between">
                                                <h4 className="text-xs font-black truncate text-white uppercase tracking-tight">{slot.subject}</h4>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteClassMutation.mutate(slot._id); }}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded-md text-red-400"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                            <p className="mt-1 text-[10px] font-bold text-gray-300 flex items-center gap-1">
                                                <MapPin size={8} />
                                                {slot.room || 'TBA'}
                                            </p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-[9px] font-bold bg-white/10 px-1.5 py-0.5 rounded text-white/70">
                                                    {slot.courseCode}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* View Mode: Day */}
            {viewMode === 'day' && (
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between rounded-2xl bg-gray-900/50 p-6 border border-gray-800">
                        <button
                            onClick={() => setCurrentDayIndex((prev) => (prev === 0 ? 6 : prev - 1))}
                            className="p-2 rounded-xl hover:bg-gray-800 transition text-gray-400 hover:text-white"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <h2 className="text-3xl font-black text-white uppercase tracking-widest">{DAYS[currentDayIndex]}</h2>
                        <button
                            onClick={() => setCurrentDayIndex((prev) => (prev === 6 ? 0 : prev + 1))}
                            className="p-2 rounded-xl hover:bg-gray-800 transition text-gray-400 hover:text-white"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {schedule?.data?.[DAYS[currentDayIndex]]?.map((slot, i) => (
                            <div
                                key={slot._id}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/40 p-6 shadow-xl transition hover:border-cyan-500/50 hover:bg-gray-900/60"
                            >
                                <div className="absolute top-0 right-0 h-24 w-24 translate-x-12 translate-y--12 rounded-full bg-cyan-500/5 blur-3xl group-hover:bg-cyan-500/10"></div>

                                <div>
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="rounded-xl bg-cyan-600/10 px-3 py-1 text-xs font-black text-cyan-400 uppercase tracking-wider">
                                            {slot.courseCode}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="text-gray-600 hover:text-white transition">
                                                <Edit size={16} />
                                            </button>
                                            <button className="text-gray-600 hover:text-red-400 transition">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black text-white leading-tight uppercase mb-2">{slot.subject}</h3>

                                    <div className="space-y-3 mt-4">
                                        <div className="flex items-center gap-3 text-sm font-bold text-gray-400">
                                            <div className="rounded-lg bg-gray-800 p-1.5">
                                                <Clock size={16} className="text-gray-500" />
                                            </div>
                                            {slot.startTime} - {slot.endTime}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-bold text-gray-400">
                                            <div className="rounded-lg bg-gray-800 p-1.5">
                                                <MapPin size={16} className="text-gray-500" />
                                            </div>
                                            {slot.room || 'Classroom TBA'}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-bold text-gray-400">
                                            <div className="rounded-lg bg-gray-800 p-1.5">
                                                <User size={16} className="text-gray-500" />
                                            </div>
                                            {slot.instructor || 'Staff'}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center gap-3 border-t border-gray-800 pt-4">
                                    <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
                                        <div className="h-full bg-cyan-500/50 w-full animate-pulse"></div>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-600 uppercase">Current</span>
                                </div>
                            </div>
                        ))}

                        {schedule?.data?.[DAYS[currentDayIndex]]?.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-800 bg-gray-950/20 py-20 text-center">
                                <div className="mb-4 rounded-full bg-gray-900 p-6 text-gray-700 shadow-inner">
                                    <AlertCircle size={48} />
                                </div>
                                <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">No classes today</h3>
                                <p className="mt-2 text-sm font-bold text-gray-600">Enjoy your free time or use it to catch up on blogs!</p>
                                <button className="mt-6 font-black text-cyan-400 hover:text-cyan-300 underline underline-offset-8 transition-all">Add a slot now</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* AI Optimization Insight */}
            {schedule?.data && (
                <div className="mt-12 rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-950 to-cyan-900/10 p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Zap size={160} />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="h-20 w-20 shrink-0 rounded-2xl bg-cyan-600 flex items-center justify-center text-white shadow-xl shadow-cyan-900/40">
                            <TrendingUp size={40} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 italic">Smart Schedule Analysis</h3>
                            <p className="max-w-xl text-gray-400 font-medium leading-relaxed">
                                We've analyzed your upcoming week. <span className="text-white font-bold underline decoration-cyan-500 underline-offset-4">Wednesday</span> is your heaviest day with 4 back-to-back sessions.
                                We suggest completing your <span className="text-white">Machine Learning</span> assignment by Tuesday evening to avoid burnout.
                            </p>
                        </div>
                        <button className="shrink-0 rounded-2xl bg-white px-8 py-3 text-sm font-black text-black hover:bg-gray-200 transition-all shadow-xl shadow-white/5 active:scale-95">
                            Optimize Now
                        </button>
                    </div>
                </div>
            )}

            {/* Footer Bottom Padding */}
            <div className="h-20"></div>
        </div>
    );
};

export default AcademicSchedule;
