import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PeliculasService } from '../../../services/peliculas.service';
import { AdministrarReseniasComponent } from "../../resenas/administrar-resenias/administrar-resenias.component";
import { CommonModule } from '@angular/common';
import { FavoritosService } from '../../../services/favoritos.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { Favoritos } from '../../../interfaces/favoritos.interface';
import { Pelicula } from '../../../interfaces/pelicula.interface';

@Component({
  selector: 'app-detalle-peliculas',
  templateUrl: './detalle-peliculas.component.html',
  standalone:true,
  styleUrls: ['./detalle-peliculas.component.css'],
  imports: [AdministrarReseniasComponent, CommonModule, RouterLink,FormsModule]
})
export class DetallePeliculasComponent implements OnInit {
  pelicula?: Pelicula;
  elenco: any[] = []; // Nueva propiedad para el elenco
  listasFavoritos: Favoritos[] = [];
  listaSeleccionada: Favoritos | null = null;
  userId: number;

  constructor(
    private route: ActivatedRoute,
    private peliculasService: PeliculasService,
    private favoritosService: FavoritosService,
    private authService: AuthService,
    private alertService: AlertService
  ) {

    this.userId = Number(localStorage.getItem('userId'))
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.peliculasService.obtenerDetallePelicula(id).subscribe(
        pelicula => {
          this.pelicula = pelicula;
          this.cargarElenco(id); // Llama a cargar el elenco
          this.cargarListasFavoritos(); // Llama a cargar listas de favoritos

        }
      );
    }
  }

  cargarElenco(id: number) {
    this.peliculasService.obtenerElencoPelicula(id).subscribe(
      response => {
        this.elenco = response.cast; // Asigna el elenco a la propiedad
      },
      error => {
        console.error('Error al cargar el elenco:', error);
      }
    );
  }
  cargarListasFavoritos() {
    this.favoritosService.getListasPorUsuario(this.userId).subscribe({
      next: (listas) => {
        this.listasFavoritos = listas;
      },
      error: (err) => {
        console.error('Error al cargar las listas de favoritos', err);
      }
    });
  }

  agregarPeliculaAFavoritos() {
    if (this.listaSeleccionada && this.pelicula) {
      // Verifico si la película ya está en la lista
    const peliculaYaEnLista = this.listaSeleccionada.peliculas.some(
      (p: Pelicula) => p.id === this.pelicula?.id
    );

    if (peliculaYaEnLista) {
      this.alertService.mostrarAlerta('error', 'La pelicula ya fue cargada en la lista de favoritos');
      return;
    }
      const peliculasActualizadas = [...this.listaSeleccionada.peliculas, this.pelicula];

      const listaConPelicula = {
        ...this.listaSeleccionada,
        peliculas: peliculasActualizadas
      };

      this.favoritosService.putLista(this.listaSeleccionada.id, listaConPelicula).subscribe({
        next: () => {
          this.alertService.mostrarAlerta('success', 'Pelicula agregada con éxito a la lista');
          this.cargarListasFavoritos();
        },
        error: (err) => {
          console.error('Error al agregar la película a la lista de favoritos', err);
        }
      });
    } else {
      this.alertService.mostrarAlerta('error', 'Seleccione una lista ');
    }
  }


  obtenerUrlImagen(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  usuarioConectado(){
    return this.authService.estaAutenticado();
  }
}
