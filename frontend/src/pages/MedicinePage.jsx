import React, { useState, useEffect } from 'react';
import { Pill, Calendar, Clock, Plus, Trash2, Edit3, Eye, Loader2, Info } from 'lucide-react';
import {
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  updateMedicineStatus,
  getTodaySchedule,
  getMedicine
} from '../api/medicineService';

export default function MedicinePage() {
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [allMedicines, setAllMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form & Selection State
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const defaultForm = {
    name: '',
    dosage: '',
    frequency: 'daily',
    time: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'active',
    notes: ''
  };
  const [formData, setFormData] = useState(defaultForm);

  const fetchData = async (showLoading = true, filterValue = statusFilter) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    try {
      const filters = filterValue ? { status: filterValue } : {};
      const [todayRes, allRes] = await Promise.all([
        getTodaySchedule(),
        getMedicines(filters)
      ]);
      setTodaySchedule(todayRes.data || todayRes || []);
      setAllMedicines(allRes.data || allRes || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch medicines');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true, '');
  }, []); // Run exactly once on mount, as requested

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setStatusFilter(newFilter);
    fetchData(true, newFilter);
  };

  // Handlers
  const handleOpenAddForm = () => {
    setIsEditMode(false);
    setFormData(defaultForm);
    setIsFormModalOpen(true);
  };

  const handleOpenEditForm = (med) => {
    setIsEditMode(true);
    setSelectedMedicine(med);
    const sd = med.startDate ? new Date(med.startDate).toISOString().split('T')[0] : '';
    const ed = med.endDate ? new Date(med.endDate).toISOString().split('T')[0] : '';
    setFormData({
      name: med.name || '',
      dosage: med.dosage || '',
      frequency: med.frequency || 'daily',
      time: med.timings?.[0]?.time || '',
      startDate: sd,
      endDate: ed,
      status: med.status || 'active',
      notes: med.notes || ''
    });
    setIsFormModalOpen(true);
  };

  const handleViewDetails = async (id) => {
    try {
      const res = await getMedicine(id);
      setSelectedMedicine(res.data || res);
      setIsDetailsModalOpen(true);
    } catch (err) {
      alert("Failed to load generic details");
    }
  };

  const confirmDelete = (med) => {
    setSelectedMedicine(med);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    try {
      await deleteMedicine(selectedMedicine._id || selectedMedicine.id);
      setIsDeleteModalOpen(false);
      fetchData(false);
    } catch (err) {
      alert("Error deleting medicine.");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateMedicineStatus(id, status);
      fetchData(false);
    } catch (err) {
      alert("Error updating status");
    }
  };

  const handleMarkTaken = async (id) => {
    // Treat as simple status update for now
    handleStatusChange(id, 'completed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        timings: [{ time: formData.time }],
        startDate: new Date(formData.startDate).toISOString(),
        status: formData.status,
        notes: formData.notes
      };
      
      if (formData.endDate) {
        payload.endDate = new Date(formData.endDate).toISOString();
      }

      if (isEditMode) {
        await updateMedicine(selectedMedicine._id || selectedMedicine.id, payload);
      } else {
        await addMedicine(payload);
      }
      setIsFormModalOpen(false);
      fetchData(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(JSON.stringify(err.response?.data?.message || "Form validation error"));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#0B1C3F]" />
          <p className="text-slate-600 font-medium text-sm">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0B1C3F]">Medicine Management</h1>
            <p className="mt-1 text-slate-500 font-medium">Track your daily intakes and full inventory.</p>
          </div>
          <button 
            onClick={handleOpenAddForm}
            className="bg-[#0B1C3F] hover:bg-blue-900 text-white font-semibold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add New Medicine
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}

        {/* Section 1: Today's Schedule */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock size={22} className="text-blue-600" /> Today's Schedule
          </h2>
          {todaySchedule.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm text-center">
              <Pill size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">No medications scheduled for today.</p>
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
              {todaySchedule.map((med) => (
                <div key={med._id || med.id} className="min-w-[280px] bg-white border border-gray-100 rounded-2xl p-5 shadow-sm snap-start flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-50 text-[#0B1C3F] rounded-lg">
                        <Pill size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{med.name}</h4>
                        <p className="text-sm text-slate-500">{med.dosage}</p>
                      </div>
                    </div>
                    <p className="flex items-center gap-2 text-[#0B1C3F] font-bold text-sm bg-slate-50 w-fit px-3 py-1 rounded-md mb-4">
                      <Clock size={14} /> {med.timings?.[0]?.time || "Not set"}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleMarkTaken(med._id || med.id)}
                    className="w-full bg-[#0B1C3F] hover:bg-blue-900 text-white font-semibold py-2 rounded-xl transition-colors"
                  >
                    Mark Taken
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 2: Master Inventory & Filters */}
        <section>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar size={22} className="text-indigo-600" /> Master Inventory
            </h2>
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-slate-600">Filter by Status:</label>
              <select 
                value={statusFilter} 
                onChange={handleFilterChange}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B1C3F]"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
          </div>

          {allMedicines.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 shadow-sm text-center">
              <Info size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">No records found in the master inventory.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold text-sm">
                    <th className="px-6 py-4">Medicine</th>
                    <th className="px-6 py-4">Dosage & Freq</th>
                    <th className="px-6 py-4">Timing</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium">
                  {allMedicines.map(med => (
                    <tr key={med._id || med.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                          <Pill size={16} />
                        </div>
                        <span className="text-slate-900 font-bold">{med.name}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {med.dosage} &bull; <span className="capitalize">{med.frequency}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {med.timings?.[0]?.time || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                          med.status === 'active' ? 'bg-green-100 text-green-700' :
                          med.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {med.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                        <button onClick={() => handleViewDetails(med._id || med.id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => handleOpenEditForm(med)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => confirmDelete(med)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>

      {/* --- MODALS --- */}
      
      {/* Form Modal (Add / Edit) */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{isEditMode ? 'Edit Medicine' : 'Add New Medicine'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Medicine Name <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0B1C3F] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Dosage <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.dosage} placeholder="e.g. 50mg" onChange={e => setFormData({...formData, dosage: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0B1C3F] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Time <span className="text-red-500">*</span></label>
                  <input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0B1C3F] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Frequency</label>
                  <select value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0B1C3F] outline-none bg-white">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="as_needed">As Needed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0B1C3F] outline-none bg-white">
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Start Date <span className="text-red-500">*</span></label>
                  <input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0B1C3F] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">End Date</label>
                  <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0B1C3F] outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Notes</label>
                  <textarea rows="2" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0B1C3F] outline-none" placeholder="e.g. Take with food"></textarea>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-8 border-t border-slate-100 pt-6">
                <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-[#0B1C3F] text-white rounded-xl font-semibold hover:bg-blue-900 transition-colors">
                  {isEditMode ? 'Save Changes' : 'Add Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && selectedMedicine && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 overflow-hidden">
            <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
              <div className="p-3 bg-blue-50 text-[#0B1C3F] rounded-xl"><Pill size={24} /></div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedMedicine.name}</h2>
                <p className="text-[#0B1C3F] font-bold text-sm">{selectedMedicine.dosage}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-slate-700 mb-8">
              <p><strong>Frequency:</strong> <span className="capitalize">{selectedMedicine.frequency}</span></p>
              <p><strong>Timing:</strong> {selectedMedicine.timings?.[0]?.time || 'N/A'}</p>
              <p><strong>Status:</strong> <span className="capitalize">{selectedMedicine.status}</span></p>
              <p><strong>Start Date:</strong> {new Date(selectedMedicine.startDate).toLocaleDateString()}</p>
              {selectedMedicine.endDate && <p><strong>End Date:</strong> {new Date(selectedMedicine.endDate).toLocaleDateString()}</p>}
              {selectedMedicine.notes && <p><strong>Notes:</strong> {selectedMedicine.notes}</p>}
            </div>
            <button onClick={() => setIsDetailsModalOpen(false)} className="w-full bg-[#0B1C3F] text-white font-semibold py-2.5 rounded-xl transition-colors hover:bg-blue-900">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedMedicine && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h2 className="text-xl font-bold text-red-600 mb-2">Delete Medicine?</h2>
            <p className="text-slate-600 mb-6">Are you sure you want to remove <strong>{selectedMedicine.name}</strong> from your inventory? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={executeDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
