import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatchesService } from 'src/app/services/matches.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  matches: any[] = [];
  isLoading = true;

  constructor(public matchesService: MatchesService, public router: Router) {}

  ngOnInit() {
    // Simulate API call
    setTimeout(() => {
      this.fetchMatches();
    }, 2000); // Simulating delay of 2 seconds
  }

  fetchMatches() {
    // Replace with actual API call
    this.matchesService.getLiveMatches().subscribe((res: any) => {
      this.matches = res;
      this.isLoading = false;
    });
    // Hide loader once data is loaded
  }

  viewMatchDetails(matchId: string) {
    console.log('View details for:', matchId);
  }
}
