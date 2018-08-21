import { Component, ViewChild } from '@angular/core';
import {
  AlertController,
  App,
  IonicPage,
  NavController,
  NavParams,
  Slides
} from 'ionic-angular';
import { BitacoraProvider } from '../../providers/bitacora/bitacora';
import { UnidadModel } from './../../models/unidad.model';
import { LoginPage, MenuPage } from './../index-paginas';

/**
 * En esta página se configura el servicio los datos que solicita la norma de la SCT.
 */

@IonicPage()
@Component({
  selector: 'page-configuracion-servicio',
  templateUrl: 'configuracion-servicio.html'
})
export class ConfiguracionServicioPage {
  @ViewChild(Slides)
  public slides: Slides;
  public tipoDeServicio: string = 'default';
  public modalidadDeServicio: string = 'default';
  public NombreConductor: string = 'Edd';
  public origenServicio: string;
  public destinoServicio: string;
  public descripcionRutaASeguir: string;
  public nombreUnidad: string = '';
  public confirmacionConfSer: boolean = false;
  public objUnidadSeleccionada: UnidadModel;

  public searchQuery: string = '';
  public items: string[];
  public objUnidades: UnidadModel[];
  public itemsS2: any;
  public searchTerm: string = '';
  public itemsSr: any;

  public tipoServicioDescLong: string = '';
  public modalidadServicioDescLong: string = '';

