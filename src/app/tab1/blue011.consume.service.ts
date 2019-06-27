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

export class Blue011ConsumeService {
  public token: any;
  url: string ;

  receivedmessages= [];
//  transactions= [];
  receivetransactions= [];

  constructor(public http: Http, public storage: Storage) {
     this.url = environment.hosteddomain ;
     this.loadreceivedmessages() ;
     this.loadreceivetransactions() ;
  }


  savereceivedmessage (details: any) {
    if(details != null) {
      this.receivedmessages.push(details);
      this.storage.set('receivedmessages',this.receivedmessages);
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

  loadreceivedmessages() {
      this.storage.get('receivedmessages').then((data)=> {
	if(data) {
        this.receivedmessages = data;
        }
      });

  }

  getreceivetransactions() {
    return this.storage.get('receivetransactions');
  }


  
  getreceivedmessages() {
    return this.storage.get('receivedmessages');
  }


  consumemessage (details: any) {



        return new Promise((resolve, reject) => {


             let headers = new Headers();

            if(details.network == 'testnet'){
                headers.append('Authorization', webtestnetconsumeconfig.apikey);
            }else {
                headers.append('Authorization', weblivenetconsumeconfig.apikey);

            }
             headers.append('Content-Type', 'application/json');

            this.http.post(this.url + '/blue011/consumemessage', JSON.stringify(details), {headers: headers})
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



}
