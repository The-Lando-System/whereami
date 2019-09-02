import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RoutingModule } from './routing.module';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';

import { AuthService } from './services/auth.service';
import { Broadcaster } from './services/broadcaster';
import { RequestService } from './services/request.service';

import { StartupService } from './services/startup.service';

declare const APP_INIT_ERROR: any;

export function startupServiceFactory(startupService: StartupService): Function {
  return () => startupService.load().then(() => null).catch(() => {
    console.error("Failed to initialize the app");
    APP_INIT_ERROR.state = true;
  });
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
  ],
  entryComponents: [
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    AuthService,
    Broadcaster,
    StartupService,
    RequestService,
    {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [StartupService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
