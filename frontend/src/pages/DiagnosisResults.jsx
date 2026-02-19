import React, { useState, useEffect } from 'react';
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
    Zap
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';
import { cn } from '@/lib/utils';

const DiagnosisResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isPrinting, setIsPrinting] = useState(false);

    // In a real app, we'd fetch based on ID or get from location state
    const resultData = location.state?.diagnosis || {
        diagnosis: "Acute Cognitive Fatigue & Seasonal Rhinitis",
        probability: 0.88,
        symptoms: ["headache", "sneezing", "tiredness", "sore throat"],
        recommendations: [
            "Rest for at least 7-8 hours tonight in a dark, quiet room.",
            "Hydrate with fluids containing electrolytes.",
            "Consider over-the-counter antihistamines for rhinitis symptoms.",
            "Limit screen time for the next 24 hours to reduce neural load."
        ],
        urgency: "Moderate",
        disclaimer: "This is an AI-generated assessment and not a medical diagnosis. Consult a professional physician."
    };

    const handlePrint = () => {
        setIsPrinting(true);
        window.print();
        setTimeout(() => setIsPrinting(false), 500);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Report URL copied to clipboard.');
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white selection:bg-rose-500/30">
            {/* Top Navigation */}
            <nav className="sticky top-0 z-50 border-b border-gray-900 bg-gray-950/80 p-6 backdrop-blur-2xl">
                <div className="mx-auto flex max-w-5xl items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-500 hover:text-white transition"
                    >
                        <ArrowLeft size={18} />
                        Back to scanner
                    </button>
                    <div className="flex items-center gap-2">
                        <Stethoscope className="text-rose-500 animate-pulse-slow" size={24} />
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-white italic">MediLink Intelligence</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={handleShare} className="text-gray-500 hover:text-white transition"><Share2 size={20} /></button>
                        <button onClick={handlePrint} className="text-gray-500 hover:text-white transition"><Download size={20} /></button>
                    </div>
                </div>
            </nav>

            <div className="mx-auto max-w-5xl px-8 py-16">
                {/* Header Information */}
                <header className="mb-16 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                                <span className={cn(
                                    "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl backdrop-blur-md",
                                    resultData.urgency === 'High' ? "bg-red-500 text-white" : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                )}>
                                    {resultData.urgency} Urgency
                                </span>
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
                                    <Clock size={14} /> {moment().format('MMMM Do [at] h:mm:ss a')}
                                </span>
                            </div>
                            <h1 className="text-5xl font-black md:text-7xl tracking-tighter uppercase italic leading-none text-white mb-4">
                                Assessment Result
                            </h1>
                            <p className="max-w-xl text-xl font-medium text-gray-400 leading-relaxed italic border-l-4 border-rose-900 pl-6">
                                Based on non-invasive neural and symptomatic analysis of {resultData.symptoms.length} unique markers.
                            </p>
                        </div>
                        <div className="h-40 w-40 rounded-[2.5rem] bg-gray-900 border border-gray-800 flex flex-col items-center justify-center p-4 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent"></div>
                            <span className="text-4xl font-black text-rose-500 mb-1">{Math.round(resultData.probability * 100)}%</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Certainty</span>
                            <div className="mt-4 h-1.5 w-20 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${resultData.probability * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Assessment Block */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

                    {/* Left: Core Diagnosis */}
                    <div className="md:col-span-8 space-y-10">
                        <section className="rounded-[3rem] border border-gray-900 bg-gray-900/10 p-12 backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition duration-700">
                                <Microscope size={200} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-600 mb-8 flex items-center gap-2">
                                <Zap size={14} className="text-rose-500" /> Primary Hypothesis
                            </h3>
                            <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
                                {resultData.diagnosis}
                            </h2>
                            <p className="mt-10 text-gray-400 font-medium leading-relaxed italic pr-20">
                                This assessment indicates a high correlation between reported somatic distress and the identified condition.
                                The identified condition is commonly associated with academic peak periods and seasonal shifts.
                            </p>
                        </section>

                        <section className="rounded-[3rem] border border-gray-900 bg-gray-900/10 p-12 backdrop-blur-md">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-600 mb-8">Detected Markers</h3>
                            <div className="flex flex-wrap gap-4">
                                {resultData.symptoms.map(s => (
                                    <div key={s} className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gray-950 border border-gray-800 hover:border-rose-500/40 transition-all cursor-crosshair group">
                                        <div className="h-6 w-6 rounded-lg bg-gray-900 flex items-center justify-center text-gray-500 group-hover:text-rose-500"><Thermometer size={14} /></div>
                                        <span className="text-sm font-black uppercase text-gray-500 group-hover:text-white transition">{s}</span>
                                    </div>
                                ))}
                                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl border-2 border-dashed border-gray-800 text-gray-700 font-black uppercase text-xs hover:text-gray-500 hover:border-gray-500 transition cursor-pointer">
                                    <PlusCircle size={14} /> Add more
                                </div>
                            </div>
                        </section>

                        <section className="rounded-[3rem] border border-gray-900 bg-gray-900/10 p-12 backdrop-blur-md overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 text-rose-500/5 animate-pulse">
                                <Activity size={120} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-600 mb-10">Neural Protocol Recommendations</h3>
                            <div className="space-y-6 relative z-10">
                                {resultData.recommendations.map((rec, i) => (
                                    <div key={i} className="flex gap-6 p-6 rounded-[2rem] bg-gray-950 border border-gray-800 hover:bg-black transition group">
                                        <div className="h-10 w-10 shrink-0 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 font-black">
                                            {i + 1}
                                        </div>
                                        <p className="text-lg font-bold text-gray-400 group-hover:text-white transition leading-relaxed">
                                            {rec}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right: Insights and Sidebars */}
                    <div className="md:col-span-4 space-y-10">
                        {/* Critical Disclaimer */}
                        <div className="rounded-[2.5rem] bg-rose-600 p-10 text-white shadow-2xl shadow-rose-900/40 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <AlertOctagon size={80} />
                            </div>
                            <div className="relative z-10">
                                <ShieldAlert size={40} className="mb-6" />
                                <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-6">Medical Directive</h3>
                                <p className="text-rose-950/80 font-black italic text-sm leading-relaxed">
                                    {resultData.disclaimer}
                                    <span className="block mt-4 text-white uppercase tracking-widest text-[10px] font-black">Safety Level: Nominal</span>
                                </p>
                            </div>
                        </div>

                        {/* Next Steps Widgets */}
                        <div className="rounded-[2.5rem] bg-gray-900 border border-gray-800 p-10 space-y-8">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Action Path</h4>
                            <div className="grid grid-cols-1 gap-4">
                                <button className="flex items-center justify-between p-5 rounded-2xl bg-gray-950 hover:bg-black transition group border border-gray-800 hover:border-rose-500/40">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-gray-900 flex items-center justify-center text-gray-500 group-hover:text-rose-500"><Search size={16} /></div>
                                        <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-white">Research Condition</span>
                                    </div>
                                    <ChevronRight size={14} className="text-gray-700" />
                                </button>
                                <button className="flex items-center justify-between p-5 rounded-2xl bg-gray-950 hover:bg-black transition group border border-gray-800 hover:border-rose-500/40">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-gray-900 flex items-center justify-center text-gray-500 group-hover:text-rose-500"><Clipboard size={16} /></div>
                                        <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-white">Export to PDF</span>
                                    </div>
                                    <ChevronRight size={14} className="text-gray-700" />
                                </button>
                                <button className="flex items-center justify-between p-5 rounded-2xl bg-gray-950 hover:bg-black transition group border border-gray-800 hover:border-rose-500/40">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-gray-900 flex items-center justify-center text-gray-500 group-hover:text-rose-500"><HeartPulse size={16} /></div>
                                        <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-white">Health Summary</span>
                                    </div>
                                    <ChevronRight size={14} className="text-gray-700" />
                                </button>
                            </div>
                        </div>

                        {/* Community Insight */}
                        <div className="p-10 text-center bg-gray-900 border border-gray-800 rounded-[2.5rem]">
                            <Info size={32} className="mx-auto mb-6 text-gray-600" />
                            <h4 className="text-sm font-black uppercase tracking-widest mb-4">Did you know?</h4>
                            <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase">
                                Over 42% of students report similar neural fatigue markers during the third quarter of the semester. You are not alone in this journey.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Stats Insight */}
                <div className="mt-20 rounded-[4rem] border border-gray-900 bg-gradient-to-r from-gray-950 via-gray-900 to-transparent p-12 flex flex-col md:flex-row items-center gap-10 backdrop-blur-3xl shadow-2xl group">
                    <div className="h-32 w-32 shrink-0 rounded-[2.5rem] bg-rose-500 flex items-center justify-center text-white shadow-xl shadow-rose-900/40 rotate-12 group-hover:rotate-0 transition duration-700">
                        <Activity size={48} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter italic text-white mb-4 leading-none">Global Health Snapshot</h3>
                        <p className="text-gray-400 font-bold max-w-xl leading-relaxed uppercase tracking-tighter">
                            The Synapse Synchrony network has processed <span className="text-white">12,401 assessments</span> this week. Aggregated data suggests an upward trend in <span className="text-rose-500">stress-related fatigue</span> across the university campus.
                        </p>
                        <button className="mt-8 text-sm font-black uppercase tracking-widest text-rose-500 hover:text-white transition italic underline underline-offset-8">View Public Health Node</button>
                    </div>
                </div>

                {/* Footer space */}
                <div className="h-40"></div>
            </div>
        </div>
    );
};

export default DiagnosisResults;
