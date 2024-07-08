import { Link, useLocation } from "react-router-dom"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { MenuIcon, Package2Icon, LayoutDashboardIcon, BotIcon, SettingsIcon, LogOutIcon, GlobeIcon } from "lucide-react"
import { useTranslation } from 'react-i18next'

export function Header() {
  const location = useLocation()
  const { t, i18n } = useTranslation()

  const getBreadcrumbTitle = () => {
    switch (location.pathname) {
      case "/":
        return t("dashboard")
      case "/chatbot":
        return t("chatbot")
      case "/settings":
        return t("settings")
      default:
        return t("unknown")
    }
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ptBR' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="flex items-center gap-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">{t("toggleMenu")}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              to="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Package2Icon className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">{t("companyName")}</span>
            </Link>
            <Link to="/" className="flex items-center gap-4 px-2.5 text-foreground">
              <LayoutDashboardIcon className="h-5 w-5" />
              {t("dashboard")}
            </Link>
            <Link
              to="/chatbot"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <BotIcon className="h-5 w-5" />
              {t("chatbot")}
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <SettingsIcon className="h-5 w-5" />
              {t("settings")}
            </Link>
            <button
              onClick={() => {
                // Add logout logic here
                console.log("Logout clicked")
              }}
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <LogOutIcon className="h-5 w-5" />
              {t("logout")}
            </button>
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/">{t("home")}</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{getBreadcrumbTitle()}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Button onClick={toggleLanguage} variant="outline" size="icon">
        <GlobeIcon className="h-4 w-4" />
        <span className="sr-only">{t("changeLanguage")}</span>
      </Button>
    </header>
  )
}
