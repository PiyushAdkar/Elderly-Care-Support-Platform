import React, { useState, useEffect } from 'react';
import { 
  FileText, FileImage, Download, Edit, Trash2, X, Plus, Search, Filter, File as FileIcon, Loader2
} from 'lucide-react';
import { 
  getDocuments, uploadDocument, updateDocument, deleteDocument, downloadDocument 
} from '../api/documentService';

export default function DocumentsPage() {
  // State
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [isArchivedTab, setIsArchivedTab] = useState(false);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form States
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploadForm, setUploadForm] = useState({ title: '', type: 'other', tags: '', file: null });
  const [editForm, setEditForm] = useState({ title: '', type: 'other', tags: '', isArchived: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map user-friendly labels to Mongoose enum values
  const documentTypes = [
    { label: 'Prescription', value: 'prescription' },
    { label: 'Lab Report', value: 'lab_report' },
    { label: 'Discharge Summary', value: 'discharge_summary' },
    { label: 'Insurance', value: 'insurance' },
    { label: 'ID Proof', value: 'id_proof' },
    { label: 'Scan', value: 'scan' },
    { label: 'Other', value: 'other' }
  ];

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getDocuments({ 
        search: searchTerm, 
        type: filterType, 
        isArchived: isArchivedTab 
      });
      // Handle varied axios response structures just in case
      setDocuments(response.data?.data || response.data || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [searchTerm, filterType, isArchivedTab]);

  // Handlers
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) {
      alert('Please select a file to upload.');
      return;
    }
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('title', uploadForm.title);
    formData.append('type', uploadForm.type);
    
    // Convert tags string to an array or pass directly depending on backend req. Passing string payload standard.
    if (uploadForm.tags) formData.append('tags', uploadForm.tags);

    try {
      await uploadDocument(formData);
      setIsUploadModalOpen(false);
      setUploadForm({ title: '', type: 'other', tags: '', file: null });
      fetchDocuments();
    } catch (err) {
      console.error("Upload Validation Error:", err.response?.data || err.message);
      alert(JSON.stringify(err.response?.data?.message || err.response?.data?.errors || "Failed to upload document."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Convert tags comma-separated string to array if beneficial, or keep string
    try {
      const payload = {
        title: editForm.title,
        type: editForm.type,
        tags: editForm.tags,
        isArchived: editForm.isArchived
      };
      
      await updateDocument(selectedDoc._id || selectedDoc.id, payload);
      setIsEditModalOpen(false);
      setSelectedDoc(null);
      fetchDocuments();
    } catch (err) {
      console.error('Error updating:', err);
      alert(err.response?.data?.message || 'Failed to update document metadata.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    try {
      await deleteDocument(selectedDoc._id || selectedDoc.id);
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
      fetchDocuments();
    } catch (err) {
      console.error('Error deleting:', err);
      alert(err.response?.data?.message || 'Failed to delete document.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      const filename = doc.originalName || `${doc.title}.pdf`;
      await downloadDocument(doc._id || doc.id, filename);
    } catch (err) {
      console.error('Error downloading:', err);
      alert('Failed to download the document. It might be corrupted or missing.');
    }
  };

  const openEditModal = (doc) => {
    setSelectedDoc(doc);
    // Parse tags nicely (if backend returned array, join it)
    const formattedTags = Array.isArray(doc.tags) ? doc.tags.join(', ') : (doc.tags || '');
    setEditForm({
      title: doc.title,
      type: doc.type || 'other',
      tags: formattedTags,
      isArchived: !!doc.isArchived
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  // Helper for displaying correct generic icon
  const getDocIcon = (type, mimetype) => {
    if (mimetype && mimetype.startsWith('image/')) return <FileImage size={24} className="text-blue-500" />;
    return <FileText size={24} className="text-[#0B1C3F]" />;
  };

  // Helper for formatting bytes
  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  // Helper for date formatting
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0B1C3F]">Medical Documents & Records</h1>
            <p className="mt-2 text-slate-500 font-medium">Securely store and manage your lab results, prescriptions, and medical files.</p>
          </div>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 bg-[#0B1C3F] hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-colors"
          >
            <Plus size={20} />
            Upload Document
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 w-full gap-4 flex-col sm:flex-row">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by title or tags..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B1C3F]"
              />
            </div>
            
            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B1C3F] appearance-none"
              >
                <option value="">All Types</option>
                {documentTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
            <button 
              onClick={() => setIsArchivedTab(false)}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${!isArchivedTab ? 'bg-white text-[#0B1C3F] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Active
            </button>
            <button 
              onClick={() => setIsArchivedTab(true)}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${isArchivedTab ? 'bg-white text-[#0B1C3F] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Archived
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium flex items-center justify-between">
            <p>{error}</p>
            <button onClick={() => setError(null)}><X size={20}/></button>
          </div>
        )}

        {/* Document Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-[#0B1C3F] mb-4" />
            <p className="text-slate-500 font-medium">Loading documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 shadow-sm text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <FileIcon size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No documents found</h3>
            <p className="text-slate-500 max-w-sm mb-6">
              {searchTerm || filterType 
                ? "No items match your current filters. Try relaxing your search criteria." 
                : "Your digital vault is empty. Securely store your medical records and prescriptions here."}
            </p>
            {(!searchTerm && !filterType) && (
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-[#0B1C3F] hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-colors"
              >
                Upload First Document
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {documents.map((doc) => (
              <div key={doc._id || doc.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    {getDocIcon(doc.type, doc.mimetype)}
                  </div>
                  <span className="text-xs font-semibold text-[#0B1C3F] bg-blue-50 px-2 py-1 rounded-md">
                    {doc.type || 'Document'}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1" title={doc.title}>{doc.title}</h3>
                <p className="text-sm font-medium text-slate-500 mb-4">{formatDate(doc.createdAt)} • {formatBytes(doc.size)}</p>
                
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                  <button 
                    onClick={() => handleDownload(doc)}
                    className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-[#0B1C3F] hover:text-blue-700 bg-slate-50 hover:bg-blue-50 py-2 rounded-lg transition-colors border border-slate-200 hover:border-blue-200"
                  >
                    <Download size={16} /> 
                    Download
                  </button>
                  <div className="flex gap-1 ml-2">
                    <button 
                      onClick={() => openEditModal(doc)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Metadata"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(doc)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      </main>

      {/* --- MODALS --- */}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Upload Document</h2>
              <button onClick={() => !isSubmitting && setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select File *</label>
                <input 
                  type="file" 
                  onChange={e => setUploadForm({...uploadForm, file: e.target.files[0]})}
                  className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#0B1C3F] hover:file:bg-blue-100 outline-none" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Document Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Blood Test Results"
                  value={uploadForm.title} 
                  onChange={e => setUploadForm({...uploadForm, title: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F]" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Document Type *</label>
                <select 
                  value={uploadForm.type} 
                  onChange={e => setUploadForm({...uploadForm, type: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F] appearance-none" 
                  required
                >
                  {documentTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tags (Comma separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. cardiology, annual, Dr. Smith"
                  value={uploadForm.tags} 
                  onChange={e => setUploadForm({...uploadForm, tags: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F]" 
                />
              </div>
              
              <div className="flex gap-3 mt-8">
                <button type="button" disabled={isSubmitting} onClick={() => setIsUploadModalOpen(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-[#0B1C3F] text-white rounded-xl font-semibold hover:bg-blue-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {isSubmitting ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Edit Document</h2>
              <button onClick={() => !isSubmitting && setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Document Title *</label>
                <input 
                  type="text" 
                  value={editForm.title} 
                  onChange={e => setEditForm({...editForm, title: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F]" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Document Type *</label>
                <select 
                  value={editForm.type} 
                  onChange={e => setEditForm({...editForm, type: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F] appearance-none" 
                  required
                >
                  {documentTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tags (Comma separated)</label>
                <input 
                  type="text" 
                  value={editForm.tags} 
                  onChange={e => setEditForm({...editForm, tags: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F]" 
                />
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="archiveCheck"
                  checked={editForm.isArchived}
                  onChange={e => setEditForm({...editForm, isArchived: e.target.checked})}
                  className="w-4 h-4 text-[#0B1C3F] bg-white border-slate-300 rounded focus:ring-[#0B1C3F]"
                />
                <label htmlFor="archiveCheck" className="text-sm font-medium text-slate-700">Archived Record</label>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button type="button" disabled={isSubmitting} onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-[#0B1C3F] text-white rounded-xl font-semibold hover:bg-blue-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
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
            <h2 className="text-xl font-bold text-slate-900 mb-2">Delete Document?</h2>
            <p className="text-slate-500 mb-6">
              Are you sure you want to delete <span className="font-semibold text-slate-700">"{selectedDoc?.title}"</span>? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button 
                disabled={isSubmitting} 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                disabled={isSubmitting} 
                onClick={handleDeleteConfirm} 
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
