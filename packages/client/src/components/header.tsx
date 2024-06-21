import { Link, useLocation } from "react-router-dom"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MenuIcon, SearchIcon, Package2Icon, LayoutDashboardIcon, BotIcon, SettingsIcon, LogOutIcon } from "lucide-react"

export function Header() {
  const location = useLocation()

  const getBreadcrumbTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard"
      case "/chatbot":
        return "Chatbot"
      case "/settings":
        return "Settings"
      default:
        return "Unknown"
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              to="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Package2Icon className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link to="/" className="flex items-center gap-4 px-2.5 text-foreground">
              <LayoutDashboardIcon className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              to="/chatbot"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <BotIcon className="h-5 w-5" />
              Chatbot
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <SettingsIcon className="h-5 w-5" />
              Settings
            </Link>
            <button
              onClick={() => {
                // Add logout logic here
                console.log("Logout clicked")
              }}
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <LogOutIcon className="h-5 w-5" />
              Logout
            </button>
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{getBreadcrumbTitle()}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex-1 md:grow-0">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
            <img
              src="/placeholder.svg"
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button
              onClick={() => {
                // Add logout logic here
                console.log("Logout clicked")
              }}
            >
              Logout
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
