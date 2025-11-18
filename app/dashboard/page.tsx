"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  // TODO: Get real user data from auth context/API
  const userData = {
    name: "Jan Kowalski",
    email: "jan.kowalski@example.com",
    joinDate: "2024-01-15",
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Witaj, {userData.name}!
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/login">Wyloguj się</Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Aktywny</div>
              <p className="text-xs text-muted-foreground">
                Status konta
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate">
                {userData.email}
              </div>
              <p className="text-xs text-muted-foreground">
                Zweryfikowany
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Data rejestracji
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(userData.joinDate).toLocaleDateString("pl-PL")}
              </div>
              <p className="text-xs text-muted-foreground">
                Członek od
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sesja
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Aktywna</div>
              <p className="text-xs text-muted-foreground">
                Zalogowany
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profil użytkownika</CardTitle>
              <CardDescription>
                Informacje o Twoim koncie
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Imię i nazwisko
                </p>
                <p className="text-lg font-semibold">{userData.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-lg font-semibold">{userData.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Data dołączenia
                </p>
                <p className="text-lg font-semibold">
                  {new Date(userData.joinDate).toLocaleDateString("pl-PL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <Button className="w-full mt-4">Edytuj profil</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Szybkie akcje</CardTitle>
              <CardDescription>
                Często używane funkcje
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Zmień hasło
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Ustawienia bezpieczeństwa
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Historia aktywności
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Powiadomienia
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

