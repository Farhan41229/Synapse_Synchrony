import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Loader, Sparkles, Cpu, Activity, Fingerprint, Target, Zap, Waves } from 'lucide-react';
import Input from '@/components/Inputs/Input';
import { Link, useNavigate } from 'react-router';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

/**
 * @component SignUpPage
 * @description Advanced Node Injection Terminal.
 * Handles the registration of new biological identities into the Neural Nexus.
 */
const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isInjecting, setIsInjecting] = useState(false);

  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  const executeInjection = useCallback(async (e) => {
    e.preventDefault();
    setIsInjecting(true);

    const toastId = toast.loading('Calibrating Neural Node...');

    try {
      await signup(email, password, name);
      toast.success('Node Calibrated. Verification Required.', { id: toastId });
      navigate('/auth/verify-email');
    } catch (err) {
      toast.error('Injection Failed. Protocol Rejected.', { id: toastId });
      console.error('[NexusAuth] Signup Fault:', err);
    } finally {
      setIsInjecting(false);
    }
  }, [email, password, name, signup, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-6 selection:bg-indigo-500/30 overflow-hidden relative font-sans">
      {/* Background Manifold */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#4f46e510_0%,_transparent_70%)] opacity-50"></div>
      <div className="absolute top-20 right-20 h-96 w-96 bg-purple-500/5 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 left-20 h-96 w-96 bg-indigo-500/5 blur-[120px] rounded-full animate-pulse delay-700"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="max-w-xl w-full bg-black/40 backdrop-blur-3xl border border-gray-900 rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden relative z-10 group"
      >
        {/* Tactical Header */}
        <div className="p-14 text-center relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-50"></div>
          <Target size={52} className="mx-auto mb-8 text-purple-500 animate-pulse" />
          <h2 className="text-6xl font-black italic tracking-tighter uppercase text-white mb-2 leading-none">
            New <span className="text-purple-600">Identity</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.8em] text-gray-800">Inject Node into Network</p>
        </div>

        <div className="px-14 pb-14">
          <form onSubmit={executeInjection} className="space-y-10">
            <div className="space-y-6">
              <div className="group/input relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-800 ml-4 mb-2 block group-focus-within/input:text-purple-500 transition-colors">Biological Identifier</label>
                <Input
                  icon={User}
                  type="text"
                  placeholder="SYNTAX: Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-950/50 border-gray-900 focus:border-purple-500/50 text-purple-400 placeholder:text-gray-900 p-8 rounded-2xl transition-all"
                />
              </div>

              <div className="group/input relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-800 ml-4 mb-2 block group-focus-within/input:text-purple-500 transition-colors">Digital Frequency (Email)</label>
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="SYNTAX: user@nexus.node"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-950/50 border-gray-900 focus:border-purple-500/50 text-purple-400 placeholder:text-gray-900 p-8 rounded-2xl transition-all"
                />
              </div>

              <div className="group/input relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-800 ml-4 mb-2 block group-focus-within/input:text-purple-500 transition-colors">Encryption Key (Password)</label>
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-950/50 border-gray-900 focus:border-purple-500/50 text-purple-400 placeholder:text-gray-900 p-8 rounded-2xl transition-all"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-black uppercase tracking-widest text-center italic"
              >
                ERROR_CODE_77: {error}
              </motion.div>
            )}

            <PasswordStrengthMeter password={password} className="mt-4" />

            <Button
              disabled={isLoading || isInjecting}
              type="submit"
              className="w-full py-12 rounded-[2.5rem] bg-white text-black font-black uppercase italic tracking-[0.3em] shadow-3xl hover:bg-purple-600 hover:text-white transition-all transform hover:scale-[1.03] active:scale-95 group/btn overflow-hidden relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-6">
                {isLoading || isInjecting ? (
                  <>
                    <Loader className="w-6 h-6 animate-spin" />
                    Injecting_Node...
                  </>
                ) : (
                  <>
                    <Zap size={24} className="group-hover/btn:animate-bounce" />
                    Initialize_Nexus_Link
                  </>
                )}
              </span>
            </Button>
          </form>
        </div>

        {/* Footer Matrix */}
        <div className="px-14 py-10 bg-gray-900/10 border-t border-gray-900 flex justify-center items-center gap-4">
          <p className="text-[10px] font-black text-gray-800 uppercase tracking-widest">
            Identity Already Exists?{' '}
            <Link to="/auth/login" className="text-purple-500 hover:text-white transition-all italic decoration-purple-500/30 underline underline-offset-4 ml-3">
              Authorize_Entry
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Tactical Footer Overlay */}
      <div className="absolute top-10 right-10 flex items-center gap-10 opacity-30 hover:opacity-100 transition-opacity duration-1000 rotate-90 origin-right translate-x-12">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-white uppercase tracking-[1em]">Injection_Protocol_v5.4.3</span>
        </div>
        <div className="h-6 w-px bg-white/20"></div>
        <Activity size={16} className="text-purple-500" />
      </div>
    </div>
  );
};

export default SignUpPage;
