import { useQuery } from '@tanstack/react-query';
import { Bell, ChevronLeft, CircleHelp, DoorOpen, Edit3, FileText, Globe2, LockKeyhole, ShieldCheck, UserRound, UsersRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CoreTopBar } from '../components/layout/CoreTopBar';
import { profileService } from '../features/profile/services/profile.service';
import { clearMockAuthentication } from '../lib/auth/mock-auth';
import { ROUTES } from '../lib/constants/routes';
import { useSession } from '../lib/session/use-session';
import { useAppStore } from '../stores/app.store';

const avatarUrl = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=160';

interface ProfileItem {
  label: string;
  to: string;
  icon: LucideIcon;
  hint?: string;
}

const unitItems: ProfileItem[] = [
  { label: 'تحديث البيانات', to: ROUTES.SETTINGS, icon: Edit3 },
  { label: 'سكان الوحدة', to: ROUTES.UNIT, icon: UsersRound },
  { label: 'المستندات', to: ROUTES.DOCUMENTS, icon: FileText },
];

const settingItems: ProfileItem[] = [
  { label: 'تغيير اللغة', to: ROUTES.SETTINGS, icon: Globe2, hint: 'العربية' },
  { label: 'التنبيهات', to: ROUTES.SETTINGS, icon: Bell },
  { label: 'تغيير كلمة المرور', to: ROUTES.SETTINGS, icon: LockKeyhole },
];

const supportItems: ProfileItem[] = [
  { label: 'اتصل بنا', to: ROUTES.SUPPORT, icon: UserRound },
  { label: 'الأسئلة الشائعة', to: ROUTES.FAQ, icon: CircleHelp },
];

function ProfileSection({ title, items }: { title: string; items: ProfileItem[] }) {
  return (
    <section>
      <h2 className="mb-4 text-right text-base font-semibold text-on-surface">{title}</h2>
      <div className="overflow-hidden rounded-[28px] border border-outline-variant bg-white shadow-lg shadow-primary/5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={`${item.label}-${item.to}`} className="flex items-center gap-4 border-b border-outline-variant/70 px-5 py-5 last:border-b-0" to={item.to}>
              <ChevronLeft className="h-5 w-5 text-outline" />
              {item.hint && <span className="mr-auto text-sm font-bold text-secondary">{item.hint}</span>}
              <span className="flex-1 text-right text-lg text-on-surface">{item.label}</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container text-primary">
                <Icon className="h-6 w-6" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function ProfilePage() {
  const navigate = useNavigate();
  const session = useSession();
  const fallbackResident = useAppStore((state) => state.resident);
  const fallbackUnit = useAppStore((state) => state.unit);
  const { data: residentData, isLoading: residentLoading, isError: residentError } = useQuery({
    queryKey: ['profile', session.residentId],
    queryFn: () => profileService.getBackendResidentProfile(session.residentId),
  });
  const { data: unitData, isLoading: unitLoading, isError: unitError } = useQuery({
    queryKey: ['unit', session.unitId],
    queryFn: () => profileService.getBackendUnitDetails(session.unitId),
  });
  const resident = residentData ?? fallbackResident;
  const unit = unitData ?? fallbackUnit;

  function handleLogout() {
    clearMockAuthentication();
    navigate(ROUTES.LOGIN, { replace: true });
  }

  return (
    <section className="min-h-dvh bg-background pb-28">
      <CoreTopBar title="حسابي" />
      <main className="space-y-8 px-5 pt-8">
        {(residentLoading || unitLoading) && (
          <div className="rounded-2xl border border-outline-variant/50 bg-white px-4 py-3 text-right text-sm font-bold text-secondary shadow-sm">
            جاري تحديث بيانات الحساب...
          </div>
        )}
        {(residentError || unitError) && (
          <div className="rounded-2xl border border-error/20 bg-error-container/40 px-4 py-3 text-right text-sm text-error shadow-sm">
            تعذر تحميل بيانات الحساب من الخادم. يتم عرض البيانات المحفوظة مؤقتا.
          </div>
        )}
        <Link className="flex items-center gap-5 rounded-[28px] border border-outline-variant bg-white p-6 shadow-xl shadow-primary/10" to={ROUTES.UNIT}>
          <div className="relative shrink-0">
            <img alt="" className="h-20 w-20 rounded-full border-4 border-secondary object-cover" src={avatarUrl} />
            <span className="absolute -bottom-1 -left-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-secondary text-white">
              <ShieldCheck className="h-4 w-4" />
            </span>
          </div>
          <div className="min-w-0 flex-1 text-right">
            <h1 className="truncate text-xl font-semibold text-primary">{resident?.fullName ?? 'أحمد المحمدي'}</h1>
            <p className="mt-1 text-lg text-on-surface">{unit?.unitNumber ?? 'فيلا ٢٤'} - {unit?.compoundName ?? 'الياسمين'}</p>
            <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary-container/40 px-4 py-2 text-sm font-bold text-on-secondary-container">
              <ShieldCheck className="h-4 w-4" />
              مالك الوحدة
            </span>
          </div>
        </Link>

        <ProfileSection title="إدارة الوحدة" items={unitItems} />
        <ProfileSection title="الإعدادات" items={settingItems} />
        <ProfileSection title="الدعم" items={supportItems} />

        <button className="flex w-full items-center justify-center gap-3 rounded-3xl bg-error-container px-6 py-5 text-xl font-bold text-error" type="button" onClick={handleLogout}>
          <DoorOpen className="h-6 w-6" />
          تسجيل الخروج
        </button>
      </main>
    </section>
  );
}
