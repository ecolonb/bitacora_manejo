import { Component, ViewChild } from '@angular/core';
import {
  AlertController,
  App,
  IonicPage,
  NavController,
  NavParams,
  Slides
} from 'ionic-angular';
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

  public searchQuery: string = '';
  public items: string[];

  public itemsS2: any;
  public searchTerm: string = '';
  public itemsSr: any;

  // ******** variables Globales *********
  private menuPage: any = MenuPage;
  private loginPage: any = LoginPage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private app: App
  ) {
    this.itemsS2 = [
      { title: 'one' },
      { title: 'two' },
      { title: 'three' },
      { title: 'four' },
      { title: 'five' },
      { title: 'six' }
    ];
  }
  public setFilteredItems() {
    if (this.searchTerm !== '') {
      this.itemsSr = this.filterItems(this.searchTerm);
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
    console.log('ionViewDidLoad ConfiguracionServicioPage');
  }
  public nextSlideConfirmacion() {
    console.log('Slide confirmation');
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
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
            console.log('Entrar clicked', DataOk);
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
  public iniciarServicio() {
    this.app.getRootNavs()[0].setRoot(this.menuPage);
  }

  public initializeItems() {
    this.items = ['Amsterdam', 'Bogota'];
  }

  public getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;
    console.log('this.items', this.items);

    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
      console.log('Despues de validar', val);
      this.items = this.items.filter((item) => {
        console.log(item);
        return item.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }
  public filterItems(searchTerm) {
    return this.itemsS2.filter((item) => {
      return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
  public setUnidad(ObjSearch: any) {
    console.log('ObjSearch', ObjSearch);
    delete this.itemsSr;
  }
}
