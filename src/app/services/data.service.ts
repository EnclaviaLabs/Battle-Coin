import { Injectable } from '@angular/core';
import { Contact } from '../models/contact';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { XrplProviderService } from './xrpl-provider.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private contacts: Contact[];

  private elements: any[];
  private nuggets: any[];
  private items: any[];

  private lastId: number = 20;

  constructor(private afs: AngularFirestore, private http: HttpClient, public xrplProv:XrplProviderService) {}




  getItems(): Observable<any[]> {
    if (this.items) {
      return of(this.items);
    } else {

      return this.afs.collection('items', ref => ref.limit(50)).snapshotChanges()
      .pipe(tap(elements => this.items = elements));
    }
  }
  

  getItemsFromNuggetId(id: string): Observable<any> {

    console.log('sprawdzam', id)
    const doc: AngularFirestoreCollection<any> = this.afs.collection('items', ref => ref.where('id', '==', id));
    return doc.valueChanges();
  }

  getAllNuggets(fromAccount): Observable<any[]> {
    if (this.nuggets) {
      return of(this.nuggets);
    } else {

      console.log('czek genesis accounts', fromAccount)
      
      this.xrplProv.getTransactionsFromAccount( fromAccount).then((tx) => {
        console.log('getTransactionsFromAccount', tx)
        
      })
      

      
    }
  }

  getElements(): Observable<any[]> {
    if (this.elements) {
      console.log('get elems', this.elements)
      return of(this.elements);
    } else {

      return this.afs.collection('elements', ref => ref.orderBy('xrp', 'asc').limit(50)).snapshotChanges()
      .pipe(tap(elements => this.elements = elements));
    }
  }


  





  getContacts(): Observable<Contact[]> {
    if (this.contacts) {
      return of(this.contacts);
    } else {
      // fetch contacts
      return this.http.get<Contact[]>('./assets/contacts.json')
      .pipe(tap(contacts => this.contacts = contacts));
    }
  }





  getContactsByCategory(category: string): Observable<Contact[]> {
    return this.getContacts().pipe(map(contacts => contacts.filter(contact => contact.category == category)));
  }
/*
  getElementById(id: string): Observable<Contact> {
    return this.getContacts().pipe(map(contacts => contacts.find(contact => contact.id == id)));
  }
*/

  

  getContactById(id: number): Observable<Contact> {
    return this.getContacts().pipe(map(contacts => contacts.find(contact => contact.id == id)));
  }

  createContact(contact: Contact) {
    contact.id = this.lastId + 1;
    // increment lastId value
    this.lastId = this.lastId + 1;
    this.contacts.push(contact);
  }

  updateContact(contact: Contact): Contact {
    let itemIndex = this.contacts.findIndex(item => item.id == contact.id);
    this.contacts[itemIndex] = contact;
    return contact;
  }

  deleteContact(id: number): Contact {
    let itemIndex = this.contacts.findIndex(item => item.id == id);
    return this.contacts.splice(itemIndex, 1)[0];
  }
}
