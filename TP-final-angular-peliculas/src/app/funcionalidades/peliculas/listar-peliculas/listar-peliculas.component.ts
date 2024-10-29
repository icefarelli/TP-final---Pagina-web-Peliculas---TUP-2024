import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, forkJoin } from 'rxjs';
import { Genero, PeliculasService } from '../../../nucleo/servicios/peliculas.service';
import { Pelicula } from '../../../nucleo/modelos/pelicula.interface';


@Component({
  selector: 'app-listar-peliculas',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './listar-peliculas.component.html',
  styleUrls: ['./listar-peliculas.component.css']
})
export class ListarPeliculasComponent implements OnInit, OnDestroy {
  peliculas: Pelicula[] = [];
  peliculasFiltradas: Pelicula[] = [];
  generos: Genero[] = [];
  anios: number[] = [];
  paginaActual = 1;
  terminoBusqueda: string = '';
  private busquedaSubject = new Subject<string>();

  filtros = {
    genero: '',
    anio: '',
    calificacionMinima: 0
  };

  constructor(
    private peliculasService: PeliculasService,
    private router: Router
  ) {
    // Generar array de años desde 1900 hasta el año actual
    const añoActual = new Date().getFullYear();
    for (let año = añoActual; año >= 1900; año--) {
      this.anios.push(año);
    }

    // Configurar el observable de búsqueda
    this.busquedaSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(termino => {
        if (termino.trim()) {
          return this.peliculasService.buscarPeliculas(termino);
        } else {
          return this.peliculasService.obtenerPeliculasPopulares(1);
        }
      })
    ).subscribe(response => {
      this.peliculas = response.results;
      this.peliculasFiltradas = [...this.peliculas];
      this.aplicarFiltros();
    });
  }

  ngOnInit() {
    this.cargarPeliculasYGeneros();
  }

  ngOnDestroy() {
    this.busquedaSubject.complete();
  }

  cargarPeliculasYGeneros() {
    forkJoin({
      peliculas: this.peliculasService.obtenerPeliculasPopulares(this.paginaActual),
      generos: this.peliculasService.obtenerGeneros()
    }).subscribe({
      next: (resultado) => {
        this.peliculas = resultado.peliculas.results;
        this.peliculasFiltradas = [...this.peliculas];
        this.generos = resultado.generos.genres;
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
      }
    });
  }

  buscar(evento: Event) {
    const termino = (evento.target as HTMLInputElement).value;
    this.busquedaSubject.next(termino);
  }

  obtenerUrlImagen(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  verDetalle(id: number) {
    this.router.navigate(['/pelicula', id]);
  }

  obtenerNombresGeneros(generoIds: number[]): string {
    return generoIds
      .map(id => this.generos.find(g => g.id === id)?.name)
      .filter(name => name)
      .join(', ');
  }

  aplicarFiltros() {
    this.peliculasFiltradas = this.peliculas.filter(pelicula => {
      let cumpleFiltros = true;

      // Filtro por género
      if (this.filtros.genero) {
        cumpleFiltros = cumpleFiltros && pelicula.genre_ids.includes(Number(this.filtros.genero));
      }

      // Filtro por año
      if (this.filtros.anio) {
        const añoPelicula = new Date(pelicula.release_date).getFullYear();
        cumpleFiltros = cumpleFiltros && añoPelicula === Number(this.filtros.anio);
      }

      // Filtro por calificación
      if (this.filtros.calificacionMinima > 0) {
        cumpleFiltros = cumpleFiltros && pelicula.vote_average >= this.filtros.calificacionMinima;
      }

      return cumpleFiltros;
    });
  }

  limpiarFiltros() {
    this.filtros = {
      genero: '',
      anio: '',
      calificacionMinima: 0
    };
    this.peliculasFiltradas = [...this.peliculas];
  }
}