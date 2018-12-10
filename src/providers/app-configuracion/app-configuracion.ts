// import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
// import es from '@angular/common/locales/es';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { AppConfiguracionModel } from '../../models/app-configuracion.model';
// registerLocaleData(es);
/**
 * Este servicio administra la información de configuración de la App
 * Server endpoind
 * Formato de fecha
 * **** se guardaria el idioma V2 ***
 */

@Injectable()
export class AppConfiguracionProvider {
  public ServerEndPoint: string = 'http';
  // Objeto de configuracion del server endpoint
  private objConfigApp: AppConfiguracionModel;
  // Token de usuario/conductor con el cual realizar peticiones
  private privateToken: string = '---ABCD---';

  // http://dev1.copiloto.com.mx/lab/rest/api/check_server_endpoint/2786
  private ComplementEndPoint: string = 'rest/api/check_server_endpoint/2786';

  // Constructor de clase
  constructor(
    public http: HttpClient,
    private storage: Storage,
    private platform: Platform
  ) {
    const objConfig: AppConfiguracionModel = {
      serverEndPoint: '',
      token: ''
    };
    this.objConfigApp = objConfig;
    this.cargarConfigServerStorage().then(() => {
      // Aqui se cargó la configuración from LocalStorage
    });
  }
  public getServerEndPoint(): string {
    return this.ServerEndPoint;
  }

  public getToken(): string {
    return this.privateToken;
  }
  public setToken(Token: string): Promise<any> {
    const promiseSetToken = new Promise((resolve, reject) => {
      // Guardar Token en LocalStorage
      this.privateToken = Token;
      if (
        this.objConfigApp &&
        this.objConfigApp !== null &&
        this.objConfigApp !== undefined
      ) {
        this.objConfigApp.token = Token;
      } else {
        const objAppConfiguracion: AppConfiguracionModel = {
          serverEndPoint: '',
          token: Token
        };
        this.objConfigApp = objAppConfiguracion;
      }
      this.guardarConfigServer()
        .then(() => {
          // info guardada
          resolve();
        })
        .catch((ErrorCatch) => {
          reject();
        });
    }).catch((ErrorCatch) => {});

    return promiseSetToken;
  }

