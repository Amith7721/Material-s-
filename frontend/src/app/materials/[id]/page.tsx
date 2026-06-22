"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, BrainCircuit, Download, Box, Activity, ShieldCheck, Thermometer, RotateCcw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import api from "@/services/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const temperatureData = [
  { temp: 0, strength: 1000 },
  { temp: 100, strength: 950 },
  { temp: 200, strength: 890 },
  { temp: 300, strength: 800 },
  { temp: 400, strength: 650 },
  { temp: 500, strength: 400 },
];

const radarData = [
  { subject: 'Tensile Strength', A: 120, fullMark: 150 },
  { subject: 'Yield Strength', A: 98, fullMark: 150 },
  { subject: 'Density', A: 86, fullMark: 150 },
  { subject: 'Thermal Cond.', A: 99, fullMark: 150 },
  { subject: 'Electrical Cond.', A: 85, fullMark: 150 },
  { subject: 'Corrosion Res.', A: 140, fullMark: 150 },
];

type MaterialDetail = {
  _id: string;
  name: string;
  category: string;
  composition?: string;
  density?: number;
  tensileStrength?: number;
  thermalConductivity?: number;
  elasticity?: number;
  sustainabilityScore?: number;
  costIndex?: number;
  applications?: string[];
  advantages?: string[];
  disadvantages?: string[];
  materialImage?: string;
};

export default function MaterialDetailsPage() {
  const params = useParams();
  const materialId = params?.id as string | undefined;
  const [material, setMaterial] = useState<MaterialDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replicaLoading, setReplicaLoading] = useState(false);
  const [replicaMessage, setReplicaMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      if (!materialId) return;
      setLoading(true);
      try {
        const { data } = await api.get(`/materials/${materialId}`);
        setMaterial(data);
      } catch (error) {
        console.error('Failed to load material details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [materialId]);

  const handleReplica = async () => {
    if (!materialId || !material) return;
    setReplicaMessage(null);
    setReplicaLoading(true);

    try {
      const { data } = await api.post(`/materials/${materialId}/replica`, {
        name: `Replica of ${material.name}`
      });
      setReplicaMessage(`Replica created: ${data.name}`);
    } catch (error) {
      console.error('Failed to create replica', error);
      setReplicaMessage('Unable to create replica. Please try again.');
    } finally {
      setReplicaLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center text-white">
        Loading material details...
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center text-white">
        Material not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 pb-20">
      {/* Banner */}
      <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-transparent z-10" />
        <Image 
          src={material.materialImage || 'https://images.unsplash.com/photo-1518557984649-7b161c230cfa?auto=format&fit=crop&q=80&w=1920'} 
          alt={material.name} 
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 w-full z-20 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <Link href="/materials" className="inline-flex items-center text-white/60 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
                  {material.category}
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">{material.name}</h1>
                <p className="text-white/60 text-lg">{material.composition || 'Detailed material profile and performance overview.'}</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-medium transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download Data Sheet
                </button>
                <button
                  onClick={handleReplica}
                  disabled={replicaLoading}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  {replicaLoading ? 'Creating Replica...' : 'Create Replica'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {replicaMessage && (
          <div className="mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-4 text-emerald-100">
            {replicaMessage}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Insights Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6 sm:p-8 border border-blue-500/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">AI Analysis & Insights</h2>
              </div>
              <p className="text-white/80 leading-relaxed mb-6">
                {material.name} is modeled to suit demanding applications. Its current performance profile indicates strong durability and high process reliability for mission-critical systems.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-navy-900/50 rounded-xl p-4 border border-white/5">
                  <div className="text-cyan-400 text-sm font-semibold mb-1">Sustainability Score</div>
                  <div className="text-2xl font-bold text-white">{material.sustainabilityScore ?? '—'}<span className="text-sm text-white/40">/100</span></div>
                </div>
                <div className="bg-navy-900/50 rounded-xl p-4 border border-white/5">
                  <div className="text-blue-400 text-sm font-semibold mb-1">Machinability</div>
                  <div className="text-2xl font-bold text-white">Good</div>
                </div>
                <div className="bg-navy-900/50 rounded-xl p-4 border border-white/5">
                  <div className="text-purple-400 text-sm font-semibold mb-1">Weldability</div>
                  <div className="text-2xl font-bold text-white">Fair</div>
                </div>
              </div>
            </motion.div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-red-400" />
                  Strength vs Temperature
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={temperatureData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="temp" stroke="#ffffff40" tick={{ fill: '#ffffff80' }} />
                      <YAxis stroke="#ffffff40" tick={{ fill: '#ffffff80' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', color: '#fff' }}
                        itemStyle={{ color: '#22D3EE' }}
                      />
                      <Line type="monotone" dataKey="strength" stroke="#22D3EE" strokeWidth={3} dot={{ fill: '#22D3EE' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  Performance Radar
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#ffffff20" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff80', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                      <Radar name={material.name} dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                      <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', color: '#fff' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Pros/Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-green-500">
                <h3 className="text-white font-bold mb-4">Advantages</h3>
                <ul className="space-y-2 text-white/70">
                  {(material.advantages?.length ? material.advantages : [
                    'High strength-to-weight ratio',
                    'Excellent corrosion resistance',
                    'Biocompatible'
                  ]).map((advantage, index) => (
                    <li key={index} className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"/>{advantage}</li>
                  ))}
                </ul>
              </div>
              <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-red-500">
                <h3 className="text-white font-bold mb-4">Disadvantages</h3>
                <ul className="space-y-2 text-white/70">
                  {(material.disadvantages?.length ? material.disadvantages : [
                    'High material and processing cost',
                    'Poor wear resistance',
                    'Difficult to machine'
                  ]).map((disadvantage, index) => (
                    <li key={index} className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"/>{disadvantage}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* 3D Visualizer Placeholder */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Box className="w-5 h-5 text-purple-400" />
                3D Structure
              </h3>
              <div className="w-full aspect-square bg-navy-900/50 rounded-xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&w=400')] bg-cover bg-center opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all duration-700" />
                <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay" />
                <Box className="w-12 h-12 text-white/50 mb-2 relative z-10" />
                <span className="text-white/50 font-medium relative z-10 text-sm">Click to interact</span>
              </div>
            </div>

            {/* Key Properties */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">Key Properties</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-white/60">Density</span>
                  <span className="text-white font-medium">{material.density ?? '—'} g/cm³</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-white/60">Tensile Strength</span>
                  <span className="text-white font-medium">{material.tensileStrength ?? '—'} MPa</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-white/60">Thermal Conductivity</span>
                  <span className="text-white font-medium">{material.thermalConductivity ?? '—'} W/m·K</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-white/60">Elasticity</span>
                  <span className="text-white font-medium">{material.elasticity ?? '—'} GPa</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Sustainability</span>
                  <span className="text-white font-medium">{material.sustainabilityScore ?? '—'} /100</span>
                </div>
              </div>
            </div>

            {/* Applications */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                Common Applications
              </h3>
              <div className="flex flex-wrap gap-2">
                {(material.applications?.length ? material.applications : ["Aerospace", "Medical", "Automotive"]).map(app => (
                  <span key={app} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80">
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
