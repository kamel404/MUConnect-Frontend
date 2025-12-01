import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Spinner, Center } from "@chakra-ui/react";

import PrivateRoute from '../components/PrivateRoute';
import MainLayout from '../layouts/MainLayout';

// =======================
// Normal Imports (Common Pages)
// =======================
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import ProfilePage from '../pages/Profile';
import UserProfilePage from '../pages/UserProfile';
import ResourcesPage from '../pages/Resources';
import ClubsPage from '../pages/Clubs';
import StudyGroups from '../pages/StudyGroups';
import Events from '../pages/Events';
import CourseDetails from '../pages/CourseDetails';
import CourseGradeCalculator from '../pages/CourseGradeCalculator';
import Requests from '../pages/Requests';
import Notifications from '../pages/Notifications';

// =======================
// Lazy Loaded (Heavy / Rare)
// =======================
const GoogleCallback = lazy(() => import('../pages/GoogleCallback'));
const CompleteGoogleRegistration = lazy(() => import('../pages/CompleteGoogleRegistration'));

const ResourceContentPage = lazy(() => import('../pages/ResourceContent'));
const SavedResources = lazy(() => import('../pages/SavedResources'));
const ResourceModeration = lazy(() => import('../pages/ResourceModeration'));
const DocumentView = lazy(() => import('../pages/DocumentView'));

const NotFound = lazy(() => import('../pages/NotFound'));

// Loading fallback
const LoadingFallback = () => (
  <Center h="100vh">
    <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
  </Center>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>

        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/google-callback" element={<GoogleCallback />} />
        <Route path="/complete-google-registration" element={<CompleteGoogleRegistration />} />

        {/* Private */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>

            {/* Core Pages */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<ProfilePage />} />
            <Route path="/user/:userId" element={<UserProfilePage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/clubs" element={<ClubsPage />} />
            <Route path="/study-groups" element={<StudyGroups />} />
            <Route path="/events" element={<Events />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/grade-calculator" element={<CourseGradeCalculator />} />

            {/* Heavy / Rare Screens */}
            <Route path="/resources/:id" element={<ResourceContentPage />} />
            <Route path="/document/:docId" element={<DocumentView />} />
            <Route path="/saved-resources" element={<SavedResources />} />
            <Route path="/resource-moderation" element={<ResourceModeration />} />

          </Route>
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
};
