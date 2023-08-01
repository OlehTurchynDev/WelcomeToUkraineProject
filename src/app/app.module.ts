import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './page-layouts/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { FormsModule } from '@angular/forms';

import { NavbarComponent } from './page-layouts/header/navbar/navbar.component';
import { HeaderModule } from './page-layouts/header.module';
import { MainPageComponent } from './page-layouts/main-page/main-page.component';
import { FlowersComponent } from './page-layouts/main-page/flowers/flowers.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatepickerComponent } from '../app/page-layouts/datapicker/datapicker.component' 
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavbarComponent,
    MainPageComponent,
    FlowersComponent,
    DatepickerComponent
  ],
  imports: [
    HeaderModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TypeaheadModule.forRoot(),
    NgbModule,
    FormsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
