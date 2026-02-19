import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import {
    Zap,
    Activity,
    Shield,
    Search,
    Bell,
    Settings,
    User,
    Mail,
    Lock,
    ArrowRight,
    Plus,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Cpu,
    Database,
    Globe,
    Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ComponentShowcase = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const toggleLoading = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white p-10 selection:bg-indigo-500/30">
            {/* Header */}
            <header className="mb-20 text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-900/40 rotate-12">
                        <Cpu size={32} className="text-white" />
                    </div>
                </div>
                <h1 className="text-6xl font-black uppercase italic tracking-tighter text-white leading-none">
                    Synapse <span className="text-indigo-500 font-black">Synchrony</span> UI
                </h1>
                <p className="mt-4 text-xl font-bold text-gray-500 uppercase tracking-widest">Master Design System v2.0.4</p>
                <div className="mt-8 h-1 w-40 bg-indigo-600 mx-auto rounded-full"></div>
            </header>

            <div className="mx-auto max-w-7xl space-y-32">

                {/* 1. Buttons Section */}
                <section>
                    <div className="mb-10 flex items-end justify-between border-b border-gray-900 pb-6">
                        <div>
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Action Triggers (Buttons)</h2>
                            <p className="mt-1 text-sm font-bold text-gray-600 uppercase">Interactive nodes for network manipulation.</p>
                        </div>
                        <Badge variant="outline" className="px-4 py-1 text-[10px] font-black uppercase">System Core</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Variants */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">Styling Variants</h4>
                            <div className="flex flex-col gap-4">
                                <Button variant="default">Master Node (Default)</Button>
                                <Button variant="secondary">Sub Nexus (Secondary)</Button>
                                <Button variant="destructive">Terminate (Destructive)</Button>
                                <Button variant="outline">Perimeter (Outline)</Button>
                                <Button variant="ghost">Invisible (Ghost)</Button>
                                <Button variant="link">Hyperlink Sync</Button>
                            </div>
                        </div>

                        {/* Custom Synapse Variants */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">Project Specific</h4>
                            <div className="flex flex-col gap-4">
                                <Button className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-900/40 uppercase italic font-black">Synapse Primary</Button>
                                <Button className="bg-cyan-600 text-white hover:bg-cyan-700 shadow-xl shadow-cyan-900/40 uppercase italic font-black">MediLink Cyan</Button>
                                <Button className="bg-rose-600 text-white hover:bg-rose-700 shadow-xl shadow-rose-900/40 uppercase italic font-black">Wellness Rose</Button>
                            </div>
                        </div>

                        {/* Sizes & Icons */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">Sizing Overrides</h4>
                            <div className="flex flex-wrap gap-4 items-center">
                                <Button size="sm">Tiny Node</Button>
                                <Button size="default">Standard</Button>
                                <Button size="lg">Macro Engine</Button>
                            </div>
                            <div className="flex items-center gap-4 mt-6">
                                <Button size="icon" className="rounded-full"><Plus size={20} /></Button>
                                <Button size="icon" variant="outline"><Search size={20} /></Button>
                                <Button size="icon" variant="destructive"><Trash2 size={20} /></Button>
                            </div>
                        </div>

                        {/* States */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">Dynamic States</h4>
                            <div className="flex flex-col gap-4">
                                <Button isLoading={isLoading} onClick={toggleLoading}>
                                    {isLoading ? "Synchronizing..." : "Trigger Async Sync"}
                                </Button>
                                <Button disabled>Offline Node</Button>
                                <Button className="flex items-center gap-2">
                                    Forward Data <ArrowRight size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Inputs Section */}
                <section>
                    <div className="mb-10 flex items-end justify-between border-b border-gray-900 pb-6">
                        <div>
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Data Ingestion (Inputs)</h2>
                            <p className="mt-1 text-sm font-bold text-gray-600 uppercase">Neural interfaces for manual data entry.</p>
                        </div>
                        <Badge variant="outline" className="px-4 py-1 text-[10px] font-black uppercase">User Input</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Standard Channel</label>
                            <Input placeholder="Enter synaptic key..." />
                            <p className="text-[9px] font-bold text-gray-700 uppercase italic">Input status: Nominal</p>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Error State</label>
                            <Input placeholder="Invalid protocol..." className="border-red-500/50 bg-red-500/5 text-red-500 placeholder:text-red-900/50" />
                            <p className="text-[9px] font-black text-red-500 uppercase flex items-center gap-1">
                                <AlertCircle size={10} /> Sync failed: Verification required.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Success Focus</label>
                            <Input placeholder="Authorized..." className="border-green-500/50 bg-green-500/5 text-green-500" />
                            <p className="text-[9px] font-black text-green-500 uppercase flex items-center gap-1">
                                <CheckCircle2 size={10} /> Link established.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 3. Cards Section */}
                <section>
                    <div className="mb-10 flex items-end justify-between border-b border-gray-900 pb-6">
                        <div>
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Synaptic Modules (Cards)</h2>
                            <p className="mt-1 text-sm font-bold text-gray-600 uppercase">Information containment systems.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Standard Card */}
                        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl rounded-[2.5rem] overflow-hidden group hover:border-indigo-500/50 transition duration-500">
                            <CardHeader className="bg-gray-950 p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition">
                                        <Zap size={20} />
                                    </div>
                                    <Badge variant="outline">01</Badge>
                                </div>
                                <CardTitle className="text-2xl font-black uppercase italic text-white tracking-tighter">Standard Nexus</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <p className="text-sm font-bold text-gray-400 leading-relaxed uppercase italic">
                                    Contains encapsulated data relative to a single network node. Highly efficient for grid layouts.
                                </p>
                            </CardContent>
                            <CardFooter className="px-8 pb-8 pt-0">
                                <Button variant="outline" size="sm" fullWidth>Deploy Node</Button>
                            </CardFooter>
                        </Card>

                        {/* Cyber Gradient Card */}
                        <Card className="bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-transparent border-indigo-500/20 rounded-[2.5rem] p-10 flex flex-col justify-between overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl group-hover:opacity-30 transition">
                                <Cpu size={120} className="text-indigo-400" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-6">Advanced Processing</h3>
                                <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-tight mb-6">Neural Grid Control</h2>
                                <p className="text-gray-400 font-bold uppercase italic text-xs leading-loose">
                                    Adaptive architecture that scales with network density. Optimized for 10ms response times.
                                </p>
                            </div>
                            <div className="relative z-10 mt-12 flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-8 w-8 rounded-full border-2 border-gray-950 bg-gray-800"></div>
                                    ))}
                                </div>
                                <span className="text-[10px] font-black uppercase text-gray-600">+12 Synapses</span>
                            </div>
                        </Card>

                        {/* Alert Card */}
                        <Card className="bg-red-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-red-900/40 border-none relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 animate-pulse opacity-20">
                                <AlertCircle size={100} />
                            </div>
                            <div className="relative z-10">
                                <Shield size={32} className="mb-6" />
                                <h3 className="text-2xl font-black uppercase tracking-tighter italic leading-none mb-4">Critical Breach</h3>
                                <p className="text-red-950/60 font-black uppercase italic text-xs leading-relaxed mb-10">
                                    Unauthorized access detected in segment Delta-9. Automated lockdown in progress.
                                </p>
                                <Button className="bg-white text-red-600 hover:bg-gray-100 font-black uppercase italic px-10">Purge Data</Button>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* 4. Badges & Indicators */}
                <section>
                    <div className="mb-10 flex items-end justify-between border-b border-gray-900 pb-6">
                        <div>
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Network Indicators (Markers)</h2>
                            <p className="mt-1 text-sm font-bold text-gray-600 uppercase">Visual status signals.</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-8 items-center justify-center p-20 rounded-[3rem] bg-gray-900/20 border border-gray-900">
                        <div className="flex flex-col items-center gap-3">
                            <Badge variant="default" className="bg-indigo-600 px-6 py-2 rounded-full font-black text-[10px] uppercase shadow-lg shadow-indigo-900/30">Active Nexus</Badge>
                            <span className="text-[8px] font-black uppercase text-gray-700 tracking-widest">Master State</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <Badge variant="secondary" className="px-6 py-2 rounded-full font-black text-[10px] uppercase">Secondary Path</Badge>
                            <span className="text-[8px] font-black uppercase text-gray-700 tracking-widest">Backup State</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <Badge variant="destructive" className="px-6 py-2 rounded-full font-black text-[10px] uppercase">Purged</Badge>
                            <span className="text-[8px] font-black uppercase text-gray-700 tracking-widest">Null State</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <Badge variant="outline" className="px-6 py-2 rounded-full font-black text-[10px] uppercase border-gray-700 text-gray-500">Hibernating</Badge>
                            <span className="text-[8px] font-black uppercase text-gray-700 tracking-widest">Sleep State</span>
                        </div>
                    </div>
                </section>

                {/* 5. Typography Matrix */}
                <section>
                    <div className="mb-10 flex items-end justify-between border-b border-gray-900 pb-6">
                        <div>
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Linguistic Matrix (Typography)</h2>
                            <p className="mt-1 text-sm font-bold text-gray-600 uppercase">Standard fonts for data presentation.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                        <div className="space-y-12">
                            <div>
                                <h1 className="text-8xl font-black uppercase italic tracking-tighter leading-none mb-4">H1 Heading</h1>
                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.5em] italic">Text-8xl / Font-Black / Italic</p>
                            </div>
                            <div>
                                <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-4">H2 Heading</h2>
                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.5em] italic">Text-6xl / Font-Black / Italic</p>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-4">H3 Heading</h3>
                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.5em] italic">Text-4xl / Font-Black / Italic</p>
                            </div>
                        </div>
                        <div className="space-y-10 rounded-[3rem] bg-gray-900/40 p-12 border border-gray-900">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-6">Manuscript Examples</h4>
                            <p className="text-2xl font-medium text-gray-300 leading-relaxed italic border-l-4 border-indigo-600 pl-8">
                                "The synergy between disparate neural nodes creates a unified consciousness for collective student excellence."
                            </p>
                            <p className="text-sm font-bold text-gray-500 leading-loose uppercase tracking-wide">
                                Synapse Synchrony employs a minimalist yet aggressive aesthetic. We prioritize clarity through high contrast and bold typography. This manuscript represents the baseline for all internal documentation.
                            </p>
                            <div className="flex items-center gap-10 pt-10 border-t border-gray-800">
                                <div>
                                    <p className="text-4xl font-black text-white italic">420ms</p>
                                    <p className="text-[10px] font-black uppercase text-gray-700">Average Sync</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-black text-white italic">99.9%</p>
                                    <p className="text-[10px] font-black uppercase text-gray-700">Uptime integrity</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. Advanced Layout Matrix */}
                <section>
                    <div className="mb-10 border-b border-gray-900 pb-6">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter">Architecture (Grid Matrix)</h2>
                        <p className="mt-1 text-sm font-bold text-gray-600 uppercase">Global structural units.</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-96">
                        <div className="col-span-2 row-span-2 rounded-[2.5rem] bg-gray-900/50 border border-gray-800 flex items-center justify-center uppercase font-black italic text-gray-700">Primary Core (2x2)</div>
                        <div className="rounded-3xl bg-gray-900/50 border border-gray-800 flex items-center justify-center uppercase font-black italic text-gray-700">Aux 1</div>
                        <div className="rounded-3xl bg-gray-900/50 border border-gray-800 flex items-center justify-center uppercase font-black italic text-gray-700">Aux 2</div>
                        <div className="col-span-2 rounded-3xl bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center uppercase font-black italic text-indigo-500">Horizontal Subgroup (2x1)</div>
                    </div>
                </section>

            </div>

            {/* Footer space */}
            <footer className="mt-40 border-t border-gray-900 py-20 text-center">
                <p className="text-[10px] font-black uppercase tracking-[1em] text-gray-700 italic">EndOfTransmission_Synapse_Synchrony_2026</p>
            </footer>
        </div>
    );
};

export default ComponentShowcase;
