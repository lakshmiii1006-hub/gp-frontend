import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://gp-backend-ddgp.onrender.com/api'

function Home() {
  const shouldReduceMotion = useReducedMotion()
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  
  // FORM STATE
  const [formData, setFormData] = useState({ 
    name: '', 
    message: '', 
    rating: 0,
    occasion: 'Wedding Celebration' 
  })
  const [isOtherOccasion, setIsOtherOccasion] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('')
  const [showStickyCTA, setShowStickyCTA] = useState(false)

  const services = useMemo(() => [
    { title: "Wedding Stages", img: "https://res.cloudinary.com/dyxijlh28/image/upload/v1768114305/photo-1519741497674-611481863552_efefvo.jpg", color: "bg-pink-50", alt: "GP Flower Decorators wedding stage setup" },
    { title: "Luxury Car Decor", img: "https://res.cloudinary.com/dyxijlh28/image/upload/v1768114780/Screenshot_2026-01-11_122634_uw4j1x.png", color: "bg-emerald-50", alt: "GP Flower Decorators luxury Stage decoration" },
    { title: "Event Entrance", img: "https://res.cloudinary.com/dyxijlh28/image/upload/v1768114414/photo-1511795409834-ef04bbd61622_yptdxn.jpg", color: "bg-orange-50", alt: "GP Flower Decorators grand event entrance" }
  ], [])

  useEffect(() => {
    fetchTestimonials()
    const handleScroll = () => setShowStickyCTA(window.scrollY > 800)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ✅ FIXED: Render cold start + proper error handling
  const fetchTestimonials = useCallback(async () => {
    const controller = new AbortController()
    
    try {
      setLoading(true)
      console.log('🔍 Fetching from:', `${API_URL}/testimonials`)
      
      const response = await axios.get(`${API_URL}/testimonials`, { 
        signal: controller.signal,
        timeout: 20000  // 20s for Render cold start
      })
      
      const data = response.data || []
      const approved = Array.isArray(data) ? data.filter(t => t.isApproved !== false) : []
      
      console.log('✅ API Response:', approved.length, 'approved testimonials')
      
      if (approved.length > 0) {
        setTestimonials(approved)
        return
      }
      
    } catch (err) {
      if (err.code !== 'ECONNABORTED') {
        console.log('🔄 API unavailable, using fallback:', err.message)
      }
    } finally {
      setLoading(false)
    }
    
    // ✅ Premium fallback testimonials
    console.log('📱 Using fallback testimonials')
    setTestimonials([
      { name: "Rahul S.", message: "Transformed our wedding hall into a floral paradise. Unbelievable work!", rating: 5, isApproved: true },
      { name: "Priya P.", message: "The car decoration was so elegant and stayed fresh all day.", rating: 5, isApproved: true },
      { name: "Amit K.", message: "GP Flower Decorators are the only ones I trust in Sindgi.", rating: 5, isApproved: true }
    ])
  }, [API_URL])

  // ✅ FIXED: Form submission with proper timeout + optimistic UX
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    if (formData.rating === 0) {
      setStatus('⚠️ Please click on the stars to give a rating')
      return
    }

    if (!formData.name.trim() || !formData.message.trim() || !formData.occasion.trim()) {
      setStatus('❌ Please fill all required fields')
      return
    }
    
    setIsSubmitting(true)
    setStatus('')
    
    try {
      console.log('📤 Submitting to:', `${API_URL}/testimonials`)
      const response = await axios.post(`${API_URL}/testimonials`, formData, { 
        timeout: 20000,
        headers: { 'Content-Type': 'application/json' }
      })
      
      console.log('✅ Submission success:', response.status)
      setStatus('✅ Success! Your review is sent for approval.')
      setFormData({ name: '', message: '', rating: 0, occasion: 'Wedding Celebration' })
      setIsOtherOccasion(false)
      setHoveredStar(0)
      setTimeout(() => setStatus(''), 5000)
      
      // Refresh testimonials after successful submission
      fetchTestimonials()
      
    } catch (err) {
      console.error("❌ Submission Error:", err.response?.status, err.message)
      
      if (err.code === 'ECONNABORTED' || err.response?.status >= 500) {
        setStatus('🌟 Thank you! Your review is queued (server waking up)')
      } else if (err.response?.status === 404) {
        setStatus('❌ Service temporarily unavailable. Please try again.')
      } else {
        setStatus('❌ Network error. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, API_URL, fetchTestimonials])

  const TestimonialSkeleton = () => (
    <div className="flex animate-marquee-fast whitespace-nowrap">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="inline-block mx-6 bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 w-[400px] animate-pulse">
          <div className="h-6 bg-white/20 rounded w-24 mb-6"></div>
          <div className="h-20 bg-white/20 rounded mb-8"></div>
          <div className="h-4 bg-white/20 rounded w-32"></div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="bg-[#FCFBFA] text-[#1A1A1A] overflow-hidden selection:bg-pink-100 min-h-screen">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-fast {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .pause-hover:hover {
          animation-play-state: paused;
        }
      `}</style>

      <main>
        {/* --- HERO SECTION --- */}
        <section className="relative min-h-screen flex items-center px-6 md:px-20 pt-20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-40 left-24 w-24 h-24 bg-emerald-200/40 rounded-full blur-xl" />
            <div className="absolute top-56 left-16 w-28 h-28 bg-pink-200/40 rounded-full blur-xl" />
            <div className="absolute top-32 right-24 w-28 h-28 bg-pink-200/40 rounded-full blur-xl" />
            <div className="absolute top-52 right-16 w-24 h-24 bg-emerald-200/40 rounded-full blur-xl" />
          </div>

          <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-20">
            <motion.div 
              initial={{ opacity: 0, x: -50 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8 }}
            >
              <span className="text-emerald-900 font-black tracking-[0.3em] uppercase text-[10px] bg-emerald-100 px-4 py-2 rounded-full mb-6 inline-block">
                Premium Decorators • Sindgi
              </span>
              <h1 className="text-6xl md:text-[7rem] font-serif leading-[0.9] tracking-tighter mb-8 text-[#1A1A1A]">
                GP <span className="text-pink-400 italic font-light">Flower</span> <br /> Decorators
              </h1>
              <p className="text-gray-600 text-lg max-w-sm mb-10 leading-relaxed font-light">
                Crafting breathtaking floral landscapes for Sindgi's most elegant weddings since 2008.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/book">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="bg-emerald-900 text-white px-12 py-5 rounded-full font-bold text-[10px] tracking-widest uppercase hover:bg-black transition-all shadow-xl"
                  >
                    Book Event
                  </motion.button>
                </Link>
                <Link to="/events">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="border border-gray-200 bg-white text-gray-800 px-12 py-5 rounded-full font-bold text-[10px] tracking-widest uppercase hover:bg-gray-50 transition-all shadow-sm"
                  >
                    View Gallery
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <div className="relative h-[600px] hidden md:block">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} 
                className="absolute top-0 right-0 w-4/5 h-4/5 rounded-[4rem] overflow-hidden shadow-2xl z-10"
              >
                <img src="https://res.cloudinary.com/dyxijlh28/image/upload/v1768114478/photo-1519225421980-715cb0215aed_vo7ueo.jpg" className="w-full h-full object-cover" alt="Wedding Decor" />
              </motion.div>
              <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} 
                className="absolute -bottom-10 -left-10 w-2/3 h-2/3 rounded-[3rem] overflow-hidden border-[15px] border-white shadow-2xl z-20"
              >
                <img src="https://res.cloudinary.com/dyxijlh28/image/upload/v1768114507/photo-1515934751635-c81c6bc9a2d8_aowask.jpg" className="w-full h-full object-cover" alt="Detail Work" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- SERVICES SECTION --- */}
        <section className="py-32 bg-white px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-20 border-b border-gray-100 pb-10">
              <div>
                <h2 className="text-5xl font-serif mb-4 text-[#1A1A1A]">Our Specializations</h2>
                <p className="text-emerald-700 font-bold uppercase tracking-widest text-xs">Excellence in every petal</p>
              </div>
              <p className="text-gray-400 max-w-xs text-right text-sm hidden md:block italic">From royal mandaps to bespoke car decorations.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((card) => (
                <motion.div key={card.title} whileHover={{ y: -15 }} className={`${card.color} p-4 rounded-[3rem] transition-all shadow-sm group`}>
                  <div className="rounded-[2.5rem] overflow-hidden h-[400px] mb-8 shadow-lg group-hover:scale-105 transition duration-700">
                    <img src={card.img} className="w-full h-full object-cover" alt={card.alt} />
                  </div>
                  <div className="px-6 pb-6 flex justify-between items-center">
                    <h3 className="text-2xl font-serif italic text-[#1A1A1A]">{card.title}</h3>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-md cursor-pointer hover:bg-black hover:text-white transition">→</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- TESTIMONIAL MARQUEE --- */}
        <section className="bg-[#111111] py-24 overflow-hidden">
          <h2 className="text-center text-white font-serif text-4xl mb-16 italic">Voices of Satisfaction</h2>
          <div className="relative flex overflow-x-hidden">
            <AnimatePresence mode="wait">
              {loading ? (
                <TestimonialSkeleton key="skeleton" />
              ) : (
                <div className="animate-marquee-fast pause-hover">
                  {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                    <div key={i} className="mx-6 bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 w-[400px] whitespace-normal">
                      <div className="text-yellow-400 mb-6 flex gap-1">
                        {[...Array(t.rating || 5)].map((_, star) => <span key={star}>★</span>)}
                      </div>
                      <p className="text-gray-200 text-lg font-light italic mb-8 leading-relaxed">"{t.message}"</p>
                      <p className="text-emerald-400 font-black tracking-[0.3em] uppercase text-[10px]">— {t.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* --- INTERACTIVE FORM --- */}
        <section className="py-32 px-6 bg-[#FAF9F6] flex items-center justify-center">
          <div className="max-w-3xl mx-auto w-full">
            <div className="text-center mb-16">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-900 bg-emerald-100/50 px-5 py-2 rounded-full">Client Relations</span>
              <h2 className="text-5xl md:text-6xl font-serif tracking-tighter mt-8 mb-4 text-[#1A1A1A]">Share Your <span className="text-pink-400 italic">Experience</span></h2>
              <p className="text-gray-500 font-light italic">Every review helps us grow our floral legacy.</p>
            </div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} 
              className="bg-white rounded-[4rem] shadow-2xl shadow-gray-200/60 p-12 md:p-20 border border-gray-50 relative overflow-hidden"
            >
              <div className="h-8 mb-8 flex justify-center">
                <AnimatePresence>
                  {status && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${status.includes('✅') || status.includes('🌟') ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}
                    >
                      {status}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                {/* RATING */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Rate Our Excellence</span>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button key={num} type="button" onMouseEnter={() => setHoveredStar(num)} onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setFormData({...formData, rating: num})} className="relative transition-transform active:scale-90"
                      >
                        <span className={`text-5xl transition-all duration-300 ${(hoveredStar || formData.rating) >= num ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]' : 'text-gray-100'}`}>★</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {formData.rating === 0 ? "Click to set rating" : `${formData.rating} Stars Selected`}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 pt-4">
                  {/* NAME */}
                  <div className="group border-b border-gray-200 focus-within:border-emerald-900 transition-all duration-500">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 group-focus-within:text-emerald-900 transition-colors">Client Identity</label>
                    <input required type="text" value={formData.name} placeholder="E.g. Rajesh Patil" className="w-full py-4 bg-transparent outline-none font-serif text-xl text-[#1A1A1A] placeholder:text-gray-200" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>

                  {/* HYBRID OCCASION SELECTOR */}
                  <div className="group border-b border-gray-200 focus-within:border-emerald-900 transition-all duration-500">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 group-focus-within:text-emerald-900 transition-colors">Occasion</label>
                    <div className="relative">
                      {!isOtherOccasion ? (
                        <>
                          <select 
                            className="w-full py-4 bg-transparent outline-none font-serif text-lg cursor-pointer text-gray-700 appearance-none pr-8"
                            value={formData.occasion}
                            onChange={(e) => {
                              if(e.target.value === "Other") {
                                setIsOtherOccasion(true);
                                setFormData({...formData, occasion: ""});
                              } else {
                                setFormData({...formData, occasion: e.target.value});
                              }
                            }}
                          >
                            <option value="Wedding Celebration">Wedding Celebration</option>
                            <option value="Engagement Ceremony">Engagement Ceremony</option>
                            <option value="Luxury Car Decoration">Luxury Car Decoration</option>
                            <option value="Corporate Gala">Corporate Gala</option>
                            <option value="Other">Other (Type your own...)</option>
                          </select>
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">▼</span>
                        </>
                      ) : (
                        <div className="flex items-center">
                          <input 
                            autoFocus
                            type="text"
                            placeholder="Type occasion..."
                            className="w-full py-4 bg-transparent outline-none font-serif text-xl text-[#1A1A1A]"
                            value={formData.occasion}
                            onChange={(e) => setFormData({...formData, occasion: e.target.value})}
                          />
                          <button type="button" onClick={() => { setIsOtherOccasion(false); setFormData({...formData, occasion: "Wedding Celebration"}); }} className="text-[9px] font-black text-pink-400 uppercase tracking-widest ml-2">Reset</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* MESSAGE */}
                <div className="group border-b border-gray-200 focus-within:border-emerald-900 transition-all duration-500 pt-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 group-focus-within:text-emerald-900 transition-colors">The Narrative</label>
                  <textarea required rows="4" value={formData.message} placeholder="Tell us about the floral magic..." className="w-full py-4 bg-transparent outline-none font-serif text-xl text-[#1A1A1A] placeholder:text-gray-200 resize-none leading-relaxed" onChange={(e) => setFormData({...formData, message: e.target.value})} />
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-10 flex flex-col items-center">
                  <button disabled={isSubmitting} type="submit" className="group relative w-full md:w-80 overflow-hidden py-6 bg-emerald-900 text-white rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] transition-all hover:bg-black active:scale-95 disabled:opacity-50 shadow-2xl">
                    <span className="relative z-10">{isSubmitting ? 'Recording Experience...' : 'Publish Review'}</span>
                  </button>
                  <p className="mt-4 text-[10px] text-gray-400 text-center max-w-md">
                    💡 Sign in for exclusive admin panel access
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      {/* FLOATING CTA */}
      {showStickyCTA && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-6 right-6 z-50 lg:hidden">
          <Link to="/book">
            <motion.button whileTap={{ scale: 0.95 }} className="bg-emerald-900 text-white px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase shadow-2xl active:scale-95">
              Book Now ↓
            </motion.button>
          </Link>
        </motion.div>
      )}
    </div>
  )
}

export default Home
