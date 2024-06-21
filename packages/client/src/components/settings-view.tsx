import { Sidebar } from "./sidebar"
import { Header } from "./header"

export function SettingsView() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-8 p-4 sm:px-6 sm:py-0 md:gap-12">
          <h1>Settings</h1>
          {/* Add settings content here */}
        </main>
      </div>
    </div>
  )
}
