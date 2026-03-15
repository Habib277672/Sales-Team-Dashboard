import React from "react";
import { useActionState } from "react";
import { supabase } from "../../SupabaseClient";

export const UpdateForm = ({ metrics }) => {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      // Get selected user's id and the value to add
      const id = Number(formData.get("id"));
      const valueToAdd = Number(formData.get("value"));

      if (!id) {
        return new Error("No user selected");
      }

      // Fetch current value
      const { data, error: fetchError } = await supabase
        .from("sales_deals")
        .select("value")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error(fetchError.message);
        return new Error("Failed to fetch current value");
      }

      const updatedValue = data.value + valueToAdd;

      // Update with new value
      const { error } = await supabase
        .from("sales_deals")
        .update({ value: updatedValue })
        .eq("id", id);

      if (error) {
        console.error("Error Updating Deal:", error.message);
        return new Error("Failed to update value");
      }

      console.log(`Updated user id ${id} to value ${updatedValue}`);

      return null;
    },
  );

  const generateOptions = () => {
    return metrics.map((metric) => (
      <option key={metric.id} value={metric.id}>
        {metric.name} (ID: {metric.id})
      </option>
    ));
  };

  return (
    <section className="w-full">
      <form
        action={submitAction}
        className="flex flex-col gap-4 md:flex-row md:items-end"
      >
        {/* Select User */}
        <div className="flex w-full flex-col">
          <label
            htmlFor="deal-id"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Select User
          </label>

          <select
            id="deal-id"
            name="id"
            defaultValue={metrics?.[0]?.id || ""}
            disabled={isPending}
            className="rounded-md border border-gray-300 px-3 py-2 transition duration-300 outline-none focus:border-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
          >
            {generateOptions()}
          </select>
        </div>

        {/* Amount to Add */}
        <div className="flex w-full flex-col">
          <label
            htmlFor="deal-value"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Amount ($)
          </label>

          <input
            id="deal-value"
            type="number"
            name="value"
            defaultValue={0}
            min={0}
            step={10}
            aria-required="true"
            aria-label="Deal amount in dollars"
            className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="h-10 cursor-pointer rounded-md bg-green-500 px-6 font-medium text-white transition duration-300 hover:scale-[1.03] hover:bg-green-600 active:scale-95 disabled:opacity-60"
        >
          {isPending ? "Updating..." : "Update"}
        </button>
      </form>

      {error && (
        <div role="alert" className="mt-2 text-sm text-red-500">
          Something went wrong. Please try again.
        </div>
      )}
    </section>
  );
};
