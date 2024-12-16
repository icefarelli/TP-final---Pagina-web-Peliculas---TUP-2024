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
import { Meta, Title } from '@angular/platform-browser';

@Component({
    selector: 'app-detalle-peliculas',
    templateUrl: './detalle-peliculas.component.html',
    styleUrls: ['./detalle-peliculas.component.css'],
    standalone:true,
    imports: [AdministrarReseniasComponent, CommonModule, RouterLink, FormsModule]
})
export class DetallePeliculasComponent implements OnInit {
  pelicula?: Pelicula;
  showShareOptions = false;
  elenco: any[] = [];
  listasFavoritos: Favoritos[] = [];
  listaSeleccionada: Favoritos | null = null;
  userId: number;

  constructor(
    private route: ActivatedRoute,
    private peliculasService: PeliculasService,
    private favoritosService: FavoritosService,
    private authService: AuthService,
    private alertService: AlertService,
    private meta: Meta,
    private title: Title
  ) {

    this.userId = Number(localStorage.getItem('userId'))
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.peliculasService.obtenerDetallePelicula(id).subscribe(
        pelicula => {
          this.pelicula = pelicula;
          this.cargarElenco(id);
          this.cargarListasFavoritos();

          //this.title.setTitle(`¡Te recomiendo esta película! - ${this.pelicula.title}`);

          // Establecer las etiquetas Open Graph dinámicamente
          const imageUrl = `https://image.tmdb.org/t/p/w500${this.pelicula.poster_path}`;
          this.meta.updateTag({ name: 'description', content: this.pelicula.overview });
          this.meta.updateTag({ property: 'og:title', content: this.pelicula.title });
          this.meta.updateTag({ property: 'og:description', content: this.pelicula.overview });
          this.meta.updateTag({ property: 'og:url', content: window.location.href });
          this.meta.updateTag({ property: 'og:image', content: imageUrl });
          this.meta.updateTag({ property: 'og:image:width', content: '500' });
          this.meta.updateTag({ property: 'og:image:height', content: '750' });
        }
      );
    }
  }


  cargarElenco(id: number) {
    this.peliculasService.obtenerElencoPelicula(id).subscribe(
      response => {
        this.elenco = response.cast;
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
    const peliculaYaEnLista = this.listaSeleccionada.peliculas.some(
      (p: Pelicula) => p.id === this.pelicula?.id // Verifico si la película ya está en la lista
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

  openShareOptions() {
    this.showShareOptions = !this.showShareOptions;
  }

  obtenerUrlActual(): string {
    return window.location.href; // Devuelve la URL actual
  }

  shareOnWhatsApp() {
    const message = `🎬 ¡Hola! 😊
      Quiero recomendarte una película que seguro te encantará:

      🎥 *${this.pelicula?.title}*
      📖 _Sinopsis:_
      _${this.pelicula?.overview}_

      🎟️ Haz clic en el siguiente enlace para obtener más detalles:
      `;

    const url = this.obtenerUrlActual(); // Obtén la URL actual
    // Compartir en WhatsApp sin mostrar la URL en el mensaje (enlaza el texto con la URL)
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message + url)}`;
    window.open(whatsappUrl, '_blank');
  }



  shareOnFacebook() {
    const title = this.pelicula?.title || 'Recomendación de película';
    const overview = this.pelicula?.overview || 'Sin descripción disponible.';
    const url = this.obtenerUrlActual(); // Obtén la URL actual

    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(
      `🎥 ${this.pelicula?.title}\n📖 Sinopsis: ${overview}`
    )}`;

    window.open(facebookUrl, '_blank');
  }



  copyLink() {
    const url = this.obtenerUrlActual(); // Obtén la URL actual
    navigator.clipboard.writeText(url).then(() => {
      this.alertService.mostrarAlerta('success', 'Enlace copiado al portapapeles');
    }, (err) => {
      console.error('Error al copiar el enlace: ', err);
    });
  }

}
