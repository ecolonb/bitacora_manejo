export class BitacoraModel {
  public IdBitacora?: number;
  public HashIdBitacora: number;
  public IdServicio?: number;
  public IdConductor?: number;
  public IdUsuarioParent?: number;
  public HashIdServicio: number;
  public FechaHoraInicio: string;
  public FechaHoraFinal: string;
  public SegundosTotal: number;
  public TiempoHhmmss: string;
  public Transicion: number;
  public TransicionHhmmss: string;
  public Actividad: string;
  public Descripcion: string;
  public Terminado: boolean;
  public InicioActividadX: number;
  public InicioActividadY: number;
  public FinActividadX: number;
  public FinActividadY: number;
  public GuardadoServer: boolean;
  public Nota: string;
  public ZonaHorariaInicio?: string;
  public ZonaHorariaFin?: string;
  public NewOrSync?: number;
  public Token?: string;

  constructor(objDatos: BitacoraModel) {
    this.IdBitacora = objDatos.IdBitacora;
    this.IdServicio = objDatos.IdServicio;
    this.HashIdBitacora = objDatos.HashIdBitacora;
    this.HashIdServicio = objDatos.HashIdServicio;
    this.FechaHoraInicio = objDatos.FechaHoraInicio;
    this.FechaHoraFinal = objDatos.FechaHoraFinal;
    this.SegundosTotal = objDatos.SegundosTotal;
    this.TiempoHhmmss = objDatos.TiempoHhmmss;
    this.Actividad = objDatos.Actividad;
    this.InicioActividadX = objDatos.InicioActividadX;
    this.InicioActividadY = objDatos.InicioActividadY;
    this.FinActividadX = objDatos.FinActividadX;
    this.FinActividadY = objDatos.FinActividadY;
    this.Descripcion = objDatos.Descripcion;
    this.GuardadoServer = objDatos.GuardadoServer;
    this.Nota = objDatos.Nota;
    this.Transicion = objDatos.Transicion;
    this.TransicionHhmmss = objDatos.TransicionHhmmss;
    this.Terminado = objDatos.Terminado;
    this.ZonaHorariaInicio = objDatos.ZonaHorariaInicio;
    this.ZonaHorariaFin = objDatos.ZonaHorariaFin;
    this.NewOrSync = objDatos.NewOrSync;
    this.IdConductor = objDatos.IdConductor;
    this.Token = objDatos.Token;
    this.IdUsuarioParent = objDatos.IdUsuarioParent;
  }

  // 1-Nuevo <-> 2-Sync
}
