import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Users,
    Shield,
    Activity,
    FileText,
    Calendar,
    BarChart3,
    PieChart,
    Settings,
    Search,
    Filter,
    ChevronDown,
    MoreVertical,
    AlertCircle,
    CheckCircle2,
    Database,
    Cpu,
    Zap,
    Flag,
    Ban,
    Trash2,
    History,
    Loader2
} from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart, Bar,
    LineChart, Line,
    XAxis, YAxis,
    CartesianGrid,
    Tooltip,
    AreaChart, Area,
    Legend,
    Cell
} from 'recharts';
import { toast } from 'sonner';
import moment from 'moment';
import { cn } from '@/lib/utils';

// --- Static Meta Stats ---
const STATS_DATA = [
    { label: 'Network Latency', value: '42ms', change: '-12%', icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Active Synapses', value: '2,841', change: '+24%', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Total Manuscript', value: '18,401', change: '+8%', icon: FileText, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'Memory Usage', value: '64%', change: 'Normal', icon: Database, color: 'text-indigo-400', bg: 'bg-indigo-500/10' }
];

const AdminDashboard = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeView, setActiveView] = useState('overview'); // overview, users, logs, settings

    // --- Data Queries ---
    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ['admin', 'users'],
        queryFn: async () => {
            const res = await fetch('/api/admin/users', {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        },
        enabled: activeView === 'users'
    });

    const { data: metrics } = useQuery({
        queryKey: ['admin', 'metrics'],
        queryFn: async () => {
            const res = await fetch('/api/admin/metrics', {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        }
    });

    // --- Computed Data ---
    const filteredUsers = useMemo(() => {
        if (!users?.data) return [];
        return users.data.filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const chartData = useMemo(() => {
        // Mocking user growth metrics for visualization
        return [
            { name: 'Mon', active: 400, requests: 240 },
            { name: 'Tue', active: 600, requests: 139 },
            { name: 'Wed', active: 200, requests: 980 },
            { name: 'Thu', active: 278, requests: 390 },
            { name: 'Fri', active: 189, requests: 480 },
            { name: 'Sat', active: 239, requests: 380 },
            { name: 'Sun', active: 349, requests: 430 },
        ];
    }, []);

    if (usersLoading && activeView === 'users') {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-950">
                <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white selection:bg-orange-500/30">
            {/* Sidebar Branding & Nav */}
            <div className="flex h-screen overflow-hidden">
                <aside className="w-72 shrink-0 border-r border-gray-900 bg-gray-900/40 p-6 backdrop-blur-3xl hidden lg:block overflow-y-auto">
                    <div className="mb-10 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-orange-600 flex items-center justify-center shadow-xl shadow-orange-900/30">
                            <Shield size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tighter italic text-white leading-none">Synapse</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">Master Control</p>
                        </div>
                    </div>

                    <nav className="space-y-4">
                        <h4 className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-600">Core Systems</h4>
                        {[
                            { id: 'overview', label: 'Real-time Metrics', icon: Activity },
                            { id: 'users', label: 'Neural Management', icon: Users },
                            { id: 'logs', label: 'System Archives', icon: History },
                            { id: 'settings', label: 'Architecture Specs', icon: Settings }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id)}
                                className={cn(
                                    "flex w-full items-center gap-4 rounded-2xl p-4 text-sm font-black uppercase tracking-[0.1em] transition-all",
                                    activeView === item.id ? "bg-orange-600 text-white shadow-xl shadow-orange-900/20" : "text-gray-500 hover:bg-gray-800/50 hover:text-white"
                                )}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-20 p-6 rounded-3xl bg-gray-900 border border-gray-800 group cursor-pointer hover:border-orange-500/40 transition">
                        <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4 group-hover:bg-orange-500 transition">
                            <Cpu size={20} className="group-hover:text-white" />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-white mb-2 leading-none">System Healthy</h4>
                        <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase">The cluster is performing within optimal parameters.</p>
                        <div className="mt-4 h-1.5 w-full bg-gray-950 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-600 w-full animate-pulse"></div>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto p-10 bg-[radial-gradient(circle_at_top_right,_#7c2d1215,_transparent)]">
                    {/* Header Row */}
                    <header className="mb-12 flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white leading-none">
                                {activeView === 'overview' ? 'Network Activity' : activeView === 'users' ? 'User Directory' : activeView.toUpperCase()}
                            </h1>
                            <p className="mt-2 text-sm font-bold text-gray-400 capitalize flex items-center gap-2">
                                <Clock size={14} className="text-gray-600" />
                                Updated {moment().format('MMMM Do YYYY, h:mm:ss a')}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search global scope..."
                                    className="rounded-2xl border border-gray-900 bg-gray-900/50 p-4 pl-12 text-sm font-bold text-white placeholder-gray-600 backdrop-blur-md focus:border-orange-500 outline-none transition w-64"
                                />
                            </div>
                            <div className="h-12 w-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center cursor-pointer hover:border-white transition">
                                <Bell size={20} className="text-gray-400" />
                            </div>
                        </div>
                    </header>

                    {/* Meta Stats View */}
                    <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {STATS_DATA.map((stat) => (
                            <div key={stat.label} className="rounded-3xl border border-gray-900 bg-gray-900/20 p-1 backdrop-blur-md group hover:border-gray-800 transition">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center p-2", stat.bg, stat.color)}>
                                            <stat.icon size={20} />
                                        </div>
                                        <span className={cn("text-xs font-black uppercase tracking-widest", stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500')}>
                                            {stat.change}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                                    <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-1 opacity-60">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dashboard Detail Views */}
                    {activeView === 'overview' && (
                        <div className="animate-fade-in space-y-10">
                            {/* Analytics Grid */}
                            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                                <section className="lg:col-span-2 rounded-[3.5rem] border border-gray-900 bg-gray-900/10 p-10 backdrop-blur-md">
                                    <div className="mb-10 flex items-center justify-between">
                                        <h3 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                                            <Activity size={20} className="text-orange-500" />
                                            Active Oscillations (Synapses)
                                        </h3>
                                        <div className="flex gap-2">
                                            <button className="rounded-xl bg-orange-600 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition">Live Feed</button>
                                            <button className="rounded-xl bg-gray-900 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition">Historical</button>
                                        </div>
                                    </div>
                                    <div className="h-[400px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4} />
                                                        <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1c1917" vertical={false} />
                                                <XAxis dataKey="name" stroke="#57534e" tick={{ fill: '#44403c', fontWeight: 700, fontSize: 10 }} axisLine={false} tickLine={false} />
                                                <YAxis hide />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#0c0a09', border: '1px solid #292524', borderRadius: '16px', color: '#fff', fontWeight: 700 }}
                                                    cursor={{ stroke: '#ea580c', strokeWidth: 1 }}
                                                />
                                                <Area type="monotone" dataKey="active" stroke="#ea580c" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                                                <Area type="monotone" dataKey="requests" stroke="#06b6d4" strokeWidth={3} fillOpacity={0} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </section>

                                <section className="rounded-[3.5rem] border border-gray-900 bg-gray-900/10 p-10 backdrop-blur-md flex flex-col justify-between">
                                    <h3 className="text-xl font-black uppercase tracking-tighter italic text-white leading-none">
                                        Neural Health
                                    </h3>
                                    <div className="mt-10 overflow-hidden relative">
                                        <div className="flex flex-col gap-6">
                                            {[
                                                { label: 'Cloud Buffer', val: '80%', color: 'bg-green-500' },
                                                { label: 'Packet Integrity', val: '99%', color: 'bg-cyan-500' },
                                                { label: 'Wait Cycles', val: '12%', color: 'bg-yellow-500' },
                                                { label: 'Overflow Risk', val: '04%', color: 'bg-red-500' }
                                            ].map(h => (
                                                <div key={h.label} className="space-y-2">
                                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                                                        <span>{h.label}</span>
                                                        <span className="text-white">{h.val}</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-gray-950 rounded-full overflow-hidden">
                                                        <div className={cn("h-full rounded-full transition-all duration-1000", h.color)} style={{ width: h.val }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-10 rounded-3xl bg-gray-950 p-6 border border-gray-900 text-center">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 mb-4">Master Diagnosis</p>
                                        <button className="text-orange-500 text-sm font-black uppercase hover:underline">Re-index Neural Paths</button>
                                    </div>
                                </section>
                            </div>

                            {/* Alert Stream */}
                            <section className="rounded-[3.5rem] border border-gray-900 bg-gray-900/10 p-10 backdrop-blur-md">
                                <div className="mb-10 flex items-center justify-between">
                                    <h3 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-3 text-white">
                                        <AlertCircle size={20} className="text-orange-500" />
                                        Critical Alerts & Broadcast
                                    </h3>
                                    <button className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition">Clear Stream</button>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { type: 'error', msg: 'Neural path "Medilink" failed to converge on query #814', time: '2m ago' },
                                        { type: 'warning', msg: 'Unusual spike in blog submissions from subnet 10.42.*', time: '14m ago' },
                                        { type: 'info', msg: 'System backup initiated to segment "Delta-Prime"', time: '1h ago' }
                                    ].map((alert, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-gray-950/40 border-l-4 border border-gray-900 hover:bg-gray-950 transition" style={{ borderLeftColor: alert.type === 'error' ? '#ef4444' : alert.type === 'warning' ? '#f59e0b' : '#3b82f6' }}>
                                            <p className="text-sm font-bold text-gray-400 max-w-2xl">{alert.msg}</p>
                                            <span className="text-[10px] font-black uppercase text-gray-700">{alert.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {activeView === 'users' && (
                        <div className="animate-fade-in">
                            <section className="rounded-[3.5rem] border border-gray-900 bg-gray-900/10 backdrop-blur-md overflow-hidden">
                                <div className="p-10 border-b border-gray-900 bg-gray-900/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <h3 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-3 text-white">
                                        <Users size={20} className="text-orange-500" />
                                        Neural Network (User Directory)
                                    </h3>
                                    <div className="flex gap-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                                            <input
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Filter users..."
                                                className="rounded-xl border border-gray-800 bg-gray-950 p-3 pl-10 text-xs font-bold text-white placeholder-gray-600 outline-none w-48"
                                            />
                                        </div>
                                        <button className="flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-950 px-4 py-2 text-xs font-black uppercase text-gray-500 hover:text-white transition">
                                            <Filter size={14} />
                                            Status
                                        </button>
                                        <button className="flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2 text-xs font-black uppercase text-white shadow-xl shadow-orange-900/20 transition">
                                            Add Node
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 overflow-x-auto">
                                    <table className="w-full text-left border-separate border-spacing-y-4">
                                        <thead>
                                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                                                <th className="px-6 pb-2">User Index</th>
                                                <th className="px-6 pb-2">Access Role</th>
                                                <th className="px-6 pb-2">Integrity Status</th>
                                                <th className="px-6 pb-2">Last Sync</th>
                                                <th className="px-6 pb-2 text-right">Scope Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map(user => (
                                                <tr key={user._id} className="bg-gray-900/40 rounded-3xl overflow-hidden hover:bg-gray-900/60 transition group">
                                                    <td className="px-6 py-6 border-l border-transparent transition first:rounded-l-3xl first:border-l-0">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 rounded-full bg-gray-800 overflow-hidden ring-2 ring-orange-500/10">
                                                                <img src={user.avatar || "/default-avatar.png"} alt="" className="h-full w-full object-cover" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-white">{user.name}</p>
                                                                <p className="text-[10px] font-bold text-gray-600 uppercase italic">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <span className={cn(
                                                            "rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-widest",
                                                            user.role === 'admin' ? "bg-orange-500/20 text-orange-400 border border-orange-500/20" : "bg-gray-800 text-gray-500"
                                                        )}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className={cn("h-2 w-2 rounded-full", user.isEmailVerified ? "bg-green-500" : "bg-yellow-500")}></div>
                                                            <span className="text-xs font-bold text-gray-500 uppercase">{user.isEmailVerified ? 'Verified' : 'Pending'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 italic text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
                                                        {moment(user.createdAt).fromNow()}
                                                    </td>
                                                    <td className="px-6 py-6 text-right last:rounded-r-3xl">
                                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition translate-x-4 group-hover:translate-x-0">
                                                            <button className="p-2 rounded-xl bg-gray-950 border border-gray-800 hover:border-orange-500 text-gray-500 hover:text-white transition"><Flag size={14} /></button>
                                                            <button className="p-2 rounded-xl bg-gray-950 border border-gray-800 hover:border-orange-500 text-gray-500 hover:text-white transition"><Ban size={14} /></button>
                                                            <button className="p-2 rounded-xl bg-gray-950 border border-gray-800 hover:border-red-500 text-gray-500 hover:text-red-500 transition"><Trash2 size={14} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                    )}
                </main>
            </div>

            {/* Global Loader Overlays etc would go here */}
            {activeView === 'settings' && (
                <div className="fixed inset-0 z-[100] bg-gray-950/95 backdrop-blur-3xl p-20 flex flex-col items-center justify-center animate-fade-in text-center">
                    <div className="h-64 w-64 rounded-full bg-orange-600/10 border-4 border-dashed border-orange-600/20 flex items-center justify-center animate-spin-slow mb-12">
                        <Settings size={120} className="text-orange-600/40" />
                    </div>
                    <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">Internal Config Vault</h2>
                    <p className="max-w-xl text-xl font-bold text-gray-500 leading-relaxed uppercase">Accessing the base architecture requires a hardware sync. Connect your master key to proceed.</p>
                    <button
                        onClick={() => setActiveView('overview')}
                        className="mt-12 rounded-3xl bg-white px-12 py-5 text-xl font-black text-black hover:bg-orange-600 hover:text-white transition shadow-2xl"
                    >
                        Return to Control
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
