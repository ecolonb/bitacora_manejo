import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import {
  AlertController,
  App,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  Platform
} from 'ionic-angular';
import { BitacoraModel } from '../../models/bitacora.model';
import { UnidadProvider } from './../../providers/unidad/unidad';

import { BitacoraProvider } from './../../providers/bitacora/bitacora';
import { UtilidadesProvider } from './../../providers/utilidades/utilidades';

// *** Paginas *********
import {
  ConfiguracionServicioPage,
  DetalleItemBitacoraPage
} from './../index-paginas';

// *********** PLUGINS *************
import { Diagnostic } from '@ionic-native/diagnostic';

// Alertas Modals
import { ActionSheetController } from 'ionic-angular';

// **** PIPEs ****
import { SyncUpProvider } from '../../providers/sync-up/sync-up';
import { ActividadProgressTitlePipe } from './../../pipes/actividad-progress-title/actividad-progress-title';
import { ActividadTitlePipe } from './../../pipes/actividad-title/actividad-title';

/**
 * En esta pagina se gestionan las actividades, se lleva el control de los tiempos
 */

@IonicPage()
@Component({
  selector: 'page-actividades',
  templateUrl: 'actividades.html'
})
export class ActividadesPage {
  // Delete

  public DetalleItemBitacoraPage: any = DetalleItemBitacoraPage;
  public configuracionServicioPage: any = ConfiguracionServicioPage;
  // public boolSelectActividad: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private utilidadesProvider: UtilidadesProvider,
    private bitacoraProvider: BitacoraProvider,
    private geolocation: Geolocation,
    private diagnostic: Diagnostic,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private app: App,
    private unidadProvider: UnidadProvider,
    private syncUpProvider: SyncUpProvider
  ) {}

  // Error en Dispositivo
  public ionViewDidLoad() {
    if (this.platform.is('cordova')) {
      // this.diagnostic.getLocationAuthorizationStatus().then((DATA) => {
      //   console.log('DATA ---->>> Autoroization' + JSON.stringify(DATA));
      //   this.bitacoraProvider.strTatusLocation = JSON.stringify(DATA);
      // });
      // this.diagnostic.getLocationMode().then((DATA) => {
      //   console.log(
      //     'DATA getLocationMode----------->>>' + JSON.stringify(DATA)
      //   );
      //   console.log('DATA----------->>>------>>>crudo' + DATA);
      //   if (String(DATA) !== 'location_off') {
      //     this.bitacoraProvider.strTatusLocationMode =
      //       'Activated <-> --->>' + DATA;
      //   } else {
      //     this.bitacoraProvider.strTatusLocationMode =
      //       'Disabled <-> -->>' + DATA;
      //   }
      // });
      // this.diagnostic.isLocationEnabled().then((Respuesta) => {
      //   if (Respuesta) {
      //     this.bitacoraProvider.strTatusLocation = 'Location Activated';
      //   } else {
      //     this.bitacoraProvider.strTatusLocation = 'Location Desactivated';
      //   }
      //   console.log('Diagnostic-----promesa OK>>>>');
      // });
    } else {
      this.bitacoraProvider.strTatusLocation = 'Desktop';
      this.bitacoraProvider.strTatusLocationMode = 'Desktop';
    }
    try {
      if (
        this.bitacoraProvider.BitacoraData !== [] &&
        this.bitacoraProvider.BitacoraData !== null
      ) {
        if (this.bitacoraProvider.BitacoraData[0]) {
          if (this.bitacoraProvider.BitacoraData.length > 0) {
            this.bitacoraProvider.haveElements = true;

            // Recorrer items para ver que actividad esta pendiente
            for (const itBitacoraReboot of this.bitacoraProvider.BitacoraData) {
              if (Boolean(itBitacoraReboot.Terminado) === false) {
                // Reiniciando actividad pendiente

                if (itBitacoraReboot.Actividad === 'C') {
                  this.bitacoraProvider.Conduciendo = true;
                  this.bitacoraProvider.dsDescanso = true;
                  this.bitacoraProvider.dsConduciendo = false;
                  this.bitacoraProvider.dsExcepcionTemporal = false;
                  this.bitacoraProvider.boolReinicio = true;
                  this.bitacoraProvider.fechaInicioActividad =
                    itBitacoraReboot.FechaHoraInicio;
                  this.inicio(itBitacoraReboot.Actividad);
                }
                if (itBitacoraReboot.Actividad === 'D') {
                  this.bitacoraProvider.Descanso = true;
                  this.bitacoraProvider.boolReinicio = true;
                  this.bitacoraProvider.dsExcepcionTemporal = false;
                  this.bitacoraProvider.fechaInicioActividad =
                    itBitacoraReboot.FechaHoraInicio;
                  this.inicio(itBitacoraReboot.Actividad);
                }
                if (itBitacoraReboot.Actividad === 'ET') {
                  // reiniciar timerexcepcion temporal
                  this.bitacoraProvider.ExcepcionTemporal = true;
                  this.bitacoraProvider.stExepcionTemporal = true;
                  this.bitacoraProvider.dsExcepcionTemporal = false;
                  this.bitacoraProvider.strFechaInicioExcepcion =
                    itBitacoraReboot.FechaHoraInicio;
                  this.bitacoraProvider.controlTimerExcepcion = setInterval(
                    () => {
                      this.bitacoraProvider.timerExcepcionTemporal();
                    },
                    1000
                  );
                }
              }
            }
          }
        }
      }
    } catch (error) {}

    // Sincronizando eventos pendientes -> aqui validar cuando ya se sincronizaron por Nuevo Evento
    // Eddpoint
    const loading = this.loadingCtrl.create({
      content:
        'Sincronizando información del LocalStorage al server, por favor espere...'
    });
    loading.present();
    console.log(
      'Antes de [Sincronizando información del LocalStorage al server]'
    );
    this.syncUpProvider
      .checkServiceToSend()
      .then(() => {
        loading.dismiss();
      })
      .catch((Err) => {
        loading.dismiss();
      });
  }
  // Incia el proceso del cronometro setInterval a 1 segundo
  public inicio(ActividadParam: string) {
    console.log('Validando si hay que guardar como teminado la actividad...');
    if (ActividadParam === 'C') {
      this.bitacoraProvider.actividadActual = 'C';
      this.bitacoraProvider.actividaActualTtl = 'C';
      this.bitacoraProvider.Conduciendo = true;
      this.bitacoraProvider.dsDescanso = true;
      if (!this.bitacoraProvider.boolReinicio) {
        this.bitacoraProvider.dsConduciendo = true;
      }
    }
    if (ActividadParam === 'D') {
      this.bitacoraProvider.actividadActual = 'D';
      this.bitacoraProvider.actividaActualTtl = 'D';
      this.bitacoraProvider.Descanso = true;
      this.bitacoraProvider.dsConduciendo = true;
      if (!this.bitacoraProvider.boolReinicio) {
        this.bitacoraProvider.dsDescanso = true;
      }
    }
    // if (ActividadParam === 'ET') {
    //   this.bitacoraProvider.actividadActual = 'ET';
    //   this.bitacoraProvider.actividaActualTtl = 'ET';
    //   this.bitacoraProvider.ExcepcionTemporal = true;
    //   this.bitacoraProvider.dsConduciendo = true;
    //   this.bitacoraProvider.dsDescanso = true;
    //   if (!this.bitacoraProvider.boolReinicio) {
    //     this.bitacoraProvider.dsExcepcionTemporal = true;
    //   }
    // }

    if (!this.bitacoraProvider.stInProgress) {
      this.bitacoraProvider.stInProgress = true;
      this.bitacoraProvider.strSegundos = ':00';
      this.bitacoraProvider.strMinutos = ':00';
      this.bitacoraProvider.strHoras = '00';
      let dtSart: Date;
      if (!this.bitacoraProvider.boolReinicio) {
        // dtSart = new Date();
        // Obteniendo las coordenadas
        // this.geolocation
        //   .getCurrentPosition()
        //   .then((resp) => {
        //     // resp.coords.latitude
        //     // resp.coords.longitude
        //     // console.log(resp.coords.latitude);
        //     // console.log(resp.coords.longitude);
        //     // this.bitacoraProvider.InicioActividadX = Number(
        //     //   resp.coords.latitude
        //     // );
        //     // this.bitacoraProvider.InicioActividadY = Number(
        //     //   resp.coords.longitude
        //     // );
        //     // console.log(
        //     //   'LOCATION this.InicioActividadX: ---------->>>',
        //     //   this.bitacoraProvider.InicioActividadX
        //     // );
        //     // console.log(
        //     //   'LOCATION this.InicioActividadY: ------------>>',
        //     //   this.bitacoraProvider.InicioActividadY
        //     // );

        //     // si se obtiene la ubicación actual habilitar boton parar actividad

        //   })
        //   .catch((error) => {
        //     console.log(
        //       'Error getting location------------->>>>' + JSON.stringify(error)
        //     );
        //     this.bitacoraProvider.InicioActividadX = -2786;
        //     this.bitacoraProvider.InicioActividadY = -2786;
        //     this.bitacoraProvider.newItemBitacora(dtSart);
        //     // si se obtiene la ubicación actual habilitar boton parar actividad

        //     if (ActividadParam === 'C') {
        //       this.bitacoraProvider.dsConduciendo = false;
        //     }
        //     if (ActividadParam === 'D') {
        //       this.bitacoraProvider.dsDescanso = false;
        //     }
        //     if (ActividadParam === 'ET') {
        //       this.bitacoraProvider.dsExcepcionTemporal = false;
        //     }
        //     console.log('Despues de error en location------->>>>');
        //   });

        if (ActividadParam === 'C') {
          this.bitacoraProvider.dsConduciendo = false;
        }
        if (ActividadParam === 'D') {
          this.bitacoraProvider.dsDescanso = false;
        }
        if (ActividadParam === 'ET') {
          this.bitacoraProvider.dsExcepcionTemporal = false;
        }
        dtSart = new Date();

        this.bitacoraProvider.dtFechaInicio = this.utilidadesProvider.convertLocalDateToUTC(
          dtSart
        );

        this.bitacoraProvider.dtFechaFin = this.utilidadesProvider.convertLocalDateToUTC(
          new Date()
        );

        this.bitacoraProvider.dtCurrentDT = new Date();
        this.bitacoraProvider.fechaInicioActividad = this.utilidadesProvider.isoStringToSQLServerFormat(
          dtSart
            .toISOString()
            .toString()
            .toUpperCase()
        );

        // Eddpoint
        const loading = this.loadingCtrl.create({
          content:
            'Obteniendo posición y sincronizando información, por favor espere...'
        });
        loading.present();
        this.bitacoraProvider
          .newItemBitacora(dtSart)
          .then(() => {
            // Una vez Resuelta la promEsa de nuevoItemBitacora se guarda para sincronizar despues.
            loading.dismiss();
          })
          .catch(() => {
            loading.dismiss();
          });
      } else {
        // Si hay una actividad en curso aqui se reiniciar tomar la fecha de inicio de actividad pendiente que no sea ET

        this.bitacoraProvider.boolReinicio = false;

        dtSart = this.utilidadesProvider.convertSqlToDate(
          this.bitacoraProvider.BitacoraData[0].FechaHoraInicio
        );

        // this.dtFechaFin
        this.bitacoraProvider.dtFechaInicio = this.utilidadesProvider.convertSqlToDate(
          this.bitacoraProvider.BitacoraData[0].FechaHoraInicio
        );

        this.bitacoraProvider.dtFechaFin = this.utilidadesProvider.convertLocalDateToUTC(
          new Date()
        );

        this.bitacoraProvider.dtCurrentDT = new Date();
      }

      this.bitacoraProvider.control = setInterval(() => {
        this.bitacoraProvider.cronometro();
      }, 1000);
      // Guardar item bitacora
    } else {
      // al guardar habilitar o deshabilitar botones. Eddpoint
      const loading = this.loadingCtrl.create({
        content:
          'Obteniendo posición y sincronizando información, por favor espere...'
      });
      loading.present();
      this.bitacoraProvider
        .guardar()
        .then((DataRequest) => {
          console.log('DataRequest ok: ', DataRequest);
          loading.dismiss();
        })
        .catch(() => {
          console.log('Error in catch');
          loading.dismiss();
        });
    }

    // this.changeTitlteLarge(this.actividaActualTtl);
  }

  public confirmarAccionActividad(Actividadaram: string) {
    let titleAlert: string;
    let messageAlert: string;

    if (this.bitacoraProvider.stInProgress) {
      // Termina actividad
      if (this.bitacoraProvider.Conduciendo && Actividadaram === 'C') {
        titleAlert = 'Terminar conducción';
        messageAlert = '¿Realmente deseas terminar de conducir?';
      }
      if (this.bitacoraProvider.Descanso && Actividadaram === 'D') {
        titleAlert = 'Terminar descanso';
        messageAlert = '¿Realmente deseas terminar de descansar?';
      }
    } else {
      // Inicia actividad
      if (!this.bitacoraProvider.Conduciendo && Actividadaram === 'C') {
        titleAlert = '¿Iniciar conducción?';
        messageAlert = '¿Realmente deseas iniciar a conducir?';
      }
      if (!this.bitacoraProvider.Descanso && Actividadaram === 'D') {
        titleAlert = 'Iniciar descanso?';
        messageAlert = '¿Realmente deseas iniciar descanso?';
      }
    }

    const confirm = this.alertCtrl.create({
      title: titleAlert,
      message: messageAlert,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'SI',
          handler: () => {
            this.inicio(Actividadaram);
          }
        }
      ]
    });
    confirm.present();
  }

  public confirmarTerminarServicio() {
    console.log('Confirmando terminar Servicio');
  }
  public confirmExcepcionTemporal() {
    let titleAlert: string;
    let messageAlert: string;

    if (this.bitacoraProvider.stExepcionTemporal) {
      titleAlert = 'Terminar excepción temporal';
      messageAlert = '¿Realmente deseas terminar la Excepción temporal?';
    } else {
      // Inicia actividad
      titleAlert = 'Iniciar excepción temporal';
      messageAlert = '¿Realmente deseas iniciar la Excepción temporal?';
    }

    const confirm = this.alertCtrl.create({
      title: titleAlert,
      message: messageAlert,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Si',
          handler: () => {
            this.controlaExcepcion();
          }
        }
      ]
    });
    confirm.present();
  }
  // Funcion detiene el vento debe guardarse en localStorage
  public eliminarExcepcion() {
    console.log('Elimina excepción temporal!');
  }
  public editar() {
    console.log('Se abre el panel para editar el item bitacora');
  }
  public eliminar() {
    // Alert desea eliminar
    const alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: '¿Deseas eliminar este registro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancelar',
          handler: () => {}
        },
        {
          text: 'Eliminar',
          handler: () => {
            console.log('Eliminar clicked');
            clearInterval(this.bitacoraProvider.control);

            this.bitacoraProvider.stInProgress = false;
            (document.getElementById(
              'inicio'
            ) as HTMLInputElement).disabled = false;
            (document.getElementById(
              'eliminar'
            ) as HTMLInputElement).disabled = true;
            (document.getElementById(
              'guardar'
            ) as HTMLInputElement).disabled = true;
            this.bitacoraProvider.strSegundos = ':00';
            this.bitacoraProvider.strMinutos = ':00';
            this.bitacoraProvider.strHoras = '00';
            try {
              this.bitacoraProvider.BitacoraData.splice(0, 1);
              // Al eliminar un elemento se actualiza el LocalStorage
              this.bitacoraProvider.guardarBitacoraInStorage();
              if (this.bitacoraProvider.BitacoraData !== []) {
                if (this.bitacoraProvider.BitacoraData.length >= 1) {
                  this.bitacoraProvider.haveElements = true;
                } else {
                  this.bitacoraProvider.haveElements = false;
                }
              }
            } catch (error) {
              console.log('Error in Eliminar');
            }
          }
        }
      ]
    });
    alert.present();
  }

  public testDatetTiime(Title: string, Date1: any, Date2: any) {
    const date1Test: any = new Date(Date1);
    const date2Test: Date = new Date(Date2);
    let dateDiff = Math.abs(date1Test.valueOf() - date2Test.valueOf());

    dateDiff /= 1000;
    const horas: any = Math.floor(dateDiff / 3600);
    const minutos: any = Math.floor((dateDiff - horas * 3600) / 60);
    const segundos: any = Math.round(dateDiff - horas * 3600 - minutos * 60);
    console.log(
      Title +
        ' TIEMPO transcurridos: [ ' +
        horas +
        ':' +
        minutos +
        ':' +
        segundos +
        ' ]'
    );
  }

  // change title card activity
  public changeTitlte(Actividad: string) {
    if (this.bitacoraProvider.BitacoraData.length >= 1) {
      this.bitacoraProvider.BitacoraData[0].Actividad = Actividad;
      // Cuando se cambia de actividad tambien se actualiza LocalStorage
      this.bitacoraProvider.guardarBitacoraInStorage();
    }
  }
  public changeTitlteLarge(Actividad: string) {
    if (Actividad === 'S') {
      this.bitacoraProvider.actividaActualTtl = 'Servicio';
    } else if (Actividad === 'C') {
      this.bitacoraProvider.actividaActualTtl = 'Conduciendo';
    } else if (Actividad === 'D') {
      this.bitacoraProvider.actividaActualTtl = 'Descanso';
    } else if (Actividad === 'FS') {
      this.bitacoraProvider.actividaActualTtl = 'Fuera de servicio';
    } else if (Actividad === 'ET') {
      this.bitacoraProvider.actividaActualTtl = 'Excepción temporal';
    } else {
      this.bitacoraProvider.actividaActualTtl = '--';
    }
  }
  public goToDetallesItem(itemBitacora: BitacoraModel) {
    this.navCtrl.push(DetalleItemBitacoraPage, { itemBitacora });
  }
  // Muestra las opciones para la actividad actual
  public optionsActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Eliminar',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            console.log('Delete clicked');
          }
        },
        {
          text: 'Editar',
          icon: 'md-create',
          handler: () => {}
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'md-close',
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }
  public terminarServicio() {
    const confirm = this.alertCtrl.create({
      title: 'Terminar servicio',
      message: '¿Realmente deseas terminar el servicio?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Si',
          handler: () => {
            const loading = this.loadingCtrl.create({
              content: 'Sincronizando información, por favor espere...'
            });
            loading.present();
            this.bitacoraProvider.terminarServicio().then(() => {
              // redirect configuracion nuevo servicio
              loading.dismiss();
              this.bitacoraProvider.strHoras = '00';
              this.bitacoraProvider.strMinutos = ':00';
              this.bitacoraProvider.strSegundos = ':00';
              this.bitacoraProvider.strHorasExcepcion = '00';
              this.bitacoraProvider.strSegundosExcepcion = ':00';
              this.bitacoraProvider.segundosConduccionHhmmss = '00:00:00';
              this.bitacoraProvider.segundosDescansoHhmmss = '00:00:00';
              this.bitacoraProvider.strHorasServicio = '00';
              this.bitacoraProvider.strMinutosServicio = ':00';
              this.bitacoraProvider.strSegundosServicio = ':00';
              this.bitacoraProvider.segundosConduccionStorage = 0;
              this.bitacoraProvider.segundosDescansoStorage = 0;
              this.bitacoraProvider.segundosConduccion = 0;
              this.bitacoraProvider.segundosDescanso = 0;
              this.bitacoraProvider.haveElements = false;
              // this.bitacoraProvider.stora
              this.app.getRootNavs()[0].setRoot(this.configuracionServicioPage);
              delete this.bitacoraProvider.BitacoraData;
              delete this.bitacoraProvider.StatusServicio;
              delete this.bitacoraProvider.objConfServicio;
              this.bitacoraProvider.stExepcionTemporal = false;
              this.bitacoraProvider.ExcepcionTemporal = false;
              this.bitacoraProvider.stInProgress = false;
              this.unidadProvider.cargarFromStorage = true;
            });
          }
        }
      ]
    });
    confirm.present();
  }
  public controlaExcepcion() {
    // public newItemBitacora(dtSart: Date, actividadParam?: string) {
    const loading = this.loadingCtrl.create({
      content:
        'Obteniendo posición y sincronizando información, por favor espere...'
    });
    loading.present();
    console.log(
      'Obteniendo posición y sincronizando información, por favor espere...'
    );
    this.bitacoraProvider
      .iniciarExcepcionTemporal(new Date())
      .then(() => {
        console.log('Closing loading....');
        loading.dismiss();
      })
      .catch(() => {
        console.log('Closing loading.....catch(() => {');
        loading.dismiss();
      });
  }
  public terminarExcepcion() {}
}
