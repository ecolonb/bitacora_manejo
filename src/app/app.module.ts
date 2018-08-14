import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import {
  ActividadesPage,
  BitacoraPage,
  ConfiguracionPage,
  HomePage,
  LoginPage,
  MenuPage,
  TabsPage
} from '../pages/index-paginas';
import { ActividadTitlePipe } from './../pipes/actividad-title/actividad-title';
import { MyApp } from './app.component';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { DetalleItemBitacoraPage } from '../pages/detalle-item-bitacora/detalle-item-bitacora';
import { AppConfiguracionProvider } from '../providers/app-configuracion/app-configuracion';
import { BitacoraProvider } from '../providers/bitacora/bitacora';
import { LoginProvider } from '../providers/login/login';
import { UsuarioProvider } from '../providers/usuario/usuario';
import { UtilidadesProvider } from '../providers/utilidades/utilidades';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    MenuPage,
    BitacoraPage,
    LoginPage,
    ConfiguracionPage,
    DetalleItemBitacoraPage,
    ActividadesPage,
    ActividadTitlePipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    MenuPage,
    BitacoraPage,
    LoginPage,
    ConfiguracionPage,
    DetalleItemBitacoraPage,
    ActividadesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoginProvider,
    LoadingController,
    BitacoraProvider,
    AppConfiguracionProvider,
    UsuarioProvider,
    UtilidadesProvider
  ]
})
export class AppModule {}
