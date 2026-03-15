import React from "react";
import { Header } from "../UI/Header";
import { Dashboard } from "../../Pages/Dashboard";

export const DashboardLayout = () => {
  return (
    <section className="h-screen min-h-screen w-full">
      <Header />
      <Dashboard />
    </section>
  );
};
