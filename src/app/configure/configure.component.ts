import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.css']
})
export class ConfigureComponent implements OnInit {

  user: any;
  newName: String;
  newTime: NgbTimeStruct = {hour: 0, minute: 0, second: 0};
  newFile: any;
  newFilePath: String;
  userDoc: AngularFirestoreDocument<any>;
  pictureCollection: AngularFirestoreCollection<any>;
  pictures: Observable<any[]>;

  constructor(private modalService: NgbModal, 
    private afAuth: AngularFireAuth,
    private database: AngularFirestore,
    private storage: AngularFireStorage) { }

  ngOnInit() {
    let now = new Date();
    this.newTime.hour = now.getHours();
    this.newTime.minute = now.getMinutes();
    this.newTime.second = now.getSeconds();
    this.afAuth.authState.subscribe(user => {
      this.user = user;
      this.userDoc = this.database.doc<any>(`/users/${this.user.uid}`);
      this.pictureCollection = this.userDoc.collection<any>('pictures');
      this.pictures = this.pictureCollection.snapshotChanges().pipe(map(result => {
        return result.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }));
    });
  }

  
  open(content: any) {
    this.modalService.open(content);
  }

  save() {
    let date = new Date();
    date.setHours(this.newTime.hour);
    date.setMinutes(this.newTime.minute);
    date.setSeconds(this.newTime.second);

    const file = this.newFile;
    const filePath = `pictures/${this.user.uid}/${this.newFile.name}`;
    const task = this.storage.upload(filePath, file);

    const newPicture = {
      name: this.newName,
      fileName: this.newFile.name,
      filePath: filePath,
      time: date.getTime()
    };

    this.pictureCollection.add(newPicture);
    this.modalService.dismissAll();
  }

  onFileChange(event) {
    this.newFile = event.target.files[0];
  }

  configure(entry) {

  }

  delete(entry) {
    this.pictureCollection.doc(`${entry.id}`).delete();
  }
}
