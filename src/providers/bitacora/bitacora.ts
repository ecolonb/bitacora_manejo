import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// ******** MODELOS DE DATOS *******
import { BitacoraServerModel } from '../../models/bitacora-server.model';
import { BitacoraModel } from '../../models/bitacora.model';

// ******** PROVIDERS *******
import { AppConfiguracionProvider } from '../app-configuracion/app-configuracion';
import { UtilidadesProvider } from '../utilidades/utilidades';

// ******** PLUGINS *******
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';
import { filter, map, switchMap } from 'rxjs/operators';
/**
 * Este servicio administra la información de las Bitácoras
 */
@Injectable()
export class BitacoraProvider {
  // Control de la actividad actual
  public Conduciendo: boolean = false;
  public Descanso: boolean = false;
  public ExcepcionTemporal: boolean = false;
  public dsConduciendo: boolean = false;
  public dsDescanso: boolean = false;
  public dsExcepcionTemporal: boolean = false;

  // *** STATUS UPDATE ***
  public segundosConduccionStorage: number = 0;
  public segundosDescansoStorage: number = 0;
  public segundosExcepcionTStorage: number = 0;

  public segundosConduccion: number = 0;
  public segundosDescanso: number = 0;
  public segundosExcepcionT: number = 0;
  public segundosConduccionHhmmss: string = '00:00:00';
  public segundosDescansoHhmmss: string = '00:00:00';
  public segundosExcepcionTHhmmss: string = '00:00:00';
  public boolIniciado: boolean = false;
  public segIninicio: number = 0;

  // dtFechaFin dtCurrentDT
  public actividadActual: string = '-';
  public actividaActualTtl: string = '-';
  public boolServicio: boolean = false;
  public boolReinicio: boolean = false;

  // PAra mantener el ambito de las variables
  public BitacoraData: BitacoraModel[] = [];
  public currentItemBitacora: BitacoraModel;
  public StatusServicio: BitacoraModel;
  public haveElements: boolean = false;

  // public that = this;
  public strSegundos: string = ':00';
  public strMinutos: string = ':00';
  public strHoras: string = '00';
  public numSegundosActuales: number = 0;
  public strSegundosServicio: string = ':00';
  public strMinutosServicio: string = ':00';
  public strHorasServicio: string = '00';
  public dtFechaInicio: Date = null;
  public dtFechaFin: Date = null;
  public dtCurrentDT: Date = null;
  public fechaInicioServicio: Date;
  public fehoraActualSystem: Date;

  public BitacoraDataServerNow: BitacoraServerModel;
  public BitacoraDataServerBack: BitacoraServerModel;
  public strTiempoManejo: any = null;
  public strTiempoServicio: any = null;

  public strTatusLocation: string = '';
  public strTatusLocationMode: string = '';

  public InicioActividadX: number;
  public InicioActividadY: number;
  public FinActividaX: number;
  public FinActividadY: number;
  public stInProgress: boolean = false;
  public control: any;
  public ctrlTimerServicio: any;
  // Array donde se guardarán los items de la bitácora
  private UrlEndPoint: string =
    'http://dev1.copiloto.com.mx/lab/rest/api/Bitacora';

  private centesimas: number = 0;
  private segundos: number = 0;
  private minutos: number = 0;
  private horas: number = 0;
  private that: any = this;
  // Array Tipeado con el formato de la bitácora
  private BitacoraDataStorage: BitacoraModel[] = [];

  constructor(
    public http: HttpClient,
    private appConfiguracionProvider: AppConfiguracionProvider,
    private utilidadesProvider: UtilidadesProvider,
    private platform: Platform,
    private storage: Storage
  ) {}

  public getBitacora() {
    return this.BitacoraDataStorage;
  }

  // Obtiene la bitacora desde el LocalStorage y actualiza el estado de las g¡horas en servicio
  public getBitacoraFromStorage() {
    const storageInfoPromise = new Promise((resolve, reject) => {
      this.segundosConduccionStorage = 0;
      this.segundosDescansoStorage = 0;
      this.segundosExcepcionTStorage = 0;
      if (this.platform.is('cordova')) {
        this.storage.ready().then(() => {
          // Get items from Storage
          this.storage
            .get('ObjBitacoraDataStorage')
            .then((ObjBitacoraDataStorage) => {
              if (ObjBitacoraDataStorage) {
                this.BitacoraDataStorage = JSON.parse(ObjBitacoraDataStorage);
                this.BitacoraData = this.BitacoraDataStorage;
              } else {
                this.BitacoraData = [];
              }
              this.getStatus();
              resolve(true);
            });
        });
      } else {
        this.BitacoraDataStorage = JSON.parse(
          localStorage.getItem('ObjBitacoraDataStorage')
        );
        if (this.BitacoraDataStorage) {
          this.BitacoraData = this.BitacoraDataStorage;
        }
        this.getStatus();
        resolve(true);
      }
    });
    return storageInfoPromise;
  }

