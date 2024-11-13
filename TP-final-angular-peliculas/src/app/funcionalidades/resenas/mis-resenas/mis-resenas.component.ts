import { Component, OnInit } from '@angular/core';
import { ReseniasService } from '../../../nucleo/servicios/resenias.service';
import { AuthService } from '../../../nucleo/servicios/auth.service';
import { Usuario } from '../../../nucleo/servicios/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-resenas',
  templateUrl: './mis-resenas.component.html',
  styleUrls: ['./mis-resenas.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MisResenasComponent implements OnInit {
  resenas: any[] = [];
  usuarioActual: Usuario | null = null;

  constructor(private reseniasService: ReseniasService, private authService: AuthService) {}

  ngOnInit(): void {
    // Al iniciar el componente, obtenemos el usuario actual y cargamos sus reseñas
    this.authService.getUsuarioActual().subscribe(usuario => {
      this.usuarioActual = usuario;
      this.cargarResenas(); // Llamamos a cargarResenas aquí
    });
  }

  async cargarResenas(): Promise<void> {
    if (this.usuarioActual && this.usuarioActual.usuario) { // Asegúrate de que el campo 'usuario' esté disponible
      const author = this.usuarioActual.usuario; // Usar el nombre de usuario como author
      try {
        this.resenas = await this.reseniasService.getReviewsByAuthor(author); // Llamar al nuevo método
      } catch (error) {
        console.error('Error al cargar las reseñas:', error);
      }
    } else {
      console.error('Usuario no autenticado o nombre de usuario no disponible');
    }
  }
}
