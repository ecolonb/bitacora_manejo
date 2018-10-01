import { HttpClient } from '@angular/common/http';
import { Injectable, ReflectiveInjector } from '@angular/core';
import { ServicioToSendModel } from './../../models/servicio-to-send.model';

// ******** PLUGINS *********
import { Storage } from '@ionic/storage';
import { Footer, Platform } from 'ionic-angular';

import { map } from 'rxjs/operators';
import { BitacoraModel } from '../../models/bitacora.model';
import { SyncAllActivitysModel } from '../../models/sync-all-activitys';

// *** Providers *****
import { SyncAllServicesToSyncModel } from '../../models/sync-all-services.model';
import { AppConfiguracionProvider } from '../app-configuracion/app-configuracion';

/*
  Este provider sincroniza la información al server.
*/
@Injectable()
export class SyncUpProvider {
  private ServiciosToSync: ServicioToSendModel[] = [];
  private ActivitysToSync: BitacoraModel[] = [];
  // private URL_: string =
  //   'http://dev1.copiloto.com.mx/lab/rest/api/nuevo_servicio';
  // private URL_SyncAllServices: string =
  //   'http://dev1.copiloto.com.mx/lab/rest/api/sync_all_services';
  // private URL_SyncAllActivitys: string =
  //   'http://dev1.copiloto.com.mx/lab/rest/api/sync_all_activitys';

