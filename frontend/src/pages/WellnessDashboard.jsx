import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
    Star,
    Monitor,
    ShieldAlert,
    Waves,
    Database,
    ZapOff,
    Terminal
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
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// --- QUANTUM MANIFOLD DATA ---
const QUANTUM_MOCK = {
    INTEGRITY: 94,
    OSCILLATION: [
        { time: '00:00', load: 15, sync: 98, pulse: 60 },
        { time: '04:00', load: 25, sync: 92, pulse: 55 },
        { time: '08:00', load: 65, sync: 85, pulse: 75 },
        { time: '12:00', load: 95, sync: 70, pulse: 90 },
        { time: '16:00', load: 80, sync: 78, pulse: 85 },
        { time: '20:00', load: 45, sync: 90, pulse: 70 },
        { time: '23:59', load: 20, sync: 96, pulse: 62 }
    ],
    NODES: [
        { id: 'q1', name: 'Neural Link Beta', status: 'Stable', load: 12, icon: Zap },
        { id: 'q2', name: 'Synapse Core Alpha', status: 'Peak', load: 85, icon: Cpu },
        { id: 'q3', name: 'Shield Protocol 7', status: 'Optimal', load: 24, icon: Shield }
    ]
};

/**
 * @component QuantumStatNode
 * @description High-fidelity biometric stat node for the Quantum Manifold.
 */
