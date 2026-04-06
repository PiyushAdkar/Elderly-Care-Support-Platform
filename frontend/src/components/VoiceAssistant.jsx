import React, { useState, useEffect } from 'react';
import { X, Mic, MicOff } from 'lucide-react';
import { voiceCommands } from '../data/dummyData';

export default function VoiceAssistant({ open, onClose }) {
  const [listening, setListening] = useState(false);
  const [recognized, setRecognized] = useState('');
  const [response,   setResponse]   = useState('');

  useEffect(() => {
    if (!open) { setListening(false); setRecognized(''); setResponse(''); }
  }, [open]);

  const startListening = () => {
    setListening(true);
    setRecognized('');
    setResponse('');

    // Simulate recognition after 2s
    setTimeout(() => {
      const cmd = voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
      setRecognized(cmd);
      setListening(false);

      // Simulate AI response
      setTimeout(() => {
        const replies = {
          'Go to Medicine':             '✅ Opening Medicine Tracker now!',
          'Call my son':                '📞 Calling Ravi (Son)...',
          'What are my medicines today?':'💊 You have 3 medicines today: Metformin, Amlodipine, Aspirin.',
          'Book an appointment':        '📅 Opening doctor list for you!',
          'Play bhajan music':          '🎵 Playing Hanuman Chalisa...',
          'Show my reports':            '📁 Opening Documents page!',
          'SOS emergency':              '🚨 SOS Activated! Alerting contacts!',
          'How many steps today?':      '🚶 You have walked 4,100 steps today!',
        };
        setResponse(replies[cmd] || '✅ Done! How else can I help?');
      }, 800);
    }, 2000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center
                    bg-primary-900/60 backdrop-blur-sm animate-fade-in"
         onClick={onClose}>
      <div className="bg-white rounded-t-4xl sm:rounded-4xl w-full sm:max-w-md
                      shadow-2xl p-8 mx-0 sm:mx-4 animate-slide-up"
           onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-primary-900">Voice Assistant</h2>
            <p className="text-sm text-primary-500 font-semibold">Speak your command</p>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-full hover:bg-primary-50 text-primary-400
                       transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Mic Circle */}
        <div className="flex flex-col items-center py-6">
          <div className="relative flex items-center justify-center mb-6">
            {listening && (
              <>
                <div className="mic-ring-1" style={{ width: 100, height: 100, inset: -10 }} />
                <div className="mic-ring-2" style={{ width: 100, height: 100, inset: -10 }} />
                <div className="mic-ring-3" style={{ width: 100, height: 100, inset: -10 }} />
              </>
            )}
            <button
              onClick={listening ? () => setListening(false) : startListening}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center
                          text-white shadow-2xl transition-all duration-300 cursor-pointer
                          ${listening
                            ? 'bg-red-500 hover:bg-red-600 scale-110'
                            : 'bg-primary-600 hover:bg-primary-700'}`}
            >
              {listening ? <MicOff size={36} /> : <Mic size={36} />}
            </button>
          </div>

          {/* Status */}
          {!listening && !recognized && (
            <p className="text-lg font-bold text-primary-400 text-center">
              Tap the mic and speak
            </p>
          )}
          {listening && (
            <p className="text-lg font-bold text-red-500 animate-pulse text-center">
              🎙️ Listening...
            </p>
          )}
          {recognized && (
            <div className="w-full text-center animate-fade-in">
              <div className="bg-primary-50 rounded-2xl px-5 py-3 mb-3 border border-primary-200">
                <p className="text-sm font-bold text-primary-500 mb-1">You said:</p>
                <p className="text-lg font-black text-primary-800">"{recognized}"</p>
              </div>
              {response && (
                <div className="bg-sage-50 rounded-2xl px-5 py-3 border border-sage-200">
                  <p className="text-sm font-bold text-sage-600 mb-1">Response:</p>
                  <p className="text-lg font-bold text-sage-800">{response}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Commands */}
        <div>
          <p className="text-sm font-bold text-primary-400 mb-3">Quick commands:</p>
          <div className="flex flex-wrap gap-2">
            {voiceCommands.slice(0, 4).map((cmd, i) => (
              <button key={i}
                onClick={() => { setRecognized(cmd); setListening(false); }}
                className="bg-primary-50 hover:bg-primary-100 text-primary-700 font-semibold
                           text-sm px-3 py-2 rounded-xl border border-primary-200
                           transition-all cursor-pointer">
                "{cmd}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
