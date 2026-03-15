import React, { Suspense } from "react";
import { Header } from "../UI/Header";

const Dashboard = React.lazy(() => import("../../Pages/Dashboard"));

export const DashboardLayout = () => {
  return (
    <section className="h-screen min-h-screen w-full">
      <Header />
      <Suspense
        fallback={<p className="font-semibold">Wait Dashboard is Loading</p>}
      >
        <Dashboard />
      </Suspense>
    </section>
  );
};
