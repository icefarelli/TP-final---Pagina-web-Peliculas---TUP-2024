import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pelicula, PeliculaResponse } from '../modelos/pelicula.interface';

export interface Genero {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
  private apiKey = '994821c417975e9a3fa11a2cddb089ba';
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  obtenerPeliculasPopulares(pagina: number = 1): Observable<PeliculaResponse> {
    return this.http.get<PeliculaResponse>(
      `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=es-ES&page=${pagina}`
    );
  }

  obtenerDetallePelicula(id: number): Observable<Pelicula> {
    return this.http.get<Pelicula>(
      `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&language=es-ES`
    );
  }

  buscarPeliculas(query: string): Observable<PeliculaResponse> {
    return this.http.get<PeliculaResponse>(
      `${this.baseUrl}/search/movie?api_key=${this.apiKey}&language=es-ES&query=${query}`
    );
  }

  obtenerGeneros(): Observable<{genres: Genero[]}> {
    return this.http.get<{genres: Genero[]}>(
      `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=es-ES`
    );
  }
}