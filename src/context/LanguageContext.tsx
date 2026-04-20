'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'ar' | 'es';

// Translation Dictionaries
const translations = {
  en: {
    'nav.home': 'Home',
    'nav.meals': 'Meals',
    'nav.dashboard': 'Dashboard',
    'nav.favorites': 'Favorites',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.cart': 'Cart',
    'hero.title1': 'Delicious Meals,',
    'hero.title2': 'Delivered Fast',
    'hero.explore': 'Explore Meals 🍽️',
    'common.add_to_cart': 'Add to Cart',
    'common.loading': 'Loading...',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.meals': 'Comidas',
    'nav.dashboard': 'Panel',
    'nav.favorites': 'Favoritos',
    'nav.login': 'Entrar',
    'nav.logout': 'Salir',
    'nav.cart': 'Carrito',
    'hero.title1': 'Comida Deliciosa,',
    'hero.title2': 'Entrega Rápida',
    'hero.explore': 'Explorar 🍽️',
    'common.add_to_cart': 'Añadir al Carrito',
    'common.loading': 'Cargando...',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.meals': 'الوجبات',
    'nav.dashboard': 'لوحة القيادة',
    'nav.favorites': 'المفضلة',
    'nav.login': 'تسجيل الدخول',
    'nav.logout': 'تسجيل خروج',
    'nav.cart': 'عربة التسوق',
    'hero.title1': 'وجبات لذيذة،',
    'hero.title2': 'تصلك بسرعة',
    'hero.explore': 'تصفح الوجبات 🍽️',
    'common.add_to_cart': 'أضف للسلة',
    'common.loading': 'جاري التحميل...',
  }
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedLang = localStorage.getItem('foodhub_lang') as Language;
    if (storedLang && ['en', 'ar', 'es'].includes(storedLang)) {
      setLangState(storedLang);
      document.documentElement.dir = storedLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = storedLang;
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('foodhub_lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const t = (key: keyof typeof translations.en) => {
    // Fallback to English if translation is missing
    return translations[lang][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRtl: lang === 'ar' }}>
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
