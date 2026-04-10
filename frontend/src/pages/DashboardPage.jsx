import React from 'react';
import { Pill, Calendar, Activity, Clock, HeartPulse, Bell, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const heartRateData = [
  { day: 'Mon', bpm: 72 },
  { day: 'Tue', bpm: 74 },
  { day: 'Wed', bpm: 71 },
  { day: 'Thu', bpm: 76 },
  { day: 'Fri', bpm: 75 },
  { day: 'Sat', bpm: 73 },
  { day: 'Sun', bpm: 72 },
];

const recentActivities = [
  { id: 1, title: 'Took Medication', time: '8:00 AM', icon: Pill, color: 'text-green-600', bg: 'bg-green-100' },
  { id: 2, title: 'Emergency Contact Updated', time: 'Yesterday, 2 PM', icon: Bell, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 3, title: 'Completed Walk', time: 'Yesterday, 6 PM', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100' },
  { id: 4, title: 'Doctor Checkup Completed', time: 'Tue, 10 AM', icon: CheckCircle, color: 'text-[#0B1C3F]', bg: 'bg-slate-200' },
];

export default function DashboardPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Good Morning, Ramesh</h1>
          <p className="mt-2 text-slate-500 font-medium">{currentDate}</p>
        </div>

        {/* Quick Glance Cards (Top Row) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Card 1: Medication */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-[#0B1C3F] rounded-xl">
                  <Pill size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Next Dose</h3>
              </div>
              <Clock size={20} className="text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium mb-4">Aspirin - 2:00 PM</p>
            <button className="w-full bg-[#0B1C3F] hover:bg-blue-900 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-sm">
              Mark Taken
            </button>
          </div>

          {/* Card 2: Upcoming Appointment */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
             <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
                  <Calendar size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Next Checkup</h3>
              </div>
            </div>
            <p className="text-slate-800 font-semibold mb-1">Dr. Sarah (Cardiology)</p>
            <p className="text-slate-500 font-medium text-sm mb-4">Tomorrow, 10:00 AM</p>
            <button className="w-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-2.5 rounded-xl transition-colors">
              View Details
            </button>
          </div>

          {/* Card 3: Activity Goal */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                  <Activity size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Daily Steps</h3>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-[#0B1C3F]">4,500</span>
                <span className="text-slate-400">5,000 steps</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-[#0B1C3F] h-2.5 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500">Almost at your goal! Keep going.</p>
          </div>

        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Chart) */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                  <HeartPulse size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Weekly Heart Rate</h2>
              </div>
              <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Past 7 Days</span>
            </div>
            
            <div className="h-[300px] w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={heartRateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B1C3F" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0B1C3F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 13 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 13 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0B1C3F', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="bpm" stroke="#0B1C3F" strokeWidth={3} fillOpacity={1} fill="url(#colorBpm)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column (Activity Feed) */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Updates</h2>
            
            <div className="space-y-6">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex gap-4">
                    <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${activity.bg} ${activity.color}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{activity.title}</p>
                      <p className="text-sm text-slate-500 font-medium">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="w-full mt-8 text-sm font-semibold text-[#0B1C3F] hover:text-blue-900 transition-colors">
              View All History &rarr;
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}
