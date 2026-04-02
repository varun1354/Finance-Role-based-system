import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dashboard-shell',
  standalone: false,
  templateUrl: './dashboard-shell.component.html',
  styleUrl: './dashboard-shell.component.css'
})
export class DashboardShellComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() role = '';
  @Input() greeting = '';
  @Output() logoutClicked = new EventEmitter<void>();
}
