import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServicioToSendModel } from '../../models/servicio-to-send.model';

// ******** PLUGINS *********
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { SyncAllServicesToSyncModel } from '../../models/sync-all-services.model';

import { map } from 'rxjs/operators';

/*
  Este provider sincroniza la información al server.
*/
@Injectable()
export class SyncUpProvider {
  private ServiciosToSync: ServicioToSendModel[] = [];
  private ServiciosToSyncPush: ServicioToSendModel[] = [];
  private URL_: string =
    'http://dev1.copiloto.com.mx/lab/rest/api/nuevo_servicio';
  private URL_SyncAllServices: string =
    'http://dev1.copiloto.com.mx/lab/rest/api/sync_all_services';
  constructor(
    public http: HttpClient,
    private platform: Platform,
    private storage: Storage
  ) {
    // ******* cuando se inicializa el provider se verifica si hay Información para soncronizar
    this.getServiciosToSyncStorage()
      .then(() => {
        try {
          if (
            this.ServiciosToSync &&
            this.ServiciosToSync !== null &&
            this.ServiciosToSync !== undefined &&
            this.ServiciosToSync.length > 0
          ) {
            console.log('Sincronizar eventos: ', this.ServiciosToSync);
            this.syncAllServicesPending()
              .then(RESPUESTA => {
                console.log('Respuesta: ', RESPUESTA);
              })
              .catch(error => {
                console.log('Error here:', error);
              });
          } else {
            console.log('No hay eventos que sincronizar');
          }
        } catch (error) {
          console.log('Aqui Error catch');
        }
      })
      .catch(Err => {
        console.log('Error al crgar del Storage' + JSON.stringify(Err));
      });
  }
  public syncAllServicesPending(): Promise<any> {
    const RESPUESTA: any = {
      errorRequest: false,
      mensaje: 'OK'
    };
    console.log('Sincronizando todos los eventos...', this.ServiciosToSync);
    const promiseSyncAllServices = new Promise((resolve, reject) => {
      const formDataToSend: SyncAllServicesToSyncModel = {
        ServiciosToSync: this.ServiciosToSync
      };
      const HEADERS = {
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      };
      console.log('formDataToSend', formDataToSend);
      this.http
        .post(this.URL_SyncAllServices, formDataToSend, HEADERS)
        .toPromise()
        .then(RESULT_DATA => {
          console.log('Result Data', RESULT_DATA);
          resolve(RESULT_DATA);
        })
        .catch(ErrorPromise => {
          reject(ErrorPromise);
        });
    }).catch(err => {
      console.log('Error', err);
    });
    return promiseSyncAllServices;
  }
  public syncUpServicio(objServicioToSync: ServicioToSendModel) {
    this.syncUpServicioInServer(objServicioToSync)
      .then(RESULT => {
        console.log('Promesa ok: ' + JSON.stringify(RESULT));
      })
      .catch(Err => {
        console.log(
          'Aqui guardarObjetoServicioParaEnviar----->>>' + JSON.stringify(Err)
        );
        this.saveServiceToSync(objServicioToSync);
      });
  }
  public syncUpServicioInServer(
    objServicioToSync: ServicioToSendModel
  ): Promise<any> {
    console.log(
      'Sincronizando el servicio si hay error al guardar se envia a->saveServiceToSync' +
        JSON.stringify(objServicioToSync)
    );
    const promiseNuevoServicio = new Promise((resolve, reject) => {
      const HEADERS = {
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      };
      // Obj datos que recibe el ApiRestFul idConductor, token, idUsuarioParent
      this.http
        .post(this.URL_, objServicioToSync, HEADERS)
        .toPromise()
        .then(RESULT_DATA => {
          // this.setUnidadesInStorage();
          console.log('RESULT_DATA:' + JSON.stringify(RESULT_DATA));
          resolve(RESULT_DATA);
        })
        .catch(error => {
          reject(error);
        });
    });
    return promiseNuevoServicio;
  }
  public saveServiceToSync(objServicioToSync: ServicioToSendModel) {
    console.log(
      'Guardando servicio para sincronizar despues------------->>>>>>>>' +
        JSON.stringify(objServicioToSync)
    );
    this.ServiciosToSync.push(objServicioToSync);
    // this.ServiciosToSync.unshift(objServicioToSync);
    console.log(
      'this.ServiciosToSyncPush' + JSON.stringify(this.ServiciosToSync)
    );
    this.setServiciosToSyncInStorage()
      .then(() => {
        console.log('Se guardo en localStorage');
      })
      .catch(Err => {
        console.log('Error al guradar->' + JSON.stringify(Err));
      });
  }

  public checkServiceToSend() {
    console.log('Verficando si hay servicio para enviar..!');
  }
  public getServiciosToSyncStorage() {
    const storageInfoPromise = new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.storage.ready().then(() => {
          // Get items from Storage
          this.storage.get('ObjServiciosToSync').then(ObjServiciosToSync => {
            if (ObjServiciosToSync) {
              this.ServiciosToSync = JSON.parse(ObjServiciosToSync);
              resolve(true);
            } else {
              this.ServiciosToSync = [];
              resolve(true);
            }
          });
        });
      } else {
        this.ServiciosToSync = JSON.parse(
          localStorage.getItem('ObjServiciosToSync')
        );
        resolve(true);
      }
    });
    return storageInfoPromise;
  }
  private setServiciosToSyncInStorage(): Promise<any> {
    const promiseSetServicioToSync = new Promise((resolve, reject) => {
      // Guardando en LocalStorage y actualizando el status de horas invertidas
      if (this.platform.is('cordova')) {
        // Dispositivo cordova is running
        this.storage.set(
          'ObjServiciosToSync',
          JSON.stringify(this.ServiciosToSync)
        );
        resolve(true);
      } else {
        try {
          // Desktop webBrowser
          if (this.ServiciosToSync) {
            localStorage.setItem(
              'ObjServiciosToSync',
              JSON.stringify(this.ServiciosToSync)
            );
            resolve(true);
          } else {
            localStorage.removeItem('ObjServiciosToSync');
            resolve(true);
          }
        } catch (error) {
          reject();
        }
      }
    });
    return promiseSetServicioToSync;
  }
}
