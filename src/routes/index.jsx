import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Spinner, Center } from "@chakra-ui/react";
import PrivateRoute from '../components/PrivateRoute';
import MainLayout from '../layouts/MainLayout';

// Lazy load pages - grouped by feature for better chunking
const LandingPage = lazy(() => import('../pages/LandingPage'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const GoogleCallback = lazy(() => import('../pages/GoogleCallback'));
const CompleteGoogleRegistration = lazy(() => import('../pages/CompleteGoogleRegistration'));

// Core pages
const Dashboard = lazy(() => import('../pages/Dashboard'));
const ProfilePage = lazy(() => import('../pages/Profile'));
const UserProfilePage = lazy(() => import('../pages/UserProfile'));
const Notifications = lazy(() => import('../pages/Notifications'));

// Resource-related pages (grouped)
const ResourcesPage = lazy(() => import('../pages/Resources'));
const ResourceContentPage = lazy(() => import('../pages/ResourceContent'));
const SavedResources = lazy(() => import('../pages/SavedResources'));
const ResourceModeration = lazy(() => import('../pages/ResourceModeration'));
const DocumentView = lazy(() => import('../pages/DocumentView'));

// Community pages (grouped)
const ClubsPage = lazy(() => import('../pages/Clubs'));
const StudyGroups = lazy(() => import('../pages/StudyGroups'));
const Events = lazy(() => import('../pages/Events'));

// Academic pages (grouped)
const CourseDetails = lazy(() => import('../pages/CourseDetails'));
const CourseGradeCalculator = lazy(() => import('../pages/CourseGradeCalculator'));

// Other
const Requests = lazy(() => import('../pages/Requests'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Loading fallback component
const LoadingFallback = () => (
  <Center h="100vh">
    <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
  </Center>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>  
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/google-callback" element={<GoogleCallback />} />
        <Route path="/complete-google-registration" element={<CompleteGoogleRegistration />} />
        
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<ProfilePage />} />
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
            <Route path="/grade-calculator" element={<CourseGradeCalculator />} />
            <Route path="/saved-resources" element={<SavedResources />} />
            <Route path="/resource-moderation" element={<ResourceModeration />} />
          </Route>
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
