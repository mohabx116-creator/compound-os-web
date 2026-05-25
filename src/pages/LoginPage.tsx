import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Headphones, LockKeyhole, LogIn, Phone, Siren, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { AppLogo } from '../components/brand/AppLogo';
import { SuccessFeedback } from '../components/ui/SuccessFeedback';
import { ApiClientError } from '../lib/api/api-client';
import { authApiService } from '../lib/api/auth-service';
import { ROUTES } from '../lib/constants/routes';
import { RESIDENT_TENANT_CONTEXT } from '../lib/session/tenant-context';
import { useSession } from '../lib/session/use-session';

const loginSchema = z.object({
  phone: z.string().trim().min(8, 'ادخل رقم جوال صحيح'),
  password: z.string().min(6, 'كلمة المرور مطلوبة'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const session = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '+201222222222',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setLoginError(null);
    setSubmitted(false);

    try {
      const result = await authApiService.residentLogin({
        compoundCode: RESIDENT_TENANT_CONTEXT.compoundCode,
        phone: values.phone,
        password: values.password,
      });

      await session.loginWithToken(result.accessToken, result.user);
    } catch (error) {
      const message = error instanceof ApiClientError && error.status === 401
        ? 'بيانات الدخول غير صحيحة. تأكد من رقم الجوال وكلمة المرور.'
        : 'تعذر تسجيل الدخول الآن. حاول مرة أخرى.';
      setLoginError(message);
      return;
    }

    setSubmitted(true);
    window.setTimeout(() => navigate(ROUTES.HOME), 450);
  });

  return (
    <section className="relative flex min-h-dvh flex-col justify-center overflow-hidden bg-background px-5 py-8">
      <div className="absolute -right-44 -top-48 h-[32rem] w-[32rem] rounded-full bg-primary-container/35 blur-3xl" />
      <div className="absolute -bottom-36 -left-40 h-96 w-96 rounded-full bg-secondary-container/35 blur-3xl" />

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center">
        <AppLogo size="md" withText />
        <div className="mb-10 mt-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary">مرحبا بك في Compound OS</h1>
          <p className="mt-3 text-base leading-7 text-on-surface-variant">
            ادخل بياناتك للوصول إلى لوحة التحكم الخاصة بك
          </p>
        </div>

        <form className="w-full rounded-[28px] border border-white/70 bg-white/90 p-7 shadow-2xl shadow-primary/10 backdrop-blur-xl" onSubmit={onSubmit}>
          <div className="mb-5 rounded-2xl border border-secondary-container bg-secondary-container/25 px-4 py-3 text-right">
            <p className="text-xs font-bold text-secondary">الكمبوند المحدد</p>
            <p className="mt-1 text-lg font-bold text-primary">{RESIDENT_TENANT_CONTEXT.displayName}</p>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-on-surface-variant">رقم الجوال</span>
              <span className="flex items-center rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3 transition focus-within:border-secondary focus-within:ring-4 focus-within:ring-secondary-container/30">
                <Phone className="h-6 w-6 text-outline" aria-hidden="true" />
                <input
                  {...register('phone')}
                  className="min-w-0 flex-1 border-none bg-transparent px-3 text-left text-lg text-on-surface outline-none ring-0 placeholder:text-outline-variant focus:ring-0"
                  dir="ltr"
                  inputMode="tel"
                  placeholder="+201 XXXX XXXX"
                />
              </span>
              {errors.phone && <span className="mt-2 block text-sm font-medium text-error">{errors.phone.message}</span>}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-on-surface-variant">كلمة المرور</span>
              <span className="flex items-center rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3 transition focus-within:border-secondary focus-within:ring-4 focus-within:ring-secondary-container/30">
                <LockKeyhole className="h-6 w-6 text-outline" aria-hidden="true" />
                <input
                  {...register('password')}
                  className="min-w-0 flex-1 border-none bg-transparent px-3 text-lg text-on-surface outline-none ring-0 placeholder:text-outline-variant focus:ring-0"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  className="text-outline transition-colors hover:text-primary"
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                </button>
              </span>
              {errors.password && <span className="mt-2 block text-sm font-medium text-error">{errors.password.message}</span>}
            </label>
          </div>

          <div className="mt-4 text-right">
            <button className="text-sm font-bold text-secondary" type="button">
              نسيت كلمة المرور؟
            </button>
          </div>

          {loginError && (
            <div className="mt-5 rounded-2xl border border-error/20 bg-error-container/40 px-4 py-3 text-right text-sm font-semibold text-error">
              {loginError}
            </div>
          )}

          {submitted && <div className="mt-5"><SuccessFeedback message="تم تسجيل الدخول بنجاح" /></div>}

          <button
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-4 text-xl font-bold text-white shadow-xl shadow-primary/20 transition-transform active:scale-[0.98] disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            <LogIn className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="mt-6 border-t border-outline-variant pt-5 text-center">
            <p className="text-base text-on-surface-variant">
              ليس لديك حساب؟ <button className="font-bold text-secondary" type="button">طلب انضمام</button>
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-bold text-secondary" to={ROUTES.SUPPORT}>
                <Headphones className="h-5 w-5" /> الدعم الفني
              </Link>
              <Link className="inline-flex items-center gap-2 rounded-full bg-error-container px-4 py-2 text-sm font-bold text-error" to={ROUTES.EMERGENCY}>
                <Siren className="h-5 w-5" /> بلاغ طارئ
              </Link>
            </div>
          </div>
        </form>

        <div className="mt-10 flex flex-col items-center gap-4 text-outline">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            <span>نظام مشفر وآمن بالكامل</span>
          </div>
          <p className="text-sm tracking-wide">© 2024 Compound OS v2.4.0</p>
        </div>
      </main>
    </section>
  );
}
