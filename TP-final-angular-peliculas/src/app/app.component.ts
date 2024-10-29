import { Component, ComponentRef, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService, Usuario } from './nucleo/servicios/auth.service';
import { AuthDialogComponent } from './compartido/auth-dialog/auth-dialog/auth-dialog.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AlertComponent } from './compartido/alert/alert.component';
import { NavbarComponent } from './compartido/navbar/navbar.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, AlertComponent,NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TP-final-angular-peliculas';


  usuarioActual$: Observable<Usuario | null>; // Cambia a Observable<Usuario | null>

  private authDialogRef: ComponentRef<AuthDialogComponent> | null = null;

  constructor(private authService: AuthService, private viewContainerRef: ViewContainerRef) {
    // Inicializar usuarioActual$ en el constructor
    this.usuarioActual$ = this.authService.getUsuarioActual();

    // Escuchar el evento de cierre del diálogo
    window.addEventListener('cerrarDialog', () => {
      this.cerrarAuthDialog();
    });
  }

  mostrarAuthDialog() {
    this.cerrarAuthDialog();
    this.authDialogRef = this.viewContainerRef.createComponent(AuthDialogComponent);
  }

  cerrarAuthDialog() {
    if (this.authDialogRef) {
      this.authDialogRef.destroy();
      this.authDialogRef = null;
    }
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
  }

}
