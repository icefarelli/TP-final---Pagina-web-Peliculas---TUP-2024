import { Genero } from "../servicios/peliculas.service";

export interface Pelicula {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  genres?: Genre[];
  runtime?: number;
  budget?: number;
  revenue?: number;
  status?: string;
  tagline?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface PeliculaResponse {
  page: number;
  results: Pelicula[];
  total_pages: number;
  total_results: number;
}


export interface GenerosResponse {
  genres: Genero[];
}