import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom'
import axios from "axios";

const API = "https://gp-backend-ddgp.onrender.com/api";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const filterSections = [
    {
      title: "By Occasions",
      items: ["All Decorations", "Anniversary", "Baby Shower", "Birthday", "Festival"],
      borderColor: "border-pink-400",
      accentText: "text-pink-500",
      label: "Events"
    },
    {
      title: "GP Specialties",
      items: ["Cabana Styling", "Canopy Setup", "Floral Architecture", "Stage Design"],
      borderColor: "border-[#062419]",
      accentText: "text-[#062419]",
      label: "Signature"
    }
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API}/services`);
      setServices(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (error) {
      console.error("Failed to load services", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SMOOTH SCROLL TO TOP
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#1A1A1A] pb-10 relative font-sans selection:bg-pink-100">
      
      {/* SIDE BRANDING */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none z-50">
        <p className="rotate-[-90deg] origin-left text-[10px] font-black uppercase tracking-[1em] text-gray-200 italic">
          GP Flower Decorators — Since 2008
        </p>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-12 px-6 text-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fbcfe8'%3E%3Cpath d='M50 50m-40 0a40 40 0 1 0 80 0a40 40 0 1 0 -80 0' fill='none' stroke='%23fbcfe8' stroke-width='0.3'/%3E%3Cpath d='M50 10 L53 35 L68 32 L58 42 L72 58 L55 52 L50 68 L45 52 L28 58 L42 42 L32 32 L47 35 Z' fill='none' stroke='%23fbcfe8' stroke-width='0.2'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }}
        />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[450px] h-[450px] opacity-[0.06] z-0 pointer-events-none"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-pink-300">
            <g>
              {[...Array(12)].map((_, i) => (
                <path 
                  key={i}
                  d="M50 50 Q60 10 70 50 T50 90 T30 50 T50 10" 
                  transform={`rotate(${i * 30} 50 50)`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.8"
                />
              ))}
              <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </g>
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.5em] text-emerald-900 mb-4 block">
            GP Flower Decorators
          </span>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tighter leading-tight text-[#062419]">
            The <span className="text-pink-400 italic font-light">GP Selection.</span>
          </h1>
          <div className="h-px w-16 bg-pink-200 mx-auto mt-6 opacity-60" />
        </motion.div>
      </section>

      {/* FILTER SECTIONS */}
      <section className="px-6 md:px-20 -mt-4 mb-24 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {filterSections.map((section, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`relative bg-white/95 backdrop-blur-md p-10 md:p-12 rounded-[3.5rem] shadow-xl shadow-gray-200/20 border-t-[8px] ${section.borderColor} ${i === 1 ? 'md:mt-16' : ''}`}
            >
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 mb-4">{section.label}</p>
              <h3 className={`text-3xl font-serif italic mb-8 ${section.accentText}`}>
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.items.map((item, idx) => (
                  <li key={idx} className="text-[14px] text-gray-500 font-medium hover:text-black hover:translate-x-2 transition-all cursor-pointer flex items-center group">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-100 mr-4 group-hover:bg-pink-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SERVICES GALLERY */}
      <section className="px-6 md:px-12 pb-32 relative z-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-10 border-b-2 border-black pb-4">
            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-black">
              Service Registry & Specifications
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-72 border border-gray-300 bg-gray-50 animate-pulse" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 border border-gray-200">
              <p className="text-sm text-gray-500 uppercase font-bold tracking-widest">No Records Available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {services.map((service) => (
                <div 
                  key={service._id}
                  className="bg-white border border-black p-5 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-4">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter block mb-1">
                      Reference ID: {service._id.slice(-8).toUpperCase()}
                    </span>
                    <h3 className="text-sm md:text-base font-black uppercase text-black leading-tight min-h-[40px]">
                      {service.name}
                    </h3>
                  </div>

                  <div className="mb-5 flex-grow">
                    <p className="text-[11px] md:text-xs text-gray-600 leading-relaxed line-clamp-4">
                      {service.description || 'Professional decoration services provided with standard operational procedures.'}
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 p-3 mb-5 space-y-2">
                    <div className="flex justify-between text-[10px] uppercase">
                      <span className="text-gray-400 font-bold">Category</span>
                      <span className="text-black font-bold">{service.category || "Standard"}</span>
                    </div>
                    <div className="flex justify-between text-[10px] uppercase">
                      <span className="text-gray-400 font-bold">Duration</span>
                      <span className="text-black font-bold">{service.duration || 'Variable'}</span>
                    </div>
                    <div className="flex justify-between text-[10px] uppercase">
                      <span className="text-gray-400 font-bold">Guest Capacity</span>
                      <span className="text-black font-bold">{service.guestCapacity || 'Unspecified'}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="flex flex-col mb-3">
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Service Valuation</span>
                      <span className="text-lg font-black text-black">
                        ₹{service.priceDiscounted?.toLocaleString() || '0'}
                      </span>
                    </div>
                    
                    {/* ✅ REQUEST SERVICE → BOOKING PAGE (PUBLIC) */}
                    <Link 
                      to="/book"
                      onClick={scrollToTop}
                      className="block w-full"
                    >
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-black text-white py-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-colors border border-black"
                      >
                        Request Service
                      </motion.button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-32 relative px-6 md:px-20 pb-16">
        <div className="max-w-7xl mx-auto bg-[#062419] rounded-[4rem] md:rounded-[5rem] overflow-hidden relative min-h-[450px] flex items-center">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none select-none">
            <h2 className="text-[10vw] font-serif text-white leading-none">GP</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 p-10 md:p-20 items-center w-full relative z-10">
            <div className="text-left">
              <p className="text-emerald-400 font-black uppercase tracking-[0.5em] text-[9px] mb-5">
                Established 2008 • Sindgi
              </p>
              <h3 className="text-white font-serif italic text-4xl md:text-6xl leading-[1.1]">
                Define your space <br /> 
                <span className="text-pink-300">with GP Artistry.</span>
              </h3>
            </div>
            <div className="flex flex-col items-start md:items-end justify-center">
              <div className="max-w-xs md:text-right">
                <p className="text-emerald-100/40 text-[13px] font-light leading-relaxed mb-8 italic">
                  Every celebration is a canvas. We provide the architecture and the soul to make it timeless.
                </p>
                {/* ✅ INQUIRE WITH STUDIO → CONTACT PAGE */}
                <Link 
                  to="/contact"
                  onClick={scrollToTop}
                  className="block"
                >
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-pink-400 text-white px-10 py-5 rounded-full font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white hover:text-[#062419] transition-all"
                  >
                    Inquire with Studio
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}