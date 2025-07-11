"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
//IMPORTACIONES DE LA CAMARA
import { PhotoTemplate, CapturedPhoto } from '@/types/camara';
import { PHOTO_TEMPLATES } from '@/constants/constantes';
import PhotoSlot from '@/components/camara/PhotoSlot';
import CameraModal from '@/components/camara/CameraModal';
// FIN CAMARA 
import Image from 'next/image';
import { 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  X,
  RotateCcw,
  Car,
  Search,
  Shield,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VehicleData {
  plate: string;
  make: string;
  model: string;
  year: number;
  color: string;
  vin: string;
  engine: string;
  transmission: string;
  fuelType: string;
  mileage: number;
}

function UploadCarContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [plateLoading, setPlateLoading] = useState(false);
  // manejo camara 
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [currentTemplateForCapture, setCurrentTemplateForCapture] = useState<PhotoTemplate | null>(null);
  const [allMandatoryDone, setAllMandatoryDone] = useState(false);
  const mandatoryTemplatesCount = PHOTO_TEMPLATES.filter(t => t.required).length;

    ///////////////////// MANEJO Y LOGICA DAMARA//////////////////////////////////////////////////
useEffect(() => {
    const takenMandatoryPhotos = capturedPhotos.filter(p => 
      PHOTO_TEMPLATES.some(mt => mt.id === p.templateId && mt.required)
    );
    setAllMandatoryDone(takenMandatoryPhotos.length === mandatoryTemplatesCount);
  }, [capturedPhotos, mandatoryTemplatesCount]);

  const handleOpenCapture = useCallback((template: PhotoTemplate) => {
    setCurrentTemplateForCapture(template);
    setIsCameraModalOpen(true);
  }, []);

  const handleCloseCaptureModal = useCallback(() => {
    setIsCameraModalOpen(false);
    setCurrentTemplateForCapture(null);
  }, []);

  const handlePhotoCaptured = useCallback((dataUrl: string) => {
    if (currentTemplateForCapture) {
      setCapturedPhotos(prevPhotos => {
        const existingPhotoIndex = prevPhotos.findIndex(p => p.templateId === currentTemplateForCapture.id);
        if (existingPhotoIndex > -1) {
          const updatedPhotos = [...prevPhotos];
          updatedPhotos[existingPhotoIndex] = { templateId: currentTemplateForCapture.id, imageUrl: dataUrl };
          return updatedPhotos;
        }
        return [...prevPhotos, { templateId: currentTemplateForCapture.id, imageUrl: dataUrl }];
      });
    }
    handleCloseCaptureModal();
  }, [currentTemplateForCapture, handleCloseCaptureModal]);

  const handleDeletePhoto = useCallback((templateId: number) => {
    setCapturedPhotos(prevPhotos => prevPhotos.filter(p => p.templateId !== templateId));
  }, []);
  

  // ///////////////////////////////////////////////////////////////////////////////////////////
  // Estado del formulario
  const [formData, setFormData] = useState({
    plate: '',
    price: '',
    description: '',
    condition: '',
    bodyType: '',
    location: ''
  });


  // Datos del vehículo obtenidos por placa
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  
  // Simular llamada a API para obtener datos del vehículo por placa
  const fetchVehicleData = async (plate: string): Promise<VehicleData> => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Datos simulados basados en la placa
    return {
      plate: plate.toUpperCase(),
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      color: 'Blanco',
      vin: 'JTDKN3DU5L5123456',
      engine: '2.5L 4-Cylinder',
      transmission: 'Automática',
      fuelType: 'Gasolina',
      mileage: 45000
    };
  };

  const handlePlateSearch = async () => {
    if (!formData.plate.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa una placa válida",
        variant: "destructive"
      });
      return;
    }

    setPlateLoading(true);
    try {
      const data = await fetchVehicleData(formData.plate);
      setVehicleData(data);
      toast({
        title: "¡Datos encontrados!",
        description: "Se han cargado los datos del vehículo automáticamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron obtener los datos del vehículo. Verifica la placa.",
        variant: "destructive"
      });
    } finally {
      setPlateLoading(false);
    }
  };
  // Validar si el formulario está completo
  const isFormValid = () => {
    const requiredFields = [
      formData.plate,
      formData.price,
      formData.description,
      formData.condition,
      formData.bodyType,
      formData.location
    ];
    
    const allFieldsFilled = requiredFields.every(field => field.trim() !== '');
    const vehicleDataExists = vehicleData !== null;
   /*
     crear variable para foto completas y revisar... esta pendiente de la validacion
   
   ojoooooooooooooooooooooooooooooooooooooooooooooooooooooo
   
   */
    return allFieldsFilled && vehicleDataExists ;
  };

  // Preparar datos para envío
  const prepareFormDataForUpload = () => {
    const uploadData = new FormData();
    
    // Datos del formulario
    uploadData.append('plate', formData.plate);
    uploadData.append('price', formData.price);
    uploadData.append('description', formData.description);
    uploadData.append('condition', formData.condition);
    uploadData.append('bodyType', formData.bodyType);
    uploadData.append('location', formData.location);
    
    // Datos del vehículo
    if (vehicleData) {
      uploadData.append('vehicleData', JSON.stringify(vehicleData));
    }
    /*
    pendienteeeeeeee para agregar y subir las fotos en formato correcto


    // Convertir fotos base64 a blobs y agregarlas
    Object.entries(capturedPhotos).forEach(([photoId, dataUrl]) => {
      // Convertir base64 a blob
      const byteCharacters = atob(dataUrl.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      
      uploadData.append(`photo_${photoId}`, blob, `${photoId}.jpg`);
    });*/
    
    return uploadData;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast({
        title: "Formulario incompleto",
        description: "Por favor completa todos los campos y toma todas las fotos requeridas",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const uploadData = prepareFormDataForUpload();
      
      // Aquí harías la llamada real a tu API
      // const response = await fetch('/api/upload-car', {
      //   method: 'POST',
      //   body: uploadData
      // });
      
      // Simular upload
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "¡Auto subido exitosamente!",
        description: "Tu vehículo ha sido publicado y está siendo revisado"
      });
      
      router.push('/catalog');
      
    } catch (error) {
      toast({
        title: "Error al subir",
        description: "Hubo un problema al subir tu vehículo. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

   const mandatoryPhotosTakenCount = capturedPhotos.filter(p => PHOTO_TEMPLATES.find(t => t.id === p.templateId && t.required)).length;
  return (
    <div className="container py-8 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Subir Mi Auto</h1>
        <p className="text-muted-foreground">
          Completa la información de tu vehículo y toma las fotos requeridas para publicarlo
        </p>
      </div>

      <div className="space-y-8">
        {/* Sección 1: Búsqueda por Placa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Información del Vehículo
            </CardTitle>
            <CardDescription>
              Ingresa la placa de tu vehículo para obtener los datos automáticamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="plate">Placa del Vehículo</Label>
                <Input
                  id="plate"
                  placeholder="ABC-123"
                  value={formData.plate}
                  onChange={(e) => setFormData(prev => ({ ...prev, plate: e.target.value.toUpperCase() }))}
                  className="uppercase"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handlePlateSearch}
                  disabled={plateLoading || !formData.plate.trim()}
                >
                  {plateLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Buscar
                </Button>
              </div>
            </div>

            {/* Datos del vehículo (solo lectura) */}
            {vehicleData && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">Datos del Vehículo Encontrados</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Marca</Label>
                    <p className="font-medium">{vehicleData.make}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Modelo</Label>
                    <p className="font-medium">{vehicleData.model}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Año</Label>
                    <p className="font-medium">{vehicleData.year}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Color</Label>
                    <p className="font-medium">{vehicleData.color}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Motor</Label>
                    <p className="font-medium">{vehicleData.engine}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Transmisión</Label>
                    <p className="font-medium">{vehicleData.transmission}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Combustible</Label>
                    <p className="font-medium">{vehicleData.fuelType}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Kilometraje</Label>
                    <p className="font-medium">{vehicleData.mileage.toLocaleString()} km</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">VIN</Label>
                    <p className="font-medium text-xs">{vehicleData.vin}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sección 2: Información Adicional */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Venta</CardTitle>
            <CardDescription>
              Completa los detalles adicionales para tu publicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Precio (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="25000"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="condition">Condición</Label>
                <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar condición" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Nuevo</SelectItem>
                    <SelectItem value="excellent">Excelente</SelectItem>
                    <SelectItem value="good">Bueno</SelectItem>
                    <SelectItem value="fair">Regular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bodyType">Tipo de Carrocería</Label>
                <Select value={formData.bodyType} onValueChange={(value) => setFormData(prev => ({ ...prev, bodyType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">Sedán</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="coupe">Coupé</SelectItem>
                    <SelectItem value="hatchback">Hatchback</SelectItem>
                    <SelectItem value="truck">Camioneta</SelectItem>
                    <SelectItem value="convertible">Convertible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  placeholder="Ciudad, Estado"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe tu vehículo, menciona características especiales, mantenimiento, etc."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sección 3: Captura de Fotos */}
         <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Fotos del Vehículo
                    </CardTitle>
                    <CardDescription>
                      Toma {mandatoryTemplatesCount} fotos siguiendo las guías. Progreso: {mandatoryPhotosTakenCount}/{mandatoryTemplatesCount}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progreso de fotos</span>
                <span>{mandatoryPhotosTakenCount}/{mandatoryTemplatesCount}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300 mb-2" 
                  style={{ width: `${(mandatoryPhotosTakenCount/mandatoryTemplatesCount) * 100}%` }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PHOTO_TEMPLATES.map(template => {
            const capturedPhoto = capturedPhotos.find(p => p.templateId === template.id);
            return (
              <PhotoSlot
                key={template.id}
                template={template}
                capturedPhoto={capturedPhoto}
                onCapture={handleOpenCapture}
                onDelete={handleDeletePhoto}
                onRetake={handleOpenCapture} // Retake uses the same capture flow
              />
            );
          })}
        </div>

        {currentTemplateForCapture && (
          <CameraModal
            isOpen={isCameraModalOpen}
            onClose={handleCloseCaptureModal}
            onCapture={handlePhotoCaptured}
            template={currentTemplateForCapture}
          />
        )}
            </div>
                  </CardContent>
          </Card>
        
        {/* Botón de envío */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-center">
                <h3 className="font-semibold mb-2">¿Listo para publicar?</h3>
                <p className="text-sm text-muted-foreground">
                  Verifica que toda la información esté completa antes de subir tu vehículo
                </p>
              </div>
              
              {/* Checklist de validación */}
              <div className="w-full max-w-md space-y-2">
                <div className={cn("flex items-center gap-2 text-sm", vehicleData ? "text-green-600" : "text-muted-foreground")}>
                  {vehicleData ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  Datos del vehículo obtenidos
                </div>
                <div className={cn("flex items-center gap-2 text-sm", 
                  Object.values(formData).every(v => v.trim()) ? "text-green-600" : "text-muted-foreground"
                )}>
                  {Object.values(formData).every(v => v.trim()) ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  Información de venta completa
                </div>
                <div className={cn("flex items-center gap-2 text-sm", "text-muted-foreground"
                )}>
                  {<CheckCircle className="h-4 w-4" />}
                  Todas las fotos capturadas ({}/{})
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!isFormValid() || isLoading}
                size="lg"
                className="w-full max-w-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Subiendo Vehículo...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Mi Auto
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Canvas oculto para captura de fotos */}
      <canvas className="hidden" />
    </div>
  );
}

export default function UploadCarPage() {
  return (
    <ProtectedRoute requiredRoles={['Administrador', 'Usuario', 'Taller', 'SinRegistro']}>
      <UploadCarContent />
    </ProtectedRoute>
  );
}