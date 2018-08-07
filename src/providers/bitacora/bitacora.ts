import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
// import { Observable } from 'rxjs/Observable';
import { filter, map, switchMap } from 'rxjs/operators';
import { BitacoraServerModel } from '../../models/bitacora-server.model';
import { BitacoraModel } from '../../models/bitacora.model';
import { AppConfiguracionProvider } from '../app-configuracion/app-configuracion';
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

  constructor(
    public http: HttpClient,
    private appConfiguracionProvider: AppConfiguracionProvider
  ) {
    // Realizar diferencias de fechas bitacora:
  }
  public setBitacora(objDatos: any) {
    // Modelando la data y guardandola en el array de items bitácora
    const data = new BitacoraModel(objDatos);
    this.BitacoraData.unshift(data);
    console.log(
      'Se ha guardado un elemento en this.BitacoraData --> ',
      this.BitacoraData
    );
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
    return this.http
      .post(this.UrlEndPoint, dataSendform, HEADERS)
      .toPromise()
      .then((RESULTDATA: BitacoraServerModel[]) => {
        console.log('In new peomise-->');
        this.BitacoraDataServer = RESULTDATA;
        this.BitacoraDataServerNow = this.BitacoraDataServer[0];
        this.BitacoraDataServerBack = this.BitacoraDataServer[1];
        // resolve();
      });
    // });

    // return bitacoraPromise;
  }

  public getHHmmss() {
    console.log('this.BitacoraDataServerNow', this.BitacoraDataServerNow);
    this.strTiempoManejo = this.getTimeHHmmss(
      this.BitacoraDataServerNow.ULTIMO_INICIO_MANEJO,
      this.BitacoraDataServerNow.ULTIMO_FIN_MANEJO
    );

    this.strTiempoServicio = this.getTimeHHmmss(
      this.BitacoraDataServerNow.ULTIMO_INICIO_SERVICIO,
      this.BitacoraDataServerNow.ULTIMO_FIN_SERVICIO
    );
  }

  // Función obtiene la diferenfia entre dos fechas Return String HH:mm:ss
  public getTimeHHmmss(Fecha1, Fecha2): string {
    const fecha1date = new Date(Fecha1);
    const fecha2date = new Date(Fecha2);
    console.log('fecha1date', fecha1date);
    console.log('fecha2date', fecha2date);
    let strTiempoHHmmss = '';
    let dateDiff = Math.abs(fecha1date.valueOf() - fecha2date.valueOf());

    dateDiff /= 1000;
    let horas: any = Math.floor(dateDiff / 3600);
    let minutos: any = Math.floor((dateDiff - horas * 3600) / 60);
    let segundos: any = Math.round(dateDiff - horas * 3600 - minutos * 60);

    if (horas < 10) {
      horas = '0' + horas;
    }

    if (minutos < 10) {
      minutos = '0' + minutos;
    }

    if (segundos < 10) {
      segundos = '0' + segundos;
    }
    strTiempoHHmmss = horas + ':' + minutos + ':' + segundos;
    console.log('Tiempo transcurrido: ', strTiempoHHmmss);
    return strTiempoHHmmss;
  }

  // Obtiene el tiempo total por evento String(Conduciendo, Servicio, Descanso)
  public getTimeForBitacora(idTiempo: number): string {
    let strtiempohhmmss: string = '';
    if (idTiempo === 1) {
      strtiempohhmmss = this.strTiempoManejo;
    } else if (idTiempo === 2) {
      strtiempohhmmss = this.strTiempoServicio;
    }

    return strtiempohhmmss;
  }
}
