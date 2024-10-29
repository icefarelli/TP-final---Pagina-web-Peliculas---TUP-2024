import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../nucleo/servicios/auth.service';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.css'
})
export class AuthDialogComponent {
  modoRegistro = false;
  usuario = '';
  contrasenia = '';
  error = '';
  mensaje = '';
  cargando = false;

  constructor(private authService: AuthService) {}

  cambiarModo() {
    this.modoRegistro = !this.modoRegistro;
    this.error = '';
    this.mensaje = '';
    this.usuario = '';
    this.contrasenia = '';
  }

  cerrar() {
    window.dispatchEvent(new Event('cerrarDialog'));
  }

  cerrarDialog(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('auth-dialog-overlay')) {
      this.cerrar();
    }
  }

  registrar() {
    if (!this.usuario || !this.contrasenia) {
      this.error = 'Por favor complete todos los campos';
      return;
    }

    this.cargando = true;
    this.authService.registrarUsuario(this.usuario, this.contrasenia).subscribe({
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
    if (!this.usuario || !this.contrasenia) {
      this.error = 'Por favor complete todos los campos';
      return;
    }

    this.cargando = true;
    this.authService.iniciarSesion(this.usuario, this.contrasenia).subscribe({
      next: (exito) => {
        if (exito) {
          this.mensaje = '¡Inicio de sesión exitoso!';
          this.error = '';
          setTimeout(() => this.cerrar(), 2000);
        }
      },
      error: (error) => {
        this.error = 'Error al iniciar sesión';
        console.error(error);
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }
}