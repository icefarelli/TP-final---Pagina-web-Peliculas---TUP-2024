import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FavoritosService } from '../../../services/favoritos.service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../services/alert.service';
import { Favoritos } from '../../../interfaces/favoritos.interface';

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
    private router: Router,
    private alertService: AlertService
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
      this.favoritosService.getListasPorUsuario(this.userId).subscribe({
        next: (listas) => {
          const maxId = listas.length > 0 ? Math.max(...listas.map(lista => parseInt(lista.id))) : 0;
          const nuevoId = (maxId + 1).toString();


      const nuevaLista: Favoritos = {
        id: nuevoId,
        userId: this.userId,
        nombre: this.listaForm.value.nombre,
        descripcion: this.listaForm.value.descripcion,
        peliculas: [],
      };

      this.favoritosService.postListasPorUsuario(this.userId,nuevaLista).subscribe({
        next: (lista) => {
        this.alertService.mostrarAlerta('success', 'Lista agregada con éxito');
         this.router.navigate(['/favoritos']);
            },
        error: (err) => {
        console.error('Error al agregar la lista:', err);
        this.alertService.mostrarAlerta('error', 'Error al agregar la lista');
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
