import Link from 'next/link';
import {
  IoLogoFacebook,
  IoLogoTwitter,
  IoLogoInstagram,
  IoMail,
  IoCall,
  IoLocation,
} from 'react-icons/io5';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍕</span>
              <span className="text-xl font-extrabold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                FoodHub
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your favorite food delivery platform. Fresh meals from local
              providers delivered right to your door. Fast, fresh, and
              delicious.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300"
              >
                <IoLogoFacebook size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300"
              >
                <IoLogoTwitter size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300"
              >
                <IoLogoInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/meals', label: 'Browse Meals' },
                { href: '/register', label: 'Create Account' },
                { href: '/login', label: 'Sign In' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              For Providers
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/register', label: 'Become a Provider' },
                { href: '/provider/meals', label: 'Manage Meals' },
                { href: '/dashboard', label: 'Dashboard' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <IoMail className="text-orange-500 flex-shrink-0" size={16} />
                support@foodhub.com
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <IoCall className="text-orange-500 flex-shrink-0" size={16} />
                +92 300 1234567
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <IoLocation
                  className="text-orange-500 flex-shrink-0 mt-0.5"
                  size={16}
                />
                123 Food Street, Gulberg III, Lahore, Pakistan
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} FoodHub. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-300 text-sm transition"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-300 text-sm transition"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}