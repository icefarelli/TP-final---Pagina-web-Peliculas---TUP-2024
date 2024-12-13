import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { QuizService } from '../../../services/quiz.service';

@Component({
    selector: 'app-quiz-inicio',
    templateUrl: './quiz-inicio.component.html',
    styleUrls: ['./quiz-inicio.component.css'],
    standalone:true,
    imports: [CommonModule, FormsModule]
})
export class QuizInicioComponent {
  dificultadBase: string = 'medium';
  esUsuario = false;
  fuentePreguntas: string = 'predefinidas';

  constructor(private router: Router, private quizService: QuizService, private authService: AuthService) {}

  selectDificultad(dificultadSeleccionada: string) {
    this.dificultadBase = dificultadSeleccionada;
  }

  usuarioConectado(){
    return this.authService.estaAutenticado();
  }

  startQuiz() {
    this.quizService.setDificultad(this.dificultadBase);
    this.quizService.loadPreguntasPorFuente(this.fuentePreguntas).subscribe(() => {
      this.router.navigate(['./quiz/question']);
    });
  }

  startMaker(){
    this.router.navigate(['./quiz/qMaker']);
  }

}
