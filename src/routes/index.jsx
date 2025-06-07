import { Routes, Route } from 'react-router-dom';
import { Box } from "@chakra-ui/react";
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
import UserProfilePage from '../pages/UserProfile';
import ResourcesPage from '../pages/Resources';
import ClubsPage from '../pages/Clubs';
import CourseDetails from '../pages/CourseDetails';
import StudyGroups from '../pages/StudyGroups';
import Hashtags from '../pages/Hashtags';
import DocumentView from '../pages/DocumentView';
import Notifications from '../pages/Notifications';
import Requests from '../pages/Requests';
import MainLayout from '../layouts/MainLayout';
import ResourceContent from '../pages/ResourceContent';
import NotFound from '../pages/NotFound';
import DegreeChart from '../pages/DegreeChart';
import PrivateRoute from '../components/PrivateRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes without sidebar */}
      <Route path="/" element={
        <Box bg="linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" minH="100vh">
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
      {/* You may want to add a public /unauthorized page here if not already present */}

      {/* Protected routes with sidebar layout */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/user/:userId" element={<UserProfilePage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/courses/:id/resource/:resourceId" element={<ResourceContent />} />
          <Route path="/study-groups" element={<StudyGroups />} />
          <Route path="/events" element={<Events />} />
          <Route path="/hashtags" element={<Hashtags />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/document/:docId" element={<DocumentView />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/resources/:id" element={<ResourceContent />} />
          <Route path="/degree-chart" element={<DegreeChart />} />
        </Route>
      </Route>
      
      {/* Catch-all route for 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
