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

export class Blue011IssueService {
  public token: any;
  url: string ;

  sendingmessages= [];
  sendtransactions= [];

  constructor(public http: Http, public storage: Storage) {
      this.url = environment.hosteddomain ;

     this.loadsendingmessages() ;
     this.loadsendtransactions() ;

  }


  savesendingmessage (details: any) {
    if(details != null) {
      this.sendingmessages.push(details);
      this.storage.set('issuesendingmessages',this.sendingmessages);
    }
  }


  loadsendingmessages() {
      this.storage.get('issuesendingmessages').then((data)=> {
	if(data) {
        this.sendingmessages = data;
        }
      });

  }
  
  getsendingmessages() {
    return this.storage.get('issuesendingmessages');
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



  issuesendingmessage (details: any) {



        return new Promise((resolve, reject) => {


             let headers = new Headers();

            if(details.network == 'testnet'){
                headers.append('Authorization', webtestnetissueconfig.apikey);
            }else {
                headers.append('Authorization', weblivenetissueconfig.apikey);

            }
             headers.append('Content-Type', 'application/json');

            this.http.post(this.url + '/blue011/issuemessage', JSON.stringify(details), {headers: headers})
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


 
}
