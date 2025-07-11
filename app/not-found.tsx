'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="mb-8 text-lg">¡Ups! Página no encontrada.</p>
      <div className="flex gap-4">
        <button
          onClick={() => router.back()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Volver atrás
        </button>
        <button
          onClick={() => router.push('/')}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
        >
          Ir al inicio
        </button>
      </div>
    </div>
  );
}