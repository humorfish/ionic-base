import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/index#HomePageModule' },
  { path: 'app', loadChildren: './tabs/index#TabModule' },
  { path: 'city', loadChildren: './city/index#CityModule' },
  { path: 'login', loadChildren: './login/index#LoginPageModule'},
  { path: 'shop', loadChildren: './shop/index#ShopPageModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
