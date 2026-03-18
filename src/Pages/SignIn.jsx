import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../SupabaseClient";
import { FcGoogle } from "react-icons/fc";

export const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      alert("Please enter correct Email & Password!");
      console.log(error);
    }
    if (data.user.aud === "authenticated") {
      alert("Successfully Logged In!");
      navigate("/dashboard");
    }

    setFormData({
      email: "",
      password: "",
    });
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      console.log(error);
    }
    // if (data.user) {
    //   setUserSession(data);
    // }
  };
  return (
    <>
      <section className="flex min-h-screen w-full items-center justify-center bg-green-50 px-4 py-6">
        <div className="flex w-full max-w-md flex-col items-center justify-center">
          <div className="flex w-full flex-col items-center gap-3 rounded-xl border border-green-200 bg-white p-5 shadow-md shadow-green-100 sm:p-6">
            <h2 className="text-xl font-bold text-neutral-800 sm:text-2xl">
              Sign In
            </h2>

            <p className="text-sm text-neutral-500">
              Sign In to Access your Sales Dashboard
            </p>

            <form
              onSubmit={handleFormSubmit}
              className="flex w-full flex-col gap-3"
            >
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                placeholder="Enter Your Email"
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm transition duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
                required
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                placeholder="Enter Your Password"
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm transition duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
                required
              />

              <span className="text-right">
                <NavLink
                  to="/forgetpassword"
                  className="text-xs text-green-600 hover:underline sm:text-sm"
                >
                  Forget Password?
                </NavLink>
              </span>

              <button
                type="submit"
                className="w-full cursor-pointer rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition duration-300 hover:scale-[1.02] hover:bg-green-700 active:scale-95 sm:text-base"
              >
                Sign In
              </button>

              <p className="-mt-2 text-center">--- or ---</p>

              <button
                onClick={handleGoogleLogin}
                type="button"
                className="text-md flex w-full cursor-pointer items-center justify-center gap-4 rounded border border-neutral-500 px-4 py-2 transition duration-300 hover:scale-[1.03] active:scale-95"
              >
                <FcGoogle size={22} />
                <span>Sign In with Google</span>
              </button>
            </form>
          </div>

          <p className="mt-4 text-center text-sm text-neutral-700">
            Don't have an Account?{" "}
            <NavLink
              to="/signup"
              className="font-medium text-green-600 hover:underline"
            >
              Sign Up
            </NavLink>
          </p>
        </div>
      </section>
    </>
  );
};
