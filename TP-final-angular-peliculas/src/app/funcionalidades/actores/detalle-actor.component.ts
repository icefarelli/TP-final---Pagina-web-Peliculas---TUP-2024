// En detalle-actor.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PeliculasService } from '../../services/peliculas.service';

@Component({
  selector: 'app-detalle-actor',
  standalone:true,
  imports:[RouterLink, CommonModule],
  templateUrl: './detalle-actor.component.html',
  styleUrls: ['./detalle-actor.component.css']
})
export class DetalleActorComponent implements OnInit {
  actor: any;
  peliculas: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private peliculasService: PeliculasService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.peliculasService.obtenerActor(id).subscribe(
        actor => {
          this.actor = actor;
          this.cargarPeliculasPorActor(id); // Cargar películas en las que ha participado
        },
        error => {
          console.error('Error al obtener los detalles del actor:', error);
        }
      );
    }
  }


    cargarPeliculasPorActor(actorID: number) {
      this.peliculasService.obtenerPeliculasPorActor(actorID).subscribe(
        response => {
          this.peliculas = response.cast; // Asignar el elenco
        },
        error => {
          console.error('Error al obtener las películas del actor:', error);
        }
      );
    }


  obtenerUrlImagen(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
}