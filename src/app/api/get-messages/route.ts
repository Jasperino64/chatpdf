import { db } from "@/lib/db"
import { messages } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export const runtime = "edge"

export const POST = async (req: Request) => {
  try {
    const { chatId } = await req.json()

    if (!chatId) {
      return NextResponse.json({ error: "chatId is required" }, { status: 400 })
    }

    console.log("***** getting messages for chatId", chatId)
    const _messages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId))
    console.log("***** messages", _messages.length)
    return NextResponse.json(_messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
