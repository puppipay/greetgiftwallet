import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import {of as observableOf} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {environment} from '../config/environment';
import {webtestnetissueconfig, weblivenetissueconfig} from '../config/webissueconfig';

declare var dashcore;

@Injectable({
  providedIn: 'root'
})

export class Blue022IssueService {
  public token: any;
  url: string ;

  sendinggreetings= [];
  sendtransactions= [];

  constructor(public http: Http, public storage: Storage) {
      this.url = environment.hosteddomain ;

     this.loadsendinggreetings() ;
     this.loadsendtransactions() ;

  }


  savesendinggreeting (details: any) {
    if(details != null) {
      this.sendinggreetings.push(details);
      this.storage.set('issuesendinggreetings',this.sendinggreetings);
    }
  }

  updatesendinggreeting (address, txid) {

     for(var i=0; i< this.sendinggreetings.length; i++ ) {
	if(this.sendinggreetings[i].address == address) {
	  this.sendinggreetings[i].txid = txid;
          this.updatetransaction(txid, this.sendinggreetings[i].greeting) ;
        }
     }
      this.storage.set('issuesendinggreetings',this.sendinggreetings);
  }

  updatetransaction (txid, greeting) {

     for(var i=0; i< this.sendtransactions.length; i++ ) {

	if(this.sendtransactions[i].txid == txid) {
	  this.sendtransactions[i].greeting = greeting;
        }

     }
      this.storage.set('sendtransactions',this.sendtransactions);

  }

  loadsendinggreetings() {
      this.storage.get('issuesendinggreetings').then((data)=> {
	if(data) {
        this.sendinggreetings = data;
        }
      });

  }
  
  getsendinggreetings() {
    return this.storage.get('issuesendinggreetings');
  }

  savesendtransaction (details: any) {
    if(details != null) {
      this.sendtransactions.push(details);
      this.storage.set('sendtransactions',this.sendtransactions);
    }
  }


  loadsendtransactions() {
      this.storage.get('sendtransactions').then((data)=> {
        if(data) {
        this.sendtransactions = data;
        }
      });
  }

  getsenttransactions() {
    return this.storage.get('sendtransactions');
  }



  getinitialcoins (details: any) {



        return new Promise((resolve, reject) => {


             let headers = new Headers();

            if(details.network == 'testnet'){
                headers.append('Authorization', webtestnetissueconfig.apikey);
            }else {
                headers.append('Authorization', weblivenetissueconfig.apikey);

            }
             headers.append('Content-Type', 'application/json');

            this.http.post(this.url + '/getinitialcoins', JSON.stringify(details), {headers: headers})
              .subscribe(res => {

                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });

  }

  issuegreetingmessage (details: any) {



        return new Promise((resolve, reject) => {


             let headers = new Headers();

            if(details.network == 'testnet'){
                headers.append('Authorization', webtestnetissueconfig.apikey);
            }else {
                headers.append('Authorization', weblivenetissueconfig.apikey);

            }
             headers.append('Content-Type', 'application/json');

            this.http.post(this.url + '/blue022/issuegreetcontract', JSON.stringify(details), {headers: headers})
              .subscribe(res => {

                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });

  }

  getissuedaddresses () {


        return new Promise((resolve, reject) => {


             let headers = new Headers();
             headers.append('Authorization', webtestnetissueconfig.apikey);
             headers.append('Content-Type', 'application/json');


            this.http.post(this.url + '/getissuedaddresses', null, {headers: headers})
              .subscribe(res => {

                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });

  }


   getBalance(address: string, network: string): any {

     var url ;

     if(network == 'testnet') {
        url = 'https://testnet-insight.dashevo.org/insight-api/addr/';
     }
     else {
        url = 'https://insight.dashevo.org/insight-api/addr/';
     }

     return new Promise((resolve, reject) => {


     this.http.get(url+address).subscribe(res => {
                let data = res.json();
                resolve(data);
        }, (err) => {
          reject(err);
        });
    });


  }

   getUtxo(address: string, network: string): any {

     var url ;

     if(network == 'testnet') {
        url = 'https://testnet-insight.dashevo.org/insight-api/addr/';
     }
     else {
        url = 'https://insight.dashevo.org/insight-api/addr/';
     }

     return new Promise((resolve, reject) => {


     this.http.get(url+address+"/utxo").subscribe(res => {
                let data = res.json();
                resolve(data);
        }, (err) => {
          reject(err);
        });
    });


  }

  createtransaction(utxo, privatekey,changeaddress, toaddress, toamount,fees) {

  var tx = new dashcore.Transaction()
      .from(utxo)
      .to([{address: toaddress, satoshis: toamount}])
      .fee(fees)
      .change(changeaddress)
      .sign(privatekey);

  var txobject = tx.toBuffer();

   return txobject;
 }


  broadcast( tx) {
 
   var pushtx = { 
    rawtx: tx
   };  


   var lurl = 'https://testnet-insight.dashevo.org/insight-api/tx/send';

   return new Promise((resolve, reject) => {


             let headers = new Headers();

             headers.append('Content-Type', 'application/json');

            this.http.post(lurl, JSON.stringify(pushtx), {headers: headers})
              .subscribe(res => {

                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });

  }

   getqrcode(sentdata: string): any {

     var url ;
     url = "https://api.qrserver.com/v1/create-qr-code/?size=150x150";

     return new Promise((resolve, reject) => {
   

     this.http.get(url + "&data="+sentdata).subscribe(res => {
                let data = res.json();
                resolve(data);
        }, (err) => {
          reject(err);
        });
    });


  }


 
}
