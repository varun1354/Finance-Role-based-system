import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardShellComponent } from './components/dashboard-shell/dashboard-shell.component';

@NgModule({
  declarations: [DashboardShellComponent],
  imports: [CommonModule, RouterModule],
  exports: [CommonModule, RouterModule, DashboardShellComponent]
})
export class SharedModule {}
