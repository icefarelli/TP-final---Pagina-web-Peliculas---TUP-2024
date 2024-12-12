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
    if (this.userInfo && confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      this.authService.eliminarUsuario(this.userInfo.id).subscribe({
        next: (exito) => {
          if (exito) {
            alert('Usuario eliminado exitosamente');
            this.authService.cerrarSesion();
            this.router.navigate(['']);
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
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }



}
