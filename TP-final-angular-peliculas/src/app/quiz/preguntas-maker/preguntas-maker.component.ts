import { Component } from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule

@Component({
  selector: 'app-preguntas-maker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Importamos módulos necesarios en el componente standalone
  templateUrl: './preguntas-maker.component.html',
  styleUrls: ['./preguntas-maker.component.css']
})
export class PreguntasMakerComponent {
  formularioQuestion: FormGroup;
  showConfirmationMessage = false;

  constructor(private fb: FormBuilder, private quizService: QuizService) {
    this.formularioQuestion = this.fb.group({
      question: ['', Validators.required],
      correctAnswer: ['', Validators.required],
      incorrectAnswers: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ]),
      difficulty: ['', Validators.required]
    });
  }

  get incorrectAnswers(): FormArray {
    return this.formularioQuestion.get('incorrectAnswers') as FormArray;
  }

  onSubmit(): void {
    if (this.formularioQuestion.valid) {
      const questionData = this.formularioQuestion.value;
      const newQuestion = {
        question: questionData.question,
        correctAnswer: questionData.correctAnswer,
        incorrectAnswers: questionData.incorrectAnswers,
        difficulty: questionData.difficulty
      };

      this.quizService.addPreguntas(newQuestion).subscribe(
        response => {
          console.log('Pregunta guardada:', response);
          this.showConfirmationMessage = true;
          setTimeout(() => {
            this.showConfirmationMessage = false;
          }, 3000);

          this.formularioQuestion.reset();
        },
        error => {
          console.error('Error al guardar la pregunta:', error);
        }
      );
    } else {
      console.log('Formulario no válido');
    }
  }
}
