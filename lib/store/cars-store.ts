import { create } from 'zustand';
import { Car } from '@/lib/cars-api';

export interface FilterOptions {
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  bodyType?: string;
  fuelType?: string;
  searchTerm?: string;
}

interface CarsState {
  // Estado de los datos
  allCars: Car[];
  filteredCars: Car[];
  loading: boolean;
  error: string | null;
  
  // Estado de filtros
  filters: FilterOptions;
  
  // Estado de paginación
  currentPage: number;
  carsPerPage: number;
  
  // Estado de favoritos
  favorites: number[];
  
  // Acciones
  setAllCars: (cars: Car[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
  setCurrentPage: (page: number) => void;
  setCarsPerPage: (perPage: number) => void;
  toggleFavorite: (carId: number) => void;
  
  // Funciones computadas
  getPaginatedCars: () => Car[];
  getTotalPages: () => number;
  getCarById: (id: string) => Car | null;
  getFeaturedCars: () => Car[];
}

const applyFilters = (cars: Car[], filters: FilterOptions): Car[] => {
  return cars.filter(car => {
    // Filtro por marca
    if (filters.make && filters.make !== "Todas las Marcas" && car.make !== filters.make) {
      return false;
    }
    
    // Filtro por modelo (búsqueda parcial)
    if (filters.model && !car.model.toLowerCase().includes(filters.model.toLowerCase())) {
      return false;
    }
    
    // Filtro por año mínimo
    if (filters.minYear && car.year < filters.minYear) {
      return false;
    }
    
    // Filtro por año máximo
    if (filters.maxYear && car.year > filters.maxYear) {
      return false;
    }
    
    // Filtro por precio mínimo
    if (filters.minPrice && car.price < filters.minPrice) {
      return false;
    }
    
    // Filtro por precio máximo
    if (filters.maxPrice && car.price > filters.maxPrice) {
      return false;
    }
    
    // Filtro por tipo de carrocería
    if (filters.bodyType && filters.bodyType !== "Todos los Tipos" && car.bodyType !== filters.bodyType) {
      return false;
    }
    
    // Filtro por tipo de combustible
    if (filters.fuelType && filters.fuelType !== "Todos los Combustibles" && car.fuelType !== filters.fuelType) {
      return false;
    }
    
    // Filtro por término de búsqueda general
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const searchableText = `${car.make} ${car.model} ${car.bodyType} ${car.fuelType} ${car.description}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });
};

export const useCarsStore = create<CarsState>((set, get) => ({
  // Estado inicial
  allCars: [],
  filteredCars: [],
  loading: false,
  error: null,
  filters: {},
  currentPage: 1,
  carsPerPage: 5,
  favorites: [],
  
  // Acciones
  setAllCars: (cars) => {
    set((state) => {
      const filteredCars = applyFilters(cars, state.filters);
      return {
        allCars: cars,
        filteredCars,
        error: null,
      };
    });
  },
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setFilters: (newFilters) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filteredCars = applyFilters(state.allCars, updatedFilters);
      return {
        filters: updatedFilters,
        filteredCars,
        currentPage: 1, // Resetear a la primera página cuando se aplican filtros
      };
    });
  },
  
  clearFilters: () => {
    set((state) => ({
      filters: {},
      filteredCars: state.allCars,
      currentPage: 1,
    }));
  },
  
  setCurrentPage: (page) => set({ currentPage: page }),
  
  setCarsPerPage: (perPage) => {
    set((state) => ({
      carsPerPage: perPage,
      currentPage: 1, // Resetear a la primera página cuando cambia el número por página
    }));
  },
  
  toggleFavorite: (carId) => {
    set((state) => ({
      favorites: state.favorites.includes(carId)
        ? state.favorites.filter(id => id !== carId)
        : [...state.favorites, carId],
    }));
  },
  
  // Funciones computadas
  getPaginatedCars: () => {
    const state = get();
    const startIndex = (state.currentPage - 1) * state.carsPerPage;
    const endIndex = startIndex + state.carsPerPage;
    return state.filteredCars.slice(startIndex, endIndex);
  },
  
  getTotalPages: () => {
    const state = get();
    return Math.ceil(state.filteredCars.length / state.carsPerPage);
  },
  
  getCarById: (id) => {
    const state = get();
    return state.allCars.find(car => car.id.toString() === id) || null;
  },
  
  getFeaturedCars: () => {
    const state = get();
    // Retornar los primeros 4 carros nuevos, o los primeros 4 si no hay suficientes nuevos
    const newCars = state.allCars.filter(car => car.isNew);
    if (newCars.length >= 4) {
      return newCars.slice(0, 4);
    }
    return state.allCars.slice(0, 4);
  },
}));