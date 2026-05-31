import { Shield, FileText, ExternalLink } from 'lucide-react';

export function PrivacyPolicySection() {
  return (
    <section id="privacy-policy" className="relative py-24 lg:py-32 border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Legal
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Privacy Policy
          </h2>
          <p className="text-gray-400">Last updated: 31 May 2026</p>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">1. Introduction</h3>
            <p>
              TabSphere LTD ("we", "us", or "our") is committed to protecting your privacy. 
              We are registered in Scotland, United Kingdom (Company No. 16534288) and comply with the 
              UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">2. Information We Collect</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong className="text-white">Personal Information:</strong> Name, email, phone number provided through our contact form.</li>
              <li><strong className="text-white">Usage Data:</strong> Pages visited, time spent, referral sources (via Google Analytics).</li>
              <li><strong className="text-white">Technical Data:</strong> IP address, browser type, device information.</li>
              <li><strong className="text-white">Newsletter Subscriptions:</strong> Email addresses stored in localStorage (upgrade to backend coming soon).</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">3. How We Use Your Information</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>To respond to enquiries and provide our services</li>
              <li>To send newsletters (only with your explicit consent)</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">4. Your Rights Under UK GDPR</h3>
            <p className="mb-2">You have the right to: access, correct, erase, restrict processing, object to processing, and data portability. Contact us at <strong className="text-white">info@tabsphere.co.uk</strong> to exercise these rights.</p>
            <p>You may also complain to the <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline inline-flex items-center gap-1">Information Commissioner's Office <ExternalLink className="w-3 h-3" /></a>.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">5. Cookies & Tracking</h3>
            <p>
              We use Google Analytics 4 to understand how visitors interact with our website. 
              You can opt out of Google Analytics tracking using the 
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline inline-flex items-center gap-1"> Google opt-out browser add-on <ExternalLink className="w-3 h-3" /></a>.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">6. Data Retention</h3>
            <p>Contact form submissions are retained for up to 24 months. Newsletter subscriber emails are retained until you unsubscribe. You may request deletion at any time.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">7. Contact Us</h3>
            <p>
              TabSphere LTD, Stirling, Scotland, UK · Company No. 16534288<br />
              Email: <strong className="text-white">info@tabsphere.co.uk</strong> · Phone: <strong className="text-white">07593 836195</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TermsOfServiceSection() {
  return (
    <section id="terms-of-service" className="relative py-24 lg:py-32 border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
            <FileText className="w-4 h-4" />
            Legal
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Terms of Service
          </h2>
          <p className="text-gray-400">Last updated: 31 May 2026</p>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">1. Agreement to Terms</h3>
            <p>
              By accessing <strong className="text-white">tabsphere.co.uk</strong> and using our services, 
              you agree to these Terms. TabSphere LTD is registered in Scotland (Company No. 16534288).
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">2. Services</h3>
            <p>
              We provide website design, mobile app development, branding, cybersecurity audits, 
              SaaS development, and digital strategy consulting. Specific project scope and fees 
              are agreed in writing before work begins.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">3. Intellectual Property</h3>
            <p className="mb-2"><strong className="text-white">Our IP:</strong> Pre-existing code, frameworks, and tools remain our property.</p>
            <p className="mb-2"><strong className="text-white">Your IP:</strong> Upon full payment, you own all final deliverables created specifically for your project.</p>
            <p><strong className="text-white">Third-Party Assets:</strong> Subject to their respective licences. We will inform you of any requiring separate licensing.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">4. Payment Terms</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>50% deposit required before work begins</li>
              <li>Balance due on completion before handover</li>
              <li>Milestone payments available for projects over &pound;5,000</li>
              <li>Late payments may incur interest at 8% above Bank of England base rate</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">5. Cancellation & Refunds</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>14 days written notice required for cancellation</li>
              <li>Deposits are non-refundable but may be applied to future work</li>
              <li>Digital product purchases are non-refundable once downloaded unless defective</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">6. Warranty & Support</h3>
            <p>
              Each package includes a specified support period for bug fixes. Support covers issues 
              caused by our work only. Hosting, domain, and third-party service issues are not covered.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">7. Limitation of Liability</h3>
            <p>
              Our total liability shall not exceed the total amount paid for the specific project. 
              We are not liable for indirect, consequential, or punitive damages.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">8. Governing Law</h3>
            <p>
              These Terms are governed by the laws of Scotland and the United Kingdom. 
              Disputes are subject to the exclusive jurisdiction of Scottish courts.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">9. Contact</h3>
            <p>
              TabSphere LTD, Stirling, Scotland, UK · Company No. 16534288<br />
              Email: <strong className="text-white">info@tabsphere.co.uk</strong> · Phone: <strong className="text-white">07593 836195</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
