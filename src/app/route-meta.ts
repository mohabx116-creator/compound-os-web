import { matchPath } from 'react-router-dom';
import { ROUTES } from '../lib/constants/routes';

export interface RouteMeta {
  path: string;
  title: string;
  purpose: string;
}

export const routeMeta: RouteMeta[] = [
  { path: ROUTES.SPLASH, title: 'شاشة البداية', purpose: 'تجهيز تجربة الدخول الأولى وهوية Compound OS.' },
  { path: ROUTES.LOGIN, title: 'تسجيل الدخول', purpose: 'واجهة دخول تجريبية بدون مصادقة حقيقية في هذه المرحلة.' },
  { path: ROUTES.HOME, title: 'الرئيسية', purpose: 'ملخص سريع لحالة الوحدة والخدمات المهمة للسكان.' },
  { path: ROUTES.PAYMENTS, title: 'المدفوعات', purpose: 'عرض المستحقات والفواتير وحالة السداد.' },
  { path: ROUTES.PAYMENT_DETAILS, title: 'تفاصيل الفاتورة', purpose: 'مراجعة بيانات فاتورة محددة وخطوات السداد التجريبية.' },
  { path: ROUTES.COMPLAINTS, title: 'الشكاوى', purpose: 'متابعة الشكاوى المفتوحة والمنتهية.' },
  { path: ROUTES.COMPLAINT_NEW, title: 'شكوى جديدة', purpose: 'تجهيز نموذج إنشاء شكوى جديدة بالبيانات المطلوبة.' },
  { path: ROUTES.COMPLAINT_DETAILS, title: 'تفاصيل الشكوى', purpose: 'متابعة حالة الشكوى وخط سير المعالجة.' },
  { path: ROUTES.ANNOUNCEMENTS, title: 'الإعلانات', purpose: 'استعراض تنبيهات وإعلانات إدارة الكمبوند.' },
  { path: ROUTES.ANNOUNCEMENT_DETAILS, title: 'تفاصيل الإعلان', purpose: 'عرض إعلان محدد بكامل تفاصيله.' },
  { path: ROUTES.NOTIFICATIONS, title: 'الإشعارات', purpose: 'تجميع التنبيهات المرتبطة بالمدفوعات والخدمات.' },
  { path: ROUTES.SERVICES, title: 'الخدمات', purpose: 'مدخل سريع لخدمات الزوار والصيانة والمرافق.' },
  { path: ROUTES.MAINTENANCE, title: 'طلب صيانة', purpose: 'تجهيز نموذج طلب صيانة للوحدة أو المرافق المشتركة.' },
  { path: ROUTES.VISITORS, title: 'دخول الزوار', purpose: 'إصدار ومتابعة تصاريح دخول الزوار.' },
  { path: ROUTES.FACILITIES, title: 'حجز المرافق', purpose: 'اختيار المرافق المتاحة وتجهيز طلب الحجز.' },
  { path: ROUTES.DOCUMENTS, title: 'المستندات', purpose: 'عرض ملفات ولوائح قابلة للتحميل لاحقا.' },
  { path: ROUTES.RULES, title: 'قواعد المجتمع', purpose: 'تقديم اللوائح والسلوكيات المنظمة للحياة داخل الكمبوند.' },
  { path: ROUTES.CONTACT, title: 'تواصل مع الإدارة', purpose: 'قنوات التواصل مع الأمن والصيانة والإدارة.' },
  { path: ROUTES.EMERGENCY, title: 'بلاغ طوارئ', purpose: 'إرسال بلاغ طارئ تجريبي مع إبراز المعالجة الحمراء.' },
  { path: ROUTES.EMERGENCY_STATUS, title: 'حالة الطوارئ', purpose: 'متابعة حالة بلاغ طوارئ محدد.' },
  { path: ROUTES.CHAT, title: 'المحادثات', purpose: 'معاينة محادثات الدعم والأمن بدون WebSockets.' },
  { path: ROUTES.PROFILE, title: 'حسابي', purpose: 'عرض بيانات الساكن والوحدة وروابط الإعدادات.' },
  { path: ROUTES.UNIT, title: 'بيانات الوحدة', purpose: 'عرض بيانات الوحدة السكنية المرتبطة بالحساب.' },
  { path: ROUTES.SETTINGS, title: 'الإعدادات', purpose: 'تجهيز خيارات اللغة والتنبيهات والتفضيلات.' },
  { path: ROUTES.SUPPORT, title: 'الدعم', purpose: 'تجهيز نموذج تواصل مع فريق الدعم.' },
  { path: ROUTES.FAQ, title: 'الأسئلة الشائعة', purpose: 'عرض إجابات مختصرة لأهم أسئلة السكان.' },
];

export function getRouteMeta(pathname: string): RouteMeta {
  return routeMeta.find((item) => matchPath({ path: item.path, end: true }, pathname)) ?? routeMeta[2];
}

export function isPublicRoute(pathname: string): boolean {
  return pathname === ROUTES.SPLASH || pathname === ROUTES.LOGIN;
}
