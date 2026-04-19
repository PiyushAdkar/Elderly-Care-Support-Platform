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

  // Framer Motion Animation Variants (Staggered Unmasking Sequences)
  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const textUnrollDown = {
    hidden: { clipPath: "inset(0 0 100% 0)", y: 15 },
    show: { 
      clipPath: "inset(0 0 0% 0)", 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const textUnrollRight = {
    hidden: { clipPath: "inset(0 100% 0 0)", x: -10 },
    show: { 
      clipPath: "inset(0 0% 0 0)", 
      x: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const imageRevealCenter = {
    hidden: { clipPath: "inset(50% 50% 50% 50%)", scale: 0.95 },
    show: { 
      clipPath: "inset(0% 0% 0% 0%)", 
      scale: 1, 
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const iconElastic = {
    hidden: { scale: 0 },
    show: { 
      scale: 1, 
      transition: { type: "spring", stiffness: 300, damping: 15 } 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* 1. Hero Section */}
      <section className="relative w-full bg-gradient-to-b from-blue-50 to-white min-h-[60vh] flex flex-col justify-center items-center text-center py-20 px-8 overflow-hidden">
        {/* Background decorative lines styling with slight float animation */}
        <motion.svg
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 text-blue-300 opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path fill="none" stroke="currentColor" strokeWidth="2" d="M0,160 C320,300,420,0,740,120 C1060,240,1200,60,1440,100" />
          <path fill="none" stroke="currentColor" strokeWidth="2" d="M0,200 C280,350,560,50,840,160 C1120,270,1280,100,1440,140" />
          <path fill="none" stroke="currentColor" strokeWidth="1" d="M0,240 C350,400,600,100,900,200 C1200,300,1300,150,1440,180" />
        </motion.svg>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.img 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.1 }}
            src="/branding/logo.svg" 
            alt="Logo" 
            className="h-16 mb-6" 
            style={{ display: "none" }} // Logic for placeholder if user had a logo image they meant, since he said "stagger-scale the Logo"
          />
          <motion.h1 variants={textUnrollDown} className="text-5xl md:text-7xl font-extrabold text-[#0B1C3F] tracking-tight leading-tight mb-8">
            Compassionate Care for a <br className="hidden md:block" /> Digital Age
          </motion.h1>
          <motion.p variants={textUnrollDown} className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-12 max-w-3xl mx-auto">
            A comprehensive, intuitive platform dedicated to elderly safety. 
            Experience real-time health monitoring, instant emergency alerts, 
            and a seamless connection to the support that matters most.
          </motion.p>
          <motion.div variants={textUnrollDown}>
            <Link
              to="/signup"
              className="inline-block bg-[#0B1C3F] text-white text-lg font-bold py-4 px-10 rounded-full hover:shadow-[4px_4px_0px_0px_rgba(11,28,63,0.3)] hover:-translate-y-1 active:scale-95 transition-all duration-300"
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Alternating Sections (Z-Pattern) */}
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-32">
          {features.map((feature, idx) => {
            const isTextLeft = idx % 2 === 0;

            return (
              <React.Fragment key={idx}>
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  className={`py-12 flex flex-col ${isTextLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center justify-between gap-16 lg:gap-24`}
                >
                  {/* Text Side */}
                  <div className="flex-1 overflow-hidden">
                    <motion.h2 variants={textUnrollDown} className="text-4xl font-bold text-slate-900 mb-6">
                      {feature.title}
                    </motion.h2>
                    <motion.p variants={textUnrollDown} className="text-lg text-slate-500 leading-relaxed mb-8">
                      {feature.desc}
                    </motion.p>
                    <ul className="space-y-4">
                      {feature.bullets.map((bullet, i) => (
                        <motion.li key={i} variants={containerVariants} className="flex items-center gap-4 text-lg text-slate-700 font-medium overflow-hidden">
                          <motion.div variants={iconElastic}>
                            <ChevronsRight className="text-[#0B1C3F] w-6 h-6 flex-shrink-0" />
                          </motion.div>
                          <motion.span variants={textUnrollRight}>{bullet}</motion.span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Image Side */}
                  <div className="flex-1 w-full flex justify-center">
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      whileInView={{ opacity: 1 }} 
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={`w-full max-w-lg h-56 md:h-64 lg:h-72 ${feature.bgColor} rounded-md shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden group`}
                    >
                      <img 
                        src={feature.image} 
                        alt={feature.alt || feature.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* Decorative Divider */}
                {idx !== features.length - 1 && (
                  <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#0B1C3F] to-transparent opacity-30 mx-auto my-8"></div>
                )}
              </React.Fragment>
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