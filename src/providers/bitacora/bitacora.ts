import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
// import { Observable } from 'rxjs/Observable';
import { filter, map, switchMap } from 'rxjs/operators';
import { BitacoraServerModel } from '../../models/bitacora-server.model';
import { BitacoraModel } from '../../models/bitacora.model';
import { AppConfiguracionProvider } from '../app-configuracion/app-configuracion';
import { UtilidadesProvider } from '../utilidades/utilidades';
/**
 * Este servicio administra la información de las Bitácoras
 */
@Injectable()
export class BitacoraProvider {
  public BitacoraDataServerNow: BitacoraServerModel;
  public BitacoraDataServerBack: BitacoraServerModel;
  public strTiempoManejo: any = null;
  public strTiempoServicio: any = null;
  // Array donde se guardarán los items de la bitácora
  private BitacoraData: BitacoraModel[] = [];
  private UrlEndPoint: string =
    'http://dev1.copiloto.com.mx/lab/rest/api/Bitacora';

  // Array Tipeado con el formato de la bitácora
  private BitacoraDataServer: BitacoraServerModel[] = [];
  private BitacoraDataStorage: BitacoraServerModel[] = [
    {
      ID_HISTORICO_BITACORA: 213455,
      NUID: 21345589144,
      ULTIMO_INICIO_SERVICIO: new Date(),
      ULTIMO_FIN_SERVICIO: new Date(),
      ULTIMO_INICIO_MANEJO: new Date(),
      ULTIMO_FIN_MANEJO: new Date(),
      MINUTOS_MANEJO_DIA_ACUMULADOS: 120,
      MINUTOS_SERVICIO_DIA_ACUMULADOS: 200,
      FECHA_HORA_LOCAL: new Date()
    },
    {
      ID_HISTORICO_BITACORA: 213456,
      NUID: 21345589144,
      ULTIMO_INICIO_SERVICIO: new Date(),
      ULTIMO_FIN_SERVICIO: new Date(),
      ULTIMO_INICIO_MANEJO: new Date(),
      ULTIMO_FIN_MANEJO: new Date(),
      MINUTOS_MANEJO_DIA_ACUMULADOS: 120,
      MINUTOS_SERVICIO_DIA_ACUMULADOS: 200,
      FECHA_HORA_LOCAL: new Date()
    },
    {
      ID_HISTORICO_BITACORA: 213457,
      NUID: 21345589144,
      ULTIMO_INICIO_SERVICIO: new Date(),
      ULTIMO_FIN_SERVICIO: new Date(),
      ULTIMO_INICIO_MANEJO: new Date(),
      ULTIMO_FIN_MANEJO: new Date(),
      MINUTOS_MANEJO_DIA_ACUMULADOS: 120,
      MINUTOS_SERVICIO_DIA_ACUMULADOS: 200,
      FECHA_HORA_LOCAL: new Date()
    }
  ];

  constructor(
    public http: HttpClient,
    private appConfiguracionProvider: AppConfiguracionProvider,
    private utilidadesProvider: UtilidadesProvider
  ) {
    // Realizar diferencias de fechas bitacora:
    console.log(
      'Provider Bitácora en localStorage: ',
      this.BitacoraDataStorage
    );

    // // TEST conversion de fecha local a UTC.
    // const strNowUTCSQLServer: string = this.utilidadesProvider.isoStringToSQLServerFormat(
    //   new Date()
    //     .toISOString()
    //     .toString()
    //     .toUpperCase()
    // );
    // console.log('SERVER TIME UTC: ', strNowUTCSQLServer);
  }

  public setBitacora(objDatos: any) {
    // Modelando la data y guardandola en el array de items bitácora
    const data = new BitacoraModel(objDatos);
    this.BitacoraData.unshift(data);
    // console.log(
    //   'Se ha guardado un elemento en this.BitacoraData --> ',
    //   this.BitacoraData
    // );
  }
  public getBitacora() {
    return this.BitacoraData;
  }
  public getBitacoraServer(): Promise<any> {
    // const bitacoraPromise = new Promise((resolve, reject) => {
    // console.log('Bitacora provider');
    // Realizar petición Http obtener bitacora
    const HEADERS = {
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    };
    // Obj datos que recibe el ApiRestFul LoginIbutton
    const dataSendform = {
      ibutton: Number(this.appConfiguracionProvider.getIdIbutton()),
      date1: '2018-08-05',
      date2: '2018-08-06',
      serverId: this.appConfiguracionProvider.getServerEndPoint()
    };
    console.log('UrlEndPoint', this.UrlEndPoint);
    console.log('dataSendform', dataSendform);

    return this.http
      .post(this.UrlEndPoint, dataSendform, HEADERS)
      .toPromise()
      .then((RESULTDATA: BitacoraServerModel[]) => {
        console.log('RESULTDATA getBitacoraServer', RESULTDATA);
        this.BitacoraDataServer = RESULTDATA;
        this.BitacoraDataServerNow = this.BitacoraDataServer[0];
        this.BitacoraDataServerBack = this.BitacoraDataServer[1];
        // resolve();
      });
    // });

    // return bitacoraPromise;
  }

  // public getHHmmss() {
  //   console.log('Se ejecuta esto despues del error');

  //   this.strTiempoManejo = this.getTimeHHmmss(
  //     this.BitacoraDataServerNow.ULTIMO_INICIO_MANEJO,
  //     this.BitacoraDataServerNow.ULTIMO_FIN_MANEJO
  //   );

  //   this.strTiempoServicio = this.getTimeHHmmss(
  //     this.BitacoraDataServerNow.ULTIMO_INICIO_SERVICIO,
  //     this.BitacoraDataServerNow.ULTIMO_FIN_SERVICIO
  //   );
  //   console.log('this.BitacoraDataServerNow', this.BitacoraDataServerNow);
  // }

  // Obtiene la bitacora del localStorage
  public getBitacoraDataStorage(): BitacoraServerModel[] {
    return this.BitacoraDataStorage;
  }
  // Obtiene el tiempo total por evento String(Conduciendo, Servicio, Descanso)
  public getTimeForBitacora(idTiempo: number): string {
    let strtiempohhmmss: string = '';
    if (idTiempo === 1) {
      strtiempohhmmss = '01:20:21';
    } else if (idTiempo === 2) {
      strtiempohhmmss = '02:20:21';
    }

    return strtiempohhmmss;
  }
}
