import { Component, ComponentRef, OnInit, ViewContainerRef } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AlertComponent } from './compartidos/alert/alert.component';
import { NavbarComponent } from './compartidos/navbar/navbar.component';
import { AuthDialogComponent } from './funcionalidades/usuarios/auth-dialog/auth-dialog.component';
import { Usuario } from './interfaces/auth.interface';
import { AuthService } from './services/auth.service';
import { UrlService } from './services/url.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, CommonModule, AlertComponent, NavbarComponent],
    standalone:true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'TP-final-angular-peliculas';
  usuarioActual$: Observable<Usuario | null>;
  ngrokUrl$!: Observable<string>;

  private authDialogRef: ComponentRef<AuthDialogComponent> | null = null;

  constructor(private authService: AuthService, private viewContainerRef: ViewContainerRef, private router: Router, private urlService: UrlService) {

    this.usuarioActual$ = this.authService.getUsuarioActual();

    window.addEventListener('cerrarDialog', () => {
      this.cerrarAuthDialog();
    });

  }

ngrokUrl: string = '';

ngOnInit() {
  this.ngrokUrl$ = this.urlService.loadNgrokUrl();
}


  mostrarAuthDialog() {
    this.cerrarAuthDialog();
    this.authDialogRef = this.viewContainerRef.createComponent(AuthDialogComponent);
  }

  cerrarAuthDialog() {
    if (this.authDialogRef) {
      this.authDialogRef.destroy();
      this.authDialogRef = null;
    }
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['']);
  }

}
