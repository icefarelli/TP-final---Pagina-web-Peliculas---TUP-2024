import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../../services/quiz.service';

@Component({
    selector: 'app-quiz-resultados',
    templateUrl: './quiz-resultados.component.html',
    styleUrls: ['./quiz-resultados.component.css'],
    imports: [CommonModule],
    standalone:true,
})
export class QuizResultadosComponent implements OnInit {
  puntuacion: number = 0;
  maximoDePreguntas: number = 10;
  mensajeFinal: string = '';

  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit() {
    this.puntuacion = this.quizService.getPuntuacion();
    this.setMensajeFinal();
  }

  setMensajeFinal() {
    const porcentage = (this.puntuacion / this.maximoDePreguntas) * 100;
    if (porcentage >= 80) {
      this.mensajeFinal = '¡Excelente! Eres un experto en cine. ⭐⭐⭐⭐⭐';
    } else if (porcentage >= 60) {
      this.mensajeFinal = '¡Buen trabajo! Tienes un buen conocimiento de cine. 🌟';
    } else if (porcentage >= 40) {
      this.mensajeFinal = 'No está mal, pero aún puedes mejorar. 😐';
    } else {
      this.mensajeFinal = 'Parece que necesitas ver más películas. ¡Sigue intentando! 😢';
    }
  }

  resetearQuiz() {
    this.quizService.resetQuiz();
    this.router.navigate(['./quiz/']);
  }
}
