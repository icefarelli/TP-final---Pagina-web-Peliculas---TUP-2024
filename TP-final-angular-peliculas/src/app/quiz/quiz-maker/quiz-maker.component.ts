import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../nucleo/servicios/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { QuestionUser  } from '../models/question.model';
import { QuizService } from '../services/quiz.service';


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

  // Inyección de dependencias
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private quizService = inject(QuizService);

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
    this.loadCurrentUser ();
    this.subscribeToQuizService();
  }

  private initializeForm() {
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
          this.fetchQuestions(); // Cargar preguntas después de obtener el usuario
        }
      },
      error: (error) => {
        console.error('Error al obtener el usuario actual:', error);
      }
    });
  }

  private subscribeToQuizService() {
    this.quizService.preguntas$.subscribe(questions => {
      this.questions = questions;
      console.log('Preguntas actualizadas:', questions);
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
            .map(({ question, correctAnswer, incorrectAnswers, difficulty, id }) => ({
              question,
              correctAnswer,
              incorrectAnswers,
              difficulty,
              id // Asegúrate de que el ID esté incluido aquí
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

  onSubmit() {
    this.errorMessage = '';

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
        pregunta.id = this.currentQuestionId; // Asegúrate de que tu modelo tenga un campo 'id'

        // Usar el servicio para actualizar la pregunta
        this.quizService.actualizarPregunta(pregunta).subscribe({
            next: (response) => {
                console.log('Pregunta actualizada con éxito', response);
                this.successMessage = 'Pregunta actualizada correctamente!';
                this.quizForm.reset();
                this.currentQuestionId = null; // Reiniciar el ID de la pregunta actual
                this.hideSuccessMessageAfterDelay();
                this.fetchQuestions(); // Actualizar la lista de preguntas después de actualizar
            },
            error: (error) => {
                console.error('Error al actualizar pregunta', error);
                this.errorMessage = 'Ocurrió un error al actualizar la pregunta. Intenta de nuevo más tarde.';
            },
        });
    } else {
        // Si no hay un ID de pregunta actual, se está creando una nueva
        // Usar el servicio para crear la pregunta
        this.quizService.crearPregunta(pregunta).subscribe({
            next: (response) => {
                console.log('Pregunta creada con éxito', response);
                this.successMessage = 'Pregunta guardada correctamente!';
                this.quizForm.reset();
                this.hideSuccessMessageAfterDelay();
                this.fetchQuestions(); // Actualizar la lista de preguntas después de crear
            },
            error: (error) => {
                console.error('Error al crear pregunta', error);
                this.errorMessage = 'Ocurrió un error al crear la pregunta. Intenta de nuevo más tarde.';
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
      // Si el formulario se está cerrando, resetea el formulario
      this.quizForm.reset();
      this.currentQuestionId = null; // Asegúrate de reiniciar el ID de la pregunta actual
    }
    this.showForm = !this.showForm;
  }

  getIncorrectAnswersControls() {
    return (this.quizForm.get('incorrectAnswers') as FormArray).controls;
  }

  eliminarPregunta(id: string | undefined): void {
    if (!id) {
      console.error('El ID de la pregunta no está definido.');
      this.errorMessage = 'No se pudo eliminar la pregunta. ID no válido.';
      return;
    }

    this.quizService.deleteQuestion(id).subscribe({
      next: () => {
        this.successMessage = 'Pregunta eliminada correctamente!';
        this.fetchQuestions(); // Actualiza la lista de preguntas después de eliminar
        this.hideSuccessMessageAfterDelay();
      },
      error: (error) => {
        this.errorMessage = 'Ocurrió un error al eliminar la pregunta. Intenta de nuevo más tarde.';
      },
    });
  }

  editarPregunta(question: any) {
    this.quizForm.patchValue({
      question: question.question,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
    });

    // Limpiar las respuestas incorrectas y agregar las existentes
    const incorrectAnswersArray = this.quizForm.get('incorrectAnswers') as FormArray;
    incorrectAnswersArray.clear();
    question.incorrectAnswers.forEach((answer: string) => {
      incorrectAnswersArray.push(this.fb.control(answer, Validators.required));
    });

    this.showForm = true; // Mostrar el formulario
    this.currentQuestionId = question.id; // Guardar el ID de la pregunta actual
  }

}
