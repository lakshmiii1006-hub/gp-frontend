import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import axios from "axios";

// FIXED: Hardcoded with /api
const API = "https://gp-backend-ddgp.onrender.com/api";



export default function Contact() {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    
    setLoading(true);
    setStatus("");
    
    

    let emailSent = false;

    // Try EmailJS first
    try {
      
      await emailjs.sendForm(
        "service_svpaxuq",
        "template_y3jzi3l",
        formRef.current,
        "0c4wM5jl3qrw0l50C"
      );
      emailSent = true;
      
    } catch (err) {
      
    }

    // Try backend save - FIXED URL
    try {
      
      const fullUrl = `${API}/contacts`;
      

      const response = await axios.post(fullUrl, {
        name: formData.from_name,
        email: formData.from_email,
        message: formData.message,
        emailSent,
        read: false,
      });

      
      setStatus("success");
      setFormData({ from_name: "", from_email: "", message: "" });
     
      
    } catch (err) {
     
      
      if (err.response) {
       
      }
      
      setStatus("error");
    } finally {
      setLoading(false);
     
    }
  };

  // Test function to check backend directly
  const testBackendConnection = async () => {
    
    const testUrl = `${API}/contacts`;
   
    
    try {
      // Test GET request
      const getResponse = await axios.get(testUrl);
      
      
      alert("✅ Backend is working! Contacts count: " + (Array.isArray(getResponse.data) ? getResponse.data.length : "Unknown"));
    } catch (error) {
      
      alert(`❌ Backend test failed: ${error.message}`);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#1A1A1A] pb-20 relative font-sans selection:bg-pink-100">
      
      {/* SIDE BRANDING */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none z-50">
        <p className="rotate-[-90deg] origin-left text-[9px] font-black uppercase tracking-[1em] text-gray-300 italic">
          GP Flower Decorators — Sindgi
        </p>
      </div>

      

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-16 px-6 text-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23f472b6' stroke-width='0.2'%3E%3Cpath d='M50 50m-40 0a40 40 0 1 0 80 0a40 40 0 1 0 -80 0'/%3E%3Cpath d='M50 10 L53 35 L68 32 L58 42 L72 58 L55 52 L50 68 L45 52 L28 58 L42 42 L32 32 L47 35 Z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-900 mb-4 block">
            The Studio
          </span>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tighter leading-tight text-[#062419]">
            Inquire for your <span className="text-pink-500 italic font-light">Vision.</span>
          </h1>
          <div className="h-px w-16 bg-pink-400 mx-auto mt-6 opacity-40" />
        </motion.div>
      </section>

      {/* TWO CARDS LAYOUT */}
      <section className="px-4 md:px-20 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* CONTACT FORM CARD */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-14 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 mb-2">Private Inquiry</p>
              <h3 className="text-3xl font-serif italic mb-10 text-[#062419]">Send a Message</h3>
              
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
                <input type="hidden" name="to_email" value="gpflowerdecorators@gmail.com" />
                
                {/* NAME FIELD */}
                <div className="relative group border-b-2 border-gray-100 focus-within:border-pink-400 transition-all duration-300">
                  <label className="block text-[11px] font-black uppercase tracking-widest text-[#062419] mb-1">
                    Full Name <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="from_name"
                    placeholder="Enter your name"
                    value={formData.from_name}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent py-3 text-lg focus:outline-none placeholder:text-gray-200 font-serif italic text-[#062419]"
                  />
                </div>

                {/* EMAIL FIELD */}
                <div className="relative group border-b-2 border-gray-100 focus-within:border-pink-400 transition-all duration-300">
                  <label className="block text-[11px] font-black uppercase tracking-widest text-[#062419] mb-1">
                    Email Address <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="from_email"
                    placeholder="email@example.com"
                    value={formData.from_email}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent py-3 text-lg focus:outline-none placeholder:text-gray-200 font-serif italic text-[#062419]"
                  />
                </div>

                {/* MESSAGE FIELD */}
                <div className="relative group border-b-2 border-gray-100 focus-within:border-pink-400 transition-all duration-300">
                  <label className="block text-[11px] font-black uppercase tracking-widest text-[#062419] mb-1">
                    Your Message <span className="text-pink-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows="3"
                    placeholder="Tell us about the occasion, date, and venue..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent py-3 text-lg focus:outline-none placeholder:text-gray-200 font-serif italic resize-none text-[#062419]"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full bg-[#062419] text-white py-5 rounded-full font-black uppercase tracking-[0.3em] text-[10px] hover:bg-pink-500 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Submit Inquiry"}
                </motion.button>
              </form>
            </div>

            {/* Status Messages */}
            <div className="mt-6">
              {status === "success" && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg">
                  <p className="font-serif italic text-center">✓ We have received your inquiry successfully.</p>
                </div>
              )}
              
              {status === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <p className="font-serif italic text-center">
                    ❌ There was an error submitting your inquiry. 
                    <br />
                    <span className="text-xs">Please try again or contact us directly.</span>
                  </p>
                </div>
              )}
            </div>
            
            
            
          </motion.div>

          {/* CONTACT INFO CARD */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#062419] p-8 md:p-14 rounded-[3rem] text-white shadow-xl flex flex-col justify-between"
          >
            <div>
              <p className="text-emerald-400 text-[9px] font-black uppercase tracking-[0.4em] mb-2">Connect Directly</p>
              <h3 className="text-3xl font-serif italic mb-10 text-pink-300">Studio Details</h3>
              
              <div className="space-y-10">
                <div className="flex gap-6 items-start">
                  <span className="text-pink-400 font-serif italic text-2xl">01</span>
                  <div>
                    <h4 className="uppercase tracking-widest text-[10px] text-emerald-500 font-black mb-2 font-sans">Location</h4>
                    <p className="font-serif text-xl opacity-80 italic">Mallikarjuna Complex, Infront of A.P.M.C, Near Court, Nanjanagudi Road, T Narasipura, Karanataka</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <span className="text-pink-400 font-serif italic text-2xl">02</span>
                  <div>
                    <h4 className="uppercase tracking-widest text-[10px] text-emerald-500 font-black mb-2 font-sans">WhatsApp</h4>
                    <p className="font-serif text-xl opacity-80 italic">Direct Consultation Available</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <span className="text-pink-400 font-serif italic text-2xl">03</span>
                  <div>
                    <h4 className="uppercase tracking-widest text-[10px] text-emerald-500 font-black mb-2 font-sans">Email</h4>
                    <p className="font-serif text-xl opacity-80 italic">gpflowerdecorators@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex gap-6 items-start">
                  <span className="text-pink-400 font-serif italic text-2xl">04</span>
                  <div>
                    <h4 className="uppercase tracking-widest text-[10px] text-emerald-500 font-black mb-2 font-sans">Phone Number</h4>
                    <p className="text-xl">91+ 9964118761</p>
                    <p className="text-xl">91+ 9844160165</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-xs opacity-40 font-light italic leading-relaxed">
                "Artistry is in the details. We curate every petal to tell your unique story."
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}