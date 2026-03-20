import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { supabase } from "../SupabaseClient";

export const ForgetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [message, setMessage] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setMessage(""); // reset message

    // Checking email in users table if exist
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("Email")
      .eq("Email", formData.email.toLowerCase())
      .single();

    if (userError || !userData) {
      setMessage("Enter correct Email!");
      return;
    }

    // If Email is Existed Then Reset Password
    const { error } = await supabase.auth.resetPasswordForEmail(
      formData.email,
      {
        redirectTo:
          "https://sales-team-dashboard-lilac.vercel.app/updatepassword",
      },
    );

    if (error) {
      console.log(error);
      setMessage("Something went wrong!");
    } else {
      setMessage("Check your email for reset link");
    }

    setFormData({ email: "" });
  };

  return (
    <>
      <section className="flex min-h-screen w-full items-center justify-center bg-green-50 px-4 py-6">
        <div className="flex w-full max-w-md flex-col items-center justify-center">
          <div className="flex w-full flex-col items-center gap-3 rounded-xl border border-green-200 bg-white p-5 shadow-md shadow-green-100 sm:p-6">
            <h2 className="text-xl font-bold text-neutral-800 sm:text-2xl">
              Forget Password?
            </h2>

            <p className="text-sm text-neutral-500">
              Provide Your email address to Reset Password
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

              <button
                type="submit"
                className="w-full cursor-pointer rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition duration-300 hover:scale-[1.02] hover:bg-green-700 active:scale-95 sm:text-base"
              >
                Reset Password
              </button>

              {message && (
                <p className="text-center text-sm text-red-500">{message}</p>
              )}
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
    </>
  );
};
