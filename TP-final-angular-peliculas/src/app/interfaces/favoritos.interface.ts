import { Actor } from "./actor";
import { Pelicula } from "./pelicula.interface";

export interface Favoritos {
  id: string;
  userId: number;
  nombre: string;
  descripcion: string;
  peliculas: Pelicula[];
  actores: Actor[];
}
