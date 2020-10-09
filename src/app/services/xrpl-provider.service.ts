import { Injectable } from '@angular/core';
import { resolve } from 'q';

declare var ripple: any;


@Injectable({
  providedIn: 'root'
})
export class XrplProviderService {

  public static BRAMA_1 = 'rE8HzEXQAbnQr97E3YcMicSUvzjcGicmGz';
  //const BRAMA_1_PRIV = 'sncQFYhBd2DLEAUKMMWmMVNMP4jYD';

  public static B1X_XRP_RATIO = 1000;

  public xrpl_api: any;
  public wallet: any;//Wallet;
  public market: any;
  public currentBlockHash = "Connecting...";
  public currentBlockDate:Date;
  public connection;
  public currentShownTransaction: any;

  public allNuggets = [];

  constructor() {

    this.xrpl_api = new ripple.RippleAPI({
      server: 'wss://s2.ripple.com'
    })
   }

  


  async getTransactionsFromAccount(address:string):Promise<any>
  {

    await this.xrpl_api.connect()
    //const ledger = await this.xrpl_api.getLedger({includeTransactions: true})
    //console.log('ledger', ledger)

    
    

    const whatElement = await this.xrpl_api.request('account_info', {account: address})
    const flags = this.xrpl_api.parseAccountFlags(whatElement.account_data.Flags)
    console.log(JSON.stringify(flags, null, 2))
    console.log('whatElement', whatElement);
    const tx = await this.xrpl_api.getTransactions(address)
    //console.log(tx)rMWE152bUpbemikfexB65CCQCrU3SGx8MN
    //console.log('deliveredAmount:', tx.outcome)
   
    return tx;
  }
  


  async getTransactionByHash(hashTX:string)
  {
    await this.xrpl_api.getTransaction(hashTX).then(info => {
      console.log('getTransactionByHash' + JSON.stringify(info, null, 2));
      this.currentShownTransaction = JSON.stringify(info, null, 2);

      return JSON.stringify(info, null, 2);
      //this.loadingProvider.hide();
    });
  }

  async getLedger(hashLedgera:string)
  {
    await this.xrpl_api.getLedger(hashLedgera)
      .then(info => {
        console.log('getLedgerInfo' + JSON.stringify(info, null, 2));
        return JSON.stringify(info, null, 2)
        //this.loadingProvider.hide();
    });
  }

  async sendPayment(txData:any)
  {

    await this.xrpl_api.sendPayment(txData).then(info => {
      console.log('sendPayment' + JSON.stringify(info, null, 2));
      return JSON.stringify(info, null, 2);
      //this.loadingProvider.hide();
    });
  }
}
