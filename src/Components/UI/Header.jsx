import React from "react";
import { BsAsterisk } from "react-icons/bs";

export const Header = () => {
  return (
    <header className="flex h-20 w-full items-center justify-between bg-green-500 px-6 py-4 text-white">
      <h1 className="flex items-center gap-2">
        <BsAsterisk className="md:text-2xl" />
        <span className="text-lg font-extrabold md:text-2xl">
          Sales Team Dashboard
        </span>
      </h1>
    </header>
  );
};
