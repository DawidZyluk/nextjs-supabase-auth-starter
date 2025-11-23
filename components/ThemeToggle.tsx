"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select"

export function ThemeToggle() {
  const t = useTranslations("Theme")
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
        <div className="flex items-center gap-2 opacity-50">
            <Select disabled>
                <SelectTrigger className="w-auto min-w-[140px]">
                    <SelectValue placeholder={t("title")} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="placeholder">...</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
  }

  const isDark = resolvedTheme === "dark" || resolvedTheme === "yellow-dark"
  const isYellow = theme === "yellow-light" || theme === "yellow-dark"

  const currentMode = isDark ? "dark" : "light"
  const currentColor = isYellow ? "yellow" : "zinc"

  const handleValueChange = (value: string) => {
    // Mode switching
    if (value === "light") {
      setTheme(isYellow ? "yellow-light" : "light")
    } else if (value === "dark") {
      setTheme(isYellow ? "yellow-dark" : "dark")
    } else if (value === "system") {
        setTheme("system")
    }
    // Color switching
    else if (value === "zinc") {
      setTheme(isDark ? "dark" : "light")
    } else if (value === "yellow") {
      setTheme(isDark ? "yellow-dark" : "yellow-light")
    }
  }

  return (
      <Select
        value={currentMode} 
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-auto min-w-[140px]">
           <div className="flex items-center gap-2">
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span className="truncate">
                  {t(currentMode)} {isYellow && `(${t("yellow")})`}
                  {!isYellow && currentColor !== "zinc" && `(${t(currentColor)})`}
              </span>
           </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
              <SelectLabel>{t("title")}</SelectLabel>
              <SelectItem value="light">{t("light")}</SelectItem>
              <SelectItem value="dark">{t("dark")}</SelectItem>
              <SelectItem value="system">{t("system")}</SelectItem>
          </SelectGroup>
          
          <SelectSeparator />
          
          <SelectGroup>
              <SelectLabel>{t("color")}</SelectLabel>
              <SelectItem value="zinc">
                  <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-zinc-500"></div>
                      {t("zinc")}
                  </div>
              </SelectItem>
              <SelectItem value="yellow">
                  <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-[#FFB700]"></div>
                      {t("yellow")}
                  </div>
              </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
  )
}
