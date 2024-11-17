import { Component, OnInit } from '@angular/core';
import { PeliculasService } from '../../services/peliculas.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule], // Asegúrate de importar RouterModule aquí
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.css']
})
export class CarouselComponent implements OnInit {
  popularMovies: any[] = [];
  currentIndex: number = 0;

  constructor(private peliculaService: PeliculasService) {}

  ngOnInit(): void {
    this.cargarPeliculas();
  }

  cargarPeliculas(): void {
    this.peliculaService.obtenerPeliculasPopulares(1).subscribe(
      (data) => {
        this.popularMovies = data.results.slice(0, 5);
        console.log('Películas cargadas para el carrusel:', this.popularMovies);
      },
      (error) => {
        console.error('Error al obtener las películas:', error);
      }
    );
  }

  anterior() {
    this.currentIndex = (this.currentIndex === 0) ? this.popularMovies.length - 1 : this.currentIndex - 1;
  }

  siguiente() {
    this.currentIndex = (this.currentIndex === this.popularMovies.length - 1) ? 0 : this.currentIndex + 1;
  }

  obtenerUrlImagen(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
}
