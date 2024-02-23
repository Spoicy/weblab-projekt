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
import { TechnologyListComponent } from './technology-list/technology-list.component';
import { UpdateFormComponent } from './update-form/update-form.component';

@NgModule({
  declarations: [
    AppComponent,
    TechnologyFormComponent,
    TechnologyDisplayComponent,
    UnpublishedDisplayComponent,
    PublishFormComponent,
    TechnologyListComponent,
    UpdateFormComponent,
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
