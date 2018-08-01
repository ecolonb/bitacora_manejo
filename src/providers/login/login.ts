import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginProvider {
  // Declaracion de variables globales
  public activo: boolean = false;
  private ObjResultado: any;
  private URL_ = 'http://pruebaunne01.cloudapp.net/dev5/api_rest/api/Login';
  public objPermisos: any;

  public razonSocial: string;
  public nombreUsuario: string;
  public urlImagen: string;
  public idUsuario: number;
  public idCliente: number;

  constructor(private httpW: HttpClient) {
    console.log('Hello LoginProvider Provider');
  }
  public validarSesion(
    userToSend: string,
    passToSend: string
  ): Observable<any> {
    userToSend = userToSend.toLowerCase();
    console.log(userToSend, passToSend);
    console.log(this.URL_);
    // Preparando los datos a enviar y las cabeceras
    // const DataSend = 'email=' + userToSend + '&pass=' + passToSend;
    // console.log('DataSend string', DataSend);
    const HEADERS = {
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    };
    const dataSendform = { user: userToSend, password: btoa(passToSend) };
    console.log('dataSendform', dataSendform);
    return this.httpW.post<Observable<any>>(this.URL_, dataSendform, HEADERS);
  }

  public getActivo(): boolean {
    return this.activo;
  }
  public setActivo(valor: boolean) {
    // this.activo= valor;
  }
  public guardarServicio(ObjSesion: any) {
    console.log('Guardar sesion', ObjSesion);
    this.ObjResultado = ObjSesion;
    if (this.ObjResultado.error === false) {
      this.activo = true;
      this.razonSocial = this.ObjResultado.razonSocial;
      this.nombreUsuario = this.ObjResultado.nombreUsuario;
      this.urlImagen = this.ObjResultado.urlImagen;
      this.idUsuario = this.ObjResultado.idUsuario;
      this.idCliente = this.ObjResultado.idCliente;
      this.objPermisos = this.ObjResultado.permisos;
      console.log(
        'Datos correctos, usar Interfaz para recibir los datos->',
        this.razonSocial
      );
      console.log('ID USUARIO', this.idUsuario);
      console.log('nombreUsuario', this.nombreUsuario);
      console.log('Impresion del this.objPermisos', this.objPermisos);
      // this.guardarStorage();
    }
  }
}

// Entra a la funcion PostValue
// Convirtiendo el password: Y2xhdWRpYTEw
// Antes de validar sesion: kexGhek23qho/pThu6z09Q==
// ANTES DE VALIDAR PASSWORD: admin_rutas
// ----->> En funcion validando sesion
// ----->> Obteniendo string connection
// ----->> Abriendo la conexion
// ----->> Ejecurando el querie ->  SELECT *  FROM  USUARIOS U left join PERMISOS_UI UI on U.ID_USUARIO = Ui.ID_USUARIO_UI  WHERE U.USUARIO = 'admin_rutas' AND U.CONTRASEÑA = 'kexGhek23qho/pThu6z09Q=='
// ----->> ANTES DEL WHILE usuari0: admin_rutas password: kexGhek23qho/pThu6z09Q==
// ----->> Antes de cerrar la conexion
// ----->> Cerrando conexion
// Despues de validar PASSWORD: kexGhek23qho/pThu6z09Q==
