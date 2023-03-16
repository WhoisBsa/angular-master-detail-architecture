import { NgModule } from '@angular/core';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChartModule } from 'primeng/chart';


@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    ChartModule,
    ReportsRoutingModule,
    SharedModule,
  ]
})
export class ReportsModule { }
