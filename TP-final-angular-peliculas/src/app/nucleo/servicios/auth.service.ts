import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AlertService } from './alert.service';

export interface Usuario {
  id?: string;
  usuario: string;
  contraseña: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/usuarios';
  private usuarioActual = new BehaviorSubject<Usuario | null>(null);

  constructor(
    private http: HttpClient,
    private alertService: AlertService
  ) {
    // Verificar si hay una sesión activa en localStorage
    const sesionActual = localStorage.getItem('sesionActual');
    if (sesionActual) {
      this.usuarioActual.next(JSON.parse(sesionActual));
    }
  }

  registrarUsuario(usuario: string, contraseña: string): Observable<boolean> {
    // Primero verificar si el usuario ya existe
    return this.http.get<Usuario[]>(`${this.apiUrl}?usuario=${usuario}`).pipe(
      switchMap(usuarios => {
        if (usuarios.length > 0) {
          this.alertService.mostrarAlerta('error', 'El usuario ya existe');
          return of(false);
        }

        // Si no existe, crear el nuevo usuario
        const nuevoUsuario: Usuario = {
          usuario,
          contraseña,
          id: Date.now().toString()
        };

        return this.http.post<Usuario>(this.apiUrl, nuevoUsuario).pipe(
          tap(() => {
            this.alertService.mostrarAlerta('success', '¡Usuario registrado exitosamente!');
          }),
          map(() => true),
          catchError((error) => {
            this.handleError(error);
            return of(false);
          })
        );
      }),
      catchError((error) => {
        this.handleError(error);
        return of(false);
      })
    );
  }

  iniciarSesion(usuario: string, contraseña: string): Observable<boolean> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?usuario=${usuario}&contraseña=${contraseña}`).pipe(
      map(usuarios => {
        if (usuarios.length === 0) {
          this.alertService.mostrarAlerta('error', 'Usuario o contraseña incorrectos');
          return false;
        }

        const usuarioEncontrado = usuarios[0];
        this.usuarioActual.next(usuarioEncontrado);
        localStorage.setItem('sesionActual', JSON.stringify(usuarioEncontrado));
        this.alertService.mostrarAlerta('success', '¡Inicio de sesión exitoso!');
        return true;
      }),
      catchError((error) => {
        this.handleError(error);
        return of(false);
      })
    );
  }

  cerrarSesion(): void {
    this.usuarioActual.next(null);
    localStorage.removeItem('sesionActual');
    this.alertService.mostrarAlerta('info', 'Sesión cerrada');
  }

  getUsuarioActual(): Observable<Usuario | null> {
    return this.usuarioActual.asObservable();
  }

  estaAutenticado(): boolean {
    return this.usuarioActual.value !== null;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let mensajeError = 'Ha ocurrido un error';
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      mensajeError = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      mensajeError = `Error del servidor: ${error.status}, mensaje: ${error.message}`;
    }
    this.alertService.mostrarAlerta('error', mensajeError);
    return throwError(() => new Error(mensajeError));
  }
}