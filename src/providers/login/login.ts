import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {
  //Declaracion de variables globales
  public activo: boolean = false;
  private ObjResultado: any;
  private URL_='http://localhost/rest/index.php/login';
  public objPermisos: any;

  public razonSocial: string;
  public nombreUsuario: string;
  public urlImagen: string;
  public idUsuario: number;
  public idCliente: number;

  constructor(private httpW: HttpClient) {
    console.log('Hello LoginProvider Provider');
  }
  validarSesion(emailToSend: string, passToSend: string): Observable<any>{
    emailToSend= emailToSend.toLowerCase();
    console.log(emailToSend,passToSend);
    console.log(this.URL_);

    //Preparando los datos a enviar y las cabeceras
    let DataSend = (
      "email=" + emailToSend +
      "&pass=" + passToSend
    );
    console.log('DataSend',DataSend);
    let HEADERS = {
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    };
    return this.httpW.post<Observable<any>>(this.URL_,DataSend,HEADERS);
    }

    getActivo():boolean{
      return this.activo;
    }
    setActivo(valor: boolean){
      //this.activo= valor;
    }
  guardarServicio(ObjSesion:any){
    console.log('Guardar sesion',ObjSesion);
    this.ObjResultado = ObjSesion;
    if (this.ObjResultado.error==false){
              this.activo=true;
              this.razonSocial = this.ObjResultado.razonSocial;
              this.nombreUsuario=this.ObjResultado.nombreUsuario;
              this.urlImagen=this.ObjResultado.urlImagen;
              this.idUsuario=this.ObjResultado.idUsuario;
              this.idCliente=this.ObjResultado.idCliente;
              this.objPermisos=this.ObjResultado.permisos;
              console.log('Datos correctos, usar Interfaz para recibir los datos->',this.razonSocial);
              console.log('ID USUARIO',this.idUsuario);
              console.log('nombreUsuario',this.nombreUsuario);
              console.log('Impresion del this.objPermisos',this.objPermisos);
              // this.guardarStorage();
  }
}
}
