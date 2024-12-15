import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PeliculasService } from '../../services/peliculas.service';
import { Actor } from '../../interfaces/actor';
import { Favoritos } from '../../interfaces/favoritos.interface';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { FavoritosService } from '../../services/favoritos.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-detalle-actor',
    imports: [RouterLink, CommonModule,FormsModule],
    standalone:true,
    templateUrl: './detalle-actor.component.html',
    styleUrls: ['./detalle-actor.component.css']
})
export class DetalleActorComponent implements OnInit {
  actor?: any;
  actores?: Actor;
  peliculas: any[] = [];
  listasFavoritos: Favoritos[] = [];
  listaSeleccionada: Favoritos | null = null;
  userId: number;

  constructor(
    private route: ActivatedRoute,
    private peliculasService: PeliculasService,
    private favoritosService: FavoritosService,
    private authService: AuthService,
    private alertService: AlertService,
  ) {
    this.userId = Number(localStorage.getItem('userId'))
  }



  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.peliculasService.obtenerActor(id).subscribe(
        actor => {
          this.actor = actor;
          this.actores = {
            id: actor.id,
            nombre: actor.name,
            profile_path: actor.profile_path,
            ...actor
          };
          this.cargarPeliculasPorActor(id); // Cargar películas en las que ha participado
          this.cargarListasFavoritos();
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

  cargarListasFavoritos() {
    this.favoritosService.getListasPorUsuario(this.userId).subscribe({
      next: (listas) => {

        this.listasFavoritos = listas.map(lista => ({
          ...lista,
          actores: lista.actores || []
        }));
        console.log('Listas de favoritos cargadas:', this.listasFavoritos); // Depuración
      },
      error: (err) => {
        console.error('Error al cargar las listas de favoritos', err);
      }
    });
  }


  agregarActorAFavoritos() {
    console.log('Lista seleccionada:', this.listaSeleccionada); // Depuración
    console.log('Actor:', this.actores); // Depuración

    if (this.listaSeleccionada && this.actores) {
      // Asegúrate de que actores es un array
      const actoresLista = this.listaSeleccionada.actores || [];

      const actorYaEnLista = actoresLista.some(
        (a: Actor) => a.id === this.actores?.id // Verifico si el actor ya está en la lista
      );

      if (actorYaEnLista) {
        this.alertService.mostrarAlerta('error', 'El actor ya fue cargado en la lista de favoritos');
        return;
      }

      const actoresActualizados = [...actoresLista, this.actores];

      const listaConActor = {
        ...this.listaSeleccionada,
        actores: actoresActualizados // Actualizo la lista con los actores
      };

      this.favoritosService.putLista(this.listaSeleccionada.id, listaConActor).subscribe({
        next: () => {
          this.alertService.mostrarAlerta('success', 'Actor agregado con éxito a la lista');
          this.cargarListasFavoritos();
        },
        error: (err) => {
          console.error('Error al agregar el actor a la lista de favoritos', err);
          this.alertService.mostrarAlerta('error', 'Ocurrió un problema al agregar el actor. Inténtelo nuevamente.');
        }
      });
    } else {
      this.alertService.mostrarAlerta('error', 'Seleccione una lista');
    }
  }

  usuarioConectado(){
    return this.authService.estaAutenticado();
  }
}
