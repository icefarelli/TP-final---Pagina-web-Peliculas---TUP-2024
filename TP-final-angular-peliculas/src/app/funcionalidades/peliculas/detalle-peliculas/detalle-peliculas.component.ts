// detalle-peliculas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PeliculasService } from '../../../nucleo/servicios/peliculas.service';
import { Pelicula } from '../../../nucleo/modelos/pelicula.interface';
import { RouterLink } from '@angular/router';
import { AdministrarReseniasComponent } from '../../resenias/administrar-resenias/administrar-resenias.component';@Component({
  selector: 'app-detalle-peliculas',
  standalone: true,
  imports: [CommonModule, RouterLink, AdministrarReseniasComponent],
  templateUrl: './detalle-peliculas.component.html',
  styleUrls: ['./detalle-peliculas.component.css']
})
export class DetallePeliculasComponent implements OnInit {
  pelicula?: Pelicula;

  constructor(
    private route: ActivatedRoute,
    private peliculasService: PeliculasService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.peliculasService.obtenerDetallePelicula(id).subscribe(
        pelicula => this.pelicula = pelicula
      );
    }
  }

  obtenerUrlImagen(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
}
