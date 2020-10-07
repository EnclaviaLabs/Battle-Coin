import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { XrplProviderService } from '../services/xrpl-provider.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-nugget-details',
  templateUrl: './nugget-details.page.html',
  styleUrls: ['./nugget-details.page.scss'],
})
export class NuggetDetailsPage implements OnInit {


  nuggetID: string;
  currentShownTransaction;


  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute, public xrplProv:XrplProviderService) { }

  ngOnInit() {

    this.nuggetID = this.activatedRoute.snapshot.paramMap.get('id');

    console.log('nug id', this.nuggetID)
    //this.nuggatTX = await this.xrplProv.getTransactionByHash( this.nuggetID)

    //this.buildNuggat();
  }

  async buildNuggat()
  {
    console.log('buildNuggat');
    this.xrplProv.getTransactionByHash( this.nuggetID).then((tx) => {
      console.log('tx', this.xrplProv.currentShownTransaction)
      this.currentShownTransaction = JSON.parse(this.xrplProv.currentShownTransaction);
      console.log('currentShownTransaction', this.currentShownTransaction.specification.memos[0].data);
      //this.getItemsWithThisNugat();
    })
  }

  getItemsWithThisNugat()
  {
    console.log('getItemsWithThisNugat', this.nuggetID);

    this.dataService.getItemsFromNuggetId(this.nuggetID).subscribe((elems) =>{
      
      elems.map(a => {
        const data = a.payload.doc.data();
        const uid = a.payload.doc.id;
        
        const elem = {
          id: uid,
          data: data
        }
  
        
        console.log('ItemsFromNugge',elem);
      })
  
      //console.log('items', this.items.length)
      //this.elementsDisplayed = this.elements;
  
    })

  }

  
  
  getMyIcon(id)
  {
    return 'assets/elements/VALUE.png'
  }
}
