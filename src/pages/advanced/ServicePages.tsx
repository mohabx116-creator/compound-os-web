import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Building2, CalendarDays, Car, CheckCircle2, ChevronDown, ChevronUp, CircleAlert, Clock3, Download, Dumbbell, Eye, FileText, Hammer, History, KeyRound, Moon, Phone, QrCode, Send, Share2, ShieldCheck, Snowflake, Waves, Wrench, Zap } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CoreTopBar } from '../../components/layout/CoreTopBar';
import { DetailCard } from '../../components/ui/DetailCard';
import { StatusChip } from '../../components/ui/StatusChip';
import { SuccessFeedback } from '../../components/ui/SuccessFeedback';
import { documentService } from '../../features/services/services/document.service';
import { facilityService } from '../../features/services/services/facility.service';
import { maintenanceService } from '../../features/services/services/maintenance.service';
import { visitorService } from '../../features/services/services/visitor.service';
import { cn } from '../../lib/utils/cn';
import { fieldClass, heroImages, IconBubble, PageFrame, SectionTitle } from './shared';

const visitorSchema = z.object({
  name: z.string().min(3, 'اكتب اسم الزائر كاملا'),
  visitDate: z.string().min(1, 'اختر تاريخ الزيارة'),
  visitTime: z.string().min(1, 'اختر وقت الزيارة'),
  visitorType: z.enum(['FAMILY', 'FRIEND', 'DELIVERY', 'WORKER']),
});

type VisitorForm = z.infer<typeof visitorSchema>;

export function VisitorAccessPage() {
  const queryClient = useQueryClient();
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const { data: visitors = [] } = useQuery({ queryKey: ['visitors'], queryFn: visitorService.getVisitors });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<VisitorForm>({
    resolver: zodResolver(visitorSchema),
    defaultValues: { visitorType: 'FAMILY', visitDate: '2026-05-23', visitTime: '20:30' },
  });
  const mutation = useMutation({
    mutationFn: (values: VisitorForm) => visitorService.createVisitor({
      name: values.name,
      visitDate: values.visitDate,
      visitTime: values.visitTime,
      visitorType: values.visitorType,
    }),
    onSuccess: (visitor) => {
      setCreatedCode(visitor.qrCode.slice(-6));
      reset({ visitorType: 'FAMILY', visitDate: '2026-05-23', visitTime: '20:30', name: '' });
      queryClient.invalidateQueries({ queryKey: ['visitors'] });
    },
  });

  return (
    <PageFrame>
      <CoreTopBar brand />
      <main className="space-y-6 px-5 pt-7">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-primary">تصاريح الزوار</h1>
          <p className="mt-1 text-on-surface-variant">قم بإنشاء تصاريح دخول آمنة لضيوفك</p>
        </div>
        <DetailCard>
          <SectionTitle title="إضافة زائر جديد" icon={KeyRound} />
          <form className="mt-5 space-y-4" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
            <label className="block text-right">
              <span className="mb-2 block text-sm text-on-surface-variant">اسم الزائر</span>
              <input className={fieldClass} placeholder="أدخل الاسم الكامل" {...register('name')} />
              {errors.name && <span className="mt-1 block text-sm text-error">{errors.name.message}</span>}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-right">
                <span className="mb-2 block text-sm text-on-surface-variant">التاريخ</span>
                <input className={fieldClass} type="date" {...register('visitDate')} />
              </label>
              <label className="block text-right">
                <span className="mb-2 block text-sm text-on-surface-variant">الغرض</span>
                <select className={fieldClass} {...register('visitorType')}>
                  <option value="FAMILY">زيارة عائلية</option>
                  <option value="FRIEND">صديق</option>
                  <option value="DELIVERY">توصيل</option>
                  <option value="WORKER">عامل</option>
                </select>
              </label>
            </div>
            <label className="block text-right">
              <span className="mb-2 block text-sm text-on-surface-variant">وقت الوصول</span>
              <input className={fieldClass} type="time" {...register('visitTime')} />
            </label>
            {createdCode && <SuccessFeedback message={`تم إصدار التصريح بنجاح. رمز الدخول: ${createdCode}`} />}
            <button className="w-full rounded-2xl bg-primary px-5 py-4 text-lg font-bold text-white" disabled={mutation.isPending} type="submit">
              <span className="inline-flex items-center gap-2">
                إصدار الرمز الآمن
                <QrCode className="h-5 w-5" />
              </span>
            </button>
          </form>
        </DetailCard>
        {visitors[0] && (
          <div className="rounded-[30px] bg-primary p-5 text-white shadow-xl shadow-primary/15">
            <div className="flex items-start justify-between">
              <button className="rounded-full bg-primary-container p-3" type="button"><Share2 className="h-5 w-5" /></button>
              <div className="text-right">
                <StatusChip label="تصريح نشط" tone="success" />
                <h2 className="mt-3 text-xl font-bold">{visitors[0].name}</h2>
                <p className="text-primary-fixed-dim">اليوم، الساعة {visitors[0].visitTime}</p>
              </div>
            </div>
            <div className="mt-5 rounded-[24px] bg-white p-7 text-center text-primary">
              <ShieldCheck className="mx-auto h-14 w-14" />
              <p className="mt-5 text-4xl font-bold tracking-[0.25em]">{createdCode ?? '104 - 829'}</p>
              <p className="mt-2 text-sm text-on-surface-variant">صلاحية الرمز: 12 ساعة</p>
            </div>
          </div>
        )}
        <SectionTitle title="سجل الزيارات" icon={History} />
        <div className="space-y-3">
          {visitors.slice(0, 3).map((visitor) => (
            <DetailCard key={visitor.id} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <StatusChip label={visitor.status === 'ACTIVE' ? 'مكتمل' : 'منتهي'} tone={visitor.status === 'ACTIVE' ? 'success' : 'neutral'} />
                <div className="flex-1 text-right">
                  <h3 className="font-bold text-primary">{visitor.name}</h3>
                  <p className="text-sm text-on-surface-variant">{visitor.visitDate}، {visitor.visitTime}</p>
                </div>
                <IconBubble icon={History} className="bg-surface-container-low text-primary" />
              </div>
            </DetailCard>
          ))}
        </div>
      </main>
    </PageFrame>
  );
}