const QuantumStatNode = ({ label, value, icon: Icon, trend, color, subtext }) => (
    <div className="group relative overflow-hidden rounded-[3rem] border border-gray-900 bg-gray-950/40 p-12 transition-all hover:bg-black hover:border-cyan-500/20 shadow-2xl">
        <div className={cn("absolute -right-12 -top-12 h-56 w-56 blur-[100px] opacity-10", color)}></div>
        <div className="flex items-center justify-between mb-10">
            <div className={cn("p-6 rounded-[2rem] shadow-3xl border border-white/5", color)}>
                <Icon size={32} className="text-white" />
            </div>
            {trend && (
                <div className={cn("text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-white/5", trend > 0 ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500")}>
                    {trend > 0 ? '+' : ''}{trend}% Variance
                </div>
            )}
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 leading-none mb-4">{label}</p>
        <h4 className="text-6xl font-black text-white italic tracking-tighter leading-none mb-4">{value}</h4>
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{subtext}</p>
    </div>
);

/**
 * @component SynapticFluxEngine
 * @description Advanced temporal visualization for the Quantum Manifold.
 */
const SynapticFluxEngine = ({ data }) => (
    <div className="mt-16 rounded-[5rem] border border-gray-900 bg-black/40 p-20 shadow-[0_0_120px_-30px_rgba(0,0,0,0.9)] relative overflow-hidden group">
        <div className="absolute top-0 left-0 p-20 opacity-5 rotate-[-12deg] group-hover:rotate-0 transition-all duration-1000 scale-150">
            <Waves size={240} className="text-cyan-500" />
        </div>
        <div className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative z-10">
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="h-1 w-12 bg-cyan-500"></div>
                    <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.8em]">System Flux Node 0xA-94</span>
                </div>
                <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">Synaptic Oscillation</h3>
                <p className="max-w-xl text-sm font-bold text-gray-600 uppercase tracking-widest leading-relaxed italic border-l-4 border-gray-900 pl-8">
                    Analyzing temporal variance across <span className="text-white">Neural Load</span>, <span className="text-indigo-400">Sync Stability</span>, and <span className="text-rose-400">Pulse Frequency</span>.
                </p>
            </div>
            <div className="flex gap-12 bg-gray-950/40 p-6 rounded-[2rem] border border-gray-900">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_#06b6d4]"></div>
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Neural Load</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Sync Integrity</span>
                </div>
            </div>
        </div>
        <div className="h-[500px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="syncGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="5 5" stroke="#111827" vertical={false} />
                    <XAxis dataKey="time" stroke="#374151" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} dy={20} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#020617', border: '1px solid #1f2937', borderRadius: '2rem', padding: '1.5rem', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                        cursor={{ stroke: '#06b6d4', strokeWidth: 2, strokeDasharray: '10 10' }}
                    />
                    <Area type="monotone" dataKey="load" stroke="#06b6d4" strokeWidth={6} fillOpacity={1} fill="url(#loadGrad)" animationDuration={3000} />
                    <Area type="monotone" dataKey="sync" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#syncGrad)" strokeDasharray="10 5" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const WellnessDashboard = () => {
    const queryClient = useQueryClient();
    const [viewFilter, setViewFilter] = useState('quantum');

    // --- Neural Telemetry Fetching ---
    const { data: metrics, isLoading } = useQuery({
        queryKey: ['quantum-wellness-v5'],
        queryFn: async () => {
            const res = await fetch('/api/user/wellness', {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        }
    });

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-950 overflow-hidden relative">
                <div className="absolute inset-x-0 h-[1px] bg-cyan-600/10 top-1/2"></div>
                <div className="absolute inset-y-0 w-[1px] bg-cyan-600/10 left-1/2"></div>
                <div className="relative group text-center space-y-8">
                    <div className="h-32 w-32 border-8 border-gray-900 border-t-cyan-500 rounded-full animate-spin flex items-center justify-center shadow-[0_0_80px_rgba(6,182,212,0.2)]">
                        <Monitor size={48} className="text-cyan-400 animate-pulse" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[1em] text-gray-800 animate-pulse">Initializing Neural Link...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 p-10 text-white md:p-16 lg:p-24 selection:bg-cyan-500/30 overflow-x-hidden font-sans">
            {/* Command Header Matrix */}
            <header className="mb-32 flex flex-col justify-between gap-20 md:flex-row md:items-end p-12 bg-gray-900/10 rounded-[3rem] border border-gray-900 shadow-3xl relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 h-80 w-80 bg-cyan-500/5 blur-[100px] group-hover:bg-cyan-500/10 transition-all duration-700"></div>
                <div className="flex items-center gap-12 relative z-10">
                    <div className="h-24 w-24 bg-white text-black flex items-center justify-center rounded-[2rem] shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform duration-500">
                        <Sparkles size={48} className="animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.8em] text-cyan-500">System Manifold v5.2</span>
                        </div>
                        <h1 className="text-8xl font-black tracking-tighter uppercase italic leading-none">Quantum <br /> <span className="text-cyan-500">Nexus</span></h1>
                    </div>
                </div>

                <div className="flex gap-4 border border-gray-900 rounded-[2rem] p-3 bg-black/50 relative z-10 backdrop-blur-3xl shadow-2xl">
                    {['quantum', 'telemetry', 'historical'].map(f => (
                        <button
                            key={f}
                            onClick={() => setViewFilter(f)}
                            className={cn(
                                "rounded-2xl px-12 py-5 text-[11px] font-black uppercase tracking-widest transition-all",
                                viewFilter === f ? "bg-white text-black shadow-3xl scale-105" : "text-gray-500 hover:text-white"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </header>

            {/* Tactical Grid Manifold */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-20">
                {/* Lateral Control Column */}
                <div className="lg:col-span-1 space-y-20">
                    <section className="rounded-[4rem] border border-gray-900 bg-gray-900/10 p-12 relative overflow-hidden group hover:border-cyan-500/20 transition-all">
                        <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                            <Target size={180} />
                        </div>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-12 italic leading-none">Integrity Manifold</h3>
                        <div className="flex items-end gap-6 mb-16">
                            <span className="text-[10rem] font-black italic tracking-tighter text-cyan-400 leading-[0.8]">{QUANTUM_MOCK.INTEGRITY}</span>
                            <div className="pb-4 space-y-2">
                                <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest block">Status: Max_Peak</span>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Coherence Active</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-5 w-full bg-gray-950 rounded-full overflow-hidden border border-gray-900 p-1 shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-cyan-600 via-indigo-600 to-rose-600 rounded-full animate-pulse"
                                style={{ width: `${QUANTUM_MOCK.INTEGRITY}%` }}
                            ></div>
                        </div>
                        <p className="mt-12 text-[11px] font-black text-gray-600 uppercase leading-relaxed tracking-[0.2em] italic border-l-4 border-gray-900 pl-8">
                            Synaptic resonance is optimal. All biometric nodes are firing within nominal parameters. Predicted cognitive delta: <span className="text-white">+12%</span>.
                        </p>
                    </section>

                    <section className="space-y-10">
                        <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-[1em] px-6">Quantum Nodes</h3>
                        <div className="space-y-6">
                            {QUANTUM_MOCK.NODES.map(node => (
                                <div key={node.id} className="group flex items-center justify-between rounded-[3rem] border border-gray-900 bg-gray-900/5 p-10 transition-all hover:bg-white/5 hover:border-cyan-500/20 cursor-pointer shadow-xl">
                                    <div className="flex items-center gap-8">
                                        <div className="h-16 w-16 rounded-[1.5rem] bg-gray-950 flex items-center justify-center border border-white/5 shadow-2xl transition-all group-hover:bg-cyan-500 group-hover:text-white group-hover:scale-110">
                                            <node.icon size={28} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-white uppercase italic tracking-tighter leading-none mb-2">{node.name}</h4>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Load: {node.load}%</span>
                                                <div className="h-1 w-8 bg-gray-900 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gray-700 w-full" style={{ width: `${node.load}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                        {node.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Central Data Stream */}
                <div className="lg:col-span-3 space-y-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <QuantumStatNode
                            label="Neural Saturation"
                            value="Minimal"
                            icon={Waves}
                            trend={-22}
                            color="bg-emerald-600"
                            subtext="Index: 0.24-Delta"
                        />
                        <QuantumStatNode
                            label="Sleep Frequency"
                            value="8.2h"
                            icon={Moon}
                            trend={12}
                            color="bg-indigo-600"
                            subtext="Deep Sleep: 3.5h"
                        />
                    </div>

                    <SynapticFluxEngine data={QUANTUM_MOCK.OSCILLATION} />

                    <div className="rounded-[6rem] border border-gray-900 bg-gradient-to-br from-gray-950 via-black to-cyan-950/20 p-24 flex flex-col lg:flex-row items-center gap-24 relative overflow-hidden group shadow-[0_0_100px_rgba(6,182,212,0.1)]">
                        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] bg-cyan-500/5 blur-[150px] group-hover:bg-cyan-500/10 transition-all duration-1000"></div>
                        <div className="h-40 w-40 shrink-0 bg-white rounded-[3.5rem] flex items-center justify-center text-black shadow-3xl hover:rotate-12 transition-transform duration-700">
                            <Star size={72} className="animate-pulse" />
                        </div>
                        <div className="flex-1 space-y-10 relative z-10">
                            <h3 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">Quantum Prediction</h3>
                            <p className="text-gray-500 text-3xl font-medium leading-relaxed italic border-l-8 border-cyan-900 pl-16">
                                The system anticipates a <span className="text-white font-black">94% probability</span> of high-focus resonance during the next academic cycle.
                                A <span className="text-cyan-400 font-bold uppercase tracking-widest">Neural Calibration</span> has been queued for 08:00 tomorrow.
                            </p>
                            <div className="flex gap-8">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">Confidence</span>
                                    <div className="h-1.5 w-32 bg-gray-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-cyan-600 w-[94%] shadow-[0_0_10px_#0891b2]"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">Risk Factor</span>
                                    <div className="h-1.5 w-32 bg-gray-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-rose-600 w-[12%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button className="rounded-[2.5rem] bg-cyan-600 px-20 py-12 text-sm font-black uppercase tracking-[0.3em] shadow-3xl hover:bg-cyan-500 hover:scale-105 active:scale-95 transition-all relative z-10">
                            Synchronize Manifold
                        </Button>
                    </div>
                </div>
            </div>

            <footer className="mt-40 pt-24 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="flex items-center gap-8 bg-gray-900/10 px-8 py-4 rounded-full border border-gray-900">
                    <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-800">Neural Nexus System Kernel Online</span>
                </div>
                <div className="flex gap-20 text-[10px] font-black uppercase tracking-[0.2em] text-gray-800">
                    <span className="hover:text-white transition-colors cursor-pointer italic">Diagnostic Logs</span>
                    <span className="hover:text-white transition-colors cursor-pointer italic">Security Shell</span>
                    <span className="text-gray-900">v5.2.1-Quantum</span>
                </div>
            </footer>
        </div>
    );
};

export default WellnessDashboard;
