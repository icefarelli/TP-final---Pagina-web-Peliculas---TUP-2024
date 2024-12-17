import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AlertService } from './alert.service';
import { Usuario } from '../interfaces/auth.interface';



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
    if (usuario.usuario.length < 4) {
      this.alertService.mostrarAlerta('error', 'El nombre de usuario debe tener al menos 4 caracteres');
      return of(false);
    }

    if (usuario.contrasenia.length < 4) {
      this.alertService.mostrarAlerta('error', 'La contraseña debe tener al menos 4 caracteres');
      return of(false);
    }

    if (!/^[a-zA-Z0-9]+$/.test(usuario.nombre)) {
      this.alertService.mostrarAlerta('error', 'El nombre no debe contener caracteres especiales');
      return of(false);
    }

    if (!/^[a-zA-Z0-9]+$/.test(usuario.apellido)) {
      this.alertService.mostrarAlerta('error', 'El apellido no debe contener caracteres especiales');
      return of(false);
    }


    return this.http.get<Usuario[]>(`${this.apiUrl}?usuario=${usuario.usuario}`).pipe(
      switchMap(usuarios => {
        if (usuarios.length > 0) {
          this.alertService.mostrarAlerta('error', 'El usuario ya existe');
          return of(false);
        }

        if (this.validarFechaNacimiento(usuario.fechaNacimiento) === 'Fecha>hoy') {
          this.alertService.mostrarAlerta('error', 'La fecha de nacimiento no puede ser mayor a hoy');
          return of(false);
        }

        if (this.validarFechaNacimiento(usuario.fechaNacimiento) === 'Fecha<hace100anos') {
          this.alertService.mostrarAlerta('error', 'La fecha de nacimiento no puede ser anterior a 100 años');
          return of(false);
        }

        if (this.validarFechaNacimiento(usuario.fechaNacimiento) === 'Fecha>mayorEdad') {
          this.alertService.mostrarAlerta('error', 'Debes tener al menos 18 años para registrarte');
          return of(false);
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(usuario.email)) {
          this.alertService.mostrarAlerta('error', 'El correo electrónico no es válido');
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

  validarFechaNacimiento(fechaNacimiento: string): string {
    const fecha = new Date(fechaNacimiento);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const mayorEdad = new Date();
    mayorEdad.setFullYear(mayorEdad.getFullYear() - 18);

    const hace100Anos = new Date();
    hace100Anos.setFullYear(hace100Anos.getFullYear() - 100);

    if(fecha > hoy){
      return 'Fecha>hoy'
    }
    if(fecha < hace100Anos){
      return 'Fecha<hace100anos'
      }
    if(fecha > mayorEdad){
      return 'Fecha>mayorEdad'
      }
      return 'fechaOK'
    ;
  }

  // Método para cambiar la contraseña
cambiarContrasenia(usuarioId: string|null, nuevaContrasenia: string): Observable<boolean> {
  return this.http.patch<Usuario>(`${this.apiUrl}/${usuarioId}`, { contrasenia: nuevaContrasenia }).pipe(
    map(() => {
      this.alertService.mostrarAlerta('success', 'Contraseña cambiada exitosamente');
      return true;
    }),
    catchError((error) => {
      this.handleError(error);
      return of(false);
    })
  );
}

// Método para eliminar un usuario
eliminarUsuario(usuarioId: string | undefined): Observable<boolean> {
  return this.http.delete<Usuario>(`${this.apiUrl}/${usuarioId}`).pipe(
    map(() => {
      this.alertService.mostrarAlerta('success', 'Usuario eliminado exitosamente');
      return true;
    }),
    catchError((error) => {
      this.handleError(error);
      return of(false);
    })
  );
}

cambiarDatosUsuario(usuario: Usuario): Observable<boolean> {
  return this.http.patch<Usuario>(`${this.apiUrl}/${usuario.id}`, usuario).pipe(
    map((updatedUser) => {
      this.alertService.mostrarAlerta('success', 'Datos actualizados exitosamente');
      this.usuarioActual.next(updatedUser );

      return true;
    }),
    catchError((error) => {
      this.handleError(error);
      return of(false);
    })
  );
}
}
