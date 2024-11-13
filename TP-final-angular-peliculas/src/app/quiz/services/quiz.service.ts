import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private preguntasFinales: Question[] = [];
  private preguntaActual = 0;
  private puntaje = 0;
  private dificultad: string = 'medium'; // Dificultad por defecto

  constructor(private http: HttpClient) {}

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
        return this.preguntasFinales;
      })
    );
  }

  private apiUrlrevision = 'http://localhost:3000/revision';

  addPreguntas(question: any): Observable<any> {
    return this.http.post<Question>(this.apiUrlrevision, question);
  }

  private apiUrlfromUsuarios = 'http://localhost:3000/revision';



  loadPreguntas2(): Observable<Question[]> {
    return this.http.get<Question[]>('http://localhost:3000/preguntas').pipe(
      map(todasLasPreguntas => {
        // Filtrar por dificultad
        const preguntasFiltradas = todasLasPreguntas.filter(p => p.difficulty === this.dificultad);
        // Mezclar y seleccionar 10 preguntas
        this.preguntasFinales = this.mixPreguntas(preguntasFiltradas).slice(0, 10);
        return this.preguntasFinales;
      })
    );
  }
  addPreguntasAprobadas(question: any): Observable<any>{
    return this.http.post<Question>(this.apiUrlfromUsuarios, question);
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
}
