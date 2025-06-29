'use client';

import { useCarsStore } from '@/lib/store/cars-store';
import { useEffect } from 'react';

export default function CarsProvider({ children }: { children: React.ReactNode }) {
  const { fetchCars } = useCarsStore();

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return <>{children}</>;
}