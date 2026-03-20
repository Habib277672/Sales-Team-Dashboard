import React, { useEffect, useState, Suspense } from "react";
import { supabase } from "../SupabaseClient";
import { UpdateForm } from "../Components/UI/UpdateForm";
import { InserForm } from "../Components/UI/InsertForm";
import { DeleteForm } from "../Components/UI/DeleteForm";

// Lazy loading charts
const Chart = React.lazy(() =>
  import("react-charts").then((module) => ({ default: module.Chart })),
);

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("sales_deals")
          .select("id,name,value")
          .order("value", { ascending: true });

        if (error) console.log("Supabase error:", error);
        else setMetrics(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    const channel = supabase
      .channel("deal-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sales_deals" },
        () => fetchData(),
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // Get Top 4 Highest Values
  const top4Metrics = [...metrics]
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  // Max value for Y-axis
  const maxValue =
    top4Metrics.length > 0
      ? Math.max(...top4Metrics.map((m) => m.value))
      : 5000;

  // Prepare Chart Data
  const chartData = [
    {
      data: top4Metrics.map((m) => ({
        primary: `${m.name} id = ${m.id}`,
        secondary: m.value,
      })),
    },
  ];

  // Chart Axes
  const primaryAxis = {
    getValue: (d) => d.primary,
    scaleType: "band",
    padding: 0.2,
    position: "bottom",
  };

  const secondaryAxes = [
    {
      getValue: (d) => d.secondary,
      scaleType: "linear",
      min: 0,
      max: maxValue + 2000,
      padding: { top: 20, bottom: 40 },
    },
  ];

  return (
    <section className="min-h-screen w-full bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-2xl font-bold text-gray-800 md:text-3xl">
          Sales Dashboard
        </h1>

        {/* Chart Card */}
        <div className="mb-8 rounded-xl bg-white p-4 shadow-md md:p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">
            Top 4 Sales This Quarter ($)
          </h2>

          <div className="h-75 w-full md:h-100">
            <Suspense
              fallback={<p className="mt-10 text-center">Loading Chart...</p>}
            >
              <Chart
                options={{
                  data: chartData,
                  primaryAxis,
                  secondaryAxes,
                  type: "bar",
                  defaultColors: ["#22c55e"],
                  tooltip: { show: true },
                }}
              />
            </Suspense>
          </div>
        </div>

        {/* Forms Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Add User */}
          <div className="rounded-xl bg-white p-4 shadow-md md:p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">
              Add New User
            </h2>
            <div className="w-full">
              <InserForm />
            </div>
          </div>

          {/* Update User */}
          <div className="rounded-xl bg-white p-4 shadow-md md:p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">
              Update Existing User Value
            </h2>
            <div className="w-full">
              <UpdateForm metrics={metrics} />
            </div>
          </div>

          {/* Delete User */}
          <div className="rounded-xl bg-white p-4 shadow-md md:col-span-2 md:p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">
              Delete Existing User
            </h2>
            <div className="w-full">
              <DeleteForm metrics={metrics} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
