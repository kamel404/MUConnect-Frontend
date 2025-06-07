import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner, Center } from "@chakra-ui/react";

const PrivateRoute = ({ roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Center minH="80vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && (!user.roles || !roles.some(r => user.roles.includes(r)))) {
    // User does not have the required role
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
