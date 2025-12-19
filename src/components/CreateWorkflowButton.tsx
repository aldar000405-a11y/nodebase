"use client";

import { useMutation } from "@tanstack/react-query";

export function CreateWorkflowButton() {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/workflows", {
        method: "POST",
      });
      return res.json();
    },
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      className="px-4 py-2 bg-black text-white"
    >
      createWorkflow
    </button>
  );
}
