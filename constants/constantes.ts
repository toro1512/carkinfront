import { PhotoTemplate } from '@/types/camara';

export const photoGuides: PhotoTemplate[] = [
  { id: 1, label: "Frontal",
    description: "Toma una foto de frente, mirando directamente a la cámara.", 
    required: true,referenceImage: 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg', guidanceImage: "/assets/png-frontal.png" },
  { id: 2, label: "Perfil Izquierdo",referenceImage: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',description: "Toma una foto de tu perfil izquierdo.", required: true, guidanceImage: "/assets/png-frontal.png" },
  { id: 3, label: "Perfil Derecho", referenceImage: 'https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg', description: "Toma una foto de tu perfil derecho.", required: true, guidanceImage: "/assets/png-frontal.png" },
  { id: 4, label: "Ojos Cerrados", referenceImage: 'https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg', description: "Toma una foto con los ojos cerrados.", required: true, guidanceImage: "/assets/png-transparent.png" }, // Reusamos la frontal como guía general de posición
  { id: 5, label: "Sonriendo",  referenceImage: 'https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg',description: "Toma una foto sonriendo ampliamente.", required: true, guidanceImage: "/assets//assets/parteTrasera.png" }, // Reusamos la frontal
  { id: 6, label: "Expresión Seria",  referenceImage: 'https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg',description: "Toma una foto con una expresión facial seria y neutra.", required: true, guidanceImage: "/assets/png-transparent.png" }, // Reusamos la frontal
  { id: 7, label: "Hombro Izquierdo (3/4)",  referenceImage: 'https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg',description: "Foto 3/4 vista sobre el hombro izquierdo.", required: true, guidanceImage: "/assets//assets/parteTrasera.png" },
  { id: 8, label: "Hombro Derecho (3/4)",  referenceImage: 'https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg',description: "Foto 3/4 vista sobre el hombro derecho.", required: true, guidanceImage: "/assets//assets/parteTrasera.png" },
  { id: 9, label: "Picado Ligero", referenceImage: 'https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg', description: "Toma una foto desde un ángulo ligeramente elevado.", required: true, guidanceImage: "/assets/parteTrasera.png" },
  { id: 10, label: "Contrapicado Ligero", referenceImage: 'https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg', description: "Toma una foto desde un ángulo ligeramente bajo.", required: true, guidanceImage: "/assets/png-transparent.png" },
  
];
