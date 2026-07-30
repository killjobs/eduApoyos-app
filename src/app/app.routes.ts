import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PanelAsesorComponent } from './pages/panel-asesor/panel-asesor.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard';
import { PanelEstudianteComponent } from './pages/panel-estudiante/panel-estudiante.component';
import { NoAutorizadoComponent } from './pages/no-autorizado/no-autorizado.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'panel-asesor', component: PanelAsesorComponent, canActivate: [authGuard], data: {roles: ['Asesor']} },
  { path: 'panel-estudiante', component: PanelEstudianteComponent, canActivate: [authGuard], data: {roles: ['Estudiante']} },
  { path: 'register', component: RegisterComponent },
  { path: 'no-autorizado', component: NoAutorizadoComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full'}
];