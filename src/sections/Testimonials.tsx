import { useEffect, useRef, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Ama O.',
    role: 'Business Owner',
    content: 'The wall art looks incredible in my office. Framing quality and color depth were outstanding. TabSphere delivered exactly what I envisioned — professional, timely, and with amazing attention to detail.',
    rating: 5,
    date: 'April 2026',
    avatar: 'A',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 2,
    name: 'Kwame D.',
    role: 'Entrepreneur',
    content: 'Clear structure, easy to use, and instantly useful for weekly planning. The digital products from TabSphere Market have transformed how I organize my business. Highly recommended!',
    rating: 5,
    date: 'April 2026',
    avatar: 'K',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 3,
    name: 'Sarah M.',
    role: 'Office Manager, Stirling',
    content: 'Fantastic service from start to finish. The team was professional, thorough, and left our office absolutely spotless. We have been using them for six months now and could not be happier.',
    rating: 5,
    date: 'March 2026',
    avatar: 'S',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 4,
    name: 'James & Linda T.',
    role: 'Homeowners, Bridge of Allan',
    content: 'Moving house is stressful enough without having to worry about cleaning. NCS took care of everything — the property was immaculate when we handed over the keys. Highly recommend!',
    rating: 5,
    date: 'March 2026',
    avatar: 'J',
    color: 'from-purple-500 to-violet-500',
  },
  {
    id: 5,
    name: 'Emma K.',
    role: 'Resident, Dunblane',
    content: 'We switched to their eco-friendly cleaning service and are delighted. The results are just as impressive, and we feel good knowing we are making a better choice for the environment.',
    rating: 5,
    date: 'February 2026',
    avatar: 'E',
    color: 'from-orange-500 to-amber-500',
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

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
            Google Reviews
          </div>
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
            <span className="text-gray-400">from 10+ reviews</span>
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
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'w-8 bg-orange-500'
                        : 'bg-white/20 hover:bg-white/40'
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
        <div className="text-center mt-12">
          <a
            href="https://g.page/r/CRdmNkHuS8E2EAI/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:border-orange-500/50 text-white font-medium transition-all hover:bg-white/5"
          >
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            Rate Us on Google
          </a>
        </div>
      </div>
    </section>
  );
}
