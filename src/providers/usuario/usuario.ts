import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { UsuarioModel } from '../../models/usuario.model';
/**
 * Este servicio administra la información del Usuario <-> Conductor
 */

@Injectable()
export class UsuarioProvider {
  private ObjUsuarioData: UsuarioModel;

  constructor(private platform: Platform, private storage: Storage) {}

  // Guardar información del usuario en LocalStorage
  public guardarUsuarioInfo(ObjUsuarioDataRcv: UsuarioModel): Promise<any> {
    this.ObjUsuarioData = ObjUsuarioDataRcv;
    const guardarConfiguracionUsuarioPromise = new Promise(
      (resolve, reject) => {
        // Guardando en LocalStorage
        if (this.platform.is('cordova')) {
          // Dispositivo
          this.storage.set(
            'ObjUsuarioData',
            JSON.stringify(this.ObjUsuarioData)
          );
          resolve();
        } else {
          // Desktop webBrowser
          if (this.ObjUsuarioData) {
            localStorage.setItem(
              'ObjUsuarioData',
              JSON.stringify(this.ObjUsuarioData)
            );
          } else {
            localStorage.removeItem('ObjUsuarioData');
          }
          resolve();
        }
      }
    );
    return guardarConfiguracionUsuarioPromise;
  }

  // Cargar configuracion from LocalStorage
  public cargarStorage() {
    const storageInfoPromise = new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.storage.ready().then(() => {
          // Get items from Storage
          this.storage.get('ObjUsuarioData').then((ObjUsuarioDataStorage) => {
            this.ObjUsuarioData = JSON.parse(ObjUsuarioDataStorage);
            resolve();
          });
        });
      } else {
        this.ObjUsuarioData = JSON.parse(
          localStorage.getItem('ObjUsuarioData')
        );
        resolve();
      }
    });
    return storageInfoPromise;
  }

  // Obtiene el nombre del conductor
  public getNombreConductor(): string {
    return this.ObjUsuarioData.nombre_ibutton;
  }
}
