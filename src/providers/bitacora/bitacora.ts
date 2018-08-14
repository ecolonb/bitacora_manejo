import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// ******** MODELOS DE DATOS *******
import { BitacoraServerModel } from '../../models/bitacora-server.model';
import { BitacoraModel } from '../../models/bitacora.model';

// ******** PROVIDERS *******
import { AppConfiguracionProvider } from '../app-configuracion/app-configuracion';
import { UtilidadesProvider } from '../utilidades/utilidades';

// ******** PLUGINS *******
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';
import { filter, map, switchMap } from 'rxjs/operators';
/**
 * Este servicio administra la información de las Bitácoras
 */
@Injectable()
export class BitacoraProvider {
  public BitacoraDataServerNow: BitacoraServerModel;
  public BitacoraDataServerBack: BitacoraServerModel;
  public strTiempoManejo: any = null;
  public strTiempoServicio: any = null;
  // Array donde se guardarán los items de la bitácora
  // private BitacoraData: BitacoraModel[] = [];
  private UrlEndPoint: string =
    'http://dev1.copiloto.com.mx/lab/rest/api/Bitacora';

  // Array Tipeado con el formato de la bitácora
  // private BitacoraDataServer: BitacoraServerModel[] = [];
  private BitacoraDataStorage: BitacoraModel[] = [];

  constructor(
    public http: HttpClient,
    private appConfiguracionProvider: AppConfiguracionProvider,
    private utilidadesProvider: UtilidadesProvider,
    private platform: Platform,
    private storage: Storage
  ) {
    // Realizar diferencias de fechas bitacora:
  }

  public setBitacora(objDatos: any) {
    // Modelando la data y guardandola en el array de items bitácora
    const data = new BitacoraModel(objDatos);
    this.BitacoraDataStorage.unshift(data);
  }
  public getBitacora() {
    return this.BitacoraDataStorage;
  }
  public getBitacoraFromStorage() {
    // Obtiene la bitacoraAlmacenada en el Provider
    // const getBitacoraStoragePromise = new Promise((resolve, reject) => {
    //   // console.log('Se carga bitacora from localStorage');
    //   resolve(this.BitacoraDataStorage);
    // });
    // return getBitacoraStoragePromise;
    const storageInfoPromise = new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.storage.ready().then(() => {
          // Get items from Storage
          this.storage
            .get('ObjBitacoraDataStorage')
            .then((ObjBitacoraDataStorage) => {
              if (ObjBitacoraDataStorage) {
                this.BitacoraDataStorage = JSON.parse(ObjBitacoraDataStorage);
                console.log(
                  'Resolviendo Promesa dispositivo: ',
                  ObjBitacoraDataStorage
                );
              }

              resolve();
            });
        });
      } else {
        this.BitacoraDataStorage = JSON.parse(
          localStorage.getItem('ObjBitacoraDataStorage')
        );
        console.log('Resolviendo Promesa DESKTOP: ', this.BitacoraDataStorage);
        resolve();
      }
    });
    return storageInfoPromise;
  }
  public guardarBitacoraInStorage(
    ObjBitacoraData: BitacoraModel[]
  ): Promise<any> {
    console.log('Guardando ObjBitacoraData STORAGE:', ObjBitacoraData);
    this.BitacoraDataStorage = ObjBitacoraData;
    const guardarConfiguracionUsuarioPromise = new Promise(
      (resolve, reject) => {
        // Guardando en LocalStorage
        if (this.platform.is('cordova')) {
          // Dispositivo
          this.storage.set(
            'ObjBitacoraDataStorage',
            JSON.stringify(this.BitacoraDataStorage)
          );
          resolve();
        } else {
          // Desktop webBrowser
          if (this.BitacoraDataStorage) {
            localStorage.setItem(
              'ObjBitacoraDataStorage',
              JSON.stringify(this.BitacoraDataStorage)
            );
          } else {
            localStorage.removeItem('ObjBitacoraDataStorage');
          }
          resolve();
        }
      }
    );
    return guardarConfiguracionUsuarioPromise;
  }
  // public getBitacoraServer(): Promise<any> {
  //   // const bitacoraPromise = new Promise((resolve, reject) => {
  //   // console.log('Bitacora provider');
  //   // Realizar petición Http obtener bitacora
  //   const HEADERS = {
  //     headers: { 'Content-Type': 'application/json; charset=utf-8' }
  //   };
  //   // Obj datos que recibe el ApiRestFul LoginIbutton
  //   const dataSendform = {
  //     ibutton: Number(this.appConfiguracionProvider.getIdIbutton()),
  //     date1: '2018-08-05',
  //     date2: '2018-08-06',
  //     serverId: this.appConfiguracionProvider.getServerEndPoint()
  //   };
  //   console.log('UrlEndPoint', this.UrlEndPoint);
  //   console.log('dataSendform', dataSendform);

  //   return this.http
  //     .post(this.UrlEndPoint, dataSendform, HEADERS)
  //     .toPromise()
  //     .then((RESULTDATA: BitacoraServerModel[]) => {
  //       console.log('RESULTDATA getBitacoraServer', RESULTDATA);
  //       this.BitacoraDataServer = RESULTDATA;
  //       this.BitacoraDataServerNow = this.BitacoraDataServer[0];
  //       this.BitacoraDataServerBack = this.BitacoraDataServer[1];
  //       // resolve();
  //     });
  //   // });

  //   // return bitacoraPromise;
  // }

  // Obtiene la bitacora del localStorage
  public getBitacoraDataStorage(): BitacoraModel[] {
    return this.BitacoraDataStorage;
  }
  // Obtiene el tiempo total por evento String(Conduciendo, Servicio, Descanso)
  public getTimeForBitacora(idTiempo: number): string {
    let strtiempohhmmss: string = '';
    if (idTiempo === 1) {
      strtiempohhmmss = '01:20:21';
    } else if (idTiempo === 2) {
      strtiempohhmmss = '02:20:21';
    }

    return strtiempohhmmss;
  }
}
