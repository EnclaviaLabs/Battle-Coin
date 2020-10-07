import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuggetDetailsPageRoutingModule } from './nugget-details-routing.module';

import { NuggetDetailsPage } from './nugget-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuggetDetailsPageRoutingModule
  ],
  declarations: [NuggetDetailsPage]
})
export class NuggetDetailsPageModule {}
