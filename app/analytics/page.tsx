"use client";

import { useStore } from "@/store/useStore";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from "recharts";
import { Briefcase, CheckCircle2, XCircle, Clock, Users } from "lucide-react";

const COLORS = {
  Applied: "#64748b",      // slate-500
  Interviewing: "#f59e0b", // amber-500
  "Tech Test": "#3b82f6",  // blue-500
  Offer: "#10b981",        // emerald-500
  Rejected: "#ef4444",     // red-500
  Wishlist: "#94a3b8"      // slate-400
};

export default function AnalyticsPage() {
  const { jobs, contacts } = useStore();

  // Calculate top-level stats
  const totalApplied = jobs.length;
  const totalInterviewing = jobs.filter(j => j.status === "Interviewing" || j.status === "Tech Test").length;
  const totalOffers = jobs.filter(j => j.status === "Offer").length;
  const totalRejected = jobs.filter(j => j.status === "Rejected").length;
  const totalNetwork = contacts.length;

  // Calculate Pipeline Distribution for Pie Chart
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pipelineData = Object.entries(statusCounts)
    .map(([name, value]) => ({ name, value }))
    .filter(d => d.value > 0);

  // Calculate Tech Stack frequency for Bar Chart
  const techCounts = jobs.reduce((acc, job) => {
    if (job.techStack) {
      job.techStack.forEach(tech => {
        acc[tech] = (acc[tech] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const techData = Object.entries(techCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5

  return (
    <div className="flex-1 p-8 max-w-6xl mx-auto w-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Analytics Overview</h1>
        <p className="text-text-secondary">Track your job search performance and conversion rates.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-surface border border-border p-5 rounded-xl shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-text-secondary font-medium">Total Saved</span>
            <div className="p-2 bg-surface-alt rounded-md text-text-primary">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold">{totalApplied}</span>
        </div>

        <div className="bg-surface border border-border p-5 rounded-xl shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-text-secondary font-medium">In Process</span>
            <div className="p-2 bg-amber-500/10 rounded-md text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold">{totalInterviewing}</span>
        </div>

        <div className="bg-surface border border-border p-5 rounded-xl shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-text-secondary font-medium">Offers</span>
            <div className="p-2 bg-success/10 rounded-md text-success">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold text-success">{totalOffers}</span>
        </div>

        <div className="bg-surface border border-border p-5 rounded-xl shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-text-secondary font-medium">Rejections</span>
            <div className="p-2 bg-danger/10 rounded-md text-danger">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold text-danger">{totalRejected}</span>
        </div>

        <div className="bg-surface border border-border p-5 rounded-xl shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-text-secondary font-medium">Network</span>
            <div className="p-2 bg-accent/10 rounded-md text-accent">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold text-accent">{totalNetwork}</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pipeline Distribution Pie Chart */}
        <div className="bg-surface border border-border p-6 rounded-xl shadow-sm h-96 flex flex-col">
          <h3 className="text-lg font-semibold mb-6">Pipeline Distribution</h3>
          {pipelineData.length > 0 ? (
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || "#CBD5E1"} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 500 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {pipelineData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-sm text-text-secondary">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] || "#CBD5E1" }} />
                    {entry.name} ({entry.value})
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
              No jobs in pipeline yet.
            </div>
          )}
        </div>

        {/* Top Tech Stack Bar Chart */}
        <div className="bg-surface border border-border p-6 rounded-xl shadow-sm h-96 flex flex-col">
          <h3 className="text-lg font-semibold mb-6">Top Tech Requirements</h3>
          {techData.length > 0 ? (
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={techData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 13 }}
                  />
                  <RechartsTooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#0f172a" radius={[0, 4, 4, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
              No tech stack data extracted yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
