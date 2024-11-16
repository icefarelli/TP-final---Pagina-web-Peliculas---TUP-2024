import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { QuestionUser  } from '../../../interfaces/question.interface';
import { QuizService } from '../../../services/quiz.service';

@Component({
  selector: 'app-visual-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-visual-user.component.html',
  styleUrls: ['./quiz-visual-user.component.css']
})
export class VisualUserComponent implements OnInit {
  questions: Partial<QuestionUser >[] = []; // Solo los campos necesarios
  usuarioId: string | null = null;

  // Inyección de dependencias usando `inject`
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private quizService = inject(QuizService); // Inyecta el servicio

  ngOnInit(): void {
    // Suscribirse a los cambios de preguntas del servicio
    this.quizService.preguntas$.subscribe(questions => {
      this.questions = questions; // Actualiza la lista de preguntas
    });
    this.quizService.fetchQuestions();
  }

  loadUserQuestions(): void {
    this.authService.getUsuarioActual().subscribe({
      next: (user) => {
        if (user) {
          this.usuarioId = user.id!;
          this.fetchQuestions(); // Llamar a la función para cargar preguntas
        }
      },
      error: (error) => {
        console.error('Error al obtener el usuario actual:', error);
      }
    });
  }

  fetchQuestions(): void {
    if (!this.usuarioId) {
      console.error('El usuario ID no está definido.');
      return;
    }

    this.http.get<QuestionUser []>('http://localhost:3000/revision').subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.questions = data
            .filter(question => question.usuarioCreador === this.usuarioId)
            .map(({ question, correctAnswer, incorrectAnswers, difficulty }) => ({
              question,
              correctAnswer,
              incorrectAnswers,
              difficulty,
            }));
        } else {
          console.error('La respuesta no es un arreglo:', data);
        }
      },
      error: (error) => {
        console.error('Error al cargar las preguntas:', error);
      }
    });
  }

  // Método para actualizar las preguntas del usuario
  updateUserQuestions(questions: Partial<QuestionUser >[]): void {
    this.questions = questions.filter(question => question.usuarioCreador === this.usuarioId);
  }
}
