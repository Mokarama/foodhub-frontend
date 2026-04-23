import "../app/globals.css";
import Navbar from '@/src/components/navbar/Navbar';
import Footer from '@/src/components/footer/Footer';
import { AuthProvider } from '@/src/context/AuthContext';
import { CartProvider } from '@/src/context/CartContext';
import { ThemeProvider } from '@/src/context/ThemeContext';
import { LanguageProvider } from '@/src/context/LanguageContext';
import { ErrorBoundary } from '@/src/components/ui';

export const metadata = {
  title: 'FoodHub — Order Delicious Meals Online',
  description:
    'Discover and order from the best food providers near you. Fresh meals, fast delivery, and great taste — all in one place.',
  keywords: 'food delivery, order food, meals online, restaurant delivery',
  openGraph: {
    title: 'FoodHub — Order Delicious Meals Online',
    description: 'Discover and order from the best food providers near you.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ErrorBoundary>
          <ThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <CartProvider>
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </CartProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
