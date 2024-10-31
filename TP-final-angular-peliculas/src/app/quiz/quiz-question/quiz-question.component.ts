import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { Question } from '../models/question.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-question.component.html',
  styleUrls: ['./quiz-question.component.css']
})
export class QuizQuestionComponent implements OnInit {
  currentQuestion!: Question;
  allAnswers: string[] = [];
  selectedAnswer: string | null = null;
  isCorrect: boolean | null = null;
  questionNumber: number = 1;
  totalQuestions: number = 10;
  containerBackgroundColor: string = '';

  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit() {
    this.quizService.loadQuestions().subscribe(() => {
      this.loadQuestion();
    });
  }

  loadQuestion() {
    this.currentQuestion = this.quizService.getCurrentQuestion();
    this.allAnswers = [
      this.currentQuestion.correctAnswer,
      ...this.currentQuestion.incorrectAnswers
    ];
    this.allAnswers = this.quizService['shuffleArray'](this.allAnswers);
    this.selectedAnswer = null;
    this.isCorrect = null;
    this.changeContainerBackgroundColor();
  }

  changeContainerBackgroundColor() {
    const colors = [
      '#FFD6E7', // Rosa más intenso
      '#C5B4E3', // Púrpura más intenso
      '#B4E3B4', // Verde más intenso
      '#FFD700', // Dorado
      '#87CEEB', // Celeste más intenso
      '#FFB6C1', // Rosa salmón
      '#98FB98', // Verde pálido intenso
      '#DDA0DD',  // Ciruela
      '#FF69B4', // Hot Pink
      '#9370DB', // Medium Purple
      '#32CD32', // Lime Green
      '#FF8C00', // Dark Orange
      '#4169E1', // Royal Blue
      '#FF4500', // Orange Red
      '#20B2AA', // Light Sea Green
      '#BA55D3'  // Medium Orchid
    ];
    this.containerBackgroundColor = colors[Math.floor(Math.random() * colors.length)];
  }

  selectAnswer(answer: string) {
    this.selectedAnswer = answer;
    this.isCorrect = answer === this.currentQuestion.correctAnswer;

    setTimeout(() => {
      this.quizService.answerQuestion(answer);
      if (this.quizService.nextQuestion()) {
        this.questionNumber++;
        this.loadQuestion();
      } else {
        this.router.navigate(['/quiz/result']);
      }
    }, 1000); // Espera 1 segundo antes de pasar a la siguiente pregunta
  }
}
