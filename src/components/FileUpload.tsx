'use client'
import { uploadeFileToS3 } from '@/lib/s3'
import { Inbox } from 'lucide-react'
import React from 'react'
import { useDropzone } from 'react-dropzone'

type Props = {}

const FileUpload = (props: Props) => {
  const {getRootProps, getInputProps} = useDropzone({
    accept: {'application/pdf':  [".pdf"]},
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles)
      const file = acceptedFiles[0]
      if (file.size > 10*1024*1024) {
        alert('File size must be less than 10MB')
        return
      }
      if (file.type !== 'application/pdf') {
        alert('File type must be PDF')
        return
      }

      try {
        const data = await uploadeFileToS3(file)
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    }
  })
  return (
    <div className='p2 bg-white rounded-xl'>
      <div {...getRootProps()}
        className='border-dashed border-2 rounded-xl cursor-pointer bg-gray-50
          py-8 flex justify-center items-center flex-col'>
        <input {...getInputProps()} />
        <>
        <Inbox className='w-10  h-10 text-blue-500' />
        <p className='mt-2 text-sm text-slate-500'>Drag and drop a PDF here, or click to select a file</p>
        </>
      </div>
    </div>
  )
}

export default FileUpload