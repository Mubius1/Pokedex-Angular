import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LeftComponent } from './left/left.component';
import { RightComponent } from './right/right.component';
import { PokeballComponent } from './pokeball/pokeball.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LeftComponent,
    RightComponent,
    PokeballComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
