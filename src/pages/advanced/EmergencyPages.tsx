import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AlertTriangle, Ambulance, CircleAlert, Clock3, Flame, Phone, ShieldCheck, Zap } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { CoreTopBar } from '../../components/layout/CoreTopBar';
import { DetailCard } from '../../components/ui/DetailCard';
import { StatusChip } from '../../components/ui/StatusChip';
import { Timeline } from '../../components/ui/Timeline';
import { emergencyService } from '../../features/emergency/services/emergency.service';
import { cn } from '../../lib/utils/cn';
import { fieldClass, heroImages, PageFrame, SectionTitle } from './shared';

const emergencySchema = z.object({
  type: z.string().min(1, 'اختر نوع الطوارئ'),
  location: z.string().min(3, 'اكتب الموقع بالتفصيل'),
  details: z.string().min(10, 'اكتب وصفا أوضح للحالة'),
});

type EmergencyForm = z.infer<typeof emergencySchema>;

export function EmergencyPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('FIRE');
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<EmergencyForm>({
    resolver: zodResolver(emergencySchema),
    defaultValues: { type: 'FIRE', location: 'فيلا 24 - الياسمين', details: '' },
  });
  const mutation = useMutation({
    mutationFn: (values: EmergencyForm) => emergencyService.createEmergencyReport(values.type, values.location, values.details),
    onSuccess: (report) => navigate(`/emergency/status/${report.id}`),
  });
  const types = [
    { id: 'FIRE', label: 'حريق', icon: Flame },
    { id: 'AMBULANCE', label: 'إسعاف', icon: Ambulance },
    { id: 'ELEVATOR', label: 'مصعد', icon: AlertTriangle },
    { id: 'SECURITY', label: 'أمن', icon: ShieldCheck },
    { id: 'UTILITIES', label: 'كهرباء ومياه', icon: Zap },
    { id: 'OTHER', label: 'أخرى', icon: CircleAlert },
  ];

  return (
    <PageFrame>
      <CoreTopBar title="حالة طوارئ" back className="bg-error text-white" />
      <main className="space-y-5 px-5 pt-6">
        <div className="rounded-[24px] border border-error/30 bg-error-container p-5 text-right text-error">
          <h1 className="text-2xl font-bold">تنبيه طوارئ</h1>
          <p className="mt-2 leading-7">استخدم هذه الصفحة فقط للحالات العاجلة داخل المجتمع السكني.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <SectionTitle title="نوع الطوارئ" icon={AlertTriangle} />
          <div className="grid grid-cols-2 gap-3">
            {types.map((item) => (
              <button
                key={item.id}
                className={cn('rounded-[22px] border bg-white p-4 text-center shadow-sm', selectedType === item.id ? 'border-error text-error ring-2 ring-error/20' : 'border-outline-variant text-primary')}
                type="button"
                onClick={() => {
                  setSelectedType(item.id);
                  setValue('type', item.id, { shouldValidate: true });
                }}
              >
                <item.icon className="mx-auto h-8 w-8" />
                <span className="mt-2 block font-bold">{item.label}</span>
              </button>
            ))}
          </div>
          {errors.type && <p className="text-right text-sm text-error">{errors.type.message}</p>}
          <DetailCard className="space-y-4">
            <label className="block text-right">
              <span className="mb-2 block font-bold text-primary">الموقع</span>
              <input className={fieldClass} {...register('location')} />
              {errors.location && <span className="mt-1 block text-sm text-error">{errors.location.message}</span>}
            </label>
            <label className="block text-right">
              <span className="mb-2 block font-bold text-primary">تفاصيل الحالة</span>
              <textarea className={cn(fieldClass, 'min-h-28 resize-none')} placeholder="اشرح ما يحدث الآن..." {...register('details')} />
              {errors.details && <span className="mt-1 block text-sm text-error">{errors.details.message}</span>}
            </label>
          </DetailCard>
          <button className="w-full rounded-2xl bg-error px-5 py-4 text-lg font-bold text-white shadow-lg shadow-error/20" type="button">
            <span className="inline-flex items-center gap-2">
              اتصل بالأمن الآن
              <Phone className="h-5 w-5" />
            </span>
          </button>
          <button className="w-full rounded-2xl bg-primary px-5 py-4 text-lg font-bold text-white" disabled={mutation.isPending} type="submit">
            إرسال تنبيه صامت
          </button>
        </form>
      </main>
    </PageFrame>
  );
}

export function EmergencyStatusPage() {
  const { id } = useParams();
  const { data: report } = useQuery({
    queryKey: ['emergency', id],
    queryFn: () => emergencyService.getEmergencyReportById(id ?? 'sos-001'),
  });

  return (
    <PageFrame>
      <CoreTopBar title="متابعة حالة الطوارئ" back />
      <main className="space-y-5 px-5 pt-6">
        <DetailCard className="border-error/30">
          <div className="flex items-center justify-between">
            <StatusChip label="حالة طوارئ: حريق" tone="danger" icon={Flame} />
            <p className="text-sm text-on-surface-variant">بلاغ رقم {report?.id ?? id ?? 'sos-001'}</p>
          </div>
          <div className="mt-4 space-y-2 text-right">
            <h1 className="text-2xl font-bold text-primary">فريق الأمن في الطريق</h1>
            <p className="text-on-surface-variant">{report?.location ?? 'فيلا 24 - الياسمين'}</p>
            <p className="text-on-surface-variant">تم إرسال البلاغ إلى غرفة العمليات وفريق التدخل.</p>
          </div>
        </DetailCard>
        <DetailCard>
          <SectionTitle title="خط سير الاستجابة" icon={Clock3} />
          <div className="mt-4">
            <Timeline
              items={[
                { title: 'تم استلام البلاغ', description: 'تم تسجيل تنبيه الطوارئ في النظام.', time: 'الآن', done: true, danger: true },
                { title: 'تم توجيه الفريق', description: 'فريق الأمن الأقرب تحرك إلى الموقع.', time: 'بعد دقيقة', done: true },
                { title: 'الوصول والمعاينة', description: 'سيتم تحديث الحالة بعد وصول الفريق.', time: 'قريبا' },
              ]}
            />
          </div>
        </DetailCard>
        <div className="relative overflow-hidden rounded-[28px]">
          <img alt="" className="h-48 w-full object-cover" src={heroImages.compound} />
          <div className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-2 font-bold text-primary shadow-md">تم تحديد موقعك</div>
        </div>
        <button className="w-full rounded-2xl bg-primary px-5 py-4 text-lg font-bold text-white" type="button">الاتصال بالأمن مباشرة</button>
        <button className="w-full rounded-2xl border border-error px-5 py-4 text-lg font-bold text-error" type="button">إلغاء البلاغ التجريبي</button>
      </main>
    </PageFrame>
  );
}
