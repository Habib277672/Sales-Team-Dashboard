import React, { useEffect, useState, Suspense } from "react";
import "./App.css";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { DashboardLayout } from "./Components/Layout/DashboardLayout";
import { SignIn } from "./Pages/SignIn";
import { SignUp } from "./Pages/SignUp";
import { supabase } from "./SupabaseClient";
import { ForgetPassword } from "./Pages/ForgetPassword";
import { UpdatePassword } from "./Pages/UpdatePassword";
import { ProtectedRoute } from "./Components/Layout/ProtectedRoute";
const Dashboard = React.lazy(() => import("./Pages/Dashboard"));
const Users = React.lazy(() => import("./Pages/Users"));

const App = () => {
  const [userSession, setUserSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUserSession(data.session);
      setIsLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) =>
      setUserSession(session),
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const router = createHashRouter([
    { path: "/", element: <SignIn /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/forgetpassword", element: <ForgetPassword /> },
    { path: "/updatepassword", element: <UpdatePassword /> },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute isLoading={isLoading} userSession={userSession}>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: (
            <Suspense
              fallback={<p className="mt-10 text-center">Loading...</p>}
            >
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: "users",
          element: (
            <Suspense
              fallback={<p className="mt-10 text-center">Loading...</p>}
            >
              <Users />
            </Suspense>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
