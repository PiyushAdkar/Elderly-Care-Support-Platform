import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { triggerSOS } from '../api/sosService';

export default function SOSButton() {
  const [isSosLoading, setIsSosLoading] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const [notifiedList, setNotifiedList] = useState([]);

  const handleSOS = () => {
    setIsSosLoading(true);

    const executeSOS = async (payload) => {
      try {
        const response = await triggerSOS(payload);
        // Backend returns: { success: true, message: "...", data: { notifiedContacts: [...] } }
        setNotifiedList(response.data?.data?.notifiedContacts || []);
        setIsTriggered(true);
      } catch (err) {
        console.error("Failed to trigger SOS", err);
        alert("Failed to send SOS alert. Please call emergency services directly.");
      } finally {
        setIsSosLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude, accuracy } = position.coords;
          executeSOS({
            coordinates: [longitude, latitude],
            accuracy,
            triggerType: 'manual'
          });
        },
        (error) => {
          console.warn("Geolocation failed or denied, sending SOS without accurate location.");
          executeSOS({
            coordinates: [0, 0], // Default fallback as backend requires 2 coords
            triggerType: 'manual'
          });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      executeSOS({
        coordinates: [0, 0], 
        triggerType: 'manual'
      });
    }
  };

  const handleResolve = () => {
    setIsTriggered(false);
    setNotifiedList([]);
  };

  return (
    <>
      {/* Floating SOS */}
      <button
        onClick={handleSOS}
        disabled={isSosLoading || isTriggered}
        className={`fixed bottom-6 right-6 z-50
                   ${isSosLoading ? 'bg-red-400' : 'bg-sos-500 hover:bg-sos-600'} text-white
                   w-20 h-20 rounded-full shadow-2xl
                   flex flex-col items-center justify-center gap-0.5
                   animate-pulse font-black text-sm uppercase
                   transition-transform hover:scale-110 active:scale-95
                   focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-75 disabled:cursor-not-allowed`}
        title="Emergency SOS"
        aria-label="SOS Emergency Button"
      >
        <Phone size={26} fill="white" className={isSosLoading ? "animate-spin" : ""} />
        <span className="text-xs tracking-widest">{isSosLoading ? '...' : 'SOS'}</span>
      </button>

      {/* SOS Alert Modal */}
      {isTriggered && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center
                        bg-red-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-4xl p-10 mx-4 w-full max-w-md text-center shadow-2xl relative border-4 border-red-500 animate-[pulse_2s_ease-in-out_infinite]">
            <div className="text-6xl mb-4 animate-float">🚨</div>
            <h2 className="text-3xl font-black text-sos-500 mb-2">Active Alert!</h2>
            <p className="text-lg text-primary-700 font-semibold mb-4">
              Your emergency contacts have been notified.
            </p>
            
            <div className="mb-6 flex flex-col gap-2 max-h-48 overflow-y-auto w-full px-2 text-left bg-red-50 p-4 rounded-xl border border-red-100">
              <h3 className="font-bold text-red-800 text-sm uppercase mb-1">Notified Contacts</h3>
              {notifiedList.length > 0 ? (
                notifiedList.map((contact, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-red-100 last:border-0">
                    <span className="font-semibold text-gray-800">{contact.name || contact.contactName}</span>
                    <span className="text-gray-600 tabular-nums">{contact.phone}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No contacts were reachable or none configured.</p>
              )}
            </div>

            <button 
              onClick={handleResolve}
              className="mt-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-colors w-full"
            >
              Cancel / Resolve Status
            </button>
          </div>
        </div>
      )}
    </>
  );
}
