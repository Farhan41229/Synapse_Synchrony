import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Heart,
    Smile,
    Zap,
    Calendar,
    TrendingUp,
    AlertCircle,
    BarChart3,
    CheckCircle2,
    Target,
    Plus,
    X,
    Loader2
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
    BarChart, Bar, Legend, Cell
} from 'recharts';
import { toast } from 'sonner';
import moment from 'moment';

const MOOD_COLORS = {
    very_happy: '#10b981', // green
    happy: '#34d399',      // lighter green
    neutral: '#fbbf24',    // amber
    sad: '#f87171',        // red
    very_sad: '#ef4444'     // darker red
};

const WellnessDashboard = () => {
    const queryClient = useQueryClient();
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [moodNote, setMoodNote] = useState('');

    // --- Queries ---
    const { data: moodLogs, isLoading: moodLoading } = useQuery({
        queryKey: ['wellness', 'mood'],
        queryFn: async () => {
            const res = await fetch('/api/wellness/mood', {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        }
    });

    const { data: moodSummary } = useQuery({
        queryKey: ['wellness', 'mood-summary'],
        queryFn: async () => {
            const res = await fetch('/api/wellness/mood/summary', {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        }
    });

    const { data: stressAverage } = useQuery({
        queryKey: ['wellness', 'stress-average'],
        queryFn: async () => {
            const res = await fetch('/api/wellness/stress/average', {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        }
    });

    const { data: goals, isLoading: goalsLoading } = useQuery({
        queryKey: ['wellness', 'goals'],
        queryFn: async () => {
            const res = await fetch('/api/wellness/goals', {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        }
    });

    // --- Mutations ---
    const logMoodMutation = useMutation({
        mutationFn: async (mood) => {
            const res = await fetch('/api/wellness/mood', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ mood, note: moodNote })
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['wellness', 'mood']);
            queryClient.invalidateQueries(['wellness', 'mood-summary']);
            toast.success('Mood logged! Stay positive.');
            setMoodNote('');
        }
    });

    const toggleGoalMutation = useMutation({
        mutationFn: async (id) => {
            const res = await fetch(`/api/wellness/goals/${id}/toggle`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['wellness', 'goals']);
        }
    });

    // --- Data Processing for Charts ---
    const chartData = useMemo(() => {
        if (!moodLogs?.data) return [];
        return moodLogs.data
            .slice(0, 7)
            .reverse()
            .map(log => ({
                day: moment(log.timestamp).format('ddd'),
                level: log.mood === 'very_happy' ? 5 : log.mood === 'happy' ? 4 : log.mood === 'neutral' ? 3 : log.mood === 'sad' ? 2 : 1
            }));
    }, [moodLogs]);

    const summaryData = useMemo(() => {
        if (!moodSummary?.data) return [];
        return Object.entries(moodSummary.data).map(([key, value]) => ({
            mood: key.replace('_', ' '),
            count: value,
            color: MOOD_COLORS[key]
        }));
    }, [moodSummary]);

    if (moodLoading || goalsLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-950">
                <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 p-6 text-white md:p-10">
            {/* Header section */}
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Student Wellness Dashboard</h1>
                    <p className="mt-1 text-gray-400">Track your mental health alongside your academic journey.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowGoalModal(true)}
                        className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 font-semibold text-white transition hover:bg-violet-700 shadow-lg shadow-violet-900/20"
                    >
                        <Plus size={18} />
                        New Goal
                    </button>
                </div>
            </div>

            {/* Top Grid: Stats overview */}
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 backdrop-blur-sm transition hover:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-green-500/10 p-2 text-green-500">
                            <Smile size={24} />
                        </div>
                        <span className="text-xs font-medium text-gray-500">Current Mood</span>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-2xl font-bold text-white capitalize">{moodLogs?.data?.[0]?.mood.replace('_', ' ') || 'Log your mood'}</h3>
                        <p className="text-sm text-gray-500 mt-1">Last logged {moodLogs?.data?.[0] ? moment(moodLogs.data[0].timestamp).fromNow() : 'no logs'}</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 backdrop-blur-sm transition hover:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-yellow-500/10 p-2 text-yellow-500">
                            <Zap size={24} />
                        </div>
                        <span className="text-xs font-medium text-gray-500">Avg. Stress Level</span>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-2xl font-bold text-white">{stressAverage?.data?.average || '0.0'}/10</h3>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
                            <div
                                className="h-full bg-yellow-600 transition-all duration-1000"
                                style={{ width: `${(stressAverage?.data?.average || 0) * 10}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 backdrop-blur-sm transition hover:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                            <CheckCircle2 size={24} />
                        </div>
                        <span className="text-xs font-medium text-gray-500">Goals Completed</span>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-2xl font-bold text-white">{goals?.data?.filter(g => g.isCompleted).length || 0}/{goals?.data?.length || 0}</h3>
                        <p className="text-sm text-gray-400 mt-1">Keep it up!</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 backdrop-blur-sm transition hover:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-violet-500/10 p-2 text-violet-500">
                            <Target size={24} />
                        </div>
                        <span className="text-xs font-medium text-gray-500">Focus Score</span>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-2xl font-bold text-white">82%</h3>
                        <p className="text-sm text-green-400 mt-1">↑ 5% from yesterday</p>
                    </div>
                </div>
            </div>

            {/* Middle Grid: Charts & Goal logging */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left: Mood Tracking Chart */}
                <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 lg:col-span-2 shadow-sm backdrop-blur-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <TrendingUp size={20} className="text-violet-400" />
                            Mood Trends (Last 7 Days)
                        </h3>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                                <XAxis dataKey="day" stroke="#718096" tick={{ fill: '#a0aec0' }} axisLine={false} tickLine={false} />
                                <YAxis hide domain={[1, 5]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a202c', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#8b5cf6' }}
                                />
                                <Area type="monotone" dataKey="level" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorLevel)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Mood Logger */}
                <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-6">How are you feeling?</h3>
                    <div className="grid grid-cols-5 gap-3 mb-8">
                        {Object.entries(MOOD_COLORS).map(([mood, color]) => (
                            <button
                                key={mood}
                                onClick={() => logMoodMutation.mutate(mood)}
                                title={mood.replace('_', ' ')}
                                className="group relative flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800 transition-all hover:scale-110 active:scale-95"
                                style={{ borderColor: moodLogs?.data?.[0]?.mood === mood ? color : 'transparent', borderWidth: '2px' }}
                            >
                                <Smile size={28} style={{ color: moodLogs?.data?.[0]?.mood === mood ? color : '#718096' }} className="group-hover:text-white" />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 uppercase tracking-wider">{mood.replace('_', ' ')}</span>
                            </button>
                        ))}
                    </div>
                    <div className="mt-4">
                        <label className="text-sm font-medium text-gray-400 block mb-2">Want to add a note?</label>
                        <textarea
                            value={moodNote}
                            onChange={(e) => setMoodNote(e.target.value)}
                            placeholder="I feel productive today because..."
                            className="w-full h-32 rounded-xl bg-gray-800 border border-gray-700 p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Grid: Mood distribution and Goals */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Mood Distribution */}
                <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <BarChart3 size={20} className="text-blue-400" />
                        Mood Distribution
                    </h3>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={summaryData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="mood" type="category" axisLine={false} tickLine={false} tick={{ fill: '#a0aec0', fontSize: 12 }} width={80} />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                    {summaryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                        {summaryData.map(mood => (
                            <div key={mood.mood} className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gray-500">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: mood.color }}></div>
                                {mood.mood}: {mood.count}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Academic Wellness Goals */}
                <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 lg:col-span-2 backdrop-blur-sm shadow-sm transition-all hover:bg-gray-900/60 group">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Target size={20} className="text-violet-400" />
                            Academic Goals
                        </h3>
                        <span className="text-xs font-semibold text-gray-500 hover:text-white cursor-pointer transition-colors">See all</span>
                    </div>
                    <div className="space-y-4">
                        {goals?.data?.slice(0, 3).map(goal => (
                            <div key={goal._id} className="group relative flex items-center justify-between rounded-xl border border-gray-800/80 bg-gray-950/40 p-4 transition hover:border-gray-700 hover:bg-gray-950/60">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => toggleGoalMutation.mutate(goal._id)}
                                        className={cn(
                                            "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                                            goal.isCompleted ? "bg-violet-600 border-violet-600 shadow-lg shadow-violet-900/30" : "border-gray-700 hover:border-violet-500"
                                        )}
                                    >
                                        {goal.isCompleted && <Heart size={12} fill="white" />}
                                    </button>
                                    <div>
                                        <h4 className={cn("text-sm font-bold transition-colors", goal.isCompleted ? "text-gray-500 line-through" : "text-white")}>
                                            {goal.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 font-medium">{goal.description || 'No description provided.'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {goal.deadline && (
                                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-600 group-hover:text-gray-400">
                                            <Calendar size={12} />
                                            {moment(goal.deadline).format('MMM Do')}
                                        </div>
                                    )}
                                    <div className={cn(
                                        "rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-widest",
                                        moment(goal.deadline).isBefore(moment()) ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-gray-800 text-gray-400"
                                    )}>
                                        {goal.type}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {goals?.data?.length === 0 && (
                            <div className="flex flex-col items-center py-8 text-center bg-gray-950/30 rounded-2xl border border-dashed border-gray-800">
                                <div className="p-3 bg-gray-900 rounded-full mb-3">
                                    <AlertCircle className="text-gray-600" />
                                </div>
                                <p className="text-sm text-gray-500 font-medium">You haven't set any wellness goals yet.</p>
                                <button className="mt-3 text-violet-400 text-xs font-bold hover:text-violet-300">Start now</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Wellness Insight Section */}
            <div className="mt-8 rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-900/50 to-violet-900/10 p-8 flex flex-col md:flex-row items-center gap-8 backdrop-blur-md">
                <div className="h-32 w-32 shrink-0 rounded-2xl bg-gray-800 flex items-center justify-center shadow-xl border border-gray-700">
                    <Zap size={48} className="text-violet-400" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-violet-500 text-[10px] font-bold uppercase tracking-widest">AI Insight</span>
                        <h3 className="text-2xl font-bold text-white">Mindful Recommendation</h3>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                        Based on your logs, we noticed stress levels tend to peak on <span className="text-cyan-400 font-semibold">Tuesdays</span> when you have back-to-back algorithms classes. We recommend taking a 15-minute mindful walk between sessions.
                    </p>
                    <div className="mt-6 flex gap-4">
                        <button className="text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors">See full analysis</button>
                        <button className="text-sm font-bold text-gray-500 hover:text-gray-300 transition-colors">Dismiss</button>
                    </div>
                </div>
            </div>

            {/* Footer space */}
            <div className="h-20"></div>
        </div>
    );
};

export default WellnessDashboard;
