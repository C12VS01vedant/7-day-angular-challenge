import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../core/services/token-storage.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private tokenService = inject(TokenStorageService);
  private router = inject(Router);

  user = this.tokenService.getUser();
  logout() {
    this.tokenService.signOut();
    this.router.navigate(['/login']);
  }
}
