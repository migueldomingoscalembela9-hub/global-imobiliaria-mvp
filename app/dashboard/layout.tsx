import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { isAdmin } from '@/lib/permissions';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  if (isAdmin(user.role)) {
    redirect('/admin');
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar role={user.role} userName={user.name} />
      <main className="flex-1 overflow-y-auto">
        <div className="container-page py-8">{children}</div>
      </main>
    </div>
  );
}