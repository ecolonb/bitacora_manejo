export class BitacoraModel {
  public IdViaje: number;
  public HashBitacora: number;
  public FechaHoraInicio: string;
  public FechaHoraFinal: string;
  public SegundosTotal: number;
  public TiempoHhmmss: string;
  public Transicion: number;
  public TransicionHhmmss: string;
  public Actvidad: string;
  public Descripcion: string;
  public Terminado: boolean;
  public InicioActividadX: number;
  public InicioActividadY: number;
  public FinActividaX: number;
  public FinActividadY: number;
  public GuardadoServer: boolean;
  public Nota: string;

  constructor(objDatos: any) {
    this.IdViaje = objDatos.IdViaje;
    this.HashBitacora = objDatos.HashBitacora;
    this.FechaHoraInicio = objDatos.FechaHoraInicio;
    this.FechaHoraFinal = objDatos.FechaHoraFinal;
    this.SegundosTotal = objDatos.SegundosTotal;
    this.TiempoHhmmss = objDatos.TiempoHhmmss;
    this.Actvidad = objDatos.Actvidad;
    this.InicioActividadX = objDatos.InicioActividadX;
    this.InicioActividadY = objDatos.InicioActividadY;
    this.FinActividaX = objDatos.FinActividaX;
    this.FinActividadY = objDatos.FinActividadY;
    this.Descripcion = objDatos.Descripcion;
    this.GuardadoServer = objDatos.GuardadoServer;
    this.Nota = objDatos.Nota;
    this.Transicion = objDatos.Transicion;
    this.TransicionHhmmss = objDatos.TransicionHhmmss;
    this.Terminado = objDatos.Terminado;
  }

  /**
   * Con los datos que se crea la bitacora:
   * IdViaje = Puede tener o no un viaje asignado.
   * HashBitacora = se crea apartir de la fecha hora UTC + Token
   * FechaHoraInicio = Es la fecha que se registra cuando el usuario inicia una Actividad
   * InicioActividadX = Punto Latitud
   * InicioActividadY = Punto longitud
   *
   */
}
