import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './config/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { CreateNotesComponent } from './notes/create-notes/create-notes.component';
import { ShowNotesComponent } from './notes/show-notes/show-notes.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'notes/show/all',
        pathMatch: 'full',
      },
      {
        path: 'notes',
        redirectTo: 'notes/show/all',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'notes/show/:urgent',
        component: ShowNotesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'notes/add/create-note',
        component: CreateNotesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '**',
        redirectTo: 'login'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
