import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';
import {
  ConfiguracionServicioPage,
  LoginPage,
  MenuPage
} from '../pages/index-paginas';
import { LoginProvider } from '../providers/login/login';
import { BitacoraProvider } from './../providers/bitacora/bitacora';
import { ConductorProvider } from './../providers/conductor/conductor';
import { UsuarioProvider } from './../providers/usuario/usuario';
import { UtilidadesProvider } from './../providers/utilidades/utilidades';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public rootPage: any;
  public configuracionServicioPage: any = ConfiguracionServicioPage;
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private loginProvider: LoginProvider,
    private usuarioProvider: UsuarioProvider,
    private bitacoraProvider: BitacoraProvider,
    private utilidadesProvider: UtilidadesProvider,
    private conductorProvider: ConductorProvider
  ) {
    // ************ TEST Add TimeZone ((horas en -> muinutos) + or - )***********
    // const dateTest1: Date = new Date('2018-08-21T08:15:25');
    // console.log('dateTest1', dateTest1);
    // console.log('dateTest1.getTimezoneOffset', dateTest1.getTimezoneOffset());

    // console.log(
    //   'convertSecondToHhhmmss in appcomponent:',
    //   this.utilidadesProvider.convertSecondToHhhmmss(
    //     dateTest1.getTimezoneOffset() * 60
    //   )
    // );

    // dateTest1.setMinutes(
    //   dateTest1.getMinutes() + dateTest1.getTimezoneOffset()
    // );
    // console.log('dateTest1 converted:', dateTest1);
    // console.log('dateTest1 + UTC: ');
    // try {
    //   const now: Date = new Date();
    //   const strTime: string = now.toTimeString();
    //   const TimeZone = strTime.substring(8, strTime.length);
    //   console.log('Zona horaria: ', TimeZone);
    //   const minutosTimeOfSet = now.getTimezoneOffset();
    //   console.log('timeOfSet: ', minutosTimeOfSet);
    //   console.log('timeOfSet Horas: ', minutosTimeOfSet / 60);
    // } catch (error) {}
    platform.ready().then(() => {
      // Aqui la plataforma esta lista -> Todos los plugins cargados
      this.loginProvider.cargarStorage().then(() => {
        if (this.loginProvider.getActivo()) {
          // Cargar Info Usuario from Storage
          this.usuarioProvider.cargarStorage().then(() => {
            // Información del usuario cargada Validar Sesion Status -> Redirect
            this.bitacoraProvider
              .getBitacoraFromStorage()
              .then(() => {
                // se obtiene la información de la Bitácora desde el localStorage
                // ****** si no esta en servicio o configuración de ultimo servicio solicitar configuracion
                // this.rootPage = MenuPage;
                // Se obtiene la configuracion del Servicio
                this.bitacoraProvider.cargarServicioFromStorage().then(() => {
                  try {
                    if (
                      this.bitacoraProvider.StatusServicio !== null &&
                      this.bitacoraProvider.StatusServicio !== undefined
                    ) {
                      if (
                        this.bitacoraProvider.StatusServicio.Terminado === false
                      ) {
                        this.conductorProvider
                          .getConductorDataStorage()
                          .then(() => {
                            this.bitacoraProvider.resetServicicio();
                            this.rootPage = MenuPage;
                            statusBar.styleDefault();
                            splashScreen.hide();
                          });

                        // this.rootPage = this.configuracionServicioPage;
                      } else {
                        this.conductorProvider
                          .getConductorDataStorage()
                          .then(() => {
                            this.rootPage = this.configuracionServicioPage;
                            statusBar.styleDefault();
                            splashScreen.hide();
                          });
                      }
                    } else {
                      this.conductorProvider
                        .getConductorDataStorage()
                        .then(() => {
                          this.rootPage = this.configuracionServicioPage;
                          statusBar.styleDefault();
                          splashScreen.hide();
                        });
                    }
                  } catch (error) {}
                });
              })
              .catch(err => {
                // Si hay un error al cargar la bitácora muestra la pagína principal, si la fecha actual es igual a la bitácora almacenada mostrar los datos del localStorage
                this.rootPage = LoginPage;
                statusBar.styleDefault();
                splashScreen.hide();
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
/**
 * Validar si ya esta configurado un viaje si no configurar un viaje.
 * En caso de estar en una actividad(conduciendo, descanso) Mostrar contador hasta la fecha actual
 * -> pagina Home => Actividades
 */
