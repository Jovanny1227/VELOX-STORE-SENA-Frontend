import { Routes } from '@angular/router';
import { HomeComponent } from './components/public/home/home.component';
import { LoginComponent } from './components/public/login/login.component';
import { RegistroComponent } from './components/public/registro/registro.component'; // <-- Importación
import { InventarioComponent } from './components/inventario/inventario.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { BicicletasComponent } from './components/bicicletas/bicicletas.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // --- RUTAS PÚBLICAS (Cualquiera puede entrar) ---
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent }, // <-- DEBE ESTAR ANTES DEL COMODÍN

  // --- RUTAS PROTEGIDAS (Solo Administrador) ---
  {
    path: 'admin/inventario',
    component: InventarioComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'ADMIN' },
  },
  {
    path: 'admin/reportes',
    component: ReportesComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'ADMIN' },
  },
  {
    path: 'bicicletas',
    component: BicicletasComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'ADMIN' },
  },
  {
    path: 'proveedores',
    component: ProveedoresComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'ADMIN' },
  },

  // --- RUTA COMODÍN (Debe ser LA ÚLTIMA LÍNEA, atrapa cualquier error) ---
  { path: '**', redirectTo: '' },
];
