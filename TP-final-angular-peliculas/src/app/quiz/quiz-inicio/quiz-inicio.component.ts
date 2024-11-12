import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../nucleo/servicios/auth.service';

@Component({
  selector: 'app-quiz-inicio',
  templateUrl: './quiz-inicio.component.html',
  styleUrls: ['./quiz-inicio.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class QuizInicioComponent {
  dificultadBase: string = 'medium';
  esUsuario = false;

  constructor(private router: Router, private quizService: QuizService, private authService: AuthService) {}

  selectDificultad(dificultadSeleccionada: string) {
    this.dificultadBase = dificultadSeleccionada;
  }

  usuarioConectado(){
    return this.authService.estaAutenticado();
  }

  startQuiz() {
    this.quizService.setDificultad(this.dificultadBase);
    this.router.navigate(['./quiz/question']);
  }

  startMaker(){
    this.router.navigate(['./quiz/preguntasMaker']);
  }

  startVote(){
    this.router.navigate(['./quiz/preguntasMaker']);
  }

}
