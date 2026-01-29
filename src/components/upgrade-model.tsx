"use client";

import {
        AlertDialog,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
        AlertDialogCancel,
        AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { authClient } from "@/lib/auth-client";

interface UpgradeModelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const UpgradeModel  = ({
    open,
     onOpenChange
    }: UpgradeModelProps) => {
        return (
            <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Upgrade Your Plan</AlertDialogTitle>
                    <AlertDialogDescription>
                        Get access to premium features by upgrading your plan.
                        </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={async () => authClient.checkout({ slug: "pro"})}
                    >
                        Upgrade Now
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        )
    };
    
