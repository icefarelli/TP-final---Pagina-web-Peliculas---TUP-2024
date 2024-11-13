import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Favoritos } from '../../../nucleo/modelos/favoritos';
import { FavoritosService } from '../../../nucleo/servicios/favoritos.service';
import { CommonModule } from '@angular/common';
import { ListaFavoritosComponent } from '../lista-favoritos/lista-favoritos.component';

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
    private fb: FormBuilder
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
  console.log('Intentando modificar lista con id:', id); // Verifico el id en consola
  this.favoritosService.getListaporId(id).subscribe({
    next: (lista) => {
      if(lista){
        this.listaFavoritos = lista;
      } else {
        alert('No se encontró la lista de favoritos con el ID especificado.');
        this.router.navigate(['/favoritos']); // por si no se encuentra la lista
      }
    },
    error: (err) => {
      console.error('Error al cargar la lista de favoritos', err);
      alert('Error al cargar la lista de favoritos.');
      this.router.navigate(['/favoritos']); //  en caso de error
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
          alert('Lista de favoritos actualizada');
          this.router.navigate(['/favoritos']);
        },
        error: (err) => {
          console.error('Error al guardar los cambios', err);
        },
      });
    }
  }



}
