import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../interfaces/auth.interface';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { ReseniasService } from '../../../services/resenias.service';

@Component({
    selector: 'app-mis-resenas',
    templateUrl: './mis-resenias.component.html',
    styleUrls: ['./mis-resenias.component.css'],
    standalone:true,
    imports: [CommonModule, FormsModule]
})
export class MisResenasComponent implements OnInit {
  resenas: any[] = [];
  usuarioActual: Usuario | null = null;
  editingReview: any = null;
  stars: number[] = [1, 2, 3, 4, 5,6,7,8,9,10]; // Array para las estrellas

  constructor(
    private reseniasService: ReseniasService,
    private authService: AuthService,
    private alertService: AlertService

  ) {}

  ngOnInit(): void {
    this.authService.getUsuarioActual().subscribe(usuario => {
      this.usuarioActual = usuario;
      this.cargarResenas();
    });
  }

  async cargarResenas(): Promise<void> {
    if (this.usuarioActual && this.usuarioActual.usuario) {
      const author = this.usuarioActual.usuario;
      try {
        this.resenas = await this.reseniasService.getReviewsByAuthor(author);
        for (const resena of this.resenas) {
          try {
            resena.movieDetails = await this.reseniasService.getMovieDetails(resena.movieId).toPromise();
          } catch (error) {
            console.error(`Error al obtener detalles de la película para movieId ${resena.movieId}:`, error);
            resena.movieDetails = null;
          }
        }
      } catch (error) {
        console.error('Error al cargar las reseñas:', error);
      }
    } else {
      console.error('Usuario no autenticado o nombre de usuario no disponible');
    }
  }

  deleteReview(reviewId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
      this.reseniasService.deleteReview(reviewId).subscribe({
        next: () => {
          this.cargarResenas();
          this.alertService.mostrarAlerta('success', 'Reseña eliminada con éxito');
        },
        error: (error) => {
          this.alertService.mostrarAlerta('error', 'Error al eliminar la reseña');
        }
      });
    }
  }

  editReview(resena: any) {
    this.editingReview = { ...resena };
  }

  saveEdit() {
    if (this.editingReview) {
      this.reseniasService.updateReview(this.editingReview.id, this.editingReview.content, this.editingReview.rating).subscribe({
        next: () => {
          this.cargarResenas();
          this.alertService.mostrarAlerta('success', 'Reseña editada con éxito');
          this.editingReview = null;
        },
        error: (error) => {
          this.alertService.mostrarAlerta('error', 'Error al editar la reseña');
        }
      });
    }
  }

  cancelEdit() {
    this.editingReview = null;
  }

  setRating(rating: number): void {
    this.editingReview.rating = rating;
  }
}

