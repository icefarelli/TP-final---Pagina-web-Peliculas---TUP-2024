import { Pelicula } from "./pelicula.interface";

export interface Favoritos {
  id: number;
  userId: number;
  nombre: string;
  descripcion: string;
  peliculas: Pelicula[];
}
