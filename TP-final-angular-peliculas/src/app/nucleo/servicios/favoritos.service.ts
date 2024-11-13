import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Favoritos } from '../modelos/favoritos';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private localUrl = "http://localhost:3000/favoritos";

  constructor(private http: HttpClient) { }


  // Obtiene todas las listas de favoritos
  getListasPorUsuario(userId: number): Observable<Favoritos[]> {
    return this.http.get<Favoritos[]>(this.localUrl).pipe(
      map(favoritos => favoritos.filter(lista => lista.userId === userId)),
    )
  }

    // Agrega una nueva lista de favoritos
    postListasPorUsuario(userId: number , lista: Favoritos): Observable<Favoritos> {
      const listaConUsuario = { ...lista, userId: userId }; // cargo el id de usuario a la nueva lista
      return this.http.post<Favoritos>(this.localUrl, listaConUsuario)
    }

    // Modifica una lista de favoritos existente
    putLista(id: string, lista: Partial<Favoritos>): Observable<Favoritos> {
      const url = `${this.localUrl}/${id}`;
      return this.http.put<Favoritos>(url, lista)
    }

    // Elimina una lista de favoritos
    deleteLista(id: string): Observable<Favoritos> {
      const url = `${this.localUrl}/${id}`;
      return this.http.delete<Favoritos>(url).pipe(
        catchError((error) => {
          console.error('Error al eliminar la lista:', error);
          return throwError(() => new Error('Error al eliminar la lista'));
        })
      );
    }
    getListaporId(id: string): Observable<Favoritos> {
      const url = `${this.localUrl}/${id}`;
      console.log('URL de solicitud GET:', url);
      return this.http.get<Favoritos>(url).pipe(
        catchError((error) => {
          console.error('Error al obtener la lista por ID:', error);
          return throwError(() => new Error('No se encontró la lista con el ID especificado'));
        })
      );
    }



}
