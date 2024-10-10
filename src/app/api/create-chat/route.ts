import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema"
import { loadS3IntoPinecone } from "@/lib/pinecone"
import { getS3Url } from "@/lib/s3"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request, res: Response) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    )
  }
  try {
    const body = await req.json()
    const { file_key, file_name } = body
    if (!file_key || !file_name) {
      return NextResponse.json(
        { error: "File key and name are required" },
        { status: 400 }
      )
    }

    // Vectorize PDF
    await loadS3IntoPinecone(file_key)
    // console.log("Pages", pages)
    console.log(file_key, file_name)

    // Create chat
    const chat_id = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: getS3Url(file_key),
        userId,
      })
      .returning({ insertedId: chats.id })

    return NextResponse.json(
      { chat_id: chat_id[0].insertedId },
      { status: 200 }
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
