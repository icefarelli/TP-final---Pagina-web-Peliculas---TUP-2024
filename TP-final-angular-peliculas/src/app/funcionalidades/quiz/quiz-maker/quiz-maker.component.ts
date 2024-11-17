import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { QuestionUser } from '../../../interfaces/question.interface';
import { QuizService } from '../../../services/quiz.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-preguntas-maker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent implements OnInit {
  usuarioId?: string | null = null;
  quizForm!: FormGroup;
  showForm: boolean = false;
  errorMessage: string = '';
  successMessage: string | null = null;
  questions: Partial<QuestionUser >[] = [];
  currentQuestionId: string | null = null;

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private quizService = inject(QuizService);

  constructor(private fb: FormBuilder, private alertService: AlertService) {}

  ngOnInit() {
    this.initializeForm();
    this.loadCurrentUser ();
    this.subscribeToQuizService();
  }

  initializeForm() {
    this.quizForm = this.fb.group({
      question: ['', Validators.required],
      correctAnswer: ['', Validators.required],
      incorrectAnswers: this.fb.array(['', '', ''], Validators.required),
      difficulty: ['', Validators.required],
    });
  }

  private loadCurrentUser () {
    this.authService.getUsuarioActual().subscribe({
      next: (user) => {
        if (user) {
          this.usuarioId = user.id;
          this.fetchQuestions();
        }
      },
      error: (error) => {
        this.alertService.mostrarAlerta("error", "Error al obtener el usuario actual");
      }
    });
  }

  private subscribeToQuizService() {
    this.quizService.preguntas$.subscribe(questions => {
      this.questions = questions;
    });
  }

  fetchQuestions(): void {
    if (!this.usuarioId) {
      this.alertService.mostrarAlerta("error", "El usuario ID no está definido.");
      return;
    }

    this.http.get<QuestionUser []>('http://localhost:3000/preguntasUsers').subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.questions = data
            .filter(question => question.usuarioCreador === this.usuarioId)
            .map(({ question, correctAnswer, incorrectAnswers, difficulty, id }) => ({
              question,
              correctAnswer,
              incorrectAnswers,
              difficulty,
              id
            }));
        } else {
          console.error('La respuesta no es un arreglo:', data);
        }
      },
      error: (error) => {
        this.alertService.mostrarAlerta("error", "Error al cargar las preguntas.");
        console.error('Error al cargar las preguntas:', error);
      }
    });
  }

  onSubmit() {
    this.errorMessage = '';

    // Verifica si el formulario es inválido
    if (this.quizForm.invalid) {
        this.errorMessage = this.getInvalidFieldsMessage();
        return;
    }

    const pregunta: QuestionUser  = {
        usuarioCreador: String(this.usuarioId),
        question: this.quizForm.value.question,
        correctAnswer: this.quizForm.value.correctAnswer,
        incorrectAnswers: this.quizForm.value.incorrectAnswers,
        difficulty: this.quizForm.value.difficulty,
        idUsersVotos: [],
        contadorVotos: 0,
    };

    if (this.currentQuestionId) {
        // Si hay un ID de pregunta actual, se está editando
        pregunta.id = this.currentQuestionId;

        this.quizService.actualizarPregunta(pregunta).subscribe({
            next: (response) => {
                console.log('Pregunta actualizada con éxito', response);
                this.alertService.mostrarAlerta("success", "Pregunta actualizada correctamente!");
                this.quizForm.reset();
                this.currentQuestionId = null;
                this.hideSuccessMessageAfterDelay();
                this.fetchQuestions();
            },
            error: (error) => {
                this.alertService.mostrarAlerta("error", "Ocurrió un error al actualizar la pregunta. Intenta de nuevo más tarde.");
                console.error('Error al actualizar pregunta', error);
            },
        });
    } else {
        // Si no hay un ID de pregunta actual, se está creando una nueva
        this.quizService.crearPregunta(pregunta).subscribe({
            next: (response) => {
                console.log('Pregunta creada con éxito', response);
                this.alertService.mostrarAlerta("success", "Pregunta guardada correctamente!");
                this.quizForm.reset();
                this.hideSuccessMessageAfterDelay();
                this.fetchQuestions();
            },
            error: (error) => {
                console.error('Error al crear pregunta', error);
                this.alertService.mostrarAlerta("error", "Ocurrió un error al crear la pregunta. Intenta de nuevo más tarde.");
            },
        });
    }
}

  private getInvalidFieldsMessage(): string {
    const invalidFields = [];
    if (this.quizForm.get('question')?.invalid) invalidFields.push('Pregunta');
    if (this.quizForm.get('correctAnswer')?.invalid) invalidFields.push('Respuesta Correcta');
    if (this.quizForm.get('difficulty')?.invalid) invalidFields.push('Dificultad');

    const incorrectAnswersControls = this.getIncorrectAnswersControls();
    incorrectAnswersControls.forEach((control, index) => {
      if (control.invalid) invalidFields.push(`Respuesta Incorrecta ${index + 1}`);
    });

    return `Los siguientes campos no pueden estar vacíos: ${invalidFields.join(', ')}`;
  }

  private hideSuccessMessageAfterDelay() {
    setTimeout(() => {
      this.successMessage = null;
      this.showForm = false;
    }, 3000);
  }

  toggleForm() {
    if (this.showForm) {
      this.quizForm.reset();
      this.currentQuestionId = null;
    }
    this.showForm = !this.showForm;
  }

  getIncorrectAnswersControls() {
    return (this.quizForm.get('incorrectAnswers') as FormArray).controls;
  }

  showConfirmDialog: boolean = false;
  questionToDeleteId: string | null = null;

  eliminarPregunta(id: string | undefined): void {
    if (!id) {
      this.alertService.mostrarAlerta("error", "No se pudo eliminar la pregunta. ID no válido.");
      console.error('El ID de la pregunta no está definido.');
      return;
    }

    this.showConfirmDialog = true;
    this.questionToDeleteId = id;
  }

  confirmDelete(confirm: boolean): void {
    if (confirm && this.questionToDeleteId) {
      this.quizService.deleteQuestion(this.questionToDeleteId).subscribe({
        next: () => {
          this.alertService.mostrarAlerta("success", "Pregunta eliminada correctamente!");
          this.fetchQuestions();
          this.hideSuccessMessageAfterDelay();
        },
        error: (error) => {
          this.alertService.mostrarAlerta("error", "Ocurrió un error al eliminar la pregunta. Intenta de nuevo más tarde.");
        },
      });
    }
    this.showConfirmDialog = false;
    this.questionToDeleteId = null;
  }

  editarPregunta(question: any) {
    this.quizForm.patchValue({
      question: question.question,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
    });

    const incorrectAnswersArray = this.quizForm.get('incorrectAnswers') as FormArray;
    incorrectAnswersArray.clear();
    question.incorrectAnswers.forEach((answer: string) => {
      incorrectAnswersArray.push(this.fb.control(answer, Validators.required));
    });

    this.showForm = true;
    this.currentQuestionId = question.id; // Guardar el ID de la pregunta actual
  }
}
