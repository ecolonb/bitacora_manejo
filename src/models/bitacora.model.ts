export class BitacoraModel {
  fecha_inicio: Date;
  fecha_fin: Date;
  inicio_x: number;
  incio_y: number;
  fin_x: number;
  fin_y: number;
  tiempo_hhmmss: string;
  tiempo_segundos: number;
  constructor(objDatos:any){
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
