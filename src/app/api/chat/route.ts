import { openai } from "@ai-sdk/openai"
import { Message, streamText } from "ai"
import { getContext } from "@/lib/context"
import { db } from "@/lib/db"
import { chats, messages as _messages } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export const runtime = "edge"
export async function POST(req: Request, res: Response) {
  try {
    const { messages, chatId } = await req.json()

    const _chats = await db.select().from(chats).where(eq(chats.id, chatId))
    if (_chats.length != 1) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 })
    }
    const fileKey = _chats[0].fileKey
    const lastMessage = messages[messages.length - 1]

    const context = await getContext(lastMessage.content, fileKey)

    const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      `,
    }

    // const model = openai("gpt-4-0125-preview")
    const stream = await streamText({
      model: openai("gpt-4-0125-preview"),
      messages: [
        prompt,
        ...messages.filter((message: Message) => message.role === "user"),
      ],
      onFinish: async (completion) => {
        const text = completion.text
        // console.log("🚀 ~ onFinish: ~ completion:", lastMessage.content)
        // console.log("🚀 ~ onFinish: ~ completion:", text)
        // save  user message into db
        await db.insert(_messages).values({
          chatId,
          content: lastMessage.content,
          role: "user",
        })
        // save ai message into db

        await db.insert(_messages).values({
          chatId,
          content: text,
          role: "system",
        })
      },
    })
    return stream.toDataStreamResponse()
    // const stream = OpenAIStream(response, {
    //   onStart: async () => {
    //     // save user message into db
    //     await db.insert(_messages).values({
    //       chatId,
    //       content: lastMessage.content,
    //       role: "user",
    //     })
    //   },
    //   onCompletion: async (completion) => {
    //     // save ai message into db
    //     await db.insert(_messages).values({
    //       chatId,
    //       content: completion,
    //       role: "system",
    //     })
    //   },
    // })
    // return new StreamingTextResponse(stream)
  } catch (error) {
    console.log(error)
    throw error
  }
}
