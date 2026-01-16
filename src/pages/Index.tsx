import { Hero } from "@/components/Hero";
import { FeaturedCakes } from "@/components/FeaturedCakes";
import { CustomServices } from "@/components/CustomServices";
import { Testimonials } from "@/components/Testimonials";

const Index = () => {
  return (
    <main>
      <Hero />
      <FeaturedCakes />
      <CustomServices />
      <Testimonials />
    </main>
  );
};

export default Index;
