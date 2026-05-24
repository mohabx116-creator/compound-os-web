import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Bell, Building2, ChevronDown, ChevronUp, CircleAlert, FileCheck, FileText, Globe2, Headphones, HelpCircle, Info, KeyRound, MessageCircle, Moon, Phone, Search, Send, Settings, ShieldCheck, SlidersHorizontal, Trash2, User, Users, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { CoreTopBar } from '../../components/layout/CoreTopBar';
import { DetailCard } from '../../components/ui/DetailCard';
import { StatusChip } from '../../components/ui/StatusChip';
import { SuccessFeedback } from '../../components/ui/SuccessFeedback';
import { chatService } from '../../features/chat/services/chat.service';
import { profileService } from '../../features/profile/services/profile.service';
import { supportService } from '../../features/profile/services/support.service';
import { residentApiService } from '../../lib/api/resident-service';
import { ROUTES } from '../../lib/constants/routes';
import { useSession } from '../../lib/session/use-session';
import { cn } from '../../lib/utils/cn';
import { formatMoney } from '../../lib/utils/format-money';
import { useAppStore } from '../../stores/app.store';
import { fieldClass, heroImages, IconBubble, PageFrame, SectionTitle } from './shared';

export function UnitDetailsPage() {
  const session = useSession();
  const fallbackUnit = useAppStore((state) => state.unit);
  const { data: unitData, isLoading: unitLoading, isError: unitError } = useQuery({
    queryKey: ['unit', session.unitId],
    queryFn: () => profileService.getBackendUnitDetails(session.unitId),
  });
  const { data: residents = [], isLoading: residentsLoading, isError: residentsError } = useQuery({
    queryKey: ['residents', 'unit', session.unitId],
    queryFn: () => residentApiService.getResidents({ unitId: session.unitId }),
  });
  const unit = unitData ?? fallbackUnit;
  const ownerName = residents[0]?.fullName ?? 'أحمد المحمدي';

  return (
    <PageFrame>
      <CoreTopBar title="بيانات وحدتي" subtitle={unit ? `${unit.unitType} ${unit.unitNumber}` : undefined} back />
      <main className="space-y-5 px-5 pt-6">
        {(unitError || residentsError) && (
          <DetailCard>
            <p className="text-right text-sm text-error">تعذر تحميل بعض بيانات الوحدة من الخادم. يتم عرض البيانات المتاحة مؤقتا.</p>
          </DetailCard>
        )}
        <div className="rounded-[30px] bg-primary p-6 text-white shadow-xl shadow-primary/15">
          <p className="text-primary-fixed-dim">رصيد الصيانة الحالي</p>
          <p className="mt-3 text-5xl font-bold">{formatMoney(2500)}</p>
          <StatusChip className="mt-4" label="منتظم" tone="success" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <DetailCard className="text-center">
            <User className="mx-auto h-7 w-7 text-secondary" />
            <p className="mt-2 text-sm text-on-surface-variant">المالك</p>
            <p className="font-bold text-primary">{ownerName}</p>
          </DetailCard>
          <DetailCard className="text-center">
            <Building2 className="mx-auto h-7 w-7 text-secondary" />
            <p className="mt-2 text-sm text-on-surface-variant">المساحة</p>
            <p className="font-bold text-primary">{unit?.areaSqm ?? 320} م²</p>
          </DetailCard>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'مستندات', icon: FileText, to: ROUTES.DOCUMENTS },
            { label: 'مدفوعات', icon: FileCheck, to: ROUTES.PAYMENTS },
            { label: 'شكاوى', icon: AlertTriangle, to: ROUTES.COMPLAINTS },
            { label: 'زائر', icon: KeyRound, to: ROUTES.VISITORS },
          ].map((item) => (
            <Link key={item.label} className="rounded-2xl bg-white p-3 text-center text-primary shadow-sm" to={item.to}>
              <item.icon className="mx-auto h-6 w-6 text-secondary" />
              <span className="mt-2 block text-xs font-bold">{item.label}</span>
            </Link>
          ))}
        </div>
        <DetailCard>
          <SectionTitle title="السكان المسجلون" icon={Users} />
          <div className="mt-4 space-y-3">
            {(unitLoading || residentsLoading) && (
              <p className="rounded-2xl bg-surface-container-low p-3 text-center text-sm font-bold text-secondary">جاري تحميل بيانات الوحدة...</p>
            )}
            {!residentsLoading && !residentsError && residents.length === 0 && (
              <p className="rounded-2xl bg-surface-container-low p-3 text-center text-sm text-on-surface-variant">لا يوجد سكان مسجلون لهذه الوحدة حاليا.</p>
            )}
            {residents.map((resident) => (
              <div key={resident.id} className="flex items-center justify-between rounded-2xl bg-surface-container-low p-3">
                <StatusChip label={resident.status === 'ACTIVE' ? 'نشط' : 'غير نشط'} tone={resident.status === 'ACTIVE' ? 'success' : 'neutral'} />
                <span className="font-bold text-primary">{resident.fullName}</span>
              </div>
            ))}
          </div>
        </DetailCard>
        <div className="relative overflow-hidden rounded-[28px]">
          <img alt="" className="h-48 w-full object-cover" src={heroImages.compound} />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
          <p className="absolute bottom-5 right-5 text-xl font-bold text-white">موقع الوحدة داخل الياسمين</p>
        </div>
      </main>
    </PageFrame>
  );
}

