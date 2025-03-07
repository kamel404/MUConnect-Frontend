import { Box } from "@chakra-ui/react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import Features from "./components/sections/Features";
import Stats from "./components/sections/Stats";
import Testimonials from "./components/sections/Testimonials";
import CTA from "./components/sections/CTA";

const App = () => {
  return (
    <Box bg="linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" minH="100vh">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </Box>
  );
};

export default App;