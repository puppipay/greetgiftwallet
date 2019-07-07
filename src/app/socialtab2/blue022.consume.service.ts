import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import {of as observableOf} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {environment} from '../config/environment';
import {webtestnetconsumeconfig, weblivenetconsumeconfig} from '../config/webconsumeconfig';



@Injectable({
  providedIn: 'root'
})

export class Blue022ConsumeService {
  public token: any;
  url: string ;

  receivedgreetings= [];
//  transactions= [];
  receivetransactions= [];

  constructor(public http: Http, public storage: Storage) {
     this.url = environment.hosteddomain ;
     this.loadreceivedgreetings() ;
     this.loadreceivetransactions() ;
  }


  savereceivedgreeting (details: any) {
    if(details != null) {
      this.receivedgreetings.push(details);
      this.storage.set('receivedgreetings',this.receivedgreetings);
    }
  }

  savereceivetransaction (details: any) {
    if(details != null) {
      this.receivetransactions.push(details);
      this.storage.set('receivetransactions',this.receivetransactions);
    }
  }


  loadreceivetransactions() {
      this.storage.get('receivetransactions').then((data)=> {
	if(data) {
        this.receivetransactions = data;
        }
      });
  }

  loadreceivedgreetings() {
      this.storage.get('receivedgreetings').then((data)=> {
	if(data) {
        this.receivedgreetings = data;
        }
      });

  }

  getreceivetransactions() {
    return this.storage.get('receivetransactions');
  }


  
  getreceivedgreetings() {
    return this.storage.get('receivedgreetings');
  }


  consumegreeting (details: any) {



        return new Promise((resolve, reject) => {


             let headers = new Headers();

            if(details.network == 'testnet'){
                headers.append('Authorization', webtestnetconsumeconfig.apikey);
            }else {
                headers.append('Authorization', weblivenetconsumeconfig.apikey);

            }
             headers.append('Content-Type', 'application/json');

            this.http.post(this.url + '/blue022/consumegreetcontract', JSON.stringify(details), {headers: headers})
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

   verifygreeting(txid: string, network: string): any {

     var url ;

     if(network == 'testnet') {
        url = 'https://testnet-insight.dashevo.org/insight-api/tx/';
     }
     else {
        url = 'https://insight.dashevo.org/insight-api/tx/';
     }

     return new Promise((resolve, reject) => {


     this.http.get(url+txid).subscribe(res => {
                let data = res.json();
                resolve(data);
        }, (err) => {
          reject(err);
        });
    });


  }


}
