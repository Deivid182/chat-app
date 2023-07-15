"use client"

import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

interface MessageInputProps {
  type?: string
  id: string
  required?: boolean
  register: UseFormRegister<FieldValues>
  placeholder?: string
  errors: FieldErrors
}

const MessageInput: React.FC<MessageInputProps> = ({
  type, id, required, register, placeholder, errors
}) => {



  return (
    <div className='relative w-full'>
      <input
        type={type}
        id={id}
        required={required}
        {...register(id, { required })}
        placeholder={placeholder}
        autoComplete={id}
        className='
          text-black font-light py-2 px-4 rounded-full focus:outline-none bg-neutral-100 w-full
        '
      />
    </div>
  )
}

export default MessageInput
