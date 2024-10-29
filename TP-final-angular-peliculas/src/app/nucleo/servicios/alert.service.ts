// src/app/nucleo/servicios/alert.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Alert {
  tipo: 'success' | 'error' | 'info';
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new Subject<Alert>();
  alert$ = this.alertSubject.asObservable();

  mostrarAlerta(tipo: 'success' | 'error' | 'info', mensaje: string) {
    this.alertSubject.next({ tipo, mensaje });
    // Auto-ocultar la alerta después de 3 segundos
    setTimeout(() => {
      this.ocultarAlerta();
    }, 3000);
  }

  ocultarAlerta() {
    this.alertSubject.next({ tipo: 'info', mensaje: '' });
  }
}