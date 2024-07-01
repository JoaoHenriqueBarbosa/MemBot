import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { FinancialContent } from "./financial-content";
import { GeneralContent } from "./general-content";
import { HealthWellbeingContent } from "./health-wellbeing-content";
import { WorkProjectsContent } from "./work-projects-content";

export function DashboardView() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-8 p-4 sm:px-6 sm:py-0 md:gap-12">
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="health-wellbeing">Health & Wellbeing</TabsTrigger>
              <TabsTrigger value="work-projects">Work/Projects</TabsTrigger>
            </TabsList>
            <div className="mt-8">
              <TabsContent value="general">
                <GeneralContent />
              </TabsContent>
              <TabsContent value="financial">
                <FinancialContent />
              </TabsContent>
              <TabsContent value="health-wellbeing">
                <HealthWellbeingContent />
              </TabsContent>
              <TabsContent value="work-projects">
                <WorkProjectsContent />
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
