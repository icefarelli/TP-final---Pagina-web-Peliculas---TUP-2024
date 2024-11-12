import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PeliculasService } from '../../nucleo/servicios/peliculas.service';
import { Pelicula, PeliculaResponse } from '../../nucleo/modelos/pelicula.interface';
import { RouterLink } from '@angular/router';
import { ListarPeliculasComponent } from '../../funcionalidades/peliculas/listar-peliculas/listar-peliculas.component';
import { CarouselComponent } from '../../funcionalidades/carrusel/carrusel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, CarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  pelicula?: PeliculaResponse;


  constructor(
    private route: Router,
    private peliculasService: PeliculasService
  ) {}



  explorarPeliculas(): void {
    this.route.navigate(['/peliculas']);
  }
}





