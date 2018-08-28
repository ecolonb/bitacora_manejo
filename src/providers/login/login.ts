import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { UsuarioModel } from '../../models/usuario.model';
import { AppConfiguracionProvider } from '../app-configuracion/app-configuracion';
import { UsuarioProvider } from './../usuario/usuario';
// import { filter, map, switchMap } from 'rxjs/operators';
@Injectable()
export class LoginProvider {
  // Declaracion de variables globales
  public objPermisos: any;

  public serverEndPoint: string = 's5';

  // Variables de usuarioLogin
  public objSesionRespuesta: UsuarioModel;

  // Propiedades privadas
  private sesionOk: boolean = false;
  private URL_ = 'http://dev1.copiloto.com.mx/lab/rest/api/Login';

  // Constructor de clase
  constructor(
    private httpClient: HttpClient,
    private storage: Storage,
    private platform: Platform,
    private appConfiguracionProvider: AppConfiguracionProvider,
    private usuarioProvider: UsuarioProvider
  ) {}

  // Funcion para validar sesion retorna un Obervable  -> cambiar metodo Implementar una promesa
  public validarSesion(
    userToSend: string,
    passToSend: string
  ): Observable<any> {
    userToSend = userToSend.toLowerCase();
    const HEADERS = {
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    };
    // Obj datos que recibe el ApiRestFul LoginIbutton
    const dataSendform = {
      id_ibutton: '9721371',
      server_endpoint: 's2'
    };
    return this.httpClient.post<Observable<any>>(
      this.URL_,
      dataSendform,
      HEADERS
    );
  }

  // LOG IN USER_PASSWORD method POST -> Api RESTFul
  public loginUserAndPaswword(
    userToSend: string,
    passToSend: string
  ): Promise<any> {
    const promiseLoginUserAndPaswword = new Promise((resolve, reject) => {
      userToSend = userToSend.toLowerCase();
      const HEADERS = {
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      };
      // Obj datos que recibe el ApiRestFul LoginIbutton
      passToSend = btoa(passToSend);
      const dataSendform = {
        user: userToSend,
        password: passToSend,
        uuidDispositivo: 'iphone1368'
      };
      this.httpClient
        .post(this.URL_, dataSendform, HEADERS)
        .toPromise()
        .then((RESULT_DATA) => {
          resolve(RESULT_DATA);
        })
        .catch((error) => {
          reject(error);
        });
    });
    return promiseLoginUserAndPaswword;
  }

  // Obtiene si está activa la sesion
  public getActivo(): boolean {
    return this.sesionOk;
  }

  // Cambia el estado de la sesion
  public setActivo(valor: boolean) {
    this.sesionOk = valor;
    this.guardarStorage();
    return;
  }

  // Guarda los datos de la sesion si el Login es correcto
  public guardarServicio(ObjSesion: any) {
    this.objSesionRespuesta = ObjSesion;
    if (this.objSesionRespuesta._error === false) {
      this.sesionOk = true;
      this.usuarioProvider
        .guardarUsuarioInfo(this.objSesionRespuesta)
        .then(() => {
          // Guardando variable de SesionActivo <-> LoginActivo
          this.guardarStorage();
        });
    }
  }

  // Carga datos de la sesion desde el LocalStorage
  public cargarStorage() {
    const storagePromise = new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.storage.ready().then(() => {
          // Get items from Storage
          this.storage.get('sesionOk').then((sesionOkStorage) => {
            this.sesionOk = Boolean(sesionOkStorage);
            resolve();
          });
        });
      } else {
        this.sesionOk = Boolean(localStorage.getItem('sesionOk'));
        resolve();
      }
    });
    return storagePromise;
  }

  // Cerrar sesion y guardar estado actual en LocalStorage
  public cerrarSesion(): Promise<any> {
    const cerrarSesionPromise = new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        // Dispositivo
        try {
          this.storage.remove('sesionOk');
        } catch (error) {
          console.log(JSON.stringify(error));
        }
        resolve();
      } else {
        // Desktop webBrowser
        try {
          localStorage.removeItem('sesionOk');
        } catch (error) {
          console.log(JSON.stringify(error));
        }
        resolve();
      }
    });
    return cerrarSesionPromise;
  }

  // ************* METODOS PRIVADOS *****************  //

  // Guarda datos de la sesion en LocalStorage
  private guardarStorage() {
    const savePromise = new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        // Dispositivo
        this.storage.set('sesionOk', String(this.sesionOk));
        resolve();
      } else {
        // Desktop webBrowser
        if (this.sesionOk) {
          localStorage.setItem('sesionOk', String(this.sesionOk));
        } else {
          // localStorage.removeItem('sesionOk');
          localStorage.removeItem('sesionOk');
        }
        resolve();
      }
    });
    return savePromise;
  }
}
