'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dummy() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [backendMessage, setBackendMessage] = useState(null);

  useEffect(() => {
    async function checkSessionAndCallAPI() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');  // Redirect if not logged in
      } else {
        console.log('Session:', session);
        console.log('Access Token:', session.access_token);
        console.log('User ID:', session.user.id);
        await callProtectedEndpoint(session.access_token); // Correct
        setLoading(false);  // Allow dashboard to render
      }
    }

    async function callProtectedEndpoint(token) {
      try {
        const res = await fetch('http://127.0.0.1:5000/protected', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setBackendMessage(data.message);
        } else {
          setBackendMessage(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error('API call failed', error);
        setBackendMessage('API call failed.');
      }
    }

    checkSessionAndCallAPI();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
        Dummy Dashboard
      </h1>
      <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
        You are now logged in!
      </p>
      {backendMessage && (
        <div className="mt-6 text-md text-green-600 dark:text-green-400">
          {backendMessage}
        </div>
      )}
      <button
        onClick={handleLogout}
        className="mt-8 px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
