import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filtrarTipo', standalone: true })
export class FiltrarTipoPipe implements PipeTransform {
  transform(items: any[], tipo: string): any[] {
    if (!items) return [];
    return items.filter(i => i.tipo === tipo);
  }
}
