'use client';
import Button from '@/app/components/Button';
import Input from '@/app/components/inputs/Input';
import { useCallback, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import AuthSocialButton from './AuthSocialButton';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Variant = 'login' | 'register';

const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>('login');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const session = useSession()

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push('/users')
    }
  }, [session, router])

  const toggleVariant = useCallback(() => {
    if (variant === 'login') {
      setVariant('register');
    } else {
      setVariant('login');
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === 'register') {
      // login and axios register
      axios
        .post('/api/register', data)
        .then(() => {
          signIn("credentials", data)
        })
        .catch(function (error) {
          toast.error(error.response.data.message);

        })
        .finally(function () {
          setIsLoading(false);
        });
    }
    if (variant === 'login') {
      // nextauth
      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then((response) => {
          if (response?.ok && !response?.error) {
            toast.success('Successfully logged in');
            router.push('/users')
          }
          if (response?.error) {
            toast.error(response?.error);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    signIn(action, {
      redirect: false,
    })
      .then((response) => {
        if (response?.ok && !response?.error) {
          toast.success('Successfully logged in');
          router.push('/users')
        }
        if (response?.error) {
          toast.error(response?.error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
      <div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          {variant === 'register' && (
            <Input
              label='Name'
              id='name'
              errors={errors}
              register={register}
              type='text'
            />
          )}
          <Input
            type='email'
            errors={errors}
            register={register}
            label='Email address'
            id='email'
          />
          <Input
            type='password'
            errors={errors}
            register={register}
            label='Password'
            id='password'
          />
          <div>
            <Button disabled={isLoading} fullWidth type='submit'>
              {variant === 'login' ? 'Login' : 'Register'}
            </Button>
          </div>
        </form>
        <div className='mt-6'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-500'>
                Or continue with
              </span>
            </div>
          </div>
          <div className='mt-6 flex gap-2'>
            <AuthSocialButton
              icon={FaGithub}
              onClick={() => socialAction('github')}
            />
            <AuthSocialButton
              icon={FcGoogle}
              onClick={() => socialAction('google')}
            />
          </div>
        </div>
        <div className='text-sm flex justify-center gap-2 mt-6 px-2 text-gray-500'>
          <div>
            {variant === 'login'
              ? 'Don’t have an account?'
              : 'Already have an account?'}
          </div>
          <div
            onClick={toggleVariant}
            className='text-gray-600 hover:underline cursor-pointer'
          >
            {variant === 'login' ? 'Register' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
