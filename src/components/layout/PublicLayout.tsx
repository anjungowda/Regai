import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { ROUTES } from '../../constants';

const PublicLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: ROUTES.PUBLIC.HOME },
    { name: 'Features', path: ROUTES.PUBLIC.FEATURES },
    { name: 'Pricing', path: ROUTES.PUBLIC.PRICING },
    { name: 'About', path: ROUTES.PUBLIC.ABOUT },
    { name: 'Contact', path: ROUTES.PUBLIC.CONTACT },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col font-interface">
      {/* Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-200 bg-white border-b border-slate-200 ${
          isScrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Left: Logo */}
            <Link to={ROUTES.PUBLIC.HOME} className="flex items-center gap-2 flex-shrink-0">
              <Shield className="h-8 w-8 text-[#1B4FD8]" />
              <div className="flex items-center">
                <span className="text-[#0F2557] font-bold text-xl tracking-tight">RegShield</span>
                <span className="text-[#1B4FD8] font-bold text-xl tracking-tight ml-1">AI</span>
              </div>
            </Link>

            {/* Centre: Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 py-2 border-b-2 ${
                    isActive(link.path)
                      ? 'border-[#1B4FD8] text-[#1B4FD8]'
                      : 'border-transparent text-slate-600 hover:text-[#1B4FD8]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right: CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to={ROUTES.AUTH.LOGIN}
                className="text-sm font-semibold text-[#1B4FD8] border border-[#1B4FD8] rounded-lg px-4 py-2 transition-colors hover:bg-slate-50"
              >
                Log In
              </Link>
              <Link
                to={ROUTES.PUBLIC.DEMO}
                className="text-sm font-semibold text-white bg-[#1B4FD8] rounded-lg px-5 py-2 transition-colors hover:bg-[#0F2557]"
              >
                Book a Demo
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-slate-600 hover:text-[#1B4FD8] hover:bg-slate-100 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-blue-50 text-[#1B4FD8]'
                      : 'text-slate-600 hover:text-[#1B4FD8] hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
                <Link
                  to={ROUTES.AUTH.LOGIN}
                  className="w-full text-center text-sm font-semibold text-[#1B4FD8] border border-[#1B4FD8] rounded-lg px-4 py-3 hover:bg-slate-50"
                >
                  Log In
                </Link>
                <Link
                  to={ROUTES.PUBLIC.DEMO}
                  className="w-full text-center text-sm font-semibold text-white bg-[#1B4FD8] rounded-lg px-4 py-3 hover:bg-[#0F2557]"
                >
                  Book a Demo
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow"><Outlet /></main>

      {/* Footer */}
      <footer className="bg-[#0F2557] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Column 1 */}
            <div className="space-y-6">
              <Link to={ROUTES.PUBLIC.HOME} className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-white" />
                <div className="flex items-center">
                  <span className="text-white font-bold text-xl tracking-tight">RegShield AI</span>
                </div>
              </Link>
              <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
                Compliance operations infrastructure for UK fintech startups.
              </p>
              <a href="mailto:info@regshield.ai" className="inline-block text-[#0EA5E9] hover:text-white transition-colors text-sm font-medium">
                info@regshield.ai
              </a>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-6">
                Platform
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link to={ROUTES.PUBLIC.FEATURES} className="text-slate-300 hover:text-white text-sm transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.PUBLIC.PRICING} className="text-slate-300 hover:text-white text-sm transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.PUBLIC.DEMO} className="text-slate-300 hover:text-white text-sm transition-colors">
                    Book a Demo
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.AUTH.REGISTER} className="text-slate-300 hover:text-white text-sm transition-colors">
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-6">
                Company
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link to={ROUTES.PUBLIC.ABOUT} className="text-slate-300 hover:text-white text-sm transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.PUBLIC.BLOG} className="text-slate-300 hover:text-white text-sm transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.PUBLIC.CONTACT} className="text-slate-300 hover:text-white text-sm transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <a href="#privacy" className="text-slate-300 hover:text-white text-sm transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="text-slate-300 hover:text-white text-sm transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-6">
                Compliance
              </h3>
              <ul className="space-y-4">
                <li className="text-slate-300 text-sm">FCA-aligned workflows</li>
                <li className="text-slate-300 text-sm">JMLSG guidance</li>
                <li className="text-slate-300 text-sm">GDPR-compliant</li>
                <li className="text-slate-300 text-sm">UK data residency</li>
                <li className="text-slate-300 text-sm">Built for MLROs</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2026 RegShield AI Limited. All rights reserved.
            </p>
            <p className="text-slate-300 text-sm font-medium">
              Built for UK fintech compliance teams
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
