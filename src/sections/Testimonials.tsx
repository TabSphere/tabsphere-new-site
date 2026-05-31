import { useEffect, useRef, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Marcus W.',
    role: 'Director, Nationwide Cleaning Scotland',
    project: 'Web Design & SEO',
    content: 'TabSphere transformed our online presence completely. The website they built generates consistent enquiries every week — we went from 2-3 leads a month to 15+. Professional, fast, and they genuinely understood our business.',
    rating: 5,
    date: 'April 2026',
    avatar: 'M',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 2,
    name: 'Caroline A.',
    role: 'Owner, Caro\'s Kitchen',
    project: 'Branding & Print Design',
    content: 'The branding package was exceptional — menus, signage, flyers, the lot. TabSphere captured the warmth of our African cuisine perfectly. Our customers constantly comment on how professional everything looks now.',
    rating: 5,
    date: 'March 2026',
    avatar: 'C',
    color: 'from-orange-500 to-amber-500',
  },
  {
    id: 3,
    name: 'David R.',
    role: 'Founder, LocoRail Logistics',
    project: 'Mobile App Development',
    content: 'The Flutter app TabSphere built for our rail logistics operation has streamlined everything. Real-time tracking, secure logins, intuitive interface — our staff picked it up within a day. Exactly what we needed.',
    rating: 5,
    date: 'February 2026',
    avatar: 'D',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 4,
    name: 'Sarah T.',
    role: 'Director, Guardwatch Security',
    project: 'Website Redesign & Digital Audit',
    content: 'TabSphere audited our old site, found 23 issues we did not even know existed, and delivered a complete redesign that\'s WCAG compliant and mobile-first. Our bounce rate dropped by 40% in the first month.',
    rating: 5,
    date: 'January 2026',
    avatar: 'S',
    color: 'from-purple-500 to-violet-500',
  },
  {
    id: 5,
    name: 'Abraham M.',
    role: 'CEO, AB Mahanian Enterprise',
    project: 'Enterprise Website & CRM',
    content: 'Outstanding work on our enterprise platform. The CRM integration, analytics dashboard, and conversion-focused design have increased our qualified leads by over 120%. TabSphere delivered beyond expectations.',
    rating: 5,
    date: 'January 2026',
    avatar: 'A',
    color: 'from-rose-500 to-pink-500',
  },
];

export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(nextTestimonial, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={sectionRef}
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <a
            href="https://www.google.com/search?q=Tabsphere+LTD&hl=en-GB"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6 hover:bg-orange-500/20 transition-colors"
          >
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            Google Reviews — 4.8 Stars
          </a>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            What Clients <span className="text-gradient">Actually Say</span>
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-white font-bold text-lg">5.0</span>
            <span className="text-gray-400">from verified project reviews</span>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <div className="glass rounded-2xl p-8 lg:p-12 transition-all duration-500">
            <Quote className="w-12 h-12 text-orange-500/30 mb-6" />
            
            <div className="relative overflow-hidden">
              <div
                className="transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                <div className="flex">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={testimonial.id}
                      className="w-full flex-shrink-0 transition-opacity duration-500"
                      style={{ opacity: index === currentIndex ? 1 : 0.3 }}
                    >
                      {/* Project Tag */}
                      <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-4">
                        {testimonial.project}
                      </span>

                      <p className="text-xl lg:text-2xl text-white leading-relaxed mb-8">
                        "{testimonial.content}"
                      </p>
                      
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white text-xl font-bold`}>
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-white">{testimonial.name}</div>
                          <div className="text-sm text-gray-400">{testimonial.role}</div>
                        </div>
                        <div className="ml-auto flex gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/10">
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'w-8 bg-orange-500'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://g.page/r/CRdmNkHuS8E2EAI/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:border-orange-500/50 text-white font-medium transition-all hover:bg-white/5"
          >
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            Leave Us a Review
          </a>
          <a
            href="https://www.google.com/search?q=Tabsphere+LTD&hl=en-GB"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-orange-500 font-medium transition-all hover:text-orange-400"
          >
            See All Google Reviews
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
