import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AgmCoreModule} from '@agm/core'; // <---
import {HttpClientModule} from '@angular/common/http'; // <---
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyD04eCGF66xz5zttWwqDYe39E8v1aHNyX8'}), // <---
    HttpClientModule // <---
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
