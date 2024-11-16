import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, BehaviorSubject } from 'rxjs';
import { Question } from '../models/question.model';
import { AuthService, Usuario } from '../../nucleo/servicios/auth.service';
import { QuestionUser  } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private preguntasFinales: Question[] = [];
  private preguntaActual = 0;
  private puntaje = 0;
  private dificultad: string = 'medium'; // Dificultad por defecto
  private readonly apiUrlRevision = 'http://localhost:3000/revision';

  // Variable para almacenar el id del usuario logueado
  private usuarioId: string | undefined;

  // BehaviorSubject para manejar el estado de las preguntas
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

  loadUserQuestions() {
    if (!this.usuarioId) return;

    this.http.get<QuestionUser []>(this.apiUrlRevision).subscribe(data => {
      const userQuestions = data.filter(question => question.usuarioCreador === this.usuarioId);
      this.preguntasSubject.next(userQuestions); // Emitir preguntas del usuario
    });
  }

  setDificultad(opcionDificultad: string) {
    this.dificultad = opcionDificultad;
  }

  loadPreguntas(): Observable<Question[]> {
    return this.http.get<Question[]>('http://localhost:3000/preguntas').pipe(
      map(todasLasPreguntas => {
        // Filtrar por dificultad
        const preguntasFiltradas = todasLasPreguntas.filter(p => p.difficulty === this.dificultad);
        // Mezclar y seleccionar 10 preguntas
        this.preguntasFinales = this.mixPreguntas(preguntasFiltradas).slice(0, 10);
        this.preguntasSubject.next(this.preguntasFinales); // Emitir las preguntas
        return this.preguntasFinales;
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

  // Funcion para mezclar aleatoriamente las preguntas
  private mixPreguntas(arrayPreguntas: any[]): any[] {
    for (let i = arrayPreguntas.length - 1; i > 0; i--) {
      const iRandom = Math.floor(Math.random() * (i + 1));
      [arrayPreguntas[i], arrayPreguntas[iRandom]] = [arrayPreguntas[iRandom], arrayPreguntas[i]];
    }
    return arrayPreguntas;
  }

  crearPregunta(pregunta: QuestionUser ): Observable<QuestionUser > {
    return this.http.post<QuestionUser >(this.apiUrlRevision, pregunta).pipe(
      map((nuevaPregunta) => {
        this.loadUserQuestions(); // Actualiza las preguntas del usuario después de crear
        return nuevaPregunta;
      })
    );
  }

  fetchQuestions() {
    this.http.get<QuestionUser []>(this.apiUrlRevision).subscribe({
      next: (questions) => {
        this.preguntasSubject.next(questions);
      },
      error: (error) => {
        console.error('Error al obtener preguntas:', error);
      },
    });
  }

  addQuestion(newQuestion: QuestionUser ) {
    this.http.post(this.apiUrlRevision, newQuestion).subscribe({
      next: () => {
        this.fetchQuestions(); // Actualizar la lista tras crear una pregunta
      },
      error: (error) => {
        console.error('Error al agregar pregunta:', error);
      },
    });
  }

  deleteQuestion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlRevision}/${id}`).pipe(
      map(() => {
        this.loadUserQuestions(); // Actualiza la lista de preguntas del usuario después de eliminar
      })
    );
  }

  actualizarPregunta(pregunta: QuestionUser ): Observable<QuestionUser > {
    return this.http.put<QuestionUser >(`${this.apiUrlRevision}/${pregunta.id}`, pregunta).pipe(
        map((preguntaActualizada) => {
            this.loadUserQuestions(); // Actualiza las preguntas del usuario después de actualizar
            return preguntaActualizada;
        })
    );
}
}
