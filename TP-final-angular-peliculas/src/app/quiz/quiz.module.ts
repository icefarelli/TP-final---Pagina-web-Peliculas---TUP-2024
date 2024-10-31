import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './quiz.component'; // Actualiza esta importación
import { QuizStartComponent } from './quiz-start/quiz-start.component';
import { QuizQuestionComponent } from './quiz-question/quiz-question.component';
import { QuizResultComponent } from './quiz-result/quiz-result.component';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  {
    path: '',
    component: QuizComponent,
    children: [
      { path: '', component: QuizStartComponent },
      { path: 'question', component: QuizQuestionComponent },
      { path: 'result', component: QuizResultComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    HttpClientModule,
    QuizComponent,
    QuizStartComponent,
    QuizQuestionComponent,
    QuizResultComponent
  ],
  exports: [RouterModule]
})
export class QuizModule { }
