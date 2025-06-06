import Cookies from 'js-cookie';
import { DecodedToken } from '@/lib/types/auth';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

// Función para decodificar JWT (versión simplificada)
export function decodeToken(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// Función para verificar si el token ha expirado
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
}

// Funciones para manejar cookies
export const cookieUtils = {
  setToken: (token: string, rememberMe: boolean = false) => {
    const options = {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      expires: rememberMe ? 30 : undefined, // 30 días si "recordarme" está activado
    };
    
    Cookies.set(TOKEN_KEY, token, options);
  },

  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_KEY);
  },

  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
  },

  setRefreshToken: (refreshToken: string, rememberMe: boolean = false) => {
    const options = {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      expires: rememberMe ? 30 : undefined,
    };
    
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, options);
  },

  getRefreshToken: (): string | undefined => {
    return Cookies.get(REFRESH_TOKEN_KEY);
  },

  removeRefreshToken: () => {
    Cookies.remove(REFRESH_TOKEN_KEY);
  },

  setUserData: (userData: string, rememberMe: boolean = false) => {
    const options = {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      expires: rememberMe ? 30 : undefined,
    };
    
    Cookies.set(USER_KEY, userData, options);
  },

  getUserData: (): string | undefined => {
    return Cookies.get(USER_KEY);
  },

  removeUserData: () => {
    Cookies.remove(USER_KEY);
  },

  clearAll: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    Cookies.remove(USER_KEY);
  },
};

// Función para obtener headers de autorización
export function getAuthHeaders(): Record<string, string> {
  const token = cookieUtils.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}