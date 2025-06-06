"use client";

import React, { createContext, useContext, useEffect } from 'react';
import { useCarsStore } from '@/lib/store/cars-store';
import { getAllCars } from '@/lib/cars-api';

interface CarsProviderProps {
  children: React.ReactNode;
}

const CarsContext = createContext<null>(null);

export function CarsProvider({ children }: CarsProviderProps) {
  const { setAllCars, setLoading, setError, allCars } = useCarsStore();

  useEffect(() => {
    // Solo cargar los carros si no están ya cargados
    if (allCars.length === 0) {
      loadAllCars();
    }
  }, [allCars.length]);

  const loadAllCars = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚗 Cargando todos los vehículos desde el backend...');
      const cars = await getAllCars();
      
      console.log(`✅ ${cars.length} vehículos cargados exitosamente`);
      setAllCars(cars);
      
    } catch (error) {
      console.error('❌ Error al cargar vehículos:', error);
      setError('Error al cargar los vehículos. Por favor, recarga la página.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CarsContext.Provider value={null}>
      {children}
    </CarsContext.Provider>
  );
}

// Hook para usar el contexto (aunque no es necesario en este caso)
export const useCarsContext = () => {
  const context = useContext(CarsContext);
  return context;
};