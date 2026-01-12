import { useEffect, useState, useRef } from "react";
import axios from "axios";

/* ================= API ENDPOINTS ================= */
const API_BOOKING = "https://gp-backend-ddgp.onrender.com/api/booking";
const API_CONTACTS = "https://gp-backend-ddgp.onrender.com/api/contacts";
const API_SERVICES = "https://gp-backend-ddgp.onrender.com/api/services";
const API_EVENTS = "https://gp-backend-ddgp.onrender.com/api/events";
const API_TESTIMONIALS = "https://gp-backend-ddgp.onrender.com/api/testimonials";

/* ================= UI HELPERS ================= */
const PageHeader = ({ title, count }) => (
  <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-5">
    <div>
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
      <p className="text-sm text-slate-500 mt-1">Manage your {title.toLowerCase()} and system data.</p>
    </div>
    <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Total</span>
      <span className="text-lg font-black text-indigo-700">{count}</span>
    </div>
  </div>
);

/* ================= BOOKINGS ================= */
function BookingsAdmin({ showToast }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const res = await axios.get(API_BOOKING);
        setBookings(Array.isArray(res.data) ? res.data : res.data.bookings || []);
      } catch { setError("Failed to load bookings"); }
      finally { setLoading(false); }
    };
    loadBookings();
  }, []);

  const approveBooking = async (id) => {
    try {
      await axios.put(`${API_BOOKING}/${id}/approve`);
      // INSTANT UPDATE
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: "approved" } : b));
      showToast("Booking approved successfully!");
    } catch { showToast("Failed to approve booking", true); }
  };

  const deleteBooking = async (id) => {
    if (!confirm("Delete booking permanently?")) return;
    try {
      await axios.delete(`${API_BOOKING}/${id}`);
      // INSTANT UPDATE
      setBookings(prev => prev.filter(b => b._id !== id));
      showToast("Booking deleted.");
    } catch { showToast("Failed to delete", true); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  
  return (
    <>
      <PageHeader title="Bookings" count={bookings.length} />
      <div className="overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Client Information</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Event Details</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Financials</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map(b => (
              <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">{b.name}</div>
                  <div className="text-xs text-slate-500">{b.email}</div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="text-slate-700 font-medium">{b.service}</div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-emerald-600">₹{b.budget || 0}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${b.status === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {b.status === "pending" && (
                      <button onClick={() => approveBooking(b._id)} className="bg-indigo-600 text-white px-3 py-1.5 rounded text-xs font-bold">Approve</button>
                    )}
                    <button onClick={() => deleteBooking(b._id)} className="text-red-600 px-3 py-1.5 rounded text-xs font-bold">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ================= CONTACTS ================= */

function ContactsAdmin({ showToast }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        
        const response = await axios.get(API_CONTACTS);
       
        
        let contactsData = [];
        if (Array.isArray(response.data)) {
          contactsData = response.data;
        } else if (response.data && Array.isArray(response.data.contacts)) {
          contactsData = response.data.contacts;
        } else if (response.data && typeof response.data === 'object') {
          contactsData = [response.data];
        }
        
       
        setContacts(contactsData);
        setLoading(false);
      } catch (error) {
        
        showToast("Failed to load inquiries", true);
        setLoading(false);
      }
    };

    fetchContacts();
  }, [showToast]);

  const markRead = async (id) => {
    
    const putUrl = `${API_CONTACTS}/${id}`;
   
    
    try {
      // Validate MongoDB ID
      if (!id || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
        
        showToast("Invalid contact ID", true);
        return;
      }
      
      const response = await axios.put(putUrl, { read: true });
     
      
      setContacts(prev => prev.map(c => c._id === id ? { ...c, read: true } : c));
      showToast("Message marked as read");
    } catch (error) {
      
      showToast("Error updating status", true);
    }
  };

  const deleteContact = async (id) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    
   
    const deleteUrl = `${API_CONTACTS}/${id}`;
    
    
    try {
      // Validate MongoDB ID
      if (!id || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
        
        showToast("Invalid contact ID", true);
        return;
      }
      
      const response = await axios.delete(deleteUrl);
      
      setContacts(prev => prev.filter(c => c._id !== id));
      showToast("Inquiry deleted");
    } catch (error) {
     
      showToast("Error deleting inquiry", true);
    }
  };

  const refreshContacts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_CONTACTS);
      const data = Array.isArray(response.data) ? response.data : [];
      setContacts(data);
      showToast(`Refreshed - ${data.length} inquiries loaded`);
    } catch (error) {
      
      showToast("Failed to refresh", true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-slate-500">Loading inquiries...</p>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Inquiries" count={contacts.length} />
        <button
          onClick={refreshContacts}
          className="px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-lg hover:bg-indigo-200 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>
      
      {/* API Info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        
        <div className="flex gap-4 mt-2 text-xs">
          
          
          <span>Unread: {contacts.filter(c => !c.read).length}</span>
        </div>
      </div>
      
      {contacts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No inquiries yet</h3>
          <p className="text-slate-500">Customer inquiries will appear here</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {contacts.map(contact => (
            <div 
              key={contact._id} 
              className={`p-6 rounded-xl border transition-all ${
                contact.read 
                  ? "bg-white border-slate-200" 
                  : "bg-white border-l-4 border-l-indigo-500 shadow-sm"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{contact.name}</h3>
                  <p className="text-sm font-medium text-indigo-600">{contact.email}</p>
                  {contact.emailSent && (
                    <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">
                      Email Sent ✓
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <time className="text-xs text-slate-400 font-bold uppercase tracking-widest block">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </time>
                  <span className="text-xs text-slate-500">
                    {new Date(contact.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg text-slate-700 text-sm italic mb-5">
                "{contact.message}"
              </div>
              
              <div className="flex gap-2">
                {!contact.read && (
                  <button 
                    onClick={() => markRead(contact._id)}
                    className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700 transition-colors"
                  >
                    Mark as Read
                  </button>
                )}
                <button 
                  onClick={() => deleteContact(contact._id)}
                  className="px-4 py-2 border border-red-200 text-red-600 text-xs font-bold rounded hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= SERVICES ================= */
function ServicesAdmin({ showToast }) {
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rating: "",
    reviews: "",
    duration: "",
    guestCapacity: "",
    priceOriginal: "",
    priceDiscounted: ""
  });

  useEffect(() => {
    axios.get(API_SERVICES).then(res => {
      setServices(Array.isArray(res.data) ? res.data : res.data.data || []);
    }).catch(() => showToast("Failed to load services", true));
  }, []);

  const resetForm = () => {
    setFormData({
      name: "", description: "", rating: "", reviews: "",
      duration: "", guestCapacity: "", priceOriginal: "", priceDiscounted: ""
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Service name is required", true);
      return;
    }

    try {
      if (editingId) {
        // UPDATE
        const res = await axios.put(`${API_SERVICES}/${editingId}`, formData);
        setServices(prev => prev.map(s => s._id === editingId ? res.data.data : s));
        showToast("Service updated successfully!");
      } else {
        // CREATE
        const res = await axios.post(API_SERVICES, formData);
        setServices(prev => [res.data.data, ...prev]);
        showToast("Service added successfully!");
      }
      resetForm();
    } catch {
      showToast(editingId ? "Failed to update service" : "Failed to add service", true);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service._id);
    setFormData({
      name: service.name,
      description: service.description || "",
      rating: service.rating || "",
      reviews: service.reviews || "",
      duration: service.duration || "",
      guestCapacity: service.guestCapacity || "",
      priceOriginal: service.priceOriginal || "",
      priceDiscounted: service.priceDiscounted || ""
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this service permanently?")) return;
    try {
      await axios.delete(`${API_SERVICES}/${id}`);
      setServices(prev => prev.filter(s => s._id !== id));
      if (editingId === id) resetForm();
      showToast("Service deleted successfully");
    } catch {
      showToast("Failed to delete service", true);
    }
  };

  return (
    <>
      <PageHeader title="Services" count={services.length} />
      
      {/* ADD/EDIT FORM */}
      <div className="bg-white border border-slate-200 p-8 rounded-xl mb-10 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">
          {editingId ? "Edit Service" : "Add New Service"}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="Service Name *"
            className="p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
          
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={formData.rating}
            onChange={e => setFormData({...formData, rating: e.target.value})}
            placeholder="Rating (0-5)"
            className="p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          <input
            type="number"
            value={formData.reviews}
            onChange={e => setFormData({...formData, reviews: e.target.value})}
            placeholder="Reviews Count"
            className="p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          <input
            type="number"
            value={formData.priceDiscounted}
            onChange={e => setFormData({...formData, priceDiscounted: e.target.value})}
            placeholder="Discounted Price (₹)"
            className="p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          <input
            type="number"
            value={formData.priceOriginal}
            onChange={e => setFormData({...formData, priceOriginal: e.target.value})}
            placeholder="Original Price (₹)"
            className="p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          <input
            value={formData.duration}
            onChange={e => setFormData({...formData, duration: e.target.value})}
            placeholder="Duration (4-6 hours)"
            className="p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          <input
            value={formData.guestCapacity}
            onChange={e => setFormData({...formData, guestCapacity: e.target.value})}
            placeholder="Guest Capacity (50-100 guests)"
            className="p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          <textarea
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Description"
            rows={3}
            className="md:col-span-2 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-indigo-700 transition-all text-sm uppercase tracking-wide"
            >
              {editingId ? "Update Service" : "Add Service"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* SERVICES LIST */}
     {/* SERVICES LIST - ADMIN FORMAL VIEW */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {services.map((service) => (
    <div 
      key={service._id} 
      className="bg-white border-2 border-black p-6 flex flex-col h-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
    >
      {/* Header: ID & Name */}
      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            ID: {service._id.slice(-8).toUpperCase()}
          </span>
          <div className="flex items-center gap-1 bg-black text-white px-2 py-0.5 rounded-sm">
            <span className="text-[10px]">★</span>
            <span className="text-[10px] font-black">{service.rating || '0.0'}</span>
          </div>
        </div>
        <h3 className="font-black text-lg uppercase text-black leading-tight border-b border-black pb-2">
          {service.name}
        </h3>
      </div>

      {/* Description */}
      <div className="flex-grow mb-6">
        <p className="text-xs text-gray-600 leading-relaxed italic">
          {service.description || "No description provided for this service record."}
        </p>
      </div>

      {/* Formal Data Table */}
      <div className="bg-gray-50 border border-gray-200 p-3 mb-6 space-y-2">
        <div className="flex justify-between text-[10px] uppercase font-bold">
          <span className="text-gray-400">Duration</span>
          <span className="text-black">{service.duration || 'Variable'}</span>
        </div>
        <div className="flex justify-between text-[10px] uppercase font-bold">
          <span className="text-gray-400">Guest Capacity</span>
          <span className="text-black">{service.guestCapacity || 'Standard'}</span>
        </div>
        <div className="flex justify-between text-[10px] uppercase font-bold border-t border-gray-200 pt-2 mt-2">
          <span className="text-gray-400">Current Rate</span>
          <span className="text-emerald-700">₹{service.priceDiscounted?.toLocaleString()}</span>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t-2 border-dashed border-gray-100">
        <button
          onClick={() => handleEdit(service)}
          className="bg-black text-white py-2 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors border border-black"
        >
          Modify
        </button>
        <button
          onClick={() => handleDelete(service._id)}
          className="bg-white text-red-600 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-colors border border-red-200"
        >
          Remove
        </button>
      </div>
    </div>
  ))}
</div>
      
    </>
  );
}


/* ================= EVENTS ================= */
/* ================= EVENTS ================= */
function EventsAdmin({ showToast }) {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null); // Track editing event
  const fileInputRef = useRef(null);

 useEffect(() => {
  const fetchEvents = async () => {
    try {
      const res = await axios.get(API_EVENTS);
      // Check if data is nested inside res.data.events or just res.data
      const eventData = Array.isArray(res.data) ? res.data : (res.data.events || []);
      setEvents(eventData);
    } catch (err) {
      // THIS WILL TELL YOU THE ACTUAL REASON
      console.error("Backend Error Message:", err.response?.data);
      showToast(`Server said: ${err.response?.data?.message || "Check Console"}`, true);
    }
  };
  fetchEvents();
}, []);

  // Populate form with event data for editing
  const handleEdit = (event) => {
    setEditingEvent(event);
    setName(event.name);
    setDescription(event.description || "");
    setImage(null); // Reset image for new upload if needed
    fileInputRef.current.value = "";
  };

  // Reset form to add new event
  const resetForm = () => {
    setEditingEvent(null);
    setName("");
    setDescription("");
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Create a clean FormData object
  const fd = new FormData();
  fd.append("name", name.trim());
  fd.append("description", description.trim());
  
  // IMPORTANT: Ensure 'image' matches the name expected by your backend (e.g., upload.single('image'))
  if (image) {
    fd.append("image", image);
  } else if (!editingEvent) {
    showToast("Please select an image", true);
    return;
  }

  try {
    const config = {
      headers: { "Content-Type": "multipart/form-data" }
    };

    if (editingEvent) {
      const res = await axios.put(`${API_EVENTS}/${editingEvent._id}`, fd, config);
      setEvents(prev => prev.map(ev => ev._id === editingEvent._id ? (res.data.event || res.data) : ev));
      showToast("Event updated!");
    } else {
      const res = await axios.post(API_EVENTS, fd, config);
      // Handle different possible response structures from your backend
      const newEvent = res.data.event || res.data;
      setEvents(prev => [newEvent, ...prev]);
      showToast("Event uploaded!");
    }
    resetForm();
  } catch (err) {
    console.error("FULL ERROR:", err);
    // If response is {}, it might be a CORS or a Size limit issue
    const msg = err.response?.data?.message || "Server rejected the file (Check size)";
    showToast(msg, true);
  }
};

  const deleteEvent = async (id) => {
    if (!confirm("Delete event permanently?")) return;
    try {
      await axios.delete(`${API_EVENTS}/${id}`);
      setEvents(prev => prev.filter(e => e._id !== id));
      // Reset form if deleting the editing event
      if (editingEvent?._id === id) resetForm();
      showToast("Event removed successfully.");
    } catch {
      showToast("Error deleting event", true);
    }
  };

  return (
    <>
      <PageHeader title="Gallery Events" count={events.length} />
      
      {/* ADD/EDIT FORM */}
      <div className="bg-white border border-slate-200 p-8 rounded-xl mb-10 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">
            {editingEvent ? `Edit: ${editingEvent.name}` : "Add New Event"}
          </h3>
          {editingEvent && (
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-all text-sm"
            >
              Cancel Edit
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Event Title" 
              className="p-3 border rounded-xl text-sm bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
              required 
            />
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={e => setImage(e.target.files[0])} 
              className="p-2 border rounded-xl text-sm bg-slate-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              accept="image/*"
            />
          </div>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="Description" 
            className="w-full p-3 border rounded-xl text-sm bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-24" 
            required 
          />
          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all uppercase tracking-wide"
          >
            {editingEvent ? "Update Event" : "Upload Event"}
          </button>
        </form>
      </div>

      {/* EVENTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map(ev => (
          <div key={ev._id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
            {ev.image && (
              <img 
                src={ev.image} 
                alt={ev.name}
                className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
            )}
            <div className="p-4">
              <h3 className="font-bold text-sm text-slate-800 mb-1 truncate">{ev.name}</h3>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2">{ev.description}</p>
              
              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => handleEdit(ev)}
                  className="flex-1 bg-indigo-600 text-white text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingEvent?._id === ev._id ? "Editing" : "Update"}
                </button>
                <button 
                  onClick={() => deleteEvent(ev._id)}
                  className="px-3 py-1.5 text-red-600 text-xs font-bold border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}


/* ================= TESTIMONIALS ================= */
function TestimonialsAdmin({ showToast }) {
  const [testimonials, setTestimonials] = useState([]);
  const [view, setView] = useState("pending"); // "pending" or "all"
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: Added proper API endpoints + error handling
  const fetchTestimonials = async (currentView) => {
    setLoading(true);
    try {
      const endpoint = currentView === "pending" 
        ? `${API_TESTIMONIALS}/pending`      // GET /api/testimonials/pending
        : API_TESTIMONIALS;                  // GET /api/testimonials (all/approved)
      
      console.log('🔍 Admin fetching:', endpoint);
      const res = await axios.get(endpoint, { timeout: 15000 });
      const data = Array.isArray(res.data) ? res.data : (res.data.testimonials || []);
      setTestimonials(data);
      console.log('✅ Admin loaded:', data.length, 'testimonials');
    } catch (err) {
      console.error('❌ Admin fetch failed:', err.message);
      showToast(`Failed to fetch ${view} testimonials`, true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials(view);
  }, [view]);

  // ✅ FIXED: Proper approve endpoint
  const approve = async (id) => {
    try {
      console.log('✅ Approving:', id);
      await axios.put(`${API_TESTIMONIALS}/${id}/approve`, {}, { timeout: 10000 });
      setTestimonials(prev => prev.filter(t => t._id !== id));
      showToast("✅ Review published successfully!");
    } catch (err) {
      console.error('❌ Approve failed:', err.response?.status || err.message);
      showToast("❌ Failed to approve review", true);
    }
  };

  // ✅ FIXED: Proper delete endpoint
  const handleDelete = async (id) => {
    if (!confirm("Delete this testimonial permanently?")) return;
    try {
      console.log('🗑️ Deleting:', id);
      await axios.delete(`${API_TESTIMONIALS}/${id}`, { timeout: 10000 });
      setTestimonials(prev => prev.filter(t => t._id !== id));
      showToast("✅ Review deleted successfully!");
    } catch (err) {
      console.error('❌ Delete failed:', err.response?.status || err.message);
      showToast("❌ Failed to delete review", true);
    }
  };

  return (
    <>
      <PageHeader 
        title={view === "pending" ? "Pending Reviews" : "Approved Testimonials"} 
        count={testimonials.length} 
      />

      {/* VIEW TOGGLE */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setView("pending")}
          className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${view === "pending" ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-slate-500 border"}`}
        >
          Pending
        </button>
        <button 
          onClick={() => setView("all")}
          className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${view === "all" ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-slate-500 border"}`}
        >
          Approved / All
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {testimonials.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed text-slate-400 italic">
              No testimonials found in this category.
            </div>
          ) : (
            testimonials.map(t => (
              <div key={t._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900">{t.name}</h3>
                  {t.isApproved && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase">Live</span>
                  )}
                </div>
                
                <p className="text-slate-600 text-sm italic mb-6 leading-relaxed">"{t.message}"</p>
                
                {/* Rating stars */}
                <div className="flex gap-1 mb-4 text-yellow-400 text-lg">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                  <span className="ml-2 text-sm text-slate-500">({t.rating}/5)</span>
                </div>
                
                <div className="flex gap-3">
                  {view === "pending" && !t.isApproved && (
                    <button 
                      onClick={() => approve(t._id)} 
                      className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold text-xs uppercase hover:bg-emerald-700 transition-colors"
                    >
                      Approve
                    </button>
                  )}
                  
                  <button 
                    onClick={() => handleDelete(t._id)} 
                    className="bg-white text-red-600 border border-red-200 px-6 py-2 rounded-lg font-bold text-xs uppercase hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}

/* ================= MAIN ================= */
export default function Admin() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [toast, setToast] = useState({ show: false, message: "", isError: false });

  // Pop-up Notification Logic
  const showToast = (message, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast({ show: false, message: "", isError: false }), 3000);
  };

  const menu = [
    { id: "bookings", label: "Bookings", icon: "📅" },
    { id: "contacts", label: "Inquiries", icon: "✉️" },
    { id: "services", label: "Services", icon: "🛠️" },
    { id: "events", label: "Events", icon: "🖼️" },
    { id: "testimonials", label: "Testimonials", icon: "⭐" },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      
      {/* Pop-up (Toast) Message */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 flex items-center px-6 py-4 rounded-xl shadow-2xl transition-all animate-bounce ${toast.isError ? 'bg-red-600' : 'bg-slate-900'} text-white`}>
          <span className="font-bold text-sm tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white fixed h-full flex flex-col shadow-2xl z-10">
        <div className="p-8 border-b border-slate-800">
          <h1 className="text-xl font-black tracking-tighter text-white">GP <span className="text-indigo-400">ADMIN</span></h1>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2">
          {menu.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all
                ${activeTab === t.id ? "bg-indigo-600 text-white shadow-lg translate-x-1" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>
              <span className="text-lg">{t.icon}</span> {t.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 ml-64 p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === "bookings" && <BookingsAdmin showToast={showToast} />}
          {activeTab === "contacts" && <ContactsAdmin showToast={showToast} />}
          {activeTab === "services" && <ServicesAdmin showToast={showToast} />}
          {activeTab === "events" && <EventsAdmin showToast={showToast} />}
          {activeTab === "testimonials" && <TestimonialsAdmin showToast={showToast} />}
        </div>
      </main>
    </div>
  );
}