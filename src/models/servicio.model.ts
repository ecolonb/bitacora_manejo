import { UnidadModel } from './unidad.model';
export class ServicioModel {
  public IdServicio?: number;
  public HashIdServicio: number;
  public IdCondcutor: number;
  public Unidad: UnidadModel;
  public DireccionOrigen: string;
  public DireccionDestino: string;
  public Ruta: string;
  public TipoServicio: number;
  public ModalidadServicio: number;
  public Permisionario: string;
  public PermisionarioDomicilio: string;
}
