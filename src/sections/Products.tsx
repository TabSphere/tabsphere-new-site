import { useEffect, useRef, useState } from 'react';
import { ExternalLink, ShoppingBag, FileText, Palette, Bot, Calculator } from 'lucide-react';

const products = [
  {
    id: 1,
    title: 'UK Cleaning Business Startup Guide',
    description: 'Complete A-to-Z guide for starting a cleaning business in the UK. Includes market research, pricing strategies, legal requirements, and marketing templates.',
    price: '£8.97',
    format: 'PDF + Excel',
    icon: FileText,
    color: 'from-teal-500 to-emerald-500',
    bgColor: 'bg-teal-500/10',
    iconColor: 'text-teal-400',
    borderColor: 'border-teal-500/20',
  },
  {
    id: 2,
    title: 'Wedding Planner Canva Template',
    description: 'Beautiful, customisable wedding planner with 50+ pages. Budget tracker, guest list, timeline, vendor contacts, and seating chart — all in Canva.',
    price: '£18.97',
    format: 'Canva Editable',
    icon: Palette,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-500/20',
  },
  {
    id: 3,
    title: 'AI Business Toolkit',
    description: '100+ expertly crafted ChatGPT prompts to automate your business. Marketing, customer service, content creation, finance, and operations — instant AI power.',
    price: '£9.97',
    format: '100+ ChatGPT Prompts',
    icon: Bot,
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-500/10',
    iconColor: 'text-violet-400',
    borderColor: 'border-violet-500/20',
  },
  {
    id: 4,
    title: 'Wedding Budget Spreadsheet',
    description: 'Comprehensive wedding budget tracker with automated calculations, payment schedules, vendor comparisons, and expense categories. Works in Google Sheets & Excel.',
    price: '£12.97',
    format: 'Google Sheets + Excel',
    icon: Calculator,
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-500/10',
    iconColor: 'text-rose-400',
    borderColor: 'border-rose-500/20',
  },
];

export default function Products() {
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
    <section id="products" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/3 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={sectionRef}
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-6">
            <ShoppingBag className="w-4 h-4" />
            Digital Products
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Tools for <span className="text-gradient">Entrepreneurs & Creatives</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Ready-made business guides, wedding planners & Canva templates — instant download
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <div
                key={product.id}
                className={`group relative glass rounded-2xl p-6 transition-all duration-500 hover:border-teal-500/30 hover:bg-white/[0.03] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${product.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${product.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-teal-400 transition-colors leading-tight">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">
                  {product.description}
                </p>

                {/* Format Tag */}
                <span className={`inline-block px-2 py-1 text-xs rounded-md ${product.bgColor} ${product.iconColor} border ${product.borderColor} mb-4`}>
                  {product.format}
                </span>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xl font-bold text-white">{product.price}</span>
                  <a
                    href="https://www.etsy.com/shop/TabsphereCreatives"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${product.bgColor} ${product.iconColor} hover:brightness-125`}
                  >
                    Buy Now
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Row */}
        <div className={`mt-12 flex flex-wrap items-center justify-center gap-4 transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <a
            href="https://www.etsy.com/shop/TabsphereCreatives"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-teal-500/25"
          >
            <ShoppingBag className="w-4 h-4" />
            Shop on Etsy
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="https://market.tabsphere.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-amber-500/30 hover:border-amber-500/60 text-amber-400 font-semibold rounded-xl transition-all hover:bg-amber-500/10"
          >
            Visit TabSphere Market
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
