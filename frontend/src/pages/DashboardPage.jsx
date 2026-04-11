import React, { useState, useEffect } from 'react';
import { Pill, Calendar, Activity, Clock, HeartPulse, Bell, CheckCircle, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  getTodayMedicines, 
  getUpcomingAppointments, 
  getWeeklyActivity, 
  getRecentUpdates,
  addAppointment,
  logActivity,
  markMedicineTaken
} from '../api/dashboardService';

export default function DashboardPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const [medicines, setMedicines] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const [apptForm, setApptForm] = useState({ doctor: '', specialty: '', dateTime: '' });
  const [activityForm, setActivityForm] = useState({ steps: 0 });

  const fetchDashboardData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    try {
      const [medRes, apptRes, activityRes, updatesRes] = await Promise.allSettled([
        getTodayMedicines(),
        getUpcomingAppointments(),
        getWeeklyActivity(),
        getRecentUpdates()
      ]);

      if (medRes.status === 'fulfilled') setMedicines(medRes.value?.data || medRes.value || []);
      if (apptRes.status === 'fulfilled') setAppointments(apptRes.value?.data || apptRes.value || []);
      if (activityRes.status === 'fulfilled') setWeeklyActivity(activityRes.value?.data || activityRes.value || []);
      if (updatesRes.status === 'fulfilled') setRecentUpdates(updatesRes.value?.data || updatesRes.value || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      const chosenDate = new Date(apptForm.dateTime);
      
      const payload = {
        doctorName: apptForm.doctor,
        date: chosenDate.toISOString(),
        time: chosenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        purpose: apptForm.specialty 
      };

      await addAppointment(payload);
      setIsApptModalOpen(false);
      setApptForm({ doctor: '', specialty: '', dateTime: '' });
      fetchDashboardData(false);
    } catch (err) {
      console.error("Validation Error (Appointment):", err.response?.data || err.message);
      alert(JSON.stringify(err.response?.data?.message || "Error adding appointment"));
    }
  };

  const handleLogActivity = async (e) => {
    e.preventDefault();
    try {
      // Activity schema accepts steps, and may require a date depending on controller defaults
      const payload = {
        steps: activityForm.steps,
        date: new Date().toISOString()
      };

      await logActivity(payload);
      setIsActivityModalOpen(false);
      setActivityForm({ steps: 0 });
      fetchDashboardData(false);
    } catch (err) {
      console.error("Validation Error (Activity):", err.response?.data || err.message);
      alert(JSON.stringify(err.response?.data?.message || "Error logging activity"));
    }
  };

  const handleMarkTaken = async (id) => {
    try {
      await markMedicineTaken(id);
      fetchDashboardData(false); // silently re-fetch data to slide the next pill into place
    } catch (err) {
      console.error("Error marking medicine as taken:", err);
      alert("Could not mark medicine as taken.");
    }
  };

  // Safe fallback to match the hardcoded steps fix requirement
  const activities = weeklyActivity && weeklyActivity.length > 0 ? weeklyActivity[weeklyActivity.length - 1] : null;
  const currentSteps = activities?.steps || 0;
  const stepGoal = activities?.stepGoal || 5000;
  const stepPercentage = Math.min((currentSteps / stepGoal) * 100, 100);

  // Smart Queueing for Next Dose:
  // Assuming the backend returns items sorted by time, and active items have not been marked taken.
  const nextMedicine = medicines.find(med => !med.isTaken);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#0B1C3F]" />
          <p className="text-slate-600 font-medium text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Good Morning, Ramesh</h1>
          <p className="mt-2 text-slate-500 font-medium">{currentDate}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}

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
            </div>
            {!nextMedicine ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-green-600 font-semibold text-center w-full">🎉 All caught up for today!</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-slate-600 font-medium text-lg mb-1">{nextMedicine.name || 'Medication'}</p>
                  <p className="text-[#0B1C3F] font-bold flex items-center gap-2">
                    <Clock size={16} className="text-slate-400" />
                    {(nextMedicine.timings?.[0]?.time) || nextMedicine.time || 'Scheduled'}
                  </p>
                </div>
                <button 
                  onClick={() => handleMarkTaken(nextMedicine._id || nextMedicine.id)}
                  className="w-full bg-[#0B1C3F] hover:bg-blue-900 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  Mark Taken
                </button>
              </>
            )}
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
              <button 
                onClick={() => setIsApptModalOpen(true)}
                className="text-sm text-blue-700 hover:text-blue-900 font-semibold bg-blue-50 px-3 py-1 rounded-md"
              >
                + Add
              </button>
            </div>
            {appointments.length === 0 ? (
              <p className="text-slate-500 text-sm mb-4">No items scheduled for today.</p>
            ) : (
              <>
                <p className="text-slate-800 font-semibold mb-1">{appointments[0]?.doctor || 'Doctor Visit'}</p>
                <p className="text-slate-500 font-medium text-sm mb-4">{appointments[0]?.time || 'Upcoming'}</p>
                <button className="w-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-2.5 rounded-xl transition-colors">
                  View Details
                </button>
              </>
            )}
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
              <button 
                onClick={() => setIsActivityModalOpen(true)}
                className="text-sm text-blue-700 hover:text-blue-900 font-semibold bg-blue-50 px-3 py-1 rounded-md"
              >
                + Add
              </button>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-[#0B1C3F]">{currentSteps.toLocaleString()}</span>
                <span className="text-slate-400">{stepGoal.toLocaleString()} steps</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-[#0B1C3F] h-2.5 rounded-full" style={{ width: `${stepPercentage}%` }}></div>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500">
              {stepPercentage >= 100 ? "Goal reached! Great job." : "Almost at your goal! Keep going."}
            </p>
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
                <AreaChart data={weeklyActivity || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              {recentUpdates.length === 0 ? (
                <p className="text-slate-500 text-sm">No items scheduled for today.</p>
              ) : (
                recentUpdates.map((activity, index) => {
                  const Icon = activity.icon === 'Pill' ? Pill : activity.icon === 'Bell' ? Bell : activity.icon === 'Activity' ? Activity : CheckCircle;
                  return (
                    <div key={activity.id || index} className="flex gap-4">
                      <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${activity.bg || 'bg-slate-100'} ${activity.color || 'text-slate-600'}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{activity.title}</p>
                        <p className="text-sm text-slate-500 font-medium">{activity.time}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button className="w-full mt-8 text-sm font-semibold text-[#0B1C3F] hover:text-blue-900 transition-colors">
              View All History &rarr;
            </button>
          </div>

        </div>

      </main>

      {/* MODALS */}

      {/* Add Appointment Modal */}
      {isApptModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Add Appointment</h2>
            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Doctor Name</label>
                <input 
                  type="text" 
                  value={apptForm.doctor} 
                  onChange={e => setApptForm({...apptForm, doctor: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F]" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
                <input 
                  type="text" 
                  value={apptForm.specialty} 
                  onChange={e => setApptForm({...apptForm, specialty: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F]" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={apptForm.dateTime} 
                  onChange={e => setApptForm({...apptForm, dateTime: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F]" 
                  required 
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsApptModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-[#0B1C3F] text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Log Daily Steps</h2>
            <form onSubmit={handleLogActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Steps Walked Today</label>
                <input 
                  type="number" 
                  min="0"
                  value={activityForm.steps} 
                  onChange={e => setActivityForm({...activityForm, steps: parseInt(e.target.value) || 0})}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F]" 
                  required 
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsActivityModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-[#0B1C3F] text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
