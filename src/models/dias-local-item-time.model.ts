import { BitacoraModel } from './bitacora.model';
import { ServicioModel } from './servicio.model';
export class DiasLocalItemTimeModel {
  public Terminado: boolean;
  public FechaLocal: Date;
  public ServicesByDaysLocalTime: ServicioModel[];
  public ActivitysByDaysLocalTime: BitacoraModel[];
}
