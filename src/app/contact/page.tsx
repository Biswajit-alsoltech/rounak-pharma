"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiPost, apiFetch } from "@/lib/api";
import { CheckCircle, AlertTriangle, Loader2, Mail, Phone, MapPin } from "lucide-react";

// --- Type Definitions (Updated) ---
interface ContactInfo {
  address?: string;
  email?: string;
  contact_no?: string;
  google_maps_embed_url?: string; // Corrected to use the embed URL
}

interface SettingsItem {
  key: string;
  value: string;
}

// --- Helper to process settings from API ---
const processSettingsData = (data: SettingsItem[]): ContactInfo => {
  return data.reduce<ContactInfo>((accumulator, currentItem) => {
    // Dynamically add the key and value to our final object
    (accumulator as Record<string, string>)[currentItem.key] = currentItem.value;
    return accumulator;
  }, {});
};

// --- Skeleton Component for Contact Info ---
const ContactInfoSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-start">
      <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
      <div className="flex-1 space-y-2">
        <div className="w-1/4 h-5 bg-gray-200 rounded"></div>
        <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="flex items-center">
      <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
      <div className="w-1/2 h-5 bg-gray-200 rounded"></div>
    </div>
    <div className="flex items-center">
      <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
      <div className="w-1/2 h-5 bg-gray-200 rounded"></div>
    </div>
    <div className="w-full h-64 bg-gray-200 rounded-xl mt-8"></div>
  </div>
);

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isInfoLoading, setIsInfoLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setIsInfoLoading(true);
        const response = await apiFetch('/settings');
        if (response.success && Array.isArray(response.data)) {
          setContactInfo(processSettingsData(response.data));
        }
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
      } finally {
        setIsInfoLoading(false);
      }
    };
    fetchContactInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setFeedbackMessage("");

    try {
      const response = await apiPost('/contact_request', formData);
      if (response.success) {
        setStatus("success");
        setFeedbackMessage("Thank you! Your feedback has been submitted.");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        throw new Error(response.message || "An unknown error occurred.");
      }
    } catch (err) {
      setStatus("error");
      setFeedbackMessage(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <main>
      <Navbar />
      <section className="bg-gray-50 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
               Contact Us
             </h2>
             <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
               Have any questions or need assistance? We’re here to help — reach out today!
             </p>
           </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
            
            <div className="lg:col-span-2 space-y-8">
              <h3 className="text-3xl font-bold text-gray-800">Contact Information</h3>
              {isInfoLoading ? <ContactInfoSkeleton /> : (
                <div className="space-y-6">
                  {contactInfo?.address && (
                     <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full p-3">
                        <MapPin size={24} />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-xl font-semibold text-gray-700">Address</h4>
                        <p className="text-gray-600">{contactInfo.address}</p>
                      </div>
                    </div>
                  )}
                   {contactInfo?.contact_no && (
                    <div className="flex items-center">
                       <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full p-3">
                        <Phone size={24} />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-xl font-semibold text-gray-700">Phone</h4>
                        <a href={`tel:${contactInfo.contact_no}`} className="text-gray-600 hover:text-blue-600">{contactInfo.contact_no}</a>
                      </div>
                    </div>
                  )}
                  {contactInfo?.email && (
                     <div className="flex items-center">
                       <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full p-3">
                        <Mail size={24} />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-xl font-semibold text-gray-700">Email</h4>
                        <a href={`mailto:${contactInfo.email}`} className="text-gray-600 hover:text-blue-600">{contactInfo.email}</a>
                      </div>
                    </div>
                  )}

                  {/* Google Map (Updated) */}
                  {contactInfo?.google_maps_embed_url && (
                    <div className="mt-8">
                      <iframe
                        title="Company Location"
                        className="w-full h-80 rounded-2xl shadow-md border-0"
                        loading="lazy"
                        allowFullScreen
                        src={contactInfo.google_maps_embed_url}>
                      </iframe>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-blue-600 rounded-r-2xl" />
              <h3 className="text-3xl font-bold text-blue-600 mb-8 text-center">Send Us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-left text-gray-700 font-semibold mb-2">Name</label>
                  <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Your full name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-left text-gray-700 font-semibold mb-2">Email</label>
                  <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="your@email.com" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-left text-gray-700 font-semibold mb-2">Phone</label>
                  <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Your phone number" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-left text-gray-700 font-semibold mb-2">Subject</label>
                  <input type="text" id="subject" name="subject" required value={formData.subject} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g., Inquiry about a product" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-left text-gray-700 font-semibold mb-2">Message</label>
                  <textarea id="message" name="message" required rows={5} value={formData.message} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" placeholder="Write your message here..." ></textarea>
                </div>
                <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={status === "loading"} className=" cursor-pointer w-full py-3 rounded-xl text-white font-semibold transition flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">
                  {status === "loading" ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</>) : "Submit"}
                </motion.button>
              </form>

              <AnimatePresence>
                {status === "success" && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="mt-6 flex items-center justify-center bg-green-100 text-green-800 p-3 rounded-xl text-center font-medium" >
                    <CheckCircle className="mr-2 h-5 w-5" /> {feedbackMessage}
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="mt-6 flex items-center justify-center bg-red-100 text-red-800 p-3 rounded-xl text-center font-medium" >
                    <AlertTriangle className="mr-2 h-5 w-5" /> {feedbackMessage}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Feedback;