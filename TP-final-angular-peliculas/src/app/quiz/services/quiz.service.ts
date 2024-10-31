import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private questions: Question[] = [];
  private currentQuestionIndex = 0;
  private score = 0;
  private difficulty: string = 'medium'; // Dificultad por defecto

  constructor(private http: HttpClient) {}

  setDifficulty(difficulty: string) {
    this.difficulty = difficulty;
  }

  loadQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>('assets/questions.json').pipe(
      map(allQuestions => {
        // Filtramos las preguntas por dificultad
        const filteredQuestions = allQuestions.filter(q => q.difficulty === this.difficulty);
        // Mezclamos y seleccionamos 10 preguntas
        this.questions = this.shuffleArray(filteredQuestions).slice(0, 10);
        return this.questions;
      })
    );
  }

  getCurrentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  answerQuestion(answer: string): boolean {
    const correct = answer === this.getCurrentQuestion().correctAnswer;
    if (correct) {
      this.score++;
    }
    return correct;
  }

  nextQuestion(): boolean {
    this.currentQuestionIndex++;
    return this.currentQuestionIndex < this.questions.length;
  }

  getScore(): number {
    return this.score;
  }

  resetQuiz(): void {
    this.currentQuestionIndex = 0;
    this.score = 0;
  }

  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
