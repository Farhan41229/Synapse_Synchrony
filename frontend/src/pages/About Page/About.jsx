import React from 'react';
import { 
  Users, 
  Layout, 
  Shield, 
  Sparkles, 
  Rocket, 
  Heart, 
  Target, 
  Cpu, 
  Activity,
  Zap,
  Star,
  Wind
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
    const coreNodes = [
        {
            title: 'Nexus Intelligence',
            desc: 'AI-driven insights for mental and academic calibration.',
            icon: Brain,
            color: 'text-cyan-500'
        },
        {
            title: 'Temporal Lattices',
            desc: 'High-precision scheduling and resource synchronization.',
            icon: Activity,
            color: 'text-rose-500'
        },
        {
            title: 'Synaptic Harmony',
            desc: 'A unified community for student excellence.',
            icon: Heart,
            color: 'text-violet-500'
        }
    ];

    return (
        <div className="bg-gray-950 min-h-screen text-white selection:bg-cyan-500/30">
            {/* Neural Header */}
            <section className="relative py-40 px-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-600/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex items-center gap-6 mb-12 animate-in fade-in slide-in-from-top-10 duration-1000">
                        <div className="h-1 w-20 bg-cyan-600"></div>
                        <span className="text-xs font-black uppercase tracking-[0.8em] text-cyan-500">System Protocol: About</span>
                    </div>
                    <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter uppercase italic leading-[0.8] mb-12">
                        Neural <br /> <span className="text-cyan-500">Nexus</span>
                    </h1>
                    <p className="max-w-3xl text-2xl font-medium text-gray-500 leading-relaxed italic border-l-8 border-gray-900 pl-12 mb-20">
                        The definitive student orchestration engine. We leverage advanced synaptic modeling to synchronize mental wellness with academic performance delta.
                    </p>
                    <div className="flex gap-10">
                        <Button className="rounded-[2rem] bg-white text-black px-12 py-8 text-sm font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-3xl">
                            Initialize Sync
                        </Button>
                        <Button variant="outline" className="rounded-[2rem] border-gray-800 bg-transparent px-12 py-8 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-white hover:border-cyan-500 transition-all">
                            View Nodes
                        </Button>
                    </div>
                </div>
            </section>

            {/* Matrix Section */}
            <section className="py-40 px-8 bg-black/40 border-y border-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        {coreNodes.map((node, i) => (
                            <div key={i} className="group relative overflow-hidden rounded-[3rem] border border-gray-900 bg-gray-950/50 p-12 transition-all hover:border-cyan-500/30">
                                <div className="mb-10 p-6 bg-gray-900 rounded-3xl w-fit group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-2xl">
                                    <node.icon size={32} />
                                </div>
                                <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-6 group-hover:text-cyan-400 transition-colors">
                                    {node.title}
                                </h3>
                                <p className="text-gray-500 font-bold uppercase tracking-widest leading-relaxed text-xs">
                                    {node.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-40 px-8">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32 items-center">
                    <div className="space-y-12">
                        <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none">
                            Our <span className="text-cyan-500">Cerebral</span> <br /> Philosophy
                        </h2>
                        <div className="space-y-8 text-xl text-gray-500 font-medium leading-relaxed italic border-l-4 border-gray-900 pl-10">
                            <p>
                                Modern academia is a multi-dimensional pressure field. Students are not static units; they are dynamic oscillations that require precise tuning to maintain equilibrium.
                            </p>
                            <p>
                                Neural Nexus acts as the central conductor, harmonizing the various fragments of student life into a singular, high-performance manifold.
                            </p>
                        </div>
                        <div className="flex items-center gap-10">
                            <div className="flex flex-col">
                                <span className="text-4xl font-black italic text-white uppercase">20k+</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">Nodes Active</span>
                            </div>
                            <div className="h-12 w-[1px] bg-gray-900"></div>
                            <div className="flex flex-col">
                                <span className="text-4xl font-black italic text-white uppercase">98%</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">Sync Stability</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-cyan-500 blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                        <div className="relative rounded-[4rem] border border-gray-900 bg-gray-900/10 p-20 backdrop-blur-3xl overflow-hidden">
                            <Rocket size={200} className="text-white/5 absolute -bottom-10 -right-10 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-1000" />
                            <div className="space-y-12 relative z-10">
                                <div className="h-24 w-24 bg-white rounded-3xl flex items-center justify-center text-black shadow-3xl">
                                    <Sparkles size={48} />
                                </div>
                                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-tight">Neural Nexus Alpha-1 Deployment</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Sync Integrity</span>
                                        <span className="text-sm font-black italic text-cyan-500">94%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-950 rounded-full overflow-hidden border border-gray-900">
                                        <div className="h-full bg-cyan-500 w-[94%] animate-pulse"></div>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest leading-relaxed">System state is currently optimal. All synaptic nodes report high performance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-8 border-t border-gray-900 text-center">
                <p className="text-[10px] font-black uppercase tracking-[1em] text-gray-800 mb-6">Neural_Nexus_System_OS_v4.0</p>
                <div className="flex justify-center gap-12 text-[9px] font-black text-gray-700 uppercase tracking-widest">
                    <span className="hover:text-cyan-500 transition-colors cursor-pointer">Security Protocol</span>
                    <span className="hover:text-cyan-500 transition-colors cursor-pointer">Kernel Docs</span>
                    <span className="hover:text-cyan-500 transition-colors cursor-pointer">Privacy Node</span>
                </div>
            </footer>
        </div>
    );
};

const Brain = Sparkles; // Fallback mapping

export default About;
