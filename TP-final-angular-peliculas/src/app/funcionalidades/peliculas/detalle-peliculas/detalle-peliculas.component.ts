import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PeliculasService } from '../../../nucleo/servicios/peliculas.service';
import { Pelicula } from '../../../nucleo/modelos/pelicula.interface';
import { AdministrarReseniasComponent } from "../../resenias/administrar-resenias/administrar-resenias.component";
import { CommonModule } from '@angular/common';
import { Favoritos } from '../../../nucleo/modelos/favoritos';
import id from '@angular/common/locales/id';
import { FavoritosService } from '../../../nucleo/servicios/favoritos.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../nucleo/servicios/auth.service';

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
    private authService: AuthService
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
      // Verifica si la película ya está en la lista
    const peliculaYaEnLista = this.listaSeleccionada.peliculas.some(
      (p: Pelicula) => p.id === this.pelicula?.id
    );

    if (peliculaYaEnLista) {
      alert('La película ya está en la lista de favoritos.');
      return; // Detenemos la ejecución si ya está en la lista
    }
      const peliculasActualizadas = [...this.listaSeleccionada.peliculas, this.pelicula];

      const listaConPelicula = {
        ...this.listaSeleccionada,
        peliculas: peliculasActualizadas
      };

      this.favoritosService.putLista(this.listaSeleccionada.id, listaConPelicula).subscribe({
        next: () => {
          alert('Película agregada a la lista de favoritos');
        },
        error: (err) => {
          console.error('Error al agregar la película a la lista de favoritos', err);
        }
      });
    } else {
      alert('Por favor, selecciona una lista de favoritos y asegúrate de que la película está cargada.');
    }
  }


  obtenerUrlImagen(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
  
  usuarioConectado(){
    return this.authService.estaAutenticado();
  }
}
