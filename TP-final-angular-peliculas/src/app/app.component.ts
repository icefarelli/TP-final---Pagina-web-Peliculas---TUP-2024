// app.component.ts
import { Component, ComponentRef, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService, Usuario } from './nucleo/servicios/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AlertComponent } from './compartidos/alert/alert.component';
import { NavbarComponent } from './compartidos/navbar/navbar.component';
import { AuthDialogComponent } from './compartidos/auth-dialog/auth-dialog/auth-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, AlertComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TP-final-angular-peliculas';

  usuarioActual$: Observable<Usuario | null>;

  private authDialogRef: ComponentRef<AuthDialogComponent> | null = null;

  constructor(private authService: AuthService, private viewContainerRef: ViewContainerRef) {
    this.usuarioActual$ = this.authService.getUsuarioActual();

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
