import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold">Hello World</h1>
        <p className="text-xl text-muted-foreground">
          Aplikacja autoryzacji
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/login">Logowanie</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/register">Rejestracja</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
