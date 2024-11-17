import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../interfaces/auth.interface';
import { AuthService } from '../../../services/auth.service';

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
  //armamos un metodo que se llama en el html para que en base a lo que se quiera hacer, lleve al metodo correspondinete
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
      this.mostrarRegistro = false;
      return;
    }

    this.cargando = true;
    this.authService.iniciarSesion(this.usuario.usuario, this.usuario.contrasenia).subscribe({
      next: (exito) => {
        if (exito) {
          const usuarioActual = JSON.parse(localStorage.getItem('sesionActual') || '{}');

          
          if (usuarioActual && usuarioActual.id) {
            localStorage.setItem('userId', usuarioActual.id.toString());  // guardamos el ID en localstorage para usarlo dentro de la navegacion
          }
          this.error = '';
          this.mostrarRegistro = false; 
          setTimeout(() => this.cerrar(), 2000);
        } else {
          this.error = 'Usuario o contraseña incorrectos. ¿No tiene una cuenta?';
          this.mensaje = '';
          this.mostrarRegistro = true;
        }
      },
      error: (error) => {
        this.error = 'Error al iniciar sesión';
        console.error(error);
        this.mostrarRegistro = false;
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

   // Método para cambiar la contraseña
   cambiarContrasenia(nuevaContrasenia: string) {
    if (!this.usuario.id || !nuevaContrasenia) {
      this.error = 'Por favor, ingrese una nueva contraseña';
      return;
    }

    this.authService.cambiarContrasenia(this.usuario.id, nuevaContrasenia).subscribe({
      next: (exito) => {
        if (exito) {
          this.mensaje = 'Contraseña cambiada exitosamente';
          setTimeout(() => this.cerrar(), 2000);
        } else {
          this.error = 'Error al cambiar la contraseña';
        }
      },
      error: (error) => {
        this.error = 'Error al cambiar la contraseña';
        console.error(error);
      }
    });
  }

  // Método para eliminar el usuario
  eliminarUsuario() {
    if (!this.usuario.id) {
      this.error = 'No se puede eliminar el usuario';
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta?')) {
      this.authService.eliminarUsuario(this.usuario.id).subscribe({
        next: (exito) => {
          if (exito) {
            this.mensaje = 'Usuario eliminado exitosamente';
            this.cerrar();
          } else {
            this.error = 'Error al eliminar el usuario';
          }
        },
        error: (error) => {
          this.error = 'Error al eliminar el usuario';
          console.error(error);
        }
      });
    }
  }
}
