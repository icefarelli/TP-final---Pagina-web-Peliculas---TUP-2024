import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { Pelicula, PeliculaResponse } from '../interfaces/pelicula.interface';
import { Genero } from '../interfaces/genero.interface';
import { Actor } from '../interfaces/actor';



@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
  private apiKey = '994821c417975e9a3fa11a2cddb089ba';
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  obtenerPeliculasPopulares(pagina: number =  1): Observable<PeliculaResponse> {
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

  obtenerElencoPelicula(movieId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/movie/${movieId}/credits?api_key=${this.apiKey}&language=es-ES`
    );
  }


  obtenerActor(id: number): Observable<any> {
  return this.http.get<any>(
    `${this.baseUrl}/person/${id}?api_key=${this.apiKey}&language=es-ES`
  );
}
buscarActores(query: string): Observable<{results: Actor[]}> {
  return this.http.get<{results : Actor[]}>(
    `${this.baseUrl}/search/person?api_key=${this.apiKey}&language=es-ES&query=${query}`
  );
}

obtenerPeliculasPorActor(actorId: number): Observable<any> {
  return this.http.get<any>(
    `${this.baseUrl}/person/${actorId}/movie_credits?api_key=${this.apiKey}&language=es-ES`
  );
}

obtenerTodasLasPeliculas(): Observable<Pelicula[]> {
  const totalPaginas = 250; // Traemos un total de 250 paginas de la api para no hacer tan pesada la peticion
  const peticiones: Observable<PeliculaResponse>[] = [];

  for (let i = 1; i <= totalPaginas; i++) {
    peticiones.push(this.http.get<PeliculaResponse>(
      `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=es-ES&page=${i}`
    ));
  }
  return forkJoin(peticiones).pipe(
    map(respuestas => {
      return respuestas.flatMap(respuesta => respuesta.results); //guardamos las respuestas en un array
    })
  );
}

obtenerPrimerosActoresComunes(): Observable<Actor[]> {
  const paginasNecesarias = 5; // Cada página tiene 20 resultados, 5 páginas traerán 100 actores.
  const peticiones: Observable<{ results: Actor[] }>[] = [];

  for (let i = 1; i <= paginasNecesarias; i++) {
    peticiones.push(
      this.http.get<{ results: Actor[] }>(
        `${this.baseUrl}/person/popular?api_key=${this.apiKey}&language=es-ES&page=${i}`
      )
    );
  }

  return forkJoin(peticiones).pipe(
    map(respuestas => {
      return respuestas.flatMap(respuesta => respuesta.results); // Combina los resultados de todas las páginas.
    })
  );
}

}
