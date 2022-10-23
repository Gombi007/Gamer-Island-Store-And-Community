import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from './angular-material.module';
import { ShowNotesComponent } from './notes/show-notes/show-notes.component';
import { CreateNotesComponent } from './notes/create-notes/create-notes.component';
import { NavigationMobileNotesComponent } from './notes/navigation-mobile-notes/navigation-mobile-notes.component';
import { NavigationDesktopNotesComponent } from './notes/navigation-desktop-notes/navigation-desktop-notes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PendingComponent } from './pending/pending.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/navigation-profile/profile.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';

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
    EditProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
