import Link from "next/link";
import { Container } from "@/components/layout/Container";

export function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <Container>
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Handoff
          </Link>
          <span className="text-sm text-neutral-500">Design-to-Code Assistant</span>
        </div>
      </Container>
    </header>
  );
}
