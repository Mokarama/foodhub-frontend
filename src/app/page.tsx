import Categories from '@/src/components/home/Categories';
import FeaturedMeals from '@/src/components/home/FeaturedMeals';
import Hero from '@/src/components/home/Hero';
import HowItWorks from '@/src/components/home/HowItWorks';

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedMeals />
      <HowItWorks />
    </>
  );
}
