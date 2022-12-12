import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, SafePipe } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from './angular-material.module';
import { ShowNotesComponent } from './notes/show-notes/show-notes.component';
import { CreateNotesComponent } from './notes/create-notes/create-notes.component';
import { NavigationMobileNotesComponent } from './notes/navigation-mobile-notes/navigation-mobile-notes.component';
import { NavigationDesktopNotesComponent } from './notes/navigation-desktop-notes/navigation-desktop-notes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PendingComponent } from './user-indicators/pending/pending.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/navigation-profile/profile.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RxStompService } from './config/websocket/rx-stomp.service';
import { rxStompServiceFactory } from './config/websocket/rx-stomp-service-factory';
import { WarnDialogComponent } from './user-indicators/warn-dialog/warn-dialog.component';
import { NotificationComponent } from './user-indicators/notification/notification.component';
import { ShowStoreComponent } from './store/show-store/show-store.component';



@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ShowNotesComponent,
    CreateNotesComponent,
    NavigationMobileNotesComponent,
    NavigationDesktopNotesComponent,
    PendingComponent,
    LoginComponent,
    ProfileComponent,
    EditProfileComponent,
    SafePipe,
    WarnDialogComponent,
    NotificationComponent,
    ShowStoreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    InfiniteScrollModule
  ],
  providers: [
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
