import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-result',
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class QuizResultComponent implements OnInit {
  score: number = 0;
  totalQuestions: number = 10;
  resultMessage: string = '';

  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit() {
    this.score = this.quizService.getScore();
    this.setResultMessage();
  }

  setResultMessage() {
    const percentage = (this.score / this.totalQuestions) * 100;
    if (percentage >= 80) {
      this.resultMessage = '¡Excelente! Eres un experto en cine.';
    } else if (percentage >= 60) {
      this.resultMessage = '¡Buen trabajo! Tienes un buen conocimiento de cine.';
    } else if (percentage >= 40) {
      this.resultMessage = 'No está mal, pero aún puedes mejorar.';
    } else {
      this.resultMessage = 'Parece que necesitas ver más películas. ¡Sigue intentando!';
    }
  }

  restartQuiz() {
    this.quizService.resetQuiz();
    // Navega al inicio del quiz en lugar de directamente a las preguntas
    this.router.navigate(['/quiz']);
  }
}
