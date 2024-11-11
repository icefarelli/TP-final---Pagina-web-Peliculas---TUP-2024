import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FavoritosService } from '../../../nucleo/servicios/favoritos.service';
import { Favoritos } from '../../../nucleo/modelos/favoritos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agregar-favoritos',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './agregar-favoritos.component.html',
  styleUrl: './agregar-favoritos.component.css'
})
export class AgregarFavoritosComponent implements OnInit{
  listaForm: FormGroup;
  userId: number;

  constructor(
    private fb: FormBuilder,
    private favoritosService: FavoritosService,
    private router: Router
  ) {

    // Inicialización del formulario
    this.listaForm = this.fb.group({
      nombre: ['', [Validators.required,Validators.minLength(5)]],
      descripcion: ['', [Validators.required,Validators.minLength(10)]],
    });

    this.userId = Number(localStorage.getItem('userId')) // obtengo el userId del usuario autenticado
  }
  ngOnInit(): void {
    this.agregarLista();
  }

  // Método para agregar la lista de favoritos
  agregarLista() {
    if (this.listaForm.valid) {
      // Primero, obtengo la lista actual de favoritos para calcular el siguiente ID
      this.favoritosService.getListasPorUsuario(this.userId,).subscribe({
        next: (listas) => {
          // Calcula el siguiente ID basado en el ID más alto de las listas existentes
          const maxId = listas.length > 0 ? Math.max(...listas.map(lista => lista.id)) : 0;
          const nuevoId = maxId + 1;

          // Crea la nueva lista con el ID incrementado

      const nuevaLista: Favoritos = {
        id: nuevoId,
        userId: this.userId,
        nombre: this.listaForm.value.nombre,
        descripcion: this.listaForm.value.descripcion,
        peliculas: [],
      };

          // Llama a postListas para agregar la nueva lista
      this.favoritosService.postListasPorUsuario(this.userId,nuevaLista).subscribe({
        next: (lista) => {

        console.log('Lista agregada:', lista);
        // Navegar de regreso a la página de listas de favoritos
         this.router.navigate(['/favoritos']);
            },
        error: (err) => {
        console.error('Error al agregar la lista:', err);
            },
          });
        },
        error: (err) => {
          console.error('Error al cargar las listas:', err);
        },
      });
    } else {
      console.error('Formulario no válido');
    }
  }

}
