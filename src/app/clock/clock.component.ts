import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router'; 
import { interval } from 'rxjs';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {

  private clock: number = Date.now();

  constructor(public afAuth: AngularFireAuth, public router: Router) { }

  ngOnInit() {
    this.afAuth.user.subscribe(user => {
      if (!user) {
        this.router.navigateByUrl('/');
      } else {
        const source = interval(1000);
        source.subscribe(val => {
          this.clock = Date.now();
        });
      }
    });
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigateByUrl('/');
  }

  configure() {

  }
}
