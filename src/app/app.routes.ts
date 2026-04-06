import { Routes } from '@angular/router';
import { HomeComponent } from './components/public/home/home.component';
import { LoginComponent } from './components/public/login/login.component';
import { RegistroComponent } from './components/public/registro/registro.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // --- RUTAS PÚBLICAS (Carga normal porque son críticas al inicio) ---
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },

  // --- RUTAS PROTEGIDAS (Lazy Loading: Se descargan solo si el usuario entra) ---
  {
    path: 'admin/inventario',
    loadComponent: () =>
      import('./components/inventario/inventario.component').then((m) => m.InventarioComponent),
    canActivate: [authGuard],
    data: { expectedRole: 'ADMIN' },
  },
  {
    path: 'admin/reportes',
    loadComponent: () =>
      import('./components/reportes/reportes.component').then((m) => m.ReportesComponent),
    canActivate: [authGuard],
    data: { expectedRole: 'ADMIN' },
  },
  {
    path: 'bicicletas',
    loadComponent: () =>
      import('./components/bicicletas/bicicletas.component').then((m) => m.BicicletasComponent),
    canActivate: [authGuard],
    data: { expectedRole: 'ADMIN' },
  },
  {
    path: 'proveedores',
    loadComponent: () =>
      import('./components/proveedores/proveedores.component').then((m) => m.ProveedoresComponent),
    canActivate: [authGuard],
    data: { expectedRole: 'ADMIN' },
  },

  {
    path: 'admin/clientes',
    loadComponent: () =>
      import('./components/clientes/clientes.component').then((m) => m.ClientesComponent),
    canActivate: [authGuard],
    data: { expectedRole: 'ADMIN' },
  },
  {
    path: 'admin/caja',
    loadComponent: () =>
      import('./components/caja-pos/caja-pos.component').then((m) => m.CajaPosComponent),
    canActivate: [authGuard],
    data: { expectedRole: 'ADMIN' },
  },

  // --- RUTA COMODÍN ---
  { path: '**', redirectTo: '' },
];
