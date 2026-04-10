import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 1],
    ['#f8fafc', '#eff6ff'] // slate-50 to blue-50
  );

  const features = [
    {
      title: "Medicine Tracking",
      kicker: "Medication",
      desc: "Ensure peace of mind with our intelligent medication reminder system. Never miss a dose with timely alerts designed specifically for ease of use.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      bullets: ["Customizable alert schedules", "Clear dosage instructions", "Refill notifications"],
      flip: false
    },
    {
      title: "Telemedicine Appointments",
      kicker: "Virtual Doctor",
      desc: "Connect face-to-face with healthcare professionals without leaving the comfort of your home. A simple, secure platform for video consultations.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
      bullets: ["Secure high-definition video calls", "Easy scheduling & calendar syncing", "Post-visit consultation notes"],
      flip: true
    },
    {
      title: "24/7 Emergency SOS",
      kicker: "Safety First",
      desc: "Immediate assistance is always just one tap away, providing safety for seniors and reassurance for family members everywhere.",
      image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=800&q=80",
      bullets: ["One-touch alert system", "GPS location sharing", "Direct line to local emergency contacts"],
      flip: false
    },
    {
      title: "Activity & Health Monitoring",
      kicker: "Wellness",
      desc: "Keep a steady watch over daily physical activities and vitals to maintain a healthy, active, and fully engaged lifestyle.",
      image: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=800&q=80",
      bullets: ["Daily step & movement tracking", "Customizable fitness goals", "Weekly progress reports"],
      flip: true
    }
  ];

  return (
    <motion.div style={{ backgroundColor }} className="min-h-screen">
      {/* 1. The Deep Blue Hero Section */}
      <section className="bg-[#0B1C3F] w-full relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-8 md:px-16 lg:px-24 xl:px-32 pt-20 pb-32">
          {/* Left Column (Text) */}
          <div className="text-left">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Empowering Elderly Care, Enriching Lives
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Compassionate care and complete support at your fingertips. Discover features designed for comfort, safety, and engagement.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link 
                to="/login"
                className="bg-white text-[#0B1C3F] font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition shadow-md"
              >
                Login to Account
              </Link>
              <Link 
                to="/signup"
                className="bg-white text-[#0B1C3F] font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition shadow-md"
              >
                Explore Services
              </Link>
            </div>
          </div>
          
          {/* Right Column (Image) */}
          <div className="w-full">
            <img 
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=1000" 
              alt="Caring supportive professional with an elderly person" 
              className="w-full h-auto aspect-video object-cover rounded-[2rem] shadow-2xl border-4 border-white/10"
            />
          </div>
        </div>
      </section>

      {/* 2. The Overlapping White Info Card */}
      <div className="max-w-5xl mx-6 md:mx-16 lg:mx-32 xl:mx-auto -mt-16 relative z-10 bg-white rounded-3xl shadow-xl p-10 text-center">
        <h2 className="text-[#0B1C3F] text-2xl md:text-3xl font-bold mb-6">
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

      <main className="max-w-6xl mx-auto px-8 md:px-16 lg:px-24 mt-8">
        {/* Features Zigzag Layout */}
        <section className="pb-24 pt-8 space-y-24">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 50 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, ease: "easeOut" }} 
              viewport={{ once: true, amount: 0.2 }}
              className={`flex flex-col ${feature.flip ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}
            >
              {/* Image Side */}
              <div className="flex-1 w-full">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-[400px] object-cover rounded-2xl shadow-[8px_8px_0px_0px_#0B1C3F] border border-slate-200"
                />
              </div>
              
              {/* Text Side */}
              <div className="flex-1 w-full flex flex-col justify-center">
                <span className="block text-[#0B1C3F] font-bold tracking-wider uppercase text-sm mb-2">
                  {feature.kicker}
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{feature.title}</h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  {feature.desc}
                </p>
                <ul className="space-y-3 mb-8">
                  {feature.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium mb-2">
                      <CheckCircle className="text-[#0B1C3F] w-5 h-5 flex-shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <div>
                  <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center text-[#0B1C3F] font-bold hover:text-blue-900 transition mt-4 group">
                    Learn more about this feature <span aria-hidden="true" className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      </main>
    </motion.div>
  );
}
