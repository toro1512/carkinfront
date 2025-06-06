export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  bodyType: string;
  image: string;
  images?: string[];
  isNew: boolean;
  transmission: string;
  engine: string;
  horsepower?: number;
  acceleration?: number;
  drive?: string;
  exteriorColor: string;
  interiorColor: string;
  fuelEconomy?: string;
  features?: string[];
  description: string;
}

// Función para generar múltiples imágenes para un carro
const generateCarImages = (baseId: number): string[] => {
  const imageIds = [
    1545743, 244206, 2127039, 3802510, 6894428, 
    1104768, 1231643, 3729464, 2676096, 170811
  ];
  
  return imageIds.map((id, index) => 
    `https://images.pexels.com/photos/${id + baseId * 10 + index}/pexels-photo-${id + baseId * 10 + index}.jpeg`
  );
};

// Datos de respaldo en caso de que el backend falle
const fallbackCars: Car[] = [
  {
    id: 1,
    make: "BMW",
    model: "M4 Competition",
    year: 2023,
    price: 84700,
    mileage: 0,
    fuelType: "Gasolina",
    bodyType: "Coupé",
    image: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg",
    images: generateCarImages(1),
    isNew: true,
    transmission: "Automática",
    engine: "3.0L Twin-Turbo Inline-6",
    horsepower: 503,
    acceleration: 3.8,
    drive: "Tracción integral",
    exteriorColor: "Blanco Alpino",
    interiorColor: "Negro/Rojo",
    fuelEconomy: "16 ciudad / 23 carretera",
    features: [
      "Paquete M Sport",
      "Paquete Premium",
      "Paquete Ejecutivo",
      "Acabado en Fibra de Carbono",
      "Sistema de Sonido Harman Kardon",
      "Apple CarPlay",
      "Asientos Calefaccionados",
      "Head-up Display",
      "Asistente de Estacionamiento Plus",
      "Asistente de Conducción Profesional",
    ],
    description: "El BMW M4 Competition combina un diseño impresionante con un rendimiento extraordinario, con un potente motor twin-turbo y manejo de precisión.",
  },
  {
    id: 2,
    make: "Mercedes-Benz",
    model: "Clase S",
    year: 2022,
    price: 109800,
    mileage: 12500,
    fuelType: "Híbrido",
    bodyType: "Sedán",
    image: "https://images.pexels.com/photos/6894428/pexels-photo-6894428.jpeg",
    images: generateCarImages(2),
    isNew: false,
    transmission: "Automática",
    engine: "3.0L Inline-6 + Motor Eléctrico",
    horsepower: 429,
    acceleration: 4.9,
    drive: "Tracción integral",
    exteriorColor: "Negro Obsidiana",
    interiorColor: "Beige Macchiato",
    fuelEconomy: "22 ciudad / 29 carretera",
    features: [
      "Paquete Premium",
      "Paquete Ejecutivo Asientos Traseros",
      "Sistema de Sonido Burmester 3D",
      "Navegación MBUX Realidad Aumentada",
      "Iluminación Ambiental Activa",
      "Asientos Delanteros Multicontorno con Masaje",
      "Control de Clima de Cuatro Zonas",
      "Head-up Display",
      "Dirección en Ruedas Traseras",
      "Paquete de Asistencia al Conductor",
    ],
    description: "El Mercedes-Benz Clase S representa la cúspide del lujo, comodidad y tecnología con su interior refinado y experiencia de conducción suave.",
  },
  {
    id: 3,
    make: "Audi",
    model: "e-tron GT",
    year: 2023,
    price: 102400,
    mileage: 5000,
    fuelType: "Eléctrico",
    bodyType: "Sedán",
    image: "https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg",
    images: generateCarImages(3),
    isNew: false,
    transmission: "Automática",
    engine: "Motores Eléctricos Duales",
    exteriorColor: "Gris Daytona",
    interiorColor: "Negro",
    description: "El Audi e-tron GT combina rendimiento eléctrico con usabilidad diaria, con tracción integral quattro y capacidad de carga rápida.",
  },
  {
    id: 4,
    make: "Porsche",
    model: "911 Carrera",
    year: 2023,
    price: 114000,
    mileage: 0,
    fuelType: "Gasolina",
    bodyType: "Coupé",
    image: "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg",
    images: generateCarImages(4),
    isNew: true,
    transmission: "PDK",
    engine: "3.0L Twin-Turbo Flat-6",
    exteriorColor: "Rojo Guards",
    interiorColor: "Negro",
    description: "El icónico Porsche 911 Carrera ofrece una experiencia de conducción emocionante con su diseño de motor trasero y dinámica de manejo precisa.",
  },
  {
    id: 5,
    make: "Tesla",
    model: "Model S",
    year: 2023,
    price: 89990,
    mileage: 0,
    fuelType: "Eléctrico",
    bodyType: "Sedán",
    image: "https://images.pexels.com/photos/13861/IMG_3496bfree.jpg",
    images: generateCarImages(5),
    isNew: true,
    transmission: "Automática",
    engine: "Motores Eléctricos Duales",
    exteriorColor: "Blanco Perla",
    interiorColor: "Negro",
    description: "El Tesla Model S redefine el vehículo eléctrico con tecnología de vanguardia, autonomía impresionante y capacidades de alto rendimiento.",
  },
  {
    id: 6,
    make: "Lexus",
    model: "RX 450h",
    year: 2022,
    price: 58400,
    mileage: 15000,
    fuelType: "Híbrido",
    bodyType: "SUV",
    image: "https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg",
    images: generateCarImages(6),
    isNew: false,
    transmission: "Automática",
    engine: "3.5L V6 + Motores Eléctricos",
    exteriorColor: "Gris Nebula Perla",
    interiorColor: "Pergamino",
    description: "El Lexus RX 450h combina lujo, eficiencia y versatilidad con su tren motriz híbrido y acabados interiores refinados.",
  },
  {
    id: 7,
    make: "Ford",
    model: "F-150 Lightning",
    year: 2023,
    price: 55974,
    mileage: 0,
    fuelType: "Eléctrico",
    bodyType: "Camioneta",
    image: "https://images.pexels.com/photos/2676096/pexels-photo-2676096.jpeg",
    images: generateCarImages(7),
    isNew: true,
    transmission: "Automática",
    engine: "Motores Eléctricos Duales",
    exteriorColor: "Azul Antimateria",
    interiorColor: "Negro",
    description: "El Ford F-150 Lightning trae energía eléctrica a la camioneta más vendida de América, con capacidad impresionante y características innovadoras.",
  },
  {
    id: 8,
    make: "Toyota",
    model: "Camry Híbrido",
    year: 2022,
    price: 33300,
    mileage: 18000,
    fuelType: "Híbrido",
    bodyType: "Sedán",
    image: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
    images: generateCarImages(8),
    isNew: false,
    transmission: "Automática",
    engine: "2.5L Inline-4 + Motor Eléctrico",
    exteriorColor: "Plata Celestial",
    interiorColor: "Ceniza",
    description: "El Toyota Camry Híbrido ofrece eficiencia excepcional sin comprometer la comodidad, confiabilidad o dinámica de conducción.",
  },
  {
    id: 9,
    make: "Volkswagen",
    model: "ID.4",
    year: 2023,
    price: 38995,
    mileage: 2500,
    fuelType: "Eléctrico",
    bodyType: "SUV",
    image: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg",
    images: generateCarImages(9),
    isNew: false,
    transmission: "Automática",
    engine: "Motor Eléctrico",
    exteriorColor: "Azul Dusk",
    interiorColor: "Gris",
    description: "El Volkswagen ID.4 es un SUV eléctrico espacioso y eficiente con tecnología avanzada y diseño moderno.",
  },
  {
    id: 10,
    make: "Honda",
    model: "Accord Híbrido",
    year: 2023,
    price: 36540,
    mileage: 8000,
    fuelType: "Híbrido",
    bodyType: "Sedán",
    image: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
    images: generateCarImages(10),
    isNew: false,
    transmission: "Automática",
    engine: "2.0L Inline-4 + Motor Eléctrico",
    exteriorColor: "Blanco Platino",
    interiorColor: "Negro",
    description: "El Honda Accord Híbrido combina eficiencia de combustible excepcional con un interior espacioso y tecnología avanzada.",
  },
  {
    id: 11,
    make: "Hyundai",
    model: "IONIQ 5",
    year: 2023,
    price: 44700,
    mileage: 1200,
    fuelType: "Eléctrico",
    bodyType: "SUV",
    image: "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg",
    images: generateCarImages(11),
    isNew: false,
    transmission: "Automática",
    engine: "Motor Eléctrico",
    exteriorColor: "Gris Cyber",
    interiorColor: "Beige",
    description: "El Hyundai IONIQ 5 es un SUV eléctrico futurista con carga ultrarrápida y un interior espacioso y versátil.",
  },
  {
    id: 12,
    make: "Kia",
    model: "EV6",
    year: 2023,
    price: 42115,
    mileage: 3500,
    fuelType: "Eléctrico",
    bodyType: "SUV",
    image: "https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg",
    images: generateCarImages(12),
    isNew: false,
    transmission: "Automática",
    engine: "Motor Eléctrico",
    exteriorColor: "Verde Gravity",
    interiorColor: "Negro",
    description: "El Kia EV6 ofrece un diseño audaz, tecnología de carga rápida y una experiencia de conducción emocionante.",
  },
  {
    id: 13,
    make: "Genesis",
    model: "GV70",
    year: 2023,
    price: 54500,
    mileage: 6800,
    fuelType: "Gasolina",
    bodyType: "SUV",
    image: "https://images.pexels.com/photos/6894428/pexels-photo-6894428.jpeg",
    images: generateCarImages(13),
    isNew: false,
    transmission: "Automática",
    engine: "2.5L Turbo Inline-4",
    exteriorColor: "Negro Obsidiana",
    interiorColor: "Marrón",
    description: "El Genesis GV70 combina lujo, rendimiento y tecnología avanzada en un SUV compacto elegante.",
  },
  {
    id: 14,
    make: "Cadillac",
    model: "Escalade",
    year: 2022,
    price: 78295,
    mileage: 22000,
    fuelType: "Gasolina",
    bodyType: "SUV",
    image: "https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg",
    images: generateCarImages(14),
    isNew: false,
    transmission: "Automática",
    engine: "6.2L V8",
    exteriorColor: "Blanco Cristal",
    interiorColor: "Negro",
    description: "El Cadillac Escalade es un SUV de lujo de tamaño completo con presencia imponente y tecnología de vanguardia.",
  },
  {
    id: 15,
    make: "Lincoln",
    model: "Navigator",
    year: 2023,
    price: 83265,
    mileage: 4500,
    fuelType: "Gasolina",
    bodyType: "SUV",
    image: "https://images.pexels.com/photos/2676096/pexels-photo-2676096.jpeg",
    images: generateCarImages(15),
    isNew: false,
    transmission: "Automática",
    engine: "3.5L Twin-Turbo V6",
    exteriorColor: "Azul Infinite",
    interiorColor: "Cappuccino",
    description: "El Lincoln Navigator ofrece lujo refinado, espacio generoso y capacidades de remolque impresionantes.",
  },
  {
    id: 16,
    make: "Infiniti",
    model: "QX80",
    year: 2022,
    price: 69050,
    mileage: 16500,
    fuelType: "Gasolina",
    bodyType: "SUV",
    image: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg",
    images: generateCarImages(16),
    isNew: false,
    transmission: "Automática",
    engine: "5.6L V8",
    exteriorColor: "Gris Graphite",
    interiorColor: "Almond",
    description: "El Infiniti QX80 es un SUV de lujo de tamaño completo con motor V8 potente y interior lujoso.",
  },
  {
    id: 17,
    make: "Acura",
    model: "MDX",
    year: 2023,
    price: 48550,
    mileage: 7200,
    fuelType: "Gasolina",
    bodyType: "SUV",
    image: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
    images: generateCarImages(17),
    isNew: false,
    transmission: "Automática",
    engine: "3.5L V6",
    exteriorColor: "Rojo Performance",
    interiorColor: "Ebony",
    description: "El Acura MDX combina rendimiento deportivo con practicidad familiar en un SUV de lujo de tres filas.",
  },
  {
    id: 18,
    make: "Volvo",
    model: "XC90",
    year: 2023,
    price: 56200,
    mileage: 3800,
    fuelType: "Híbrido",
    bodyType: "SUV",
    image: "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg",
    images: generateCarImages(18),
    isNew: false,
    transmission: "Automática",
    engine: "2.0L Turbo + Motor Eléctrico",
    exteriorColor: "Blanco Crystal",
    interiorColor: "Charcoal",
    description: "El Volvo XC90 es un SUV de lujo escandinavo con enfoque en seguridad, sostenibilidad y diseño elegante.",
  },
  {
    id: 19,
    make: "Jaguar",
    model: "F-PACE",
    year: 2022,
    price: 52400,
    mileage: 11200,
    fuelType: "Gasolina",
    bodyType: "SUV",
    image: "https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg",
    images: generateCarImages(19),
    isNew: false,
    transmission: "Automática",
    engine: "2.0L Turbo Inline-4",
    exteriorColor: "Azul Caesium",
    interiorColor: "Windsor Leather",
    description: "El Jaguar F-PACE combina el rendimiento deportivo de Jaguar con la practicidad de un SUV de lujo.",
  },
  {
    id: 20,
    make: "Land Rover",
    model: "Range Rover Sport",
    year: 2023,
    price: 83500,
    mileage: 2100,
    fuelType: "Gasolina",
    bodyType: "SUV",
    image: "https://images.pexels.com/photos/6894428/pexels-photo-6894428.jpeg",
    images: generateCarImages(20),
    isNew: false,
    transmission: "Automática",
    engine: "3.0L Inline-6 Mild Hybrid",
    exteriorColor: "Verde Byron",
    interiorColor: "Tan",
    description: "El Range Rover Sport ofrece capacidades todoterreno excepcionales con lujo refinado y tecnología avanzada.",
  },
];

