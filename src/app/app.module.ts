import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoadingController } from 'ionic-angular';

import { HomePage,MenuPage, BitacoraPage,TabsPage, LoginPage,PerfilConductorPage,DetalleViajePage,DatosUnidadPage,MensajesPage } from '../pages/index-paginas';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginProvider } from '../providers/login/login';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    MenuPage,
    BitacoraPage,
    LoginPage,
    PerfilConductorPage,
    DetalleViajePage,
    DatosUnidadPage,
    MensajesPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    MenuPage,
    BitacoraPage,
    LoginPage,
    PerfilConductorPage,
    DetalleViajePage,
    DatosUnidadPage,
    MensajesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginProvider,
    LoadingController
  ]
})
export class AppModule {}
