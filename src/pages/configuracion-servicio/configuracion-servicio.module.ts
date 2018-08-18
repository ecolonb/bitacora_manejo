import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfiguracionServicioPage } from './configuracion-servicio';

@NgModule({
  declarations: [
    ConfiguracionServicioPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfiguracionServicioPage),
  ],
})
export class ConfiguracionServicioPageModule {}
