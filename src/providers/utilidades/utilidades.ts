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
    // console.log('hash', hash);
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
  // Función obtiene la diferenfia entre dos fechas Return String HH:mm:ss
  public getTimeHHmmss(Fecha1: string, Fecha2: string): any {
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

    let horas: any = Math.floor(dateDiff / 3600);
    let minutos: any = Math.floor((dateDiff - horas * 3600) / 60);
    let segundos: any = Math.round(dateDiff - horas * 3600 - minutos * 60);

    if (segundos === 60) {
      segundos = 0;

      if (minutos === 60) {
        minutos = 0;
      }
    }
    if (segundos < 10) {
      segundos = '0' + segundos;
    }
    if (minutos < 10) {
      minutos = '0' + minutos;
    }
    if (horas < 10) {
      horas = '0' + horas;
    }
    // Asignado segundosHhmmss
    const strTiempoHHmmss = horas + ':' + minutos + ':' + segundos;
    objRespuesta.segundosHhmmss = strTiempoHHmmss;
    return objRespuesta;
  }
}
