import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Send, 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Youtube,
  Check,
  ShoppingBag,
  Building2,
  Store
} from 'lucide-react';

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Save to Supabase
    const { error } = await supabase.from('contact_submissions').insert({
      name: formState.name,
      email: formState.email,
      phone: formState.phone || null,
      service: formState.service || null,
      message: formState.message,
    });
    
    if (error) {
      console.error('Contact submission error:', error);
    }
    
    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ name: '', email: '', phone: '', service: '', message: '' });
    
    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: 'Location',
      value: 'Stirling, Scotland, UK',
      subtext: 'Company No. 16534288',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'info@tabsphere.co.uk',
      subtext: 'We reply within 48 hours',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+44 7593 836195',
      subtext: 'Mon-Fri 9am-6pm GMT',
    },
    {
      icon: Clock,
      label: 'Response Time',
      value: '48 Hours',
      subtext: 'First response guarantee',
    },
  ];

  const socialLinks = [
    { icon: MessageCircle, href: 'https://wa.me/447593836195', label: 'WhatsApp', color: 'hover:text-green-500' },
    { icon: Instagram, href: 'https://www.instagram.com/tabsphere.ltd/', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61578291377535', label: 'Facebook', color: 'hover:text-blue-500' },
    { icon: Youtube, href: 'https://youtube.com/@tabsphereltd', label: 'YouTube', color: 'hover:text-red-500' },
  ];

  return (
    <section id="contact" className="relative py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/about-bg.jpg"
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={sectionRef}
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your
            <br />
            <span className="text-gradient">Digital Presence?</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Tell us about your project and we will get back to you within 48 hours with a free quote.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info - Left Side */}
          <div className={`lg:col-span-2 space-y-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            {/* Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="glass rounded-xl p-5 hover:border-orange-500/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">{item.label}</div>
                        <div className="text-white font-medium">{item.value}</div>
                        <div className="text-sm text-gray-400">{item.subtext}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Links */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 transition-all hover:bg-white/10 ${link.color}`}
                      aria-label={link.label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a
                  href="https://market.tabsphere.co.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  TabSphere Market
                </a>
                <a
                  href="https://nationwidecleaningserviceslimited.co.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors text-sm"
                >
                  <Building2 className="w-4 h-4" />
                  Nationwide Cleaning
                </a>
                <a
                  href="https://www.etsy.com/uk/shop/TabsphereDigital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors text-sm"
                >
                  <Store className="w-4 h-4" />
                  Etsy Shop
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form - Right Side */}
          <div className={`lg:col-span-3 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="glass rounded-2xl p-6 lg:p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400">
                    Thank you for reaching out. We will get back to you within 48 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formState.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formState.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                        placeholder="+44 7000 000000"
                      />
                    </div>
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-2">
                        Service Interested In
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formState.service}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-gray-900">Select a service</option>
                        <option value="website" className="bg-gray-900">Website Design & Development</option>
                        <option value="app" className="bg-gray-900">Mobile App Development</option>
                        <option value="audit" className="bg-gray-900">Cybersecurity & Digital Audit</option>
                        <option value="branding" className="bg-gray-900">Branding & Print Design</option>
                        <option value="saas" className="bg-gray-900">SaaS & Platform Development</option>
                        <option value="strategy" className="bg-gray-900">Digital Strategy & Consulting</option>
                        <option value="other" className="bg-gray-900">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Tell Us About Your Project *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all resize-none"
                      placeholder="Describe your project, goals, timeline, and any specific requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold rounded-xl transition-all shadow-glow hover:shadow-glow-lg disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
