import { Pipe, PipeTransform } from '@angular/core';

/**
 * Traduce el tipo de servicio
 */
@Pipe({
  name: 'tipoServicoTranslate'
})
export class TipoServicoTranslatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  public transform(value: any, ...args) {
    let respuesta: string;
    if (value === 1368) {
      respuesta = 'De carga';
    } else if (value === 1369) {
      respuesta = 'Turismo';
    } else if (value === 1370) {
      respuesta = 'Pasajeros';
    } else if (value === 1371) {
      respuesta = 'Privado';
    } else if (value === 2786) {
      respuesta = 'De carga general';
    } else if (value === 2787) {
      respuesta = 'De carga especializada';
    } else if (value === 2788) {
      respuesta = 'De lujo';
    } else if (value === 2789) {
      respuesta = 'Ejecutivo';
    } else if (value === 2790) {
      respuesta = 'Primera';
    } else if (value === 2791) {
      respuesta = 'Económico';
    } else if (value === 2792) {
      respuesta = 'Mixto';
    } else if (value === 2793) {
      respuesta = 'Turístico';
    } else if (value === 2794) {
      respuesta = 'Turístico de lujo';
    } else if (value === 2795) {
      respuesta = 'Excursión';
    } else if (value === 2796) {
      respuesta = 'Chofer – guía';
    }
    return respuesta;
  }
}
// De carga	1368
// Turismo	1369
// Pasajeros	1370
// Privado	1371

// De carga general	2786
// De carga especializada	2787
// De lujo	2788
// Ejecutivo	2789
// Primera	2790
// Económico	2791
// Mixto	2792
// Turístico	2793
// Turístico de lujo	2794
// Excursión	2795
// Chofer – guía	2796
