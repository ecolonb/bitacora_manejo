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
  public strTatusLocation: string = '';
  public strTatusLocationMode: string = '';
  public DetalleItemBitacoraPage: any = DetalleItemBitacoraPage;
  public actividadTitle: any = ActividadTitlePipe;
  public InicioActividadX: number;
  public InicioActividadY: number;
  public FinActividaX: number;
  public FinActividadY: number;
  // PAra mantener el ambito de las variables
  public BitacoraData: BitacoraModel[] = [];
  public currentItemBitacora: BitacoraModel;
  public haveElements: boolean = false;
  // public that = this;
  public strCentesimas: string = ':00';
  public strSegundos: string = ':00';
  public strMinutos: string = ':00';
  public strHoras: string = '00';
  public dtFechaInicio: Date = null;
  public dtFechaFin: Date = null;
  public dtCurrentDT: Date = null;
  // dtFechaFin dtCurrentDT
  public actividadActual: string = 'S';
  public actividaActualTtl: string = 'S';
  public boolServicio: boolean = false;
  public boolReinicio: boolean = false;
  // public boolSelectActividad: boolean = false;

  private centesimas: number = 0;
  private segundos: number = 0;
  private minutos: number = 0;
  private horas: number = 0;
  private control: any;
  private stInProgress: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private utilidadesProvider: UtilidadesProvider,
    private bitacoraProvider: BitacoraProvider,
    private geolocation: Geolocation,
    private diagnostic: Diagnostic,
    private platform: Platform
  ) {}

  public ionViewDidLoad() {
    if (this.platform.is('cordova')) {
      this.diagnostic.getLocationAuthorizationStatus().then((DATA) => {
        console.log('DATA' + JSON.stringify(DATA));
        this.strTatusLocation = JSON.stringify(DATA);
      });
      this.diagnostic.getLocationMode().then((DATA) => {
        console.log('DATA----------->>>' + JSON.stringify(DATA));
        console.log('DATA----------->>>crudo' + DATA);
        if (String(DATA) !== 'location_off') {
          this.strTatusLocationMode = 'Activated <-> ' + DATA;
        } else {
          this.strTatusLocationMode = 'Disabled <-> ' + DATA;
        }
      });
      this.diagnostic.isLocationEnabled().then((Respuesta) => {
        if (Respuesta) {
          this.strTatusLocation = 'Location Activated';
        } else {
          this.strTatusLocation = 'Location Desactivated';
        }

        console.log('Diagnostic');
      });
    } else {
      console.log('Else Here');
      this.strTatusLocation = 'Desktop';
      this.strTatusLocationMode = 'Desktop';
    }
    try {
      this.BitacoraData = this.bitacoraProvider.getBitacoraDataStorage();
      if (this.BitacoraData[0]) {
        if (this.BitacoraData.length > 0) {
          this.haveElements = true;
          if (this.BitacoraData[0].Terminado === false) {
            // reinicio
            this.boolReinicio = true;
            (document.getElementById(
              'inicio'
            ) as HTMLInputElement).disabled = true;
            (document.getElementById(
              'eliminar'
            ) as HTMLInputElement).disabled = false;
            (document.getElementById(
              'guardar'
            ) as HTMLInputElement).disabled = false;
            this.inicio();
          }
        }
      }
    } catch (error) {
      console.log('Error: --->>>>' + JSON.stringify(error));
    }
  }
  // Función que se ejecuta cuando se ha cambiado la actividad actual
  public onChangeSelectActividad() {
    // se cambia el titulo en el Array de Items bitácora
    if (this.BitacoraData.length >= 1) {
      if (!this.BitacoraData[0].Terminado) {
        this.changeTitlte(this.actividadActual);
      }
    }
  }
  // Incia el proceso del cronometro setInterval a 1 segundo
  public inicio() {
    (document.getElementById('inicio') as HTMLInputElement).disabled = true;
    console.log('Error: inicio 1');
    if (!this.stInProgress) {
      console.log('Error: inicio 2');
      this.stInProgress = true;
      let dtSart: Date;
      if (!this.boolReinicio) {
        // Obteniendo las coordenadas
        this.geolocation
          .getCurrentPosition()
          .then((resp) => {
            // resp.coords.latitude
            // resp.coords.longitude
            console.log(resp.coords.latitude);
            console.log(resp.coords.longitude);
            this.InicioActividadX = Number(resp.coords.latitude);
            this.InicioActividadY = Number(resp.coords.longitude);
            console.log('this.InicioActividadX: ', this.InicioActividadX);
            console.log('this.InicioActividadY: ', this.InicioActividadY);
            this.newItemBitacora(dtSart);
            (document.getElementById(
              'inicio'
            ) as HTMLInputElement).disabled = true;
            (document.getElementById(
              'eliminar'
            ) as HTMLInputElement).disabled = false;
            (document.getElementById(
              'guardar'
            ) as HTMLInputElement).disabled = false;
          })
          .catch((error) => {
            console.log('Error getting location', error);
            this.InicioActividadX = -2786;
            this.InicioActividadY = -2786;
            this.newItemBitacora(dtSart);
            (document.getElementById(
              'inicio'
            ) as HTMLInputElement).disabled = true;
            (document.getElementById(
              'eliminar'
            ) as HTMLInputElement).disabled = false;
            (document.getElementById(
              'guardar'
            ) as HTMLInputElement).disabled = false;
          });
        console.log('Error: inicio 3');
        dtSart = new Date();
        //
        this.dtFechaInicio = this.utilidadesProvider.convertLocalDateToUTC(
          dtSart
        );
        console.log('Error: inicio 4');
        this.dtFechaFin = this.utilidadesProvider.convertLocalDateToUTC(
          new Date()
        );
        console.log('Error: inicio 5');
        this.dtCurrentDT = new Date();
        console.log('Error: inicio 6');

        console.log('dtSart-->', dtSart);
        console.log('Error: inicio 7');
      } else {
        this.boolReinicio = false;
        dtSart = this.utilidadesProvider.convertSqlToDate(
          this.BitacoraData[0].FechaHoraInicio
        );
        // this.dtFechaFin
        this.dtFechaInicio = this.utilidadesProvider.convertSqlToDate(
          this.BitacoraData[0].FechaHoraInicio
        );
        this.dtFechaFin = this.utilidadesProvider.convertLocalDateToUTC(
          new Date()
        );
        this.dtCurrentDT = new Date();
      }
      console.log('dtSart: ', dtSart);
      console.log(' this.dtFechaInicio: ', this.dtFechaInicio);
      console.log('this.dtFechaFin: ', this.dtFechaFin);
      this.control = setInterval(() => {
        this.cronometro(this);
      }, 1000);
      // Guardar item bitacora
    }

    // this.changeTitlteLarge(this.actividaActualTtl);
  }

  // Crear Item bitacora
  public newItemBitacora(dtSart: Date) {
    // this.currentItemBitacora.IdViaje = 1368;
    // Obtener un hash de la bitacora
    console.log('In new item Bitacora dtSart: ', dtSart);
    const dtSQLStartNewItem: string = this.utilidadesProvider.isoStringToSQLServerFormat(
      dtSart
        .toISOString()
        .toString()
        .toUpperCase()
    );
    console.log('In new item Bitacora dtSQLStartNewItem: ', dtSQLStartNewItem);
    const objNewItem: any = {
      IdViaje: 1368,
      HashBitacora: this.utilidadesProvider.hashCode(
        this.dtFechaInicio.toString() + 'TOKEN'
      ),
      FechaHoraInicio: dtSQLStartNewItem,
      FechaHoraFinal: null,
      SegundosTotal: 0,
      TiempoHhmmss: null,
      Actvidad: this.actividadActual,
      InicioActividadX: this.InicioActividadX,
      InicioActividadY: this.InicioActividadY,
      FinActividaX: null,
      FinActividadY: null,
      Descripcion: null,
      GuardadoServer: false,
      Nota: null,
      Transicion: 0,
      TransicionHhmmss: '00:00:00',
      Terminado: false
    };
    console.log('VALIDANDO', this.BitacoraData);
    if (this.BitacoraData !== [] && this.BitacoraData !== null) {
      console.log(
        'Calculando transicion this.BitacoraData.length:',
        this.BitacoraData.length
      );
      if (this.BitacoraData[0]) {
        // Obtener transciocion segundos y segundos HH:mm:ss
        try {
          console.log('Calulando transicion_______________>>>');
          const objTransicion: any = this.utilidadesProvider.getTimeHHmmss(
            this.BitacoraData[0].FechaHoraFinal,
            dtSQLStartNewItem
          );
          objNewItem.Transicion = objTransicion.segundosDiferencia;
          objNewItem.TransicionHhmmss = objTransicion.segundosHhmmss;
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      this.BitacoraData = [];
    }
    this.currentItemBitacora = new BitacoraModel(objNewItem);
    this.BitacoraData.unshift(this.currentItemBitacora);
    // Guardar en LocalStorage ObjBitacora
    this.bitacoraProvider.guardarBitacoraInStorage(this.BitacoraData);
    // Boolean para saber si hay elementos en la bitacora
    this.haveElements = true;
    console.log('this.BitacoraData after UNSHIFT', this.BitacoraData);
  }
  // Funcion detiene el vento debe guardarse en localStorage
  public terminar() {
    console.log('Termina funcion Actividades');
  }
  public editar() {
    console.log('Se abre el panel para editar el item bitacora');
  }
  public eliminar() {
    console.log('Eliminar', this.actividadActual);
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
            clearInterval(this.control);

            this.stInProgress = false;
            (document.getElementById(
              'inicio'
            ) as HTMLInputElement).disabled = false;
            (document.getElementById(
              'eliminar'
            ) as HTMLInputElement).disabled = true;
            (document.getElementById(
              'guardar'
            ) as HTMLInputElement).disabled = true;
            this.strSegundos = ':00';
            this.strMinutos = ':00';
            this.strHoras = '00';
            try {
              this.BitacoraData.splice(0, 1);
              // Al eliminar un elemento se actualiza el LocalStorage
              this.bitacoraProvider.guardarBitacoraInStorage(this.BitacoraData);
              if (this.BitacoraData !== []) {
                if (this.BitacoraData.length >= 1) {
                  this.haveElements = true;
                } else {
                  this.haveElements = false;
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
  public guardar() {
    this.dtFechaFin = this.dtCurrentDT;
    this.BitacoraData[0].FechaHoraFinal = this.utilidadesProvider.isoStringToSQLServerFormat(
      this.dtFechaFin
        .toISOString()
        .toString()
        .toUpperCase()
    );
    this.BitacoraData[0].Terminado = true;
    clearInterval(this.control);
    // Obtener el tiempo transcurrido
    const objTiempoTranscurrido: any = this.utilidadesProvider.getTimeHHmmss(
      this.BitacoraData[0].FechaHoraFinal,
      this.BitacoraData[0].FechaHoraInicio
    );
    this.BitacoraData[0].SegundosTotal =
      objTiempoTranscurrido.segundosDiferencia;
    this.BitacoraData[0].TiempoHhmmss = objTiempoTranscurrido.segundosHhmmss;
    (document.getElementById('guardar') as HTMLInputElement).disabled = true;
    (document.getElementById('eliminar') as HTMLInputElement).disabled = true;
    (document.getElementById('inicio') as HTMLInputElement).disabled = false;
    this.strSegundos = ':00';
    this.strMinutos = ':00';
    this.strHoras = '00';
    this.stInProgress = false;
    // Al (guardar / terminar) ItemBitacora se actualiza la informacion en el provider y LocalStorage
    this.bitacoraProvider.guardarBitacoraInStorage(this.BitacoraData);
  }
  // Obtiene el tiempo transcurrido entre la fecha que inicio el evento y la fecha actual (Se ejecuta cada segundo)
  public cronometro(that) {
    that.dtCurrentDT = new Date();
    const dtFnCurrent: Date = this.utilidadesProvider.convertLocalDateToUTC(
      that.dtCurrentDT
    );
    const dateDiff = Math.abs(
      (dtFnCurrent.valueOf() - that.dtFechaInicio.valueOf()) / 1000
    );
    // console.log('' + that.date1 + ' <-> ' + that.date2 + ' DIFF: ' + dateDiff);
    let horas: any = Math.floor(dateDiff / 3600);
    let minutos: any = Math.floor((dateDiff - horas * 3600) / 60);
    let segundos: any = Math.round(dateDiff - horas * 3600 - minutos * 60);

    if (
      (segundos === 60 && minutos === 59) ||
      (segundos === 60 && minutos === 60)
    ) {
      horas++;
      if (horas < 10) {
        that.strHoras = '0' + String(horas);
      } else {
        that.strHoras = String(horas);
      }
      minutos = 0;
      segundos = 0;
      that.strSegundos = ':0' + String(segundos);
      that.strMinutos = ':0' + String(minutos);
    }
    if (segundos === 60) {
      segundos = 0;
      that.strSegundos = ':0' + String(segundos);

      if (minutos === 59 || minutos === 60) {
        minutos = 0;
        that.strMinutos = ':0' + String(minutos);
        horas++;
        if (horas < 10) {
          that.strHoras = '0' + String(horas);
        } else {
          that.strHoras = String(horas);
        }
      } else {
        minutos++;
        if (minutos < 10) {
          that.strMinutos = ':0' + String(minutos);
        } else {
          that.strMinutos = String(minutos);
        }
      }
    }
    if (segundos < 10) {
      segundos = '0' + segundos;
    }
    that.strSegundos = ':' + String(segundos);
    if (minutos < 10) {
      minutos = '0' + minutos;
    }
    that.strMinutos = ':' + String(minutos);
    if (horas < 10) {
      horas = '0' + horas;
    }
    that.strHoras = String(horas);
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

  // Esta función no se utiliza, Lleba el control del cronometro en Memoria RAM (Si se suspende el dispositivo o computadora se pierde el Conteo)
  public cronometroManual(that) {
    that.segundos++;
    console.log('In fn cronometro', that.segundos, that.minutos, that.horas);
    if (that.segundos === 60) {
      that.minutos++;
    }
    if (that.segundos === 60 && that.minutos === 60) {
      that.segundos = 0;
      that.minutos = 0;
      that.horas++;
    } else {
      if (that.segundos === 60) {
        that.segundos = 0;
      }
    }
    if (that.segundos < 10) {
      that.strSegundos = ':0' + that.segundos;
    } else {
      that.strSegundos = ':' + that.segundos;
    }
    if (that.minutos < 10) {
      that.strMinutos = ':0' + that.minutos;
    } else {
      that.strMinutos = ':' + that.minutos;
    }
    if (that.horas < 10) {
      that.strHoras = '0' + String(that.horas);
    } else {
      that.strHoras = String(that.horas);
    }
  }
  // change title card activity

  public changeTitlte(Actividad: string) {
    console.log('In change title', this.BitacoraData);
    if (this.BitacoraData.length >= 1) {
      this.BitacoraData[0].Actvidad = Actividad;
      // Cuando se cambia de actividad tambien se actualiza LocalStorage
      this.bitacoraProvider.guardarBitacoraInStorage(this.BitacoraData);
    }
  }
  public changeTitlteLarge(Actividad: string) {
    switch (Actividad) {
    case 'S': {
      this.actividaActualTtl = 'Servicio';
      break;
    }
    case 'C': {
      this.actividaActualTtl = 'Conduciendo';
      break;
    }
    case 'D': {
      this.actividaActualTtl = 'Descanso';
      break;
    }
    case 'FS': {
      this.actividaActualTtl = 'Fuera de servicio';
      break;
    }
    case 'ET': {
      this.actividaActualTtl = 'Excepción temporal';
      break;
    }
    default: {
      this.actividaActualTtl = '--';
      break;
    }
    }
  }
  public goToDetallesItem(itemBitacora: BitacoraModel) {
    console.log('goToDetalles', itemBitacora);
    this.navCtrl.push(DetalleItemBitacoraPage, { itemBitacora });
  }
}
