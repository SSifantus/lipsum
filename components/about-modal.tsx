"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "@/components/ui/dialog";

export interface AboutModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AboutModal = (props: AboutModalProps) => {
  const {isOpen, onOpenChange} = props;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-115 max-w-[99vw] max-h-[60vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>About Lipsum Fast</DialogTitle>
          <DialogDescription className="flex flex-col gap-2 text-primary">
            <span>Lipsum Fast is a free Lorem Ipsum generator that helps you create placeholder text for your projects with
              a minimal amount of effort.</span>
            <span>It is designed to be easy to use and provides a variety of options to customize the text to suit your
              needs. The design is inspired by and based on <a href="https://lipsum.pro" target="_blank"
                                                               rel="noopener noreferrer">Lipsum Pro</a>.</span>

          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
