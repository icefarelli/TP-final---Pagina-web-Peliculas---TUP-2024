import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-start',
  templateUrl: './quiz-start.component.html',
  styleUrls: ['./quiz-start.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class QuizStartComponent {
  selectedDifficulty: string = 'medium';

  constructor(private router: Router, private quizService: QuizService) {}

  selectDifficulty(difficulty: string) {
    this.selectedDifficulty = difficulty;
  }

  startQuiz() {
    this.quizService.setDifficulty(this.selectedDifficulty);
    this.router.navigate(['/quiz/question']);
  }
}
