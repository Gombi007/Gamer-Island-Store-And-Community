import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './angular-material.module';
import { ShowNotesComponent } from './notes/show-notes/show-notes.component';
import { CreateNotesComponent } from './notes/create-notes/create-notes.component';
import { NavigationMobileNotesComponent } from './notes/navigation-mobile-notes/navigation-mobile-notes.component';
import { NavigationDesktopNotesComponent } from './notes/navigation-desktop-notes/navigation-desktop-notes.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ShowNotesComponent,
    CreateNotesComponent,
    NavigationMobileNotesComponent,
    NavigationDesktopNotesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LayoutModule,
    FormsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