export function ChatPage() {
  const { data: rooms = [] } = useQuery({ queryKey: ['chat-rooms'], queryFn: chatService.getChatRooms });

  return (
    <PageFrame>
      <CoreTopBar brand avatarUrl="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120" />
      <main className="space-y-6 px-5 pt-7">
        <div className="flex items-center gap-4">
          <button className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-primary text-white" type="button"><SlidersHorizontal className="h-7 w-7" /></button>
          <label className="flex flex-1 items-center gap-3 rounded-[20px] bg-surface-container-low px-4 py-4">
            <Search className="h-6 w-6 text-primary" />
            <input className="w-full border-0 bg-transparent text-right placeholder:text-outline focus:ring-0" placeholder="ابحث في المحادثات..." />
          </label>
        </div>
        <div className="flex items-center justify-between">
          <StatusChip label="4 غير مقروءة" tone="success" />
          <h1 className="text-3xl font-bold text-primary">المحادثات</h1>
        </div>
        <div className="space-y-5">
          {rooms.map((room, index) => (
            <DetailCard key={room.id} className={cn('relative overflow-hidden p-5', index === 0 && 'border-r-4 border-r-error')}>
              <div className="flex items-center gap-4">
                <IconBubble icon={room.senderRole === 'SECURITY' ? ShieldCheck : room.senderRole === 'MAINTENANCE' ? Wrench : Building2} className={index === 0 ? 'bg-error-container text-error' : 'bg-primary text-white'} />
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">{room.lastMessageTime}</span>
                    <h2 className="text-xl font-bold text-primary">{room.title}</h2>
                  </div>
                  <p className={cn('mt-2 line-clamp-1 text-on-surface-variant', index === 0 && 'font-bold text-error')}>{room.lastMessage}</p>
                </div>
                {room.unreadCount > 0 && <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-bold text-white">{room.unreadCount}</span>}
              </div>
            </DetailCard>
          ))}
        </div>
        <button className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/20" type="button">
          <MessageCircle className="h-9 w-9" />
        </button>
      </main>
    </PageFrame>
  );
}

export function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [nightMode, setNightMode] = useState(false);

  return (
    <PageFrame>
      <CoreTopBar title="الإعدادات" back />
      <main className="space-y-6 px-5 pt-8">
        <div className="text-center">
          <div className="relative mx-auto h-28 w-28">
            <img alt="" className="h-28 w-28 rounded-full object-cover shadow-lg" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" />
            <button className="absolute bottom-0 left-0 rounded-full bg-secondary p-3 text-white" type="button"><Settings className="h-5 w-5" /></button>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-primary">أحمد المحمدي</h1>
          <p className="text-on-surface-variant">فيلا 24 - الياسمين</p>
        </div>
        <SettingsGroup title="الحساب والخصوصية">
          <SettingsRow icon={Globe2} label="اللغة" value="العربية" />
          <SettingsRow icon={ShieldCheck} label="الخصوصية" />
        </SettingsGroup>
        <SettingsGroup title="التفضيلات">
          <ToggleRow checked={notifications} icon={Bell} label="التنبيهات" onChange={setNotifications} />
          <ToggleRow checked={nightMode} icon={Moon} label="الوضع الليلي" onChange={setNightMode} />
        </SettingsGroup>
        <SettingsGroup title="حول التطبيق">
          <SettingsRow icon={Info} label="إصدار التطبيق" value="v2.4.1 (Stable)" />
          <SettingsRow icon={FileText} label="الشروط والأحكام" />
        </SettingsGroup>
        <button className="flex w-full items-center justify-between rounded-[20px] border border-error/35 bg-error-container/30 px-5 py-4 text-lg font-bold text-error" type="button">
          <ChevronDown className="h-5 w-5 rotate-90" />
          <span className="inline-flex items-center gap-2">حذف الحساب <Trash2 className="h-5 w-5" /></span>
        </button>
        <p className="text-center text-sm text-on-surface-variant">تحذير: هذا الإجراء لا يمكن التراجع عنه.</p>
      </main>
    </PageFrame>
  );
}

function SettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <DetailCard className="p-0">
      <p className="border-b border-outline-variant/40 px-5 py-4 text-right text-sm font-bold text-secondary">{title}</p>
      {children}
    </DetailCard>
  );
}

function SettingsRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-outline-variant/30 px-5 py-5 last:border-b-0">
      <span className="text-on-surface-variant">{value ?? '›'}</span>
      <span className="inline-flex items-center gap-3 text-lg font-bold text-primary">
        {label}
        <Icon className="h-6 w-6" />
      </span>
    </div>
  );
}

function ToggleRow({ icon: Icon, label, checked, onChange }: { icon: LucideIcon; label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between border-b border-outline-variant/30 px-5 py-5 last:border-b-0">
      <button className={cn('h-8 w-16 rounded-full p-1 transition-colors', checked ? 'bg-secondary' : 'bg-outline-variant')} type="button" onClick={() => onChange(!checked)}>
        <span className={cn('block h-6 w-6 rounded-full bg-white transition-transform', checked ? 'translate-x-8' : 'translate-x-0')} />
      </button>
      <span className="inline-flex items-center gap-3 text-lg font-bold text-primary">
        {label}
        <Icon className="h-6 w-6" />
      </span>
    </div>
  );
}

const supportSchema = z.object({
  category: z.string().min(1),
  description: z.string().min(10, 'اشرح المشكلة بشكل أوضح'),
});

type SupportForm = z.infer<typeof supportSchema>;

