import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReseniasService } from '../../../nucleo/servicios/resenias.service';
import { AuthService } from '../../../nucleo/servicios/auth.service';

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
    rating: 0  // Asegúrate de tener la propiedad rating dentro de newReview
  };
  currentUser: any = null;
  stars: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Estrellas disponibles

  constructor(
    private reseniasService: ReseniasService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getUsuarioActual().subscribe(user => {
      this.currentUser = user;
    });

    this.loadReviews();
  }

  loadReviews() {
    if (this.movieId) {
      this.loading = true;
      this.reseniasService.getMovieReviews(this.movieId)
        .subscribe({
          next: (response) => {
            this.reviews = response.results;
            this.loadLocalReviews();
          },
          error: (error) => {
            this.error = 'Error al cargar las reseñas de TMDb';
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
      this.error = 'Error al cargar las reseñas locales';
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
      this.error = 'Debes iniciar sesión para escribir una reseña';
      return;
    }
    this.showReviewForm = !this.showReviewForm;
    if (!this.showReviewForm) {
      this.resetForm(); // Reiniciar el formulario cuando se cierra
    }
  }

  submitReview() {
    if (this.newReview.content && this.newReview.rating && this.currentUser) {
      this.reseniasService.addLocalReview(
        this.movieId,
        this.currentUser.usuario,
        this.newReview.content,
        this.newReview.rating  // Esto se guarda correctamente
      ).subscribe({
        next: (newReview) => {
          this.localReviews.push(newReview);  // Agrega la nueva reseña a la lista local
          this.resetForm();  // Reinicia el formulario
        },
        error: (error) => {
          this.error = 'Error al guardar la reseña';
        }
      });
    }
  }

  resetForm() {
    this.newReview = { content: '', rating: 0 }; // Resetea la puntuación también
    this.showReviewForm = false;
  }

  setRating(rating: number) {
    this.newReview.rating = rating; // Actualiza la puntuación seleccionada
  }
}
