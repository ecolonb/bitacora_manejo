import { Component } from '@angular/core';
import { LoginProvider } from '../../providers/login/login';
import {
  BitacoraPage,
  ExcepcionTemporalPage,
  HomePage,
  MenuPage
} from '../index-paginas';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  public tabHome: any = HomePage;
  public tabBitacoraPage: any = BitacoraPage;
  public tabMenuPage: any = MenuPage;
  public tabExcepcionTemporalPage: any = ExcepcionTemporalPage;
  public loginActivo: boolean = false;

  constructor(private LoginProvider: LoginProvider) {
    this.loginActivo = this.LoginProvider.getActivo();
  }
}
