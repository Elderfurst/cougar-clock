import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireList } from '@angular/fire/database';
import { Entry } from '../entry';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.css']
})
export class ConfigureComponent implements OnInit {

  user: any;
  newName: String;
  newTime: NgbTimeStruct = {hour: 13, minute: 30, second: 30};
  newFile: any[];
  entries: any[];

  constructor(private modalService: NgbModal, 
    private afAuth: AngularFireAuth,
    private database: AngularFirestore) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      this.user = user;
      let userDoc = this.database.doc<any>(`/users/${this.user.uid}`);
      let pictures = userDoc.collection<any>('pictures').valueChanges().subscribe(result => {
        this.entries = result;
      });
    });
  }

  
  open(content: any) {
    this.modalService.open(content);
  }

  save() {
    this.modalService.dismissAll();
  }

  onFileChange(event){
    this.newFile = event.target.files;
    console.log(event.target.files);
  }
}
