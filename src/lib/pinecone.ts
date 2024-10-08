import { Index, Pinecone, RecordMetadata } from "@pinecone-database/pinecone"
import { downloadFromS3 } from "./s3-server"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"

let pinecone: Pinecone | null = null
let index: Index<RecordMetadata> | null = null
export const getPinecone = async () => {
  if (!pinecone) {
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    })
    index = await pc.index("quickstart")
  }
  return index
}

export async function loadS3IntoPinceone(fileKey: string) {
  // Get the pdf from S3
  console.log("Downloading file from S3")
  const filePath = await downloadFromS3(fileKey)
    if (!filePath) {
        throw new Error("Failed to download file from S3")
    }
    console.log("File downloaded from S3")
    // Load the pdf into Pinecone
    const pdfLoader = new PDFLoader(filePath)
    const pages = await pdfLoader.load()
    return pages
}
