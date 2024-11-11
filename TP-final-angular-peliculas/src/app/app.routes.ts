import { Routes } from '@angular/router';
import { ListarPeliculasComponent } from './funcionalidades/peliculas/listar-peliculas/listar-peliculas.component';
import { DetallePeliculasComponent } from './funcionalidades/peliculas/detalle-peliculas/detalle-peliculas.component';
import { HomeComponent } from './pages/home/home.component';
import { ListaFavoritosComponent } from './funcionalidades/favoritos/lista-favoritos/lista-favoritos.component';
import { AdministrarReseniasComponent } from './funcionalidades/resenias/administrar-resenias/administrar-resenias.component';
import { DetalleActorComponent } from './funcionalidades/actores/detalle-actor/detalle-actor.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { AgregarFavoritosComponent } from './funcionalidades/favoritos/agregar-favoritos/agregar-favoritos.component';
import { ModificarFavoritosComponent } from './funcionalidades/favoritos/modificar-favoritos/modificar-favoritos.component';

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
    path: 'quiz',
    loadChildren: () => import('./quiz/quiz.module').then(m => m.QuizModule)
  },
  { path: 'actor/:id', component: DetalleActorComponent },
  {
    path:'favoritos/agregar',
     component : AgregarFavoritosComponent
   },
   {
     path:'favoritos/modificar/:id',
      component : ModificarFavoritosComponent
    },
];
