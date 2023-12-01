"use client";

import { useRouter } from 'next/navigation';

export default function NavigateButton({classes = "", label, path}: { classes?: string; label: string; path: string }) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(path);
  }
  return (
    <button className={classes} onClick={handleNavigate}>{label}</button>
  );
}
