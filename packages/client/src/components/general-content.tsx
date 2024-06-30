import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { formatDate } from "@/lib/utils"

interface GeneralEntry {
  id: number
  date: string
  title: string
  content: string
}

export function GeneralContent() {
  const [entries, setEntries] = useState<GeneralEntry[]>([])

  useEffect(() => {
    async function fetchEntries() {
      try {
        const response = await fetch('/api/general')
        if (!response.ok) {
          throw new Error('Failed to fetch general entries')
        }
        const data = await response.json()
        setEntries(data)
      } catch (error) {
        console.error('Error fetching general entries:', error)
      }
    }

    fetchEntries()
  }, [])

  return (
    <div className="flex flex-col h-full w-full mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Diary</h1>
      </header>
      <div className="grid gap-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-muted-foreground">{formatDate(entry.date)}</div>
            </div>
            <h3 className="text-lg font-medium mb-1">{entry.title}</h3>
            <p className="text-muted-foreground line-clamp-2">{entry.content}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
