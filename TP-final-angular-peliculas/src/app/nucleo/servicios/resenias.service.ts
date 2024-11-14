import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface LocalReview {
  movieId: number;
  author: string;
  content: string;
  created_at: string;
  rating: number;
  isLocal?: boolean;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReseniasService {
  private apiKey = '994821c417975e9a3fa11a2cddb089ba';
  private baseUrl = 'https://api.themoviedb.org/3';
  private localReviewsUrl = 'http://localhost:3000/reseñas';

  constructor(private http: HttpClient) {}

  // Obtiene reseñas desde la API de TMDb
  getMovieReviews(movieId: number): Observable<any> {
    return this.http.get<{results: any[]}>(`${this.baseUrl}/movie/${movieId}/reviews?api_key=${this.apiKey}&language=es-ES`)
      .pipe(
        map(response => ({
          ...response,
          results: (response.results || []).map(review => ({
            ...review,
            isLocal: false
          }))
        }))
      );
  }

  async getLocalReviews(movieId: number): Promise<LocalReview[]> {
    try {
      const response = await this.http.get<LocalReview[]>(this.localReviewsUrl).toPromise();

      if (response) {
        // Filtra las reseñas por movieId y marca como locales
        return response
          .filter(review => review.movieId === movieId)
          .map(review => ({
            ...review,
            isLocal: true
          }));
      }
      return [];
    } catch (error) {
      console.error('Error al obtener las reseñas locales:', error);
      return [];
    }
  }

  // Agrega una reseña local al JSON en el servidor local
  addLocalReview(movieId: number, author: string, content: string, rating: number): Observable<LocalReview> {
    const newReview: LocalReview = {
      movieId,
      author,
      content,
      created_at: new Date().toISOString(),
      rating,
      isLocal: true
    };

    return this.http.post<LocalReview>(this.localReviewsUrl, newReview);
  }


  // Opcional: Método para eliminar una reseña (solo si el usuario es el autor)
  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete(`${this.localReviewsUrl}/${reviewId}`);
  }

  // Opcional: Método para editar una reseña (solo si el usuario es el autor)
  updateReview(reviewId: number, content: string, rating: number): Observable<LocalReview> {
    return this.http.patch<LocalReview>(`${this.localReviewsUrl}/${reviewId}`, {
      content,
      rating,
      updated_at: new Date().toISOString()
    });
  }

  updateLocalReview(reviewId: number, content: string, rating: number): Observable<LocalReview> {
    return this.http.patch<LocalReview>(`${this.localReviewsUrl}/${reviewId}`, {
      content,
      rating
    });
  }

async getReviewsByAuthor(author: string): Promise<LocalReview[]> {
  try {
    const response = await this.http.get<LocalReview[]>(this.localReviewsUrl).toPromise();

    if (response) {
      // Filtra las reseñas solo por author
      return response
        .filter(review => review.author === author) // Filtra por author
        .map(review => ({
          ...review,
          isLocal: true
        }));
    }
    return [];
  } catch (error) {
    console.error('Error al obtener las reseñas por author:', error);
    return [];
  }
}

}
