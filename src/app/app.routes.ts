import { Routes } from '@angular/router';
import { BicicletasComponent } from './components/bicicletas/bicicletas.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { InventarioComponent } from './components/inventario/inventario.component';

export const routes: Routes = [
  { path: '', redirectTo: 'bicicletas', pathMatch: 'full' },

  { path: 'bicicletas', component: BicicletasComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'ventas', component: VentasComponent },
  { path: 'inventario', component: InventarioComponent }
];
