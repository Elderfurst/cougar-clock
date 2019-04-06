import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { ConfigureService } from './configure.service';
import { AngularFireList } from '@angular/fire/database';
import { Entry } from '../entry';
import { AngularFireAuth } from '@angular/fire/auth';

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
  entries: AngularFireList<Entry>;

  constructor(private modalService: NgbModal, private configureService: ConfigureService, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      this.user = user;
      this.configureService.getEntries(`${user.uid}`).snapshotChanges().subscribe(result => {
        console.log(result);
      });
      console.log(this.entries);
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
