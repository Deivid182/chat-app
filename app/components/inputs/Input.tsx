"use client"
import clsx from 'clsx'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

interface InputProps {
  id: string
  label: string
  type: string
  register: UseFormRegister<FieldValues>
  errors: FieldErrors
  required?: boolean
  disabled?: boolean
}

const Input: React.FC<InputProps> = ({ label, id, type, register, errors, required, disabled }) => {
  return (
    <div>
      <label 
        className='block text-sm font-medium text-gray-900 leading-6'
        htmlFor={id}
      >
        {label}
      </label>
      <div className='mt-2'>
        <input 
          type={type} 
          id={id}
          disabled={disabled}
          autoComplete={id}
          {...register(id, { required })}
          className={clsx(`
            form-input 
            block 
            w-full 
            rounded-md
            border-0
            py-2
            text-gray-900
            shadow-sm
            ring-1
            ring-inset
            ring-gray-300
            placeholder:text-gray-400
            focus:ring-2
            focus:ring-inset
            focus:ring-sky-600
            sm:text-sm
            sm:leading-6`,
            errors[id] && 'border-rose-500 focus:rose-red-500 focus:border-red-500',          
            disabled && 'opacity-50 cursor-not-allowed'
            )}
        />
      </div>
    </div>
  )
}

export default Input
