import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent)},
  {path: ':id', loadChildren: () => import('./pages/region/region.module').then(m => m.RegionModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
