import {Carro, BackendCar} from '@/types/carro'

export function transformBackendToFrontend(backendCars: BackendCar[]): Carro[] {
  return backendCars.map(backendCar => ({
    
    id: backendCar.placa, // Usamos la placa como ID único
    marca: backendCar.marca,
    modelo: backendCar.modelo,
    year: backendCar.year,
    precio: parseFloat(backendCar.precio),
    images: backendCar.imagenes.map(img => ({
      id: img.id.toString(),
      url: img.url_imagen
    })),
    // Campos adicionales que podrías necesitar
    placa: backendCar.placa,
    kilometraje: backendCar.kilometraje,
    categoria: backendCar.categoria,
    colorExterior: backendCar.colorExterior,
    isNew: backendCar.isNew === 1,
    serial_motor: backendCar.serial_motor,
    imagen: backendCar.imagen,
    serial_carroceria: backendCar.serial_carroceria,
  }));
}