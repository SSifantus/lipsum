"use client";

import { Button, ContactForm, } from "@/components";
import { useState } from "react";

export function Footer(){

  const [openContactForm, setOpenContactForm] = useState(false);

  return (
    <footer
      className="w-full px-5 backdrop-blur-[12px] [--animation-delay:600ms]">
      <div className="flex h-[var(--navigation-height)] w-full items-center justify-between">
        <div className="text-xs">A better Lorem Ipsum generator</div>
        <div className="flex gap-3">
          <Button className="text-xs px-1" variant="link">About</Button>
          <Button className="text-xs px-1" variant="link" onClick={() => setOpenContactForm(true)}>Contact Us</Button>
          <ContactForm open={openContactForm} setOpen={setOpenContactForm}/>
        </div>
      </div>
    </footer>
  );
}
