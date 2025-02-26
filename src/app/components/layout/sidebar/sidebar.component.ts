import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  constructor(private snackBar: MatSnackBar) {}
  ngOnInit(): void {}
  showComingSoonMessage() {
    this.snackBar.open(
      '🚀 These features will be available soon. Stay tuned! 🏏',
      'OK',
      {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-custom'],
      }
    );
  }
}
