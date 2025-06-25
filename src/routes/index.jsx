import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from "@chakra-ui/react";
import Footer from "../components/layout/Footer";
import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import Stats from "../components/sections/Stats";
import Testimonials from "../components/sections/Testimonials";
import CTA from "../components/sections/CTA";
import Login from '../pages/Login';
import Register from '../pages/Register';
import GoogleCallback from '../pages/GoogleCallback';
import CompleteGoogleRegistration from '../pages/CompleteGoogleRegistration';
import Dashboard from '../pages/Dashboard';
import Events from '../pages/Events';
import ProfilePage from '../pages/Profile';
import UserProfilePage from '../pages/UserProfile';
import ResourcesPage from '../pages/Resources';
import ClubsPage from '../pages/Clubs';
import CourseDetails from '../pages/CourseDetails';
import StudyGroups from '../pages/StudyGroups';
import DocumentView from '../pages/DocumentView';
import Notifications from '../pages/Notifications';
import Requests from '../pages/Requests';
import MainLayout from '../layouts/MainLayout';
import NotFound from '../pages/NotFound';
import DegreeChart from '../pages/DegreeChart';
import CourseGradeCalculator from '../pages/CourseGradeCalculator';
import PrivateRoute from '../components/PrivateRoute';
import ResourceContentPage from '../pages/ResourceContent';
import SavedResources from '../pages/SavedResources';

export const AppRoutes = () => {
  return (
    <Routes>  
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
      <Route path="/google-callback" element={<GoogleCallback />} />
      <Route path="/complete-google-registration" element={<CompleteGoogleRegistration />} />
      
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/user/:userId" element={<UserProfilePage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/:id" element={<ResourceContentPage />} />
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/study-groups" element={<StudyGroups />} />
          <Route path="/events" element={<Events />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/document/:docId" element={<DocumentView />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/degree-chart" element={<DegreeChart />} />
          <Route path="/grade-calculator" element={<CourseGradeCalculator />} />
          <Route path="/saved-resources" element={<SavedResources />} />
        </Route>
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
