import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AnalystDashboardComponent } from './pages/analyst-dashboard/analyst-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: AnalystDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalystRoutingModule {}
