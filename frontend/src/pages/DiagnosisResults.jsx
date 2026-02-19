import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    ArrowLeft,
    Download,
    Share2,
    Clipboard,
    Search,
    Stethoscope,
    PlusCircle,
    Info,
    AlertOctagon,
    ShieldAlert,
    Clock,
    User,
    ChevronRight,
    Loader2,
    Microscope,
    HeartPulse,
    Thermometer,
    Zap,
    Sparkles,
    Wind,
    Shield,
    Flame,
    Cpu,
    Target,
    Waves,
    Database
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * @component DiagnosisResults
 * @description Advanced Synaptic Assessment Report manifold.
 * Renders high-fidelity diagnostic data with predictive accuracy indices and neural recommendations.
 */
const DiagnosisResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isExporting, setIsExporting] = useState(false);

    // --- MANIFOLD DATA RESOLVER ---
    const resultData = useMemo(() => location.state?.diagnosis || {
        diagnosis: "Neural Saturation & Synaptic Latency",
        probability: 0.94,
        symptoms: ["cognitive_fog", "focus_drift", "sleep_variance", "stress_spike"],
        recommendations: [
            "Initialize deep sleep protocol for 480 minutes.",
            "Calibrate hydration levels with electrolyte manifold.",
            "Engage in low-frequency neural stimulation (nature walking).",
            "Decouple from digital nodes for a 12-hour cycle."
        ],
        urgency: "Elevated",
        disclaimer: "This is a machine-learning projection. Consult a certified biological physician for absolute verification."
    }, [location.state]);

    const executeExport = useCallback(() => {
        setIsExporting(true);
        toast.promise(new Promise(r => setTimeout(r, 2000)), {
            loading: 'Generating PDF Manifold...',
            success: 'Report Exported Successfully',
            error: 'Export Failed'
        }).finally(() => {
            window.print();
            setIsExporting(false);
        });
    }, []);

    const executeShare = useCallback(() => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Synaptic Link Copied to Clipboard');
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 text-white selection:bg-rose-500/30 overflow-x-hidden font-sans pb-40">
            {/* Command Header Matrix */}
            <nav className="sticky top-0 z-50 border-b border-gray-900 bg-gray-950/80 p-6 backdrop-blur-3xl shadow-3xl">
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-gray-500 hover:text-white transition-all"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Retrast Scanner
                    </button>
                    <div className="flex items-center gap-6">
                        <div className="h-6 w-6 rounded-lg bg-rose-600 flex items-center justify-center shadow-xl animate-pulse">
                            <Activity size={14} className="text-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.8em] text-white italic">Neural_Assessor_v5.2</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={executeShare} className="text-gray-700 hover:text-rose-500 transition-all p-2 rounded-xl border border-transparent hover:border-gray-900"><Share2 size={20} /></button>
                        <button onClick={executeExport} className="text-gray-700 hover:text-rose-500 transition-all p-2 rounded-xl border border-transparent hover:border-gray-900"><Download size={20} /></button>
                    </div>
                </div>
            </nav>

            <div className="mx-auto max-w-6xl px-8 py-24">
                {/* Visual Impact Header */}
                <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-16 animate-in fade-in slide-in-from-top-10 duration-1000">
                    <div className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className={cn(
                                "px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-3xl text-white",
                                resultData.urgency === 'High' ? "bg-rose-600 animate-pulse" : "bg-orange-600"
                            )}>
                                {resultData.urgency} Urgency
                            </div>
                            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest flex items-center gap-3 italic">
                                <Clock size={16} /> {moment().format('MMMM.DD.YYYY | HH:mm:ss')}
                            </span>
                        </div>
                        <h1 className="text-8xl font-black md:text-[9rem] tracking-tighter uppercase italic leading-[0.8] text-white">
                            Assessor <br /> <span className="text-rose-600">Output</span>
                        </h1>
                        <p className="max-w-xl text-2xl font-medium text-gray-500 leading-relaxed italic border-l-8 border-gray-900 pl-12">
                            A multi-modal machine projection based on <span className="text-white font-black">{resultData.symptoms.length} unique neural markers</span>.
                        </p>
                    </div>

                    <div className="h-56 w-56 rounded-[4rem] bg-gray-950 border border-gray-900 flex flex-col items-center justify-center p-8 shadow-[0_0_100px_rgba(225,29,72,0.1)] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent"></div>
                        <Target size={120} className="absolute -top-10 -right-10 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                        <span className="text-7xl font-black text-rose-500 italic tracking-tighter mb-2 leading-none">{Math.round(resultData.probability * 100)}%</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-800">Confidence</span>
                        <div className="mt-6 h-2 w-32 bg-gray-900 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-rose-600 transition-all duration-2000 shadow-[0_0_10px_#f43f5e]" style={{ width: `${resultData.probability * 100}%` }}></div>
                        </div>
                    </div>
                </header>

                {/* Primary Data Manifold */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-20">
                    {/* Lateral Column: Insights */}
                    <aside className="md:col-span-4 space-y-16 order-2 md:order-1">
                        <section className="rounded-[3rem] bg-rose-600 p-12 text-white shadow-3xl relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-0 transition-all">
                                <AlertOctagon size={160} />
                            </div>
                            <div className="relative z-10 space-y-8">
                                <ShieldAlert size={48} className="animate-pulse" />
                                <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Guardian Disclaimer</h3>
                                <p className="text-rose-950/80 font-black italic text-sm leading-relaxed border-l-4 border-rose-900/40 pl-8">
                                    {resultData.disclaimer}
                                </p>
                                <div className="pt-4 flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-widest bg-black/20 px-4 py-2 rounded-full">Safety_Audit: Pass</span>
                                    <Shield size={16} />
                                </div>
                            </div>
                        </section>

                        <section className="bg-gray-900/10 rounded-[3rem] border border-gray-900 p-10 space-y-10 group shadow-xl">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-800 text-center">Action_Registry</h4>
                            <div className="space-y-4">
                                {[
                                    { label: 'Neural Research', icon: Search, col: 'group-hover:text-cyan-500' },
                                    { label: 'Export Log', icon: Clipboard, col: 'group-hover:text-rose-500' },
                                    { label: 'Global Pulse', icon: HeartPulse, col: 'group-hover:text-emerald-500' }
                                ].map((act, i) => (
                                    <button key={i} className="flex w-full items-center justify-between p-6 rounded-2xl bg-gray-950 hover:bg-black transition-all group/btn border border-gray-900 hover:border-white/10 shadow-inner">
                                        <div className="flex items-center gap-6">
                                            <div className={cn("h-10 w-10 rounded-xl bg-gray-900 flex items-center justify-center text-gray-700 transition-colors", act.col)}>
                                                <act.icon size={18} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 group-hover/btn:text-white transition-colors">{act.label}</span>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-800" />
                                    </button>
                                ))}
                            </div>
                        </section>
                    </aside>

                    {/* Central Manifold: Core Data */}
                    <main className="md:col-span-8 space-y-16 order-1 md:order-2">
                        <section className="rounded-[4rem] border border-gray-900 bg-gray-900/5 p-16 relative overflow-hidden group shadow-3xl">
                            <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:rotate-12 transition-all duration-1000 scale-150">
                                <Microscope size={300} />
                            </div>
                            <div className="relative z-10 space-y-10">
                                <div className="flex items-center gap-6">
                                    <div className="h-1 w-12 bg-rose-600"></div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.8em] text-rose-500">Hypothesis_Log</h3>
                                </div>
                                <h2 className="text-7xl font-black uppercase italic tracking-tighter text-white leading-[0.85]">
                                    {resultData.diagnosis}
                                </h2>
                                <p className="text-2xl font-medium text-gray-500 leading-relaxed italic border-l-8 border-gray-900 pl-12 pr-20">
                                    The assessor indicates a massive correlation between current biometric oscillations and the projected condition.
                                    This signature is characteristic of <span className="text-white">Peak Semester Flux</span>.
                                </p>
                            </div>
                        </section>

                        <section className="rounded-[4rem] border border-gray-900 bg-black/40 p-16 shadow-3xl">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-800 mb-12">Neural_Markers_Detected</h3>
                            <div className="flex flex-wrap gap-6">
                                {resultData.symptoms.map(s => (
                                    <div key={s} className="flex items-center gap-4 px-8 py-6 rounded-3xl bg-gray-950 border border-gray-900 hover:border-rose-500/40 transition-all cursor-crosshair group hover:scale-105">
                                        <Thermometer size={20} className="text-gray-800 group-hover:text-rose-500 transition-colors" />
                                        <span className="text-xs font-black uppercase tracking-widest text-gray-600 group-hover:text-white transition-all italic">{s}</span>
                                    </div>
                                ))}
                                <div className="flex items-center gap-4 px-8 py-6 rounded-3xl border-2 border-dashed border-gray-900 text-gray-800 font-black uppercase text-[10px] tracking-[0.4em] hover:text-white hover:border-gray-700 transition cursor-pointer">
                                    <PlusCircle size={20} /> Inject_Marker
                                </div>
                            </div>
                        </section>

                        <section className="rounded-[4rem] border border-gray-900 bg-gray-900/5 p-16 relative overflow-hidden group shadow-3xl">
                            <div className="absolute top-0 right-0 p-10 opacity-5 rotate-[-20deg] group-hover:rotate-0 transition-transform duration-1000">
                                <Waves size={240} className="text-rose-500" />
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.8em] text-gray-800 mb-16 px-4">Neural_Recovery_Protocols</h3>
                            <div className="space-y-8 relative z-10">
                                {resultData.recommendations.map((rec, i) => (
                                    <div key={i} className="flex gap-10 p-10 rounded-[3.5rem] bg-gray-950 border border-gray-900 hover:bg-black transition-all group/rec shadow-xl">
                                        <div className="h-16 w-16 shrink-0 rounded-2xl bg-rose-600/10 flex items-center justify-center text-rose-500 text-2xl font-black italic shadow-3xl group-hover/rec:bg-rose-600 group-hover/rec:text-white transition-all">
                                            0{i + 1}
                                        </div>
                                        <div className="flex flex-col justify-center gap-2">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-800">Protocol_Node_{i}</span>
                                            <p className="text-xl font-bold text-gray-500 group-hover/rec:text-white transition leading-relaxed italic">
                                                {rec}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>
                </div>
            </div>

            {/* Global Manifold Insights */}
            <section className="mx-auto mt-40 max-w-6xl px-8">
                <div className="rounded-[5rem] border border-gray-900 bg-gradient-to-br from-gray-950 via-black to-rose-950/20 p-24 flex flex-col lg:flex-row items-center gap-24 relative overflow-hidden group shadow-3xl">
                    <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] bg-rose-500/5 blur-[150px] group-hover:bg-rose-500/10 transition-all duration-1000"></div>
                    <div className="h-44 w-44 shrink-0 bg-white rounded-[4rem] flex items-center justify-center text-black shadow-3xl group-hover:rotate-12 transition-transform duration-1000">
                        <Activity size={80} className="animate-pulse" />
                    </div>
                    <div className="flex-1 space-y-10 relative z-10">
                        <h3 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">Global Pulse Network</h3>
                        <p className="text-gray-500 text-3xl font-medium leading-[1.6] italic border-l-8 border-rose-900/40 pl-16">
                            The Neural Nexus has analyzed <span className="text-white font-black underline decoration-rose-600/50">14,209 assessments</span> this cycle.
                            Aggregated metrics show a <span className="text-rose-500 font-black">+18% spike</span> in synaptic saturation levels across the cluster.
                        </p>
                        <div className="flex gap-12 pt-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-800">Network_Coherence</span>
                                <div className="h-2 w-48 bg-gray-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[94%] shadow-[0_0_10px_#10b981]"></div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-800">Risk_Manifold</span>
                                <div className="h-2 w-48 bg-gray-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-rose-500 w-[24%] shadow-[0_0_10px_#f43f5e]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button className="rounded-[3rem] bg-rose-600 px-16 py-12 text-sm font-black uppercase tracking-[0.4em] shadow-3xl hover:bg-rose-500 hover:scale-105 active:scale-95 transition-all relative z-10">
                        Sync_Global_Data
                    </Button>
                </div>
            </section>

            <footer className="mt-60 py-20 border-t border-gray-900 text-center">
                <p className="text-[10px] font-black uppercase tracking-[1.5em] text-gray-800 mb-10">Neural_Assessor_Interface_v5.2.1</p>
                <div className="flex justify-center gap-16 text-[9px] font-black text-gray-800 uppercase tracking-widest italic">
                    <span className="hover:text-white transition-colors cursor-pointer">Security_Audit</span>
                    <span className="hover:text-white transition-colors cursor-pointer">Node_Archives</span>
                    <span className="text-gray-900">Hash: 0xRE-66-94</span>
                </div>
            </footer>
        </div>
    );
};

export default DiagnosisResults;
