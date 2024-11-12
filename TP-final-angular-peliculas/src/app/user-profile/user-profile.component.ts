import { Component, OnInit } from '@angular/core';
import { AuthService } from '../nucleo/servicios/auth.service';
import { Subscription } from 'rxjs';
import { Usuario } from '../nucleo/servicios/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class UserProfileComponent implements OnInit {
  userInfo: Usuario | null = null;
  private userSubscription: Subscription | null = null; // Para gestionar la suscripción

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getUser ();
  }

  getUser (): void {
    // Suscribirse al observable para obtener el usuario actual
    this.userSubscription = this.authService.getUsuarioActual().subscribe(usuario => {
      this.userInfo = usuario; // Asigna el usuario actual a userInfo
    });
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
