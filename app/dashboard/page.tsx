import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/app/components/custom/logout-button';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt');

  if (!token) {
    redirect('/login'); // Or wherever your login route is
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div>Protected Dashboard Content</div>
      <LogoutButton />
    </div>
  );
}
