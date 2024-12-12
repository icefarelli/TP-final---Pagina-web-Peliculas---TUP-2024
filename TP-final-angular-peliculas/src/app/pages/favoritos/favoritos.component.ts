import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ListaFavoritosComponent } from './../../funcionalidades/favoritos/lista-favoritos/lista-favoritos.component';
import { Component } from '@angular/core';

@Component({
    selector: 'app-favoritos',
    imports: [ListaFavoritosComponent, CommonModule, RouterModule],
    standalone:true,
    templateUrl: './favoritos.component.html',
    styleUrl: './favoritos.component.css'
})
export class FavoritosComponent {
  constructor(private router: Router) {}

  // Método para redirigir a la página de agregar favoritos
  agregarFavorito() {
    this.router.navigate(['/favoritos/agregar']);
  }
}
