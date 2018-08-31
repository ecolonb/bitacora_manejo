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
  }
  public deleteSynchronizedServices(
    objSynchronizedServices: any
  ): Promise<any> {
    let indexSeriviceToSync: number = 0;
    const promiseDeleteSS = new Promise((resolve, reject) => {
      try {
        for (const SynchronizedService of objSynchronizedServices.SynchronizedServices) {
          for (const SeriviceToSync of this.ServiciosToSync) {
            if (
              SeriviceToSync.HashId === SynchronizedService.HashId &&
              Number(SynchronizedService.Status) > 0
            ) {
              this.ServiciosToSync.splice(indexSeriviceToSync, 1);
              indexSeriviceToSync++;
            }
          }
          indexSeriviceToSync = 0;
        }
        resolve();
      } catch (error) {
        reject();
      }
    });
    return promiseDeleteSS;
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
        .then((RESULT_DATA) => {
          console.log('Result Data', RESULT_DATA);
          resolve(RESULT_DATA);
        })
        .catch((ErrorPromise) => {
          reject(ErrorPromise);
        });
    }).catch((err) => {
      console.log('Error No Hacer nada...', err);
    });
    return promiseSyncAllServices;
  }
  public syncUpServicio(objServicioToSync: ServicioToSendModel) {
    this.syncUpServicioInServer(objServicioToSync)
      .then((RESULT) => {
        console.log('Promesa ok: ' + JSON.stringify(RESULT));
      })
      .catch((Err) => {
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
        .then((RESULT_DATA) => {
          // this.setUnidadesInStorage();
          console.log('RESULT_DATA:' + JSON.stringify(RESULT_DATA));
          resolve(RESULT_DATA);
        })
        .catch((error) => {
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
    console.log('this.ServiciosToSync', this.ServiciosToSync);
    console.log('this.ServiciosToSync typeof:', typeof this.ServiciosToSync);
    if (
      this.ServiciosToSync &&
      this.ServiciosToSync !== null &&
      this.ServiciosToSync !== undefined
    ) {
      console.log('Push in IF-->');
      this.ServiciosToSync.push(objServicioToSync);
    } else {
      console.log('Push in ELSE-->');
      this.ServiciosToSync = [];
      this.ServiciosToSync.push(objServicioToSync);
    }

    // this.ServiciosToSync.unshift(objServicioToSync);
    console.log(
      'this.ServiciosToSyncPush' + JSON.stringify(this.ServiciosToSync)
    );
    this.setServiciosToSyncInStorage()
      .then(() => {
        console.log('Se guardo en localStorage');
      })
      .catch((Err) => {
        console.log('Error al guradar->' + JSON.stringify(Err));
      });
  }

  public checkServiceToSend(): Promise<any> {
    console.log('Verficando si hay servicio para enviar..!');
    const promiseChkServiceToSend = new Promise((resolve, reject) => {
      console.log('-->');
      this.getServiciosToSyncStorage()
        .then(() => {
          try {
            if (
              this.ServiciosToSync &&
              this.ServiciosToSync !== null &&
              this.ServiciosToSync !== undefined &&
              this.ServiciosToSync.length > 0
            ) {
              this.syncAllServicesPending()
                .then((RESPUESTA) => {
                  // Llamar funcion eliminar Objeto sincronizados
                  this.deleteSynchronizedServices(RESPUESTA)
                    .then((result) => {
                      this.setServiciosToSyncInStorage()
                        .then(() => {
                          resolve();
                        })
                        .catch((Err) => {
                          reject();
                        });
                    })
                    .catch((Err) => {
                      reject();
                    });
                })
                .catch((error) => {
                  reject();
                });
            } else {
              resolve();
            }
          } catch (error) {
            reject();
          }
        })
        .catch((Err) => {
          reject();
        });
    });
    return promiseChkServiceToSend;
  }
  public getServiciosToSyncStorage() {
    const storageInfoPromise = new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.storage.ready().then(() => {
          // Get items from Storage
          this.storage.get('ObjServiciosToSync').then((ObjServiciosToSync) => {
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
          if (
            this.ServiciosToSync &&
            this.ServiciosToSync !== null &&
            this.ServiciosToSync !== undefined &&
            this.ServiciosToSync.length > 0
          ) {
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
