import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader, Shield, Zap, Sparkles, Cpu, Activity, Fingerprint } from 'lucide-react';
import Input from '@/components/Inputs/Input';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

/**
 * @component LoginPage
 * @description Advanced Neural Access Terminal.
 * Handles identity verification and synaptic handshake for node entry.
 */
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHandshaking, setIsHandshaking] = useState(false);
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const executeHandshake = useCallback(async (e) => {
    e.preventDefault();
    setIsHandshaking(true);

    const toastId = toast.loading('Initializing Synaptic Handshake...');

    try {
      await login(email, password);
      toast.success('Identity Verified. Welcome back, Architect.', { id: toastId });
      navigate('/');
    } catch (err) {
      toast.error('Identity Mismatch. Verification Failed.', { id: toastId });
      console.error('[NexusAuth] Login Fault:', err);
    } finally {
      setIsHandshaking(false);
    }
  }, [email, password, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-6 selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Background Manifold */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#4f46e510_0%,_transparent_70%)] opacity-50"></div>
      <div className="absolute top-20 left-20 h-96 w-96 bg-indigo-500/5 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-20 h-96 w-96 bg-purple-500/5 blur-[120px] rounded-full animate-pulse delay-700"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="max-w-xl w-full bg-black/40 backdrop-blur-3xl border border-gray-900 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden relative z-10 group"
      >
        {/* Tactical Header */}
        <div className="p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-50"></div>
          <Cpu size={48} className="mx-auto mb-8 text-indigo-500 animate-spin-slow" />
          <h2 className="text-5xl font-black italic tracking-tighter uppercase text-white mb-2 leading-none">
            Neural <span className="text-indigo-600">Access</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-700">Verify Identity Node</p>
        </div>

        <div className="px-12 pb-12">
          <form onSubmit={executeHandshake} className="space-y-8">
            <div className="space-y-6">
              <div className="group/input relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-800 ml-4 mb-2 block group-focus-within/input:text-indigo-500 transition-colors">Primary Identifier</label>
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="SYNTAX: user@nexus.node"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-950/50 border-gray-900 focus:border-indigo-500/50 text-indigo-400 placeholder:text-gray-800 p-8 rounded-2xl transition-all"
                />
              </div>

              <div className="group/input relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-800 ml-4 mb-2 block group-focus-within/input:text-indigo-500 transition-colors">Access Key (Hash)</label>
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-950/50 border-gray-900 focus:border-indigo-500/50 text-indigo-400 placeholder:text-gray-800 p-8 rounded-2xl transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-4">
              <Link
                to="/forgot-password"
                className="text-[10px] font-black uppercase tracking-widest text-gray-700 hover:text-indigo-400 transition-all italic underline underline-offset-4"
              >
                Decrypt Password?
              </Link>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-black uppercase tracking-tighter text-center"
              >
                {error}
              </motion.div>
            )}

            <Button
              disabled={isLoading || isHandshaking}
              type="submit"
              className="w-full py-10 rounded-2xl bg-white text-black font-black uppercase italic tracking-[0.2em] shadow-3xl hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] group/btn overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center justify-center gap-4">
                {isLoading || isHandshaking ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Handshaking...
                  </>
                ) : (
                  <>
                    <Fingerprint size={20} className="group-hover/btn:rotate-12 transition-transform" />
                    Initialize_Auth
                  </>
                )}
              </span>
            </Button>
          </form>
        </div>

        {/* Footer Matrix */}
        <div className="px-12 py-8 bg-gray-900/10 border-t border-gray-900 flex justify-center items-center gap-4">
          <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">
            New Node?{' '}
            <Link to="/auth/signup" className="text-indigo-500 hover:text-white transition-all italic decoration-indigo-500/30 underline underline-offset-4 ml-2">
              Register_Identity
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Status Bar */}
      <div className="absolute bottom-10 left-10 flex items-center gap-6 opacity-20 hover:opacity-100 transition-opacity duration-1000">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-gray-800 uppercase tracking-widest leading-none">Status</span>
          <span className="text-[10px] font-black text-emerald-500 uppercase italic">Online</span>
        </div>
        <div className="h-8 w-px bg-gray-900"></div>
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-gray-800 uppercase tracking-widest leading-none">Security</span>
          <span className="text-[10px] font-black text-indigo-500 uppercase italic">Omega-7</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
