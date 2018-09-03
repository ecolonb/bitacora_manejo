import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServicioToSendModel } from './../../models/servicio-to-send.model';

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
  public setServicesToSend(ObjNewService: ServicioToSendModel) {
    this.ServiciosToSync.push(ObjNewService);
    return true;
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
    const promiseSyncAllServices = new Promise((resolve, reject) => {
      // Se envia todo el objeto completo
      const formDataToSend: SyncAllServicesToSyncModel = {
        ServiciosToSync: this.ServiciosToSync
      };
      console.log('Form Data to send: ', formDataToSend);
      const HEADERS = {
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      };
      this.http
        .post(this.URL_SyncAllServices, formDataToSend, HEADERS)
        .toPromise()
        .then((RESULT_DATA) => {
          console.log(
            'Resolve syncAllServicesPending httpRequest',
            RESULT_DATA
          );
          resolve(RESULT_DATA);
        })
        .catch((ErrorPromise) => {
          console.log(
            'Reject syncAllServicesPending httpRequest: ',
            ErrorPromise
          );
          reject(ErrorPromise);
        });
    });
    return promiseSyncAllServices;
  }
  public syncUpServicio(objServicioToSync: ServicioToSendModel) {
    // Si hay eventos pendientes en storage realizar push de [[objServicioToSync]] y enviar todo en una sola peticion..
    // en caso de error guardar todo el Objeto de servicios pendientes.
    this.syncUpServicioInServer(objServicioToSync)
      .then((RESULT) => {})
      .catch((Err) => {
        this.saveServiceToSync(objServicioToSync);
      });
  }
  public syncUpServicioInServer(
    objServicioToSync: ServicioToSendModel
  ): Promise<any> {
    console.log('Sincronizado un solo evento');
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
          resolve(RESULT_DATA);
        })
        .catch((error) => {
          reject(error);
        });
    });
    return promiseNuevoServicio;
  }
  public saveServiceToSync(
    objServicioToSync?: ServicioToSendModel
  ): Promise<any> {
    const promiseSaveService = new Promise((resolve, reject) => {
      if (
        objServicioToSync &&
        objServicioToSync !== null &&
        objServicioToSync !== undefined
      ) {
        if (
          this.ServiciosToSync &&
          this.ServiciosToSync !== null &&
          this.ServiciosToSync !== undefined
        ) {
          this.ServiciosToSync.push(objServicioToSync);
        } else {
          this.ServiciosToSync = [];
          this.ServiciosToSync.push(objServicioToSync);
        }
      }

      // this.ServiciosToSync.unshift(objServicioToSync);
      this.setServiciosToSyncInStorage()
        .then(() => {
          resolve();
        })
        .catch((Err) => {
          reject();
        });
    });
    return promiseSaveService;
  }

  // verifica si hay eventos pendientes en el Storage...
  public checkServiceToSend(
    objServicioToSend?: ServicioToSendModel
  ): Promise<any> {
    const promiseChkServiceToSend = new Promise((resolve, reject) => {
      this.getServiciosToSyncStorage()
        .then(() => {
          console.log('Servicios from Storage: ', this.ServiciosToSync);
          try {
            if (
              this.ServiciosToSync &&
              this.ServiciosToSync !== null &&
              this.ServiciosToSync !== undefined &&
              this.ServiciosToSync.length > 0
            ) {
              console.log(
                'Si hay eventos que sincronizar: ',
                this.ServiciosToSync.length
              );
              console.log('objServicioToSend', objServicioToSend);
              if (
                objServicioToSend &&
                objServicioToSend !== null &&
                objServicioToSend !== undefined
              ) {
                console.log(
                  'Aqui recorrer arreglo de Servicios y cambiar el estado de NewOrSync'
                );
                for (const ServiceToSync of this.ServiciosToSync) {
                  ServiceToSync.NewOrSync = 2;
                }
                this.ServiciosToSync.push(objServicioToSend);
                this.saveServiceToSync();
              }
            } else {
              if (
                objServicioToSend &&
                objServicioToSend !== null &&
                objServicioToSend !== undefined
              ) {
                console.log(
                  'No hay elementos que cambiar se manda un unico evento como nuevo..'
                );
                this.ServiciosToSync = [];
                this.ServiciosToSync.push(objServicioToSend);
                this.saveServiceToSync();
              }
              console.log('Else 1');
              // resolve();
            }
            if (
              !objServicioToSend ||
              objServicioToSend === null ||
              objServicioToSend === undefined
            ) {
              console.log('Resetando NewOrSynz');
              if (
                this.ServiciosToSync &&
                this.ServiciosToSync !== null &&
                this.ServiciosToSync !== undefined &&
                this.ServiciosToSync.length > 0
              ) {
                console.log('Entro al FOR cambiar tipo NewOrSync');
                for (const ServiceToSync of this.ServiciosToSync) {
                  ServiceToSync.NewOrSync = 2;
                }
              } else {
                console.log('No entro al FOR porque objeto vacio...');
                resolve();
              }
            } else {
              console.log('Else objServicioToSend');
            }
            // Aqui cambiar los valores de tos los objetos existentes New or Sync = 2 y despues el push con 1
            if (
              this.ServiciosToSync &&
              this.ServiciosToSync !== null &&
              this.ServiciosToSync !== undefined &&
              this.ServiciosToSync.length > 0
            ) {
              this.syncAllServicesPending()
                .then((RESPUESTA) => {
                  console.log('RESPUESTA:', RESPUESTA);
                  // Llamar funcion eliminar Objeto sincronizados
                  this.deleteSynchronizedServices(RESPUESTA)
                    .then((result) => {
                      this.setServiciosToSyncInStorage()
                        .then(() => {
                          console.log('Resolve 1');
                          resolve();
                        })
                        .catch((Err) => {
                          console.log('Reject 1');
                          reject();
                        });
                    })
                    .catch((Err) => {
                      console.log('Reject 1');
                      reject();
                    });
                })
                .catch((error) => {
                  console.log('Error al sincronizar eventos al server...');
                  reject();
                });
            }
          } catch (error) {
            console.log('Normal catch error 1');
            reject();
          }
        })
        .catch((Err) => {
          console.log('Catch Promise getServiciosToSyncStorage');
          reject();
        });
    });
    console.log('Retornando promesa.... promiseChkServiceToSend');
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
