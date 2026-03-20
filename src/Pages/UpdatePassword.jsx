import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { supabase } from "../SupabaseClient";

export const UpdatePassword = () => {
  const [password, setPassword] = useState("");

  // 🔥 IMPORTANT: session set from URL
  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const params = new URLSearchParams(hash.replace("#", "?"));

      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        // optional: clean URL
        window.history.replaceState({}, document.title, "/updatepassword");
      }
    }
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.log(error);
      alert("Error updating password");
    } else {
      alert("Password updated successfully!");
    }

    setPassword("");
  };

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-green-50 px-4 py-6">
      <div className="flex w-full max-w-md flex-col items-center justify-center">
        <div className="flex w-full flex-col items-center gap-3 rounded-xl border border-green-200 bg-white p-5 shadow-md shadow-green-100 sm:p-6">
          <h2 className="text-xl font-bold text-neutral-800 sm:text-2xl">
            Update Your Password
          </h2>

          <p className="text-sm text-neutral-500">Enter your new password</p>

          <form
            onSubmit={handleFormSubmit}
            className="flex w-full flex-col gap-3"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Your New Password"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
              required
            />

            <button
              type="submit"
              className="w-full cursor-pointer rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Update Password
            </button>
          </form>
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
