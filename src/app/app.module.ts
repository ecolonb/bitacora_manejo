import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { MyApp } from './app.component';

import {
  BitacoraPage,
  ConfiguracionPage,
  ExcepcionTemporalPage,
  HomePage,
  LoginPage,
  MenuPage,
  TabsPage
} from '../pages/index-paginas';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BitacoraProvider } from '../providers/bitacora/bitacora';
import { LoginProvider } from '../providers/login/login';

import { ScreenOrientation } from '@ionic-native/screen-orientation';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    MenuPage,
    BitacoraPage,
    LoginPage,
    ConfiguracionPage,
    ExcepcionTemporalPage
  ],
  imports: [BrowserModule, IonicModule.forRoot(MyApp), HttpClientModule],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    MenuPage,
    BitacoraPage,
    LoginPage,
    ConfiguracionPage,
    ExcepcionTemporalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoginProvider,
    LoadingController,
    BitacoraProvider,
    ScreenOrientation
  ]
})
export class AppModule {}
