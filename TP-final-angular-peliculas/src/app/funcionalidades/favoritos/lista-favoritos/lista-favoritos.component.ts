import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FavoritosService } from '../../../services/favoritos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../services/alert.service';
import { Favoritos } from '../../../interfaces/favoritos.interface';

@Component({
    selector: 'app-lista-favoritos',
    imports: [CommonModule, FormsModule, RouterModule],
    standalone:true,
    templateUrl: './lista-favoritos.component.html',
    styleUrl: './lista-favoritos.component.css'
})
export class ListaFavoritosComponent implements OnInit{
  listas: Favoritos[] = [];
  userId: number;
  showConfirmDialog: boolean = false;
  listaToDeleteId: string | null = null;

  constructor(private favoritosService: FavoritosService,
    private router: Router,
    private alertService : AlertService
  ) {
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
    this.showConfirmDialog = true;
    this.listaToDeleteId = id;
  }

  confirmDelete(confirm: boolean): void {
    if (confirm && this.listaToDeleteId) {
      this.favoritosService.deleteLista(this.listaToDeleteId).subscribe({
        next: (resultado) => {
          if (resultado) {
            this.alertService.mostrarAlerta('success', 'Lista eliminada con éxito');
            this.cargarListas();
          } else {
            console.error('No se pudo eliminar la lista');
          }
        },
        error: (err) => {
          console.error('Error al eliminar la lista', err);
          this.alertService.mostrarAlerta('error', 'Error al eliminar la lista');
        },
      });
    }
    this.showConfirmDialog = false;
    this.listaToDeleteId = null;
  }

  eliminarPeliculadeLista(lista: Favoritos, peliculaId: number): void {
    lista.peliculas = lista.peliculas.filter(pelicula => pelicula.id !== peliculaId);
    this.favoritosService.putLista(lista.id, lista).subscribe({
      next: () => {
        console.log('Película eliminada de la lista de favoritos');
        this.alertService.mostrarAlerta('success', 'Pelicula eliminada con éxito');
      },
      error: (err) => {
        console.error('Error al eliminar la película de la lista', err);
        this.alertService.mostrarAlerta('error', 'Error al eliminar la pelicula de la lista');
      }
    });
  }

  eliminarActordeLista(lista: any, actorId: number) {
    const actoresActualizados = lista.actores.filter((actor: any) => actor.id !== actorId);
    const listaActualizada = { ...lista, actores: actoresActualizados };

    this.favoritosService.putLista(lista.id, listaActualizada).subscribe({
      next: () => {
        this.alertService.mostrarAlerta('success', 'Actor eliminado de la lista con éxito');
        this.cargarListas();
      },
      error: (err) => {
        console.error('Error al eliminar el actor de la lista:', err);
        this.alertService.mostrarAlerta('error', 'Ocurrió un problema al eliminar el actor. Inténtelo nuevamente.');
      }
    });
  }
}

