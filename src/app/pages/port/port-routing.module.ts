import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PortComponent} from './port.component';
import {NoPortComponent} from "./no-port/no-port.component";
import {PortViewComponent} from "./port-view/port-view.component";

const routes: Routes = [
  {
    path: '',
    component: PortComponent,
    children: [
      {path: '', component: NoPortComponent},
      {path: ':id', component: PortViewComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortRoutingModule {
}
