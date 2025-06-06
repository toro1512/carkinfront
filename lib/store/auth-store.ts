import { create } from 'zustand';
import { User, LoginCredentials, RegisterData, UserRole } from '@/lib/types/auth';
import { authAPI } from '@/lib/api/auth';
import { cookieUtils, isTokenExpired, decodeToken } from '@/lib/utils/auth';

interface AuthState {
  // Estado de autenticación
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => void;
  
  // Funciones de utilidad
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdmin: () => boolean;
  isDealer: () => boolean;
  isCustomer: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Estado inicial
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Iniciar sesión
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authAPI.login(credentials);
      
      // Guardar en cookies
      cookieUtils.setToken(response.token, credentials.rememberMe);
      cookieUtils.setRefreshToken(response.refreshToken, credentials.rememberMe);
      cookieUtils.setUserData(JSON.stringify(response.user), credentials.rememberMe);
      
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      console.log(`✅ Usuario ${response.user.email} autenticado como ${response.user.role}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  // Registrarse
  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authAPI.register(data);
      
      // Guardar en cookies
      cookieUtils.setToken(response.token, false); // No recordar por defecto en registro
      cookieUtils.setRefreshToken(response.refreshToken, false);
      cookieUtils.setUserData(JSON.stringify(response.user), false);
      
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      console.log(`✅ Usuario ${response.user.email} registrado exitosamente`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrarse';
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  // Cerrar sesión
  logout: async () => {
    set({ isLoading: true });
    
    try {
      await authAPI.logout();
      
      // Limpiar cookies
      cookieUtils.clearAll();
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
      console.log('✅ Sesión cerrada exitosamente');
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      
      // Limpiar estado local incluso si hay error
      cookieUtils.clearAll();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  // Refrescar token
  refreshToken: async () => {
    const refreshToken = cookieUtils.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No hay token de actualización disponible');
    }
    
    try {
      const response = await authAPI.refreshToken(refreshToken);
      
      // Actualizar cookies
      cookieUtils.setToken(response.token);
      cookieUtils.setRefreshToken(response.refreshToken);
      cookieUtils.setUserData(JSON.stringify(response.user));
      
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        error: null,
      });
      
      console.log('✅ Token actualizado exitosamente');
      
    } catch (error) {
      console.error('Error al refrescar token:', error);
      
      // Si falla el refresh, cerrar sesión
      get().logout();
      throw error;
    }
  },

  // Limpiar error
  clearError: () => {
    set({ error: null });
  },

  // Inicializar autenticación desde cookies
  initializeAuth: () => {
    const token = cookieUtils.getToken();
    const userDataString = cookieUtils.getUserData();
    
    if (token && userDataString) {
      try {
        // Verificar si el token ha expirado
        if (isTokenExpired(token)) {
          console.log('Token expirado, intentando refrescar...');
          get().refreshToken().catch(() => {
            console.log('No se pudo refrescar el token, cerrando sesión...');
            cookieUtils.clearAll();
          });
          return;
        }
        
        const userData = JSON.parse(userDataString);
        
        set({
          user: userData,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        
        console.log(`✅ Sesión restaurada para ${userData.email}`);
        
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        cookieUtils.clearAll();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } else {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  // Funciones de utilidad para roles
  hasRole: (role: UserRole) => {
    const { user } = get();
    return user?.role === role;
  },

  hasAnyRole: (roles: UserRole[]) => {
    const { user } = get();
    return user ? roles.includes(user.role) : false;
  },

  isAdmin: () => {
    return get().hasRole('admin');
  },

  isDealer: () => {
    return get().hasRole('dealer');
  },

  isCustomer: () => {
    return get().hasRole('customer');
  },
}));