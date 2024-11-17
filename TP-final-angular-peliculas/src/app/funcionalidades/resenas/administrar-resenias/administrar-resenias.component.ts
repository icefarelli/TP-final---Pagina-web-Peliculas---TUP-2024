import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { ReseniasService } from '../../../services/resenias.service';


@Component({
  selector: 'app-administrar-resenias',
  templateUrl: './administrar-resenias.component.html',
  styleUrls: ['./administrar-resenias.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdministrarReseniasComponent implements OnInit {
  @Input() movieId!: number;
  reviews: any[] = [];
  localReviews: any[] = [];
  loading: boolean = false;
  error: string = '';
  currentIndex: number = 0;
  showReviewForm: boolean = false;
  newReview = {
    content: '',
    rating: 0
  };
  currentUser: any = null;
  stars: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private reseniasService: ReseniasService,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    // Cargar el usuario actual
    this.authService.getUsuarioActual().subscribe(user => {
      this.currentUser = user;
    });

    this.loadReviews();
  }

  loadReviews() {
    if (this.movieId) {
      this.loading = true;
       // Cargar el usuario actual
      this.reseniasService.getMovieReviews(this.movieId)
        .subscribe({
          next: (response) => {
            this.reviews = response.results;
            this.loadLocalReviews();
          },
          error: (error) => {
            this.alertService.mostrarAlerta('error', 'Error al cargar las reseñas de TMDb');
            this.loading = false;
          }
        });
    }
  }

  async loadLocalReviews() {
    try {
      this.localReviews = await this.reseniasService.getLocalReviews(this.movieId);
      this.loading = false;
    } catch (error) {
      this.alertService.mostrarAlerta('error', 'Error al cargar las reseñas locales');
      this.loading = false;
    }
  }

  getAllReviews() {
    return [...this.reviews, ...this.localReviews];
  }

  getCurrentReview() {
    return this.getAllReviews()[this.currentIndex];
  }

  nextReview() {
    if (this.currentIndex < this.getAllReviews().length - 1) {
      this.currentIndex++;
    }
  }

  previousReview() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  toggleReviewForm() {
    if (!this.currentUser) {
      this.alertService.mostrarAlerta('error', 'Debes iniciar sesión para escribir una reseña');
      return;
    }
    this.showReviewForm = !this.showReviewForm;
    if (!this.showReviewForm) {
      this.newReview = { content: '', rating: 0,};
    }
  }

  submitReview() {
    if (this.newReview.content && this.currentUser ) {
      if (this.currentReviewId) {
        // Si hay un ID de reseña actual, significa que se está editando
        this.reseniasService.updateLocalReview(this.currentReviewId, this.newReview.content, this.newReview.rating).subscribe({
          next: (updatedReview) => {
            // Actualiza la reseña en la lista local
            const index = this.localReviews.findIndex(review => review.id === this.currentReviewId);
            if (index !== -1) {
              this.localReviews[index] = updatedReview; // Reemplaza la reseña editada
            }
            this.alertService.mostrarAlerta('success', 'Reseña actualizada con éxito');
            this.resetForm(); // Reinicia el formulario
          },
          error: (error) => {
            this.alertService.mostrarAlerta('error', 'Error al actualizar la reseña');
          }
        });
      } else {
        // Crear una nueva reseña
        this.reseniasService.addLocalReview(
          this.movieId,
          this.currentUser .usuario,
          this.newReview.content,
          this.newReview.rating
        ).subscribe({
          next: (newReview) => {
            this.localReviews.push(newReview);  // Agrega la nueva reseña a la lista local
            this.alertService.mostrarAlerta('success', 'Reseña agregada con éxito'); // Mensaje modificado
            this.resetForm();  // Reinicia el formulario
          },
          error: (error) => {
            this.alertService.mostrarAlerta('error', 'Error al guardar la reseña');
          }
        });
      }
    }
  }

// Agrega un método para reiniciar el formulario
resetForm() {
  this.newReview = { content: '' , rating: 0};
  this.showReviewForm = false;
  this.currentReviewId = null; // Reinicia el ID de la reseña actual
}

// Opcional: Métodos para editar y eliminar reseñas
canEditReview(review: any): boolean {
  return review.isLocal && this.currentUser  &&
         review.author === this.currentUser .usuario;
}

deleteReview(reviewId: number) {
  if (confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
    this.reseniasService.deleteReview(reviewId).subscribe({
      next: () => {
        this.loadLocalReviews();
        this.alertService.mostrarAlerta('success', 'Reseña eliminada con éxito'); // Mensaje de éxito
      },
      error: (error) => {
        this.alertService.mostrarAlerta('error', 'Error al eliminar la reseña');
      }
    });
  }
}

currentReviewId: number | null = null; // Agrega esta propiedad para almacenar el ID de la reseña actual

editReview(review: any): void {
  this.newReview.content = review.content; // Cargar el contenido de la reseña en el formulario
  this.newReview.rating = review.rating;   // Cargar la puntuación en el formulario
  this.showReviewForm = true;              // Mostrar el formulario de reseña para editar
  this.currentReviewId = review.id;        // Guardar el ID de la reseña actual
  this.alertService.mostrarAlerta('info', 'Estás editando la reseña'); // Mensaje al editar
}

setRating(rating: number) {
  this.newReview.rating = rating; // Actualiza la puntuación seleccionada
}

}

