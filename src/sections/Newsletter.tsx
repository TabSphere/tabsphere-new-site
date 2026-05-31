import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, ArrowRight, Check, Download, Sparkles } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
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
    if (!email || !email.includes('@')) return;

    // Save to Supabase
    await supabase.from('newsletter_subscribers').upsert({
      email: email.toLowerCase().trim(),
      source: 'website-newsletter',
      subscribed: true,
    }, { onConflict: 'email' });

    // Also keep localStorage as backup
    const subscribers = JSON.parse(localStorage.getItem('tabsphere_subscribers') || '[]');
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem('tabsphere_subscribers', JSON.stringify(subscribers));
    }

    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="relative py-20 lg:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-orange-500/5" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={sectionRef}
          className={`glass rounded-2xl p-8 lg:p-12 border border-orange-500/10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">You're In!</h3>
              <p className="text-gray-400 mb-6">
                Check your inbox for your free Business Startup Checklist.
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-xl text-sm">
                <Download className="w-4 h-4" />
                Your checklist is on its way
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left — Copy */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium mb-4">
                  <Sparkles className="w-3 h-3" />
                  Free Resource
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                  Get Free Business Startup Tips
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Join entrepreneurs across the UK. Weekly tips to grow your business + 
                  a free <strong className="text-orange-400">Business Startup Checklist</strong> instantly.
                </p>
                <ul className="mt-4 space-y-2">
                  {[
                    'Weekly actionable business tips',
                    'Free tools and templates',
                    'Early access to new products',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-400">
                      <Check className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-glow hover:shadow-glow-lg"
                >
                  Subscribe & Get Checklist
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-xs text-gray-500 text-center">
                  No spam. Unsubscribe anytime. Your email is never shared.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
