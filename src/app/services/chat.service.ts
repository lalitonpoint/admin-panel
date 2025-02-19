import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({ providedIn: 'root' })
export class ChatService {

    sender_type = '10';
    _chatObservable = new BehaviorSubject<any>(null);
    chatRef;

    constructor(private fireDB: AngularFireDatabase, private afAuth: AngularFireAuth) {}

    readChat(order_id) {
        return new Promise((resolve, rejects) => {
            this.chatRef = this.fireDB.database.ref(order_id);
            this.chatRef.on("value", snapshot => {
                if (snapshot) {
                    this._chatObservable.next(snapshot.val());
                } else {
                    this._chatObservable.next({});
                }
            });

        })
    }

    clearSubscription() {
        if (this.chatRef) {
            this.chatRef.off();
        }
    }

}
