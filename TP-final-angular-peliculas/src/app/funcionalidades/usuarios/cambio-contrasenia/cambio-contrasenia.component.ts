import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-cambio-contrasenia',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cambio-contrasenia.component.html',
  styleUrl: './cambio-contrasenia.component.css'
})
export class CambioContraseniaComponent {
/*   @Input() userId!: string; // Recibimos el ID del usuario
 */  userId: string|null = localStorage.getItem('userId');
  changePasswordForm: FormGroup;

  constructor(private fb: FormBuilder, 
    private authService: AuthService, 
    private alertService: AlertService,
    private router: Router) {

    this.changePasswordForm = this.fb.group({
      nuevaContrasenia: ['', [Validators.required, Validators.minLength(4)]],
      confirmarContrasenia: ['', [Validators.required]]
    });
  }

  cambiarContrasenia(): void {
    if (this.changePasswordForm.valid) {
      const { nuevaContrasenia, confirmarContrasenia } = this.changePasswordForm.value;
      if (nuevaContrasenia === confirmarContrasenia) {
        this.authService.cambiarContrasenia(this.userId, nuevaContrasenia).subscribe({
          next: () => {
            this.alertService.mostrarAlerta("success", "Contraseña cambiada correctamente")
            this.changePasswordForm.reset();
            this.router.navigate(['/mi-perfil']);
          },
          error: (error) => {
            this.alertService.mostrarAlerta("error", "Error al cambiar contraseña")
          }
        });
      } else {
        this.alertService.mostrarAlerta("error", "Las contraseñas no coinciden")
      }
    }
  }
}


