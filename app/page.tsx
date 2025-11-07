import Image from "next/image";
import { SelectionSurface } from "@/components";

export default function Home() {
  return (
    <main className="mx-auto flex-1 overflow-hidden pt-[var(--navigation-height)]">
      <SelectionSurface />
    </main>
  );
}
