import { create } from 'zustand';
import { Auction, CreateAuctionData, UserCar, Bid } from '@/lib/types/auction';
import { auctionsAPI } from '@/lib/api/auctions';

interface AuctionsState {
  // Estado de datos
  userCars: UserCar[];
  userAuctions: Auction[];
  activeAuctions: Auction[];
  currentAuction: Auction | null;
  
  // Estados de carga
  loading: boolean;
  userCarsLoading: boolean;
  createAuctionLoading: boolean;
  placeBidLoading: boolean;
  
  // Errores
  error: string | null;
  userCarsError: string | null;
  createAuctionError: string | null;
  placeBidError: string | null;
  
  // Acciones
  loadUserCars: (userId: string) => Promise<void>;
  loadUserAuctions: (userId: string) => Promise<void>;
  loadActiveAuctions: () => Promise<void>;
  loadAuctionById: (auctionId: string) => Promise<void>;
  createAuction: (data: CreateAuctionData, userId: string) => Promise<Auction>;
  placeBid: (auctionId: string, amount: number, userId: string) => Promise<void>;
  clearErrors: () => void;
  clearCurrentAuction: () => void;
}

export const useAuctionsStore = create<AuctionsState>((set, get) => ({
  // Estado inicial
  userCars: [],
  userAuctions: [],
  activeAuctions: [],
  currentAuction: null,
  loading: false,
  userCarsLoading: false,
  createAuctionLoading: false,
  placeBidLoading: false,
  error: null,
  userCarsError: null,
  createAuctionError: null,
  placeBidError: null,

  // Cargar carros del usuario
  loadUserCars: async (userId: string) => {
    set({ userCarsLoading: true, userCarsError: null });
    
    try {
      const userCars = await auctionsAPI.getUserCars(userId);
      set({ 
        userCars, 
        userCarsLoading: false,
        userCarsError: null 
      });
      
      console.log(`✅ ${userCars.length} carros del usuario cargados`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar vehículos';
      set({ 
        userCars: [],
        userCarsLoading: false,
        userCarsError: errorMessage 
      });
      
      console.error('❌ Error al cargar carros del usuario:', error);
      throw error;
    }
  },

  // Cargar subastas del usuario
  loadUserAuctions: async (userId: string) => {
    set({ loading: true, error: null });
    
    try {
      const userAuctions = await auctionsAPI.getUserAuctions(userId);
      set({ 
        userAuctions, 
        loading: false,
        error: null 
      });
      
      console.log(`✅ ${userAuctions.length} subastas del usuario cargadas`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar subastas';
      set({ 
        userAuctions: [],
        loading: false,
        error: errorMessage 
      });
      
      console.error('❌ Error al cargar subastas del usuario:', error);
    }
  },

  // Cargar subastas activas
  loadActiveAuctions: async () => {
    set({ loading: true, error: null });
    
    try {
      const activeAuctions = await auctionsAPI.getActiveAuctions();
      set({ 
        activeAuctions, 
        loading: false,
        error: null 
      });
      
      console.log(`✅ ${activeAuctions.length} subastas activas cargadas`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar subastas activas';
      set({ 
        activeAuctions: [],
        loading: false,
        error: errorMessage 
      });
      
      console.error('❌ Error al cargar subastas activas:', error);
    }
  },

  // Cargar subasta por ID
  loadAuctionById: async (auctionId: string) => {
    set({ loading: true, error: null });
    
    try {
      const auction = await auctionsAPI.getAuctionById(auctionId);
      set({ 
        currentAuction: auction, 
        loading: false,
        error: null 
      });
      
      if (auction) {
        console.log(`✅ Subasta ${auctionId} cargada`);
      } else {
        console.log(`⚠️ Subasta ${auctionId} no encontrada`);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar subasta';
      set({ 
        currentAuction: null,
        loading: false,
        error: errorMessage 
      });
      
      console.error('❌ Error al cargar subasta:', error);
    }
  },

  // Crear nueva subasta
  createAuction: async (data: CreateAuctionData, userId: string) => {
    set({ createAuctionLoading: true, createAuctionError: null });
    
    try {
      const newAuction = await auctionsAPI.createAuction(data, userId);
      
      // Actualizar estado local
      const { userAuctions, userCars } = get();
      set({ 
        userAuctions: [newAuction, ...userAuctions],
        userCars: userCars.map(car => 
          car.id === data.carId 
            ? { ...car, isAvailableForAuction: false, currentAuctionId: newAuction.id }
            : car
        ),
        createAuctionLoading: false,
        createAuctionError: null 
      });
      
      console.log(`✅ Subasta creada exitosamente: ${newAuction.id}`);
      return newAuction;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear subasta';
      set({ 
        createAuctionLoading: false,
        createAuctionError: errorMessage 
      });
      
      console.error('❌ Error al crear subasta:', error);
      throw error;
    }
  },

  // Hacer una oferta
  placeBid: async (auctionId: string, amount: number, userId: string) => {
    set({ placeBidLoading: true, placeBidError: null });
    
    try {
      const newBid = await auctionsAPI.placeBid(auctionId, amount, userId);
      
      // Actualizar estado local
      const { activeAuctions, currentAuction } = get();
      
      // Actualizar en la lista de subastas activas
      const updatedActiveAuctions = activeAuctions.map(auction => {
        if (auction.id === auctionId) {
          return {
            ...auction,
            currentPrice: amount,
            bids: auction.bids.map(bid => ({ ...bid, isWinning: false })).concat(newBid),
            updatedAt: new Date().toISOString(),
          };
        }
        return auction;
      });
      
      // Actualizar subasta actual si coincide
      const updatedCurrentAuction = currentAuction?.id === auctionId 
        ? {
            ...currentAuction,
            currentPrice: amount,
            bids: currentAuction.bids.map(bid => ({ ...bid, isWinning: false })).concat(newBid),
            updatedAt: new Date().toISOString(),
          }
        : currentAuction;
      
      set({ 
        activeAuctions: updatedActiveAuctions,
        currentAuction: updatedCurrentAuction,
        placeBidLoading: false,
        placeBidError: null 
      });
      
      console.log(`✅ Oferta de $${amount.toLocaleString()} realizada en subasta ${auctionId}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al realizar oferta';
      set({ 
        placeBidLoading: false,
        placeBidError: errorMessage 
      });
      
      console.error('❌ Error al realizar oferta:', error);
      throw error;
    }
  },

  // Limpiar errores
  clearErrors: () => {
    set({ 
      error: null,
      userCarsError: null,
      createAuctionError: null,
      placeBidError: null 
    });
  },

  // Limpiar subasta actual
  clearCurrentAuction: () => {
    set({ currentAuction: null });
  },
}));