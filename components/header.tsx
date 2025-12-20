import {Logo} from "@/components/logo";
import {SourceSelector} from "@/components/source-selector";
import {ThemeToggler} from "@/components/theme-toggler";

export function Header() {
  return (
    <header
      className="fixed left-0 top-0 z-50 w-full px-4 pr-2.5 animate-fade-in border-b border-border backdrop-blur-[12px] [--animation-delay:600ms]">
      <div className="flex h-[var(--navigation-height)] w-full items-center justify-between">
        <Logo />
        <div className="flex gap-3.5">
          <SourceSelector />
          <ThemeToggler />
        </div>
      </div>
    </header>
  );
}
