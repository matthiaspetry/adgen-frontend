'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Dummy() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
        Dummy Dashboard
      </h1>
      <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
        You are now logged in!
      </p>
      <button
        onClick={handleLogout}
        className="mt-8 px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}