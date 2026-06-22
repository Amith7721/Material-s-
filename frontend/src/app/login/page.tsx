"use client";

import { motion } from "framer-motion";
import { Atom, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin ? { email, password } : { name, email, password, role: "Researcher" };
      const { data } = await api.post(endpoint, payload);

      if (!data?.token) {
        throw new Error("Login failed. Missing authentication token.");
      }

      localStorage.setItem("token", data.token);
      await router.push("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-cyan-500/20 blur-[120px] rounded-full" />
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl flex rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl relative z-10"
      >
        {/* Left Side - Visuals */}
        <div className="hidden md:flex flex-1 flex-col justify-between p-12 bg-navy-800/80 relative overflow-hidden">
          <div className="absolute inset-0 bg-cyber-gradient opacity-50 mix-blend-overlay" />
          
          <div className="relative z-10">
            <Link href="/" className="flex items-center space-x-2 mb-12">
              <Atom className="h-8 w-8 text-cyan-400" />
              <span className="text-xl font-bold text-white tracking-tight">
                MatInformatics
              </span>
            </Link>

            <h2 className="text-4xl font-bold text-white mb-6">
              Accelerate your<br />materials research.
            </h2>
            <p className="text-white/70 text-lg max-w-sm">
              Join thousands of researchers and engineers using AI to discover, analyze, and predict material properties.
            </p>
          </div>

          <div className="relative z-10 glass-card p-6 rounded-2xl border-cyan-500/30">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600" />
               <div>
                 <div className="text-white font-medium">Dr. Sarah Chen</div>
                 <div className="text-white/50 text-sm">Materials Scientist, MIT</div>
               </div>
            </div>
            <p className="text-white/80 italic text-sm">
              &quot;MatInformatics cut our literature review and property estimation time by 80%. The AI insights are game-changing.&quot;
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-navy-900/90 relative">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-white/60 mb-8">
              {isLogin ? "Enter your details to access your dashboard." : "Start your journey in AI-powered materials research."}
            </p>


            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-xl border border-red-400/20">{error}</div>}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Jane Doe"
                    className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@university.edu"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                />
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300">Forgot password?</a>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl text-white font-bold text-lg shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (isLogin ? "Signing In..." : "Creating Account...") : (isLogin ? "Sign In" : "Create Account")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <p className="text-center text-white/60 mt-8">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-cyan-400 font-medium hover:underline"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
