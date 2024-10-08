"use client"
import { useToast } from "@/components/hooks/use-toast"
import { uploadToS3 } from "@/lib/s3"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { Inbox, Loader2 } from "lucide-react"
import React from "react"
import { useDropzone } from "react-dropzone"

type Props = {}

const FileUpload = (props: Props) => {
  const { toast } = useToast()
  const [uploading, setUploading] = React.useState(false)
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string
      file_name: string
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      })
      return response.data
    },
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles)
      const file = acceptedFiles[0]
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "File size must be less than 10MB",
        })
        return
      }
      if (file.type !== "application/pdf") {
        toast({
          variant: "destructive",
          title: "File type must be PDF",
        })
        return
      }

      try {
        setUploading(true)
        const data = await uploadToS3(file)
        if (!data?.file_key || !data?.file_name) {
          toast({
            variant: "destructive",
            title: "Failed to upload file",
          })
          return
        }
        toast({
          title: data.file_key + data.file_name + " File uploaded successfully",
        })
        mutate(data, {
          onSuccess: (data) => {
            toast({
              title: "Success",
              description: "Chat created successfully",
            })
          },
          onError: (err) => {
            toast({
              variant: "destructive",
              title: "Failed to create chat",
            })
          },
        })
      } catch (error) {
        alert("Failed to upload file")
        return
      } finally {
        setUploading(false)
      }
    },
  })
  return (
    <div className="p2 bg-white rounded-xl">
      <div
        {...getRootProps()}
        className="border-dashed border-2 rounded-xl cursor-pointer bg-gray-50
          py-8 flex justify-center items-center flex-col"
      >
        <input {...getInputProps()} />
        {uploading || isLoading ? (
          <>
            {/*loading */}
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">Uploading...</p>
          </>
        ) : (
          <>
            <Inbox className="w-10  h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">
              Drag and drop a PDF here, or click to select a file
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default FileUpload
