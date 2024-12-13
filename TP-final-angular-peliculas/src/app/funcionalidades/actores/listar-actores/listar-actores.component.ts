import { Component, OnInit } from '@angular/core';
import { PeliculasService } from '../../../services/peliculas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Actor } from '../../../interfaces/actor';

@Component({
    selector: 'app-listar-actores',
    imports: [CommonModule, FormsModule],
    standalone:true,
    templateUrl: './listar-actores.component.html',
    styleUrl: './listar-actores.component.css'
})
export class ListarActoresComponent implements OnInit{
  terminoBusqueda: string = '';
  actoresFiltrados: any[] = [];
  actoresOriginales: any[] = [];

  filtros = {
    popularidadMinima: 0,
    genero: '',
  };


  constructor(private peliculasService: PeliculasService, private router: Router) { }

  ngOnInit(): void {
    this.buscarActores();
  }

  buscarActores(): void {
    if (this.terminoBusqueda.trim() === '') {
      this.actoresFiltrados = [];
      return;
    }

    this.peliculasService.buscarActores(this.terminoBusqueda).subscribe((response) => {
      this.actoresFiltrados = response.results.filter((actor: Actor) =>
        actor.profile_path && actor.name && actor.popularity > 0
      );
    });
  }


  obtenerUrlImagen(profilePath: string): string {
    return profilePath
      ? `https://image.tmdb.org/t/p/w200${profilePath}`
      : 'assets/default-profile.png';
  }

  verDetalle(id: number): void {
      this.router.navigate(['/actor', id]);
    }
}
