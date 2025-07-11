'use client';

import { notFound } from 'next/navigation';
import { useRouter } from 'next/navigation'; 

export default function CatchAllNotFound() {
  const router = useRouter();

  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold mb-4">404 - Ruta no encontrada</h1>
      <p className="mb-6">La página que buscas no existe.</p>
      
      {/* Botón para volver atrás */}
      <button
        onClick={() => router.back()} // ← Vuelve a la página anterior
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ← Volver atrás
      </button>

      {/* Opcional: Botón para ir al inicio */}
      <button
        onClick={() => router.push('/')} // ← Redirige al home
        className="ml-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Ir al inicio
      </button>
    </div>
  );
}