import FileUpload from "@/components/FileUpload"
import { Button } from "@/components/ui/button"
import { UserButton, auth } from "@clerk/nextjs"
import { LogIn } from "lucide-react"
import Link from "next/link"
import Jimmy from "@/app/jimmy/page"
import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
export default async function Home() {
  const { userId } = await auth()
  let firstchat
  if (userId) {
    let userchats = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
    if (userchats.length > 0) {
      firstchat = userchats[0]
    }
  }

  const isAuth = !!userId
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-sky-400 via-rose-200 to-sky-400">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with any PDF</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="flex mt-2">
            {isAuth && firstchat && (
              <Link href={`/chat/${firstchat.id}`}>
                <Button>Go to Chats</Button>
              </Link>
            )}
          </div>
          <p className="max-w-xl mt-1 text-lg">Join the AI revolution</p>

          <div className="w-full mt-4">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button>
                  Log in to get started!
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
