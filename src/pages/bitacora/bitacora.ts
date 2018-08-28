import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BitacoraProvider } from '../../providers/bitacora/bitacora';
import { BitacoraModel } from './../../models/bitacora.model';
import { UsuarioProvider } from './../../providers/usuario/usuario';
import { DetalleItemBitacoraPage } from './../index-paginas';
registerLocaleData(es);

// ************* Pipes **********
import { ConductorProvider } from '../../providers/conductor/conductor';
import { DateUtcToLocalePipe } from './../../pipes/date-utc-to-locale/date-utc-to-locale';

@IonicPage()
@Component({
  selector: 'page-bitacora',
  templateUrl: 'bitacora.html'
})
export class BitacoraPage {
  // Las fechas se deben guardar de esta forma para evitar errores en Safari-iOS "2018-08-02T19:19:20"

  // ******* Propiedades públicas
  public fechaBitacora = new Date();
  public strNombreConductor: string;
  public strTiempoManejo: string;
  public strTiempoServicio: string;
  public ObjItemsConduciendo: BitacoraModel[];
  public ObjItemsDescansos: BitacoraModel[];
  public ObjItemsExcepcion: BitacoraModel[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public bitacoraProvider: BitacoraProvider,
    public usuarioProvider: UsuarioProvider,
    public conductorProvider: ConductorProvider
  ) {
    // Obteniendo informacion principal de la bitacora
    // this.strNombreConductor = this.usuarioProvider.getNombreConductor();
    // this.strTiempoManejo = this.bitacoraProvider.getTimeForBitacora(1)
    // this.bitacoraProvider.getTimeForBitacora(2)
    // this.strTiempoManejo = '05:00:10';
    // this.strTiempoServicio = '08:20:21';
    // Obteniendo los items de la bitácora en localStorage
    // this.ObjItemsBitacora = this.bitacoraProvider.getBitacoraDataStorage();
    // console.log('From Bitacora PAGE', this.ObjItemsBitacora);
  }

  // ionViewWillEnter Aqui separar actividades
  public ionViewWillEnter() {
    this.ObjItemsConduciendo = [];
    this.ObjItemsDescansos = [];
    this.ObjItemsExcepcion = [];
    this.separateActivitys();
  }

  // Abre otra pagina con parametros
  public goToDetalles(itemBitacora: BitacoraModel) {
    this.navCtrl.push(DetalleItemBitacoraPage, { itemBitacora });
  }

  // Las actividades se separan cuando se entra a bitácora y cada que se agrega una nueva Actividad.
  public separateActivitys() {
    try {
      if (
        this.bitacoraProvider.BitacoraData &&
        this.bitacoraProvider.BitacoraData !== null &&
        this.bitacoraProvider.BitacoraData !== undefined
      ) {
        console.log('Si hay actividades que separar');
        for (const ietmBitacora of this.bitacoraProvider.BitacoraData) {
          if (ietmBitacora.Actividad === 'C') {
            this.ObjItemsConduciendo.push(ietmBitacora);
          }
          if (ietmBitacora.Actividad === 'D') {
            this.ObjItemsDescansos.push(ietmBitacora);
          }
          if (ietmBitacora.Actividad === 'ET') {
            this.ObjItemsExcepcion.push(ietmBitacora);
          }
        }
      } else {
        console.log('No hay nada que separar...');
      }
    } catch (error) {
      console.log('In error catch error', error);
    }
  }
}
