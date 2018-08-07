export class BitacoraModel {
  public fecha_inicio: Date;
  public fecha_fin: Date;
  public inicio_x: number;
  public incio_y: number;
  public fin_x: number;
  public fin_y: number;
  public tiempo_hhmmss: string;
  public tiempo_segundos: number;
  constructor(objDatos: any) {
    this.fecha_inicio = objDatos.fecha_inicio;
    this.fecha_fin = objDatos.fecha_fin;
    this.inicio_x = objDatos.inicio_x;
    this.incio_y = objDatos.incio_y;
    this.fin_x = objDatos.fin_x;
    this.fin_y = objDatos.fin_y;
    this.tiempo_hhmmss = objDatos.tiempo_hhmmss;
    this.tiempo_segundos = objDatos.tiempo_segundos;
  }
}
