import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Services from './sections/Services';
import Portfolio from './sections/Portfolio';
import Process from './sections/Process';
import Testimonials from './sections/Testimonials';
import Pricing from './sections/Pricing';
import Products from './sections/Products';
import Contact from './sections/Contact';
import Newsletter from './sections/Newsletter';
import { PrivacyPolicySection, TermsOfServiceSection } from './sections/LegalPages';
import Footer from './sections/Footer';
import WhatsAppButton from './sections/WhatsAppButton';
import ScrollToTop from './sections/ScrollToTop';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navigation />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <Process />
        <Testimonials />
        <Pricing />
        <Products />
        <Contact />
        <Newsletter />
        <PrivacyPolicySection />
        <TermsOfServiceSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </div>
  );
}