  // ******** variables Globales *********
  private menuPage: any = MenuPage;
  private loginPage: any = LoginPage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private bitacoraProvider: BitacoraProvider,
    private app: App
  ) {
    /**
     */
    this.objUnidades = [
      {
        Nuid: 191929,
        Marca: 'Mercedes bens',
        Modelo: '2019',
        Anio: '2021'
      },
      {
        Nuid: 283283,
        Marca: 'Volvo',
        Modelo: '2000 AirLine',
        Anio: '2015'
      },
      {
        Nuid: 7776977,
        Marca: 'BMW Bigger',
        Modelo: '2019',
        Anio: '2021'
      }
    ];
  }
  public setFilteredItems() {
    if (this.searchTerm !== '') {
      this.itemsSr = this.filterItems(this.searchTerm);
      // Validar cuantos elelementos se encuentran: console.log('this.itemsSr', this.itemsSr.length);
    } else {
      delete this.itemsSr;
    }
  }
  public ngAfterViewInit() {
    this.slides.lockSwipes(true);
    this.slides.freeMode = false;
    this.slides.paginationType = 'progress';
  }
  public ionViewDidLoad() {
    // this.setFilteredItems();
  }
  public nextSlideConfirmacion() {
    let error: boolean = false;
    // Despues de entrar en esta funcion debe guardar los datos que se capturan
    let liErrores: string = '';

    if (
      this.objUnidadSeleccionada == null ||
      this.objUnidadSeleccionada === undefined
    ) {
      error = true;
      liErrores += '<li style="float:left;">Debes elegir una unidad</li>';
    }
    if (this.tipoDeServicio === 'default') {
      error = true;
      liErrores +=
        '<li style="float:left;">Debes elegir un tipo de servicio</li>';
    }
    if (error) {
      // En caso de error en los datos capturados se dispara la alerta
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: '<ul>' + liErrores + '</ul>',
        buttons: [
          {
            text: 'Ok',
            role: 'ok'
          }
        ]
      });
      alert.present();
    } else {
      // Esto se ejecuta si no hay errores al validar
      this.confirmacionConfSer = true;

      if (this.tipoDeServicio === 'deCarga') {
        this.tipoServicioDescLong = 'De carga';
      } else if (this.tipoDeServicio === 'deCargaGeneral') {
        this.tipoServicioDescLong = 'De carga general';
      } else if (this.tipoDeServicio === 'deCargaEspecializada') {
        this.tipoServicioDescLong = 'De carga especializada';
      } else if (this.tipoDeServicio === 'turismo') {
        this.tipoServicioDescLong = 'Turismo';
      } else if (this.tipoDeServicio === 'pasajeros') {
        this.tipoServicioDescLong = 'Pasajeros';
      } else if (this.tipoDeServicio === 'privado') {
        this.tipoServicioDescLong = 'Privado';
      }

      if (this.modalidadDeServicio === 'default') {
        this.modalidadServicioDescLong = 'Sin modalidad';
      } else if (this.modalidadDeServicio === 'deLujo') {
        this.modalidadServicioDescLong = 'De lujo';
      } else if (this.modalidadDeServicio === 'ejecutivo') {
        this.modalidadServicioDescLong = 'Ejecutivo';
      } else if (this.modalidadDeServicio === 'primera') {
        this.modalidadServicioDescLong = 'Primera';
      } else if (this.modalidadDeServicio === 'economico') {
        this.modalidadServicioDescLong = 'Economico';
      } else if (this.modalidadDeServicio === 'mixto') {
        this.modalidadServicioDescLong = 'Mixto';
      } else if (this.modalidadDeServicio === 'turistico') {
        this.modalidadServicioDescLong = 'Turístico';
      } else if (this.modalidadDeServicio === 'turisticoDeLujo') {
        this.modalidadServicioDescLong = 'Turístico de lujo';
      } else if (this.modalidadDeServicio === 'excursion') {
        this.modalidadServicioDescLong = 'Excursión';
      } else if (this.modalidadDeServicio === 'choferGuia') {
        this.modalidadServicioDescLong = 'Chofer - Guía';
      }

      this.slides.lockSwipes(false);
      this.slides.slideNext();
      this.slides.lockSwipes(true);
    }
  }

  public showOptionsToLogInApp() {
    const alertOpion = this.alertCtrl.create({
      title: 'Elige una opción',
      inputs: [
        { type: 'radio', label: 'Iniciar servicio', value: 'IniciarServicio' },
        { type: 'radio', label: 'Ver bitácora', value: 'VerBitacora' },
        { type: 'radio', label: 'Salir', value: 'Salir', checked: true }
      ],
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Ok',
          handler: (DataOk: string) => {
            if (DataOk === 'VerBitacora') {
              // Cambiar variable Status appConfiguracion verbitacora
              this.app.getRootNavs()[0].setRoot(this.menuPage);
            }
            if (DataOk === 'IniciarServicio') {
              // Cambiar variable Status appConfiguracion IniciarServicio
              this.app.getRootNavs()[0].setRoot(this.menuPage);
            }
            if (DataOk === 'Salir') {
              // Cambiar variable Status appConfiguracion verbitacora
              this.app.getRootNavs()[0].setRoot(this.loginPage);
            }
          }
        }
      ]
    });
    alertOpion.present();
  }

  // Se inicia el servicio : se guarda información en localStorage
  public iniciarServicio() {
    // Validar si tiene una actividad pendiente redireccionar a tabs Actividades
    this.bitacoraProvider.iniciarServicio();
    this.app.getRootNavs()[0].setRoot(this.menuPage);
  }

  public filterItems(searchTerm) {
    return this.objUnidades.filter((item) => {
      return (
        item.Nuid.toString()
          .toLowerCase()
          .indexOf(searchTerm.toLowerCase()) > -1
      );
    });
  }
  public setUnidad(ObjSearch: UnidadModel) {
    this.objUnidadSeleccionada = ObjSearch;
    this.searchTerm =
      this.objUnidadSeleccionada.Nuid.toString() +
      ' - ' +
      this.objUnidadSeleccionada.Marca +
      ' - ' +
      this.objUnidadSeleccionada.Modelo;
    this.nombreUnidad = this.searchTerm;
    delete this.itemsSr;
  }
  public goBackConfiguration() {
    this.confirmacionConfSer = false;
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }
  public onCancel(event) {
    try {
      delete this.objUnidadSeleccionada;
    } catch (error) {}
  }
}
