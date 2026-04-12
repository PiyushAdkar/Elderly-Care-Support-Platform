import React, { useState, useEffect } from 'react';
import { getTodayActivity, getWeeklySummary, logActivity } from '../api/activityService';

export default function ActivityPage() {
  const [today, setToday] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    steps: 0,
    activeMinutes: 0,
    waterIntakeLiters: 0.0,
    sleepHours: 0.0,
    heartRateAvg: 0,
    moodScore: 3,
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Today's Activity
      try {
        const todayRes = await getTodayActivity();
        setToday(todayRes?.data || null);
      } catch (err) {
        if (err?.response?.status === 404) {
          setToday(null);
        } else {
          console.error("Failed to fetch today's activity:", err);
        }
      }

      // Fetch Weekly Summary
      try {
        const summaryRes = await getWeeklySummary();
        setSummary(summaryRes.data?.summary || null);
      } catch (err) {
        console.error("Failed to fetch weekly summary:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'date' ? value : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure date is included as an ISO string
      const payload = {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      };
      await logActivity(payload);
      setIsModalOpen(false);
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to log activity:", err);
      alert("Failed to log activity. Please check your inputs.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B1C3F]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#0B1C3F]">Activity & Health Tracking</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0B1C3F] text-white px-6 py-3 rounded-full font-medium hover:bg-blue-900 transition-colors shadow-sm self-start sm:self-auto"
          >
            + Log Today's Activity
          </button>
        </div>

        {/* Today's Snapshot Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#0B1C3F] mb-4">Today's Snapshot</h2>
          
          {today ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100 flex flex-col items-center justify-center text-center">
                <span className="text-3xl mb-2">👣</span>
                <p className="text-sm text-slate-500 font-medium">Steps</p>
                <p className="text-2xl font-bold text-[#0B1C3F] mt-1">{today.steps || 0}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100 flex flex-col items-center justify-center text-center">
                <span className="text-3xl mb-2">⚡</span>
                <p className="text-sm text-slate-500 font-medium">Active Min</p>
                <p className="text-2xl font-bold text-[#0B1C3F] mt-1">{today.activeMinutes || 0}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100 flex flex-col items-center justify-center text-center">
                <span className="text-3xl mb-2">💧</span>
                <p className="text-sm text-slate-500 font-medium">Water</p>
                <p className="text-2xl font-bold text-[#0B1C3F] mt-1">{today.waterIntakeLiters || 0}L</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100 flex flex-col items-center justify-center text-center">
                <span className="text-3xl mb-2">🌙</span>
                <p className="text-sm text-slate-500 font-medium">Sleep</p>
                <p className="text-2xl font-bold text-[#0B1C3F] mt-1">{today.sleepHours || 0}h</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
              <span className="text-5xl mb-4 block">👋</span>
              <h3 className="text-xl font-bold text-[#0B1C3F]">No activity logged yet today</h3>
              <p className="text-slate-500 mt-2 max-w-md mx-auto">
                Ready to track your health? Start by logging your steps, water intake, and rest for the day.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-6 text-blue-600 font-medium hover:text-blue-800 transition-colors"
              >
                Log metrics now &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Weekly Summary Section */}
        {summary && Object.keys(summary).length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-slate-100">
            <h2 className="text-xl font-bold text-[#0B1C3F] mb-4">7-Day Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col">
                <span className="text-sm text-slate-500 font-medium">Total Steps</span>
                <span className="text-2xl font-bold text-[#0B1C3F]">{summary.totalSteps || 0}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-slate-500 font-medium">Avg Heart Rate</span>
                <span className="text-2xl font-bold text-[#0B1C3F]">{summary.avgHeartRate || 0} <span className="text-sm font-normal">bpm</span></span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-slate-500 font-medium">Avg Sleep</span>
                <span className="text-2xl font-bold text-[#0B1C3F]">{summary.avgSleepHours || 0} <span className="text-sm font-normal">hrs</span></span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-slate-500 font-medium">Avg Mood (1-5)</span>
                <span className="text-2xl font-bold text-[#0B1C3F]">{summary.avgMoodScore || 0}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logging Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-[#0B1C3F]">Log Activity</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F]"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-1">Steps</label>
                  <input 
                    type="number" 
                    name="steps"
                    min="0"
                    value={formData.steps}
                    onChange={handleChange}
                    className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-1">Active Minutes</label>
                  <input 
                    type="number" 
                    name="activeMinutes"
                    min="0"
                    value={formData.activeMinutes}
                    onChange={handleChange}
                    className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-1">Water (Liters)</label>
                  <input 
                    type="number" 
                    name="waterIntakeLiters"
                    step="0.1"
                    min="0"
                    value={formData.waterIntakeLiters}
                    onChange={handleChange}
                    className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-1">Sleep (Hours)</label>
                  <input 
                    type="number" 
                    name="sleepHours"
                    step="0.1"
                    min="0"
                    value={formData.sleepHours}
                    onChange={handleChange}
                    className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-1">Avg Heart Rate (bpm)</label>
                  <input 
                    type="number" 
                    name="heartRateAvg"
                    min="0"
                    value={formData.heartRateAvg}
                    onChange={handleChange}
                    className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-1">Mood Score ({formData.moodScore}/5)</label>
                  <input 
                    type="range" 
                    name="moodScore"
                    min="1"
                    max="5"
                    step="1"
                    value={formData.moodScore}
                    onChange={handleChange}
                    className="accent-[#0B1C3F] mt-2"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-full font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#0B1C3F] text-white rounded-full font-medium hover:bg-blue-900 transition-colors shadow-sm"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
