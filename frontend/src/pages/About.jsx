import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronsRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const features = [
    {
      title: "24/7 Emergency SOS",
      desc: "Immediate assistance is always just one tap away. Our smart application alerts emergency contacts and local services, delivering precise GPS coordinates so help arrives exactly when and where it is needed.",
      image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=800&q=80",
      bullets: ["One-touch alert system", "GPS location sharing", "Direct line to local emergency contacts"],
      bgColor: "bg-red-50"
    },
    {
      title: "Activity & Health Monitoring",
      desc: "Take control of wellness with simple tracking tools. From daily step counts to vital signs, our platform turns complex health data into clear, manageable insights for a healthier lifestyle.",
      image: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=800&q=80",
      bullets: ["Daily step & movement tracking", "Customizable fitness goals", "Weekly progress reports"],
      bgColor: "bg-emerald-50"
    },
    {
      title: "Medicine Tracking",
      desc: "Ensure peace of mind with our intelligent medication reminder system. Never miss a dose with timely alerts designed specifically for ease of use.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      bullets: ["Customizable alert schedules", "Clear dosage instructions", "Refill notifications"],
      bgColor: "bg-amber-50"
    },
    {
      title: "Telemedicine Appointments",
      desc: "Connect face-to-face with healthcare professionals without leaving the comfort of your home. A simple, secure platform for video consultations.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
      bullets: ["Secure high-definition video calls", "Easy scheduling & calendar syncing", "Post-visit consultation notes"],
      bgColor: "bg-indigo-50"
    },
    {
      title: "Connected Community",
      desc: "Distance should never mean isolation. We seamlessly bridge the gap between family members, caregivers, and medical professionals, ensuring everyone stays informed and engaged in the care journey.",
      image: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=1000",
      alt: "Happy group of seniors in a community setting.",
      bullets: ["Family access portals", "Caregiver coordination", "Real-time health updates"],
      bgColor: "bg-blue-50"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* 1. Hero Section */}
      <section className="w-full bg-gradient-to-b from-blue-50 to-white min-h-[60vh] flex flex-col justify-center items-center text-center py-20 px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#0B1C3F] tracking-tight leading-tight mb-8">
            Compassionate Care for a <br className="hidden md:block" /> Digital Age
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-12 max-w-3xl mx-auto">
            A comprehensive, intuitive platform dedicated to elderly safety. 
            Experience real-time health monitoring, instant emergency alerts, 
            and a seamless connection to the support that matters most.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-[#0B1C3F] text-white text-lg font-bold py-4 px-10 rounded-full hover:bg-blue-900 transition-colors"
          >
            Get Started
          </Link>
        </motion.div>
      </section>

      {/* 2. Alternating Sections (Z-Pattern) */}
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-32">
          {features.map((feature, idx) => {
            const isTextLeft = idx % 2 === 0;

            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`py-12 flex flex-col ${isTextLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center justify-between gap-16 lg:gap-24`}
              >
                {/* Text Side */}
                <div className="flex-1">
                  <h2 className="text-4xl font-bold text-slate-900 mb-6">
                    {feature.title}
                  </h2>
                  <p className="text-lg text-slate-500 leading-relaxed mb-8">
                    {feature.desc}
                  </p>
                  <ul className="space-y-4">
                    {feature.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-center gap-4 text-lg text-slate-700 font-medium">
                        <ChevronsRight className="text-[#0B1C3F] w-6 h-6 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Image Side */}
                <div className="flex-1 w-full">
                  <div className={`w-full h-[400px] md:h-[500px] ${feature.bgColor} rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden group`}>
                    <img 
                      src={feature.image} 
                      alt={feature.alt || feature.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. Mission Footer */}
      <section className="w-full bg-[#0B1C3F] text-white py-32 px-8 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-10">Our Mission</h2>
          <p className="text-xl md:text-3xl leading-relaxed text-blue-100 font-light italic">
            "We believe that every senior deserves to live independently, safely, and comfortably. 
            Our mission is to bridge the gap between healthcare and technology, offering peace of 
            mind to families while empowering the elderly with comprehensive, intuitive tools."
          </p>
        </div>
      </section>
    </div>
  );
}