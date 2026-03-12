import { TRPCClientError } from "@trpc/client";
import { useState } from "react";
import { UpgradeModel } from "@/components/upgrade-model";

export const useUpgradeModel = () => {
  const [open, setOpen] = useState(false);

  const handleError = (error: unknown) => {
    if (error instanceof TRPCClientError) {
      const code = error.data?.code ?? error.shape?.data?.code;
      if (code === "FORBIDDEN") {
        setOpen(true);
        return true;
      }
    }
    return false;
  };
  const model = <UpgradeModel open={open} onOpenChange={setOpen} />;
  return { handleError, model };
};
