import { Routes } from '@angular/router';
import { ListarPeliculasComponent } from './funcionalidades/peliculas/listar-peliculas/listar-peliculas.component';
import { DetallePeliculasComponent } from './funcionalidades/peliculas/detalle-peliculas/detalle-peliculas.component';
import { HomeComponent } from './pages/home/home.component';
import { ListaFavoritosComponent } from './funcionalidades/favoritos/lista-favoritos/lista-favoritos.component';
import { AdministrarReseniasComponent } from './funcionalidades/resenias/administrar-resenias/administrar-resenias.component';

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
    component : ListaFavoritosComponent
  },
  {
    path: 'resenas',
    component: AdministrarReseniasComponent
  },
  {
    path: 'quiz',
    loadChildren: () => import('./quiz/quiz.module').then(m => m.QuizModule)
  }
];
