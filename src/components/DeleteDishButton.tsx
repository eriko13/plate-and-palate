"use client";

import { deleteDishAction } from "@/app/actions/dishes";

type DeleteDishButtonProps = {
  dishId: string;
  dishName: string;
};

export function DeleteDishButton({ dishId, dishName }: DeleteDishButtonProps) {
  return (
    <form
      action={deleteDishAction}
      onSubmit={(event) => {
        if (!confirm(`Delete ${dishName}? This can't be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input name="id" type="hidden" value={dishId} />
      <button className="small-button danger" type="submit">
        Delete
      </button>
    </form>
  );
}
