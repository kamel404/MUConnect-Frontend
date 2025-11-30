import { Box } from "@chakra-ui/react";
import Footer from "../components/layout/Footer";
import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import Testimonials from "../components/sections/Testimonials";
import CTA from "../components/sections/CTA";

const LandingPage = () => {
  return (
    <Box bg="linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" minH="100vh">
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </Box>
  );
};

export default LandingPage;
