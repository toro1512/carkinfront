import { LoginCredentials, RegisterData, AuthResponse, User } from '@/lib/types/auth';

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Datos de usuarios simulados
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@autoelite.com',
    firstName: 'Carlos',
    lastName: 'Administrador',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'dealer@autoelite.com',
    firstName: 'María',
    lastName: 'Vendedora',
    role: 'dealer',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'cliente@ejemplo.com',
    firstName: 'Juan',
    lastName: 'Cliente',
    role: 'customer',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2024-02-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
  },
];

// Función para generar un JWT simulado
function generateMockJWT(user: User): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 horas
  }));
  const signature = btoa('mock-signature');
  
  return `${header}.${payload}.${signature}`;
}

// Función para generar refresh token simulado
function generateMockRefreshToken(): string {
  return btoa(`refresh-${Date.now()}-${Math.random()}`);
}

// API de autenticación simulada
export const authAPI = {
  // Iniciar sesión
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(1500); // Simular latencia de red
    
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    // Simular validación de contraseña
    // En una app real, esto se haría en el backend de forma segura
    const validPasswords: Record<string, string> = {
      'admin@autoelite.com': 'admin123',
      'dealer@autoelite.com': 'dealer123',
      'cliente@ejemplo.com': 'cliente123',
    };
    
    if (validPasswords[user.email] !== credentials.password) {
      throw new Error('Contraseña incorrecta');
    }
    
    // Actualizar último login
    user.lastLogin = new Date().toISOString();
    
    const token = generateMockJWT(user);
    const refreshToken = generateMockRefreshToken();
    
    return {
      user,
      token,
      refreshToken,
      expiresIn: 24 * 60 * 60, // 24 horas en segundos
    };
  },

  // Registrarse
  register: async (data: RegisterData): Promise<AuthResponse> => {
    await delay(2000); // Simular latencia de red
    
    // Verificar si el email ya existe
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('Ya existe una cuenta con este correo electrónico');
    }
    
    // Crear nuevo usuario
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'customer', // Los nuevos usuarios son clientes por defecto
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    
    // Agregar a la lista de usuarios simulados
    mockUsers.push(newUser);
    
    const token = generateMockJWT(newUser);
    const refreshToken = generateMockRefreshToken();
    
    return {
      user: newUser,
      token,
      refreshToken,
      expiresIn: 24 * 60 * 60,
    };
  },

  // Refrescar token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    await delay(500);
    
    // En una app real, validarías el refresh token en el backend
    // Por ahora, simulamos que siempre es válido
    const userId = '1'; // Simular obtener ID del refresh token
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('Token de actualización inválido');
    }
    
    const newToken = generateMockJWT(user);
    const newRefreshToken = generateMockRefreshToken();
    
    return {
      user,
      token: newToken,
      refreshToken: newRefreshToken,
      expiresIn: 24 * 60 * 60,
    };
  },

  // Cerrar sesión
  logout: async (): Promise<void> => {
    await delay(500);
    // En una app real, invalidarías el token en el backend
    console.log('Sesión cerrada exitosamente');
  },

  // Obtener perfil del usuario
  getProfile: async (token: string): Promise<User> => {
    await delay(500);
    
    // Simular obtener usuario del token
    const userId = '1'; // En una app real, extraerías esto del token
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return user;
  },
};