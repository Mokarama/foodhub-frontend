'use client';

import { useAuthContext } from '@/src/context/AuthContext';
import { useCart } from '@/src/context/CartContext';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  IoCart,
  IoLogOut,
  IoPersonCircle,
  IoMenu,
  IoClose,
  IoChevronDown,
  IoRestaurant,
  IoGridOutline,
  IoShieldCheckmark,
  IoMoon,
  IoSunny,
  IoNotificationsOutline,
  IoLanguageOutline,
  IoReceipt
} from 'react-icons/io5';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthContext();
  const { getTotalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const router = useRouter();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Mock Notifications for UI
  const unreadNotifs = 2;

  const cartItems = getTotalItems();

  // Glassmorphism on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) setShowUserMenu(false);
      if (langRef.current && !langRef.current.contains(target)) setShowLangMenu(false);
      if (notifRef.current && !notifRef.current.contains(target)) setShowNotifMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
    setShowUserMenu(false);
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/meals', label: t('nav.meals') },
    { href: '/providers', label: 'Providers' },
  ];

  if (user?.role === 'PROVIDER') {
    navLinks.push({ href: '/provider/meals', label: 'My Foods' });
  }

  return (
    <>
      {/* ===== Main Navbar ===== */}
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${
            scrolled
              ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-100'
              : 'bg-white shadow-sm'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-extrabold group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                🍕
              </span>
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                FoodHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 font-medium transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}

              {!isAuthenticated ? (
                <div className="flex items-center gap-3 ml-4">
                  <Link
                    href="/login"
                    className="px-5 py-2 rounded-lg text-gray-700 hover:text-orange-600 font-semibold transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3 ml-4">
                  
                  {/* Theme Toggle */}
                  <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200">
                    {theme === 'dark' ? <IoSunny size={20} /> : <IoMoon size={20} />}
                  </button>

                  {/* Language Selector */}
                  <div className="relative" ref={langRef}>
                    <button onClick={() => setShowLangMenu(!showLangMenu)} className="p-2 flex items-center gap-1 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200">
                      <IoLanguageOutline size={20} />
                      <span className="text-xs font-bold uppercase">{lang}</span>
                    </button>
                    {showLangMenu && (
                      <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 w-32 py-2 overflow-hidden z-50">
                        <button onClick={() => { setLang('en'); setShowLangMenu(false); }} className={`block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${lang==='en'?'font-bold text-orange-600':'text-gray-700'}`}>English</button>
                        <button onClick={() => { setLang('es'); setShowLangMenu(false); }} className={`block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${lang==='es'?'font-bold text-orange-600':'text-gray-700'}`}>Español</button>
                        <button onClick={() => { setLang('ar'); setShowLangMenu(false); }} className={`block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${lang==='ar'?'font-bold text-orange-600':'text-gray-700'}`}>العربية</button>
                      </div>
                    )}
                  </div>

                  {/* Notifications */}
                  <div className="relative" ref={notifRef}>
                    <button onClick={() => setShowNotifMenu(!showNotifMenu)} className="relative p-2 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200">
                      <IoNotificationsOutline size={22} />
                      {unreadNotifs > 0 && <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse border border-white" />}
                    </button>
                    {showNotifMenu && (
                      <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 w-72 max-h-80 overflow-y-auto py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100 font-bold text-sm text-gray-800">Notifications</div>
                        <div className="p-4 text-xs text-gray-600 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                          <span className="font-bold text-orange-600 block mb-1">Order #1029 Confirmed</span>
                          Your order from The Burger Joint has been confirmed.
                        </div>
                        <div className="p-4 text-xs text-gray-400">
                          <span className="block mb-1">System Update</span>
                          Welcome to FoodHub V2!
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cart Icon */}
                  <Link
                    href="/cart"
                    className="relative p-2 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
                  >
                    <IoCart size={24} />
                    {cartItems > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-scaleIn">
                        {cartItems}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700 hidden lg:block max-w-[100px] truncate">
                        {user?.name}
                      </span>
                      <IoChevronDown
                        className={`text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                        size={14}
                      />
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 w-56 py-2 animate-fadeInDown overflow-hidden">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-800 text-sm truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                          <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                            {user?.role}
                          </span>
                        </div>

                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm font-medium transition"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <IoPersonCircle className="text-gray-400" />
                          My Profile
                        </Link>

                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm font-medium transition"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <IoGridOutline className="text-gray-400" />
                          Dashboard
                        </Link>

                        {user?.role === 'PROVIDER' && (
                          <Link
                            href="/provider/meals"
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm font-medium transition"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <IoRestaurant className="text-gray-400" />
                            My Meals
                          </Link>
                        )}

                        {user?.role === 'PROVIDER' && (
                          <Link
                            href="/provider/orders"
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm font-medium transition"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <IoReceipt className="text-gray-400" />
                            Manage Orders
                          </Link>
                        )}

                        {user?.role === 'CUSTOMER' && (
                          <>
                            <Link
                              href="/cart"
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm font-medium transition"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <IoCart className="text-gray-400" />
                              My Cart
                            </Link>
                            <Link
                              href="/orders"
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm font-medium transition"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <IoReceipt className="text-gray-400" />
                              My Orders
                            </Link>
                          </>
                        )}

                        {user?.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm font-medium transition"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <IoShieldCheckmark className="text-gray-400" />
                            Admin Panel
                          </Link>
                        )}

                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-50 text-red-600 text-sm font-medium transition"
                          >
                            <IoLogOut />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile: Cart + Hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              {isAuthenticated && (
                <Link
                  href="/cart"
                  className="relative p-2 rounded-lg text-gray-600"
                >
                  <IoCart size={22} />
                  {cartItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems}
                    </span>
                  )}
                </Link>
              )}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== Mobile Slide-in Menu ===== */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={closeMobile}
          />
          {/* Drawer */}
          <div className="fixed top-0 right-0 w-72 h-full bg-white z-50 shadow-2xl animate-slideInLeft md:hidden overflow-y-auto">
            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-bold text-gray-800">Menu</span>
                <button
                  onClick={closeMobile}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <IoClose size={20} />
                </button>
              </div>

              {/* User Info (if authenticated) */}
              {isAuthenticated && user && (
                <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {user.name}
                    </p>
                    <span className="text-[10px] font-semibold uppercase text-orange-600">
                      {user.role}
                    </span>
                  </div>
                </div>
              )}

              {/* Nav Links */}
              <div className="space-y-1">
                <div className="flex bg-gray-50 p-1 rounded-lg mb-4">
                  <button onClick={toggleTheme} className="flex-1 flex justify-center py-2 text-gray-700 hover:text-orange-600">
                    {theme === 'dark' ? <IoSunny size={20} /> : <IoMoon size={20} />}
                  </button>
                  <div className="w-[1px] bg-gray-200 my-1 mx-2" />
                  <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="flex-1 flex justify-center py-2 text-gray-700 hover:text-orange-600 text-sm font-bold uppercase items-center gap-1">
                    <IoLanguageOutline size={18} /> {lang}
                  </button>
                </div>

                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium transition"
                  >
                    {link.label}
                  </Link>
                ))}

                {isAuthenticated && (
                  <>
                    <div className="border-t border-gray-100 my-3" />
                    <Link
                      href="/dashboard"
                      onClick={closeMobile}
                      className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 font-medium transition"
                    >
                      Dashboard
                    </Link>
                    {user?.role === 'PROVIDER' && (
                      <Link
                        href="/provider/meals"
                        onClick={closeMobile}
                        className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 font-medium transition"
                      >
                        My Meals
                      </Link>
                    )}
                    {user?.role === 'CUSTOMER' && (
                      <Link
                        href="/orders"
                        onClick={closeMobile}
                        className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 font-medium transition"
                      >
                        My Orders
                      </Link>
                    )}
                    {user?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={closeMobile}
                        className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 font-medium transition"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-100 my-3" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium transition"
                    >
                      Sign Out
                    </button>
                  </>
                )}

                {!isAuthenticated && (
                  <>
                    <div className="border-t border-gray-100 my-3" />
                    <Link
                      href="/login"
                      onClick={closeMobile}
                      className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={closeMobile}
                      className="block px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-center font-semibold mt-2"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
