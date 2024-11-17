import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, forkJoin } from 'rxjs';
import { Genero } from '../../../interfaces/genero.interface';
import { Pelicula } from '../../../interfaces/pelicula.interface';
import { PeliculasService } from '../../../services/peliculas.service';


@Component({
  selector: 'app-listar-peliculas',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  //de aca se modifica la cantidad de peliculas que quiero mostrar por pantalla, esto es para reducir el tiempo de carga. 
  //Las busquedas se hacen sobre el total de peliculas
  cantidadAMostrar: number = 200; 

  constructor(
    private peliculasService: PeliculasService,
    private router: Router
  ) {

    const añoActual = new Date().getFullYear();
    for (let año = añoActual; año >= 1900; año--) {
      this.anios.push(año);
    }

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
    this.peliculasService.obtenerTodasLasPeliculas().subscribe({
      next: (resultado) => {
        this.peliculas = resultado; 
        this.peliculasFiltradas = this.peliculas.slice(0, this.cantidadAMostrar);
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
      }
    });


    this.peliculasService.obtenerGeneros().subscribe({
      next: (resultado) => {
        this.generos = resultado.genres; 
      },
      error: (error) => {
        console.error('Error al cargar géneros:', error);
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


      if (this.filtros.genero) {
        cumpleFiltros = cumpleFiltros && pelicula.genre_ids.includes(Number(this.filtros.genero));
      }


      if (this.filtros.anio) {
        const añoPelicula = new Date(pelicula.release_date).getFullYear();
        cumpleFiltros = cumpleFiltros && añoPelicula === Number(this.filtros.anio);
      }


      if (this.filtros.calificacionMinima > 0) {
        cumpleFiltros = cumpleFiltros && pelicula.vote_average >= this.filtros.calificacionMinima;
      }

      return cumpleFiltros;
    }).slice(0, this.cantidadAMostrar); 
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