const bookingSchema = z.object({
  facilityId: z.string().min(1),
  bookingDate: z.string().min(1, 'اختر التاريخ'),
  bookingTime: z.string().min(1, 'اختر الوقت'),
});

type BookingForm = z.infer<typeof bookingSchema>;

export function FacilityBookingPage() {
  const queryClient = useQueryClient();
  const [selectedFacilityId, setSelectedFacilityId] = useState('fac-601');
  const [success, setSuccess] = useState(false);
  const { data: facilities = [] } = useQuery({ queryKey: ['facilities'], queryFn: facilityService.getFacilities });
  const { data: bookings = [] } = useQuery({ queryKey: ['facility-bookings'], queryFn: facilityService.getBookings });
  const { register, handleSubmit, setValue } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { facilityId: 'fac-601', bookingDate: '2026-05-24', bookingTime: '08:00' },
  });
  const mutation = useMutation({
    mutationFn: (values: BookingForm) => {
      const facility = facilities.find((item) => item.id === values.facilityId) ?? facilities[0];
      return facilityService.createBooking({
        facilityId: facility?.id ?? 'fac-601',
        facilityName: facility?.name ?? 'النادي الرياضي',
        bookingDate: values.bookingDate,
        bookingTime: values.bookingTime,
        durationHours: 1,
      });
    },
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['facility-bookings'] });
    },
  });

  return (
    <PageFrame>
      <CoreTopBar brand />
      <main className="space-y-6 px-5 pt-7">
        <div className="text-right">
          <h1 className="text-3xl font-bold text-primary">حجز المرافق</h1>
          <p className="mt-1 text-on-surface-variant">استمتع بأرقى الخدمات والمرافق داخل المجتمع السكني</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {(facilities.length ? facilities : [
            { id: 'fac-601', name: 'النادي الرياضي', imageUrl: heroImages.gym },
            { id: 'fac-602', name: 'كلوب هاوس', imageUrl: heroImages.lounge },
            { id: 'fac-603', name: 'الملاعب', imageUrl: heroImages.court },
            { id: 'fac-604', name: 'المسبح', imageUrl: heroImages.pool },
          ]).slice(0, 4).map((facility, index) => (
            <button
              key={facility.id}
              className={cn('relative h-40 overflow-hidden rounded-[24px] text-right text-white shadow-md', selectedFacilityId === facility.id && 'ring-2 ring-secondary ring-offset-2')}
              type="button"
              onClick={() => {
                setSelectedFacilityId(facility.id);
                setValue('facilityId', facility.id);
              }}
            >
              <img alt="" className="h-full w-full object-cover" src={facility.imageUrl || Object.values(heroImages)[index + 3]} />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
              <Dumbbell className="absolute bottom-10 right-4 h-8 w-8 text-secondary-fixed" />
              <span className="absolute bottom-4 right-4 text-lg font-bold">{facility.name}</span>
            </button>
          ))}
        </div>
        <DetailCard>
          <SectionTitle title="تفاصيل الحجز" icon={CalendarDays} />
          <form className="mt-5 space-y-4" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
            <input type="hidden" {...register('facilityId')} />
            <div className="grid grid-cols-4 gap-3">
              {['اليوم 24 مايو', 'السبت 25 مايو', 'الأحد 26 مايو', 'الإثنين 27 مايو'].map((day, index) => (
                <label key={day} className={cn('rounded-2xl bg-surface-container-low p-3 text-center text-sm font-bold', index === 0 && 'bg-secondary-container text-secondary')}>
                  <input className="sr-only" type="radio" value={`2026-05-${24 + index}`} {...register('bookingDate')} />
                  {day}
                </label>
              ))}
            </div>
            <div className="space-y-3">
              {['07:00', '08:00', '09:00', '10:00', '11:00'].map((time) => (
                <label key={time} className={cn('mx-auto block w-44 rounded-full border px-4 py-2 text-center font-bold', time === '08:00' ? 'border-secondary bg-secondary-container/30 text-secondary' : 'border-outline-variant text-primary')}>
                  <input className="sr-only" type="radio" value={time} {...register('bookingTime')} />
                  {time} ص - {Number(time.slice(0, 2)) + 1}:00 ص
                </label>
              ))}
            </div>
            {success && <SuccessFeedback message="تم تأكيد الحجز بنجاح وسيظهر ضمن حجوزاتك." />}
            <button className="w-full rounded-2xl bg-primary px-5 py-4 text-lg font-bold text-white" disabled={mutation.isPending} type="submit">تأكيد الحجز</button>
          </form>
        </DetailCard>
        <DetailCard>
          <div className="flex items-center justify-between">
            <StatusChip label={`${bookings.length} نشط`} tone="success" />
            <h2 className="text-2xl font-bold text-primary">حجوزاتي</h2>
          </div>
          <div className="mt-4 space-y-3">
            {bookings.slice(0, 2).map((booking) => (
              <div key={booking.id} className="rounded-2xl bg-surface-container-low p-4 text-right">
                <h3 className="font-bold text-primary">{booking.facilityName}</h3>
                <p className="text-sm text-on-surface-variant">{booking.bookingDate} - {booking.bookingTime}</p>
                <button className="mt-2 text-sm font-bold text-error" type="button">إلغاء الحجز</button>
              </div>
            ))}
          </div>
        </DetailCard>
      </main>
    </PageFrame>
  );
}

