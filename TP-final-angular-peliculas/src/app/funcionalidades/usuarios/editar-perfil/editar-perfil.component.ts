
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../interfaces/auth.interface';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-editar-perfil',
    imports: [ReactiveFormsModule, CommonModule],
    standalone:true,
    templateUrl: './editar-perfil.component.html',
    styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit {
  perfilForm!: FormGroup;
  usuarioActual!: Usuario | null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private alertService: AlertService) { }

  ngOnInit(): void {
    this.authService.getUsuarioActual().subscribe(usuario => {
      this.usuarioActual = usuario;
      this.initializeForm();
    });
  }

  initializeForm() {
    this.perfilForm = this.fb.group({
      nombre: [this.usuarioActual?.nombre || '', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      apellido: [this.usuarioActual?.apellido || '', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      email: [this.usuarioActual?.email || '', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      fechaNacimiento: [this.usuarioActual?.fechaNacimiento || '', Validators.required]
    });
  }

  onSubmit() {
    if (this.perfilForm.valid) {
      const updated: Usuario = {
        ...this.usuarioActual,
        ...this.perfilForm.value
      };

      this.authService.cambiarDatosUsuario(updated).subscribe({
        next: () => {
          this.alertService.mostrarAlerta('success', 'Datos actualizados exitosamente')
          this.router.navigate(['/mi-perfil']);
        },
        error: (error) => {
          console.error('Error al actualizar los datos', error);
          this.alertService.mostrarAlerta('error', 'Error al actualizar los datos')
        }
      });
    }
  }
}
