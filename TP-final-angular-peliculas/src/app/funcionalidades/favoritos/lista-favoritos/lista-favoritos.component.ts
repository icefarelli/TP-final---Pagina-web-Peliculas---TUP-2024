import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Favoritos } from '../../../nucleo/modelos/favoritos';
import { FavoritosService } from '../../../nucleo/servicios/favoritos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModificarFavoritosComponent } from '../modificar-favoritos/modificar-favoritos.component';

@Component({
  selector: 'app-lista-favoritos',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './lista-favoritos.component.html',
  styleUrl: './lista-favoritos.component.css'
})
export class ListaFavoritosComponent implements OnInit{
  listas: Favoritos[] = [];
  userId: number;

  constructor(private favoritosService: FavoritosService, private router: Router) {
    this.userId = Number(localStorage.getItem('userId')) // traigo el ultimo usuario iniciado
  }

  ngOnInit(): void {
    this.cargarListas();
  }

  // Cargar todas las listas de favoritos de un usuario desde el servicio
  cargarListas(): void {
    this.favoritosService.getListasPorUsuario(this.userId).subscribe({
      next: (data) => {
        this.listas = data;
      },
      error: (err) => {
        console.error('Error al cargar las listas', err);
      },
    });
  }


  // Navegar al formulario de modificación de la lista seleccionada
  modificarLista(lista: Favoritos): void {
    this.router.navigate(['/favoritos/modificar', lista.id]);
  }

  // Eliminar la lista seleccionada
  eliminarLista(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta lista?')) {
      console.log('Intentando eliminar lista con id:', id); // Verifico el id en consola
      this.favoritosService.deleteLista(id).subscribe({
        next: (resultado) => {
          if (resultado) {
            // Si se eliminó correctamente, recargo las listas
            this.cargarListas();
          } else {
            console.error('No se pudo eliminar la lista');
          }
        },
        error: (err) => {
          console.error('Error al eliminar la lista', err);
        },
      });
    }
  }


  eliminarPeliculadeLista(lista: Favoritos, peliculaId: number): void {
    // Filtrar las películas de la lista específica para quitar la que quiero eliminar
    lista.peliculas = lista.peliculas.filter(pelicula => pelicula.id !== peliculaId);

    // Actualizo la lista en el servidor
    this.favoritosService.putLista(lista.id, lista).subscribe({
      next: () => {
        console.log('Película eliminada de la lista de favoritos');
      },
      error: (err) => {
        console.error('Error al eliminar la película de la lista', err);
      }
    });
  }
}