export function SupportPage() {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState('صيانة');
  const [success, setSuccess] = useState(false);
  const { data: tickets = [] } = useQuery({ queryKey: ['support-tickets'], queryFn: supportService.getSupportTickets });
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<SupportForm>({
    resolver: zodResolver(supportSchema),
    defaultValues: { category: 'صيانة' },
  });
  const mutation = useMutation({
    mutationFn: (values: SupportForm) => supportService.createSupportTicket(`طلب ${values.category}`, values.category, values.description),
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
    },
  });

  return (
    <PageFrame>
      <CoreTopBar brand />
      <main className="space-y-6 px-5 pt-6">
        <div className="text-right">
          <h1 className="text-3xl font-bold text-primary">كيف يمكننا مساعدتك؟</h1>
          <p className="mt-2 text-on-surface-variant">نحن هنا لضمان راحتك وأمنك في المجتمع السكني.</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'تحدث معنا', icon: Headphones },
            { label: 'اتصال هاتفي', icon: Phone },
            { label: 'الأسئلة الشائعة', icon: HelpCircle },
          ].map((item) => (
            <Link key={item.label} className="rounded-[20px] bg-white p-5 text-center shadow-md shadow-primary/5" to={item.label === 'الأسئلة الشائعة' ? ROUTES.FAQ : ROUTES.CHAT}>
              <item.icon className="mx-auto h-8 w-8 text-secondary" />
              <span className="mt-3 block text-sm font-bold text-primary">{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <Link className="text-sm font-bold text-secondary" to={ROUTES.CHAT}>عرض الكل</Link>
          <h2 className="text-2xl font-bold text-primary">تذاكر الدعم النشطة</h2>
        </div>
        {tickets[0] && (
          <DetailCard className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <StatusChip label={tickets[0].status === 'IN_PROGRESS' ? 'قيد المعالجة' : 'مفتوحة'} tone="success" />
              <div className="text-right">
                <p className="text-sm text-on-surface-variant">تذكرة رقم {tickets[0].id.replace('tkt-', '')}</p>
                <h3 className="mt-1 text-xl font-bold text-primary">{tickets[0].title}</h3>
                <p className="mt-2 text-on-surface-variant">آخر تحديث: سيصل الفني خلال 30 دقيقة.</p>
              </div>
            </div>
          </DetailCard>
        )}
        <form className="rounded-[28px] border-2 border-dashed border-outline-variant p-5" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <h2 className="mb-5 text-right text-2xl font-bold text-primary">فتح طلب جديد</h2>
          <div className="mb-4 flex justify-end gap-2">
            {['صيانة', 'أمن', 'تنظيف', 'اقتراح'].map((item) => (
              <button
                key={item}
                className={cn('rounded-full border px-4 py-2 text-sm font-bold', category === item ? 'border-secondary bg-secondary-container/30 text-secondary' : 'border-outline-variant text-primary')}
                type="button"
                onClick={() => {
                  setCategory(item);
                  setValue('category', item);
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <textarea className={cn(fieldClass, 'min-h-28 resize-none bg-white')} placeholder="اشرح لنا ما الذي تحتاجه..." {...register('description')} />
          {errors.description && <p className="mt-1 text-right text-sm text-error">{errors.description.message}</p>}
          {success && <div className="mt-4"><SuccessFeedback message="تم إرسال طلب الدعم بنجاح." /></div>}
          <button className="mt-5 w-full rounded-2xl bg-primary px-5 py-4 text-lg font-bold text-white" disabled={mutation.isPending} type="submit">
            <span className="inline-flex items-center gap-2">إرسال الطلب <Send className="h-5 w-5" /></span>
          </button>
        </form>
        <div className="rounded-[28px] border border-error/20 bg-error-container/40 p-5 text-right text-error">
          <div className="flex items-center justify-between">
            <button className="rounded-full bg-error px-6 py-3 font-bold text-white" type="button">اتصل الآن</button>
            <div>
              <h2 className="text-xl font-bold">حالة طوارئ؟</h2>
              <p className="mt-1 text-sm">اتصل مباشرة بغرفة التحكم المركزية للمجمع.</p>
            </div>
            <CircleAlert className="h-12 w-12" />
          </div>
        </div>
      </main>
    </PageFrame>
  );
}

export function FAQPage() {
  const { data: faq = [] } = useQuery({ queryKey: ['faq'], queryFn: profileService.getFAQ });
  const [open, setOpen] = useState<string | null>(faq[0]?.id ?? null);

  return (
    <PageFrame>
      <CoreTopBar title="مركز المساعدة" back />
      <main className="space-y-6 px-5 pt-6">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-primary">كيف يمكننا مساعدتك؟</h1>
          <p className="mt-2 text-on-surface-variant">ابحث عن إجابات فورية لجميع استفساراتك حول السكن</p>
        </div>
        <label className="flex items-center gap-3 rounded-2xl bg-surface-container-low px-4 py-4">
          <Search className="h-6 w-6 text-outline" />
          <input className="w-full border-0 bg-transparent text-right placeholder:text-outline focus:ring-0" placeholder="ابحث عن موضوع معين..." />
        </label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'المدفوعات', icon: FileCheck },
            { label: 'الشكاوى', icon: AlertTriangle },
            { label: 'الزوار', icon: Users },
            { label: 'الخدمات', icon: Bell },
          ].map((item) => (
            <button key={item.label} className="rounded-[24px] bg-white p-7 text-center shadow-sm" type="button">
              <item.icon className="mx-auto h-9 w-9 text-secondary" />
              <span className="mt-3 block text-lg font-bold text-primary">{item.label}</span>
            </button>
          ))}
        </div>
        <SectionTitle title="الأسئلة الشائعة" />
        <div className="space-y-4">
          {faq.map((item, index) => {
            const isOpen = open === item.id;

            return (
              <DetailCard key={item.id} className="p-0">
                <button className="flex w-full items-center justify-between gap-3 p-5 text-right" type="button" onClick={() => setOpen(isOpen ? null : item.id)}>
                  {isOpen ? <ChevronUp className="h-5 w-5 text-outline" /> : <ChevronDown className="h-5 w-5 text-outline" />}
                  <div className="flex flex-1 items-center justify-end gap-4">
                    <h2 className="text-lg font-bold text-primary">{item.question}</h2>
                    <IconBubble icon={index === 0 ? FileCheck : index === 1 ? AlertTriangle : KeyRound} />
                  </div>
                </button>
                {isOpen && <p className="border-t border-outline-variant/40 p-5 text-right leading-8 text-on-surface-variant">{item.answer}</p>}
              </DetailCard>
            );
          })}
        </div>
        <section className="rounded-[32px] bg-primary p-7 text-center text-white shadow-xl shadow-primary/15">
          <h2 className="text-2xl font-bold">لم تجد إجابتك؟</h2>
          <p className="mt-3 leading-7 text-primary-fixed-dim">فريق الدعم الفني متواجد على مدار الساعة لمساعدتك في أي وقت.</p>
          <Link className="mt-6 inline-flex items-center gap-2 rounded-full bg-secondary px-8 py-3 font-bold text-white" to={ROUTES.CHAT}>
            تحدث معنا الآن
            <Headphones className="h-5 w-5" />
          </Link>
        </section>
      </main>
    </PageFrame>
  );
}
