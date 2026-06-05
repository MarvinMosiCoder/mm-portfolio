// src/Middleware/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { session, loading } = useAuth();

  if (loading) {
    // You can make this a nicer loader if you want
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-700">
        Checking session...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin" replace />; // acts as login page
  }

  return element;
};

export default ProtectedRoute;
