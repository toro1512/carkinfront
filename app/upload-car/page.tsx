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

interface PhotoGuide {
  id: string;
  title: string;
  description: string;
  referenceImage: string;
  required: boolean;
}

const photoGuides: PhotoGuide[] = [
  {
    id: 'front',
    title: 'Vista Frontal',
    description: 'Toma la foto desde el frente del vehículo, asegúrate de capturar toda la parte delantera',
    referenceImage: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
    required: true
  },
  {
    id: 'rear',
    title: 'Vista Trasera',
    description: 'Fotografía la parte trasera completa del vehículo',
    referenceImage: 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg',
    required: true
  },
  {
    id: 'left-side',
    title: 'Lado Izquierdo',
    description: 'Captura el perfil izquierdo completo del vehículo',
    referenceImage: 'https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg',
    required: true
  },
  {
    id: 'right-side',
    title: 'Lado Derecho',
    description: 'Fotografía el perfil derecho completo del vehículo',
    referenceImage: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
    required: true
  },
  {
    id: 'interior-front',
    title: 'Interior Delantero',
    description: 'Toma una foto del tablero y asientos delanteros',
    referenceImage: 'https://images.pexels.com/photos/6894428/pexels-photo-6894428.jpeg',
    required: true
  },
  {
    id: 'interior-rear',
    title: 'Interior Trasero',
    description: 'Fotografía los asientos traseros y espacio interior',
    referenceImage: 'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg',
    required: true
  },
  {
    id: 'engine',
    title: 'Motor',
    description: 'Abre el capó y fotografía el motor',
    referenceImage: 'https://images.pexels.com/photos/1231643/pexels-photo-1231643.jpeg',
    required: true
  },
  {
    id: 'trunk',
    title: 'Maletero/Cajuela',
    description: 'Abre y fotografía el espacio de carga',
    referenceImage: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg',
    required: true
  },
  {
    id: 'wheels',
    title: 'Ruedas/Llantas',
    description: 'Toma una foto cercana de las ruedas y llantas',
    referenceImage: 'https://images.pexels.com/photos/2676096/pexels-photo-2676096.jpeg',
    required: true
  },
  {
    id: 'dashboard',
    title: 'Tablero/Odómetro',
    description: 'Fotografía el tablero mostrando el kilometraje',
    referenceImage: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
    required: true
  }
];

function UploadCarContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [plateLoading, setPlateLoading] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt' | 'checking'>('checking');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
  
  // Fotos capturadas
  const [capturedPhotos, setCapturedPhotos] = useState<{ [key: string]: string }>({});

  // Verificar permisos de cámara al cargar el componente
  useEffect(() => {
    checkCameraPermissions();
  }, []);

  const checkCameraPermissions = async () => {
    try {
      // Verificar si la API de permisos está disponible
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setCameraPermission(permission.state as 'granted' | 'denied' | 'prompt');
        
        // Escuchar cambios en los permisos
        permission.onchange = () => {
          setCameraPermission(permission.state as 'granted' | 'denied' | 'prompt');
        };
      } else {
        // Si no hay API de permisos, intentar acceso directo
        setCameraPermission('prompt');
      }
    } catch (error) {
      console.error('Error checking camera permissions:', error);
      setCameraPermission('prompt');
    }
  };

  const requestCameraPermission = async () => {
    try {
      setCameraError(null);
      
      // Intentar acceder a la cámara para solicitar permisos
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: ['environment', 'user']
        }
      });
      
      // Si llegamos aquí, los permisos fueron concedidos
      setCameraPermission('granted');
      
      // Detener el stream inmediatamente ya que solo queríamos verificar permisos
      stream.getTracks().forEach(track => track.stop());
      
      toast({
        title: "¡Permisos concedidos!",
        description: "Ahora puedes tomar fotos de tu vehículo"
      });
      
      return true;
    } catch (error: any) {
      console.error('Camera permission error:', error);
      
      if (error.name === 'NotAllowedError') {
        setCameraPermission('denied');
        setCameraError('Permisos de cámara denegados. Por favor, permite el acceso a la cámara en la configuración de tu navegador.');
      } else if (error.name === 'NotFoundError') {
        setCameraError('No se encontró ninguna cámara en tu dispositivo.');
      } else if (error.name === 'NotSupportedError') {
        setCameraError('Tu navegador no soporta el acceso a la cámara.');
      } else {
        setCameraError('Error al acceder a la cámara. Verifica que tu dispositivo tenga una cámara disponible.');
      }
      
      toast({
        title: "Error de permisos",
        description: "No se pudo acceder a la cámara. Verifica los permisos en tu navegador.",
        variant: "destructive"
      });
      
      return false;
    }
  };

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

  const startCamera = async () => {
    try {
      setCameraError(null);
      
      // Verificar permisos primero
      if (cameraPermission === 'denied') {
        setCameraError('Los permisos de cámara están denegados. Por favor, permite el acceso en la configuración de tu navegador.');
        return;
      }
      
      if (cameraPermission === 'prompt') {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) return;
      }
      
      // Intentar con múltiples configuraciones de cámara
      const constraints = [
        // Primero intentar con cámara trasera
        { video: { facingMode: { exact: 'environment' } } },
        // Si falla, intentar con cualquier cámara trasera
        { video: { facingMode: 'environment' } },
        // Si falla, usar cámara frontal
        { video: { facingMode: 'user' } },
        // Como último recurso, usar cualquier cámara disponible
        { video: true }
      ];

      let stream: MediaStream | null = null;
      let lastError: Error | null = null;

      for (const constraint of constraints) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraint);
          break; // Si tiene éxito, salir del bucle
        } catch (error: any) {
          lastError = error;
          console.warn('Failed to get camera with constraint:', constraint, error);
          continue; // Intentar con la siguiente configuración
        }
      }

      if (!stream) {
        throw lastError || new Error('No se pudo acceder a ninguna cámara');
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Esperar a que el video esté listo
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }
      setIsCapturing(true);
      setCameraPermission('granted');
      
    } catch (error: any) {
      console.error('Camera start error:', error);
      
      if (error.name === 'NotAllowedError') {
        setCameraPermission('denied');
        setCameraError('Permisos de cámara denegados. Permite el acceso a la cámara para continuar.');
      } else if (error.name === 'NotFoundError') {
        setCameraError('No se encontró ninguna cámara en tu dispositivo.');
      } else if (error.name === 'TimeoutError') {
        setCameraError('Tiempo de espera agotado al iniciar la cámara. Inténtalo de nuevo.');
      } else {
        setCameraError('Error al iniciar la cámara. Verifica que no esté siendo usada por otra aplicación.');
      }
      
      toast({
        title: "Error de cámara",
        description: cameraError || "No se pudo acceder a la cámara",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Configurar el canvas con las dimensiones del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujar el frame actual del video en el canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir a base64
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    
    // Guardar la foto
    const currentGuide = photoGuides[currentPhotoIndex];
    setCapturedPhotos(prev => ({
      ...prev,
      [currentGuide.id]: photoDataUrl
    }));

    // Parar la cámara
    stopCamera();

    toast({
      title: "¡Foto capturada!",
      description: `${currentGuide.title} guardada exitosamente`
    });
  };

  const retakePhoto = (photoId: string) => {
    setCapturedPhotos(prev => {
      const newPhotos = { ...prev };
      delete newPhotos[photoId];
      return newPhotos;
    });
    
    // Encontrar el índice de la foto para retomarla
    const photoIndex = photoGuides.findIndex(guide => guide.id === photoId);
    if (photoIndex !== -1) {
      setCurrentPhotoIndex(photoIndex);
      startCamera();
    }
  };

  const openCameraSettings = () => {
    toast({
      title: "Configuración de cámara",
      description: "Ve a la configuración de tu navegador > Privacidad y seguridad > Configuración del sitio > Cámara, y permite el acceso para este sitio.",
    });
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
    const allPhotosCapture = photoGuides.every(guide => 
      guide.required ? capturedPhotos[guide.id] : true
    );
    
    return allFieldsFilled && vehicleDataExists && allPhotosCapture;
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
    });
    
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

  const currentGuide = photoGuides[currentPhotoIndex];
  const capturedPhotosCount = Object.keys(capturedPhotos).length;
  const totalRequiredPhotos = photoGuides.filter(guide => guide.required).length;

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
              Toma {totalRequiredPhotos} fotos siguiendo las guías. Progreso: {capturedPhotosCount}/{totalRequiredPhotos}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Estado de permisos de cámara */}
            {cameraPermission === 'denied' && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-destructive" />
                  <h3 className="font-semibold text-destructive">Permisos de Cámara Requeridos</h3>
                </div>
                <p className="text-sm text-destructive mb-3">
                  Para tomar fotos de tu vehículo, necesitas permitir el acceso a la cámara.
                </p>
                <div className="flex gap-2">
                  <Button onClick={requestCameraPermission} size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Solicitar Permisos
                  </Button>
                  <Button onClick={openCameraSettings} variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
                  </Button>
                </div>
              </div>
            )}

            {/* Error de cámara */}
            {cameraError && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <h3 className="font-semibold text-destructive">Error de Cámara</h3>
                </div>
                <p className="text-sm text-destructive">{cameraError}</p>
              </div>
            )}

            {/* Progreso de fotos */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progreso de fotos</span>
                <span>{capturedPhotosCount}/{totalRequiredPhotos}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(capturedPhotosCount / totalRequiredPhotos) * 100}%` }}
                />
              </div>
            </div>

            {/* Vista de cámara */}
            {isCapturing && (
              <div className="mb-6">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 md:h-80 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-2 border-white border-dashed rounded-lg w-3/4 h-3/4 flex items-center justify-center">
                      <span className="text-white text-center px-4 bg-black/50 rounded p-2">
                        {currentGuide.description}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded">
                    {currentGuide.title}
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <Button variant="outline" onClick={stopCamera}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={capturePhoto} size="lg">
                    <Camera className="h-4 w-4 mr-2" />
                    Capturar Foto
                  </Button>
                </div>
              </div>
            )}

            {/* Grid de fotos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photoGuides.map((guide, index) => {
                const isCapture = capturedPhotos[guide.id];
                const isCurrent = index === currentPhotoIndex;
                
                return (
                  <div
                    key={guide.id}
                    className={cn(
                      "border-2 rounded-lg p-4 transition-all",
                      isCapture ? "border-green-500 bg-green-50" : "border-muted",
                      isCurrent && isCapturing ? "border-primary bg-primary/5" : ""
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">{guide.title}</h3>
                      {isCapture ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : guide.required ? (
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                      ) : null}
                    </div>
                    
                    {/* Imagen de referencia o foto capturada */}
                    <div className="relative h-32 bg-muted rounded mb-2 overflow-hidden">
                      <Image
                       src={isCapture ? capturedPhotos[guide.id] : guide.referenceImage}
                       alt={guide.title}
                       className="w-full h-full object-cover"
                       width={500}  // Obligatorio: define el ancho máximo esperado
                       height={300} // Obligatorio: define el alto máximo esperado
                       priority={true} // Opcional: si es una imagen crítica (ej. LCP)
                      />
                      {!isCapture && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white text-xs text-center px-2">
                            Referencia
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3">
                      {guide.description}
                    </p>
                    
                    {isCapture ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => retakePhoto(guide.id)}
                        className="w-full"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Retomar
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          setCurrentPhotoIndex(index);
                          startCamera();
                        }}
                        className="w-full"
                        disabled={isCapturing || cameraPermission === 'denied'}
                      >
                        <Camera className="h-3 w-3 mr-1" />
                        Tomar Foto
                      </Button>
                    )}
                  </div>
                );
              })}
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
                <div className={cn("flex items-center gap-2 text-sm", 
                  capturedPhotosCount === totalRequiredPhotos ? "text-green-600" : "text-muted-foreground"
                )}>
                  {capturedPhotosCount === totalRequiredPhotos ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  Todas las fotos capturadas ({capturedPhotosCount}/{totalRequiredPhotos})
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
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default function UploadCarPage() {
  return (
    <ProtectedRoute requiredRoles={['customer', 'dealer']}>
      <UploadCarContent />
    </ProtectedRoute>
  );
}