import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Brain,
    Zap,
    Moon,
    Sun,
    Layout,
    BarChart3,
    CheckCircle2,
    ArrowRight,
    Target,
    Activity,
    Wind,
    Shield,
    Flame,
    Cpu,
    Sparkles,
    AlertCircle,
    TrendingDown,
    TrendingUp,
    MoreHorizontal,
    Heart,
    Star
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    LineChart,
    Line,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// --- DATA MANIFEST ---
const NEURAL_MOCK = {
    INTEGRITY: 88,
    HISTORICAL_FLUX: [
        { day: 'Mon', stress: 60, focus: 85, sleep: 7.5 },
        { day: 'Tue', stress: 75, focus: 70, sleep: 6.0 },
        { day: 'Wed', stress: 50, focus: 90, sleep: 8.5 },
        { day: 'Thu', stress: 80, focus: 65, sleep: 5.5 },
        { day: 'Fri', stress: 40, focus: 95, sleep: 7.0 },
        { day: 'Sat', stress: 25, focus: 80, sleep: 9.5 },
        { day: 'Sun', stress: 35, focus: 88, sleep: 8.0 }
    ],
    NODES: [
        { id: 'n1', title: 'Cerebral Recharge', desc: '90min meditative state', icon: Moon, active: true },
        { id: 'n2', title: 'Knowledge Intake', desc: 'Read 3 academic journals', icon: Brain, active: false },
        { id: 'n3', title: 'System Flush', desc: 'High intensity cardio', icon: Flame, active: true }
    ]
};

/**
 * @component StatCollector
 * @description Renders a biometric stat node with trend analysis.
 */
