import React, { useState } from 'react';
import { Phone } from 'lucide-react';

export default function SOSButton() {
  const [triggered, setTriggered] = useState(false);

  const handleSOS = () => {
    setTriggered(true);
    // In production: trigger emergency call / alert
    setTimeout(() => setTriggered(false), 4000);
  };

  return (
    <>
      {/* Floating SOS */}
      <button
        onClick={handleSOS}
        className="fixed bottom-6 right-6 z-50
                   bg-sos-500 hover:bg-sos-600 text-white
                   w-20 h-20 rounded-full shadow-2xl
                   flex flex-col items-center justify-center gap-0.5
                   animate-pulse-sos font-black text-sm uppercase
                   transition-transform hover:scale-110 active:scale-95
                   focus:outline-none focus:ring-4 focus:ring-red-300"
        title="Emergency SOS"
        aria-label="SOS Emergency Button"
      >
        <Phone size={26} fill="white" />
        <span className="text-xs tracking-widest">SOS</span>
      </button>

      {/* SOS Alert Modal */}
      {triggered && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center
                        bg-red-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-4xl p-10 mx-4 max-w-sm w-full text-center shadow-2xl">
            <div className="text-6xl mb-4 animate-float">🚨</div>
            <h2 className="text-3xl font-black text-sos-500 mb-2">SOS Activated!</h2>
            <p className="text-lg text-primary-700 font-semibold mb-1">
              Alerting your emergency contacts...
            </p>
            <p className="text-base text-primary-500 mb-6">
              📍 Sharing your location with family &amp; doctor
            </p>
            {/* Fake progress */}
            <div className="flex gap-3 justify-center flex-wrap">
              <span className="badge bg-green-100 text-green-700">📞 Calling Ravi (Son)</span>
              <span className="badge bg-blue-100 text-blue-700">📍 Location Sent</span>
              <span className="badge bg-yellow-100 text-yellow-700">🏥 Alert: Dr. Priya</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
