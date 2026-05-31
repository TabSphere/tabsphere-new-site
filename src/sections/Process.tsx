import { useEffect, useRef, useState } from 'react';
import { MessageSquare, Lightbulb, Code2, Rocket, Headphones } from 'lucide-react';

const steps = [
  {
    id: '01',
    icon: MessageSquare,
    title: 'Discovery Call',
    description: 'We start with a free 30-minute call to understand your goals, challenges, and vision. No pressure, just clarity.',
    duration: '30 min',
  },
  {
    id: '02',
    icon: Lightbulb,
    title: 'Strategy & Planning',
    description: 'We research your market, competitors, and audience. Then we deliver a clear roadmap with timelines and deliverables.',
    duration: '1-3 days',
  },
  {
    id: '03',
    icon: Code2,
    title: 'Design & Development',
    description: 'We design, build, and test iteratively. You get regular updates and can request revisions at every stage.',
    duration: '1-4 weeks',
  },
  {
    id: '04',
    icon: Rocket,
    title: 'Launch & Optimize',
    description: 'We deploy, monitor, and optimize. Your project goes live with analytics, SEO, and performance tuning built in.',
    duration: 'Ongoing',
  },
  {
    id: '05',
    icon: Headphones,
    title: 'Support & Growth',
    description: 'We dont disappear after launch. Get ongoing support, maintenance, and strategic advice to keep growing.',
    duration: 'Monthly',
  },
];

export default function Process() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
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

  return (
    <section id="process" className="relative py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={sectionRef}
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
            How We Work
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Simple Process.
            <br />
            <span className="text-gradient">Great Results.</span>
          </h2>
          <p className="text-gray-400 text-lg">
            From first call to launch and beyond — a transparent process designed for busy business owners.
          </p>
        </div>

        {/* Process Steps - Desktop */}
        <div className="hidden lg:block">
          {/* Progress Line */}
          <div className="relative mb-12">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 -translate-y-1/2 transition-all duration-500"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            />
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    index <= activeStep
                      ? 'bg-orange-500 text-white shadow-glow'
                      : 'bg-white/10 text-gray-400 border border-white/20'
                  }`}
                >
                  {step.id}
                </button>
              ))}
            </div>
          </div>

          {/* Active Step Content */}
          <div className="glass rounded-2xl p-8 transition-all duration-500">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                {(() => {
                  const Icon = steps[activeStep].icon;
                  return <Icon className="w-8 h-8 text-orange-500" />;
                })()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-2xl font-bold text-white">{steps[activeStep].title}</h3>
                  <span className="px-3 py-1 text-xs rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    {steps[activeStep].duration}
                  </span>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {steps[activeStep].description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Process Steps - Mobile */}
        <div className="lg:hidden space-y-4">
          {steps.map((step, index) => {
            return (
              <div
                key={step.id}
                className={`glass rounded-2xl p-6 transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-orange-500">{step.id}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">{step.title}</h3>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-white/5 text-gray-400">
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
