import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Requests } from '../shared/request';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-help-requests',
  templateUrl: './help-requests.component.html',
  styleUrls: ['./help-requests.component.css']
})
export class HelpRequestsComponent implements OnInit {
  requestCol: AngularFirestoreCollection<Requests>;
  requests: Observable<any[]>;
  individualRequest: AngularFirestoreDocument;

  constructor(private af: AngularFirestore) { }

  ngOnInit() {
    this.requestCol = this.af.collection('requests');
    this.requests = this.requestCol.valueChanges();
    this.requests = this.requestCol.snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Requests;
          const id = a.payload.doc.id;
          return { id, data };
        });
      }));
  }

  selectRequest(request) {
    this.requestCol = request;
  }

  saveRequest(request) {
    request.id ? this.updateRequest(request) : this.addRequest(request);
  }

  addRequest(request) {
    this.af.collection('requests').add({
      'requester': request.requester,
      'assignee': request.assignee,
      'project': request.project,
      'name': request.name,
      'description': request.description
    });
    this.reset();
  }

  updateRequest(request) {
    this.individualRequest = this.af.doc(`requests/${request.id}`);
    this.individualRequest.update(request);
    this.reset();
  }

  deleteRequest(id) {
    this.af.doc(`requests/${id}`).delete();
  }

  cancel(request) {
    this.reset();
  }

  reset() {
    this.requestCol = ({
      requester: '',
      assignee: '',
      project: '',
      name: '',
      description: ''
    } as null);
  }

}
