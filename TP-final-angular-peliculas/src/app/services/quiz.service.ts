import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, BehaviorSubject, of, forkJoin, from } from 'rxjs';
import { Question } from '../interfaces/question.interface';
import { Usuario } from '../interfaces/auth.interface';
import { QuestionUser } from '../interfaces/question.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private preguntasFinales: Question[] = [];
  private preguntaActual = 0;
  private puntaje = 0;
  private dificultad: string = 'medium';
  private readonly apiUrlpreguntasUsers = 'http://localhost:3000/preguntasUsers';
  private readonly apiUrlpreguntas = 'http://localhost:3000/preguntas';
  private usuarioId: string | undefined;
  private preguntasSubject = new BehaviorSubject<Question[]>([]);

  preguntas$ = this.preguntasSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    // Suscribirse a los cambios en el usuario actual
    this.authService.getUsuarioActual().subscribe((usuario: Usuario | null) => {
      if (usuario) {
        this.usuarioId = usuario.id;
        this.loadUserQuestions();
      }
    });
  }

  loadPreguntasPorFuente(fuente: string): Observable<Question[]> {

    let apiUrl = '';

    switch (fuente) {
        case 'predefinidas':
            apiUrl = this.apiUrlpreguntas;
            break;
        case 'creadasPorUsuario':
            apiUrl = this.apiUrlpreguntasUsers;
            break;
        default:
            return of([]); // Retornar un observable vacío si la fuente no es válida
    }
    this.resetContadorPreguntas();

    return this.http.get<Question[]>(apiUrl).pipe(
        map(preguntas => {
            // Filtrar por dificultad
            const preguntasFiltradas = preguntas.filter(p => p.difficulty === this.dificultad);
            // Mezclar y seleccionar 10 preguntas
            this.preguntasFinales = this.mixPreguntas(preguntasFiltradas).slice(0, 10);
            this.preguntasSubject.next(this.preguntasFinales); // Emitir las preguntas
            return this.preguntasFinales;
        })
    );
  }

  setDificultad(opcionDificultad: string) {
    this.dificultad = opcionDificultad;
  }

  loadUserQuestions() {
    if (!this.usuarioId) return;
    this.http.get<QuestionUser []>(this.apiUrlpreguntasUsers).subscribe(data => {
      const userQuestions = data.filter(question => question.usuarioCreador === this.usuarioId);
      this.preguntasSubject.next(userQuestions); // Emitir preguntas del usuario
    });
  }

  crearPregunta(pregunta: QuestionUser ): Observable<QuestionUser > {
    return this.http.post<QuestionUser >(this.apiUrlpreguntasUsers, pregunta).pipe(
      map((nuevaPregunta) => {
        this.loadUserQuestions(); // Actualiza las preguntas del usuario después de crear
        return nuevaPregunta;
      })
    );
  }

  getPreguntaActual(): Question {
    return this.preguntasFinales[this.preguntaActual];
  }

  respuestaPreguntas(respuesta: string): boolean {
    const correcta = respuesta === this.getPreguntaActual().correctAnswer;
    if (correcta) {
      this.puntaje++;
    }
    return correcta;
  }

  nextPregunta(): boolean {
    this.preguntaActual++;
    return this.preguntaActual < this.preguntasFinales.length;
  }

  getPuntuacion(): number {
    return this.puntaje;
  }

  resetQuiz(): void {
    this.preguntaActual = 0;
    this.puntaje = 0;
  }
  resetContadorPreguntas(): void {
    this.preguntaActual = 0;
  }

  // Funcion para mezclar aleatoriamente las preguntas
  private mixPreguntas(arrayPreguntas: any[]): any[] {
    for (let i = arrayPreguntas.length - 1; i > 0; i--) {
      const iRandom = Math.floor(Math.random() * (i + 1));
      [arrayPreguntas[i], arrayPreguntas[iRandom]] = [arrayPreguntas[iRandom], arrayPreguntas[i]];
    }
    return arrayPreguntas;
  }


  fetchPreguntasUser() {
    this.http.get<QuestionUser []>(this.apiUrlpreguntasUsers).subscribe({
      next: (questions) => {
        this.preguntasSubject.next(questions);
      },
      error: (error) => {
        console.error('Error al obtener preguntas:', error);
      },
    });
  }

  updatePreguntasUserFront(newQuestion: QuestionUser ) {
    this.http.post(this.apiUrlpreguntasUsers, newQuestion).subscribe({
      next: () => {
        this.fetchPreguntasUser(); // Actualizar la lista tras crear una pregunta
      },
      error: (error) => {
        console.error('Error al agregar pregunta:', error);
      },
    });
  }

  deleteQuestion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlpreguntasUsers}/${id}`).pipe(
      map(() => {
        this.loadUserQuestions(); // Actualiza la lista de preguntas del usuario después de eliminar
      })
    );
  }

  actualizarPregunta(pregunta: QuestionUser ): Observable<QuestionUser > {
    return this.http.put<QuestionUser >(`${this.apiUrlpreguntasUsers}/${pregunta.id}`, pregunta).pipe(
        map((preguntaActualizada) => {
            this.loadUserQuestions(); // Actualiza las preguntas del usuario después de actualizar
            return preguntaActualizada;
        })
    );
  }


}
