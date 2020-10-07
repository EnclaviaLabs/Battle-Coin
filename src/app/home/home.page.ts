import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { Contact } from '../models/contact';
import { ModalController, IonRouterOutlet } from '@ionic/angular';
import { NewContactPage } from '../new-contact/new-contact.page';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public contacts: Observable<Contact[]>;
  public currentSegment: string = "All";

  public elements = [];
  public nuggets = [];
  public items = [];

  public elementsDisplayed: any[];

  constructor(
    private dataService: DataService,
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet
  ) {
    this.contacts = this.dataService.getContacts();

    this.dataService.getElements().subscribe((elems: any[]) =>{
      
      elems.map(a => {
        const data = a.payload.doc.data();
        const uid = a.payload.doc.id;
        
        const elem = {

          id: uid,
          data: data
        }
        this.elements.push(elem);
        //console.log('loading ELEMENT',elem.data.xrp);

      })

      //console.log('elems', this.elements);
      this.elementsDisplayed = this.elements;

      for (let index = 0; index < this.elements.length; index++) {
        const element = this.elements[index];
        console.log('elem | ', element.data.xrp);

        //this.pobierzWszystkoTegoTypa(element.data.xrp);
      }


      //this.dataService.xrplProv.start();

     
    })


/*
    this.dataService.getNuggets().subscribe((elems: any[]) =>{
      
      elems.map(a => {
        const data = a.payload.doc.data();
        const uid = a.payload.doc.id;
        
        const elem = {

          id: uid,
          data: data
        }
        this.nuggets.push(elem);
        console.log('loading NUGGET',elem);
      })

      console.log('nuggets', this.nuggets.length)
      //this.elementsDisplayed = this.elements;

    })

    this.dataService.getItems().subscribe((elems: any[]) =>{
      
      elems.map(a => {
        const data = a.payload.doc.data();
        const uid = a.payload.doc.id;
        
        const elem = {
          id: uid,
          data: data
        }

        this.items.push(elem);
        console.log('loading ITEM',elem);
      })

      console.log('items', this.items.length)
      //this.elementsDisplayed = this.elements;

    })
    */
  }

  async pobierzWszystkoTegoTypa(xrpl) {
    console.log('pobierzWszystkoTegoTypa',xrpl);


    this.dataService.xrplProv.getTransactionsFromAccount(xrpl).then( (txs)=>{
      console.log('- txs',txs);
    })
  }

  getMyIcon(id)
  {
    return 'assets/elements/' + id + '.png'
  }
  
  ionViewWillEnter() {
    this.loadContacts(this.currentSegment);
  }

  filterContacts(event: any) {
    let selectedCategory = event.detail.value;
    this.currentSegment = selectedCategory;

    this.loadContacts(selectedCategory);
  }

  loadContacts(category: string) {
    if (category === 'All') {
      //this.contacts = this.dataService.getContacts();
    } 
    else if (category === 'All') {
      //this.contacts = this.dataService.getContactsByCategory(category);
    }
  }

  async openNewContactModal() {
    const modal = await this.modalController.create({
      component: NewContactPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });

    modal.onWillDismiss().then(() => {
      this.loadContacts(this.currentSegment);
    });

    return await modal.present();
  }
}
