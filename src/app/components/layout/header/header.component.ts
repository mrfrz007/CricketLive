import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  logout() {
    localStorage.removeItem('token'); // Clear authentication token
    window.location.href = '/login'; // Redirect to login
  }
  toggleSidebar() {}
}
