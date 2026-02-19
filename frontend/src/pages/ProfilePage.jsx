import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    User,
    Mail,
    IdCard,
    Camera,
    Lock,
    Shield,
    Settings,
    LogOut,
    Bell,
    Eye,
    Globe,
    Github,
    Twitter,
    Linkedin,
    Trash2,
    CheckCircle2,
    Clock,
    ShieldCheck,
    CreditCard,
    Smartphone,
    Save,
    X,
    Loader2,
    Sparkles,
    Activity,
    Wind,
    Flame,
    Cpu,
    Target,
    Zap,
    ShieldAlert
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import moment from 'moment';
import { Button } from '@/components/ui/button';

/**
 * @component ProfilePage
 * @description Advanced Neural Identity Manifold.
 * Manages user synaptic profile, security nodes, and global sector clearance.
 */
const ProfilePage = () => {
    const queryClient = useQueryClient();
    const [isCalibrating, setIsCalibrating] = useState(false);
    const [activeSector, setActiveSector] = useState('identity');

    // --- FORM BUFFER STATE ---
    const [buffer, setBuffer] = useState({
        name: '',
        bio: '',
        website: '',
        github: '',
        twitter: '',
        linkedin: ''
    });

    // --- NEURAL DATA SYNC ---
    const { data: profile, isLoading } = useQuery({
        queryKey: ['neural-identity-v5'],
        queryFn: async () => {
            const res = await fetch('/api/profile', {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            if (!res.ok) throw new Error('Identity Link Fragmented');
            return res.json();
        }
    });

    useEffect(() => {
        if (profile?.data) {
            setBuffer({
                name: profile.data.name || '',
                bio: profile.data.bio || '',
                website: profile.data.website || '',
                github: profile.data.github || '',
                twitter: profile.data.twitter || '',
                linkedin: profile.data.linkedin || ''
            });
        }
    }, [profile]);

    // --- CALIBRATION MUTATION ---
    const calibrateMutation = useMutation({
        mutationFn: async (payload) => {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(payload)
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['neural-identity-v5']);
            setIsCalibrating(false);
            toast.success('Identity Calibration Complete');
        }
    });

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-950 overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#4f46e510_0%,_transparent_70%)] animate-pulse"></div>
                <div className="relative group text-center space-y-10">
                    <div className="h-24 w-24 border-8 border-gray-900 border-t-indigo-600 rounded-full animate-spin mx-auto flex items-center justify-center shadow-[0_0_80px_rgba(79,70,229,0.2)]">
                        <Cpu size={32} className="text-indigo-400" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[1em] text-gray-800 animate-pulse">Synchronizing Neural Identity...</p>
                </div>
            </div>
        );
    }

    const userData = profile.data;

    return (
        <div className="min-h-screen bg-gray-950 text-white selection:bg-indigo-500/30 pb-40 font-sans">
            {/* Sector Header Matrix */}
            <div className="h-72 w-full bg-black relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-black opacity-80"></div>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '60px 60px' }}></div>
                <div className="absolute -bottom-20 -right-20 h-96 w-96 bg-indigo-500/10 blur-[150px] group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
                <div className="h-full w-full flex items-center justify-center p-24 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000 scale-150">
                    <Activity size={400} />
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-8 relative -mt-32">
                {/* Identity Cluster Node */}
                <header className="mb-20 flex flex-col items-center gap-12 rounded-[4rem] border border-gray-900 bg-gray-950/60 p-16 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] md:flex-row md:items-end md:justify-between group">
                    <div className="flex flex-col items-center gap-12 md:flex-row md:items-end">
                        {/* Biometric Portrait */}
                        <div className="relative h-56 w-56 shrink-0 rounded-[3.5rem] border-8 border-gray-950 bg-gray-900 shadow-3xl overflow-hidden ring-4 ring-indigo-500/20 group/avatar">
                            <img src={userData.avatar || "/default-avatar.png"} alt={userData.name} className="h-full w-full object-cover transition duration-1000 group-hover/avatar:scale-125 grayscale hover:grayscale-0" />
                            <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/40 backdrop-blur-sm opacity-0 transition-all group-hover/avatar:opacity-100 cursor-pointer">
                                <Camera className="text-white animate-pulse" size={48} />
                            </div>
                        </div>

                        <div className="text-center md:text-left space-y-4">
                            <div className="flex items-center gap-4 justify-center md:justify-start">
                                <h1 className="text-7xl font-black tracking-tighter uppercase italic text-white flex items-center gap-4 leading-none">
                                    {userData.name}
                                </h1>
                                {userData.isEmailVerified && <ShieldCheck size={40} className="text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]" />}
                            </div>
                            <p className="text-2xl font-bold text-gray-700 italic border-l-4 border-gray-900 pl-8">{userData.role || "Synaptic Architect"} • <span className="text-gray-500 font-medium">{userData.email}</span></p>
                            <div className="flex flex-wrap justify-center gap-6 md:justify-start pt-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-800 mb-1">Sector Entry</span>
                                    <span className="text-sm font-black text-white italic">{moment(userData.createdAt).format('MMMM.YYYY')}</span>
                                </div>
                                <div className="flex flex-col border-l border-gray-900 pl-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-800 mb-1">Pulse Rank</span>
                                    <span className="text-sm font-black text-indigo-400 italic">Global-Nexus #0xA94</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-6 pb-4 relative z-10">
                        {isCalibrating ? (
                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsCalibrating(false)}
                                    className="rounded-2xl border-gray-800 bg-gray-950 px-10 py-8 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white"
                                >
                                    <X size={20} /> Abort
                                </Button>
                                <Button
                                    onClick={() => calibrateMutation.mutate(buffer)}
                                    className="rounded-2xl bg-indigo-600 px-10 py-8 text-xs font-black uppercase tracking-widest text-white shadow-3xl hover:bg-indigo-500"
                                >
                                    <Save size={20} /> Finalize Calibration
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={() => setIsCalibrating(true)}
                                className="rounded-[2.5rem] bg-white text-black px-12 py-10 text-xs font-black uppercase italic tracking-[0.2em] shadow-3xl hover:bg-indigo-500 hover:text-white transition-all scale-110"
                            >
                                <Settings size={20} /> Calibrate Core
                            </Button>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* Lateral Navigation Terminal */}
                    <aside className="lg:col-span-3 space-y-20">
                        <section className="bg-gray-900/10 rounded-[3.5rem] border border-gray-900 p-8 shadow-3xl">
                            <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-[0.8em] text-center mb-10 leading-none">System_Nodes</h3>
                            <nav className="space-y-4">
                                {[
                                    { id: 'identity', label: 'Identity Protocol', icon: User },
                                    { id: 'security', label: 'Guardian Shell', icon: Shield },
                                    { id: 'telemetry', label: 'Alert Synapses', icon: Bell },
                                    { id: 'manuscript', label: 'Data Registry', icon: IdCard }
                                ].map((node) => (
                                    <button
                                        key={node.id}
                                        onClick={() => setActiveSector(node.id)}
                                        className={cn(
                                            "flex w-full items-center justify-between rounded-2xl p-6 text-xs font-black uppercase tracking-[0.2em] transition-all italic border border-transparent",
                                            activeSector === node.id ? "bg-indigo-600 text-white shadow-3xl scale-105" : "text-gray-700 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <node.icon size={20} />
                                            {node.label}
                                        </div>
                                    </button>
                                ))}
                            </nav>
                            <Button className="w-full mt-10 rounded-2xl bg-rose-600/10 text-rose-500 border border-rose-600/20 py-8 text-xs font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                                <LogOut size={20} /> Terminate
                            </Button>
                        </section>

                        <section className="rounded-[3rem] bg-gradient-to-br from-indigo-950/40 via-black to-transparent p-12 border border-gray-900 shadow-3xl">
                            <Zap size={48} className="text-indigo-500 mb-10 animate-pulse" />
                            <h4 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-4">Neural Health</h4>
                            <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest leading-relaxed">Identity coherence verified. Encryption level: Omega-7.</p>
                            <div className="h-1.5 w-full bg-gray-950 rounded-full overflow-hidden border border-gray-800 mt-8">
                                <div className="h-full bg-indigo-500 w-[98%] shadow-[0_0_10px_#6366f1]"></div>
                            </div>
                        </section>
                    </aside>

                    {/* Primary Manifold Section */}
                    <main className="lg:col-span-9 space-y-20">
                        {activeSector === 'identity' && (
                            <div className="space-y-16 animate-in fade-in slide-in-from-right-10 duration-1000">
                                {/* Administrative Details */}
                                <section className="rounded-[4rem] border border-gray-900 bg-gray-900/5 p-16 shadow-3xl">
                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-12 flex items-center gap-6">
                                        <IdCard size={32} className="text-indigo-500" />
                                        Administrative Abstract
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-800">Biological Identifier</label>
                                            {isCalibrating ? (
                                                <input
                                                    type="text"
                                                    value={buffer.name}
                                                    onChange={(e) => setBuffer({ ...buffer, name: e.target.value })}
                                                    className="w-full rounded-2xl bg-black border border-indigo-500/30 p-6 text-white text-lg font-black italic uppercase italic tracking-tighter focus:border-indigo-500 outline-none transition shadow-inner"
                                                />
                                            ) : (
                                                <p className="text-5xl font-black italic italic tracking-tighter text-white uppercase">{userData.name}</p>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-800">Cerebral Abstract (Bio)</label>
                                            {isCalibrating ? (
                                                <textarea
                                                    rows={4}
                                                    value={buffer.bio}
                                                    onChange={(e) => setBuffer({ ...buffer, bio: e.target.value })}
                                                    className="w-full rounded-2xl bg-black border border-indigo-500/30 p-6 text-white font-medium text-lg leading-relaxed italic focus:border-indigo-500 outline-none transition resize-none"
                                                />
                                            ) : (
                                                <p className="text-2xl font-medium text-gray-500 leading-relaxed italic border-l-8 border-gray-900 pl-10">
                                                    {userData.bio || "No cerebral data indexed for this node."}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* Neural Grid Connections */}
                                <section className="rounded-[4rem] border border-gray-900 bg-black/40 p-16 shadow-3xl">
                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-16 flex items-center gap-6">
                                        <Globe size={32} className="text-indigo-500" />
                                        External Manifold Links
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        {[
                                            { key: 'github', icon: Github, label: 'GitHub Repository', color: 'hover:text-white' },
                                            { key: 'linkedin', icon: Linkedin, label: 'LinkedIn Manifold', color: 'hover:text-indigo-400' },
                                            { key: 'twitter', icon: Twitter, label: 'Twitter Frequency', color: 'hover:text-cyan-400' },
                                            { key: 'website', icon: Globe, label: 'Personal Node', color: 'hover:text-purple-400' }
                                        ].map(social => (
                                            <div key={social.key} className="space-y-4 group">
                                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-800 block">{social.label}</label>
                                                <div className="flex items-center gap-6 rounded-3xl bg-gray-950 p-6 border border-gray-900 focus-within:border-indigo-500/50 transition-all shadow-xl">
                                                    <social.icon size={24} className="text-gray-700 group-hover:text-indigo-500 transition-colors" />
                                                    {isCalibrating ? (
                                                        <input
                                                            type="text"
                                                            value={buffer[social.key]}
                                                            onChange={(e) => setBuffer({ ...buffer, [social.key]: e.target.value })}
                                                            className="w-full bg-transparent border-none outline-none text-sm font-black text-gray-500 uppercase tracking-widest"
                                                        />
                                                    ) : (
                                                        <a href={buffer[social.key]} target="_blank" rel="noreferrer" className={cn("text-xs font-black text-gray-700 transition-all uppercase tracking-widest italic group-hover:text-white", social.color)}>
                                                            {buffer[social.key] ? buffer[social.key].split('/').pop() : "Fragmented"}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeSector === 'security' && (
                            <div className="space-y-16 animate-in fade-in slide-in-from-right-10 duration-1000">
                                <section className="rounded-[4rem] border border-gray-900 bg-gray-900/5 p-16 shadow-3xl">
                                    <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-16 text-white leading-none">Guardian Encryption</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="p-10 rounded-[3rem] bg-gray-950 border border-gray-900 hover:border-indigo-500/40 transition-all group/key shadow-2xl">
                                            <div className="mb-8 flex items-center justify-between">
                                                <div className="h-16 w-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 shadow-3xl">
                                                    <Lock size={32} />
                                                </div>
                                                <div className="flex flex-col text-right">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-800">Hash Stability</span>
                                                    <span className="text-xs font-black text-emerald-500 uppercase">100% Secure</span>
                                                </div>
                                            </div>
                                            <h4 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2">Master Key Rotation</h4>
                                            <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest mb-10">Neural paths updated 124 days ago.</p>
                                            <Button className="w-full rounded-2xl bg-white text-black py-8 text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Rotat_Key</Button>
                                        </div>

                                        <div className="p-10 rounded-[3rem] bg-gray-950 border border-gray-900 hover:border-indigo-500/40 transition-all group/key shadow-2xl">
                                            <div className="mb-8 flex items-center justify-between">
                                                <div className="h-16 w-16 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-500 shadow-3xl">
                                                    <Smartphone size={32} />
                                                </div>
                                                <div className="flex flex-col text-right">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-800">Status</span>
                                                    <span className="text-xs font-black text-emerald-500 uppercase animate-pulse">Active</span>
                                                </div>
                                            </div>
                                            <h4 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2">Multi-Factor Sync</h4>
                                            <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest mb-10">Verify login via biometric peripheral. </p>
                                            <Button variant="outline" className="w-full rounded-2xl border-gray-900 text-gray-800 py-8 text-xs font-black uppercase tracking-widest hover:text-rose-500 hover:border-rose-500 transition-all">Disable_MFS</Button>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Self-Destruct Protocol (Danger Zone) */}
            <div className="mx-auto mt-40 max-w-7xl px-8">
                <div className="rounded-[4rem] border-4 border-dashed border-rose-900/40 bg-rose-950/5 p-20 flex flex-col lg:flex-row items-center gap-16 shadow-3xl transition-all hover:bg-rose-950/10 group">
                    <div className="h-40 w-40 shrink-0 rounded-[3rem] bg-rose-600 text-white flex items-center justify-center border-8 border-gray-950 shadow-[0_0_60px_rgba(225,29,72,0.4)] group-hover:scale-110 transition-transform">
                        <Trash2 size={72} />
                    </div>
                    <div className="flex-1 space-y-4 text-center lg:text-left">
                        <h4 className="text-6xl font-black uppercase italic tracking-tighter text-rose-500 leading-none">Dissolve Identity</h4>
                        <p className="text-rose-900 text-xl font-bold max-w-3xl italic leading-relaxed border-l-4 border-rose-900/30 pl-10">
                            Warning: Initializing the self-destruct protocol will permanently erase all neural logs, academic schedules, and blog manuscripts from the Neural Nexus. This action is <span className="text-rose-600 font-black underline">Absolute</span>.
                        </p>
                    </div>
                    <Button className="rounded-[3rem] bg-rose-600 px-16 py-12 text-sm font-black uppercase tracking-[0.3em] text-white hover:bg-rose-500 shadow-3xl hover:scale-105 active:scale-95 transition-all w-full lg:w-auto">
                        EXECUTE_DELETE
                    </Button>
                </div>
            </div>

            <footer className="mt-60 py-20 border-t border-gray-900 text-center">
                <p className="text-[10px] font-black uppercase tracking-[1.5em] text-gray-800 mb-10">Neural_Identity_Interface_v5.4.1</p>
                <div className="flex justify-center gap-16 text-[9px] font-black text-gray-800 uppercase tracking-widest italic">
                    <span className="hover:text-white transition-colors cursor-pointer">Security_Shell</span>
                    <span className="hover:text-white transition-colors cursor-pointer">Protocol_Archives</span>
                    <span className="text-gray-900">Hash: 0xNN-FF-02</span>
                </div>
            </footer>
        </div>
    );
};

export default ProfilePage;
