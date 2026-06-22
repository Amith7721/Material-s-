"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Layers, Plus, Trash2, ArrowRightLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

const radarData = [
  { subject: 'Strength', Ti6Al4V: 120, Graphene: 150, CFRP: 110, fullMark: 150 },
  { subject: 'Density (Low is better)', Ti6Al4V: 60, Graphene: 150, CFRP: 120, fullMark: 150 },
  { subject: 'Elasticity', Ti6Al4V: 90, Graphene: 140, CFRP: 130, fullMark: 150 },
  { subject: 'Cost Efficiency', Ti6Al4V: 80, Graphene: 20, CFRP: 70, fullMark: 150 },
  { subject: 'Thermal Resistance', Ti6Al4V: 100, Graphene: 150, CFRP: 40, fullMark: 150 },
  { subject: 'Conductivity', Ti6Al4V: 40, Graphene: 150, CFRP: 30, fullMark: 150 },
];

const barData = [
  { name: 'Ti-6Al-4V', Strength: 900, Density: 4.43 },
  { name: 'Graphene', Strength: 130000, Density: 0.16 }, // Scaled down for visual if needed, but keeping raw
  { name: 'CFRP', Strength: 1500, Density: 1.6 },
];

export default function DashboardPage() {
  const [selectedMaterials] = useState([
    { id: '1', name: 'Ti-6Al-4V', color: '#3b82f6' },
    { id: '2', name: 'Graphene', color: '#22d3ee' },
    { id: '3', name: 'CFRP', color: '#a855f7' },
  ]);
  const [userName, setUserName] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get('/auth/profile');
        setUserName(data.name || data.email || 'Researcher');
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          setProfileError('Please login to access your account.');
          router.replace('/login');
        } else {
          setProfileError('Unable to load profile. Please try again.');
        }
      }
    };
    loadProfile();
  }, [router]);

  return (
    <div className="min-h-screen bg-navy-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Layers className="w-8 h-8 text-cyan-400" />
              {userName ? `Welcome back, ${userName}` : 'Comparison Dashboard'}
            </h1>
            <p className="text-white/60 mt-2">{profileError ? profileError : 'Analyze and compare material properties side-by-side.'}</p>
          </div>
          <button className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 rounded-lg flex items-center gap-2 hover:bg-cyan-500/20 transition-colors">
            <Plus className="w-4 h-4" /> Add Material
          </button>
        </div>

        {/* Selected Materials Strip */}
        <div className="flex flex-wrap gap-4 mb-8">
          {selectedMaterials.map((mat) => (
            <div key={mat.id} className="glass-panel px-4 py-2 rounded-xl flex items-center gap-3 border border-white/10">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: mat.color }} />
              <span className="text-white font-medium">{mat.name}</span>
              <button className="text-white/40 hover:text-red-400 transition-colors ml-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Radar Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-purple-400" />
              Multi-dimensional Analysis
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff80', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar name="Ti-6Al-4V" dataKey="Ti6Al4V" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Radar name="Graphene" dataKey="Graphene" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} />
                  <Radar name="CFRP" dataKey="CFRP" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', color: '#fff' }} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6">Strength Comparison (MPa)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#ffffff40" tick={{ fill: '#ffffff80' }} />
                  <YAxis dataKey="name" type="category" stroke="#ffffff40" tick={{ fill: '#ffffff80' }} width={80} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', color: '#fff' }}
                    cursor={{ fill: '#ffffff05' }}
                  />
                  <Bar dataKey="Strength" fill="#22d3ee" radius={[0, 4, 4, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
