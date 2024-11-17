export interface Question {
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  difficulty: string;
}

export interface QuestionUser{
  usuarioCreador: string;
  id?: string;
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  difficulty: string;
  idUsersVotos: string[];
  contadorVotos: number;
}
