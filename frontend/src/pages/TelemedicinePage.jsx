import React, { useState, useEffect } from 'react';
import { getDoctors, getAppointments, bookAppointment, cancelAppointment } from '../api/appointmentService';
import { Calendar, Clock, MapPin, Star, IndianRupee, Video, Loader2, XCircle, FileText } from 'lucide-react';

export default function TelemedicinePage() {
  const [activeTab, setActiveTab] = useState('doctors'); // 'doctors' or 'appointments'
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    reason: ''
  });

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', 
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [docsRes, apptsRes] = await Promise.all([
        getDoctors(),
        getAppointments()
      ]);
      setDoctors(docsRes.data || []);
      setAppointments(apptsRes.data || []);
    } catch (err) {
      console.error('Failed to fetch telemedicine data:', err);
      setError(err.response?.data?.message || 'Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBookClick = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      ...formData,
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      reason: ''
    });
    setIsModalOpen(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    
    try {
      const payload = {
        doctorId: selectedDoctor.id || selectedDoctor._id,
        doctorName: selectedDoctor.name, // Required by backend validation
        date: new Date(formData.date).toISOString(),
        time: formData.time,
        purpose: formData.reason, // Map form reason to backend 'purpose' field
        location: 'Online Telemedicine', // To ensure clarity on location
        status: 'scheduled'
      };
      
      await bookAppointment(payload);
      setIsModalOpen(false);
      setActiveTab('appointments');
      fetchData(); // Refresh list to show new appointment
    } catch (err) {
      console.error('Booking failed:', err);
      alert(err.response?.data?.message || 'Failed to book appointment. Please check your inputs.');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await cancelAppointment(id);
      fetchData(); // Refresh list
    } catch (err) {
      console.error('Cancellation failed:', err);
      alert('Failed to cancel appointment.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#0B1C3F]" />
          <p className="text-slate-600 font-medium">Loading Telemedicine Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Video className="text-[#0B1C3F]" size={32} />
            Telemedicine Hub
          </h1>
          <p className="mt-2 text-slate-500 font-medium">Consult with specialist doctors from the comfort of your home.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}

        {/* Custom Tabs */}
        <div className="flex space-x-2 mb-8 bg-white p-1 rounded-xl shadow-sm border border-slate-100 max-w-md">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
              activeTab === 'doctors' 
                ? 'bg-[#0B1C3F] text-white shadow' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Find a Doctor
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
              activeTab === 'appointments' 
                ? 'bg-[#0B1C3F] text-white shadow' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            My Appointments
          </button>
        </div>

        {/* Tab 1: Find a Doctor */}
        {activeTab === 'doctors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-100 shadow-sm">
                No doctors available at the moment.
              </div>
            ) : (
              doctors.map((doctor) => (
                <div key={doctor.id || doctor._id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full mb-3">
                      {doctor.specialization}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800">{doctor.name}</h3>
                  </div>
                  
                  <div className="space-y-2 mb-6 flex-grow text-sm text-slate-600">
                    <p className="flex items-start gap-2">
                      <MapPin size={16} className="text-slate-400 mt-0.5" />
                      <span>{doctor.hospital}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Star size={16} className="text-amber-400" />
                      <span className="font-medium text-slate-700">{doctor.rating} Rating</span>
                    </p>
                    {doctor.consultationFee && (
                      <p className="flex items-center gap-2">
                        <IndianRupee size={16} className="text-slate-400" />
                        <span className="font-semibold text-slate-800">₹{doctor.consultationFee} / session</span>
                      </p>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handleBookClick(doctor)}
                    className="w-full bg-[#0B1C3F] hover:bg-blue-900 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-sm"
                  >
                    Book Appointment
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: My Appointments */}
        {activeTab === 'appointments' && (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            {appointments.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center px-4">
                <Calendar className="h-16 w-16 text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">No upcoming appointments</h3>
                <p className="text-slate-500 max-w-sm mb-6">You haven't scheduled any consultations yet. Go find a doctor to get started!</p>
                <button 
                  onClick={() => setActiveTab('doctors')}
                  className="bg-[#0B1C3F] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-900 transition-colors"
                >
                  Find a Doctor
                </button>
              </div>
            ) : (
             <div className="divide-y divide-slate-100">
                {appointments.map((appt) => (
                  <div key={appt._id || appt.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-800">{appt.doctorName || appt.doctorId?.name || 'Doctor Appointment'}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          appt.status === 'scheduled' ? 'bg-blue-50 text-blue-700' :
                          appt.status === 'completed' ? 'bg-green-50 text-green-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-slate-600">
                        <p className="flex items-center gap-2 font-medium">
                          <Calendar size={16} className="text-slate-400" />
                          {new Date(appt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="flex items-center gap-2 font-medium">
                          <Clock size={16} className="text-slate-400" />
                          {appt.time}
                        </p>
                        {appt.purpose && (
                          <p className="flex items-center gap-2">
                            <FileText size={16} className="text-slate-400" />
                            <span className="truncate max-w-[200px]">{appt.purpose}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {appt.status === 'scheduled' && (
                      <button 
                        onClick={() => handleCancel(appt._id || appt.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 font-semibold rounded-xl transition-colors sm:w-auto w-full"
                      >
                        <XCircle size={18} />
                        Cancel
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {isModalOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-[#0B1C3F]">Book Appointment</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={submitBooking} className="flex flex-col overflow-hidden h-full">
              <div className="p-6 overflow-y-auto">
                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100/50">
                  <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider mb-1">Consulting with</p>
                  <p className="font-bold text-slate-800 text-lg">{selectedDoctor.name}</p>
                  <p className="text-sm text-slate-600">{selectedDoctor.specialization} • {selectedDoctor.hospital}</p>
                </div>

                <div className="space-y-5">
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-slate-700 mb-1.5 pl-1">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="date" 
                        name="date"
                        value={formData.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={handleModalChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F] focus:border-transparent text-slate-700 font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-slate-700 mb-1.5 pl-1">Time Slot</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select 
                        name="time"
                        value={formData.time}
                        onChange={handleModalChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F] focus:border-transparent text-slate-700 font-medium appearance-none"
                        required
                      >
                        {timeSlots.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-slate-700 mb-1.5 pl-1">Reason for Visit <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <textarea 
                      name="reason"
                      value={formData.reason}
                      onChange={handleModalChange}
                      placeholder="Briefly describe your symptoms or reason for consulting..."
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F] focus:border-transparent text-slate-700 resize-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-white mt-auto">
                <button 
                  type="submit"
                  className="w-full bg-[#0B1C3F] text-white font-bold py-3 rounded-xl hover:bg-blue-900 transition-colors shadow-sm"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
