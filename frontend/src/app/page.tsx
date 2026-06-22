"use client";

import { motion } from "framer-motion";
import { Search, Sparkles, BrainCircuit, Database, FileText, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const stats = [
  { label: "Materials Indexed", value: "100K+" },
  { label: "AI Predictions", value: "5M+" },
  { label: "Research Papers", value: "50K+" },
  { label: "Active Researchers", value: "10K+" },
];

const features = [
  {
    icon: <Database className="h-6 w-6 text-cyan-400" />,
    title: "Vast Material Database",
    description: "Search through over 100,000+ materials with detailed properties, applications, and comparisons.",
  },
  {
    icon: <BrainCircuit className="h-6 w-6 text-blue-400" />,
    title: "AI Property Prediction",
    description: "Predict material properties, durability, and stress points using our state-of-the-art machine learning models.",
  },
  {
    icon: <FileText className="h-6 w-6 text-purple-400" />,
    title: "Automated Data Extraction",
    description: "Upload PDFs and let our AI extract key material properties, saving you hundreds of hours of manual research.",
  },
];

function FloatingParticles() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 20 + 10,
      }));
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-cyan-400/20 rounded-full"
          style={{ width: p.size, height: p.size, top: `${p.y}%`, left: `${p.x}%` }}
          animate={{
            y: ["0%", "-100%"],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <FloatingParticles />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center px-4 py-2 rounded-full glass-card text-cyan-400 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Introducing MatInformatics v2.0
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6"
        >
          AI-Powered <span className="text-gradient">Materials Informatics</span> Platform
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-white/70 max-w-2xl mb-12"
        >
          Discover, analyze, compare, and predict the best materials using Artificial Intelligence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-4 relative z-10"
        >
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for materials (e.g., Titanium Alloy, Graphene)..."
              className="w-full pl-12 pr-4 py-4 rounded-xl glass-panel text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
            />
          </div>
          <Link href="/materials" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto whitespace-nowrap px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all flex items-center justify-center gap-2">
              Explore Materials
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-extrabold text-white mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-white/50 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Supercharge Your Research</h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Our platform combines vast databases with cutting-edge AI to accelerate materials discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card rounded-2xl p-8"
            >
              <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* AI Assistant Preview */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-900/10 blur-3xl rounded-full translate-y-1/2 scale-150 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass-panel rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 border-cyan-500/20">
            <div className="flex-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Activity className="w-4 h-4 mr-2" />
                Ask The AI
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Your Personal <br /> <span className="text-cyan-400">Materials Expert</span>
              </h2>
              <p className="text-lg text-white/60 mb-8 max-w-xl">
                Need to find a material with specific constraints? Chat with our AI assistant to instantly filter, compare, and discover materials tailored to your engineering needs.
              </p>
              <Link href="/chat">
                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all flex items-center gap-2">
                  Try AI Assistant <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="flex-1 w-full relative">
               <div className="glass-card rounded-2xl p-6 relative border-t border-l border-white/20 overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
                 <div className="flex items-start gap-4 mb-6">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex-shrink-0" />
                   <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 text-sm text-white/80 border border-white/10">
                     What is the best lightweight material for an aerospace application operating at 500°C?
                   </div>
                 </div>
                 <div className="flex items-start gap-4">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex-shrink-0 flex items-center justify-center">
                     <BrainCircuit className="w-4 h-4 text-white" />
                   </div>
                   <div className="bg-cyan-900/20 rounded-2xl rounded-tl-none p-4 text-sm text-cyan-50 border border-cyan-500/20">
                     Based on your requirements (low density & high temperature resistance), I recommend considering <strong>Titanium Aluminides (TiAl)</strong>. They offer approximately half the density of nickel-based superalloys while maintaining excellent strength up to 750°C.
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
