import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* 1. Hero Section */}
      <section className="w-full bg-gradient-to-b from-blue-50 to-white py-32 px-8 flex flex-col items-center text-center">
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
      <section className="w-full py-24 px-8 md:px-16 lg:px-32 bg-white">
        <div className="max-w-7xl mx-auto space-y-40">
          
          {/* Feature 1: Text Left, Image Right */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-16 lg:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#0B1C3F] mb-6">
                Instant SOS Alerts
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Safety is our highest priority. With just one tap, our smart application 
                alerts emergency contacts and local services, delivering precise GPS 
                coordinates so help arrives exactly when and where it is needed.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="flex-1 w-full"
            >
              <div className="w-full h-[400px] md:h-[500px] bg-red-50 rounded-3xl flex items-center justify-center overflow-hidden">
                {/* Image Placeholder */}
                <img 
                  src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=800&q=80" 
                  alt="Emergency Assistance" 
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
            </motion.div>
          </div>

          {/* Feature 2: Image Left, Text Right */}
          <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-16 lg:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#0B1C3F] mb-6">
                Proactive Health Monitoring
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Take control of wellness with simple tracking tools. From daily step counts 
                to vital signs and medication schedules, our platform turns complex health 
                data into clear, manageable insights for a healthier lifestyle.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="flex-1 w-full"
            >
              <div className="w-full h-[400px] md:h-[500px] bg-emerald-50 rounded-3xl flex items-center justify-center overflow-hidden">
                {/* Image Placeholder */}
                <img 
                  src="https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=800&q=80" 
                  alt="Health Tracking" 
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
            </motion.div>
          </div>

          {/* Feature 3: Text Left, Image Right */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-16 lg:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#0B1C3F] mb-6">
                Connected Community
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Distance should never mean isolation. We seamlessly bridge the gap 
                between family members, caregivers, and medical professionals, ensuring 
                everyone stays informed and engaged in the care journey.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="flex-1 w-full"
            >
              <div className="w-full h-[400px] md:h-[500px] bg-blue-50 rounded-3xl flex items-center justify-center overflow-hidden">
                {/* Image Placeholder */}
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80" 
                  alt="Community Care" 
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 3. Mission Footer */}
      <section className="w-full bg-[#0B1C3F] text-white py-32 px-8 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-10">Our Mission</h2>
          <p className="text-xl md:text-3xl leading-relaxed text-blue-100 font-light">
            "We believe that every senior deserves to live independently, safely, and comfortably. 
            Our mission is to bridge the gap between healthcare and technology, offering peace of 
            mind to families while empowering the elderly with comprehensive, intuitive tools."
          </p>
        </motion.div>
      </section>
    </div>
  );
}