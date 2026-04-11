import React, { useState, useEffect } from 'react';
import { Users, Plus, PhoneCall, Edit, Trash2, X, Star, Loader2 } from 'lucide-react';
import { getContacts, addContact, updateContact, deleteContact } from '../api/contactService';

export default function ContactsPage() {
  // State
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filterType, setFilterType] = useState('All');
  
  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form States
  const [selectedContact, setSelectedContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    relation: '',
    type: 'family',
    isPrimary: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactTypes = ['family', 'doctor', 'caretaker', 'neighbor', 'other'];
  const typeLabels = {
    'family': 'Family',
    'doctor': 'Doctor',
    'caretaker': 'Caretaker',
    'neighbor': 'Neighbor',
    'other': 'Other'
  };

  const fetchContacts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = filterType !== 'All' ? { type: filterType } : {};
      const response = await getContacts(params);
      setContacts(response.data?.data || response.data || []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contacts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [filterType]);

  // Handlers
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (selectedContact) {
        await updateContact(selectedContact._id || selectedContact.id, formData);
      } else {
        await addContact(formData);
      }
      setIsFormModalOpen(false);
      resetForm();
      fetchContacts();
    } catch (err) {
      console.error('Contact Validation Error:', err.response?.data || err.message);
      alert(JSON.stringify(err.response?.data?.message || 'Check console for field errors'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    try {
      await deleteContact(selectedContact._id || selectedContact.id);
      setIsDeleteModalOpen(false);
      resetForm();
      fetchContacts();
    } catch (err) {
      console.error('Error deleting contact:', err);
      alert(err.response?.data?.message || 'Failed to delete contact.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  const openEditModal = (contact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name || '',
      phone: contact.phone || '',
      email: contact.email || '',
      relation: contact.relation || '',
      type: contact.type || 'family',
      isPrimary: !!contact.isPrimary
    });
    setIsFormModalOpen(true);
  };

  const openDeleteModal = (contact) => {
    setSelectedContact(contact);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setSelectedContact(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      relation: '',
      type: 'family',
      isPrimary: false
    });
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#0B1C3F] flex items-center gap-3">
            <Users size={32} />
            Contacts
          </h1>
          <button 
            onClick={openAddModal}
            className="bg-[#0B1C3F] hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={20} />
            Add Contact
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3 mb-8">
          {['All', ...contactTypes].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={
                filterType === cat 
                  ? "px-4 py-2 rounded-full font-medium text-sm transition-colors bg-[#0B1C3F] text-white shadow-sm" 
                  : "px-4 py-2 rounded-full font-medium text-sm transition-colors bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }
            >
              {cat === 'All' ? 'All' : typeLabels[cat]}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium flex items-center justify-between">
            <p>{error}</p>
            <button onClick={() => setError(null)}><X size={20}/></button>
          </div>
        )}

        {/* Contact Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-[#0B1C3F] mb-4" />
            <p className="text-slate-500 font-medium">Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 shadow-sm text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Users size={32} className="text-blue-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No contacts found</h3>
            <p className="text-slate-500 max-w-sm mb-6">
              {filterType === 'All' 
                ? "You haven't added anyone to your care circle yet."
                : `You don't have any contacts listed under "${typeLabels[filterType]}".`}
            </p>
            {filterType === 'All' && (
              <button 
                onClick={openAddModal}
                className="bg-[#0B1C3F] hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
              >
                Add Your First Contact
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <div 
                key={contact._id || contact.id} 
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow"
              >
                {/* Top Row: Avatar & Info */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {getInitials(contact.name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-[#0B1C3F] truncate">{contact.name}</h3>
                      {contact.isPrimary && (
                        <Star size={14} className="text-yellow-500 fill-yellow-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-blue-600 font-semibold mt-1">{contact.phone}</p>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-2">
                      {typeLabels[contact.type] || 'Other'} {contact.relation ? `• ${contact.relation}` : ''}
                    </span>
                  </div>
                </div>
                
                {/* Bottom Row: Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <a 
                    href={`tel:${contact.phone}`}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors"
                    title="Call"
                  >
                    <PhoneCall size={18} />
                  </a>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditModal(contact)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(contact)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* --- MODALS --- */}

      {/* Add/Edit Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0B1C3F]">
                {selectedContact ? 'Edit Contact' : 'Add Contact'}
              </h2>
              <button onClick={() => !isSubmitting && setIsFormModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F]" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                <input 
                  type="tel" 
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F]" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address (Optional)</label>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F]" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Category *</label>
                <select 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F] appearance-none bg-white" 
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {contactTypes.map(t => <option key={t} value={t}>{typeLabels[t]}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Specific Relation *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Son, Cardiologist, Next-door neighbor"
                  value={formData.relation} 
                  onChange={e => setFormData({...formData, relation: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F]" 
                  required 
                />
              </div>
              
              <div className="flex items-center gap-3 pt-3 pb-1 border-t border-slate-100 mt-2">
                <input 
                  type="checkbox" 
                  id="primaryCheck"
                  checked={formData.isPrimary}
                  onChange={e => setFormData({...formData, isPrimary: e.target.checked})}
                  className="w-5 h-5 text-[#0B1C3F] bg-white border-slate-300 rounded focus:ring-[#0B1C3F] cursor-pointer"
                />
                <label htmlFor="primaryCheck" className="text-sm font-bold text-slate-800 cursor-pointer">
                  Set as Primary Emergency Contact
                </label>
              </div>
              
              <div className="flex gap-3 mt-8 pt-4">
                <button type="button" disabled={isSubmitting} onClick={() => setIsFormModalOpen(false)} className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-3 bg-[#0B1C3F] text-white rounded-xl font-bold hover:bg-blue-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                  {isSubmitting ? 'Saving...' : 'Save Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} className="text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Delete Contact?</h2>
            <p className="text-slate-500 mb-6">
              Are you sure you want to remove <span className="font-semibold text-slate-700">"{selectedContact?.name}"</span>? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button 
                disabled={isSubmitting} 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                disabled={isSubmitting} 
                onClick={handleDeleteConfirm} 
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

