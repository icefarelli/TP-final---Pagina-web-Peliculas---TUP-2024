import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PeliculasService } from '../../services/peliculas.service';
import { CarouselComponent } from '../../funcionalidades/carrusel/carrusel.component';
import { PeliculaResponse } from '../../interfaces/pelicula.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CarouselComponent],
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





