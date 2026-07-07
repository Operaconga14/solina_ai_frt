'use client';
import { RegisterForm } from '@/app/types/interfaces';
import { api,passwordStrenght, strengthColor, strengthLabel } from '@/app/utils/helpers';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertCircleIcon,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// passwordStrenght

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pwdValue, setPwdValue] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertModal, setAlertModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch('password', '');

  useEffect(() => {
    setPwdValue(password);
  }, [password]);

  // useEffect(() => {
  //   if (!authLoading && user) {
  //     router.push('/dashboard');
  //   }
  // }, [user, authLoading, router]);

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try{
      // console.log('Login data:', data);
    const response = await api.post("/auth/register", {
      full_name: data.fullName,
      email: data.email,
      password: data.password,
    });
      console.log(response.data);
      setAlertMessage("Registration successful! Please login.");
      setAlertModal(true);
      setIsSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setTimeout(() => {
        setAlertModal(false);
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Registration error:', error);
      setAlertMessage(
      error?.response?.data?.detail || "Registration failed"
      );
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

  const strength = passwordStrenght(pwdValue);

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: 'rgb(8, 8, 14)' }}
      >
        {/* Background glows */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-700/20 blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-700/20 blur-[120px]" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-900/60 mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white">Join Solirna AI</h2>
            <p className="text-white/40 text-sm mt-1">Build your startup with AI</p>
          </div>

          {/* Perks */}
          <div className="flex flex-col gap-2 mb-6">
            {[
              'AI Co-Founder available 24/7',
              'PRD & Pitch Deck generation',
              'Persistent startup memory',
            ].map((perk) => (
              <div key={perk} className="flex items-center gap-2 text-sm text-white/50">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                {perk}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="glass rounded-2xl p-7 card-glow">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Full Name</label>
                <input
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  })}
                  type="text"
                  placeholder="Alex Johnson"
                  className="input-field"
                  autoComplete="name"
                />
                {errors.fullName && (
                  <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>
                )}
              </div>

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
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    className="input-field pr-10"
                    autoComplete="new-password"
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
                {/* Strength */}
                {pwdValue.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            i < strength ? strengthColor[strength - 1] : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-white/40">
                      Strength:{' '}
                      <span className="font-medium text-white/60">
                        {strengthLabel[strength - 1] ?? 'Too short'}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Confirm Password
                </label>
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === password || 'Passwords do not match',
                  })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-white/30 mt-6">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Sign in
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
              <CheckCircle color="green" />
            ) : !isSuccess ? (
              <AlertCircleIcon color="red" />
            ) : null}
            <AlertTitle className={isSuccess ? 'text-green-500' : 'text-red-500'}>
              {isSuccess ? 'Registration successful' : 'Registration failed'}
            </AlertTitle>
          </div>
          <div className="mt-3 mx-auto">
            <AlertDescription className={isSuccess ? 'text-green-500' : 'text-red-500'}>
              {isSuccess ? alertMessage : alertMessage}
            </AlertDescription>
          </div>
        </Alert>
      </div>
    </>
  );
}
