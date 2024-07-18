import { Link, useLocation } from "react-router-dom";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Package2Icon, LayoutDashboardIcon, BotIcon } from "lucide-react";
import { Button } from "./ui/button";
import { ExitIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/hooks/useAuth";
import { handleLogout } from "@/utils/auth";

export function Sidebar() {
  const location = useLocation();
  const { setToken } = useAuth();
  const onLogout = () => {
    handleLogout(setToken);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center pb-4 justify-between h-full">
        <div className="flex flex-col items-center gap-4 px-2 sm:py-5">
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
                  location.pathname === "/"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
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
                  location.pathname === "/chatbot"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <BotIcon className="h-5 w-5" />
                <span className="sr-only">Chatbot</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Chatbot</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        </div>
        <Button variant="outline" size="icon" onClick={onLogout}>
          <ExitIcon className="h-4 w-4" />
        </Button>
      </nav>
    </aside>
  );
}
