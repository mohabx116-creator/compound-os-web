import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, ChevronRight, ImagePlus, SendHorizontal, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { SuccessFeedback } from '../components/ui/SuccessFeedback';
import { complaintService } from '../features/complaints/services/complaint.service';
import { ROUTES } from '../lib/constants/routes';
import { cn } from '../lib/utils/cn';

const categories = ['كهرباء', 'سباكة', 'أمن', 'نظافة', 'أخرى'] as const;
const priorities = [
  { label: 'عادية', value: 'LOW' },
  { label: 'مهمة', value: 'MEDIUM' },
  { label: 'عاجلة', value: 'HIGH' },
] as const;

const complaintSchema = z.object({
  category: z.enum(categories, { required_error: 'اختر تصنيف المشكلة' }),
  title: z.string().min(3, 'اكتب عنوانا واضحا للشكوى'),
  description: z.string().min(10, 'اكتب تفاصيل كافية عن المشكلة'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
});

type ComplaintFormValues = z.infer<typeof complaintSchema>;

export function CreateComplaintPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      category: 'كهرباء',
      title: '',
      description: '',
      priority: 'LOW',
    },
  });

  const selectedCategory = watch('category');
  const selectedPriority = watch('priority');

  const onSubmit = handleSubmit(async (values) => {
    await complaintService.createComplaint({
      title: values.title,
      description: values.description,
      category: values.category,
      priority: values.priority,
      status: 'OPEN',
    });
    setSubmitted(true);
  });

  return (
    <section className="min-h-dvh bg-background pb-28">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-outline-variant/40 bg-background/95 px-5 backdrop-blur-xl">
        <Link aria-label="الطوارئ" className="flex h-11 w-11 items-center justify-center rounded-full text-primary" to={ROUTES.EMERGENCY}>
          <TriangleAlert className="h-6 w-6" />
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-primary">إرسال شكوى</h1>
          <button aria-label="الرجوع" className="flex h-11 w-11 items-center justify-center rounded-full text-primary" type="button" onClick={() => navigate(-1)}>
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      </header>

      <form className="space-y-8 px-5 pt-8" onSubmit={onSubmit}>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-primary">كيف يمكننا مساعدتك؟</h2>
          <p className="mt-3 text-base leading-7 text-on-surface">
            يرجى ملء النموذج أدناه لإبلاغنا بأي مشكلة تواجهها في المجمع السكني.
          </p>
        </div>

        <section>
          <h3 className="mb-4 text-right text-xl font-bold text-primary">تصنيف المشكلة</h3>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className={cn(
                  'rounded-2xl border px-4 py-4 text-base font-medium transition-colors',
                  selectedCategory === category
                    ? 'border-secondary bg-secondary-container/30 text-secondary'
                    : 'border-outline-variant bg-transparent text-on-surface',
                )}
                type="button"
                onClick={() => setValue('category', category, { shouldValidate: true })}
              >
                {category}
              </button>
            ))}
          </div>
          {errors.category && <p className="mt-2 text-sm font-medium text-error">{errors.category.message}</p>}
        </section>

        <section>
          <label className="mb-3 block text-right text-xl font-bold text-primary" htmlFor="complaint-title">
            عنوان الشكوى
          </label>
          <input
            id="complaint-title"
            className="w-full rounded-2xl border-none bg-surface-container-low px-5 py-5 text-lg text-on-surface outline-none placeholder:text-outline focus:ring-4 focus:ring-secondary-container/30"
            placeholder="مثال: عطل في إنارة الممر"
            {...register('title')}
          />
          {errors.title && <p className="mt-2 text-sm font-medium text-error">{errors.title.message}</p>}
        </section>

        <section>
          <label className="mb-3 block text-right text-xl font-bold text-primary" htmlFor="complaint-description">
            تفاصيل الشكوى
          </label>
          <textarea
            id="complaint-description"
            className="min-h-44 w-full resize-none rounded-2xl border-none bg-surface-container-low px-5 py-5 text-lg text-on-surface outline-none placeholder:text-outline focus:ring-4 focus:ring-secondary-container/30"
            placeholder="يرجى وصف المشكلة والموقع بالتحديد..."
            {...register('description')}
          />
          {errors.description && <p className="mt-2 text-sm font-medium text-error">{errors.description.message}</p>}
        </section>

        <section>
          <h3 className="mb-4 text-right text-xl font-bold text-primary">المرفقات</h3>
          <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant text-on-surface-variant">
            <Camera className="h-12 w-12" />
            <span className="mt-3 text-base">إرفاق صورة</span>
            <ImagePlus className="mt-1 h-5 w-5" />
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-right text-xl font-bold text-primary">الأولوية</h3>
          <div className="grid grid-cols-3 gap-3">
            {priorities.map((priority) => (
              <button
                key={priority.value}
                className={cn(
                  'rounded-2xl border px-4 py-4 text-base font-medium transition-colors',
                  selectedPriority === priority.value
                    ? 'border-secondary bg-secondary-container/30 text-secondary'
                    : 'border-outline-variant bg-transparent text-on-surface',
                )}
                type="button"
                onClick={() => setValue('priority', priority.value, { shouldValidate: true })}
              >
                {priority.label}
              </button>
            ))}
          </div>
        </section>

        {submitted && (
          <div className="space-y-3">
            <SuccessFeedback message="تم إرسال الشكوى بنجاح" />
            <Link className="block text-center text-sm font-bold text-secondary" to={ROUTES.COMPLAINTS}>
              العودة إلى قائمة الشكاوى
            </Link>
          </div>
        )}

        <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[480px] border-t border-outline-variant/50 bg-background px-5 py-4">
          <button
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-4 text-lg font-bold text-white shadow-xl shadow-primary/15 disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            <SendHorizontal className="h-6 w-6" />
            إرسال الشكوى
          </button>
        </div>
      </form>
    </section>
  );
}
