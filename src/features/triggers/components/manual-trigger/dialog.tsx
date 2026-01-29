"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";






export const ManaulTriggerDialog = ({
    open,
    onOpenChange
}: Props) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="text-center">
                <DialogHeader className="items-center">
                    <DialogTitle>Manual Trigger</DialogTitle>
                    <DialogDescription>
                        Configure settings for manual trigger node.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-muted-foreground text-sm">
                        Used Manually execute a workflow, no configuration
                        available.
                    </p>
                </div>
            </DialogContent>

        </Dialog>
    )
}