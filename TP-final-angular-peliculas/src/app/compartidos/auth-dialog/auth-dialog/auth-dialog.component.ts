import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, Usuario } from '../../../nucleo/servicios/auth.service';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.css'
})
export class AuthDialogComponent {
  modoRegistro = false;
  modoRecuperacion = false;
  usuario: Usuario = {
    usuario: '',
    contrasenia: '',
    nombre: '',
    apellido: '',
    email: '',
    fechaNacimiento: ''
  };
  error = '';
  mensaje = '';
  cargando = false;
  mostrarRegistro: boolean = false;

  constructor(private authService: AuthService) {}

  cambiarModo(modo: 'login' | 'registro' | 'recuperacion') {
    this.modoRegistro = modo === 'registro';
    this.modoRecuperacion = modo === 'recuperacion';
    this.error = '';
    this.mensaje = '';
    this.usuario = {
      usuario: '',
      contrasenia: '',
      nombre: '',
      apellido: '',
      email: '',
      fechaNacimiento: ''
    };
  }

  cerrar() {
    window.dispatchEvent(new Event('cerrarDialog'));
  }

  cerrarDialog(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('auth-dialog-overlay')) {
      this.cerrar();
    }
  }

  enviarFormulario() {
    if (this.modoRegistro) {
      this.registrar();
    } else if (this.modoRecuperacion) {
      this.recuperarContraseña();
    } else {
      this.iniciarSesion();
    }
  }

  registrar() {
    if (!this.usuario.usuario || !this.usuario.contrasenia || !this.usuario.email || !this.usuario.nombre || !this.usuario.apellido) {
      this.error = 'Por favor complete todos los campos obligatorios';
      return;
    }

    this.cargando = true;
    this.authService.registrarUsuario(this.usuario).subscribe({
      next: (exito) => {
        if (exito) {
          this.mensaje = '¡Usuario registrado exitosamente!';
          this.error = '';
          setTimeout(() => this.cerrar(), 2000);
        }
      },
      error: (error) => {
        this.error = 'Error al registrar usuario';
        console.error(error);
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }

  iniciarSesion() {
    if (!this.usuario.usuario || !this.usuario.contrasenia) {
      this.error = 'Por favor complete todos los campos obligatorios';
      this.mostrarRegistro = false; // Ocultar el botón de registro
      return;
    }

    this.cargando = true;
    this.authService.iniciarSesion(this.usuario.usuario, this.usuario.contrasenia).subscribe({
      next: (exito) => {
        if (exito) {
          const usuarioActual = JSON.parse(localStorage.getItem('sesionActual') || '{}');

          // Guardar el userId (ID del usuario) en localStorage como clave separada
          if (usuarioActual && usuarioActual.id) {
            localStorage.setItem('userId', usuarioActual.id.toString());
          }
          this.mensaje = '¡Inicio de sesión exitoso!';
          this.error = '';
          this.mostrarRegistro = false; // Ocultar el botón de registro
          setTimeout(() => this.cerrar(), 2000);
        } else {
          this.error = 'Usuario o contraseña incorrectos. ¿No tiene una cuenta?';
          this.mensaje = '';
          this.mostrarRegistro = true; // Mostrar el botón de registro
        }
      },
      error: (error) => {
        this.error = 'Error al iniciar sesión';
        console.error(error);
        this.mostrarRegistro = false; // Ocultar el botón de registro
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }
  recuperarContraseña() {
    if (!this.usuario.email) {
      this.error = 'Por favor ingrese su email';
      return;
    }

    this.cargando = true;
    this.authService.recuperarContraseña(this.usuario.email).subscribe({
      next: (exito) => {
        if (exito) {
          this.mensaje = 'Se ha enviado un email con instrucciones para recuperar tu contraseña';
          this.error = '';
          setTimeout(() => this.cerrar(), 2000);
        }
      },
      error: (error) => {
        this.error = 'Error al recuperar contraseña';
        console.error(error);
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }
}
