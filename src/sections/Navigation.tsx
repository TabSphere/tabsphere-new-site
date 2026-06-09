import { useState, useEffect } from 'react';
import { Menu, X, Globe, ChevronDown, ShoppingBag, ExternalLink } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Products', href: '#products' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

const productDropdown = [
  {
    label: 'Etsy Shop',
    description: 'Digital templates & business guides',
    href: 'https://www.etsy.com/shop/TabsphereCreatives',
    external: true,
    icon: ShoppingBag,
  },
  {
    label: 'Template Market',
    description: 'Canva templates, spreadsheets & more',
    href: 'https://market.tabsphere.co.uk',
    external: true,
    icon: Globe,
  },
  {
    label: 'POD Store',
    description: 'Custom apparel & merchandise',
    href: 'https://www.etsy.com/shop/TabsphereCreatives',
    external: true,
    icon: ExternalLink,
  },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = navLinks.map(link => link.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.slice(1));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
    setIsProductDropdownOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}
            className="flex items-center gap-3 group"
          >
            <img 
              src="/TabSphere_Logo.png" 
              alt="TabSphere" 
              className="h-10 w-auto rounded-lg"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.label === 'Products') {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setIsProductDropdownOpen(true)}
                    onMouseLeave={() => setIsProductDropdownOpen(false)}
                  >
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeSection === link.href.slice(1)
                          ? 'text-orange-500 bg-orange-500/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                      <ChevronDown className={`w-3 h-3 transition-transform ${isProductDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isProductDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-72 glass rounded-xl border border-white/10 p-2 shadow-2xl">
                        {productDropdown.map((item) => {
                          const Icon = item.icon;
                          return (
                            <a
                              key={item.label}
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsProductDropdownOpen(false)}
                              className="flex items-start gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors group"
                            >
                              <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-4 h-4 text-orange-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 text-sm font-medium text-white group-hover:text-orange-400 transition-colors">
                                  {item.label}
                                  <ExternalLink className="w-3 h-3 text-gray-500" />
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              if (link.label === 'Blog') {
                return (
                  <a
                    key={link.href}
                    href="/blog"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeSection === 'blog'
                        ? 'text-orange-500 bg-orange-500/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Blog
                  </a>
                );
              }

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeSection === link.href.slice(1)
                      ? 'text-orange-500 bg-orange-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="/client/login"
              className="text-sm text-gray-300 hover:text-orange-500 transition-colors"
            >
              Client Login
            </a>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-all shadow-glow hover:shadow-glow-lg"
            >
              Start a Project
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/5 transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href === '/blog' ? '/blog' : link.href}
              onClick={(e) => {
                if (!link.href.startsWith('/')) {
                  e.preventDefault();
                  scrollToSection(link.href);
                }
              }}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeSection === link.href.slice(1)
                  ? 'text-orange-500 bg-orange-500/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </a>
          ))}

          <div className="px-4 py-2 border-t border-white/5 mt-2 pt-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Shop</p>
            {productDropdown.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-orange-500 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-white/5 space-y-2">
            <a
              href="/client/login"
              className="block px-4 py-3 rounded-lg text-sm text-gray-300 hover:text-orange-500 transition-colors"
            >
              Client Login
            </a>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}
              className="block px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg text-center transition-all"
            >
              Start a Project
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
