import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TechnologyFormComponent } from './technology-form/technology-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TechnologyDisplayComponent } from './technology-display/technology-display.component';

@NgModule({
  declarations: [
    AppComponent,
    TechnologyFormComponent,
    TechnologyDisplayComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  
}
