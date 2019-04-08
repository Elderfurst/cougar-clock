import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router'; 
import { interval, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {

  clock: number = Date.now();
  user: any;
  pictures: Observable<any[]>;
  pictureData: { time: number, url: string }[] = [];
  show: boolean[];

  constructor(public afAuth: AngularFireAuth, 
    public router: Router,
    private database: AngularFirestore,
    private storage: AngularFireStorage) { }

  ngOnInit() {
    this.afAuth.user.subscribe(user => {
      if (!user) {
        this.router.navigateByUrl('/');
      } else {
        this.user = user;
        this.pictures = this.database.doc<any>(`/users/${this.user.uid}`).collection<any>('pictures').valueChanges();
        this.pictures.subscribe(results => {
          results.forEach(result => {
            this.storage.ref(result.filePath).getDownloadURL().subscribe(url => {
              const data = {
                time: result.time,
                url: url
              };
              this.pictureData.push(data);
              this.show.push(false);
            });
          });
        });

        const source = interval(1000);
        source.subscribe(() => {
          this.clock = Date.now();
        });
      }
    });
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigateByUrl('/');
  }
}
