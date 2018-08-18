import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ActividadTitlePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'actividadTitle'
})
export class ActividadTitlePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  public transform(value: string, ...args) {
    let strTitle: string;

    if (value === 'S') {
      strTitle = 'Servicio';
    } else if (value === 'C') {
      strTitle = 'Conducción';
    } else if (value === 'D') {
      strTitle = 'Descanso';
    } else if (value === 'ET') {
      strTitle = 'Excepción temporal';
    } else if (value === 'FS') {
      strTitle = 'Fuera de servicio';
    }

    return strTitle;
  }
}
