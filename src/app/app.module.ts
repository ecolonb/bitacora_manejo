// MODULOS
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

// ************ PAGES ************
import {
  ActividadesPage,
  BitacoraPage,
  ConfiguracionPage,
  ConfiguracionServicioPage,
  DetalleItemBitacoraPage,
  HomePage,
  LoginPage,
  MenuPage,
  TabsPage
} from '../pages/index-paginas';

// ********** PIPES **********
import { ActividadProgressTitlePipe } from './../pipes/actividad-progress-title/actividad-progress-title';
import { ActividadTitlePipe } from './../pipes/actividad-title/actividad-title';
import { DateUtcToLocalePipe } from './../pipes/date-utc-to-locale/date-utc-to-locale';
import { SecondsToHhmmssPipe } from './../pipes/seconds-to-hhmmss/seconds-to-hhmmss';
import { TipoServicoTranslatePipe } from './../pipes/tipo-servico-translate/tipo-servico-translate';

import { MyApp } from './app.component';

// *********** PROVIDERS **************

import { AppConfiguracionProvider } from '../providers/app-configuracion/app-configuracion';
import { BitacoraProvider } from '../providers/bitacora/bitacora';
import { LoginProvider } from '../providers/login/login';
import { UsuarioProvider } from '../providers/usuario/usuario';
import { UtilidadesProvider } from '../providers/utilidades/utilidades';

// *********** PLUGINS **********
import { Device } from '@ionic-native/device';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { IonicStorageModule } from '@ionic/storage';

// Alertas Modals
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ActionSheetController } from 'ionic-angular';
import { App } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ConductorProvider } from '../providers/conductor/conductor';
import { LocalTimeActivitysProvider } from '../providers/local-time-activitys/local-time-activitys';
import { SyncUpProvider } from '../providers/sync-up/sync-up';
import { UnidadProvider } from '../providers/unidad/unidad';

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
    ActividadTitlePipe,
    ConfiguracionServicioPage,
    ActividadProgressTitlePipe,
    DateUtcToLocalePipe,
    SecondsToHhmmssPipe,
    TipoServicoTranslatePipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      scrollAssist: false
    }),
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
    ActividadesPage,
    ConfiguracionServicioPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: LOCALE_ID, useValue: 'es-mx' },
    LoginProvider,
    LoadingController,
    BitacoraProvider,
    AppConfiguracionProvider,
    UsuarioProvider,
    UtilidadesProvider,
    Geolocation,
    Diagnostic,
    ActionSheetController,
    App,
    ConductorProvider,
    UnidadProvider,
    SyncUpProvider,
    Device,
    UniqueDeviceID,
    LocalTimeActivitysProvider
  ]
})
export class AppModule {}