  public setTokenInStorage(): Promise<any> {
    const promiseSetTokenStorage = new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.platform.ready().then(() => {
          this.storage.set('Token', String(this.privateToken));
          resolve();
        });
      } else {
        localStorage.setItem('Token', String(this.privateToken));
        resolve();
      }
    });
    return promiseSetTokenStorage;
  }
  public getTokenInStorage(): Promise<any> {
    const storageInfoPromise = new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.storage.ready().then(() => {
          // Get items from Storage
          this.storage.get('Token').then((Token) => {
            if (Token) {
              this.privateToken = String(Token);
            } else {
              this.privateToken = '';
            }
            resolve(true);
          });
        });
      } else {
        this.privateToken = String(localStorage.getItem('Token'));
        resolve(true);
      }
    });
    return storageInfoPromise;
  }
  // Validar ServerEndPoint
  public checkServerEndPoint(URLToCheck: string): Promise<any> {
    const promiseCheckServerEndPoint = new Promise((resolve, reject) => {
      URLToCheck = URLToCheck.toLowerCase();

      this.http
        .get(URLToCheck)
        .toPromise()
        .then((ResponseData) => {
          resolve(ResponseData);
        })
        .catch((ErrorRequest) => {
          reject(ErrorRequest);
        });
    });
    return promiseCheckServerEndPoint;
  }

  // Guarda la configuracion(serverid: 1,ibutton: 0) en LocalStorage retorna promesa
  public guardarConfigServer(ServerEndPoint?: string): Promise<any> {
    const guardaConfigServerPromise = new Promise((resolve, reject) => {
      // Asignacion de nuevos valores al objeto config actual
      if (ServerEndPoint !== null && ServerEndPoint !== undefined) {
        // = ServerEndPoint.trim().toLowerCase();
        ServerEndPoint = ServerEndPoint.trim().toLowerCase();
        let URLCompletly: string = '';
        // format url endPoint
        // validate ServerEndPoint
        if (
          ServerEndPoint.substring(
            ServerEndPoint.length - 1,
            ServerEndPoint.length
          ) === '/'
        ) {
          // this.ServerEndPoint = this.ServerEndPoint + this.ComplementEndPoint;
          URLCompletly = ServerEndPoint + this.ComplementEndPoint;
        } else {
          URLCompletly = ServerEndPoint + '/' + this.ComplementEndPoint;
          ServerEndPoint = ServerEndPoint + '/';
        }
        if (ServerEndPoint.substring(0, 4) !== 'http') {
          if (ServerEndPoint.substring(0, 5) !== 'https') {
            this.ServerEndPoint = 'https://' + ServerEndPoint;
            URLCompletly = 'https://' + URLCompletly;
          } else {
            this.ServerEndPoint = ServerEndPoint;
            URLCompletly = URLCompletly;
          }
        } else {
          this.ServerEndPoint = ServerEndPoint;
          URLCompletly = URLCompletly;
        }

        this.checkServerEndPoint(URLCompletly)
          .then((DataResponse) => {
            // Validar Server endPoint
            if (
              this.objConfigApp &&
              this.objConfigApp !== null &&
              this.objConfigApp !== undefined
            ) {
              // Solo se actuliza el server endpoiny
              this.objConfigApp.serverEndPoint = ServerEndPoint;
            } else {
              // Se declara nuevo objeto sin TOKEN
              const objAppConfiguracion: AppConfiguracionModel = {
                serverEndPoint: ServerEndPoint,
                token: ''
              };
              this.objConfigApp = objAppConfiguracion;
            }
            if (this.platform.is('cordova')) {
              // Dispositivo
              this.platform.ready().then(() => {
                this.storage.set(
                  'ObjConfigApp',
                  JSON.stringify(this.objConfigApp)
                );
                resolve();
              });
            } else {
              // Desktop
              localStorage.setItem(
                'ObjConfigApp',
                JSON.stringify(this.objConfigApp)
              );
              resolve();
            }
          })
          .catch(() => {
            reject();
          });
      } else {
        if (this.platform.is('cordova')) {
          // Dispositivo
          this.platform.ready().then(() => {
            this.storage.set('ObjConfigApp', JSON.stringify(this.objConfigApp));
            resolve();
          });
        } else {
          // Desktop
          localStorage.setItem(
            'ObjConfigApp',
            JSON.stringify(this.objConfigApp)
          );
          resolve();
        }
      }
    });
    return guardaConfigServerPromise;
  }

  // // Obtiene todo el objeto de configuración serverId and IButton
  // public getConfiguracion(): AppConfiguracionModel {
  //   return this.objConfigServer;
  // }

  // // Obtiene el serverEndPoint s1 o s2
  // public getServerEndPoint(): string {
  //   let strServerEndPoint: string = '';
  //   if (this.objConfigServer.serverid === 1) {
  //     strServerEndPoint = 's1';
  //   } else if (this.objConfigServer.serverid === 2) {
  //     strServerEndPoint = 's2';
  //   } else {
  //     // s7 default endPointPruebas
  //     strServerEndPoint = 's7';
  //   }
  //   return strServerEndPoint;
  // }

  // // Obtiene el Id_ibutton propiedad privada
  // public getIdIbutton(): number {
  //   return this.objConfigServer.ibutton;
  // }

  // Metodo privado para cargar configuracion del LocalStorage
  private cargarConfigServerStorage(): Promise<any> {
    const getConfigServerPromise = new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        // Dispositivo
        this.platform.ready().then(() => {
          this.storage.get('ObjConfigApp').then((ObjConfigApp) => {
            this.objConfigApp = JSON.parse(ObjConfigApp);
            try {
              this.privateToken = this.objConfigApp.token;
              this.ServerEndPoint = this.objConfigApp.serverEndPoint;
            } catch (error) {
              this.privateToken = '';
              this.ServerEndPoint = '';
            }
          });

          resolve();
        });
      } else {
        // Desktop
        this.objConfigApp = JSON.parse(localStorage.getItem('ObjConfigApp'));
        try {
          this.privateToken = this.objConfigApp.token;
          this.ServerEndPoint = this.objConfigApp.serverEndPoint;
        } catch (error) {
          this.privateToken = '';
          this.ServerEndPoint = '';
        }
        resolve();
      }
    });
    return getConfigServerPromise;
  }
}
