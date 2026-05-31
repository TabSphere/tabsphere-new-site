import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { AuthProvider, useAuth } from './admin/AuthContext'
import { ClientAuthProvider } from './client/ClientAuthContext'

// Public site sections
import Navigation from './sections/Navigation'
import Hero from './sections/Hero'
import Services from './sections/Services'
import Portfolio from './sections/Portfolio'
import Process from './sections/Process'
import Testimonials from './sections/Testimonials'
import Pricing from './sections/Pricing'
import Products from './sections/Products'
import Contact from './sections/Contact'
import Newsletter from './sections/Newsletter'
import { PrivacyPolicySection, TermsOfServiceSection } from './sections/LegalPages'
import Footer from './sections/Footer'
import WhatsAppButton from './sections/WhatsAppButton'
import ScrollToTop from './sections/ScrollToTop'

// Admin
import Login from './admin/Login'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import ContentEditor from './admin/ContentEditor'
import Clients from './admin/Clients'
import AdminProjects from './admin/AdminProjects'
import AdminInvoices from './admin/AdminInvoices'
import Employees from './admin/Employees'
import BlogManager from './admin/BlogManager'
import Subscribers from './admin/Subscribers'
import Contacts from './admin/Contacts'
import Documents from './admin/Documents'
import Settings from './admin/Settings'

// Client Portal
import ClientLogin from './client/ClientLogin'
import ClientLayout from './client/ClientLayout'
import ClientDashboard from './client/ClientDashboard'
import ClientProjects from './client/ClientProjects'
import ProjectDetail from './client/ProjectDetail'
import ClientInvoices from './client/ClientInvoices'
import ClientMessages from './client/ClientMessages'

function HomePage() {
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
  )
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>
  if (!user) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="content" element={<ContentEditor />} />
        <Route path="clients" element={<Clients />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="invoices" element={<AdminInvoices />} />
        <Route path="employees" element={<Employees />} />
        <Route path="blog" element={<BlogManager />} />
        <Route path="subscribers" element={<Subscribers />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="documents" element={<Documents />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/client/login" element={<ClientLogin />} />
      <Route path="/client" element={<ClientLayout />}>
        <Route index element={<ClientDashboard />} />
        <Route path="projects" element={<ClientProjects />} />
        <Route path="project/:id" element={<ProjectDetail />} />
        <Route path="invoices" element={<ClientInvoices />} />
        <Route path="messages" element={<ClientMessages />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ClientAuthProvider>
          <AppRoutes />
        </ClientAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
