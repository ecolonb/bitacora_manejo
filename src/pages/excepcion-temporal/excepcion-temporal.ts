import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-excepcion-temporal',
  templateUrl: 'excepcion-temporal.html'
})
export class ExcepcionTemporalPage {
  public strCentesimas: string = ':00';
  public strSegundos: string = ':00';
  public strMinutos: string = ':00';
  public strHoras: string = '00';

  private centesimas: number = 0;
  private segundos: number = 0;
  private minutos: number = 0;
  private horas: number = 0;
  private control: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  public inicio() {
    console.log('Funcion inicio');
    this.control = setInterval(this.cronometro, 10);
    (document.getElementById('inicio') as HTMLInputElement).disabled = true;
    (document.getElementById('parar') as HTMLInputElement).disabled = true;
    (document.getElementById('continuar') as HTMLInputElement).disabled = true;
    (document.getElementById('reinicio') as HTMLInputElement).disabled = true;
  }
  public cronometro() {
    if (this.centesimas < 99) {
      this.centesimas++;
      if (this.centesimas < 10) {
        this.strCentesimas = '0' + String(this.centesimas);
      }
      this.strCentesimas = ':' + String(this.centesimas);
    }

    if (this.centesimas === 99) {
      this.centesimas = -1;
    }
    if (this.centesimas === 0) {
      this.segundos++;
      if (this.segundos < 10) {
        this.strSegundos = '0' + String(this.segundos);
      }
      this.strSegundos = ':' + String(this.segundos);
    }
    if (this.segundos === 59) {
      this.segundos = -1;
    }
    if (this.centesimas === 0 && this.segundos === 0) {
      this.minutos++;
      if (this.minutos < 10) {
        this.strMinutos = '0' + String(this.minutos);
      }
      this.strMinutos = ':' + String(this.minutos);
    }
    if (this.minutos === 59) {
      this.minutos = -1;
    }
    if (this.centesimas === 0 && this.segundos === 0 && this.minutos === 0) {
      this.horas++;
      if (this.horas < 10) {
        this.strHoras = '0' + String(this.horas);
      }
      this.strHoras = String(this.horas);
    }
    console.log('In set interval cronometro', this.strCentesimas);
  }
}
