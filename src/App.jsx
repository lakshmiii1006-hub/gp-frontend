import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import Events from './pages/Events.jsx'
import Contact from './pages/Contact.jsx'
import BookNow from './pages/BookNow.jsx'
import Admin from './pages/Admin.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      <BrowserRouter>
        <Navbar />
        <main className="pt-20">
          <Routes>
            {/* PUBLIC ROUTES - Everyone can access */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book" element={<BookNow />} /> {/* ✅ REMOVED SignedIn wrapper */}
            
            {/* PROTECTED ROUTE - Only logged-in admins */}
            <Route path="/admin" element={
              <SignedIn>
                <Admin />
              </SignedIn>
            } />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  )
}