import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { FinancialContent } from "./financial-content";
import { GeneralContent } from "./general-content";
import { HealthWellbeingContent } from "./health-wellbeing-content";
import { RelationshipsContent } from "./relationships-content";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export function DashboardView({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState("financial");
  const { t } = useTranslation();

  const tabs = [
    { value: "general", label: t("general") },
    { value: "financial", label: t("financial") },
    { value: "health-wellbeing", label: t("healthWellbeing") },
    { value: "relationships", label: t("relationships") },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header onLogout={onLogout} />
        <h1 className="text-2xl font-semibold pl-8">
          {t("welcomeBack")} 👋
        </h1>
        <h2 className="text-md font-medium text-muted-foreground pl-8">
          {t("progressSummary")}
        </h2>
        <main className="grid flex-1 items-start gap-8 p-4 sm:px-6 sm:py-0 md:gap-12">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center">
              <TabsList className="hidden sm:flex">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <DropdownMenu>
                <DropdownMenuTrigger className="sm:hidden flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground">
                  {tabs.find((tab) => tab.value === activeTab)?.label}
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {tabs.map((tab) => (
                    <DropdownMenuItem
                      key={tab.value}
                      onSelect={() => setActiveTab(tab.value)}
                    >
                      {tab.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-6">
              <TabsContent value="general">
                <GeneralContent />
              </TabsContent>
              <TabsContent value="financial">
                <FinancialContent />
              </TabsContent>
              <TabsContent value="health-wellbeing">
                <HealthWellbeingContent />
              </TabsContent>
              <TabsContent value="relationships">
                <RelationshipsContent />
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
