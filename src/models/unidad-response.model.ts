import { UnidadModel } from './unidad.model';

export class UnidadRequestModel {
  public errorRequest: boolean;
  public mensaje: string;
  public unidades: UnidadModel[];
}