const maintenanceSchema = z.object({
  category: z.string().min(1, 'اختر نوع الصيانة'),
  location: z.string().min(3, 'اكتب رقم الوحدة أو الموقع'),
  description: z.string().min(10, 'اكتب وصفا أوضح للعطل'),
  preferredTimeSlot: z.string().min(1),
});

type MaintenanceForm = z.infer<typeof maintenanceSchema>;

export function MaintenanceRequestPage() {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState('سباكة');
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<MaintenanceForm>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: { category: 'سباكة', location: 'فيلا 24 - الطابق الأرضي', preferredTimeSlot: 'الآن' },
  });
  const mutation = useMutation({
    mutationFn: (values: MaintenanceForm) => maintenanceService.createMaintenanceRequest({
      category: values.category,
      subCategory: values.category,
      description: `${values.location}: ${values.description}`,
      preferredDate: '2026-05-24',
      preferredTimeSlot: values.preferredTimeSlot,
    }),
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
  });
  const categories = [
    { label: 'سباكة', icon: Wrench },
    { label: 'كهرباء', icon: Zap },
    { label: 'تكييف', icon: Snowflake },
    { label: 'نظافة', icon: Hammer },
    { label: 'نجارة', icon: Hammer },
    { label: 'أخرى', icon: CircleAlert },
  ];

  return (
    <PageFrame>
      <CoreTopBar title="طلب صيانة" back />
      <main className="space-y-6 px-5 pt-6">
        <div className="relative overflow-hidden rounded-[28px]">
          <img alt="" className="h-40 w-full object-cover" src={heroImages.maintenance} />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
          <div className="absolute bottom-5 right-5 text-right text-white">
            <h1 className="text-xl font-bold">خدمات الصيانة المتميزة</h1>
            <p className="text-sm">نحن هنا لضمان راحتك في المجتمع</p>
          </div>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <SectionTitle title="نوع الصيانة المطلوب" icon={Hammer} />
          <div className="grid grid-cols-3 gap-3">
            {categories.map((item) => (
              <button
                key={item.label}
                className={cn('rounded-[18px] border bg-white p-4 text-center shadow-sm', category === item.label ? 'border-secondary text-secondary' : 'border-outline-variant text-primary')}
                type="button"
                onClick={() => {
                  setCategory(item.label);
                  setValue('category', item.label);
                }}
              >
                <item.icon className="mx-auto h-7 w-7" />
                <span className="mt-2 block text-sm">{item.label}</span>
              </button>
            ))}
          </div>
          <DetailCard className="space-y-4">
            <label className="block text-right">
              <span className="mb-2 block font-bold text-primary">رقم الوحدة / الموقع</span>
              <input className={fieldClass} {...register('location')} />
              {errors.location && <span className="mt-1 block text-sm text-error">{errors.location.message}</span>}
            </label>
            <label className="block text-right">
              <span className="mb-2 block font-bold text-primary">وصف العطل</span>
              <textarea className={cn(fieldClass, 'min-h-28 resize-none')} placeholder="يرجى كتابة تفاصيل العطل..." {...register('description')} />
              {errors.description && <span className="mt-1 block text-sm text-error">{errors.description.message}</span>}
            </label>
          </DetailCard>
          <DetailCard>
            <SectionTitle title="وقت الزيارة المفضل" icon={Clock3} />
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              {['الآن', 'صباحا (8-12)', 'مساء (4-8)', 'غدا'].map((slot) => (
                <label key={slot} className="rounded-full border border-outline-variant px-4 py-2 text-sm font-bold text-primary">
                  <input className="sr-only" type="radio" value={slot} {...register('preferredTimeSlot')} />
                  {slot}
                </label>
              ))}
            </div>
          </DetailCard>
          {success && <SuccessFeedback message="تم إرسال طلب الصيانة. سنراجع الطلب خلال ٣٠ دقيقة بحد أقصى." />}
          <button className="w-full rounded-2xl bg-primary px-5 py-4 text-lg font-bold text-white" disabled={mutation.isPending} type="submit">
            <span className="inline-flex items-center gap-2">إرسال الطلب <Send className="h-5 w-5" /></span>
          </button>
        </form>
      </main>
    </PageFrame>
  );
}

