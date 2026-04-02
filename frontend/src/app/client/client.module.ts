import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ClientRoutingModule } from './client-routing.module';
import { ClientDashboardComponent } from './pages/client-dashboard/client-dashboard.component';

@NgModule({
  declarations: [ClientDashboardComponent],
  imports: [SharedModule, ClientRoutingModule]
})
export class ClientModule {}
