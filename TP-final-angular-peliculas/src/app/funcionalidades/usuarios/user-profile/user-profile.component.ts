import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../services/alert.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Usuario } from '../../../interfaces/auth.interface';
@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css'],
    standalone:true,
    imports: [RouterModule, CommonModule, ReactiveFormsModule]
})
export class UserProfileComponent implements OnInit {
  userInfo: Usuario | null = null;
  private userSubscription: Subscription | null = null; // Para gestionar la suscripción
  showConfirmDialog: boolean = false;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router, private alertService: AlertService) {}

  ngOnInit(): void {
    this.getUser ();

  }

  getUser (): void {
    // Suscribirse al observable para obtener el usuario actual
    this.userSubscription = this.authService.getUsuarioActual().subscribe(usuario => {
      this.userInfo = usuario; // Asigna el usuario actual a userInfo
    });
  }

  eliminarCuenta(): void {
    if (this.userInfo) {
      this.showConfirmDialog = true;
    }
  }

  confirmDelete(confirm: boolean): void {
    if (confirm && this.userInfo) {
      this.authService.eliminarUsuario(this.userInfo.id).subscribe({
        next: (exito) => {
          if (exito) {
            this.alertService.mostrarAlerta("success", "Usuario eliminado exitosamente!");
            this.router.navigate(['']);
            this.hideSuccessMessageAfterDelay();
            this.authService.cerrarSesion();
          } else {
            alert('Error al eliminar el usuario');
          }
        },
        error: (error) => {
          console.error('Error al eliminar el usuario', error);
          alert('Error al eliminar el usuario');
        }
      });
    }
    this.showConfirmDialog = false;
  }

  private hideSuccessMessageAfterDelay() {
    setTimeout(() => {
      this.successMessage = null;
    }, 2000);
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }



}
