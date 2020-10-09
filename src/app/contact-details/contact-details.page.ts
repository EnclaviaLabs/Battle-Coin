import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '../models/contact';
import { AnimationController } from '@ionic/angular';
import { Animation } from '@ionic/core';
import RippledWsClient from 'rippled-ws-client'

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.page.html',
  styleUrls: ['./contact-details.page.scss'],
})
export class ContactDetailsPage implements OnInit, AfterViewInit {
  @ViewChild('favIcon', { read: ElementRef }) favIcon: ElementRef;

  public contact: Contact;
  public element: any;
  public favState = false;
  public favOnAnimation: Animation;
  public favOffAnimation: Animation;

  nuggetsLoaded = false;

  public nuggetsCreated = [];

  constructor(
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private animationCtrl: AnimationController
  ) {
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    console.log('show me', id)
    
    this.dataService.getElements().subscribe(elements => {

      console.log('show me data elements', elements);

      elements.map(a => {
        const data = a.payload.doc.data();
        const uid = a.payload.doc.id;
        
        const elem = {
          id: uid,
          data: data
        }
        if(id== elem.id)
        {
          this.element =  elem
          console.log('found elem',this.element );
        }
        
      })
    });

  }

  showNuggets(xrpl)
  {
    console.log('showNuggets from here', xrpl);

    this.getTransactionsFromAccount(xrpl)
    
    console.log('XRP fin');

  }

  async getTransactionsFromAccount(address:string):Promise<any>
  {
    new RippledWsClient('wss://s.altnet.rippletest.net:51233').then(function (connection) {
      // We have liftoff!
      // All or other code lives here, using the 'connection' variable
      let tx= {
    
        "id": 2,
        "command": "account_tx",
        "account": address,
        "ledger_index_min": -1,
        "ledger_index_max": -1,
        "binary": false,
        "limit": 2,
        "forward": false
        
      }
      
      //console.log(' We have connection!', connection.getState());
      //this.connection = connection;
      connection.send(tx).then(function (info) {
        
        console.log('Got element NUGGETS:', info.transactions)
        return info.transactions;
      }).catch(function (error) {
        console.log('Got error', error)
      })
    }).catch(function (error) {
      console.log('Got error', error)
    })

  }

  getMyIcon(id)
  {
    return 'assets/elements/' + id + '.png'
  }
  ngAfterViewInit() {
    console.log('favIcon', this.favIcon);

    this.favOnAnimation = this.animationCtrl.create()
    .addElement(this.favIcon.nativeElement)
    .duration(300)
    .afterStyles({
      fill: 'red'
    })
    .afterAddClass('fav')
    .afterClearStyles(['fill'])
    .keyframes([
      { offset: 0, transform: 'scale(1)', opacity: '0.4' },
      { offset: 0.5, transform: 'scale(1.5)', opacity: '0.8' },
      { offset: 1, transform: 'scale(1)', opacity: '1' }
    ]);

    this.favOffAnimation = this.animationCtrl.create()
    .addElement(this.favIcon.nativeElement)
    .duration(500)
    .afterStyles({
      fill: 'grey'
    })
    .afterRemoveClass('fav')
    .afterClearStyles(['fill'])
    .keyframes([
      { offset: 0, transform: 'scale(0.8)', opacity: '0.4' },
      { offset: 0.5, transform: 'scale(0.5)', opacity: '0.8' },
      { offset: 1, transform: 'scale(1)', opacity: '1' }
    ]);
  }

  fav(): void {
    if (this.favState) {
      this.favOnAnimation.stop();
      this.favOffAnimation.play();
    } else {
      this.favOffAnimation.stop();
      this.favOnAnimation.play();
    }

    this.favState = !this.favState;
  }
}
