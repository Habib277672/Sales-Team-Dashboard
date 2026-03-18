import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ userSession, isLoading, children }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userSession) {
    return <Navigate to="/Sales-Team-Dashboard/" replace />;
  }

  return children;
};
