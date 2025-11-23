"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const t = useTranslations("Dashboard");
  const tCommon = useTranslations("Common");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">{tCommon("loading")}</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userData = {
    name: (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "User",
    email: user.email || "no-email",
    joinDate: new Date(user.created_at).toISOString().split("T")[0],
    emailVerified: user.email_confirmed_at !== null,
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="text-muted-foreground">
              {t("welcome", { name: userData.name })}
            </p>
          </div>
          <Button variant="outline" onClick={signOut}>
            {t("logout")}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("profile")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{t("active")}</div>
              <p className="text-xs text-muted-foreground">
                {t("accountStatus")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("email")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate">
                {userData.email}
              </div>
              <p className="text-xs text-muted-foreground">
                {userData.emailVerified ? t("verified") : t("unverified")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("joinDate")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(userData.joinDate).toLocaleDateString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("memberSince")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("session")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{t("active")}</div>
              <p className="text-xs text-muted-foreground">
                {t("loggedIn")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("userProfile")}</CardTitle>
              <CardDescription>
                {t("accountInfo")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("name")}
                </p>
                <p className="text-lg font-semibold">{userData.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("email")}
                </p>
                <p className="text-lg font-semibold">{userData.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("joinDate")}
                </p>
                <p className="text-lg font-semibold">
                  {new Date(userData.joinDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("verificationStatus")}
                </p>
                <p className="text-lg font-semibold">
                  {userData.emailVerified ? "✓ " + t("verified") : "✗ " + t("unverified")}
                </p>
              </div>
              <Button className="w-full mt-4">{t("editProfile")}</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("quickActions")}</CardTitle>
              <CardDescription>
                {t("commonFunctions")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                {t("changePassword")}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                {t("securitySettings")}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                {t("activityHistory")}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                {t("notifications")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
