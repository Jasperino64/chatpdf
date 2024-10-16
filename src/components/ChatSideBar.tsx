"use client"
import { DrizzleChat } from "@/lib/db/schema"
import Link from "next/link"
import React from "react"
import { Button } from "./ui/button"
import { MessageCircle, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import axios from "axios"
import SubscriptionButton from "./SubscriptionButton"
import { SignOutButton } from "@clerk/nextjs"

type Props = {
  chats: DrizzleChat[]
  chatId: number
  isPro: boolean
}

const ChatSideBar = ({ chats, chatId, isPro }: Props) => {
  const [loading, setLoading] = React.useState(false)
  const handleSubscription = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/stripe")
      window.location.href = response.data.url
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="w-full h-screen overflow-scroll soff p-4 text-gray-200 bg-gray-900">
      <Link href="/">
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>

      <div className="flex h-screen overflow-scroll pb-20 flex-col gap-2 mt-4">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chats/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                "bg-blue-600 text-white": chat.id === chatId,
                "hover:text-white": chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
            <Link href="/">
              <Button className="bg-blue-700" variant="default">
                Home
              </Button>
            </Link>
          </div>
          {isPro && (
            <div className="mt-2">
              <SubscriptionButton isPro={isPro} />
            </div>
          )}
          <SignOutButton>
            <div className="mt-2">
              <Button variant="destructive">Sign out</Button>
            </div>
          </SignOutButton>
          {/* <Button
            onClick={handleSubscription}
            className="mt-2 text-white bg-slate-600"
            disabled={loading}
          >
            Upgrade
          </Button> */}
        </div>
      </div>
    </div>
  )
}

export default ChatSideBar
