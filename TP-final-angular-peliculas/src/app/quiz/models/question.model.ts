export interface Question {
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  difficulty: string;
}

export interface QuestionUser{
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  difficulty: string;
  idUsersVotos: number[];
  countVotos: number;
}
