"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Car, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth-store";
import { UserMenu } from "@/components/auth/user-menu";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { isAuthenticated, user, isAdmin, isDealer } = useAuthStore();

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Menú">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Navegación Principal</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/"
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Inicio
                </Link>
                <Link
                  href="/catalog"
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/catalog" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Catálogo
                </Link>
                
                {/* Enlaces específicos por rol */}
                {isAuthenticated && isAdmin() && (
                  <>
                    <Link
                      href="/admin/dashboard"
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        pathname.startsWith("/admin") ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      Panel de Admin
                    </Link>
                  </>
                )}
                
                {isAuthenticated && isDealer() && (
                  <>
                    <Link
                      href="/dealer/inventory"
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        pathname.startsWith("/dealer") ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      Mi Inventario
                    </Link>
                  </>
                )}
                
                <Link
                  href="/about"
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/about" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Acerca de
                </Link>
                <Link
                  href="/contact"
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/contact" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Contacto
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="hidden sm:flex items-center gap-2">
            <Car className="h-6 w-6" />
            <span className="font-bold text-xl">AutoElite</span>
          </Link>

          {/* Logo móvil */}
          <Link href="/" className="sm:hidden flex items-center gap-1">
            <Car className="h-5 w-5" />
            <span className="font-bold text-lg">AutoElite</span>
          </Link>

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    active={pathname === "/"}
                  >
                    Inicio
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Catálogo</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/catalog"
                        >
                          <Car className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Todos los Vehículos
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Explora nuestra colección completa de vehículos de calidad
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link href="/catalog/new" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Autos Nuevos</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Últimos modelos con características de vanguardia
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/catalog/used" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Autos Usados</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Vehículos usados de calidad a excelentes precios
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/catalog/luxury" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Colección de Lujo</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Vehículos premium para el comprador exigente
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              {/* Enlaces específicos por rol en el menú principal */}
              {isAuthenticated && isAdmin() && (
                <NavigationMenuItem>
                  <Link href="/admin/dashboard" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      active={pathname.startsWith("/admin")}
                    >
                      Administración
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
              
              {isAuthenticated && isDealer() && (
                <NavigationMenuItem>
                  <Link href="/dealer/inventory" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      active={pathname.startsWith("/dealer")}
                    >
                      Mi Inventario
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
              
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    active={pathname === "/about"}
                  >
                    Acerca de
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    active={pathname === "/contact"}
                  >
                    Contacto
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          
          {/* Mostrar menú de usuario si está autenticado, sino mostrar botones de login/registro */}
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <Button variant="outline\" size="sm\" asChild className="hidden sm:flex">
                <Link href="/auth/login">
                  <User className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Link>
              </Button>
              <Button size="sm" asChild className="hidden sm:flex">
                <Link href="/auth/register">Registrarse</Link>
              </Button>
              
              {/* Botón de cuenta móvil */}
              <Button variant="ghost" size="icon" asChild className="sm:hidden">
                <Link href="/auth/login" aria-label="Cuenta">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}