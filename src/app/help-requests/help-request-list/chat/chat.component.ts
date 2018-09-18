import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { Requests } from '../../../shared/request';

export interface Message {
  userId: string;
  message: string;
  userName: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() request: Requests;
  messagesCollection: AngularFirestoreCollection<Message[]>;
  messages: Observable<any[]>;

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {}

  newMessage(message) {
    const reqCol = this.afs.collection('requests').doc(`/${(<any>this.request).id}`);
    reqCol.set({messages: [...this.request.data.messages, message]}, {merge: true});
  }

}