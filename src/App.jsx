import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import Features from "./components/sections/Features";
import Stats from "./components/sections/Stats";
import Testimonials from "./components/sections/Testimonials";
import CTA from "./components/sections/CTA";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/Profile';
import CoursesPage from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import ResourceContent from './pages/ResourceContent';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={
            <Box bg="linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" minH="100vh">
              <Navbar />
              <Hero />
              <Features />
              <Stats />
              <Testimonials />
              <CTA />
              <Footer />
            </Box>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/courses/:id/resource/:resourceId" element={<ResourceContent />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;