const StatCollector = ({ label, value, icon: Icon, trend, color }) => (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-gray-900 bg-gray-950/40 p-10 transition-all hover:bg-black">
        <div className={cn("absolute -right-8 -top-8 h-40 w-40 blur-[80px] opacity-10", color)}></div>
        <div className="flex items-center justify-between mb-8">
            <div className={cn("p-5 rounded-[1.5rem] shadow-2xl border border-white/5", color)}>
                <Icon size={28} className="text-white" />
            </div>
            {trend && (
                <div className={cn("text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full", trend > 0 ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500")}>
                    {trend > 0 ? '+' : ''}{trend}%
                </div>
            )}
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-700 leading-none mb-3">{label}</p>
        <h4 className="text-5xl font-black text-white italic tracking-tighter">{value}</h4>
    </div>
);

/**
 * @component FluxEngine
 * @description Advanced visualization for biometric temporal data.
 */
const FluxEngine = ({ logs }) => (
    <div className="mt-12 rounded-[4rem] border border-gray-900 bg-black/20 p-16 shadow-[0_0_100px_-20px_rgba(0,0,0,0.8)]">
        <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <div>
                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Oscillation Flux</h3>
                <p className="max-w-md text-sm font-bold text-gray-600 uppercase tracking-widest leading-relaxed">
                    Analyzing temporal variance across <span className="text-white">Neural Load</span> and <span className="text-cyan-500">Focus Density</span>.
                </p>
            </div>
            <div className="flex gap-10">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Focus Level</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Stress Magnitude</span>
                </div>
            </div>
        </div>
        <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={logs}>
                    <defs>
                        <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#111827" vertical={false} />
                    <XAxis dataKey="day" stroke="#374151" fontSize={11} fontWeight="900" tickLine={false} axisLine={false} dy={15} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#020617', border: '1px solid #1f2937', borderRadius: '1.5rem', padding: '1rem' }}
                        itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}
                        cursor={{ stroke: '#06b6d4', strokeWidth: 1 }}
                    />
                    <Area type="monotone" dataKey="focus" stroke="#06b6d4" strokeWidth={5} fillOpacity={1} fill="url(#focusGradient)" animationDuration={2000} />
                    <Area type="monotone" dataKey="stress" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#stressGradient)" strokeDasharray="10 10" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const WellnessDashboard = () => {
    const queryClient = useQueryClient();
    const [viewFilter, setViewFilter] = useState('summary');

    const { data: metrics, isLoading } = useQuery({
        queryKey: ['neural-wellness-v4'],
        queryFn: async () => {
            const res = await fetch('/api/user/wellness', {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        }
    });

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-950">
                <div className="relative h-24 w-24">
                    <Activity className="h-full w-full text-cyan-500 animate-[spin_4s_linear_infinite] opacity-10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Brain className="h-8 w-8 text-cyan-400 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 p-8 text-white md:p-14 lg:p-24 selection:bg-cyan-500/30 font-sans">
            {/* Command Header */}
            <header className="mb-24 flex flex-col justify-between gap-16 md:flex-row md:items-end">
                <div className="flex items-center gap-12">
                    <div className="relative group p-1">
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-white text-black flex items-center justify-center rounded-[1.5rem] shadow-2xl">
                                <Sparkles size={32} />
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-none">Neural <br /> <span className="text-cyan-500">Nexus</span></h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700">Manifold Hub v4.0</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 border border-gray-900 rounded-[2rem] p-2 bg-black/40">
                    {['summary', 'analytics', 'temporal'].map(f => (
                        <button
                            key={f}
                            onClick={() => setViewFilter(f)}
                            className={cn(
                                "rounded-2xl px-10 py-4 text-[11px] font-black uppercase tracking-widest transition-all",
                                viewFilter === f ? "bg-white text-black shadow-3xl scale-105" : "text-gray-500 hover:text-white"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </header>

            {/* Tactical Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
                {/* Control Column */}
                <div className="lg:col-span-1 space-y-16">
                    <section className="rounded-[4rem] border border-gray-900 bg-gray-900/10 p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
                            <Target size={140} />
                        </div>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-10 leading-none">Integrity Index</h3>
                        <div className="flex items-end gap-5 mb-12">
                            <span className="text-9xl font-black italic tracking-tighter text-cyan-400 leading-none">{NEURAL_MOCK.INTEGRITY}</span>
                            <span className="text-sm font-black text-gray-700 uppercase tracking-widest pb-4">Status: Max</span>
                        </div>
                        <div className="h-4 w-full bg-gray-950 rounded-full overflow-hidden border border-gray-900 p-1">
                            <div
                                className="h-full bg-gradient-to-r from-cyan-600 via-indigo-600 to-rose-600 rounded-full"
                                style={{ width: `${NEURAL_MOCK.INTEGRITY}%` }}
                            ></div>
                        </div>
                        <p className="mt-10 text-[11px] font-black text-gray-600 uppercase leading-relaxed tracking-widest">
                            Synaptic coherence verified. Your mental load is optimized for the next 4 academic cycles.
                        </p>
                    </section>

                    <section className="space-y-8">
                        <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-[0.6em] px-4">Neural Nodes</h3>
                        {NEURAL_MOCK.NODES.map(node => (
                            <div key={node.id} className="group flex items-center justify-between rounded-[2.5rem] border border-gray-900 bg-gray-900/5 p-8 transition-all hover:bg-white/5 cursor-pointer">
                                <div className="flex items-center gap-6">
                                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl transition-transform group-hover:scale-110", node.active ? "bg-cyan-500 text-white" : "bg-gray-950 text-gray-700")}>
                                        <node.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white uppercase italic tracking-tighter leading-none mb-1">{node.title}</h4>
                                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{node.desc}</p>
                                    </div>
                                </div>
                                <div className={cn("h-2 w-2 rounded-full", node.active ? "bg-cyan-500 shadow-[0_0_10px_#06b6d4]" : "bg-gray-800")}></div>
                            </div>
                        ))}
                    </section>
                </div>

                {/* Main Data Cluster */}
                <div className="lg:col-span-3 space-y-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <StatCollector
                            label="Cognitive Saturation"
                            value="Low"
                            icon={Shield}
                            trend={-15}
                            color="bg-emerald-600"
                        />
                        <StatCollector
                            label="Sleep Frequency"
                            value="7.5h"
                            icon={Moon}
                            trend={8}
                            color="bg-indigo-600"
                        />
                    </div>

                    <FluxEngine logs={NEURAL_MOCK.HISTORICAL_FLUX} />

                    <div className="rounded-[5rem] border border-gray-900 bg-gradient-to-br from-gray-950 via-black to-indigo-950/20 p-20 flex flex-col md:flex-row items-center gap-20 relative overflow-hidden group">
                        <div className="absolute -bottom-32 -right-32 h-80 w-80 bg-cyan-500/10 blur-[120px] group-hover:bg-cyan-500/20 transition-all"></div>
                        <div className="h-32 w-32 shrink-0 bg-white rounded-[3rem] flex items-center justify-center text-black shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                            <Star size={56} className="animate-pulse" />
                        </div>
                        <div className="flex-1 space-y-8">
                            <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">Refraction Protocol</h3>
                            <p className="text-gray-500 text-2xl font-medium leading-relaxed italic border-l-8 border-cyan-900 pl-12">
                                System analysis suggest a <span className="text-white font-bold">92% probability</span> of cognitive bottleneck tomorrow during the database lecture.
                                We've queued an <span className="text-cyan-400 font-bold">Optimization Protocol</span> for 07:30.
                            </p>
                        </div>
                        <Button className="rounded-[2rem] bg-cyan-600 px-16 py-10 text-xs font-black uppercase tracking-[0.2em] shadow-3xl hover:bg-cyan-500 hover:scale-105 active:scale-95 transition-all">
                            Initialize Sync
                        </Button>
                    </div>
                </div>
            </div>

            <footer className="mt-40 pt-20 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex items-center gap-6">
                    <div className="h-4 w-4 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-800">Neural Nexus System Online</span>
                </div>
                <div className="flex gap-16 text-[10px] font-black uppercase tracking-widest text-gray-800">
                    <span className="hover:text-white transition-colors cursor-pointer">Protocol Logs</span>
                    <span className="hover:text-white transition-colors cursor-pointer">Privacy Node</span>
                    <span>© 41229_v40</span>
                </div>
            </footer>
        </div>
    );
};

export default WellnessDashboard;
