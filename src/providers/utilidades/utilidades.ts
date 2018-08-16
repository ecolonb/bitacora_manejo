import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UtilidadesProvider {
  constructor(public http: HttpClient) {}

  // ********************** Metodos públicos ********************

  // Convierte fecha toISOString a formato sql server YYYY-mm-dd HH:mm:ss.fffff
  public isoStringToSQLServerFormat(strFechaISO: string): string {
    let fechaSqlServerFormat: string = strFechaISO;
    fechaSqlServerFormat = fechaSqlServerFormat.replace('T', ' ');
    fechaSqlServerFormat = fechaSqlServerFormat.replace('Z', '');
    fechaSqlServerFormat = fechaSqlServerFormat.trim();
    return fechaSqlServerFormat;
  }
  // Este metodo nos devuelve un numero entero no repetido (id_bitacora)
  public hashCode(stringToConvert: string) {
    let hash: number = 0;
    if (stringToConvert.length === 0) {
      return hash;
    }
    for (let i = 0; i < stringToConvert.length; i++) {
      const char = stringToConvert.charCodeAt(i);
      // tslint:disable-next-line:no-bitwise
      hash = (hash << 5) - hash + char;
      // tslint:disable-next-line:no-bitwise
      hash = Math.round(Math.abs(hash & hash)); // Convert to 32bit integer
    }
    return hash;
  }
  // Funcion para convertir fecha local a UTC
  public convertLocalDateToUTC(date: Date): Date {
    const date2: Date = new Date(
      date
        .toISOString()
        .toString()
        .toUpperCase()
        .replace('Z', '')
        .trim()
    );

    return date2;
  }
  // Funcion para convertir String Fecha(SQLServer) a Datetime
  public convertSqlToDate(FechaSql: string): Date {
    FechaSql = FechaSql.replace(' ', 'T');
    return new Date(FechaSql);
  }
  // Función obtiene la diferenfia entre dos fechas Return String HH:mm:ss
  public getTimeHHmmss(Fecha1: string, Fecha2: string) {
    const objRespuesta = {
      segundosDiferencia: 0,
      segundosHhmmss: '00:00:00'
    };
    const fecha1date = new Date(Fecha1.replace(' ', 'T'));
    const fecha2date = new Date(Fecha2.replace(' ', 'T'));
    // Obteniendo diferencia de fechas en Segundos
    const dateDiff = Math.abs(
      (fecha1date.valueOf() - fecha2date.valueOf()) / 1000
    );
    // Asignando segundos transcurridos
    objRespuesta.segundosDiferencia = dateDiff;

    const horas: number = Math.floor(dateDiff / 3600);
    let minutos: number = Math.floor((dateDiff - horas * 3600) / 60);
    let segundos: number = Math.round(dateDiff - horas * 3600 - minutos * 60);

    let strHoras: string = '';
    let strMinutos: string = '';
    let strSegundos: string = '';
    if (segundos === 60) {
      segundos = 0;

      if (minutos === 60) {
        minutos = 0;
      }
    }
    if (segundos < 10) {
      strSegundos = '0' + String(segundos);
    } else {
      strSegundos = String(segundos);
    }
    if (minutos < 10) {
      strMinutos = '0' + String(minutos);
    } else {
      strMinutos = String(minutos);
    }
    if (horas < 10) {
      strHoras = '0' + String(horas);
    } else {
      strHoras = String(horas);
    }
    // Asignado segundosHhmmss
    const strTiempoHHmmss: string =
      strHoras + ':' + strMinutos + ':' + strSegundos;

    objRespuesta.segundosHhmmss = strTiempoHHmmss;
    return objRespuesta;
  }
  public convertSecondToHhhmmss(Segundos: number) {
    console.log('in convert function');
    const horas: number = Math.floor(Segundos / 3600);
    let minutos: number = Math.floor((Segundos - horas * 3600) / 60);
    let segundos: number = Math.round(Segundos - horas * 3600 - minutos * 60);

    let strHoras: string = '';
    let strMinutos: string = '';
    let strSegundos: string = '';
    if (segundos === 60) {
      segundos = 0;

      if (minutos === 60) {
        minutos = 0;
      }
    }
    if (segundos < 10) {
      strSegundos = '0' + String(segundos);
    } else {
      strSegundos = String(segundos);
    }
    if (minutos < 10) {
      strMinutos = '0' + String(minutos);
    } else {
      strMinutos = String(minutos);
    }
    if (horas < 10) {
      strHoras = '0' + String(horas);
    } else {
      strHoras = String(horas);
    }
    // Formating segundosHhmmss
    const Respuesta = strHoras + ':' + strMinutos + ':' + strSegundos;
    console.log('Respuesta: ', Respuesta);
    return Respuesta;
  }
}
