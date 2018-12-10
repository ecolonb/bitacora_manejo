import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'actividadProgressTitle'
})
export class ActividadProgressTitlePipe implements PipeTransform {
  transform(value: string, ...args) {
    let strTitle: string;

    if (value === 'S') {
      strTitle = 'En servicio';
    } else if (value === 'C') {
      strTitle = 'En conducción';
    } else if (value === 'D') {
      strTitle = 'En descanso';
    } else if (value === 'ET') {
      strTitle = 'Excepción temporal';
    } else if (value === 'FS') {
      strTitle = 'Fuera de servicio';
    } else if (value === '-') {
      strTitle = 'Sin actividad';
    }

    return strTitle;
  }
}
