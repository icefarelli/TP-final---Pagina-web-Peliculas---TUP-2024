import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AlertService } from './alert.service';

export interface Usuario {
  id?: string;
  usuario: string;
  contrasenia: string;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string;
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
    const sesionActual = localStorage.getItem('sesionActual');
    if (sesionActual) {
      this.usuarioActual.next(JSON.parse(sesionActual));
    }
  }

  registrarUsuario(usuario: Usuario): Observable<boolean> {
    if (!/^[a-zA-Z0-9]+$/.test(usuario.usuario)) {
      this.alertService.mostrarAlerta('error', 'El nombre de usuario no debe contener caracteres especiales');
      return of(false);
    }

    return this.http.get<Usuario[]>(`${this.apiUrl}?usuario=${usuario.usuario}`).pipe(
      switchMap(usuarios => {
        if (usuarios.length > 0) {
          this.alertService.mostrarAlerta('error', 'El usuario ya existe');
          return of(false);
        }

        usuario.id = Date.now().toString();
        return this.http.post<Usuario>(this.apiUrl, usuario).pipe(
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
    return this.http.get<Usuario[]>(`${this.apiUrl}?usuario=${usuario}`).pipe(
      map(usuarios => {
        if (usuarios.length === 0) {
          this.alertService.mostrarAlerta('error', 'Usuario no encontrado');
          return false;
        }
  
        const usuarioEncontrado = usuarios[0];
        if (usuarioEncontrado.contrasenia !== contraseña) {
          this.alertService.mostrarAlerta('error', 'Contraseña incorrecta');
          return false;
        }
  
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

  recuperarContraseña(email: string): Observable<boolean> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(usuarios => {
        if (usuarios.length === 0) {
          this.alertService.mostrarAlerta('error', 'No se encontró ningún usuario con ese email');
          return false;
        }
        // Aquí iría la lógica para enviar un email de recuperación
        this.alertService.mostrarAlerta('success', 'Se ha enviado un email con instrucciones para recuperar tu contraseña');
        return true;
      }),
      catchError((error) => {
        this.handleError(error);
        return of(false);
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let mensajeError = 'Ha ocurrido un error';
    if (error.error instanceof ErrorEvent) {
      mensajeError = `Error: ${error.error.message}`;
    } else {
      mensajeError = `Error del servidor: ${error.status}, mensaje: ${error.message}`;
    }
    this.alertService.mostrarAlerta('error', mensajeError);
    return throwError(() => new Error(mensajeError));
  }
}