import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAddGamesComponent } from './admin/admin-add-games/admin-add-games.component';
import { AdminHandleRolesComponent } from './admin/admin-handle-roles/admin-handle-roles.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard, AuthGuardAdmin } from './config/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { CreateNotesComponent } from './notes/create-notes/create-notes.component';
import { ShowNotesComponent } from './notes/show-notes/show-notes.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { CartStoreComponent } from './store/cart-store/cart-store.component';
import { FilterStoreComponent } from './store/filter-store/filter-store.component';
import { ShowStoreComponent } from './store/show-store/show-store.component';
import { WishlistStoreComponent } from './store/wishlist-store/wishlist-store.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: '',
        redirectTo: 'notes/show/community',
        pathMatch: 'full',
      },
      {
        path: 'notes',
        redirectTo: 'notes/show/community',
        pathMatch: 'full',
      },
      {
        path: 'notes/show/:favOrMyNotes',
        component: ShowNotesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'notes/add/create-note',
        component: CreateNotesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'profile/edit-profile',
        component: EditProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'store',
        redirectTo: 'store/show',
        pathMatch: 'full',
      },
      {
        path: 'store/show',
        component: ShowStoreComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'store/wishlist',
        component: WishlistStoreComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'store/cart',
        component: CartStoreComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard, AuthGuardAdmin],
        children: [
          { path: 'add-games', component: AdminAddGamesComponent, outlet: 'admin' },
          { path: 'handle-roles', component: AdminHandleRolesComponent, outlet: 'admin' }
        ]
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
