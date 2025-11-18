"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        data.email,
        {
          redirectTo: `${window.location.origin}/update-password`,
        }
      );

      if (resetError) {
        setError(resetError.message || "Błąd podczas resetowania hasła");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Wystąpił nieoczekiwany błąd");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Email wysłany!</CardTitle>
            <CardDescription>
              Sprawdź swoją skrzynkę pocztową
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Wysłaliśmy Ci link do resetowania hasła na podany adres email.
              Kliknij w link, aby ustawić nowe hasło.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">Powrót do logowania</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Resetowanie hasła</CardTitle>
          <CardDescription>
            Podaj swój adres email, a wyślemy Ci link do resetowania hasła
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="twoj@email.com"
                disabled={loading}
                {...register("email", {
                  required: "Email jest wymagany",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Nieprawidłowy adres email",
                  },
                })}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message as string}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Wysyłanie..." : "Wyślij link resetujący"}
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/login">Powrót do logowania</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

