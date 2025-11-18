"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
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

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  useEffect(() => {
    const initializeSession = async () => {
      // First, check if we already have a valid session
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      
      if (existingSession) {
        setSessionReady(true);
        return;
      }

      // Check if we have hash parameters in the URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const type = hashParams.get("type");

      // If no hash, check if session exists (might have been set by AuthProvider)
      if (!accessToken) {
        // Wait a bit for AuthProvider to process
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
              setSessionReady(true);
            } else {
              setError("Nieprawidłowy lub brakujący link resetujący. Proszę spróbować ponownie.");
            }
          });
        }, 100);
        return;
      }

      // Verify it's a recovery type
      if (type !== "recovery") {
        setError("Nieprawidłowy typ linku. To nie jest link resetujący hasło.");
        return;
      }

      // Set session from hash tokens
      try {
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        });

        if (sessionError) {
          setError(sessionError.message || "Błąd podczas weryfikacji linku resetującego.");
          return;
        }

        if (data.session) {
          setSessionReady(true);
          // Clear the hash from URL
          window.history.replaceState(null, "", window.location.pathname);
        }
      } catch (err: any) {
        setError(err.message || "Wystąpił nieoczekiwany błąd");
      }
    };

    initializeSession();

    // Also listen for auth state changes as backup
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY")) {
        setSessionReady(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const onSubmit = async (data: any) => {
    if (!sessionReady) {
      setError("Proszę poczekać na weryfikację linku...");
      return;
    }

    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (updateError) {
        setError(updateError.message || "Błąd podczas aktualizacji hasła");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
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
            <CardTitle>Hasło zaktualizowane!</CardTitle>
            <CardDescription>
              Twoje hasło zostało pomyślnie zmienione
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Przekierowujemy Cię do strony logowania...
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/login">Przejdź do logowania</Link>
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
          <CardTitle>Ustaw nowe hasło</CardTitle>
          <CardDescription>
            Wprowadź nowe hasło dla swojego konta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {!sessionReady && !error && (
              <div className="p-3 text-sm text-muted-foreground bg-muted/50 rounded-md border">
                Weryfikowanie linku resetującego...
              </div>
            )}
            
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Nowe hasło</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Hasło"
                  disabled={loading}
                  {...register("password", {
                    required: "Hasło jest wymagane",
                    minLength: {
                      value: 6,
                      message: "Hasło musi mieć co najmniej 6 znaków",
                    },
                  })}
                  aria-invalid={errors.password ? "true" : "false"}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                  </span>
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={loading}
                  {...register("confirmPassword", {
                    required: "Potwierdzenie hasła jest wymagane",
                    validate: (value) =>
                      value === password || "Hasła nie są identyczne",
                  })}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword ? "Ukryj hasło" : "Pokaż hasło"}
                  </span>
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message as string}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading || !sessionReady}>
              {loading ? "Zapisywanie..." : sessionReady ? "Zaktualizuj hasło" : "Weryfikowanie..."}
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

