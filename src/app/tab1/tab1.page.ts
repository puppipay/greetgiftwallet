import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Blue022ConsumeService } from './blue022.consume.service';
import { Blue022IssueService } from '../tab3/blue022.issue.service';
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
public receivedgreetings = [];
verifiedgreeting : string;
verifytxid : string;

public whichsegment = "receive";

constructor(
	private storage: Storage,
	private blue022issue: Blue022IssueService,
	private blue022consume: Blue022ConsumeService

  ) {
}


ngOnInit() {


 this.loadwalletwif() ;

 this.transacted = {
    "txid": "",
    "greeting": "",
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
    "type": "BLUE022",
    };



}

clear() {
  var empty = [];
  this.storage.set('receivedgreetings',empty);
  this.loadreceivedgreetings() ;

}

ionViewWillEnter() {
  this.loadreceivedgreetings() ;
}



wiftoaddress() {

  this.walletaddress = dashcore.PrivateKey.fromWIF(this.walletwif ).toAddress(dashcore.Networks.testnet).toString();

}

sendpayment() {

 this.blue022issue.getUtxo(this.walletaddress, 'testnet').then((data: any) => {
 var fees = 15000;
 var utxo = data;
 var privatekey = dashcore.PrivateKey.fromWIF(this.walletwif);
 var changeaddress = this.walletaddress;
 
    var tx = this.blue022issue.createtransaction(utxo, privatekey,changeaddress, this.toaddress, Number(this.toamount),fees ) ;

    this.blue022issue.broadcast(tx.toString('hex')).then(res => {
    
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

verifygreeting() {

    this.blue022consume.verifygreeting(this.verifytxid, "testnet").then(res => {

//     alert(JSON.stringify(res));
     var scriptsig = res.vin[0].scriptSig;
     var bufscript = dashcore.util.buffer.hexToBuffer(scriptsig.hex);
//     JSON.parse();
     var str1 = bufscript.toString('ascii');
     var index = str1.indexOf('}');
     var index2 = str1.indexOf('__');
     if(index2 > index) {
     this.verifiedgreeting = str1.substring(index + 1, index2);
     } else {
     this.verifiedgreeting = str1.substring(index + 1);
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

 this.blue022consume.savereceivedgreeting(this.revertible);

 this.blue022consume.consumegreeting(this.revertible).then((data: any) => {
      if(data != null)
      {
        this.transacted = data;
        this.blue022consume.savereceivetransaction(this.transacted);
        this.loadreceivedgreetings() ;
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

 this.blue022consume.getBalance(this.walletaddress, "testnet").then((data: any) => {
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


loadreceivedgreetings() {


   this.blue022consume.getreceivedgreetings().then((data: any) => {
      if(data != null)
      {
        this.receivedgreetings = data;
      }
      else {
//        alert("Load failed");
      }
   }, (err)=> {
     alert (err)
   });

}







}
