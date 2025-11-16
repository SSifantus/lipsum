"use client";

import {useState} from "react";
import {AboutModal, Button, ContactForm} from "@/components";

export function Footer() {

  const [ openAboutModal, setOpenAboutModal ] = useState(false);
  const [ openContactForm, setOpenContactForm ] = useState(false);

  const handleOpenAboutModal = () => {
    setOpenAboutModal(true);
  };

  const handleOpenContactForm = () => {
    setOpenContactForm(true);
  };

  return (
    <footer
      className="w-full px-5 backdrop-blur-[12px] [--animation-delay:600ms]">
      <div className="flex h-[var(--navigation-height)] w-full items-center justify-between">
        <div className="text-xs">A better Lorem Ipsum generator</div>
        <div className="flex gap-3">
          <Button className="text-xs px-1" variant="link" onClick={handleOpenAboutModal}>About</Button>
          <Button className="text-xs px-1" variant="link" onClick={handleOpenContactForm}>Contact</Button>
          <ContactForm open={openContactForm} setOpen={setOpenContactForm} />
          <AboutModal isOpen={openAboutModal} onOpenChange={setOpenAboutModal} />
        </div>
      </div>
    </footer>
  );
}
