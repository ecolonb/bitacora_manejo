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

  public getToken(): string {
    return this.privateToken;
  }
  public setToken(Token: string) {
    // Guardar Token en LocalStorage
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
    this.guardarConfigServer();
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
  // Guarda la configuracion(serverid: 1,ibutton: 0) en LocalStorage retorna promesa
  public guardarConfigServer(ServerEndPoint?: string): Promise<any> {
    const guardaConfigServerPromise = new Promise((resolve, reject) => {
      // Asignacion de nuevos valores al objeto config actual
      if (ServerEndPoint !== null && ServerEndPoint !== undefined) {
        this.ServerEndPoint = ServerEndPoint;
        if (
          this.objConfigApp &&
          this.objConfigApp !== null &&
          this.objConfigApp !== undefined
        ) {
          this.objConfigApp.serverEndPoint = ServerEndPoint;
        } else {
          const objAppConfiguracion: AppConfiguracionModel = {
            serverEndPoint: ServerEndPoint,
            token: ''
          };
          this.objConfigApp = objAppConfiguracion;
        }
      }

      if (this.platform.is('cordova')) {
        // Dispositivo
        this.platform.ready().then(() => {
          this.storage.set('ObjConfigApp', JSON.stringify(this.objConfigApp));
          resolve();
        });
      } else {
        // Desktop
        localStorage.setItem('ObjConfigApp', JSON.stringify(this.objConfigApp));
        resolve();
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
