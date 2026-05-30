import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <main className="ml-64 pt-20">
        <div className="p-6">
          <h1 className="text-3xl font-bold">
            Dashboard Admin
          </h1>
        </div>
      </main>
    </ProtectedRoute>
  );
}