import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuggetDetailsPage } from './nugget-details.page';

const routes: Routes = [
  {
    path: '',
    component: NuggetDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuggetDetailsPageRoutingModule {}
