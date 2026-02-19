import React, { useState, useEffect } from 'react';
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
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import moment from 'moment';

const ProfilePage = () => {
    const queryClient = useQueryClient();
    const [editMode, setEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState('account');

    // Form states
    const [profileData, setProfileData] = useState({
        name: '',
        bio: '',
        website: '',
        github: '',
        twitter: '',
        linkedin: ''
    });

    // Queries
    const { data: user, isLoading: userLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await fetch('/api/profile', {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return res.json();
        }
    });

    useEffect(() => {
        if (user?.data) {
            setProfileData({
                name: user.data.name || '',
                bio: user.data.bio || '',
                website: user.data.website || '',
                github: user.data.github || '',
                twitter: user.data.twitter || '',
                linkedin: user.data.linkedin || ''
            });
        }
    }, [user]);

    // Mutations
    const updateProfileMutation = useMutation({
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
            queryClient.invalidateQueries(['profile']);
            setEditMode(false);
            toast.success('Your profile has been updated!');
        }
    });

    if (userLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-950">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            </div>
        );
    }

    const { data: userData } = user;

    return (
        <div className="min-h-screen bg-gray-950 text-white selection:bg-indigo-500/30">
            {/* Top Branding Section */}
            <div className="h-48 w-full bg-gradient-to-r from-indigo-900 to-purple-900 shadow-xl overflow-hidden relative">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="mx-auto max-w-6xl px-10">
                {/* Profile Header Card */}
                <div className="relative -mt-24 mb-12 flex flex-col items-center gap-8 rounded-[3rem] border border-gray-900 bg-gray-950/80 p-10 backdrop-blur-3xl shadow-2xl md:flex-row md:items-end md:justify-between group">
                    <div className="flex flex-col items-center gap-8 md:flex-row md:items-end">
                        {/* Avatar container */}
                        <div className="relative h-44 w-44 shrink-0 rounded-[2.5rem] border-4 border-gray-950 bg-gray-900 shadow-2xl overflow-hidden ring-4 ring-indigo-500/20 group">
                            <img src={userData.avatar || "/default-avatar.png"} alt={userData.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100 cursor-pointer">
                                <Camera className="text-white" size={32} />
                            </div>
                        </div>

                        <div className="text-center md:text-left">
                            <h1 className="text-5xl font-black tracking-tighter uppercase italic text-white flex items-center gap-3">
                                {userData.name}
                                {userData.isEmailVerified && <ShieldCheck size={32} className="text-indigo-400" />}
                            </h1>
                            <p className="mt-2 text-xl font-bold text-gray-400 capitalize">{userData.role || "Scholar"} • {userData.email}</p>
                            <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
                                <span className="rounded-xl border border-gray-800 bg-gray-950 px-3 py-1 text-xs font-black uppercase text-gray-500 tracking-widest">Joined {moment(userData.createdAt).format('MMMM YYYY')}</span>
                                <span className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-3 py-1 text-xs font-black uppercase text-indigo-400 tracking-widest">Global Rank #120</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mb-2">
                        {editMode ? (
                            <>
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="flex items-center gap-2 rounded-2xl bg-gray-900 px-6 py-3 font-black uppercase text-gray-400 tracking-widest hover:text-white transition"
                                >
                                    <X size={18} /> Cancel
                                </button>
                                <button
                                    onClick={() => updateProfileMutation.mutate(profileData)}
                                    className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-black uppercase text-white tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-900/40"
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setEditMode(true)}
                                className="flex items-center gap-2 rounded-2xl bg-white px-8 py-3 font-black uppercase italic text-black hover:bg-indigo-500 hover:text-white transition shadow-xl"
                            >
                                <Settings size={18} /> Edit Core Systems
                            </button>
                        )}
                    </div>
                </div>

                {/* Sub Navigation */}
                <div className="flex flex-col gap-10 lg:flex-row">
                    {/* Sidebar Nav */}
                    <div className="lg:w-1/4">
                        <div className="sticky top-32 space-y-2 rounded-3xl bg-gray-900/40 p-3 border border-gray-900">
                            {[
                                { id: 'account', label: 'Primary Account', icon: User },
                                { id: 'security', label: 'Security & Auth', icon: Shield },
                                { id: 'notifications', label: 'Global Notifications', icon: Bell },
                                { id: 'privacy', label: 'Data & Privacy', icon: Eye },
                                { id: 'integrations', label: 'Synapse Integrations', icon: Smartphone }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={cn(
                                        "flex w-full items-center gap-4 rounded-2xl p-4 text-sm font-black uppercase tracking-widest transition-all",
                                        activeTab === item.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" : "text-gray-500 hover:bg-gray-800 hover:text-gray-300"
                                    )}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </button>
                            ))}
                            <button className="flex w-full items-center gap-4 rounded-2xl p-4 text-sm font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition mt-4">
                                <LogOut size={20} />
                                Terminate Session
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-3/4">
                        {activeTab === 'account' && (
                            <div className="space-y-10 animate-fade-in">
                                {/* Bio and Basics */}
                                <section className="rounded-[3rem] border border-gray-900 bg-gray-900/20 p-10 backdrop-blur-sm">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 italic text-white flex items-center gap-3">
                                        <IdCard size={28} className="text-indigo-400" />
                                        Professional Manuscript
                                    </h3>
                                    <div className="space-y-8">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 block mb-3">Biological Identifier (Name)</label>
                                            {editMode ? (
                                                <input
                                                    type="text"
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                    className="w-full rounded-2xl bg-gray-950 border border-gray-800 p-4 text-white font-bold tracking-wide focus:border-indigo-500 outline-none transition"
                                                />
                                            ) : (
                                                <p className="text-xl font-bold text-gray-300">{userData.name}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 block mb-3">Professional Abstract (Bio)</label>
                                            {editMode ? (
                                                <textarea
                                                    rows={4}
                                                    value={profileData.bio}
                                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                    placeholder="Briefly describe your academic focus..."
                                                    className="w-full rounded-2xl bg-gray-950 border border-gray-800 p-4 text-white font-bold tracking-wide focus:border-indigo-500 outline-none transition resize-none"
                                                />
                                            ) : (
                                                <p className="text-xl font-medium text-gray-400 leading-relaxed italic border-l-4 border-indigo-900 pl-6">
                                                    {userData.bio || "No biography provided. A scholar of mystery."}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* Contact and Links */}
                                <section className="rounded-[3rem] border border-gray-900 bg-gray-900/20 p-10 backdrop-blur-sm">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 italic text-white flex items-center gap-3">
                                        <Globe size={28} className="text-indigo-400" />
                                        Digital Connections
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {[
                                            { key: 'github', icon: Github, label: 'GitHub Profile', color: 'hover:text-gray-200' },
                                            { key: 'linkedin', icon: Linkedin, label: 'LinkedIn Professional', color: 'hover:text-blue-400' },
                                            { key: 'twitter', icon: Twitter, label: 'Twitter (X)', color: 'hover:text-cyan-400' },
                                            { key: 'website', icon: Globe, label: 'Personal Portfolio', color: 'hover:text-purple-400' }
                                        ].map(social => (
                                            <div key={social.key}>
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 block mb-3">{social.label}</label>
                                                <div className="flex items-center gap-4 rounded-2xl bg-gray-950 p-4 border border-gray-800 focus-within:border-indigo-500/50 transition">
                                                    <social.icon size={20} className="text-gray-500" />
                                                    {editMode ? (
                                                        <input
                                                            type="text"
                                                            value={profileData[social.key]}
                                                            onChange={(e) => setProfileData({ ...profileData, [social.key]: e.target.value })}
                                                            className="w-full bg-transparent border-none outline-none text-sm font-bold text-gray-300"
                                                        />
                                                    ) : (
                                                        <a href={profileData[social.key]} target="_blank" rel="noreferrer" className={cn("text-sm font-bold text-gray-500 transition-colors uppercase tracking-widest", social.color)}>
                                                            {profileData[social.key] ? profileData[social.key].split('/').pop() : "None Linked"}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-10 animate-fade-in">
                                <section className="rounded-[3rem] border border-gray-900 bg-gray-900/20 p-10 backdrop-blur-sm">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 text-white">Encryption Vault</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-6 rounded-2xl bg-gray-950 border border-gray-800 hover:border-gray-700 transition">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500"><Lock size={20} /></div>
                                                <div>
                                                    <p className="text-sm font-black uppercase tracking-widest">Update Master Key</p>
                                                    <p className="text-xs text-gray-600 font-bold uppercase">Last changed 4 months ago</p>
                                                </div>
                                            </div>
                                            <button className="text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-white transition">Update</button>
                                        </div>
                                        <div className="flex items-center justify-between p-6 rounded-2xl bg-gray-950 border border-gray-800">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500"><Smartphone size={20} /></div>
                                                <div>
                                                    <p className="text-sm font-black uppercase tracking-widest">Two-Factor Auth</p>
                                                    <p className="text-xs text-green-500 font-black uppercase">Currently Enabled</p>
                                                </div>
                                            </div>
                                            <button className="text-xs font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition">Disable</button>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <section className="rounded-[3rem] border border-gray-900 bg-gray-900/20 p-10 backdrop-blur-sm animate-fade-in">
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 text-white">Alert Synapses</h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'New Direct Messages', desc: 'Alert when a fellow student initiates contact.' },
                                        { label: 'Academic Announcements', desc: 'Critical alerts relative to your schedule.' },
                                        { label: 'Wellness Checkups', desc: 'Gentle nudges to log your mental health state.' },
                                        { label: 'Blog Interactions', desc: 'When someone likes or replies to your manuscript.' }
                                    ].map((notif, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-gray-950/40 border border-gray-900 hover:bg-gray-950 transition">
                                            <div>
                                                <p className="text-sm font-black uppercase tracking-widest mb-1">{notif.label}</p>
                                                <p className="text-xs text-gray-600 font-bold uppercase tracking-tighter">{notif.desc}</p>
                                            </div>
                                            <div className="h-4 w-10 rounded-full bg-indigo-600 relative cursor-pointer shadow-inner">
                                                <div className="absolute right-1 top-1 h-2 w-2 rounded-full bg-white"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="mx-auto mt-20 max-w-6xl px-10">
                <div className="rounded-[3rem] border-2 border-dashed border-red-900/30 bg-red-950/10 p-12 text-center md:text-left flex flex-col md:flex-row items-center gap-10">
                    <div className="h-24 w-24 shrink-0 rounded-[2rem] bg-red-900/20 flex items-center justify-center text-red-500 border border-red-500/20 shadow-2xl">
                        <Trash2 size={40} />
                    </div>
                    <div>
                        <h4 className="text-3xl font-black uppercase tracking-tighter text-red-500 mb-2">Self-Destruct (Delete Account)</h4>
                        <p className="text-red-900/80 font-bold max-w-xl">This action is irreversible. All of your blogs, wellness data, and academic records will be permanently erased from the Synapse Synchrony network.</p>
                    </div>
                    <button className="rounded-2xl bg-red-600 px-8 py-4 font-black uppercase text-white hover:bg-red-500 transition shadow-xl shadow-red-900/20 active:scale-95">
                        Destroy Data
                    </button>
                </div>
            </div>

            {/* Footer Padding */}
            <div className="h-40"></div>
        </div>
    );
};

export default ProfilePage;
