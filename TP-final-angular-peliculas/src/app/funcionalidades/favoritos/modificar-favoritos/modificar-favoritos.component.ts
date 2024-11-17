import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FavoritosService } from '../../../services/favoritos.service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../services/alert.service';
import { Favoritos } from '../../../interfaces/favoritos.interface';

@Component({
  selector: 'app-modificar-favoritos',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './modificar-favoritos.component.html',
  styleUrl: './modificar-favoritos.component.css'
})
export class ModificarFavoritosComponent implements OnInit{

  listaForm: FormGroup;
  listaFavoritos: Favoritos | undefined;

  constructor(
    private favoritosService: FavoritosService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private alertService : AlertService
  ) {
    // Inicializar el formulario con validaciones
    this.listaForm = this.fb.group({
      nombre: ['', [Validators.required,Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.cargarListaFavoritos();
  }

 // Método para cargar la lista de favoritos por ID
 cargarListaFavoritos(): void {

  const id = this.route.snapshot.paramMap.get('id') || '';
  this.favoritosService.getListaporId(id).subscribe({
    next: (lista) => {
      if(lista){
        this.listaFavoritos = lista;
        this.listaForm.patchValue({
          nombre: lista.nombre,
          descripcion: lista.descripcion,
        });
      } else {
        this.alertService.mostrarAlerta('error', 'No se encontró la lista de favoritos con el ID especificado');
        this.router.navigate(['/favoritos']);
      }
    },
    error: (err) => {
      console.error('Error al cargar la lista de favoritos', err);
      this.alertService.mostrarAlerta('error', 'Error al cargar la lista de favoritos');
      this.router.navigate(['/favoritos']); 
    }
  });
}


  // Guardar los cambios en la lista de favoritos
  guardarCambios(): void {
    if (this.listaFavoritos && this.listaForm.valid) {
      const cambios: Partial<Favoritos> = {
        nombre: this.listaForm.value.nombre,
        descripcion: this.listaForm.value.descripcion,
        peliculas: this.listaFavoritos.peliculas,
        userId: this.listaFavoritos.userId,
      };

      this.favoritosService.putLista(this.listaFavoritos.id, cambios).subscribe({
        next: () => {
          this.alertService.mostrarAlerta('success', 'Lista de favoritos actualizada con éxito');
          this.router.navigate(['/favoritos']);
        },
        error: (err) => {
          console.error('Error al guardar los cambios', err);
        },
      });
    }
  }



}
