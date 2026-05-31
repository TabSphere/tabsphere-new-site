import { useEffect, useRef, useState } from 'react';
import { Check, Zap, Building2, ShoppingBag, ArrowRight } from 'lucide-react';

const plans = [
  {
    id: 'starter',
    name: 'Starter Website',
    icon: ShoppingBag,
    description: 'Perfect for small businesses and startups looking to establish their online presence.',
    price: '£1,500',
    priceNote: 'One-time',
    popular: false,
    features: [
      'Up to 5 pages',
      'Mobile responsive design',
      'Basic SEO setup',
      'Contact form integration',
      'Google Business setup',
      '2 rounds of revisions',
      '1 month support',
    ],
    cta: 'Get Started',
    href: '#contact',
  },
  {
    id: 'growth',
    name: 'Growth Package',
    icon: Zap,
    description: 'For businesses ready to scale with advanced features and conversions focused design.',
    price: '£3,500',
    priceNote: 'One-time',
    popular: true,
    features: [
      'Up to 15 pages',
      'Custom UI/UX design',
      'Advanced SEO & analytics',
      'CMS integration',
      'Blog setup',
      'Speed optimization',
      'Social media integration',
      '5 rounds of revisions',
      '3 months support',
    ],
    cta: 'Most Popular',
    href: '#contact',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Solution',
    icon: Building2,
    description: 'Full-scale digital transformation for established businesses with complex requirements.',
    price: 'Custom',
    priceNote: 'Quote based',
    popular: false,
    features: [
      'Unlimited pages',
      'Bespoke design system',
      'Full SEO strategy',
      'Custom functionality',
      'API integrations',
      'E-commerce ready',
      'Multilingual support',
      'Accessibility compliance (WCAG)',
      'Unlimited revisions',
      '12 months support',
    ],
    cta: 'Contact Us',
    href: '#contact',
  },
];

export default function Pricing() {
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

  return (
    <section id="pricing" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={sectionRef}
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
            Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Transparent Pricing.
            <br />
            <span className="text-gradient">No Surprises.</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Fixed-price packages so you know exactly what you are getting. 
            No hidden fees, no scope creep.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative glass rounded-2xl p-6 lg:p-8 transition-all duration-500 hover:border-orange-500/30 ${
                  plan.popular ? 'border-orange-500/50 shadow-glow' : ''
                } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-orange-500 text-white text-sm font-semibold rounded-full shadow-glow">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  plan.popular ? 'bg-orange-500/20' : 'bg-white/5'
                }`}>
                  <Icon className={`w-7 h-7 ${plan.popular ? 'text-orange-500' : 'text-gray-400'}`} />
                </div>

                {/* Plan Name */}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-400 mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-gray-400 ml-2">{plan.priceNote}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.popular ? 'text-orange-500' : 'text-gray-500'
                      }`} />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={plan.href}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-glow hover:shadow-glow-lg'
                      : 'border border-white/20 hover:border-orange-500/50 text-white hover:bg-white/5'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className={`mt-12 text-center transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-gray-400">
            All packages include: SSL certificate, hosting setup, and Google Analytics integration.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Need something custom?{' '}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-orange-500 hover:text-orange-400 transition-colors"
            >
              Let's talk about your project.
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
