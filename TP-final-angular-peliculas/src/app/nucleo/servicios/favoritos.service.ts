import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private apiUrl = ""

  constructor(private HTTP: HttpClient) {}

  getPeliculas(): Observable<any[]> {

  }
}
