import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Calendar,
  Fuel,
  Gauge,
  ArrowLeft,
  Car,
  Cog,
  ShieldCheck,
  Share2,
  Printer,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CarGallery } from "@/components/car-gallery";
import { CarDetailsProvider } from "@/components/providers/car-details-provider";

// Generar parámetros estáticos para las rutas
export async function generateStaticParams(): Promise<{ id: string }[]> {
  // En una aplicación real, obtendrías todos los IDs de carros disponibles
  // Por ahora, generamos IDs del 1 al 20 basado en nuestros datos de respaldo
  return Array.from({ length: 20 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

interface CarDetailsPageProps {
  params: { id: string };
}

export default function CarDetailsPage({ params }: CarDetailsPageProps) {
  return (
    <CarDetailsProvider carId={params.id}>
      <CarDetailsContent carId={params.id} />
    </CarDetailsProvider>
  );
}

function CarDetailsContent({ carId }: { carId: string }) {
  // Este componente será envuelto por el provider que maneja el estado
  return <CarDetailsView carId={carId} />;
}

function CarDetailsView({ carId }: { carId: string }) {
  // Simular obtención del carro desde el store global
  // En una implementación real, usarías el store de Zustand aquí
  const car = {
    id: parseInt(carId),
    make: "BMW",
    model: "M4 Competition",
    year: 2023,
    price: 84700,
    mileage: 0,
    fuelType: "Gasolina",
    bodyType: "Coupé",
    image: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg",
    images: [
      "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg",
      "https://images.pexels.com/photos/1555753/pexels-photo-1555753.jpeg",
      "https://images.pexels.com/photos/1565749/pexels-photo-1565749.jpeg",
      "https://images.pexels.com/photos/1575759/pexels-photo-1575759.jpeg",
      "https://images.pexels.com/photos/1585769/pexels-photo-1585769.jpeg",
      "https://images.pexels.com/photos/1595779/pexels-photo-1595779.jpeg",
      "https://images.pexels.com/photos/1605789/pexels-photo-1605789.jpeg",
      "https://images.pexels.com/photos/1615799/pexels-photo-1615799.jpeg",
      "https://images.pexels.com/photos/1625809/pexels-photo-1625809.jpeg",
      "https://images.pexels.com/photos/1635819/pexels-photo-1635819.jpeg",
    ],
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
  };
  
  if (!car) {
    return (
      <div className="container py-8 px-4 md:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vehículo no encontrado</h1>
          <p className="text-muted-foreground mb-6">
            El vehículo que buscas no existe o ha sido removido.
          </p>
          <Button asChild>
            <Link href="/catalog">Volver al Catálogo</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8 px-4 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/catalog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Catálogo
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">
            {car.year} {car.make} {car.model}
          </h1>
          <p className="text-muted-foreground">{car.bodyType} • Stock #A{carId}12345</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Galería de Imágenes del Carro */}
      <div className="mb-10">
        <CarGallery
          images={car.images}
          carName={`${car.make} ${car.model}`}
          isNew={car.isNew}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda - Detalles del Carro */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">
                ${car.price.toLocaleString()}
              </h2>
              <Button size="lg" className="mt-4 sm:mt-0">Contactar Distribuidor</Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 text-sm mb-6">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Año</span>
                <div className="flex items-center gap-1 font-medium">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{car.year}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Kilometraje</span>
                <div className="flex items-center gap-1 font-medium">
                  <Gauge className="h-4 w-4 text-primary" />
                  <span>{car.mileage.toLocaleString()} km</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Tipo de Combustible</span>
                <div className="flex items-center gap-1 font-medium">
                  <Fuel className="h-4 w-4 text-primary" />
                  <span>{car.fuelType}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Transmisión</span>
                <div className="flex items-center gap-1 font-medium">
                  <Cog className="h-4 w-4 text-primary" />
                  <span>{car.transmission}</span>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="specs">Especificaciones</TabsTrigger>
                <TabsTrigger value="features">Características</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Descripción</h3>
                  <p className="text-muted-foreground">{car.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Destacados</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <span>Historial de servicio completo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <span>Sin historial de accidentes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <span>Un propietario anterior</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <span>Garantía del fabricante</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="specs" className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Motor y Rendimiento</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Motor</p>
                      <p className="font-medium">{car.engine}</p>
                    </div>
                    {car.horsepower && (
                      <div>
                        <p className="text-sm text-muted-foreground">Caballos de Fuerza</p>
                        <p className="font-medium">{car.horsepower} hp</p>
                      </div>
                    )}
                    {car.acceleration && (
                      <div>
                        <p className="text-sm text-muted-foreground">0-100 km/h</p>
                        <p className="font-medium">{car.acceleration} seg</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Transmisión</p>
                      <p className="font-medium">{car.transmission}</p>
                    </div>
                    {car.drive && (
                      <div>
                        <p className="text-sm text-muted-foreground">Tracción</p>
                        <p className="font-medium">{car.drive}</p>
                      </div>
                    )}
                    {car.fuelEconomy && (
                      <div>
                        <p className="text-sm text-muted-foreground">Economía de Combustible</p>
                        <p className="font-medium">{car.fuelEconomy}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Colores y Apariencia</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Color Exterior</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-5 h-5 rounded-full bg-neutral-100 border"></div>
                        <p className="font-medium">{car.exteriorColor}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Color Interior</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-5 h-5 rounded-full bg-neutral-900"></div>
                        <p className="font-medium">{car.interiorColor}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features">
                <h3 className="font-semibold text-lg mb-3">Características Principales</h3>
                {car.features && car.features.length > 0 ? (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    {car.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No hay características específicas disponibles para este vehículo.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Columna Derecha - Contacto y Carros Similares */}
        <div>
          <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">¿Interesado en este auto?</h3>
            <Button className="w-full mb-4">Agendar Prueba de Manejo</Button>
            <Button variant="outline" className="w-full">Solicitar Más Información</Button>
            <div className="mt-4 text-center">
              <p className="text-muted-foreground text-sm">
                O llámanos al <span className="text-foreground font-medium">+52 (55) 5123-4567</span>
              </p>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4">Vehículos Similares</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Link href={`/catalog/${i}`} key={i} className="block">
                  <div className="flex gap-3 hover:bg-muted/50 p-2 rounded-md transition-colors">
                    <div className="relative h-16 w-24 rounded overflow-hidden">
                      <img
                        src={`https://images.pexels.com/photos/${1545743 + i * 100}/pexels-photo-${1545743 + i * 100}.jpeg`}
                        alt="Auto similar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-sm">BMW M3 Competition</h4>
                      <p className="text-sm text-muted-foreground">2023 • 0 km</p>
                      <p className="font-semibold text-sm">$82,500</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}