export function DocumentsPage() {
  const { data: documents = [] } = useQuery({ queryKey: ['documents'], queryFn: documentService.getDocuments });
  const [filter, setFilter] = useState('الكل');

  return (
    <PageFrame>
      <CoreTopBar title="المستندات" back />
      <main className="space-y-6 px-5 pt-6">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {['الكل', 'القوانين', 'إيصالات', 'تنبيهات'].map((item) => (
            <button
              key={item}
              className={cn('shrink-0 rounded-full border px-6 py-3 font-bold', filter === item ? 'border-primary bg-primary text-white' : 'border-outline-variant bg-white text-primary')}
              type="button"
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {documents.map((document) => (
            <DetailCard key={document.id} className="p-4">
              <div className="flex items-center gap-4">
                <button className="rounded-full bg-secondary-container/25 p-3 text-secondary" type="button"><Download className="h-5 w-5" /></button>
                <button className="rounded-full bg-surface-container-low p-3 text-primary" type="button"><Eye className="h-5 w-5" /></button>
                <div className="flex-1 text-right">
                  <h2 className="font-bold text-primary">{document.title}</h2>
                  <div className="mt-2 flex items-center justify-end gap-3">
                    <StatusChip label={document.fileType.toUpperCase()} tone="success" icon={FileText} />
                    <span className="text-xs text-on-surface-variant">{document.uploadedAt}</span>
                  </div>
                </div>
                <IconBubble icon={FileText} />
              </div>
            </DetailCard>
          ))}
        </div>
        <section className="rounded-[32px] bg-primary p-7 text-right text-white shadow-xl shadow-primary/15">
          <ShieldCheck className="mr-auto h-14 w-14 text-secondary-fixed" />
          <h2 className="mt-8 text-2xl font-bold">وثيقة الملكية الإلكترونية</h2>
          <p className="mt-3 leading-7 text-primary-fixed-dim">
            يمكنك الوصول إلى نسخة رقمية موثقة من عقد الإيجار أو الملكية الخاص بك في أي وقت ومن أي مكان.
          </p>
          <button className="mt-6 w-full rounded-2xl bg-secondary px-5 py-4 text-lg font-bold text-white" type="button">استعراض الوثيقة</button>
        </section>
      </main>
    </PageFrame>
  );
}

export function CommunityRulesPage() {
  const { data: rules = [] } = useQuery({ queryKey: ['community-rules'], queryFn: documentService.getCommunityRules });
  const [open, setOpen] = useState(0);
  const sections = [
    { title: 'ساعات الهدوء', subtitle: 'الهدوء للجميع', icon: Moon, rules: rules.slice(0, 2) },
    { title: 'قواعد المواقف', subtitle: 'تنظيم المركبات', icon: Car, rules: rules.slice(1, 3) },
    { title: 'المرافق الرياضية', subtitle: 'الاستخدام الصحي', icon: Waves, rules: rules.slice(3, 5) },
  ];

  return (
    <PageFrame>
      <CoreTopBar brand />
      <main className="space-y-6 px-5 pt-6">
        <div className="relative overflow-hidden rounded-[28px]">
          <img alt="" className="h-48 w-full object-cover" src={heroImages.compound} />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 to-transparent" />
          <div className="absolute bottom-5 right-5 text-right text-white">
            <h1 className="text-3xl font-bold">قواعد المجتمع</h1>
            <p className="mt-1">دليل السكن الراقي والتعايش المشترك</p>
          </div>
        </div>
        <div className="space-y-4">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isOpen = open === index;

            return (
              <DetailCard key={section.title} className="p-0">
                <button className="flex w-full items-center justify-between p-5 text-right" type="button" onClick={() => setOpen(isOpen ? -1 : index)}>
                  {isOpen ? <ChevronUp className="h-5 w-5 text-outline" /> : <ChevronDown className="h-5 w-5 text-outline" />}
                  <div className="flex flex-1 items-center justify-end gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-primary">{section.title}</h2>
                      <p className="text-sm text-on-surface-variant">{section.subtitle}</p>
                    </div>
                    <IconBubble icon={Icon} className={index === 0 ? 'bg-primary text-white' : 'bg-secondary-container/30 text-secondary'} />
                  </div>
                </button>
                {isOpen && (
                  <div className="space-y-3 border-t border-outline-variant/40 p-5">
                    {section.rules.map((rule) => (
                      <div key={rule} className="flex items-start gap-3 text-right leading-7 text-on-surface-variant">
                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-secondary" />
                        <p>{rule}</p>
                      </div>
                    ))}
                  </div>
                )}
              </DetailCard>
            );
          })}
        </div>
      </main>
    </PageFrame>
  );
}

