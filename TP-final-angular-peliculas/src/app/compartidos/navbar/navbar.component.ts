import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../interfaces/auth.interface';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuOpen = false;
  usuarioActual: Usuario | null = null;

  constructor(private authService: AuthService) {
    // Suscribirse al observable para obtener el usuario actual
    this.authService.getUsuarioActual().subscribe(usuario => {
      this.usuarioActual = usuario;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
