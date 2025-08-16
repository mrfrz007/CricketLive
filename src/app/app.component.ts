import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { CertificateComponent } from './certificate/certificate.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, CertificateComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
