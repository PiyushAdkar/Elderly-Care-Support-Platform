import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { UserPlus, Sliders, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 1],
    ['#f8fafc', '#eff6ff'] // slate-50 to blue-50
  );

  // 1. Hero Animation Variants
  const typewriterVariants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };
  const charVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  return (
    <motion.div style={{ backgroundColor }} className="min-h-screen">
      {/* 1. The Deep Blue Hero Section */}
      <section className="bg-[#0B1C3F] w-full relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-8 md:px-16 pt-24 pb-48 relative z-10">
          {/* Left Column (Text) */}
          <div className="flex flex-col gap-6 text-left w-full">
            <motion.h1 
              variants={typewriterVariants}
              initial="hidden"
              animate="show"
              className="text-5xl lg:text-6xl font-extrabold text-white leading-tight break-words mb-6"
            >
              {"Empowering".split("").map((char, index) => (
                <motion.span key={`l1-${index}`} variants={charVariants}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              <br />
              {"Elderly Care,".split("").map((char, index) => (
                <motion.span key={`l2-${index}`} variants={charVariants}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              <br />
              {"Enriching Lives".split("").map((char, index) => (
                <motion.span key={`l3-${index}`} variants={charVariants}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
            <p className="text-blue-100 text-lg mb-8">
              Compassionate care and complete support at your fingertips. Discover features designed for comfort, safety, and engagement.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link 
                to="/login"
                className="bg-white text-[#0B1C3F] font-bold py-3 px-6 rounded-full shadow-md hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-y-1 active:scale-95 transition-all duration-300"
              >
                Login to Account
              </Link>
              <Link 
                to="/signup"
                className="bg-white text-[#0B1C3F] font-bold py-3 px-6 rounded-full shadow-md hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-y-1 active:scale-95 transition-all duration-300"
              >
                Explore Services
              </Link>
            </div>
          </div>
          
          {/* Right Column (Image) */}
          <div className="w-full flex justify-center lg:justify-end">
            <img 
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=1000" 
              alt="Caring supportive professional with an elderly person" 
              className="w-full max-w-lg h-auto aspect-[4/3] object-cover rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.9)]"
            />
          </div>
        </div>
      </section>

      {/* 2. The Overlapping White Info Card */}
      <div className="relative z-20 -mt-24 md:-mt-32 mx-4 md:mx-auto max-w-5xl bg-white rounded-3xl shadow-xl p-10 md:p-16 text-center">
        <h2 className="text-[#0B1C3F] text-2xl md:text-3xl font-bold mb-10">
          We are National Leaders in Specialized Medical Support
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-3">
          <span className="bg-[#0B1C3F] text-white rounded-full px-5 py-2 text-sm font-semibold shadow-sm">
            Quick Search:
          </span>
          <button className="bg-[#0B1C3F] hover:bg-blue-900 text-white rounded-full px-5 py-2 text-sm font-semibold transition-colors shadow-sm">
            Telemedicine
          </button>
          <button className="bg-[#0B1C3F] hover:bg-blue-900 text-white rounded-full px-5 py-2 text-sm font-semibold transition-colors shadow-sm">
            Medicine Reminders
          </button>
          <button className="bg-[#0B1C3F] hover:bg-blue-900 text-white rounded-full px-5 py-2 text-sm font-semibold transition-colors shadow-sm">
            Physical Activities
          </button>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="pt-32 pb-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <h2 className="text-4xl font-bold text-center text-[#0B1C3F] mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <UserPlus size={48} className="text-[#0B1C3F]" />
              <h3 className="text-xl font-bold mt-6 mb-3 text-[#0B1C3F]">1. Create an Account</h3>
              <p className="text-gray-600">
                Sign up securely in minutes and set up your personalized caregiver or patient profile.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <Sliders size={48} className="text-[#0B1C3F]" />
              <h3 className="text-xl font-bold mt-6 mb-3 text-[#0B1C3F]">2. Customize Alerts</h3>
              <p className="text-gray-600">
                Easily input medication schedules, upcoming appointments, and trusted emergency contacts.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <ShieldCheck size={48} className="text-[#0B1C3F]" />
              <h3 className="text-xl font-bold mt-6 mb-3 text-[#0B1C3F]">3. Peace of Mind</h3>
              <p className="text-gray-600">
                Enjoy automated reminders and 24/7 instant SOS alerts to keep your loved ones safe.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Footer */}
      <footer className="w-full bg-[#0B1C3F] text-white py-20 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold">Elderly Care</span>
          </div>
          <div className="text-sm text-blue-300">
            &copy; {new Date().getFullYear()} Elderly Care. All rights reserved.
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
