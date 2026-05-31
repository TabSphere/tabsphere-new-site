import { useEffect, useRef, useState } from 'react';
import { 
  Globe, 
  Smartphone, 
  ShieldCheck, 
  Palette, 
  Cloud, 
  TrendingUp,
  ArrowRight 
} from 'lucide-react';

const services = [
  {
    id: '01',
    icon: Globe,
    title: 'Website Design & Development',
    description: 'Custom, conversion-focused websites built for speed, accessibility and growth. From landing pages to full enterprise solutions.',
    features: ['Responsive Design', 'SEO Optimized', 'CMS Integration', 'Performance Tuned'],
    href: '#contact',
  },
  {
    id: '02',
    icon: Smartphone,
    title: 'Mobile App Development',
    description: 'Cross-platform iOS and Android apps built with Flutter. From logistics to conservation, we build polished and performant apps.',
    features: ['iOS & Android', 'Flutter Framework', 'UI/UX Design', 'API Integration'],
    href: '#contact',
  },
  {
    id: '03',
    icon: ShieldCheck,
    title: 'Cybersecurity & Digital Audit',
    description: 'Vulnerability audits, WCAG accessibility reviews and full written reports to keep your business compliant and secure.',
    features: ['Security Audits', 'WCAG Compliance', 'Penetration Testing', 'Risk Assessment'],
    href: '#contact',
  },
  {
    id: '04',
    icon: Palette,
    title: 'Branding & Print Design',
    description: 'Logos, menus, signage, flyers and full brand identity suites for print and digital that make your business unforgettable.',
    features: ['Logo Design', 'Brand Guidelines', 'Print Collateral', 'Visual Identity'],
    href: '#contact',
  },
  {
    id: '05',
    icon: Cloud,
    title: 'SaaS & Platform Development',
    description: 'Scalable software products built from the ground up with modern cloud stacks. Turn your idea into a working platform.',
    features: ['Cloud Architecture', 'Scalable Infrastructure', 'API Development', 'Database Design'],
    href: '#contact',
  },
  {
    id: '06',
    icon: TrendingUp,
    title: 'Digital Strategy & Consulting',
    description: 'Practical roadmaps for businesses that want consistent digital growth. We plan, execute, and measure results.',
    features: ['Growth Strategy', 'Market Analysis', 'Competitor Research', 'ROI Tracking'],
    href: '#contact',
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const Icon = service.icon;

  return (
    <div
      ref={cardRef}
      className={`group relative glass rounded-2xl p-6 lg:p-8 transition-all duration-500 hover:border-orange-500/30 hover:bg-white/[0.03] cursor-pointer ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Number */}
      <div className="absolute top-6 right-6 text-6xl font-bold text-white/5 group-hover:text-orange-500/10 transition-colors">
        {service.id}
      </div>

      {/* Icon */}
      <div className={`w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 transition-all duration-300 ${
        isHovered ? 'bg-orange-500/20 scale-110' : ''
      }`}>
        <Icon className="w-7 h-7 text-orange-500" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
        {service.title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-6">
        {service.description}
      </p>

      {/* Features */}
      <div className="flex flex-wrap gap-2 mb-6">
        {service.features.map((feature) => (
          <span
            key={feature}
            className="px-3 py-1 text-xs rounded-full bg-white/5 text-gray-300 border border-white/10"
          >
            {feature}
          </span>
        ))}
      </div>

      {/* Link */}
      <a
        href={service.href}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="inline-flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-400 transition-colors"
      >
        Learn More
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
    <section id="services" className="relative py-24 lg:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={sectionRef}
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
            What We Do
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Full Digital Stack.
            <br />
            <span className="text-gradient">One Team.</span>
          </h2>
          <p className="text-gray-400 text-lg">
            From your first website to a complete SaaS product — joined-up delivery, 
            no handoff headaches.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
