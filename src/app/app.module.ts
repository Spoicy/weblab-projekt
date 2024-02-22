import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgHeroiconsModule } from '@dimaslz/ng-heroicons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TechnologyFormComponent } from './technology-form/technology-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TechnologyDisplayComponent } from './technology-display/technology-display.component';
import { UnpublishedDisplayComponent } from './unpublished-display/unpublished-display.component';
import { PublishFormComponent } from './publish-form/publish-form.component';

@NgModule({
  declarations: [
    AppComponent,
    TechnologyFormComponent,
    TechnologyDisplayComponent,
    UnpublishedDisplayComponent,
    PublishFormComponent,
  ],
  imports: [
    BrowserModule,
    NgHeroiconsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  
}
