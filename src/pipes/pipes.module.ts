import { NgModule } from '@angular/core';
import { ActividadTitlePipe } from './actividad-title/actividad-title';
import { ActividadProgressTitlePipe } from './actividad-progress-title/actividad-progress-title';
import { DateUtcToLocalePipe } from './date-utc-to-locale/date-utc-to-locale';
import { TipoServicoTranslatePipe } from './tipo-servico-translate/tipo-servico-translate';
@NgModule({
  declarations: [ActividadTitlePipe,
    ActividadProgressTitlePipe,
    DateUtcToLocalePipe,
    TipoServicoTranslatePipe],
  imports: [],
  exports: [ActividadTitlePipe,
    ActividadProgressTitlePipe,
    DateUtcToLocalePipe,
    TipoServicoTranslatePipe]
})
export class PipesModule {}
