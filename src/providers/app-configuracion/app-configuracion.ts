import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { AppConfiguracionModel } from '../../models/app-configuracion.model';
/**
 * Este servicio administra la información de configuración de la App
 */

@Injectable()
export class AppConfiguracionProvider {
  // Objeto de configuracion del server endpoint
  private objConfigServer: AppConfiguracionModel = {
    serverid: 1,
    ibutton: 0
  };

  // Constructor de clase
  constructor(
    public http: HttpClient,
    private storage: Storage,
    private platform: Platform
  ) {
    this.cargarConfigServerStorage().then(() => {
      // Aqui se cargó la configuración from LocalStorage
    });
  }

  // Guarda la configuracion en LocalStorage
  public guardarConfigServer(ServerId: number, Ibutton: string): Promise<any> {
    const guardaConfigServerPromise = new Promise((resolve, reject) => {
      // Asignacion de nuevos valores al objeto config actual
      this.objConfigServer = {
        serverid: ServerId,
        ibutton: Number(Ibutton)
      };
      if (this.platform.is('cordova')) {
        // Dispositivo
        this.platform.ready().then(() => {
          this.storage.set(
            'objConfigServer',
            JSON.stringify(this.objConfigServer)
          );
          resolve();
        });
      } else {
        // Desktop
        localStorage.setItem(
          'objConfigServer',
          JSON.stringify(this.objConfigServer)
        );
        resolve();
      }
    });
    return guardaConfigServerPromise;
  }

  // Obtiene todo el objeto de configuración serverId and IButton
  public getConfiguracion(): AppConfiguracionModel {
    return this.objConfigServer;
  }

  // Obtiene el serverEndPoint s1 o s2
  public getServerEndPoint(): string {
    let strServerEndPoint: string = '';
    if (this.objConfigServer.serverid === 1) {
      strServerEndPoint = 's1';
    } else if (this.objConfigServer.serverid === 2) {
      strServerEndPoint = 's2';
    } else {
      // s7 default endPointPruebas
      strServerEndPoint = 's7';
    }
    return strServerEndPoint;
  }

  // Obtiene el Id_ibutton propiedad privada
  public getIdIbutton(): number {
    return this.objConfigServer.ibutton;
  }

  // Metodo privado para cargar configuracion del LocalStorage
  private cargarConfigServerStorage(): Promise<any> {
    const getConfigServerPromise = new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        // Dispositivo
        this.platform.ready().then(() => {
          this.storage.get('objConfigServer').then((objConfigServerStorage) => {
            this.objConfigServer = JSON.parse(objConfigServerStorage);
          });
          resolve();
        });
      } else {
        // Desktop
        this.objConfigServer = JSON.parse(
          localStorage.getItem('objConfigServer')
        );
        resolve();
      }
    });
    return getConfigServerPromise;
  }
}
