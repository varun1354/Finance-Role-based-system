import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AnalystRoutingModule } from './analyst-routing.module';
import { AnalystDashboardComponent } from './pages/analyst-dashboard/analyst-dashboard.component';

@NgModule({
  declarations: [AnalystDashboardComponent],
  imports: [SharedModule, AnalystRoutingModule]
})
export class AnalystModule {}
