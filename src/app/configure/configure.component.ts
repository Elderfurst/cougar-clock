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
  newTime: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  newFile: any;
  newFilePath: string;
  newFileName: string;
  updatedEntryId: number;
  updatedName: String;
  updatedTime: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  updatedFile: any;
  updatedFilePath: string;
  updatedFileName: string;
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

  
  open(content) {
    this.modalService.open(content);
  }

  save() {
    let date = new Date();
    date.setHours(this.newTime.hour);
    date.setMinutes(this.newTime.minute);
    date.setSeconds(this.newTime.second);

    const file = this.newFile;
    this.newFilePath = `pictures/${this.user.uid}/${this.newFile.name}`;
    this.newFileName = this.newFile.name;
    const task = this.storage.upload(this.newFilePath, file);

    const newPicture = {
      name: this.newName,
      fileName: this.newFileName,
      filePath: this.newFilePath,
      time: date.getTime()
    };

    this.pictureCollection.add(newPicture);
    this.modalService.dismissAll();
    this.newName = '';
    this.newFile = '';
    this.newFilePath = '';
    this.newFileName = '';
  }

  update() {
    let date = new Date();
    date.setHours(this.updatedTime.hour);
    date.setMinutes(this.updatedTime.minute);
    date.setSeconds(this.updatedTime.second);

    const file = this.updatedFile;

    if (file) {
      this.updatedFilePath = `pictures/${this.user.uid}/${this.updatedFile.name}`;
      this.updatedFileName = this.updatedFile.name;
      const task = this.storage.upload(this.updatedFilePath, file);
    }

    const updatedPicture = {
      name: this.updatedName,
      fileName: this.updatedFileName,
      filePath: this.updatedFilePath,
      time: date.getTime()
    };

    this.pictureCollection.doc(`${this.updatedEntryId}`).update(updatedPicture);
    this.modalService.dismissAll();
  }

  onFileChange(event) {
    this.newFile = event.target.files[0];
  }

  updatedFileChange(event) {
    this.updatedFile = event.target.files[0];
  }

  updateOpen(entry, configure) {
    this.updatedEntryId = entry.id;
    this.updatedName = entry.name;
    this.updatedFilePath = entry.filePath;
    this.updatedFileName = entry.fileName;
    const date = new Date(entry.time);
    this.updatedTime = {
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds()
    };
    this.modalService.open(configure);
  }

  delete(entry) {
    this.pictureCollection.doc(`${entry.id}`).delete();
  }
}
