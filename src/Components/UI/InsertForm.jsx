import React from "react";
import { useActionState } from "react";
import { supabase } from "../../SupabaseClient";

export const InserForm = () => {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const newDeal = {
        name: formData.get("name"),
        value: Number(formData.get("value")),
      };

      console.log("New Deal:", newDeal);

      const { data, error } = await supabase
        .from("sales_deals")
        .insert([newDeal])
        .select()
        .single();

      if (error) {
        console.error("Insert Error:", error.message);
        return new Error("Failed to insert deal");
      }

      console.log("Inserted Row:", data);

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
            htmlFor="user-name"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            User Name
          </label>

          <input
            id="user-name"
            name="name"
            type="text"
            placeholder="Enter user name"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
          />
        </div>

        <div className="flex w-full flex-col">
          <label
            htmlFor="user-amount"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Initial Amount ($)
          </label>

          <input
            id="user-amount"
            name="value"
            type="number"
            placeholder="Enter amount"
            min="0"
            step="10"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="h-10 w-full cursor-pointer rounded-md bg-green-500 px-6 font-medium text-white transition duration-300 hover:scale-[1.03] hover:bg-green-600 active:scale-95 md:w-auto"
        >
          {isPending ? "Add..." : "Add"}
        </button>
      </form>

      {error && (
        <p className="mt-2 text-sm text-red-500">Something went wrong</p>
      )}
    </section>
  );
};
