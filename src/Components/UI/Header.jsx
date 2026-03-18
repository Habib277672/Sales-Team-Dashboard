import React from "react";
import { BsAsterisk } from "react-icons/bs";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../SupabaseClient";

export const Header = ({ setUserSession }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("Sign out error:", error.message);
    } else {
      if (setUserSession) setUserSession(null);

      navigate("/", { replace: true });
    }
  };

  return (
    <header className="flex h-20 w-full items-center justify-between bg-green-500 px-6 py-4 text-white">
      <h1 className="flex items-center gap-4">
        <BsAsterisk className="hidden md:flex md:text-2xl" />
        <NavLink to="/Dashboard">
          <span className="-ml-3 text-lg font-extrabold md:text-2xl">
            Sales Team Dashboard
          </span>
        </NavLink>
      </h1>
      <div className="flex gap-2 md:gap-4">
        <NavLink to="/Dashboard/users">
          <button className="cursor-pointer rounded border-2 border-green-700 p-2 text-xs font-bold text-white shadow-xl transition duration-300 hover:scale-[1.03] active:scale-95 md:px-4">
            Users
          </button>
        </NavLink>

        <button
          onClick={handleSignOut}
          className="cursor-pointer rounded border-2 border-green-700 p-2 text-xs font-bold text-white shadow-xl transition duration-300 hover:scale-[1.03] active:scale-95 md:px-4"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};
