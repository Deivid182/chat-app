"use client"

import useConversation from '@/app/hooks/useConversation'
import axios from 'axios'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { HiPhoto } from 'react-icons/hi2'
import MessageInput from './MessageInput'
import { MdSend } from 'react-icons/md'
import { CldUploadButton } from 'next-cloudinary'

const Form = () => {

  const { conversationId } = useConversation()

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      message: ''    
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setValue('message', '', { shouldValidate: true  })
    axios.post(`/api/messages`, {
      ...data,
      conversationId
    })
  }

  const handleUpload = (result: any) => {
    axios.post(`/api/messages`, {
      image: result?.info?.secure_url,
      conversationId
    })
  }

  return (
    <div className='p-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full'>
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset='d9y0krwj'
      >
        <HiPhoto className='text-4xl text-sky-500 hover:text-sky-600 transition-colors cursor-pointer'/>
      </CldUploadButton>
      <form 
        className='flex items-center gap-2 lg:gap-4 w-full'
        onSubmit={handleSubmit(onSubmit)}>
          <MessageInput
            type='text'
            register={register}
            id='message'
            required
            errors={errors}
            placeholder='Aa'
          />
          <button
            type='submit'
            className='rounded-full flex items-center justify-center p-2 text-sky-500 hover:text-sky-600 hover:bg-neutral-100 transition-colors'
          >
            <MdSend 
              size={28}
            />
          </button>
      </form>
    </div>
  )
}

export default Form
