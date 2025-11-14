"use client";

import {
  ContactForm,
} from "@/components";

export function Footer() {
  return (
    <footer
      className="w-full px-5 backdrop-blur-[12px] [--animation-delay:600ms]">
      <div className="flex h-[var(--navigation-height)] w-full items-center justify-between">
        <div className="text-xs">A better Lorem Ipsum generator</div>
        <div className="flex gap-3.5">
          <div className="flex gap-4 text-xs">
            <div>About</div>
            <ContactForm />
          </div>
        </div>
      </div>
    </footer>
  );
}
