'use client';
import { LoginFormInputs } from '@/app/types/inputTypes';
import { api } from '@/app/utils/helpers';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Sparkles,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Check,
  AlertCircleIcon,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      // Save JWT
      localStorage.setItem('token', response.data.access_token);
      console.log(response.data);
      console.log('Login response:', response.data);
      if (data) {
        setAlertMessage(`You have logged in successfully. Welcome back!`);
        setAlertModal(true);
        setIsSuccess(true);
      } else if (!data) {
        console.log('Login response:', response.data);
        setAlertMessage(`Please enter your email and password`);
        setAlertModal(true);
        setIsSuccess(false);
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setTimeout(() => {
        setAlertModal(false);
        router.push('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Login error:', error);
      setAlertMessage(`failed to login ${error}`);
      setAlertModal(true);
      setIsSuccess(false);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setTimeout(() => {
        setAlertModal(false);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: 'rgb(8, 8, 14)' }}
      >
        {/* Background glows */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-700/20 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-700/20 blur-[120px]" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-900/60 mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white">Welcome back</h2>
            <p className="text-white/40 text-sm mt-1">Sign in to Solirna AI</p>
          </div>

          {/* Card */}
          <div className="glass rounded-2xl p-7 card-glow">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Email address
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className="input-field"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    {...register('password', { required: 'Password is required' })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="input-field pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 mt-2 flex items-center justify-center gap-2 rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Demo hint */}
            <div className="mt-4 p-3 rounded-xl border border-violet-500/20 bg-violet-500/5">
              <p className="text-xs text-violet-300/70 text-center">
                💡 New here?{' '}
                <Link
                  href="/register"
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  Create a free account
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-white/30 mt-6">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>

      {/* Alert Box */}
      <div
        className={`absolute right-4 text-white z-50 md:z-0 top-3 ${alertModal ? 'block' : 'hidden'}`}
      >
        <Alert className="w-70 border border-violet-500/20 bg-violet-500/5">
          <div className="flex gap-5">
            {isSuccess ? (
              <CheckCircle color="purple" />
            ) : !isSuccess ? (
              <AlertCircleIcon color="red" />
            ) : null}
            <AlertTitle className={isSuccess ? 'text-purple-400' : 'text-red-500'}>
              {isSuccess ? 'Login successful' : 'Login failed'}
            </AlertTitle>
          </div>
          <div className="mt-3 mx-auto">
            <AlertDescription className={isSuccess ? 'text-purple-400' : 'text-red-500'}>
              {isSuccess ? alertMessage : alertMessage}
            </AlertDescription>
          </div>
        </Alert>
      </div>
    </>
  );
}
