import { Component, ViewChild } from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  Slides
} from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import {
  ConfiguracionPage,
  ConfiguracionServicioPage,
  MenuPage,
  TabsPage
} from '../index-paginas';
// import { LoginPage } from './login';

// ***** Providers **********
import { AppConfiguracionProvider } from '../../providers/app-configuracion/app-configuracion';
import { ConductorProvider } from '../../providers/conductor/conductor';
import { SyncUpProvider } from '../../providers/sync-up/sync-up';
import { UnidadProvider } from '../../providers/unidad/unidad';
import { BitacoraProvider } from './../../providers/bitacora/bitacora';

// Plugins
import { Device } from '@ionic-native/device';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { App, Platform } from 'ionic-angular';
import { LocalTimeActivitysProvider } from '../../providers/local-time-activitys/local-time-activitys';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // @ViewChild(Slides) slides: Slides;
  public loading: any = this.loadingCtrl.create({
    content: 'Iniciando la aplicación. Favor de esperar...'
  });
  public ConfiguracionPage: any = ConfiguracionPage;
  public myModal = this.ModalController.create(this.ConfiguracionPage);
  public usuario: string = '';
  public contrasenia: string = '';
  public strLoginOkProvider: string = 'false';
  public configuracionServicioPage: any = ConfiguracionServicioPage;
  public menuPage: any = MenuPage;
  // public uidDevice: string;
  // public platformDevice: string;
  // public versionPlatformDevice: string;
  // public modelDevice: string;
  public ObjLoginDevice: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public LoginProvider: LoginProvider,
    private ModalController: ModalController,
    private bitacoraProvider: BitacoraProvider,
    private conductorProvider: ConductorProvider,
    private appConfiguracionProvider: AppConfiguracionProvider,
    private unidadProvider: UnidadProvider,
    private syncUpProvider: SyncUpProvider,
    private device: Device,
    private platform: Platform,
    private uniqueDeviceID: UniqueDeviceID,
    private localTimeActivitysProvider: LocalTimeActivitysProvider
  ) {
    this.strLoginOkProvider = 'false';
    this.LoginProvider.setActivo(false)
      .then(() => {})
      .catch(() => {});
    if (this.platform.is('cordova')) {
      this.uniqueDeviceID
        .get()
        .then((uuid: any) => {
          this.ObjLoginDevice = {
            uid: String(uuid),
            platform: String(this.device.platform),
            model: String(this.device.model),
            versionPlatform: String(this.device.version),
            user: '',
            password: ''
          };
          // console.log('this.ObjDevice: ' + JSON.stringify(this.ObjLoginDevice));
          // this.uidDevice = String(uuid);
          // this.platformDevice = String(this.device.platform);
          // this.modelDevice = String(this.device.model);
          // this.versionPlatformDevice = String(this.device.version);
        })
        .catch((error: any) => {
          // console.log(error);
        });
    } else {
      this.ObjLoginDevice = {
        uid: '-',
        platform: 'desktop',
        model: '-',
        versionPlatform: '-',
        user: '',
        password: ''
      };
    }
  }

  public ionViewCanEnter() {
    if (this.LoginProvider.getActivo() === false) {
      delete this.unidadProvider.arrObjUnidades;
      this.unidadProvider
        .setUnidadesInStorage()
        .then(() => {
          delete this.conductorProvider.objConductor;
          this.conductorProvider
            .setConductorDataStorage()
            .then(() => {})
            .catch(() => {});
        })
        .catch(() => {
          delete this.conductorProvider.objConductor;
          this.conductorProvider
            .setConductorDataStorage()
            .then(() => {})
            .catch(() => {});
        });

      // return;
    }
  }

  public ionViewDidLoad() {
    // Verifica si hay sevicios y actividades pnedientes
    this.syncUpProvider
      .checkServiceToSend()
      .then(() => {
        this.syncUpProvider
          .checkActivitysToSend()
          .then(() => {})
          .catch(() => {});
      })
      .catch(() => {});
  }

  public ingresar() {
    // Validar que el la propiedad privada Logged=True; si no mostrar login
    if (this.LoginProvider.getActivo() === true) {
      // ****** Validar si esta en Servicio y en alguna actividad
      this.loading.dismiss();
      // Si no esta configurado el servicio solicitar configuracion:
      try {
        // if (
        //   this.bitacoraProvider.StatusServicio !== null &&
        //   this.bitacoraProvider.StatusServicio !== undefined
        // ) {
        //   if (this.bitacoraProvider.StatusServicio.Terminado === false) {
        //     this.bitacoraProvider.resetServicicio();
        //     this.navCtrl.setRoot(this.menuPage);
        //     // this.rootPage = this.configuracionServicioPage;
        //   } else {
        //     // Aqui cargarLasUnidadesDelaCuenta
        //     this.unidadProvider.cargarFromStorage = false;
        //     this.navCtrl.setRoot(this.configuracionServicioPage);
        //   }
        // } else {
        //   // Aqui cargarLasUnidadesDelaCuenta
        //   this.unidadProvider.cargarFromStorage = false;
        //   this.navCtrl.setRoot(this.configuracionServicioPage);
        // }
        this.localTimeActivitysProvider
          .getDataFromServer(false)
          .then(ResposeData => {
            // console.log('ResposeData:', ResposeData);
          })
          .catch(ErrorRequest => {
            // console.log('ResposeData:', ErrorRequest);
          });
        this.unidadProvider.cargarFromStorage = false;
        this.navCtrl.setRoot(this.configuracionServicioPage);
      } catch (error) {}
    }
  }
  // public continuar(formData: any) {
  //   this.usuario = formData.usuario.value;
  //   this.contrasenia = formData.contrasenia.value;
  //   let ObjMEnsaje: any;
  //   this.loading = this.loadingCtrl.create({
  //     content: 'Iniciando la aplicación. Favor de esperar...'
  //   });
  //   if (this.usuario === '' || this.contrasenia === '') {
  //     const alert = this.alertCtrl.create({
  //       title: 'Error',
  //       subTitle: '¡Favor de ingresar Usuario y Contraseña!',
  //       buttons: [
  //         {
  //           text: 'Ok',
  //           role: 'ok',
  //           handler: () => {
  //             this.LoginProvider.setActivo(false);
  //           }
  //         }
  //       ]
  //     });
  //     alert.present();
  //     return false;
  //   } else {
  //     this.loading.present();
  //   }

  //   this.LoginProvider.validarSesion(this.usuario, this.contrasenia).subscribe(
  //     (DATARCV) => {
  //       if (DATARCV) {
  //         ObjMEnsaje = DATARCV;
  //         if (ObjMEnsaje._error === false) {
  //           this.LoginProvider.guardarServicio(DATARCV);
  //           this.LoginProvider.setActivo(true);
  //           // Promise cargar y guardar solo el Login Cuando se cargue la bitacora manejar variable boolean para mantener el estado actual de la bitacora (loaded/unload) y luego ingresar -------------------------------------->>>>>>>>>>>>
  //           this.bitacoraProvider
  //             .getBitacoraFromStorage()
  //             .then((ResultBitacoraStorage) => {
  //               // this.bitacoraProvider.getHHmmss();
  //               this.ingresar();
  //             });
  //         } else {
  //           this.loading.dismiss();
  //           const alert = this.alertCtrl.create({
  //             title: 'Error',
  //             subTitle: ObjMEnsaje.mensaje,
  //             buttons: [
  //               {
  //                 text: 'Ok',
  //                 role: 'ok',
  //                 handler: () => {
  //                   this.LoginProvider.setActivo(false);
  //                 }
  //               }
  //             ]
  //           });
  //           alert.present();
  //         }
  //       } else {
  //         this.LoginProvider.setActivo(false);
  //       }
  //     },
  //     (error) => {
  //       this.loading.dismiss();
  //       const alert = this.alertCtrl.create({
  //         title: 'Error',
  //         subTitle: error.message,
  //         buttons: [
  //           {
  //             text: 'Ok',
  //             role: 'ok',
  //             handler: () => {
  //               // this.LoginProvider.setActivo(false);
  //               // Borrar las dos lineas de abajo
  //               this.LoginProvider.setActivo(true);
  //               this.ingresar();
  //               // // Promise cargar bitacora y luego ingresar -------------------------------------->>>>>>>>>>>>
  //               // this.bitacoraProvider
  //               //   .getBitacoraFromStorage()
  //               //   .then((ResultBitacoraStorage) => {
  //               //     // this.bitacoraProvider.getHHmmss();
  //               //     console.log('ResultBitacoraStorage', ResultBitacoraStorage);
  //               //     this.ingresar();
  //               //   });
  //             }
  //           }
  //         ]
  //       });
  //       alert.present();
  //     }
  //   );
  //   return false;
  // }
  public loginUserAndPassword(formData: any) {
    this.usuario = formData.usuario.value;
    this.usuario = this.usuario.trim();
    this.contrasenia = formData.contrasenia.value;
    this.loading = this.loadingCtrl.create({
      content: 'Iniciando sesión. Por favor espere...'
    });
    if (this.usuario === '' || this.contrasenia === '') {
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: '¡Favor de ingresar Usuario y Contraseña!',
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
            handler: () => {
              this.LoginProvider.setActivo(false);
            }
          }
        ]
      });
      alert.present();
      return false;
    } else {
      this.loading.present();
    }
    this.ObjLoginDevice.user = this.usuario.trim().toLocaleLowerCase();
    this.ObjLoginDevice.password = btoa(this.contrasenia.trim());
    this.LoginProvider.loginUserAndPaswword(this.ObjLoginDevice)
      .then(RESULT_PROVIDER => {
        // Aqui se procesa la información que se recibe desde el Servidor
        if (RESULT_PROVIDER.errorRequest === true) {
          this.loading.dismiss();
          const alert = this.alertCtrl.create({
            title: 'Error en login',
            subTitle: RESULT_PROVIDER.mensaje,
            buttons: [
              {
                text: 'Ok',
                role: 'ok',
                handler: () => {
                  this.LoginProvider.setActivo(false);
                }
              }
            ]
          });
          alert.present();
        } else if (RESULT_PROVIDER.errorRequest === false) {
          // Guardar datos del conductor en provider y el token, Ingresa hasta guardar Token-> evitar error en petición unidades
          this.conductorProvider.setDataconductor(RESULT_PROVIDER.conductor);
          this.appConfiguracionProvider
            .setToken(RESULT_PROVIDER.token)
            .then(() => {
              this.LoginProvider.setActivo(true)
                .then(() => {
                  this.ingresar();
                })
                .catch(() => {
                  this.ingresar();
                }); // Guardar token LOGIN_PROVIDER
            });
        }
      })
      .catch(ERROR => {
        if (ERROR.ok === false) {
          this.loading.dismiss();
          const alert = this.alertCtrl.create({
            title: 'Error de comunicación',
            subTitle:
              'Fue imposible conectarse al servidor, favor de revisar tu conexión a internet.',
            buttons: [
              {
                text: 'Ok',
                role: 'ok',
                handler: () => {
                  this.LoginProvider.setActivo(false);
                }
              }
            ]
          });
          alert.present();
        }
      });
  }
  public ngAfterViewInit() {
    // this.slides.lockSwipes(true);
    // this.slides.freeMode = false;
    // this.slides.paginationType = 'progress';
  }
  public openConfigModal() {
    this.myModal.present();
  }

  public dismissModal() {
    this.myModal.dismiss();
  }
}
