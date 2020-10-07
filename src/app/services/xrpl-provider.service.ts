import { Injectable } from '@angular/core';
import RippledWsClient from 'rippled-ws-client'
import { resolve } from 'q';

@Injectable({
  providedIn: 'root'
})
export class XrplProviderService {

  public static BRAMA_1 = 'rE8HzEXQAbnQr97E3YcMicSUvzjcGicmGz';
  //const BRAMA_1_PRIV = 'sncQFYhBd2DLEAUKMMWmMVNMP4jYD';

  public static B1X_XRP_RATIO = 1000;

  public xrpl_api: RippledWsClient;
  public wallet: any;//Wallet;
  public market: any;
  public currentBlockHash = "Connecting...";
  public currentBlockDate:Date;

  public connection;

  public currentShownTransaction: any;

  public allNuggets = [];
  public static shownNuggets = [];

  constructor() {
    
   }

  start()
  {
    console.log(' start xrpl!');

    this.xrpl_api = new RippledWsClient('wss://s.altnet.rippletest.net:51233').then(function (connection) {
      // We have liftoff!
      // All or other code lives here, using the 'connection' variable
      
      
      console.log(' We have liftoff!', connection.getState());
      this.connection = connection;

      this.xrpl_api.on('disconnected', (code) => {
        if (code !== 1000) {
          console.log('Connection is closed due to error.');
        } else {
          console.log('Connection is closed normally.');
        }
      });
  
      this.xrpl_api.on('ledger',  ledger => {
        console.log("ledger complete:", JSON.stringify(ledger, null, 2));
        this.currentBlockHash = JSON.stringify(ledger.ledgerHash, null, 2);
        this.currentBlockDate = new Date(ledger.ledgerTimestamp);
      });

    }).catch(function (error) {
      // Oops!
    })
    
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
        
        XrplProviderService.shownNuggets = info.transactions;
        console.log('Got element NUGGETS:', XrplProviderService.shownNuggets)
        return info.transactions
      }).catch(function (error) {
        console.log('Got error', error)
      })
    }).catch(function (error) {
      console.log('Got error', error)
    })

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
