import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { Question } from '../models/question.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-preguntas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-preguntas.component.html',
  styleUrls: ['./quiz-preguntas.component.css']
})
export class QuizPreguntasComponent implements OnInit {
  preguntaActual!: Question;
  respuestas: string[] = [];
  respuestaSeleccionada: string | null = null;
  esCorrecta: boolean | null = null;
  preguntaNro: number = 1;
  totalPreguntas: number = 10;
  colorFondoPreguntas: string = ''; // Asegúrate de que esta propiedad esté definida.

  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit() {
    this.quizService.loadPreguntas().subscribe(() => {
      this.loadPregunta();
    });
  }

  loadPregunta() {
    this.preguntaActual = this.quizService.getPreguntaActual();
    this.respuestas = [
      this.preguntaActual.correctAnswer,
      ...this.preguntaActual.incorrectAnswers
    ];
    this.respuestas = this.quizService['mixPreguntas'](this.respuestas);
    this.respuestaSeleccionada = null;
    this.esCorrecta = null;
    this.funcionCambiarFondoPreguntas(); // Llama a la función para cambiar el fondo.
  }

  funcionCambiarFondoPreguntas() {
    const colors = [
      'red', 'yellow', 'blue', 'orange', 'violet', 'purple', 'green', 'greenyellow', 'aqua', 'cornflowerblue'
    ];
    this.colorFondoPreguntas = colors[Math.floor(Math.random() * colors.length)];
  }

  respuestaSelect(answer: string) {
    this.respuestaSeleccionada = answer;
    this.esCorrecta = answer === this.preguntaActual.correctAnswer;

    setTimeout(() => {
      this.quizService.respuestaPreguntas(answer);
      if (this.quizService.nextPregunta()) {
        this.preguntaNro++;
        this.loadPregunta();
      } else {
        this.router.navigate(['/quiz/result']);
      }
    }, 1000);
  }
}
