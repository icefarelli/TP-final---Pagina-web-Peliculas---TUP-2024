import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AlertService } from '../../services/alert.service';

@Component({
    selector: 'app-alert',
    imports: [CommonModule],
    standalone:true,
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  mensaje = '';
  tipo: 'success' | 'error' | 'info' = 'info';
  visible = false;
  private subscription: Subscription;

  constructor(private alertService: AlertService) {
    this.subscription = this.alertService.alert$.subscribe(alert => {
      if (alert.mensaje) {
        this.mensaje = alert.mensaje;
        this.tipo = alert.tipo;
        this.visible = true;
      } else {
        this.visible = false;
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