  // Guarda la bitacora actual en LocalStorage
  public guardarBitacoraInStorage(): Promise<any> {
    const guardarConfiguracionUsuarioPromise = new Promise(
      (resolve, reject) => {
        this.segundosConduccionStorage = 0;
        this.segundosDescansoStorage = 0;
        this.segundosExcepcionTStorage = 0;

        // Guardando en LocalStorage y actualizando el status de horas invertidas
        if (this.platform.is('cordova')) {
          // Dispositivo cordova is running
          this.storage.set(
            'ObjBitacoraDataStorage',
            JSON.stringify(this.BitacoraData)
          );
          // Actualizando el Status principal
          this.getStatus();
          resolve(true);
        } else {
          // Desktop webBrowser
          if (this.BitacoraData) {
            localStorage.setItem(
              'ObjBitacoraDataStorage',
              JSON.stringify(this.BitacoraData)
            );
          } else {
            localStorage.removeItem('ObjBitacoraDataStorage');
          }
          this.getStatus();
          resolve(true);
        }
      }
    );
    return guardarConfiguracionUsuarioPromise;
  }
  // public getBitacoraServer(): Promise<any> {
  //   // const bitacoraPromise = new Promise((resolve, reject) => {
  //   // console.log('Bitacora provider');
  //   // Realizar petición Http obtener bitacora
  //   const HEADERS = {
  //     headers: { 'Content-Type': 'application/json; charset=utf-8' }
  //   };
  //   // Obj datos que recibe el ApiRestFul LoginIbutton
  //   const dataSendform = {
  //     ibutton: Number(this.appConfiguracionProvider.getIdIbutton()),
  //     date1: '2018-08-05',
  //     date2: '2018-08-06',
  //     serverId: this.appConfiguracionProvider.getServerEndPoint()
  //   };
  //   console.log('UrlEndPoint', this.UrlEndPoint);
  //   console.log('dataSendform', dataSendform);

  //   return this.http
  //     .post(this.UrlEndPoint, dataSendform, HEADERS)
  //     .toPromise()
  //     .then((RESULTDATA: BitacoraServerModel[]) => {
  //       console.log('RESULTDATA getBitacoraServer', RESULTDATA);
  //       this.BitacoraDataServer = RESULTDATA;
  //       this.BitacoraDataServerNow = this.BitacoraDataServer[0];
  //       this.BitacoraDataServerBack = this.BitacoraDataServer[1];
  //       // resolve();
  //     });
  //   // });

  //   // return bitacoraPromise;
  // }

  // Obtiene la bitacora del localStorage
  public getBitacoraDataStorage(): BitacoraModel[] {
    return this.BitacoraData;
  }

  // Eliminar la bitácora actual y actualizar el localStorage
  public deleteBitacoraDataStorage() {
    this.BitacoraData = null;
    this.guardarBitacoraInStorage();
  }

