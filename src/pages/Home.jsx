import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import axios from 'axios'

// Ensure this matches your Render backend structure exactly
const API_URL = import.meta.env.VITE_API_URL || 'https://gp-backend-ddgp.onrender.com/api'

function Home() {
  const shouldReduceMotion = useReducedMotion()
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  
  // FORM STATE: rating 0, occasion default, no auth required
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

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true)
      // Updated to ensure /api/testimonials is hit
      const response = await axios.get(`${API_URL}/testimonials`)
      const data = response.data?.testimonials || response.data
      const approved = Array.isArray(data) ? data.filter(t => t.isApproved) : []
      setTestimonials(approved)
    } catch (e) {
      console.error("Fetch error:", e)
      setTestimonials([
        { name: "Rahul S.", message: "Transformed our wedding hall into a floral paradise.", rating: 5 },
        { name: "Priya P.", message: "The car decoration was so elegant and fresh.", rating: 5 }
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    if (formData.rating === 0) {
      setStatus('⚠️ Please select a star rating')
      return
    }
    
    setIsSubmitting(true)
    setStatus('')
    
    try {
      // POSTing to ${API_URL}/testimonials
      await axios.post(`${API_URL}/testimonials`, formData)
      setStatus('✅ Success! Your story has been sent for approval.')
      setFormData({ name: '', message: '', rating: 0, occasion: 'Wedding Celebration' })
      setIsOtherOccasion(false)
      setHoveredStar(0)
      setTimeout(() => setStatus(''), 5000)
    } catch (err) {
      console.error("Submission Error:", err)
      setStatus('❌ Error: Could not reach server. Check API URL.')
    } finally {
      setIsSubmitting(false)
    }
  }, [formData])

  const TestimonialSkeleton = () => (
    <div className="flex animate-marquee-fast whitespace-nowrap">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="inline-block mx-6 bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 w-[400px] animate-pulse">
          <div className="h-6 bg-white/20 rounded w-24 mb-6"></div>
          <div className="h-20 bg-white/20 rounded mb-8"></div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="bg-[#FCFBFA] text-[#1A1A1A] overflow-hidden selection:bg-pink-100 min-h-screen">
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee-fast { display: flex; width: max-content; animation: marquee 30s linear infinite; }
        .pause-hover:hover { animation-play-state: paused; }
      `}</style>

      <main>
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center px-6 md:px-20 pt-20">
          <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-20">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
              <span className="text-emerald-900 font-black tracking-[0.3em] uppercase text-[10px] bg-emerald-100 px-4 py-2 rounded-full mb-6 inline-block">
                Premium Decorators • Sindgi
              </span>
              <h1 className="text-6xl md:text-[7rem] font-serif leading-[0.9] tracking-tighter mb-8">
                GP <span className="text-pink-400 italic font-light">Flower</span> <br /> Decorators
              </h1>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/events">
                  <button className="bg-emerald-900 text-white px-12 py-5 rounded-full font-bold text-[10px] tracking-widest uppercase hover:bg-black transition-all">
                    View Gallery
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* TESTIMONIALS LIST */}
        <section className="bg-[#111111] py-24 overflow-hidden">
          <h2 className="text-center text-white font-serif text-4xl mb-16 italic">Voices of Satisfaction</h2>
          <div className="relative flex overflow-x-hidden">
            <AnimatePresence mode="wait">
              {loading ? <TestimonialSkeleton /> : (
                <div className="animate-marquee-fast pause-hover">
                  {[...testimonials, ...testimonials].map((t, i) => (
                    <div key={i} className="mx-6 bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 w-[400px]">
                      <div className="text-yellow-400 mb-6 flex gap-1">
                        {[...Array(t.rating || 5)].map((_, s) => <span key={s}>★</span>)}
                      </div>
                      <p className="text-gray-200 text-lg font-light italic mb-8">"{t.message}"</p>
                      <p className="text-emerald-400 font-black tracking-[0.3em] uppercase text-[10px]">— {t.name} ({t.occasion})</p>
                    </div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* PUBLIC TESTIMONIAL FORM (No Sign-In Required) */}
        <section className="py-32 px-6 bg-[#FAF9F6] flex items-center justify-center">
          <div className="max-w-3xl mx-auto w-full">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-serif tracking-tighter text-[#1A1A1A]">Share Your <span className="text-pink-400 italic">Experience</span></h2>
            </div>

            <motion.div className="bg-white rounded-[4rem] shadow-2xl p-12 md:p-20 border border-gray-50">
              {status && <div className="text-center mb-8 text-xs font-bold uppercase tracking-widest text-emerald-700">{status}</div>}
              
              <form onSubmit={handleSubmit} className="space-y-12">
                {/* STAR RATING */}
                <div className="flex flex-col items-center">
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button key={num} type="button" 
                        onMouseEnter={() => setHoveredStar(num)} 
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setFormData({...formData, rating: num})}
                        className="text-5xl transition-all"
                      >
                        <span className={(hoveredStar || formData.rating) >= num ? 'text-yellow-400' : 'text-gray-100'}>★</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  {/* NAME */}
                  <div className="border-b border-gray-200">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Your Name</label>
                    <input required type="text" className="w-full py-4 bg-transparent outline-none font-serif text-xl" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>

                  {/* OCCASION (Hybrid) */}
                  <div className="border-b border-gray-200">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Occasion</label>
                    {!isOtherOccasion ? (
                      <select className="w-full py-4 bg-transparent outline-none font-serif text-lg" 
                        value={formData.occasion}
                        onChange={(e) => e.target.value === "Other" ? setIsOtherOccasion(true) : setFormData({...formData, occasion: e.target.value})}
                      >
                        <option value="Wedding Celebration">Wedding</option>
                        <option value="Engagement Ceremony">Engagement</option>
                        <option value="Luxury Car Decoration">Car Decor</option>
                        <option value="Other">Other...</option>
                      </select>
                    ) : (
                      <div className="flex items-center">
                        <input autoFocus type="text" className="w-full py-4 bg-transparent outline-none font-serif text-xl" placeholder="Describe event" value={formData.occasion} onChange={(e) => setFormData({...formData, occasion: e.target.value})} />
                        <button type="button" onClick={() => setIsOtherOccasion(false)} className="text-[9px] text-pink-400 font-bold ml-2">BACK</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* MESSAGE */}
                <div className="border-b border-gray-200">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Your Story</label>
                  <textarea required rows="4" className="w-full py-4 bg-transparent outline-none font-serif text-xl resize-none" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
                </div>

                <button disabled={isSubmitting} type="submit" className="w-full py-6 bg-emerald-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all">
                  {isSubmitting ? 'Sending...' : 'Publish Review'}
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home