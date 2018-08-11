import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UtilidadesProvider {
  constructor(public http: HttpClient) {
    // code test
    // const dateTest1: Date = this.convertLocalDateToUTC(
    //   new Date('2018-08-06T03:14:56')
    // );
    // console.log('2018-08-06 03:14:56 <-> ', dateTest1);
  }

  // ********************** Metodos públicos ********************

  // Convierte fecha toISOString a formato sql server YYYY-mm-dd HH:mm:ss.fffff
  public isoStringToSQLServerFormat(strFechaISO: string): string {
    let fechaSqlServerFormat = strFechaISO;
    fechaSqlServerFormat = fechaSqlServerFormat.replace('T', ' ');
    fechaSqlServerFormat = fechaSqlServerFormat.replace('Z', '');
    return fechaSqlServerFormat;
  }
  // Este metodo nos devuelve un nmerto entero no repetido (id_bitacora)
  public hashCode(stringToConvert: string) {
    let hash: number = 0;
    if (stringToConvert.length === 0) {
      return hash;
    }
    for (let i = 0; i < stringToConvert.length; i++) {
      const char = stringToConvert.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = Math.round(Math.abs(hash & hash)); // Convert to 32bit integer
    }
    console.log('hash', hash);
    return hash;
  }
  // Funcion para convertir fecha local a UTC
  public convertLocalDateToUTC(date): Date {
    console.log('In convertUTCDateToLocalDate--->>>', date);
    // console.log('date.getTimezoneOffset()', date.getTimezoneOffset());
    // const newDate = new Date(
    //   date.getTime() + date.getTimezoneOffset() * 60 * 1000
    // );
    // const offset = date.getTimezoneOffset() / 60;
    // const hours = date.getHours();
    // newDate.setHours(hours - 5);

    const date2: Date = new Date(
      date
        .toUTCString()
        .toString()
        .replace('GMT', '')
        .trim()
    );
    console.log('Out convertUTCDateToLocalDate--->>>', date2);

    return date2;
  }
  // Función obtiene la diferenfia entre dos fechas Return String HH:mm:ss
  public getTimeHHmmss(Fecha1, Fecha2): string {
    const fecha1date = new Date(Fecha1);
    const fecha2date = new Date(Fecha2);
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
    // console.log('Tiempo transcurrido: ', strTiempoHHmmss);
    return strTiempoHHmmss;
  }
}
