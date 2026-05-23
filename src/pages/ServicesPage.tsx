import { BookOpen, Building2, CalendarCheck, Headphones, MessageSquare, Phone, QrCode, Search, Shield, Store, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CoreTopBar } from '../components/layout/CoreTopBar';
import { ROUTES } from '../lib/constants/routes';

interface ServiceTile {
  title: string;
  subtitle?: string;
  to: string;
  icon: LucideIcon;
  featured?: boolean;
}

const serviceTiles: ServiceTile[] = [
  { title: 'تصريح دخول زوار', subtitle: 'إصدار رمز دخول سريع', to: ROUTES.VISITORS, icon: QrCode, featured: true },
  { title: 'حجز مرافق', to: ROUTES.FACILITIES, icon: CalendarCheck },
  { title: 'طلب صيانة', to: ROUTES.MAINTENANCE, icon: Wrench },
  { title: 'دليل Compound OS', to: ROUTES.DOCUMENTS, icon: BookOpen },
  { title: 'القواعد واللوائح', to: ROUTES.RULES, icon: Building2 },
];

const comingSoon = [
  { title: 'السوق المجتمعي', icon: Store },
  { title: 'المحادثات', icon: MessageSquare },
];

export function ServicesPage() {
  return (
    <section className="min-h-dvh bg-background pb-28">
      <CoreTopBar title="الخدمات" />
      <main className="space-y-7 px-5 pt-6">
        <label className="flex items-center rounded-2xl bg-surface-container-low px-4 py-3 text-on-surface-variant">
          <Search className="h-6 w-6" />
          <input className="min-w-0 flex-1 border-none bg-transparent px-3 text-base outline-none placeholder:text-outline focus:ring-0" placeholder="ابحث عن خدمة..." />
        </label>

        <section>
          <h2 className="mb-4 text-right text-lg font-semibold text-primary">الخدمات المتاحة</h2>
          <div className="grid grid-cols-2 gap-5">
            {serviceTiles.map((service) => {
              const Icon = service.icon;
              if (service.featured) {
                return (
                  <Link key={service.to} className="col-span-2 flex items-center gap-5 rounded-[24px] bg-white p-5 shadow-xl shadow-primary/8" to={service.to}>
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-secondary-container text-on-secondary-fixed">
                      <Icon className="h-8 w-8" />
                    </span>
                    <div className="text-right">
                      <h3 className="text-2xl font-bold text-primary">{service.title}</h3>
                      {service.subtitle && <p className="mt-2 text-base text-on-surface-variant">{service.subtitle}</p>}
                    </div>
                  </Link>
                );
              }

              return (
                <Link key={service.to} className="flex min-h-36 flex-col justify-between rounded-[24px] bg-white p-5 shadow-lg shadow-primary/6" to={service.to}>
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-low text-primary">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="text-right text-lg font-bold leading-7 text-primary">{service.title}</h3>
                </Link>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <button className="text-sm font-bold text-secondary" type="button">ترقبوا المزيد</button>
            <h2 className="text-lg font-semibold text-primary">قريبا</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-1">
            {comingSoon.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="min-w-44 rounded-3xl border border-dashed border-outline-variant bg-white/50 p-4 text-on-surface-variant">
                  <span className="rounded-full bg-surface-container px-3 py-1 text-xs">قريبا</span>
                  <Icon className="mt-5 h-8 w-8" />
                  <p className="mt-5 text-sm font-semibold">{item.title}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-right text-lg font-semibold text-primary">تواصل سريع</h2>
          <Link className="flex items-center justify-between rounded-2xl border border-error/20 bg-error-container/25 px-5 py-4 text-error" to={ROUTES.EMERGENCY}>
            <Phone className="h-6 w-6" />
            <span className="flex items-center gap-3 text-lg font-bold">
              <Shield className="h-6 w-6" />
              رقم الأمن
            </span>
          </Link>
          <Link className="flex items-center justify-between rounded-2xl border border-outline-variant bg-surface-container px-5 py-4 text-primary" to={ROUTES.CONTACT}>
            <Phone className="h-6 w-6" />
            <span className="flex items-center gap-3 text-lg font-bold">
              <Headphones className="h-6 w-6" />
              الخط الساخن للإدارة
            </span>
          </Link>
        </section>

        <div className="relative h-44 overflow-hidden rounded-[28px] shadow-xl shadow-primary/10">
          <img alt="" className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=700" />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary/85 to-transparent p-5">
            <p className="text-xl font-bold text-white">نحن هنا لخدمتك دائما</p>
          </div>
        </div>
      </main>
    </section>
  );
}
