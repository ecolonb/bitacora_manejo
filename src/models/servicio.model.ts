import { UnidadModel } from './unidad.model';
export class ServicioModel {
  public IdServicio: number;
  public IdCondcutor: number;
  public Unidad: UnidadModel;
  public DireccionOrigen: string;
  public DireccionDestino: string;
  public Ruta: string;
  public TipoServicio: string;
  public ModalidadServicio: string;
  public Permisionario: string;
  public PermisionarioDomicilio: string;
}
