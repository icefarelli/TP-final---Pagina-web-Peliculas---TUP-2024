import { Component, OnInit } from '@angular/core';
import { ReseniasService } from '../../../nucleo/servicios/resenias.service';
import { AuthService } from '../../../nucleo/servicios/auth.service';
import { Usuario } from '../../../nucleo/servicios/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-resenas',
  templateUrl: './mis-resenas.component.html',
  styleUrls: ['./mis-resenas.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MisResenasComponent implements OnInit {
  resenas: any[] = [];
  usuarioActual: Usuario | null = null;

  constructor(private reseniasService: ReseniasService, private authService: AuthService) {}

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
        // Obtener detalles de la película para cada reseña
        for (const resena of this.resenas) {
          try {
            resena.movieDetails = await this.reseniasService.getMovieDetails(resena.movieId).toPromise();
          } catch (error) {
            console.error(`Error al obtener detalles de la película para movieId ${resena.movieId}:`, error);
            resena.movieDetails = null; // Manejar el error según sea necesario
          }
        }
      } catch (error) {
        console.error('Error al cargar las reseñas:', error);
      }
    } else {
      console.error('Usuario no autenticado o nombre de usuario no disponible');
    }
  }
}
