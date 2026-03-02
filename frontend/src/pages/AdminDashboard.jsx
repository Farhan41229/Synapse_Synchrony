import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Activity,
    Users,
    Zap,
    Cpu,
    Shield,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    Search,
    Filter,
    MoreHorizontal,
    TrendingUp,
    TrendingDown,
    Clock,
    Database,
    Lock,
    Eye,
    Bell,
    Settings,
    History,
    Rocket
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { toast } from 'sonner';
import moment from 'moment';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// --- Dashboard Component ---
const AdminDashboard = () => {
    const queryClient = useQueryClient();
    const [activeSector, setActiveSector] = useState('Central');

    // --- Performance Stats Data ---
    const stats = [
        { label: 'Active Nexus Nodes', value: '2,841', change: '+24%', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        { label: 'User Pulsations', value: '12.4k', change: '+12%', icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        { label: 'System Coherence', value: '98.2%', change: '+0.4%', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Neural Throughput', value: '42ms', change: '-4ms', icon: Cpu, color: 'text-violet-400', bg: 'bg-violet-500/10' }
    ];

    return (
        <div className="min-h-screen bg-gray-950 p-8 text-white md:p-14 selection:bg-cyan-500/30">
            {/* Admin Header Matrix */}
            <header className="mb-20 flex flex-col justify-between gap-10 md:flex-row md:items-end p-12 bg-gray-900/10 rounded-[3rem] border border-gray-900 shadow-3xl backdrop-blur-3xl">
                <div className="flex items-center gap-10">
                    <div className="rounded-[2.5rem] bg-indigo-600/10 p-8 text-indigo-400 shadow-2xl border border-indigo-500/20">
                        <Shield size={56} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-black uppercase tracking-tighter italic text-white leading-none">Nexus</h2>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                        <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">Guardian</h1>
                        <p className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-gray-700">
                             Overwatch Protocol: Active
                        </p>
                    </div>
                </div>

                <div className="flex gap-6">
                    <Button variant="outline" className="rounded-2xl border-gray-800 bg-gray-950 px-10 py-8 text-xs font-black uppercase tracking-widest text-white hover:bg-gray-800 transition-all hover:scale-105">
                        Historical Logs
                    </Button>
                    <Button className="rounded-2xl bg-indigo-600 px-10 py-8 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-500 shadow-3xl hover:scale-105 transition-all">
                        Neural Reset
                    </Button>
                </div>
            </header>

            {/* Tactical Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-20">
                {stats.map((stat, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-[3rem] border border-gray-900 bg-gray-900/10 p-12 transition-all hover:bg-black hover:border-indigo-500/20">
                        <div className={cn("absolute -right-8 -top-8 h-48 w-48 blur-[100px] opacity-10", stat.bg)}></div>
                        <div className="flex items-center justify-between mb-10">
                            <div className={cn("p-5 rounded-2xl shadow-2xl border border-white/5", stat.bg, stat.color)}>
                                <stat.icon size={28} />
                            </div>
                            <span className={cn("text-[10px] font-black uppercase px-4 py-2 rounded-full border border-white/5", stat.change.includes('+') ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")}>
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-700 leading-none mb-3">{stat.label}</p>
                        <h4 className="text-5xl font-black text-white italic tracking-tighter leading-none">{stat.value}</h4>
                    </div>
                ))}
            </div>

            {/* Main Overwatch Field */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 space-y-16">
                    <div className="rounded-[4rem] border border-gray-900 bg-black/40 p-16 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                        <div className="mb-16 flex items-center justify-between">
                            <div>
                                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">Neural Pulse Analysis</h3>
                                <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">Real-time engagement variance across Global Sectors</p>
                            </div>
                            <div className="flex gap-6">
                                <Activity size={32} className="text-indigo-500 animate-pulse" />
                            </div>
                        </div>
                        <div className="h-[500px] w-full bg-gray-950/20 rounded-[3rem] border border-gray-900 flex flex-col items-center justify-center text-gray-800 font-black uppercase tracking-[0.5em] text-xs italic gap-8 p-20">
                            <div className="flex gap-4">
                                {[...Array(24)].map((_, i) => (
                                    <div key={i} className="w-2 bg-gray-900 rounded-full h-24 group-hover:bg-indigo-500 transition-colors" style={{ height: `${Math.random() * 100}%` }}></div>
                                ))}
                            </div>
                            <span>Awaiting Telemetry Sync...</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-16">
                    <div className="rounded-[4rem] border border-gray-900 bg-gray-900/10 p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                             <Rocket size={160} />
                        </div>
                        <h3 className="text-xs font-black text-gray-700 uppercase tracking-[0.6em] mb-12 px-2">Operational Integrity</h3>
                        <div className="space-y-12">
                            {[
                                { node: 'Auth-Alpha', status: 'Optimal', load: '12%' },
                                { node: 'Sync-Beta', status: 'Stable', load: '45%' },
                                { node: 'Data-Gamma', status: 'Peak', load: '88%' }
                            ].map((n, i) => (
                                <div key={i} className="flex flex-col gap-4 p-8 rounded-[2rem] border border-gray-900 bg-black/40 hover:border-indigo-500/30 transition-all cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-xs font-black text-white uppercase tracking-widest italic">{n.node}</h5>
                                        <span className="text-[10px] font-black uppercase text-emerald-500">{n.status}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-950 rounded-full overflow-hidden border border-gray-900">
                                        <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: n.load }}></div>
                                    </div>
                                    <div className="flex justify-between text-[8px] font-black text-gray-700 uppercase tracking-widest">
                                        <span>Node Saturation</span>
                                        <span>{n.load}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <footer className="mt-40 pt-20 border-t border-gray-900 flex justify-between items-center">
                <p className="text-[10px] font-black uppercase tracking-[1.5em] text-gray-800">GUARDIAN_OVERWATCH_v4.2.1</p>
                <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-gray-800">
                    <span className="hover:text-white transition-colors cursor-pointer">System Manifest</span>
                    <span className="hover:text-white transition-colors cursor-pointer">Security Protocol</span>
                    <span>© 41229_v40</span>
                </div>
            </footer>
        </div>
    );
};

export default AdminDashboard;
