import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { PlusIcon, SendIcon } from "lucide-react"

export function ChatbotContent() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">Sofia Davis</p>
            <p className="text-sm text-muted-foreground">m@example.com</p>
          </div>
        </div>
        <Button size="icon" variant="outline" className="ml-auto rounded-full">
          <PlusIcon className="w-4 h-4" />
          <span className="sr-only">New message</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-primary text-primary-foreground">
            Hi, how can I help you today?
          </div>
          <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted">
            Hello, I'm having some trouble accessing my account. Can you help me?
          </div>
          <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-primary text-primary-foreground">
            Of course! Could you please provide me with your account number?
          </div>
          <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted">
            Sure, it's 123456789.
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full space-x-2">
          <Input id="message" placeholder="Type your message..." className="flex-1" autoComplete="off" />
          <Button type="submit" size="icon">
            <SendIcon className="w-4 h-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
