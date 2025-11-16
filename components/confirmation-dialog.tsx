"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { cn } from "@/lib";

export interface ConfirmationDialogProps {
  className?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  text?: string;
  title?: string;
  value?: number | null;
}

export const ConfirmationDialog = (props: ConfirmationDialogProps) => {
  const {className, isOpen, onOpenChange, text = "", title = "", value = 0} = props;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn("w-115 max-w-[99vw] max-h-[60vh] overflow-hidden", className)}>
        <DialogHeader>
          <DialogTitle>{title} Copied!</DialogTitle>
          <DialogDescription>
            {value} {title} copied to clipboard
          </DialogDescription>
        </DialogHeader>
        {text ? (
          <div className="p-4 bg-muted rounded-md max-h-[42vh] overflow-y-auto">
            <p className="text-sm whitespace-pre-wrap break-words">{text}</p>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
