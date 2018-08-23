import { Pipe, PipeTransform } from '@angular/core';
import { UtilidadesProvider } from '../../providers/utilidades/utilidades';

@Pipe({
  name: 'dateUtcToLocale'
})
export class DateUtcToLocalePipe implements PipeTransform {
  constructor(public utilidadesProvider: UtilidadesProvider) {}

  public transform(value: string, ...args) {
    // Convertir fecha SQL to Date
    let dateSql: Date;
    dateSql = this.utilidadesProvider.convertSqlToDate(value);

    // Añadir las horas segun la zona horaria
    dateSql.setMinutes(dateSql.getMinutes() - dateSql.getTimezoneOffset());

    return dateSql;
  }
}
