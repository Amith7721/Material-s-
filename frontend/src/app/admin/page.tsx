"use client";

import { motion } from "framer-motion";
import { Users, FileText, Database, LayoutDashboard, Settings, BrainCircuit } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const userGrowthData = [
  { name: 'Jan', users: 4000 },
  { name: 'Feb', users: 3000 },
  { name: 'Mar', users: 2000 },
  { name: 'Apr', users: 2780 },
  { name: 'May', users: 1890 },
  { name: 'Jun', users: 2390 },
  { name: 'Jul', users: 3490 },
];

const apiUsageData = [
  { name: 'Mon', requests: 4000 },
  { name: 'Tue', requests: 3000 },
  { name: 'Wed', requests: 2000 },
  { name: 'Thu', requests: 2780 },
  { name: 'Fri', requests: 1890 },
  { name: 'Sat', requests: 2390 },
  { name: 'Sun', requests: 3490 },
];

export default function AdminPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-navy-900">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/5 bg-navy-900/50 hidden md:flex flex-col p-4">
        <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4 px-2">Admin Menu</div>
        <nav className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-cyan-500/10 text-cyan-400 font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <Users className="w-5 h-5" /> Users
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <Database className="w-5 h-5" /> Materials DB
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <FileText className="w-5 h-5" /> Uploads
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">System Overview</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Users", value: "12,493", icon: <Users className="w-6 h-6 text-blue-400" />, trend: "+14%" },
              { label: "Materials Indexed", value: "105,842", icon: <Database className="w-6 h-6 text-cyan-400" />, trend: "+2%" },
              { label: "AI Queries (Today)", value: "34.2K", icon: <BrainCircuit className="w-6 h-6 text-purple-400" />, trend: "+42%" },
              { label: "PDFs Processed", value: "8,930", icon: <FileText className="w-6 h-6 text-green-400" />, trend: "+8%" },
            ].map((stat, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={stat.label} 
                className="glass-panel rounded-2xl p-6 relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">{stat.icon}</div>
                  <span className="text-green-400 text-sm font-bold bg-green-400/10 px-2 py-1 rounded-lg">{stat.trend}</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-white font-bold mb-6">User Growth</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowthData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff40" tick={{ fill: '#ffffff80' }} />
                    <YAxis stroke="#ffffff40" tick={{ fill: '#ffffff80' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', color: '#fff' }} />
                    <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-white font-bold mb-6">API & AI Usage (Requests)</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={apiUsageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff40" tick={{ fill: '#ffffff80' }} />
                    <YAxis stroke="#ffffff40" tick={{ fill: '#ffffff80' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', color: '#fff' }} cursor={{ fill: '#ffffff05' }} />
                    <Bar dataKey="requests" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Recent Activity Table */}
          <div className="glass-panel rounded-2xl p-6 border-white/10">
            <h3 className="text-white font-bold mb-6">Recent Activities</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-white/80">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 text-sm">
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Action</th>
                    <th className="pb-3 font-medium">Target</th>
                    <th className="pb-3 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { user: "dr.smith@mit.edu", action: "PDF Upload & Extraction", target: "Synthesis_of_Graphene.pdf", time: "2 mins ago" },
                    { user: "j.doe@stanford.edu", action: "AI Material Search", target: "High-temp alloys", time: "15 mins ago" },
                    { user: "system", action: "Database Sync", target: "Materials_DB_Prod", time: "1 hour ago" },
                    { user: "a.lee@tesla.com", action: "Comparison Analysis", target: "Battery Cathodes", time: "3 hours ago" },
                  ].map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-4 text-sm">{row.user}</td>
                      <td className="py-4 text-sm">
                        <span className="px-2 py-1 rounded bg-white/5 text-cyan-400 text-xs font-medium border border-white/10">{row.action}</span>
                      </td>
                      <td className="py-4 text-sm">{row.target}</td>
                      <td className="py-4 text-sm text-white/40">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
