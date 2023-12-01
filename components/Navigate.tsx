"use client";
import { useRouter } from 'next/navigation';

export default function Navigate({label, path}: { label: string; path: string }) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(path);
  }
  return (
    <span onClick={handleNavigate}>{label}</span>
  );
}