export function ManagementContactPage() {
  const { data: contacts = [] } = useQuery({ queryKey: ['contacts'], queryFn: documentService.getContacts });

  return (
    <PageFrame>
      <CoreTopBar brand />
      <main className="space-y-5 px-5 pt-6">
        <div className="text-right">
          <h1 className="text-3xl font-bold text-primary">تواصل مع الإدارة</h1>
          <p className="mt-2 text-on-surface-variant">فريقنا متاح لخدمتك على مدار الساعة لضمان راحتك وأمنك.</p>
        </div>
        <div className="rounded-[22px] border border-error/25 bg-error-container p-5 text-right text-error">
          <h2 className="font-bold">تنبيه الطوارئ</h2>
          <p className="mt-2 text-sm leading-6">في حالة وجود حريق أو خطر أمني وشيك، يرجى استخدام زر الطوارئ أو الاتصال بالخط الساخن فورا.</p>
        </div>
        {contacts.slice(0, 3).map((contact) => (
          <DetailCard key={contact.id}>
            <div className="flex items-start justify-between gap-4">
              <IconBubble icon={contact.category === 'SECURITY' ? ShieldCheck : contact.category === 'MAINTENANCE' ? Wrench : Building2} className={contact.category === 'SECURITY' ? 'bg-primary text-white' : undefined} />
              <div className="flex-1 text-right">
                <h2 className="text-xl font-bold text-primary">{contact.name}</h2>
                <p className="mt-1 text-sm text-on-surface-variant">{contact.role}</p>
                <p className="mt-1 text-xs text-on-surface-variant">{contact.workingHours}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3">
              <button className="rounded-full bg-primary px-5 py-3 font-bold text-white" type="button">
                <span className="inline-flex items-center gap-2">اتصال فوري <Phone className="h-5 w-5" /></span>
              </button>
              {contact.email && <button className="rounded-full bg-surface-container px-5 py-3 font-bold text-primary" type="button">بريد إلكتروني</button>}
            </div>
          </DetailCard>
        ))}
        <div className="relative overflow-hidden rounded-[28px]">
          <img alt="" className="h-48 w-full object-cover" src={heroImages.office} />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
          <p className="absolute bottom-5 right-5 text-xl font-bold text-white">بوابة رقم 1 - المبنى الإداري الرئيسي</p>
        </div>
      </main>
    </PageFrame>
  );
}
