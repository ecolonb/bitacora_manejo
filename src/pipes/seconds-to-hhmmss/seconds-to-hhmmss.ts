import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SecondsToHhmmssPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'secondsToHhmmss'
})
export class SecondsToHhmmssPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  public transform(value: string, ...args) {
    const seconds: number = Number(value);
    const horas: number = Math.floor(seconds / 3600);
    let minutos: number = Math.floor((seconds - horas * 3600) / 60);
    let segundos: number = Math.round(seconds - horas * 3600 - minutos * 60);

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
    return strHoras + ':' + strMinutos + ':' + strSegundos;
  }
}
