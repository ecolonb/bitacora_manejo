import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';
import { BitacoraProvider } from './../providers/bitacora/bitacora';
import { UsuarioProvider } from './../providers/usuario/usuario';

import { LoginPage } from '../pages/index-paginas';
import { MenuPage } from '../pages/menu/menu';
import { LoginProvider } from '../providers/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public rootPage: any;
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private loginProvider: LoginProvider,
    private usuarioProvider: UsuarioProvider,
    private bitacoraProvider: BitacoraProvider
  ) {
    platform.ready().then(() => {
      // Aqui la plataforma esta lista -> Todos los plugins cargados
      this.loginProvider.cargarStorage().then(() => {
        if (this.loginProvider.getActivo()) {
          // Cargar Info Usuario from Storage
          this.usuarioProvider.cargarStorage().then(() => {
            // Información del usuario cargada Validar Sesion Status -> Redirect

            this.bitacoraProvider
              .getBitacoraServer()
              .then(() => {
                // se obtiene la información desde el Server
                // this.bitacoraProvider.getHHmmss();
                this.rootPage = MenuPage;
                statusBar.styleDefault();
                splashScreen.hide();
              })
              .catch((err) => {
                // Si hay un error al cargar la bitácora muestra la pagína principal, si la fecha actual es igual a la bitácora almacenada mostrar los datos del localStorage
                this.rootPage = MenuPage;
                statusBar.styleDefault();
                splashScreen.hide();
                console.log('Error', err);
              });
            // Realizar peticion con datos la ultima actualizacion
          });
        } else {
          this.rootPage = LoginPage;
          statusBar.styleDefault();
          splashScreen.hide();
        }
      });
    });
  }
}