  // Obtiene el tiempo transcurrido entre la fecha que inicio el evento y la fecha actual (Se ejecuta cada segundo)
  public cronometro() {
    this.dtCurrentDT = new Date();

    const dtFnCurrent: Date = this.utilidadesProvider.convertLocalDateToUTC(
      this.dtCurrentDT
    );
    const dateDiff: number = Math.abs(
      (dtFnCurrent.valueOf() - this.dtFechaInicio.valueOf()) / 1000
    );

    this.numSegundosActuales = dateDiff;

    let horas: any = Math.floor(dateDiff / 3600);
    let minutos: any = Math.floor((dateDiff - horas * 3600) / 60);
    let segundos: any = Math.round(dateDiff - horas * 3600 - minutos * 60);

    if (
      (segundos === 60 && minutos === 59) ||
      (segundos === 60 && minutos === 60)
    ) {
      horas++;
      if (horas < 10) {
        this.strHoras = '0' + String(horas);
      } else {
        this.strHoras = String(horas);
      }
      minutos = 0;
      segundos = 0;
      this.strSegundos = ':0' + String(segundos);
      this.strMinutos = ':0' + String(minutos);
    }
    if (segundos === 60) {
      segundos = 0;
      this.strSegundos = ':0' + String(segundos);

      if (minutos === 59 || minutos === 60) {
        minutos = 0;
        this.strMinutos = ':0' + String(minutos);
        horas++;
        if (horas < 10) {
          this.strHoras = '0' + String(horas);
        } else {
          this.strHoras = String(horas);
        }
      } else {
        minutos++;
        if (minutos < 10) {
          this.strMinutos = ':0' + String(minutos);
        } else {
          this.strMinutos = String(minutos);
        }
      }
    }
    if (segundos < 10) {
      segundos = '0' + segundos;
    }
    this.strSegundos = ':' + String(segundos);
    if (minutos < 10) {
      minutos = '0' + minutos;
    }
    this.strMinutos = ':' + String(minutos);
    if (horas < 10) {
      horas = '0' + horas;
    }
    this.strHoras = String(horas);
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
    // (document.getElementById('guardar') as HTMLInputElement).disabled = true;
    // this.strSegundos = ':00';
    // this.strMinutos = ':00';
    // this.strHoras = '00';
    this.stInProgress = false;
    this.numSegundosActuales = 0;
    // Validar en que estado estába y terminarlo
    this.Conduciendo = false;
    this.Descanso = false;
    this.ExcepcionTemporal = false;
    this.dsConduciendo = false;
    this.dsDescanso = false;
    this.dsExcepcionTemporal = false;
    // this.actividaActualTtl = 'S';
    // this.actividadActual = 'S';
    // Al (guardar / terminar) ItemBitacora se actualiza la informacion en el provider y LocalStorage
    this.guardarBitacoraInStorage();
  }
  // Crear Item bitacora
  public newItemBitacora(dtSart: Date) {
    try {
      // this.currentItemBitacora.IdViaje = 1368;
      // Obtener un hash de la bitacora

      let dtSQLStartNewItem: string;
      dtSQLStartNewItem = this.utilidadesProvider.isoStringToSQLServerFormat(
        dtSart
          .toISOString()
          .toString()
          .toUpperCase()
      );

      this.dtFechaInicio = this.utilidadesProvider.convertSqlToDate(
        dtSQLStartNewItem
      );
      // 2018-08-20 00:52:12.265

      let objNewItem: any;
      objNewItem = {
        IdViaje: 1368,
        HashBitacora: this.utilidadesProvider.hashCode(
          this.dtFechaInicio.toString() + 'TOKEN'
        ),
        FechaHoraInicio: dtSQLStartNewItem,
        FechaHoraFinal: null,
        SegundosTotal: 0,
        TiempoHhmmss: null,
        Actividad: this.actividadActual,
        InicioActividadX: 9933,
        InicioActividadY: 9393,
        FinActividaX: null,
        FinActividadY: null,
        Descripcion: null,
        GuardadoServer: false,
        Nota: null,
        Transicion: 0,
        TransicionHhmmss: '00:00:00',
        Terminado: false
      };

      try {
        // typeof this.BitacoraData != "undefined" && this.BitacoraData != null && this.BitacoraData.length != null && this.BitacoraData.length > 0
        if (this.BitacoraData !== []) {
          // Obtener transciocion segundos y segundos HH:mm:ss
          try {
            const objTransicion: any = this.utilidadesProvider.getTimeHHmmss(
              this.BitacoraData[0].FechaHoraFinal,
              dtSQLStartNewItem
            );
            objNewItem.Transicion = objTransicion.segundosDiferencia;
            objNewItem.TransicionHhmmss = objTransicion.segundosHhmmss;
          } catch (error) {
            // this.BitacoraData = [];
          }
        }
      } catch (error) {
        // Error punto length
        // this.BitacoraData = [];
      }
      this.currentItemBitacora = new BitacoraModel(objNewItem);
      try {
        this.BitacoraData.unshift(this.currentItemBitacora);
      } catch (error) {
        this.BitacoraData = [];
        this.BitacoraData.unshift(this.currentItemBitacora);
      }
      // Guardar en LocalStorage ObjBitacora
      this.guardarBitacoraInStorage();
      // Boolean para saber si hay elementos en la bitacora
      this.haveElements = true;
    } catch (error) {}
  }
  public iniciarServicio() {
    console.log('Inciando servicio------>>');
    // IdViaje se puede bajar del servidor o se genera si el conductor cinfigura el viaje
    const dtSQLIniciaServicio: string = this.utilidadesProvider.isoStringToSQLServerFormat(
      new Date()
        .toISOString()
        .toString()
        .toUpperCase()
    );
    const objIniciaServicio: BitacoraModel = {
      IdViaje: 1368,
      HashBitacora: this.utilidadesProvider.hashCode(
        dtSQLIniciaServicio.toString() + 'TOKEN'
      ),
      FechaHoraInicio: dtSQLIniciaServicio,
      FechaHoraFinal: null,
      SegundosTotal: 0,
      TiempoHhmmss: null,
      Actividad: 'S',
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
    this.StatusServicio = objIniciaServicio;
    this.fechaInicioServicio = this.utilidadesProvider.convertSqlToDate(
      this.StatusServicio.FechaHoraInicio
    );
    // Guardar ServicioActual en localStorage y inicir contador de Servicio y la fecha Hora
    this.guardaServicioActualInStorage()
      .then(() => {})
      .catch((error) => {});
    this.segundosConduccionStorage = 0;
    this.segundosDescansoStorage = 0;
    this.segundosExcepcionTStorage = 0;
    this.getStatus();
    this.ctrlTimerServicio = setInterval(() => {
      this.timerServicio();
      this.getDateTimeNow();
      this.statusUpdate();
    }, 1000);
  }
  public resetServicicio() {
    this.segundosConduccionStorage = 0;
    this.segundosDescansoStorage = 0;
    this.segundosExcepcionTStorage = 0;
    this.getStatus();
    this.ctrlTimerServicio = setInterval(() => {
      this.timerServicio();
      this.getDateTimeNow();
      this.statusUpdate();
    }, 1000);
  }
  public getStatus() {
    // typeof this.BitacoraData != "undefined" && this.BitacoraData != null && this.BitacoraData.length != null && this.BitacoraData.length > 0
    if (
      typeof this.BitacoraData !== 'undefined' &&
      this.BitacoraData != null &&
      this.BitacoraData.length != null &&
      this.BitacoraData.length > 0
    ) {
      for (const itBitacora of this.BitacoraData) {
        if (itBitacora.Terminado === true) {
          if (itBitacora.Actividad === 'C') {
            this.segundosConduccionStorage += itBitacora.SegundosTotal;
            this.segundosConduccion = this.segundosConduccionStorage;
          } else if (itBitacora.Actividad === 'D') {
            this.segundosDescansoStorage += itBitacora.SegundosTotal;
            this.segundosDescanso = this.segundosDescansoStorage;
          } else if (itBitacora.Actividad === 'ET') {
            this.segundosExcepcionTStorage += itBitacora.SegundosTotal;
            this.segundosExcepcionT = this.segundosExcepcionTStorage;
          }
        }
      }
    }
  }
  public statusUpdate() {
    try {
      // Actualizar tiempo en HHmmss
      if (this.stInProgress) {
        if (
          typeof this.BitacoraData !== 'undefined' &&
          this.BitacoraData != null &&
          this.BitacoraData.length != null &&
          this.BitacoraData.length > 0
        ) {
          if (this.BitacoraData[0].Terminado === false) {
            if (this.BitacoraData[0].Actividad === 'C') {
              this.segundosConduccion =
                this.segundosConduccionStorage + this.numSegundosActuales;
            }
            if (this.BitacoraData[0].Actividad === 'D') {
              this.segundosDescanso =
                this.segundosDescansoStorage + this.numSegundosActuales;
            }
            if (this.BitacoraData[0].Actividad === 'ET') {
              this.segundosExcepcionT =
                this.segundosExcepcionTStorage + this.numSegundosActuales;
            }
          }
        }
        this.segundosConduccionHhmmss = this.utilidadesProvider.convertSecondToHhhmmss(
          this.segundosConduccion
        );
        this.segundosDescansoHhmmss = this.utilidadesProvider.convertSecondToHhhmmss(
          this.segundosDescanso
        );
        this.segundosExcepcionTHhmmss = this.utilidadesProvider.convertSecondToHhhmmss(
          this.segundosExcepcionT
        );
      }
    } catch (error) {}
  }
  // configurar Servicio -->> Datos completos que se usarn en tabla Servicios(viajes)
  public configurarServicio() {
    console.log('Configurando servicio');
  }

  // Esta funcion obtiene el servicio actual de la bitacora
  public cargarServicioFromStorage() {
    const storageInfoPromise = new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.storage.ready().then(() => {
          // Get items from Storage in Device
          this.storage.get('ObjServicioActual').then((ObjServicioActual) => {
            this.StatusServicio = JSON.parse(ObjServicioActual);
            this.fechaInicioServicio = this.utilidadesProvider.convertSqlToDate(
              this.StatusServicio.FechaHoraInicio
            );
            resolve(true);
          });
        });
      } else {
        // Get items in Desktop Browser
        this.StatusServicio = JSON.parse(
          localStorage.getItem('ObjServicioActual')
        );
        if (this.StatusServicio) {
          this.fechaInicioServicio = this.utilidadesProvider.convertSqlToDate(
            this.StatusServicio.FechaHoraInicio
          );
          console.log('this.StatusServicio: ' + this.StatusServicio);
        }
        resolve(true);
      }
    });
    return storageInfoPromise;
  }

  // LLeva el control del tiempo en servicio
  private timerServicio() {
    const dtCurrentDT = new Date();
    // Obtenemos la fecha inicio en formato Date -> UTC
    const dtFnCurrent: Date = this.utilidadesProvider.convertLocalDateToUTC(
      dtCurrentDT
    );
    const dateDiff = Math.abs(
      (dtFnCurrent.valueOf() - this.fechaInicioServicio.valueOf()) / 1000
    );
    // console.log('' + this.date1 + ' <-> ' + this.date2 + ' DIFF: ' + dateDiff);
    let horas: any = Math.floor(dateDiff / 3600);
    let minutos: any = Math.floor((dateDiff - horas * 3600) / 60);
    let segundos: any = Math.round(dateDiff - horas * 3600 - minutos * 60);

    if (
      (segundos === 60 && minutos === 59) ||
      (segundos === 60 && minutos === 60)
    ) {
      horas++;
      if (horas < 10) {
        this.strHorasServicio = '0' + String(horas);
      } else {
        this.strHorasServicio = String(horas);
      }
      minutos = 0;
      segundos = 0;
      this.strSegundosServicio = ':0' + String(segundos);
      this.strMinutosServicio = ':0' + String(minutos);
    }
    if (segundos === 60) {
      segundos = 0;
      this.strSegundosServicio = ':0' + String(segundos);
      if (minutos === 59 || minutos === 60) {
        minutos = 0;
        this.strMinutosServicio = ':0' + String(minutos);
        horas++;
        if (horas < 10) {
          this.strHorasServicio = '0' + String(horas);
        } else {
          this.strHorasServicio = String(horas);
        }
      } else {
        minutos++;
        if (minutos < 10) {
          this.strMinutosServicio = ':0' + String(minutos);
        } else {
          this.strMinutosServicio = String(minutos);
        }
      }
    }
    if (segundos < 10) {
      segundos = '0' + segundos;
    }
    this.strSegundosServicio = ':' + String(segundos);
    if (minutos < 10) {
      minutos = '0' + minutos;
    }
    this.strMinutosServicio = ':' + String(minutos);
    if (horas < 10) {
      horas = '0' + horas;
    }
    this.strHorasServicio = String(horas);
  }

  // Private guardar servicio en localStorage
  private guardaServicioActualInStorage(): Promise<any> {
    const guardarServicioActualPromise = new Promise((resolve, reject) => {
      // Guardando en LocalStorage
      if (this.platform.is('cordova')) {
        // Dispositivo
        this.storage.set(
          'ObjServicioActual',
          JSON.stringify(this.StatusServicio)
        );
        resolve();
      } else {
        // Desktop webBrowser
        if (this.StatusServicio) {
          localStorage.setItem(
            'ObjServicioActual',
            JSON.stringify(this.StatusServicio)
          );
        } else {
          localStorage.removeItem('ObjServicioActual');
        }
        resolve();
      }
    });
    return guardarServicioActualPromise;
  }

  // Obtiene la fechaHora actual del dispositivo:
  private getDateTimeNow() {
    try {
      this.fehoraActualSystem = new Date();
    } catch (error) {}
  }
}
