
import React from 'react';
import { PhotoTemplate, CapturedPhoto } from '@/types/camara';
import Image from 'next/image';
import { 
  Camera,
  RefreshCcw, 

  CheckCircle, 

  Trash
} from 'lucide-react';


interface PhotoSlotProps {
  template: PhotoTemplate;
  capturedPhoto?: CapturedPhoto;
  onCapture: (template: PhotoTemplate) => void;
  onDelete: (templateId: number) => void;
  onRetake: (template: PhotoTemplate) => void;
}

const PhotoSlot: React.FC<PhotoSlotProps> = ({ template, capturedPhoto, onCapture, onDelete, onRetake }) => {
  const borderColor = capturedPhoto ? 'border-green-500' : (template.required ? 'border-red-500' : 'border-gray-300');
  const hoverEffect = !capturedPhoto ? 'hover:bg-gray-50 hover:shadow-md' : 'hover:shadow-md';

  return (
    <div className={`relative flex flex-col items-center justify-center p-4 border-2 ${borderColor} rounded-lg shadow-sm transition-all duration-200 ease-in-out ${hoverEffect} min-h-[280px] bg-white`}>
      {template.required && !capturedPhoto && (
        <span className="absolute top-2 right-2 text-xs bg-red-500 text-white px-2 py-1 rounded-full font-semibold">
          Obligatorio
        </span>
      )}
      {capturedPhoto && (
         <span className="absolute top-2 right-2 text-green-500">
          <CheckCircle className="w-6 h-6" />
        </span>
      )}

      <h3 className="text-md font-semibold text-gray-700 mb-1 text-center">{template.label}</h3>
      <p className="text-xs text-gray-500 mb-2 text-center px-2">{template.description}</p>
      
      {capturedPhoto ? (
        <div className="w-full h-40__ mb-2_ flex-grow flex items-center justify-center">
          <Image src={capturedPhoto.imageUrl} alt={template.label} className="max-w-full max-h-40_object-contain rounded-md" />
        </div>
      ) : (
        <div className="w-full h-40_ mb-2_ flex-grow flex flex-col items-center justify-center text-gray-400_">
          <Camera className="w-16 h-16 text-gray-300" />
          <span className="mt-2 text-sm">Tomar Foto</span>
        </div>
      )}

      <div className="mt-auto w-full flex justify-around space-x-2 pt-2">
        {!capturedPhoto ? (
          <button
            onClick={() => onCapture(template)}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Camera className="w-5 h-5 mr-2" />
            Capturar
          </button>
        ) : (
          <>
            <button
              onClick={() => onRetake(template)}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <RefreshCcw className="w-5 h-5 mr-2" />
              Rehacer
            </button>
            <button
              onClick={() => onDelete(template.id)}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash className="w-5 h-5 mr-2" />
              Eliminar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PhotoSlot;
    