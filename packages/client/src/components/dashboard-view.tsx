import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { DashboardContent } from "./DashboardContent"
import { ChatbotContent } from "./ChatbotContent"

export function DashboardView() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-8 p-4 sm:px-6 sm:py-0 md:gap-12">
          <Tabs defaultValue="dashboard">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="flex flex-col gap-8">
              <DashboardContent />
            </TabsContent>
            <TabsContent value="chatbot">
              <ChatbotContent />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

