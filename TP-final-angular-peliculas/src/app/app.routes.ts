import {Routes } from "@angular/router";
import { ListarPeliculasComponent } from './funcionalidades/peliculas/listar-peliculas/listar-peliculas.component';
import { DetallePeliculasComponent } from './funcionalidades/peliculas/detalle-peliculas/detalle-peliculas.component';
import { HomeComponent } from './pages/home/home.component';
import { AdministrarReseniasComponent } from './funcionalidades/resenas/administrar-resenias/administrar-resenias.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { AgregarFavoritosComponent } from './funcionalidades/favoritos/agregar-favoritos/agregar-favoritos.component';
import { ModificarFavoritosComponent } from './funcionalidades/favoritos/modificar-favoritos/modificar-favoritos.component';
import { UserProfileComponent } from './funcionalidades/usuarios/user-profile/user-profile.component';
import { QuizComponent } from './funcionalidades/quiz/quiz.component'
import { QuizInicioComponent } from './funcionalidades/quiz/quiz-inicio/quiz-inicio.component';
import { QuizPreguntasComponent } from './funcionalidades/quiz/quiz-preguntas/quiz-preguntas.component';
import { QuizResultadosComponent } from './funcionalidades/quiz/quiz-resultados/quiz-resultados.component';
import { MisResenasComponent } from "./funcionalidades/resenas/mis-resenias/mis-resenias.component";
import { QuizMakerComponent } from './funcionalidades/quiz/quiz-maker/quiz-maker.component';
import { VisualUserComponent } from "./funcionalidades/quiz/quiz-visual-user/quiz-visual-user.component";
import { DetalleActorComponent } from "./funcionalidades/actores/detalle-actor.component";
import { CambioContraseniaComponent } from "./funcionalidades/usuarios/cambio-contrasenia/cambio-contrasenia.component";
import { EditarPerfilComponent } from "./funcionalidades/usuarios/editar-perfil/editar-perfil.component";

export const routes: Routes = [
  { path: '',
    component: HomeComponent, pathMatch: 'full'
  },
  { path: 'peliculas',
    component: ListarPeliculasComponent
  },
  { path: 'pelicula/:id',
    component: DetallePeliculasComponent
  },
  {
    path:'favoritos',
    component : FavoritosComponent
  },
  {
    path: 'resenas',
    component: AdministrarReseniasComponent
  },
  {
    path: 'quiz', component: QuizComponent, children: [
      { path: '', component: QuizInicioComponent }, // Ruta para el inicio del quiz
      { path: 'question', component: QuizPreguntasComponent }, // Ruta para las preguntas
      { path: 'result', component: QuizResultadosComponent }, // Ruta para los resultados
      { path: 'qMaker', component: QuizMakerComponent},
      { path: 'userVisual', component: VisualUserComponent },

    ]
  },
  { path: 'actor/:id',
    component: DetalleActorComponent },
  {
    path:'favoritos/agregar',
    component : AgregarFavoritosComponent
   },
   {
    path:'favoritos/modificar/:id',
    component : ModificarFavoritosComponent
    },
    {
    path: 'mi-perfil',
    component: UserProfileComponent
    },
    {
    path: 'editar-perfil',
    component: EditarPerfilComponent
    },
    { path: 'mis-resenas', component: MisResenasComponent },
    {
      path: 'cambiar-contrasenia',
      component: CambioContraseniaComponent
    }
];
