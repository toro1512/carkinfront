import React from "react";
import { CatalogView } from "@/components/catalog-view";

export default function CatalogPage() {
  return (
    <div className="container py-8 px-4 md:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Catálogo de Autos</h1>
        <p className="text-muted-foreground max-w-3xl">
          Explora nuestra extensa colección de vehículos premium. Usa los filtros para refinar tu búsqueda y encontrar tu combinación perfecta.
        </p>
      </div>
      
      <CatalogView />
    </div>
  );
}