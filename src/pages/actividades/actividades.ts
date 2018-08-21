import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import {
  AlertController,
  IonicPage,
  NavController,
  NavParams,
  Platform
} from 'ionic-angular';
import { BitacoraModel } from '../../models/bitacora.model';
import { ActividadTitlePipe } from './../../pipes/actividad-title/actividad-title';
import { BitacoraProvider } from './../../providers/bitacora/bitacora';
import { UtilidadesProvider } from './../../providers/utilidades/utilidades';
import { DetalleItemBitacoraPage } from './../detalle-item-bitacora/detalle-item-bitacora';

// *********** PLUGINS *************
import { Diagnostic } from '@ionic-native/diagnostic';

// Alertas Modals
import { ActionSheetController } from 'ionic-angular';
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
    private actionSheetCtrl: ActionSheetController
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
      if (this.bitacoraProvider.BitacoraData !== []) {
        if (this.bitacoraProvider.BitacoraData[0]) {
          if (this.bitacoraProvider.BitacoraData.length > 0) {
            this.bitacoraProvider.haveElements = true;

            if (
              Boolean(this.bitacoraProvider.BitacoraData[0].Terminado) === false
            ) {
              // reinicio

              this.bitacoraProvider.boolReinicio = true;

              if (this.bitacoraProvider.BitacoraData[0].Actividad === 'C') {
                this.bitacoraProvider.Conduciendo = true;
                this.bitacoraProvider.dsDescanso = true;
                this.bitacoraProvider.dsConduciendo = false;
                this.bitacoraProvider.dsExcepcionTemporal = true;
              }
              if (this.bitacoraProvider.BitacoraData[0].Actividad === 'D') {
                this.bitacoraProvider.Descanso = true;
              }
              if (this.bitacoraProvider.BitacoraData[0].Actividad === 'ET') {
                this.bitacoraProvider.ExcepcionTemporal = true;
              }
              console.log('Llmando a cronometro hay una actividad peneidnete');
              this.inicio(this.bitacoraProvider.BitacoraData[0].Actividad);
            }
          }
        }
      }
    } catch (error) {}
  }
  // Incia el proceso del cronometro setInterval a 1 segundo
  public inicio(ActividadParam: string) {
    if (ActividadParam === 'C') {
      this.bitacoraProvider.actividadActual = 'C';
      this.bitacoraProvider.actividaActualTtl = 'C';
      this.bitacoraProvider.Conduciendo = true;
      this.bitacoraProvider.dsDescanso = true;
      this.bitacoraProvider.dsExcepcionTemporal = true;
      if (!this.bitacoraProvider.boolReinicio) {
        this.bitacoraProvider.dsConduciendo = true;
      }
    }
    if (ActividadParam === 'D') {
      this.bitacoraProvider.actividadActual = 'D';
      this.bitacoraProvider.actividaActualTtl = 'D';
      this.bitacoraProvider.Descanso = true;
      this.bitacoraProvider.dsConduciendo = true;
      this.bitacoraProvider.dsExcepcionTemporal = true;
      if (!this.bitacoraProvider.boolReinicio) {
        this.bitacoraProvider.dsDescanso = true;
      }
    }
    if (ActividadParam === 'ET') {
      this.bitacoraProvider.actividadActual = 'ET';
      this.bitacoraProvider.actividaActualTtl = 'ET';
      this.bitacoraProvider.ExcepcionTemporal = true;
      this.bitacoraProvider.dsConduciendo = true;
      this.bitacoraProvider.dsDescanso = true;
      if (!this.bitacoraProvider.boolReinicio) {
        this.bitacoraProvider.dsExcepcionTemporal = true;
      }
    }
    if (!this.bitacoraProvider.stInProgress) {
      this.bitacoraProvider.stInProgress = true;
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

        this.bitacoraProvider.newItemBitacora(dtSart);
      } else {
        // Si hay una actividad en curso aqui se reinicia

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
      this.bitacoraProvider.guardar();
    }

    // this.changeTitlteLarge(this.actividaActualTtl);
  }

  // Funcion detiene el vento debe guardarse en localStorage
  public terminar() {
    console.log('Termina funcion Actividades');
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
          handler: () => {
            console.log('Cancel clicked');
          }
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
    console.log('In TestDateTime');
    const date1Test: any = new Date(Date1);
    const date2Test: Date = new Date(Date2);
    console.log(Date1 + ' <-----------> ' + Date2);
    console.log(date1Test + ' <-> ' + date2Test);
    let dateDiff = Math.abs(date1Test.valueOf() - date2Test.valueOf());

    dateDiff /= 1000;
    console.log('Segundos transcurridos: ', dateDiff);
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
    console.log('In change title', this.bitacoraProvider.BitacoraData);
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
    console.log('goToDetalles', itemBitacora);
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
          handler: () => {
            console.log('Edit clicked');
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'md-close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
