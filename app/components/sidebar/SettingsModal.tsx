"use client"

import { User } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import Modal from '../Modal'
import Input from '../inputs/Input'
import Image from 'next/image'
import { CldUploadButton } from 'next-cloudinary'
import Button from '../Button'

interface SettingsModalProps {
  isOpen?: boolean
  onClose: () => void
  currentUser: User
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentUser }) => {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors }} = useForm<FieldValues>({
    defaultValues: {
      name: currentUser.name,
      image: currentUser.image,
    }
  })

  const image = watch("image")

  const handleUpload = (result: any) => {
    setValue("image", result?.info?.secure_url, { shouldValidate: true })
  }

  const onSubmit: SubmitHandler<FieldValues> = data =>{
    setIsLoading(true)
    axios.post("/api/settings", data)
      .then(res => {
        router.refresh()
        onClose()
        toast.success("Profile updated successfully")
      })
      .catch(err => {
        toast.error("Something went wrong")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Modal 
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-12'>
          <div className='border-b border-gray-900/10 pb-12'>
            <h2 className='text-base font-semibold text-gray-900'>Profile</h2>
            <p className='text-sm text-gray-500 leading-6 mt-1'>Edit your public information</p>
            <div className='mt-10 flex flex-col gap-y-4'>
              <Input 
                disabled={isLoading}
                errors={errors}
                label='Name'
                required
                register={register}
                id={'name'}
                type='text'
              />
              <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700 leading-6">Photo</label>
                <div className='mt-2 flex items-center gap-x-3'>
                  <Image 
                    src={image || currentUser?.image || "/placeholder.jpg" }
                    width={"48"}
                    height={"48"}
                    alt='avatar'
                  />
                  <CldUploadButton 
                    options={{ maxFiles: 1 }}
                    onUpload={handleUpload}
                    uploadPreset='d9y0krwj'
                  >
                    <Button 
                      disabled={isLoading}
                      secondary
                      type='button'
                    >
                      Upload
                    </Button>
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-6 items-center flex justify-end gap-x-6'>
            <Button
              disabled={isLoading}
              secondary
              type='button'
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              type='submit'
            >
              Update Info
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default SettingsModal
