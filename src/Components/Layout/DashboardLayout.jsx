import React from "react";
import { Header } from "../UI/Header";
import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  return (
    <section className="flex h-screen min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </section>
  );
};
