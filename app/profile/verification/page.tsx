"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
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
import { useAuthStore } from '@/lib/store/auth-store';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  X,
  RotateCcw,
  User,
  MapPin,
  FileText,
  Shield,
  Phone,
  Mail,
  Calendar,
  Home,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Esquema de validación
const verificationSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos").regex(/^\+?[\d\s-()]+$/, "Formato de teléfono inválido"),
  dateOfBirth: z.string().min(1, "La fecha de nacimiento es requerida"),
  documentType: z.string().min(1, "Selecciona un tipo de documento"),
  documentNumber: z.string().min(5, "El número de documento debe tener al menos 5 caracteres"),
  address: z.string().min(10, "La dirección debe tener al menos 10 caracteres"),
  city: z.string().min(2, "La ciudad es requerida"),
  state: z.string().min(2, "El estado es requerido"),
  zipCode: z.string().min(4, "El código postal debe tener al menos 4 caracteres"),
  occupation: z.string().min(2, "La ocupación es requerida"),
  requestedRole: z.string().min(1, "Selecciona el rol que deseas"),
  bio: z.string().optional(),
});

type VerificationValues = z.infer<typeof verificationSchema>;

// Tipos de documento disponibles
const documentTypes = [
  { value: "cedula", label: "Cédula de Ciudadanía" },
  { value: "pasaporte", label: "Pasaporte" },
  { value: "licencia", label: "Licencia de Conducir" },
  { value: "tarjeta_identidad", label: "Tarjeta de Identidad" },
];

// Roles disponibles para solicitar
const availableRoles = [
  { value: "customer", label: "Cliente", description: "Comprar vehículos y acceder a servicios básicos" },
  { value: "dealer", label: "Vendedor", description: "Vender vehículos y gestionar inventario" },
];

// Ubicaciones predefinidas en el mapa
const predefinedLocations = [
  { id: 1, name: "Sucursal Centro", lat: 19.4326, lng: -99.1332, address: "Av. Caracs , Centro, CDMX" },
  { id: 2, name: "Sucursal madrid", lat: 19.4267, lng: -99.1718, address: "Av. Presidente Masaryk 456, Polanco, ESPN" },
  { id: 3, name: "Sucursal Santa Fe", lat: 19.3598, lng: -99.2674, address: "Av. Santa Fe 789, Santa Fe, BAR" },
  { id: 4, name: "Sucursal Insurgentes", lat: 19.3910, lng: -99.1710, address: "Av. Insurgentes Sur 321, Del Valle, COL" },
  { id: 5, name: "Sucursal Satelite", lat: 19.5057, lng: -99.2386, address: "Blvd. Manuel Ávila Camacho 654, Satélite, DEF" },
];

interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

function VerificationContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [documentPhoto, setDocumentPhoto] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt' | 'checking'>('checking');
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const form = useForm<VerificationValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      firstName: user?.name || '',
      lastName: user?.name || '',
      email: user?.email || '',
      phone: '',
      dateOfBirth: '',
      documentType: '',
      documentNumber: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      occupation: '',
      requestedRole: 'customer',
      bio: '',
    },
  });

  // Verificar permisos de cámara al cargar
  useEffect(() => {
    checkCameraPermissions();
  }, []);

  const checkCameraPermissions = async () => {
    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setCameraPermission(permission.state as 'granted' | 'denied' | 'prompt');
        
        permission.onchange = () => {
          setCameraPermission(permission.state as 'granted' | 'denied' | 'prompt');
        };
      } else {
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
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: ['environment', 'user'],
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setCameraPermission('granted');
      stream.getTracks().forEach(track => track.stop());
      
      toast({
        title: "¡Permisos concedidos!",
        description: "Ahora puedes tomar la foto de tu documento"
      });
      
      return true;
    } catch (error: any) {
      console.error('Camera permission error:', error);
      
      if (error.name === 'NotAllowedError') {
        setCameraPermission('denied');
        setCameraError('Permisos de cámara denegados. Por favor, permite el acceso a la cámara en la configuración de tu navegador.');
      } else {
        setCameraError('Error al acceder a la cámara. Verifica que tu dispositivo tenga una cámara disponible.');
      }
      
      return false;
    }
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      
      if (cameraPermission === 'denied') {
        setCameraError('Los permisos de cámara están denegados. Por favor, permite el acceso en la configuración de tu navegador.');
        return;
      }
      
      if (cameraPermission === 'prompt') {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) return;
      }
      
      const constraints = [
        { 
          video: { 
            facingMode: { exact: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        },
        { 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        },
        { 
          video: { 
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        },
        { 
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        }
      ];

      let stream: MediaStream | null = null;
      let lastError: Error | null = null;

      for (const constraint of constraints) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraint);
          break;
        } catch (error: any) {
          lastError = error;
          continue;
        }
      }

      if (!stream) {
        throw lastError || new Error('No se pudo acceder a ninguna cámara');
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Asegurar que el video se reproduzca
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(console.error);
          }
        };
      }
      setIsCapturing(true);
      setCameraPermission('granted');
      
    } catch (error: any) {
      console.error('Camera start error:', error);
      setCameraError('Error al iniciar la cámara. Verifica que no esté siendo usada por otra aplicación.');
      
      toast({
        title: "Error de cámara",
        description: "No se pudo acceder a la cámara",
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
    if (!videoRef.current || !canvasRef.current) {
      toast({
        title: "Error",
        description: "No se pudo acceder a la cámara o canvas",
        variant: "destructive"
      });
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      toast({
        title: "Error",
        description: "No se pudo obtener el contexto del canvas",
        variant: "destructive"
      });
      return;
    }

    // Asegurar que el video esté reproduciendo
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      toast({
        title: "Error",
        description: "El video no está listo. Espera un momento e intenta de nuevo.",
        variant: "destructive"
      });
      return;
    }

    // Configurar el canvas con las dimensiones del video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Aplicar transformación para efecto espejo
    context.save();
    context.scale(-1, 1);
    context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    context.restore();

    // Convertir a base64 con buena calidad
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    // Verificar que la imagen se capturó correctamente
    if (photoDataUrl === 'data:,') {
      toast({
        title: "Error",
        description: "No se pudo capturar la imagen. Intenta de nuevo.",
        variant: "destructive"
      });
      return;
    }

    setDocumentPhoto(photoDataUrl);
    stopCamera();

    toast({
      title: "¡Foto capturada!",
      description: "Documento fotografiado exitosamente"
    });
  };

  const retakePhoto = () => {
    setDocumentPhoto(null);
    startCamera();
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    toast({
      title: "Ubicación seleccionada",
      description: `Has seleccionado: ${location.name}`
    });
  };

  const onSubmit = async (data: VerificationValues) => {
    if (!documentPhoto) {
      toast({
        title: "Foto requerida",
        description: "Debes tomar una foto de tu documento de identidad",
        variant: "destructive"
      });
      return;
    }

    if (!selectedLocation) {
      toast({
        title: "Ubicación requerida",
        description: "Debes seleccionar una ubicación en el mapa",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simular envío de datos
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Aquí harías la llamada real a tu API
      const verificationData = {
        ...data,
        documentPhoto,
        selectedLocation,
        userId: user?.id,
        submittedAt: new Date().toISOString(),
      };
      
      console.log('Datos de verificación:', verificationData);
      
      toast({
        title: "¡Solicitud enviada!",
        description: "Tu solicitud de verificación ha sido enviada. Te contactaremos pronto.",
      });
      
      router.push('/profile');
      
    } catch (error) {
      toast({
        title: "Error al enviar",
        description: "Hubo un problema al enviar tu solicitud. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Verificación de Perfil</h1>
        <p className="text-muted-foreground">
          Completa tu información personal para verificar tu cuenta y acceder a todas las funcionalidades
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Completa tus datos personales básicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder="Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="juan@ejemplo.com" {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="+52 55 1234 5678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Nacimiento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ocupación</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingeniero, Médico, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biografía (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Cuéntanos un poco sobre ti..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Documentación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentación
              </CardTitle>
              <CardDescription>
                Proporciona tu documento de identidad oficial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Documento</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {documentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="documentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Documento</FormLabel>
                      <FormControl>
                        <Input placeholder="123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Captura de foto del documento */}
              <div>
                <Label className="text-base font-medium">Foto del Documento</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Toma una foto clara de tu documento de identidad
                </p>

                {cameraError && (
                  <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      <h3 className="font-semibold text-destructive">Error de Cámara</h3>
                    </div>
                    <p className="text-sm text-destructive">{cameraError}</p>
                  </div>
                )}

                {isCapturing ? (
                  <div className="space-y-4">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-64 md:h-80 object-cover"
                        style={{ transform: 'scaleX(-1)' }} // Efecto espejo para mejor UX
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="border-2 border-white border-dashed rounded-lg w-3/4 h-3/4 flex items-center justify-center">
                          <span className="text-white text-center px-4 bg-black/50 rounded p-2 text-sm">
                            Coloca tu documento dentro del marco y presiona capturar
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button type="button" variant="outline" onClick={stopCamera}>
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button type="button" onClick={capturePhoto} size="lg">
                        <Camera className="h-4 w-4 mr-2" />
                        Capturar Foto
                      </Button>
                    </div>
                  </div>
                ) : documentPhoto ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <Image
  src={documentPhoto}
  alt="Documento capturado"
  width={800}  // Dimensiones reales del documento
  height={600}
  className="w-full h-64 object-contain rounded-lg border bg-muted"
  quality={85} // Optimización de calidad
  priority={false}
/>
                      <Badge className="absolute top-2 right-2 bg-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Capturado
                      </Badge>
                    </div>
                    <Button type="button" variant="outline" onClick={retakePhoto} className="w-full">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Tomar Nueva Foto
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      No has tomado una foto del documento
                    </p>
                    <Button 
                      type="button" 
                      onClick={startCamera}
                      disabled={cameraPermission === 'denied'}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Tomar Foto
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dirección */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Dirección
              </CardTitle>
              <CardDescription>
                Proporciona tu dirección actual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección Completa</FormLabel>
                    <FormControl>
                      <Input placeholder="Calle, número" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl>
                        <Input placeholder="Ciudad " {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="CAR" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código Postal</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Mapa de Ubicaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Ubicación de Verificación
              </CardTitle>
              <CardDescription>
                Selecciona la sucursal más cercana a ti para completar tu verificación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedLocation && (
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Ubicación Seleccionada</h3>
                    </div>
                    <p className="font-medium">{selectedLocation.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {predefinedLocations.map((location) => (
                    <div
                      key={location.id}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                        selectedLocation?.id === location.id
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      )}
                      onClick={() => handleLocationSelect(location)}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className={cn(
                          "h-5 w-5 mt-0.5",
                          selectedLocation?.id === location.id ? "text-primary" : "text-muted-foreground"
                        )} />
                        <div className="flex-1">
                          <h3 className="font-medium">{location.name}</h3>
                          <p className="text-sm text-muted-foreground">{location.address}</p>
                          {selectedLocation?.id === location.id && (
                            <Badge className="mt-2">Seleccionada</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rol Solicitado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Tipo de Cuenta
              </CardTitle>
              <CardDescription>
                Selecciona el tipo de cuenta que deseas tener
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="requestedRole"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableRoles.map((role) => (
                          <div
                            key={role.value}
                            className={cn(
                              "p-4 border rounded-lg cursor-pointer transition-all",
                              field.value === role.value
                                ? "border-primary bg-primary/5"
                                : "border-muted hover:border-primary/50"
                            )}
                            onClick={() => field.onChange(role.value)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className={cn(
                                "w-4 h-4 rounded-full border-2",
                                field.value === role.value
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground"
                              )}>
                                {field.value === role.value && (
                                  <div className="w-full h-full rounded-full bg-white scale-50" />
                                )}
                              </div>
                              <h3 className="font-medium">{role.label}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">{role.description}</p>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Botón de envío */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">¿Listo para enviar tu solicitud?</h3>
                  <p className="text-sm text-muted-foreground">
                    Revisa que toda la información esté completa y correcta
                  </p>
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="w-full max-w-md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando Solicitud...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Enviar Solicitud de Verificación
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      {/* Canvas oculto para captura de fotos */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default function ProfileVerificationPage() {
  return (
    <ProtectedRoute requiredRoles={['Taller', 'Usuario', 'Administrador']}>
      <VerificationContent />
    </ProtectedRoute>
  );
}