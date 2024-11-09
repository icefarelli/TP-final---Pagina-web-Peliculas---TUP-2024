import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PeliculasService } from '../../../nucleo/servicios/peliculas.service';
import { Pelicula } from '../../../nucleo/modelos/pelicula.interface';
import { AdministrarReseniasComponent } from "../../resenias/administrar-resenias/administrar-resenias.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-peliculas',
  templateUrl: './detalle-peliculas.component.html',
  standalone:true,
  styleUrls: ['./detalle-peliculas.component.css'],
  imports: [AdministrarReseniasComponent, CommonModule, RouterLink]
})
export class DetallePeliculasComponent implements OnInit {
  pelicula?: Pelicula;
  elenco: any[] = []; // Nueva propiedad para el elenco

  constructor(
    private route: ActivatedRoute,
    private peliculasService: PeliculasService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.peliculasService.obtenerDetallePelicula(id).subscribe(
        pelicula => {
          this.pelicula = pelicula;
          this.cargarElenco(id); // Llama a cargar el elenco
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

  obtenerUrlImagen(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
}