import { Suspense, lazy } from 'react';
import HomePage from '@/pages/HomePage.jsx';

// The admin area is a separate chunk, only loaded when someone visits /admin by URL.
const AdminApp = lazy(() => import('@/features/admin/AdminApp.jsx'));

const isAdminPath = () => /^\/admin(\/|$)/.test(window.location.pathname);

export default function App() {
  if (isAdminPath()) {
    return (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    );
  }
  return <HomePage />;
}
