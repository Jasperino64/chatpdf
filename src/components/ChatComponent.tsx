"use client"
import React from "react"
import { Input } from "./ui/input"
import { useChat } from "ai/react"
import { Button } from "./ui/button"
import { Send } from "lucide-react"
import MessageList from "./MessageList"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

type Props = { chatId: number }

const ChatComponent = ({ chatId }: Props) => {
  console.log("🚀 ~ ChatComponent ~ chatId:", chatId)

  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post("/api/get-messages", {
        chatId,
      })
      return response.data
    },
  })
  const chatContainer = React.useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    const { offsetHeight, scrollHeight, scrollTop } =
      chatContainer.current as HTMLDivElement
    if (scrollHeight >= offsetHeight + scrollTop) {
      chatContainer.current?.scrollTo(0, scrollHeight + 200)
    }
  }

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  })
  const renderResponse = () => {
    return (
      <div className="response">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>
    )
  }
  return (
    <div className="flex flex-col h-screen">
      {/* header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* messages */}
      <div ref={chatContainer} className="flex-grow overflow-y-auto px-4">
        {renderResponse()}
      </div>

      {/* input */}
      <div className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white">
        <form onSubmit={handleSubmit} className="">
          <div className="flex">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask any question..."
              className="w-full"
            />
            <Button type="submit" className="bg-blue-600 ml-2">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatComponent
