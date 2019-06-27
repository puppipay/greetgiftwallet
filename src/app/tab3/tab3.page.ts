import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Blue011IssueService } from './blue011.issue.service';
import { Storage } from '@ionic/storage';


declare var dashcore;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

public issued: any;
public whichsegment = "send";
public addressbalance : any;
public sendingmessages = [];

public walletbalance: any;
public walletaddress: any;
public walletwif: any;
public toaddress: string;
public toamount: number;
public torevertamount: number;
public txid: string;


constructor(
	private blue011issue: Blue011IssueService,
	private storage: Storage

  ) {
}


ngOnInit() {
  this.loadwalletwif() ;
  this.issued = {
    "message": "",
    "pin": "",
    "address": "",
    "network": "",
    "type": "",
    };


}

loadwalletwif() {
     this.storage.get('walletwif').then(data=> {
        if(data) {
      this.walletwif = data;
      this.wiftoaddress() ;
        }
     });

}



ionViewWillEnter() {
  this.loadwalletwif() ;
  this.loadsendingmessages() ;
}

wiftoaddress() {

  this.walletaddress = dashcore.PrivateKey.fromWIF(this.walletwif ).toAddress(dashcore.Networks.testnet).toString();

}



generatetestnet() {

    var data = {
      msgtype: "default",
      network: "testnet"
    };

   this.blue011issue.issuesendingmessage(data).then((data: any) => {
      if(data != null)
      {
        this.issued = data;
        this.blue011issue.savesendingmessage(this.issued);
      }
      else {
        alert("Issue failed");
      }
   }, (err)=> {
     alert (err)
   });

}


getaddressbalance() {

if(!this.issued.address) {
 alert("Testnet address empty");
 return;
}

 this.blue011issue.getBalance(this.issued.address, "testnet").then((data: any) => {
      if(data != null)
      {
        this.addressbalance = data;
      }
      else {
        alert("Query failed");
      }
   }, (err)=> {
     alert (err)
   });
}

getwalletbalance() {

if(!this.walletaddress) {
 alert("Address empty");
 return;
}

 this.blue011issue.getBalance(this.walletaddress, "testnet").then((data: any) => {
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


loadsendingmessages() {


   this.blue011issue.getsendingmessages().then((data: any) => {
      if(data != null)
      {
        this.sendingmessages = data;
      }
      else {
        alert("Load failed");
      }
   }, (err)=> {
     alert (err)
   });

}

senddirectpayment() {

 this.blue011issue.getUtxo(this.walletaddress, 'testnet').then((data: any) => {
 var fees = 15000;
 var utxo = data;
 var privatekey = dashcore.PrivateKey.fromWIF(this.walletwif);
 var changeaddress = this.walletaddress;

    var tx = this.blue011issue.createtransaction(utxo, privatekey,changeaddress, this.toaddress, Number(this.toamount),fees ) ;

    this.blue011issue.broadcast(tx.toString('hex')).then((res: any) => {
      if(res) {
        this.txid = res.txid;
        var trandata = {
            txid: this.txid,
            fromaddress: this.walletaddress,
            toaddress: this.toaddress,
            amount: Number(this.toamount),
            fees: fees
        };

       this.blue011issue.savesendtransaction(trandata);

      }
    });

  });


}

sendpayment() {

 this.blue011issue.getUtxo(this.walletaddress, 'testnet').then((data: any) => {
 var fees = 15000;
 var utxo = data;
 var privatekey = dashcore.PrivateKey.fromWIF(this.walletwif);
 var changeaddress = this.walletaddress;

    var tx = this.blue011issue.createtransaction(utxo, privatekey,changeaddress, this.issued.address, Number(this.torevertamount),fees ) ;

    this.blue011issue.broadcast(tx.toString('hex')).then((res: any) => {
      if(res) {
        this.txid = res.txid;
        var trandata = {
            txid: this.txid,
            fromaddress: this.walletaddress,
            toaddress: this.issued.address,
            amount: Number(this.torevertamount),
            fees: fees
        };

       this.blue011issue.savesendtransaction(trandata);

      }
    });

  });
}


 

}
