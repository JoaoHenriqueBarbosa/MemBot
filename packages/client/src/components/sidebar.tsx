import { Link, useLocation } from "react-router-dom"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Package2Icon, LayoutDashboardIcon, BotIcon, SettingsIcon, LogOutIcon } from "lucide-react"

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Link
            to="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2Icon className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/"
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                  location.pathname === "/" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                }`}
              >
                <LayoutDashboardIcon className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/chatbot"
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                  location.pathname === "/chatbot" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                }`}
              >
                <BotIcon className="h-5 w-5" />
                <span className="sr-only">Chatbot</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Chatbot</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/settings"
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                  location.pathname === "/settings" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                }`}
              >
                <SettingsIcon className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                onClick={() => {
                  // Add logout logic here
                  console.log("Logout clicked")
                }}
              >
                <LogOutIcon className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  )
}
