import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateNotesComponent } from './notes/create-notes/create-notes.component';
import { ShowNotesComponent } from './notes/show-notes/show-notes.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '', redirectTo: 'notes/show/all', pathMatch: 'full'
      },
      {
        path: 'notes/show/:urgent',
        component: ShowNotesComponent
      },
      {
        path: 'notes/add/create-note',
        component: CreateNotesComponent
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
