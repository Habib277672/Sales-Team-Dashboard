import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ userSession, isLoading, children }) => {
  if (isLoading) return <p>Loading...</p>;

  // Agar session null hai → redirect login
  if (!userSession) return <Navigate to="/" replace />;

  return children;
};