  private ComplementEndPointService: string = 'rest/api/nuevo_servicio';
  private ComplementEndPointAllServices: string = 'rest/api/sync_all_services';
  private ComplementEndPointAllActivitys: string =
    'rest/api/sync_all_activitys';
  private statusRequestActivitys: boolean = false;
  private statusRequestServices: boolean = false;
  constructor(
    public http: HttpClient,
    private platform: Platform,
    private storage: Storage,
    private appConfiguracionProvider: AppConfiguracionProvider
  ) {}
  public setServicesToSend(ObjNewService: ServicioToSendModel) {
    this.ServiciosToSync.push(ObjNewService);
    return true;
  }
  public setActivityToSend(
    ObjItemBitacora: BitacoraModel,
    GurdarStorage: boolean
  ): Promise<any> {
    const promiseSetActivity = new Promise((resolve, reject) => {
      if (
        this.ActivitysToSync &&
        this.ActivitysToSync !== null &&
        this.ActivitysToSync !== undefined &&
        this.ActivitysToSync.length > 0
      ) {
        this.ActivitysToSync.push(ObjItemBitacora);
        if (GurdarStorage) {
          this.setActivitysFromStorage()
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject();
            });
        } else {
          resolve();
        }
      } else {
        this.ActivitysToSync = [];
        this.ActivitysToSync.push(ObjItemBitacora);
        if (GurdarStorage) {
          this.setActivitysFromStorage()
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject();
            });
        } else {
          resolve();
        }
      }
    });
    return promiseSetActivity;
  }
  // Indica si hay activdades pendientes para enviar.

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
        this.statusRequestServices = false;
        // cambiar IdServicio
        resolve();
      } catch (error) {
        this.statusRequestServices = false;
        reject();
      }
    });
    return promiseDeleteSS;
  }
  public deleteSynchonizedActivitys(RequestData: any) {
    let Index: number = 0;
    try {
      if (
        RequestData &&
        RequestData !== undefined &&
        RequestData !== null &&
        RequestData.SynchronizedActivitys.length > 0 &&
        this.ActivitysToSync &&
        this.ActivitysToSync !== undefined &&
        this.ActivitysToSync !== null &&
        this.ActivitysToSync.length > 0
      ) {
        for (const ActivtySynchronized of RequestData.SynchronizedActivitys) {
          Index = 0;
          for (const ItemActivityToSync of this.ActivitysToSync) {
            if (
              ActivtySynchronized.HashId === ItemActivityToSync.HashIdBitacora
            ) {
              this.ActivitysToSync.splice(Index, 1);
            }
            Index++;
          }
        }
      }
    } catch (error) {}
    this.statusRequestActivitys = false;
    this.setActivitysFromStorage()
      .then(() => {})
      .catch(() => {});
  }
  public syncAllServicesPending(): Promise<any> {
    const promiseSyncAllServices = new Promise((resolve, reject) => {
      if (this.statusRequestServices === false) {
        this.statusRequestServices = true;
        if (
          this.ServiciosToSync &&
          this.ServiciosToSync !== null &&
          this.ServiciosToSync !== undefined &&
          this.ServiciosToSync.length > 0
        ) {
          // Se envia todo el objeto completo
          const formDataToSend: SyncAllServicesToSyncModel = {
            ServiciosToSync: this.ServiciosToSync
          };
          const HEADERS = {
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          };
          const UrlEndPointCompletly: string =
            this.appConfiguracionProvider.getServerEndPoint() +
            this.ComplementEndPointAllServices;

          this.http
            .post(UrlEndPointCompletly, formDataToSend, HEADERS)
            .toPromise()
            .then(RESULT_DATA => {
              resolve(RESULT_DATA);
            })
            .catch(ErrorPromise => {
              this.statusRequestServices = false;
              reject(ErrorPromise);
            });
        } else {
          this.statusRequestServices = false;
          reject(true);
        }
      } else {
        this.statusRequestServices = false;
        reject(true);
      }
    });
    return promiseSyncAllServices;
  }
  public syncUpServicio(objServicioToSync: ServicioToSendModel) {
    // Si hay eventos pendientes en storage realizar push de [[objServicioToSync]] y enviar todo en una sola peticion..
    // en caso de error guardar todo el Objeto de servicios pendientes.
    this.syncUpServicioInServer(objServicioToSync)
      .then(RESULT => {})
      .catch(Err => {
        this.saveServiceToSync(objServicioToSync);
      });
  }
  public syncUpServicioInServer(
    objServicioToSync: ServicioToSendModel
  ): Promise<any> {
    const promiseNuevoServicio = new Promise((resolve, reject) => {
      const HEADERS = {
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      };
      const UrlEndPointCompletly: string =
        this.appConfiguracionProvider.getServerEndPoint() +
        this.ComplementEndPointService;
      console.log('url nuev servicio:', UrlEndPointCompletly);
      // Obj datos que recibe el ApiRestFul idConductor, token, idUsuarioParent
      this.http
        .post(UrlEndPointCompletly, objServicioToSync, HEADERS)
        .toPromise()
        .then(RESULT_DATA => {
          // this.setUnidadesInStorage();
          resolve(RESULT_DATA);
        })
        .catch(error => {
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
        .catch(Err => {
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
          try {
            if (
              this.ServiciosToSync &&
              this.ServiciosToSync !== null &&
              this.ServiciosToSync !== undefined &&
              this.ServiciosToSync.length > 0
            ) {
              if (
                objServicioToSend &&
                objServicioToSend !== null &&
                objServicioToSend !== undefined
              ) {
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
                this.ServiciosToSync = [];
                this.ServiciosToSync.push(objServicioToSend);
                this.saveServiceToSync();
              }
              // resolve();
            }
            if (
              !objServicioToSend ||
              objServicioToSend === null ||
              objServicioToSend === undefined
            ) {
              if (
                this.ServiciosToSync &&
                this.ServiciosToSync !== null &&
                this.ServiciosToSync !== undefined &&
                this.ServiciosToSync.length > 0
              ) {
                for (const ServiceToSync of this.ServiciosToSync) {
                  ServiceToSync.NewOrSync = 2;
                }
              } else {
                resolve();
              }
            }
            // Aqui cambiar los valores de tos los objetos existentes New or Sync = 2 y despues el push con 1
            if (
              this.ServiciosToSync &&
              this.ServiciosToSync !== null &&
              this.ServiciosToSync !== undefined &&
              this.ServiciosToSync.length > 0
            ) {
              this.syncAllServicesPending()
                .then(RESPUESTA => {
                  // Llamar funcion eliminar Objeto sincronizados Y cambiar ID
                  this.deleteSynchronizedServices(RESPUESTA)
                    .then(result => {
                      this.setServiciosToSyncInStorage()
                        .then(() => {
                          resolve(RESPUESTA);
                        })
                        .catch(Err => {
                          reject();
                        });
                    })
                    .catch(Err => {
                      reject();
                    });
                })
                .catch(error => {
                  reject();
                });
            }
          } catch (error) {
            reject();
          }
        })
        .catch(Err => {
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

  public checkActivitysToSend(): Promise<any> {
    const promiseCheckActivitysToSend = new Promise((resolve, reject) => {
      this.getActivitysFromStorage()
        .then(() => {
          // Sync allactivitys
          if (
            this.ActivitysToSync &&
            this.ActivitysToSync !== null &&
            this.ActivitysToSync !== undefined &&
            this.ActivitysToSync.length > 0
          ) {
            this.syncActivitystoServer()
              .then((DataRequest) => {
                resolve(DataRequest);
              })
              .catch(() => {
                // error here
                reject();
              });
          } else {
            resolve();
          }
        })
        .catch(() => {
          reject();
        });
    });
    return promiseCheckActivitysToSend;
  }

  // ******** Funciones publicas de Actividades Sync
  // Recibe el Obj actividad
  /*
  *
  */
  public syncNewActivity(
    Activity: BitacoraModel,
    Terminado: boolean
  ): Promise<any> {
    const promiseChkActivityToSend = new Promise((resolve, reject) => {
      try {
        if (!Terminado) {
          // Si no terminado: la actividad se sincroniza como Nueva...
          // cargar del storage activitys pending -> y marcar NewOrSync
          this.getActivitysFromStorage()
            .then(() => {
              // activitys loaded
              if (
                this.ActivitysToSync &&
                this.ActivitysToSync !== undefined &&
                this.ActivitysToSync !== null &&
                this.ActivitysToSync.length > 0
              ) {
                // antes de push
                this.changeNewOrSync()
                  .then(() => {
                    // ok
                    this.ActivitysToSync.push(Activity);
                    this.prepareActivityToSync()
                      .then((DataRequest) => {
                        // ok
                        resolve(DataRequest);
                      })
                      .catch(() => {
                        // err
                        this.setActivitysFromStorage()
                          .then(() => {})
                          .catch(() => {});
                        reject();
                      });
                  })
                  .catch(() => {
                    // err
                    this.ActivitysToSync.push(Activity);
                    this.prepareActivityToSync()
                      .then((DataRequest) => {
                        // ok
                        resolve(DataRequest);
                      })
                      .catch((Error_) => {
                        // err
                        reject();
                      });

                    reject();
                  });
              } else {
                this.ActivitysToSync = [];
                this.ActivitysToSync.push(Activity);
                this.prepareActivityToSync()
                  .then((DataRequest) => {
                    // ok
                    resolve(DataRequest);
                  })
                  .catch((Eror_) => {
                    // err
                    reject();
                  });
              }
              // REALIZAR PETICION POST ENVIAR DATA
            })
            .catch((Error_) => {
              reject();
            });
        } else {
          // *****************  Si terminado Enviar como Terminado...  **************
          resolve();
        }
      } catch (error) {
        reject();
      }
    });
    return promiseChkActivityToSend;
  }

  // Cambiando todos los datos cargados del storage como sync : NewOrSync : 2
  public changeNewOrSync(): Promise<any> {
    const promiseChangeNewOrSync = new Promise((resolve, reject) => {
      if (
        this.ActivitysToSync &&
        this.ActivitysToSync !== undefined &&
        this.ActivitysToSync !== null &&
        this.ActivitysToSync.length > 0
      ) {
        try {
          for (const Activity of this.ActivitysToSync) {
            try {
              Activity.NewOrSync = 2;
            } catch (error) {}
          }
          resolve();
        } catch (error) {
          resolve();
        }
      } else {
        resolve();
      }
    });
    return promiseChangeNewOrSync;
  }

  // Prepare DataToSync
  public prepareActivityToSync(): Promise<any> {
    const promisePrepareActivityToSync = new Promise((resolve, reject) => {
      if (
        this.ActivitysToSync &&
        this.ActivitysToSync !== undefined &&
        this.ActivitysToSync !== null &&
        this.ActivitysToSync.length > 0
      ) {
        this.syncActivitystoServer()
          .then((RESPONSE_DATA) => {
            // Aqui eliminar actividades sincronizadas
            this.setActivitysFromStorage()
              .then(() => {
                resolve(RESPONSE_DATA);
              })
              .catch((Error_) => {
                reject();
              });
          })
          .catch((ErrorCatch) => {
            this.setActivitysFromStorage()
              .then(() => {
                reject();
              })
              .catch(() => {
                reject();
              });
          });
      } else {
        reject();
      }
    });
    return promisePrepareActivityToSync;
  }

  // Petición post enviar actividades
  public syncActivitystoServer(): Promise<any> {
    // return this.http
    //   .post(this.URL_SyncAllActivitys, FormDataSend, HEADERS)
    //   .toPromise()
    //   .then(REQUEST_DATA => {
    //     // this.setUnidadesInStorage();
    //     this.deleteSynchonizedActivitys(REQUEST_DATA);
    //   });
    const promiseSyncAllActivitys = new Promise((resolve, reject) => {
      if (this.statusRequestActivitys === false) {
        this.statusRequestActivitys = true;
        if (
          this.ActivitysToSync &&
          this.ActivitysToSync !== null &&
          this.ActivitysToSync !== undefined &&
          this.ActivitysToSync.length > 0
        ) {
          // Se envia todo el objeto completo
          const FormDataSend: SyncAllActivitysModel = {
            Activitys: this.ActivitysToSync
          };
          const HEADERS = {
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          };
          const UrlEndPointCompletly: string =
            this.appConfiguracionProvider.getServerEndPoint() +
            this.ComplementEndPointAllActivitys;
          console.log('All activitys: ', UrlEndPointCompletly);
          this.http
            .post(UrlEndPointCompletly, FormDataSend, HEADERS)
            .toPromise()
            .then((RESULT_DATA) => {
              this.deleteSynchonizedActivitys(RESULT_DATA);
              resolve(RESULT_DATA);
            })
            .catch((ErrorPromise) => {
              this.statusRequestActivitys = false;
              reject(ErrorPromise);
            });
        } else {
          this.statusRequestActivitys = false;
          reject(true);
        }
      } else {
        this.statusRequestActivitys = false;
        reject(true);
      }
    });
    return promiseSyncAllActivitys;
  }
  public getActivitysFromStorage(): Promise<any> {
    const promiseGetActivtyStorage = new Promise((resolve, reject) => {
      // Obetener las actividades del storage
      if (this.platform.is('cordova')) {
        this.storage.ready().then(() => {
          // Get items from Storage
          this.storage.get('ObjActivitysToSync').then((ObjActivitysToSync) => {
            if (ObjActivitysToSync) {
              this.ActivitysToSync = JSON.parse(ObjActivitysToSync);
              resolve(true);
            } else {
              this.ActivitysToSync = [];
              resolve(true);
            }
          });
        });
      } else {
        this.ActivitysToSync = JSON.parse(
          localStorage.getItem('ObjActivitysToSync')
        );
        resolve(true);
      }
    });
    return promiseGetActivtyStorage;
  }
  public setActivitysFromStorage(): Promise<any> {
    const setPromiseActivitysStorage = new Promise((resolve, reject) => {
      // guardar actividades en Storage
      if (this.platform.is('cordova')) {
        // Dispositivo cordova is running
        this.storage.set(
          'ObjActivitysToSync',
          JSON.stringify(this.ActivitysToSync)
        );
        resolve(true);
      } else {
        try {
          // Desktop webBrowser
          if (
            this.ActivitysToSync &&
            this.ActivitysToSync !== null &&
            this.ActivitysToSync !== undefined &&
            this.ActivitysToSync.length > 0
          ) {
            localStorage.setItem(
              'ObjActivitysToSync',
              JSON.stringify(this.ActivitysToSync)
            );
            resolve(true);
          } else {
            localStorage.removeItem('ObjActivitysToSync');
            resolve(true);
          }
        } catch (error) {
          reject();
        }
      }
    });
    return setPromiseActivitysStorage;
  }
  // ****** Funcines privadas de Servicios Sync
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
