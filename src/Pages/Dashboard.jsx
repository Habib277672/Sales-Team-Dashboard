import React, { useEffect, useState, Suspense } from "react";
import { supabase } from "../SupabaseClient";
import { UpdateForm } from "../Components/UI/UpdateForm";
import { InserForm } from "../Components/UI/InsertForm";
import { DeleteForm } from "../Components/UI/DeleteForm";

// import { Chart } from "react-charts";
const Chart = React.lazy(() =>
  import("react-charts").then((module) => ({
    default: module.Chart,
  })),
);

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);

  // Fetch data from Supabase
  useEffect(() => {
    const channel = supabase
      .channel("deal-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sales_deals",
        },
        (payload) => {
          fetchData(payload);
        },
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });

    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("sales_deals")
          .select(`id,name,value`)
          .order("value", { ascending: true });

        if (error) {
          console.log("Supabase error:", error);
        } else {
          setMetrics(data || []);
        }
      } catch (error) {
        console.error("Error while fetching data:", error);
      }
    };

    fetchData();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Calculate max value for Y-axis
  const y_max = () => {
    if (metrics.length > 0) {
      const maxValue = Math.max(...metrics.map((m) => m.value));
      return maxValue + 2000;
    }
    return 5000;
  };

  // Prepare chart data
  const chartData = [
    {
      data: metrics.map((m) => ({
        primary: `${m.name} id = ${m.id}`,
        secondary: m.value,
      })),
    },
  ];

  // Define axes
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
      max: y_max(),
      padding: {
        top: 20,
        bottom: 40,
      },
    },
  ];

  return (
    <section className="min-h-screen w-full bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Title */}
        <h1 className="mb-8 text-2xl font-bold text-gray-800 md:text-3xl">
          Sales Dashboard
        </h1>

        {/* Chart Card */}
        <div className="mb-8 rounded-xl bg-white p-4 shadow-md md:p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">
            Total Sales This Quarter ($)
          </h2>

          {/* Chart container must have height */}
          <div className="h-75 w-full md:h-100">
            <Suspense>
              <Chart
                options={{
                  data: chartData,
                  primaryAxis,
                  secondaryAxes,
                  type: "bar",
                  defaultColors: ["#22c55e"],
                  tooltip: { show: false },
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
