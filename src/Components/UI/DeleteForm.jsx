import React from "react";
import { useActionState } from "react";
import { supabase } from "../../SupabaseClient";

export const DeleteForm = ({ metrics }) => {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const id = Number(formData.get("id"));

      const { error } = await supabase
        .from("sales_deals")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Delete Error:", error.message);
        return new Error("Failed to delete user");
      }

      console.log("Deleted row with ID:", id);
      return null;
    },
    null,
  );

  return (
    <section className="w-full">
      <form
        action={submitAction}
        className="flex w-full flex-col gap-4 md:flex-row md:items-end"
      >
        <div className="flex w-full flex-col">
          <label
            htmlFor="delete-user"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Select User
          </label>

          <select
            id="delete-user"
            name="id"
            defaultValue={metrics?.[0]?.id || ""}
            disabled={isPending}
            className="w-full rounded-md border border-gray-300 px-3 py-2 transition duration-300 outline-none focus:border-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
          >
            {metrics.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} (ID: {user.id})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="h-10 w-full cursor-pointer rounded-md bg-red-500 px-6 font-medium text-white transition duration-300 hover:scale-[1.03] hover:bg-red-600 active:scale-95 md:w-auto"
        >
          {isPending ? "Deleting..." : "Delete"}
        </button>
      </form>

      {error && (
        <p className="mt-2 text-sm text-red-500">
          Something went wrong while deleting
        </p>
      )}
    </section>
  );
};
