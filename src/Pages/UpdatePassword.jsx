import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../SupabaseClient";

export const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 🔹 Handle magic link token and set session
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace("#", "?"));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        supabase.auth
          .setSession({ access_token, refresh_token })
          .then(() => {
            console.log("Session set successfully ✅");
            // Clean URL after setting session
            window.history.replaceState({}, document.title, "/updatepassword");
          })
          .catch((err) => console.log("Session error:", err.message));
      }
    }
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setMessage("Password cannot be empty");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.log(error);
      setMessage("Error updating password: " + error.message);
    } else {
      setMessage("Password updated successfully! Redirecting...");
      setPassword("");

      // Optional: Redirect to SignIn or Dashboard after 2 seconds
      setTimeout(() => {
        navigate("/"); // Redirect to SignIn page
      }, 2000);
    }
  };

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-green-50 px-4 py-6">
      <div className="flex w-full max-w-md flex-col items-center justify-center">
        <div className="flex w-full flex-col items-center gap-3 rounded-xl border border-green-200 bg-white p-5 shadow-md shadow-green-100 sm:p-6">
          <h2 className="text-xl font-bold text-neutral-800 sm:text-2xl">
            Update Your Password
          </h2>

          <p className="text-sm text-neutral-500">Enter Your New Password</p>

          <form
            onSubmit={handleFormSubmit}
            className="flex w-full flex-col gap-3"
          >
            <input
              type="password"
              placeholder="Enter Your New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm transition duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
              required
            />

            <button
              type="submit"
              className="w-full cursor-pointer rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition duration-300 hover:scale-[1.02] hover:bg-green-700 active:scale-95 sm:text-base"
            >
              Update
            </button>
          </form>

          {message && (
            <p className="mt-2 text-center text-sm text-green-700">{message}</p>
          )}
        </div>

        <p className="mt-4 text-center text-sm text-neutral-700">
          Want to go Back to?{" "}
          <NavLink
            to="/"
            className="font-medium text-green-600 hover:underline"
          >
            Sign In
          </NavLink>
        </p>
      </div>
    </section>
  );
};
