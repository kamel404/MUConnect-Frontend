import { Routes, Route } from 'react-router-dom';
import { Box } from "@chakra-ui/react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import Stats from "../components/sections/Stats";
import Testimonials from "../components/sections/Testimonials";
import CTA from "../components/sections/CTA";
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Events from '../pages/Events';
import ProfilePage from '../pages/Profile';
import CoursesPage from '../pages/Courses';
import CourseDetails from '../pages/CourseDetails';
import ResourceContent from '../pages/ResourceContent';
import StudyGroups from '../pages/StudyGroups';
import Hashtags from '../pages/Hashtags';
import NotificationsPage from '../pages/NotificationsPage';

export const AppRoutes = () => {
  return (
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
      <Route path="/study-groups" element={<StudyGroups />} />
      <Route path="/events" element={<Events />} />
      <Route path="/hashtags" element={<Hashtags />} />
      <Route path="/notifications" element={<NotificationsPage />} />
    </Routes>
  );
};
