import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, Download, FileText, KeyRound, Megaphone, Search, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CoreTopBar } from '../../components/layout/CoreTopBar';
import { DetailCard } from '../../components/ui/DetailCard';
import { StatusChip } from '../../components/ui/StatusChip';
import { announcementService } from '../../features/announcements/services/announcement.service';
import { notificationService } from '../../features/notifications/services/notification.service';
import { cn } from '../../lib/utils/cn';
import { heroImages, IconBubble, PageFrame, SectionTitle } from './shared';

export function AnnouncementsPage() {
  const { data: announcements = [] } = useQuery({ queryKey: ['announcements'], queryFn: announcementService.getAnnouncements });
  const [category, setCategory] = useState('الكل');

  return (
    <PageFrame>
      <CoreTopBar brand />
      <main className="space-y-5 px-5 pt-6">
        <div className="text-right">
          <h1 className="text-3xl font-bold text-primary">الإعلانات</h1>
          <p className="mt-1 text-on-surface-variant">آخر أخبار وتنبيهات إدارة المجتمع السكني</p>
        </div>
        <label className="flex items-center gap-3 rounded-2xl bg-surface-container-low px-4 py-3">
          <Search className="h-6 w-6 text-outline" />
          <input className="w-full border-0 bg-transparent text-right text-primary placeholder:text-outline focus:ring-0" placeholder="ابحث في الإعلانات..." />
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['الكل', 'صيانة', 'فعاليات', 'تنبيهات'].map((item) => (
            <button
              key={item}
              className={cn('shrink-0 rounded-full border px-5 py-2 text-sm font-bold', category === item ? 'border-primary bg-primary text-white' : 'border-outline-variant bg-white text-primary')}
              type="button"
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {announcements.map((announcement, index) => (
            <Link key={announcement.id} className="block overflow-hidden rounded-[28px] bg-white shadow-lg shadow-primary/5" to={`/announcements/${announcement.id}`}>
              {announcement.imageUrl && <img alt="" className="h-36 w-full object-cover" src={announcement.imageUrl} />}
              <div className="space-y-3 p-5 text-right">
                <div className="flex items-center justify-between">
                  <StatusChip label={announcement.isImportant ? 'هام' : index === 0 ? 'جديد' : 'إعلان'} tone={announcement.isImportant ? 'danger' : 'success'} icon={Megaphone} />
                  <span className="text-xs text-on-surface-variant">{announcement.createdAt.slice(0, 10)}</span>
                </div>
                <h2 className="text-xl font-bold text-primary">{announcement.title}</h2>
                <p className="line-clamp-2 leading-6 text-on-surface-variant">{announcement.content}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </PageFrame>
  );
}

export function AnnouncementDetailsPage() {
  const { id } = useParams();
  const { data: announcements = [] } = useQuery({ queryKey: ['announcements'], queryFn: announcementService.getAnnouncements });
  const announcement = announcements.find((item) => item.id === id) ?? announcements[0];

  return (
    <PageFrame>
      <CoreTopBar title="تفاصيل الإعلان" back />
      <main className="space-y-5 px-5 pt-6">
        <div className="relative overflow-hidden rounded-[28px]">
          <img alt="" className="h-56 w-full object-cover" src={announcement?.imageUrl ?? heroImages.compound} />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
          <StatusChip className="absolute right-4 top-4" label={announcement?.isImportant ? 'مهم' : 'إعلان'} tone={announcement?.isImportant ? 'danger' : 'success'} />
        </div>
        <DetailCard className="space-y-4 text-right">
          <p className="text-sm text-on-surface-variant">{announcement?.createdAt.slice(0, 10)}</p>
          <h1 className="text-3xl font-bold leading-10 text-primary">{announcement?.title ?? 'تنبيه من الإدارة'}</h1>
          <p className="leading-8 text-on-surface-variant">{announcement?.content ?? 'تفاصيل الإعلان ستظهر هنا.'}</p>
          <div className="rounded-2xl border-r-4 border-r-secondary bg-secondary-container/15 p-4 leading-7 text-primary">
            يرجى متابعة التعليمات المرفقة والالتزام بالمواعيد المحددة لضمان راحة جميع السكان.
          </div>
        </DetailCard>
        <DetailCard>
          <SectionTitle title="المرفقات" icon={FileText} />
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-surface-container-low p-4">
            <button className="rounded-full bg-secondary-container/40 p-3 text-secondary" type="button">
              <Download className="h-5 w-5" />
            </button>
            <span className="font-bold text-primary">ملف تفاصيل الإعلان PDF</span>
          </div>
        </DetailCard>
        <div className="grid grid-cols-1 gap-3">
          <button className="rounded-2xl bg-primary px-5 py-4 text-lg font-bold text-white" type="button">تم الاطلاع</button>
          <button className="rounded-2xl border border-secondary px-5 py-4 text-lg font-bold text-secondary" type="button">
            <span className="inline-flex items-center gap-2">
              مشاركة مع العائلة
              <Share2 className="h-5 w-5" />
            </span>
          </button>
        </div>
      </main>
    </PageFrame>
  );
}

export function NotificationsPage() {
  const queryClient = useQueryClient();
  const { data: notifications = [] } = useQuery({ queryKey: ['notifications'], queryFn: notificationService.getNotifications });
  const markAll = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return (
    <PageFrame>
      <CoreTopBar title="الإشعارات" back />
      <main className="space-y-5 px-5 pt-6">
        <button className="rounded-full bg-secondary-container/30 px-4 py-2 text-sm font-bold text-secondary" type="button" onClick={() => markAll.mutate()}>
          تحديد الكل كمقروء
        </button>
        <SectionTitle title="الأخيرة" icon={Bell} />
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn('rounded-[24px] bg-white p-5 shadow-md shadow-primary/5', !notification.isRead && 'border-r-4 border-r-secondary')}
            >
              <div className="flex items-start gap-4">
                <IconBubble icon={notification.type === 'PAYMENT' ? FileText : notification.type === 'VISITOR' ? KeyRound : Bell} />
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-on-surface-variant">{notification.createdAt.slice(0, 10)}</span>
                    {!notification.isRead && <span className="h-2.5 w-2.5 rounded-full bg-secondary" />}
                  </div>
                  <h2 className="mt-2 text-lg font-bold text-primary">{notification.title}</h2>
                  <p className="mt-1 leading-6 text-on-surface-variant">{notification.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </PageFrame>
  );
}
