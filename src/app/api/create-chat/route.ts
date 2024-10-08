import { loadS3IntoPinceone } from "@/lib/pinecone"
import { NextResponse } from "next/server"

export async function POST(req: Request, res: Response) {
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
    const pages = await loadS3IntoPinceone(file_key)
    console.log("Pages", pages)
    // Pinecone API

    return NextResponse.json({ pages }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
