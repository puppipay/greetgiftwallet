import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Blue011ConsumeService } from './blue011.consume.service';
import { Blue011IssueService } from '../tab3/blue011.issue.service';
//import * as dashcore from '@dashevo/dashcore-lib'

declare var dashcore;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

public revertible : any;
public transacted : any;
public walletbalance: any;
public walletaddress: any;
public walletwif: any;
public toaddress: string;
public toamount: number;
public receivedmessages = [];

public whichsegment = "receive";

constructor(
	private storage: Storage,
	private blue011issue: Blue011IssueService,
	private blue011consume: Blue011ConsumeService

  ) {
}


ngOnInit() {


 this.loadwalletwif() ;

 this.transacted = {
    "txid": "",
    "amount": "",
    "fromaddress": "",
    "toaddress": "",
  };

 this.revertible = {
    "message": "",
    "pin": "",
    "address": "",
    "target": "",
    "network": "",
    "type": "BLUE011",
    };



}

ionViewWillEnter() {
  this.loadreceivedmessages() ;
}



wiftoaddress() {

  this.walletaddress = dashcore.PrivateKey.fromWIF(this.walletwif ).toAddress(dashcore.Networks.testnet).toString();

}

sendpayment() {

 this.blue011issue.getUtxo(this.walletaddress, 'testnet').then((data: any) => {
 var fees = 15000;
 var utxo = data;
 var privatekey = dashcore.PrivateKey.fromWIF(this.walletwif);
 var changeaddress = this.walletaddress;
 
    var tx = this.blue011issue.createtransaction(utxo, privatekey,changeaddress, this.toaddress, Number(this.toamount),fees ) ;

    this.blue011issue.broadcast(tx.toString('hex')).then(res => {
    
    alert(res);

    });

  });
}

loadwalletwif() {
     this.storage.get('walletwif').then(data=> {
        if(data) {
      this.walletwif = data;
      this.wiftoaddress() ;
        }
     });

}


consumetestnetmessage() {

if(!this.revertible.message) {
 alert("Message field empty");
 return;
}

if(!this.revertible.pin) {
 alert("PIN field empty");
 return;
}

this.revertible.target = this.walletaddress;

this.revertible.network = 'testnet';

 this.blue011consume.savereceivedmessage(this.revertible);

 this.blue011consume.consumemessage(this.revertible).then((data: any) => {
      if(data != null)
      {
        this.transacted = data;
        this.blue011consume.savereceivetransaction(this.transacted);
        this.loadreceivedmessages() ;
      }
      else {
        alert("Consume failed");
      }
   }, (err)=> {
     alert (err)
   });


}

 
gettestnetbalance() {

if(!this.walletaddress) {
 alert("Address empty");
 return;
}

 this.blue011consume.getBalance(this.walletaddress, "testnet").then((data: any) => {
      if(data != null)
      {
        this.walletbalance = data;
      }
      else {
        alert("Query failed");
      }
   }, (err)=> {
     alert (err)
   });
}


loadreceivedmessages() {


   this.blue011consume.getreceivedmessages().then((data: any) => {
      if(data != null)
      {
        this.receivedmessages = data;
      }
      else {
//        alert("Load failed");
      }
   }, (err)=> {
     alert (err)
   });

}







}
