import React, { useState } from 'react';
import { familyContacts, doctorContacts } from '../data/dummyData';
import { Card, Avatar, Badge, SectionHeader, ToggleChip } from '../components/UI';
import { Phone, MessageCircle, Plus, X, Video } from 'lucide-react';

export default function ContactsPage() {
  const [tab,      setTab]      = useState('family');
  const [calling,  setCalling]  = useState(null);
  const [showAdd,  setShowAdd]  = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });
  const [family,   setFamily]   = useState(familyContacts);

  const startCall = (contact) => {
    setCalling(contact);
    setTimeout(() => setCalling(null), 4000);
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;
    setFamily(f => [...f, {
      id: Date.now(), ...newContact,
      avatar: '👤', online: false
    }]);
    setNewContact({ name: '', phone: '', relation: '' });
    setShowAdd(false);
  };

  return (
    <div className="page-container">
      <SectionHeader title="👥 Contacts"
        action={() => setShowAdd(true)} actionLabel="+ Add Contact" />

      {/* Calling Modal */}
      {calling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center
                        bg-primary-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-4xl p-10 mx-4 max-w-sm w-full text-center shadow-2xl">
            <div className="text-7xl mb-4 animate-float">{calling.avatar}</div>
            <p className="text-sm font-bold text-primary-400 mb-1">Calling...</p>
            <h2 className="text-3xl font-black text-primary-900 mb-1">{calling.name}</h2>
            <p className="text-lg text-primary-500 font-semibold mb-6">{calling.phone}</p>
            <div className="flex gap-3 justify-center">
              <div className="w-3 h-3 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-3 h-3 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
              <div className="w-3 h-3 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
            </div>
            <button onClick={() => setCalling(null)}
              className="mt-6 bg-red-500 hover:bg-red-600 text-white font-black
                         px-10 py-4 rounded-full transition-all text-lg">
              📵 End Call
            </button>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center
                        bg-primary-900/60 backdrop-blur-sm px-4 animate-fade-in">
          <div className="bg-white rounded-t-4xl sm:rounded-4xl w-full max-w-md
                          shadow-2xl p-8 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-primary-900">Add Contact</h3>
              <button onClick={() => setShowAdd(false)}
                className="p-2 rounded-full hover:bg-primary-50 text-primary-400 transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-base font-black text-primary-700 mb-2">👤 Name</label>
                <input value={newContact.name}
                  onChange={e => setNewContact(n => ({ ...n, name: e.target.value }))}
                  placeholder="e.g. Ravi Kumar"
                  className="input-field" />
              </div>
              <div>
                <label className="block text-base font-black text-primary-700 mb-2">📱 Phone</label>
                <input type="tel" value={newContact.phone}
                  onChange={e => setNewContact(n => ({ ...n, phone: e.target.value }))}
                  placeholder="+91 XXXXX XXXXX"
                  className="input-field" />
              </div>
              <div>
                <label className="block text-base font-black text-primary-700 mb-2">💞 Relation</label>
                <input value={newContact.relation}
                  onChange={e => setNewContact(n => ({ ...n, relation: e.target.value }))}
                  placeholder="e.g. Son, Daughter, Friend"
                  className="input-field" />
              </div>
              <button onClick={addContact} className="btn-primary w-full mt-2">
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <ToggleChip label="👨‍👩‍👧 Family"  active={tab === 'family'}  onClick={() => setTab('family')}  />
        <ToggleChip label="👨‍⚕️ Doctors" active={tab === 'doctors'} onClick={() => setTab('doctors')} />
      </div>

      {/* ── Family Contacts ── */}
      {tab === 'family' && (
        <div className="flex flex-col gap-4">
          {family.map(contact => (
            <Card key={contact.id} className="flex items-center gap-4">
              <div className="relative">
                <Avatar emoji={contact.avatar} size="w-16 h-16" bg="bg-primary-100" />
                {contact.online && (
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500
                                   rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-black text-primary-900">{contact.name}</h3>
                <p className="text-base text-primary-500 font-bold">{contact.phone}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge color="bg-primary-50 text-primary-600">{contact.relation}</Badge>
                  {contact.online && (
                    <Badge color="bg-green-100 text-green-700">🟢 Online</Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => startCall(contact)}
                  className="w-12 h-12 bg-sage-500 hover:bg-sage-600 text-white
                             rounded-2xl flex items-center justify-center
                             transition-all hover:scale-105 shadow-md"
                  title="Call">
                  <Phone size={22} fill="white" />
                </button>
                <button
                  className="w-12 h-12 bg-primary-100 hover:bg-primary-200 text-primary-600
                             rounded-2xl flex items-center justify-center transition-all"
                  title="Message">
                  <MessageCircle size={22} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Doctor Contacts ── */}
      {tab === 'doctors' && (
        <div className="flex flex-col gap-4">
          {doctorContacts.map(doc => (
            <Card key={doc.id} className="flex items-center gap-4">
              <Avatar emoji={doc.avatar} size="w-16 h-16" bg="bg-blue-100" />
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-black text-primary-900">{doc.name}</h3>
                <p className="text-base text-primary-500 font-bold">{doc.phone}</p>
                <Badge color="bg-blue-100 text-blue-700">{doc.specialty}</Badge>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => startCall(doc)}
                  className="w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white
                             rounded-2xl flex items-center justify-center
                             transition-all hover:scale-105 shadow-md"
                  title="Call Doctor">
                  <Phone size={22} fill="white" />
                </button>
                <button
                  className="w-12 h-12 bg-sage-100 hover:bg-sage-200 text-sage-700
                             rounded-2xl flex items-center justify-center transition-all"
                  title="Video Call">
                  <Video size={22} />
                </button>
              </div>
            </Card>
          ))}

          {/* Emergency Banner */}
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-5 mt-2">
            <h3 className="text-xl font-black text-red-700 mb-1">🚨 Medical Emergency?</h3>
            <p className="text-base text-red-500 font-semibold mb-4">
              Press the SOS button (bottom-right) to instantly alert all your contacts.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href="tel:108"
                className="bg-red-600 hover:bg-red-700 text-white font-black
                           px-6 py-3 rounded-2xl transition-all flex items-center gap-2">
                <Phone size={20} fill="white" /> Call 108
              </a>
              <a href="tel:112"
                className="bg-orange-500 hover:bg-orange-600 text-white font-black
                           px-6 py-3 rounded-2xl transition-all flex items-center gap-2">
                <Phone size={20} fill="white" /> Call 112
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
