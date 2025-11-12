import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer
      className="w-full px-4 backdrop-blur-[12px] [--animation-delay:600ms]">
      <div className="flex h-[var(--navigation-height)] w-full items-center justify-between">
        <Logo className="text-sm" />
        <div className="flex gap-3.5">
          <ul className="text-xs">
            <li>About</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
