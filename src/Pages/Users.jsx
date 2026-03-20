import React, { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";

const Users = () => {
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = async () => {
    try {
      let query = supabase
        .from("sales_deals")
        .select("id,name,value", { count: "exact" })
        .order("value", { ascending: true });

      // Search
      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      // Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await query.range(from, to);

      if (error) {
        console.log("Supabase error:", error);
      } else {
        setUserData(data || []);
        setTotalCount(count || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
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
  }, [page, search]);

  // Total pages
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="w-full overflow-auto p-4">
      <h2 className="mb-4 text-xl font-bold">Sales Employees</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search user..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="mb-4 w-full max-w-sm rounded border px-3 py-2 transition duration-300 focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
      />

      {/* Table */}
      <table className="min-w-full table-auto border border-gray-300">
        <thead className="bg-green-100">
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Value</th>
          </tr>
        </thead>

        <tbody>
          {userData.length > 0 ? (
            userData.map((user) => (
              <tr key={user.id} className="hover:bg-green-50">
                <td className="border px-4 py-2">{user.id}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.value}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border px-4 py-2 text-center" colSpan={3}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`rounded px-3 py-1 ${
            page === 1
              ? "cursor-not-allowed bg-gray-300"
              : "bg-green-200 hover:bg-green-300"
          }`}
        >
          Prev
        </button>

        <span className="text-sm font-medium">
          Page {page} of {totalPages || 1}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages}
          className={`rounded px-3 py-1 ${
            page >= totalPages
              ? "cursor-not-allowed bg-gray-300"
              : "bg-green-200 hover:bg-green-300"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Users;