// Función para simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Función para hacer petición al backend con reintentos
async function fetchAllCarsFromBackend(): Promise<Car[]> {
  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Intento ${attempt} de obtener todos los carros del backend...`);
      
      // Simular petición al backend (reemplazar con URL real)
      // const response = await fetch(`https://api.ejemplo.com/cars/all`);
      
      // Simular latencia de red
      await delay(1000);
      
      // Simular respuesta exitosa siempre (100% de probabilidad)
      if (true) {
        console.log('✅ Carros obtenidos exitosamente del backend');
        return fallbackCars;
      }
      
      // Simular error del backend (este código nunca se ejecutará)
      throw new Error(`Error del servidor: ${500 + Math.floor(Math.random() * 100)}`);
      
    } catch (error) {
      lastError = error as Error;
      console.error(`Intento ${attempt} falló:`, error);
      
      if (attempt < maxRetries) {
        console.log(`Reintentando en ${attempt * 1000}ms...`);
        await delay(attempt * 1000); // Backoff exponencial
      }
    }
  }

  // Si todos los intentos fallaron, usar datos de respaldo
  console.warn('Todos los intentos al backend fallaron, usando datos de respaldo');
  throw lastError || new Error('Error desconocido al conectar con el backend');
}

// Función principal para obtener todos los carros
export async function getAllCars(): Promise<Car[]> {
  try {
    return await fetchAllCarsFromBackend();
  } catch (error) {
    console.error('Error al obtener carros del backend, usando datos de respaldo:', error);
    return fallbackCars;
  }
}

// Función para obtener un carro específico por ID (ahora será manejado por el store)
export async function getCarById(id: string): Promise<Car | null> {
  // Esta función ahora es principalmente para compatibilidad
  // El store manejará la búsqueda por ID
  const car = fallbackCars.find(car => car.id.toString() === id);
  return car || null;
}