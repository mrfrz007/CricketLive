import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { LayoutConatinerComponent } from './components/layout/layout-conatiner/layout-conatiner.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutConatinerComponent, // ✅ Wrap all protected routes inside Layout
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // ✅ Redirect '' to 'home'
      { path: 'home', component: HomeComponent }, // ✅ Home will load inside LayoutContainerComponent
    ],
  },
  { path: '**', redirectTo: '' }, // Redirect unknown routes
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
