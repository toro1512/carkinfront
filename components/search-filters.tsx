"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Search, X } from "lucide-react";
import { useCarsStore } from "@/lib/store/cars-store";

const searchSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minYear: z.number().optional(),
  maxYear: z.number().optional(),
  bodyType: z.string().optional(),
  fuelType: z.string().optional(),
  searchTerm: z.string().optional(),
});

type SearchValues = z.infer<typeof searchSchema>;

const currentYear = new Date().getFullYear();
const yearRange = Array.from(
  { length: 30 },
  (_, i) => currentYear - i
);

const makeOptions = [
  "Todas las Marcas",
  "Audi",
  "BMW",
  "Ford",
  "Honda",
  "Lexus",
  "Mercedes-Benz",
  "Porsche",
  "Tesla",
  "Toyota",
  "Volkswagen",
];

const bodyTypeOptions = [
  "Todos los Tipos",
  "Sedán",
  "SUV",
  "Coupé",
  "Convertible",
  "Hatchback",
  "Familiar",
  "Camioneta",
  "Van",
];

const fuelTypeOptions = [
  "Todos los Combustibles",
  "Gasolina",
  "Diésel",
  "Híbrido",
  "Eléctrico",
  "Híbrido Enchufable",
];

export function SearchFilters() {
  const { filters, setFilters, clearFilters } = useCarsStore();
  const [priceRange, setPriceRange] = useState([
    filters.minPrice || 0, 
    filters.maxPrice || 200000
  ]);

  const form = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      make: filters.make || "Todas las Marcas",
      model: filters.model || "",
      minPrice: filters.minPrice || 0,
      maxPrice: filters.maxPrice || 200000,
      minYear: filters.minYear || yearRange[yearRange.length - 1],
      maxYear: filters.maxYear || currentYear,
      bodyType: filters.bodyType || "Todos los Tipos",
      fuelType: filters.fuelType || "Todos los Combustibles",
      searchTerm: filters.searchTerm || "",
    },
  });

  function onSubmit(values: SearchValues) {
    // Aplicar filtros al store
    setFilters({
      make: values.make === "Todas las Marcas" ? undefined : values.make,
      model: values.model || undefined,
      minPrice: values.minPrice,
      maxPrice: values.maxPrice,
      minYear: values.minYear,
      maxYear: values.maxYear,
      bodyType: values.bodyType === "Todos los Tipos" ? undefined : values.bodyType,
      fuelType: values.fuelType === "Todos los Combustibles" ? undefined : values.fuelType,
      searchTerm: values.searchTerm || undefined,
    });
  }

  function handleClearFilters() {
    clearFilters();
    form.reset({
      make: "Todas las Marcas",
      model: "",
      minPrice: 0,
      maxPrice: 200000,
      minYear: yearRange[yearRange.length - 1],
      maxYear: currentYear,
      bodyType: "Todos los Tipos",
      fuelType: "Todos los Combustibles",
      searchTerm: "",
    });
    setPriceRange([0, 200000]);
  }

  // Verificar si hay filtros activos
  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        {/* Búsqueda General */}
        <div className="mb-4">
          <FormField
            control={form.control}
            name="searchTerm"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="searchTerm">Búsqueda General</Label>
                <div className="relative">
                  <FormControl>
                    <Input
                      id="searchTerm"
                      placeholder="Buscar por marca, modelo, tipo..."
                      {...field}
                      value={field.value || ""}
                      className="pl-10"
                    />
                  </FormControl>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="make">Marca</Label>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger id="make">
                      <SelectValue placeholder="Seleccionar marca" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {makeOptions.map((make) => (
                      <SelectItem key={make} value={make}>
                        {make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="model">Modelo</Label>
                <FormControl>
                  <Input
                    id="model"
                    placeholder="Cualquier modelo"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minYear"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="minYear">Año Mínimo</Label>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger id="minYear">
                      <SelectValue placeholder="Año Mínimo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {yearRange.map((year) => (
                      <SelectItem key={`min-${year}`} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            {hasActiveFilters && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClearFilters}
                className="px-3"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Limpiar filtros</span>
              </Button>
            )}
          </div>
        </div>
        
        <Accordion type="single" collapsible>
          <AccordionItem value="advanced-filters" className="border-none">
            <AccordionTrigger className="py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Filtros Avanzados
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                <div className="space-y-2">
                  <Label>Rango de Precio (USD)</Label>
                  <div className="pt-6 px-2">
                    <Slider
                      value={priceRange}
                      max={200000}
                      step={1000}
                      onValueChange={(value) => {
                        setPriceRange(value as [number, number]);
                        form.setValue("minPrice", value[0]);
                        form.setValue("maxPrice", value[1]);
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0].toLocaleString()}</span>
                    <span>${priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="bodyType"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="bodyType">Tipo de Carrocería</Label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger id="bodyType">
                            <SelectValue placeholder="Seleccionar tipo de carrocería" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bodyTypeOptions.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fuelType"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="fuelType">Tipo de Combustible</Label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger id="fuelType">
                            <SelectValue placeholder="Seleccionar tipo de combustible" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fuelTypeOptions.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  );
}