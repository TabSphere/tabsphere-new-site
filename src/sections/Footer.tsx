import { Globe, Instagram, Facebook, Youtube, MessageCircle, ExternalLink } from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
  ],
  services: [
    { label: 'Web Development', href: '#services' },
    { label: 'Mobile Apps', href: '#services' },
    { label: 'Cybersecurity', href: '#services' },
    { label: 'Graphic Design', href: '#services' },
    { label: 'SaaS Platforms', href: '#services' },
  ],
  marketplace: [
    { label: 'TabSphere Market', href: 'https://market.tabsphere.co.uk', external: true },
    { label: 'Etsy Shop', href: 'https://www.etsy.com/uk/shop/TabsphereDigital', external: true },
    { label: 'AI Business Tools', href: 'https://www.etsy.com/uk/shop/TabsphereDigital', external: true },
    { label: 'Digital Templates', href: 'https://market.tabsphere.co.uk', external: true },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

const socialLinks = [
  { icon: MessageCircle, href: 'https://wa.me/447593836195', label: 'WhatsApp' },
  { icon: Instagram, href: 'https://www.instagram.com/tabsphere.ltd/', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61578291377535', label: 'Facebook' },
  { icon: Youtube, href: 'https://youtube.com/@tabsphereltd', label: 'YouTube' },
];

export default function Footer() {
  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative border-t border-white/5">
      {/* CTA Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="glass rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Let's build something amazing together. Get in touch for a free consultation and quote.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}
                className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-glow hover:shadow-glow-lg"
              >
                Start a Project
              </a>
              <a
                href="https://market.tabsphere.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 border border-white/20 hover:border-orange-500/50 text-white font-semibold rounded-xl transition-all hover:bg-white/5 flex items-center gap-2"
              >
                Visit Market
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <a href="#home" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Tab<span className="text-orange-500">Sphere</span>
              </span>
            </a>
            <p className="text-sm text-gray-400 mb-6">
              A Stirling-based digital studio delivering websites, apps and digital strategies for businesses across Scotland and the UK.
            </p>
            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-white/10 transition-all"
                    aria-label={link.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => { 
                      if (link.href.startsWith('#')) {
                        e.preventDefault(); 
                        scrollToSection(link.href); 
                      }
                    }}
                    className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => { 
                      e.preventDefault(); 
                      scrollToSection(link.href); 
                    }}
                    className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Marketplace Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2">
              {footerLinks.marketplace.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-orange-500 transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2026 TabSphere LTD. All Rights Reserved.
            </p>
            <p className="text-sm text-gray-500">
              Registered in Scotland, United Kingdom. Company No. 16534288
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
