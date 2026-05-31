import { useEffect, useRef, useState } from 'react';
import { ExternalLink, X, Globe } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Nationwide Cleaning Scotland',
    category: 'Web Design',
    year: '2026',
    image: '/project-cleaning.jpg',
    description: 'Full responsive website for a professional cleaning company serving Stirling and surrounding areas. Features online quoting, service pages, and local SEO optimization.',
    tags: ['Web Design', 'SEO', 'Responsive'],
    link: 'https://nationwidecleaningserviceslimited.co.uk',
    liveSite: true,
    stats: { views: '2.4K', conversion: '+35%' },
  },
  {
    id: 2,
    title: 'LocoRail Mobile App',
    category: 'Mobile App',
    year: '2025',
    image: '/project-app.jpg',
    description: 'Cross-platform logistics app built with Flutter for real-time rail cargo tracking. Features secure login, real-time access, and intuitive navigation for staff and passengers.',
    tags: ['Flutter', 'iOS', 'Android'],
    link: '#',
    liveSite: false,
    stats: { users: '500+', rating: '4.8\u2605' },
  },
  {
    id: 3,
    title: 'Guardwatch Security Audit',
    category: 'Reports',
    year: '2025',
    image: '/project-audit.jpg',
    description: 'Comprehensive digital audit and website redesign for a UK security firm. Mobile-first responsive design with improved accessibility and structured service layout.',
    tags: ['Audit', 'WCAG', 'Redesign'],
    link: '#',
    liveSite: false,
    stats: { issues: '23', resolved: '100%' },
  },
  {
    id: 4,
    title: "Caro's Kitchen Brand Suite",
    category: 'Branding',
    year: '2025',
    image: '/project-branding.jpg',
    description: 'Complete branding package for an African cuisine restaurant \u2014 menus, signage, flyers and collateral across all touchpoints. Vibrant design capturing warmth and authenticity.',
    tags: ['Branding', 'Print', 'Menu Design'],
    link: '#',
    liveSite: false,
    stats: { items: '15+', satisfaction: '5\u2605' },
  },
  {
    id: 5,
    title: 'AB Mahanian Enterprise',
    category: 'Web Design',
    year: '2025',
    image: '/project-enterprise.jpg',
    description: 'Full enterprise website design delivering a modern, conversion-focused presence. Clean professional aesthetic with integrated CRM and analytics.',
    tags: ['Enterprise', 'CRM', 'Analytics'],
    link: '#',
    liveSite: false,
    stats: { leads: '+120%', load: '0.8s' },
  },
];

const categories = ['All', 'Web Design', 'Mobile App', 'Reports', 'Branding'];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

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
    <section id="work" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={sectionRef}
          className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
              Selected Work
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Recent <span className="text-gradient">Projects</span>
            </h2>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-orange-500 text-white shadow-glow'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`group relative glass rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:border-orange-500/30 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => setSelectedProject(project)}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-black/50 backdrop-blur-sm text-white border border-white/10">
                    {project.category}
                  </span>
                </div>

                {/* Year */}
                <div className="absolute top-4 right-4 text-sm text-gray-400">
                  {project.year}
                </div>

                {/* Live Site Badge */}
                {project.liveSite && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-sm hover:bg-green-500/30 transition-colors"
                  >
                    <Globe className="w-3 h-3" />
                    Live Site
                  </a>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-md bg-white/5 text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <a
            href="/portfolio"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:border-orange-500/50 text-white font-medium transition-all hover:bg-white/5"
          >
            View Full Portfolio
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image */}
            <div className="h-64 sm:h-80 overflow-hidden rounded-t-2xl">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  {selectedProject.category}
                </span>
                <span className="text-sm text-gray-500">{selectedProject.year}</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">
                {selectedProject.title}
              </h3>

              <p className="text-gray-300 leading-relaxed mb-6">
                {selectedProject.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(selectedProject.stats).map(([key, value]) => (
                  <div key={key} className="glass rounded-xl p-4">
                    <div className="text-2xl font-bold text-orange-500">{value}</div>
                    <div className="text-sm text-gray-400 capitalize">{key}</div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full bg-white/5 text-gray-300 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                {selectedProject.liveSite && selectedProject.link !== '#' && (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    View Live Site
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedProject(null);
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 hover:border-orange-500/50 text-white font-semibold rounded-xl transition-all hover:bg-white/5"
                >
                  Start a Similar Project
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
