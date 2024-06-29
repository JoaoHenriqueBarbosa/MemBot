import { Card } from "@/components/ui/card"

export function GeneralContent() {
  return (
    <div className="flex flex-col h-full w-full mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Diary</h1>
      </header>
      <div className="grid gap-4">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-muted-foreground">June 15, 2024</div>
          </div>
          <h3 className="text-lg font-medium mb-1">Reflecting on a Transformative Year</h3>
          <p className="text-muted-foreground line-clamp-2">
            As I sit here, pen in hand, I can't help but reflect on the incredible journey of the past year. It's been a
            time of profound growth, both personally and professionally...
          </p>
        </Card>
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-muted-foreground">May 28, 2024</div>
          </div>
          <h3 className="text-lg font-medium mb-1">Embracing the Unexpected</h3>
          <p className="text-muted-foreground line-clamp-2">
            Life has a way of throwing curveballs, and this past month has been a testament to that. Just when I thought
            I had everything figured out, the universe had other plans...
          </p>
        </Card>
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-muted-foreground">April 3, 2024</div>
          </div>
          <h3 className="text-lg font-medium mb-1">A New Chapter Begins</h3>
          <p className="text-muted-foreground line-clamp-2">
            Today marks the start of a new chapter in my life. After months of careful planning and consideration, I've
            decided to embark on a new adventure...
          </p>
        </Card>
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-muted-foreground">March 12, 2024</div>
          </div>
          <h3 className="text-lg font-medium mb-1">Lessons from a Challenging Week</h3>
          <p className="text-muted-foreground line-clamp-2">
            This week has been a rollercoaster of emotions, filled with both triumphs and setbacks. As I reflect on the
            events that have unfolded, I can't help but feel a sense of...
          </p>
        </Card>
      </div>
    </div>
  )
}
