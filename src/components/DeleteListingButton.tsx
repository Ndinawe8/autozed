"use client";

import { deleteListing } from "@/app/actions";

export default function DeleteListingButton({ id }: { id: string }) {
  return (
    <form
      action={deleteListing}
      onSubmit={(e) => {
        if (!confirm("Delete this listing? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-xs font-medium text-red-600 hover:text-red-800"
      >
        Delete
      </button>
    </form>
  );
}
