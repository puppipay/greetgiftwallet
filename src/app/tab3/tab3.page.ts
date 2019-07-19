import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Blue022IssueService } from './blue022.issue.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';



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
public sendinggreetings = [];

public walletbalance: any;
public walletaddress: any;
public walletwif: any;
public toaddress: string;
public greetingtomake: string;
public toamount: number;
public txid: string;
public modeautomatic = true;


constructor(
	private blue022issue: Blue022IssueService,
        private router: Router,
	private storage: Storage

  ) {
}


ngOnInit() {
  this.loadwalletwif() ;
  this.issued = {
    "message": "",
    "pin": "",
    "address": "",
    "greeting": "",
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

clear() {
  var empty = []
  this.storage.set('issuesendinggreetings',empty);
  this.loadsendinggreetings() ;
}

ionViewWillEnter() {
  this.loadwalletwif() ;
  this.loadsendinggreetings() ;
}

wiftoaddress() {

  this.walletaddress = dashcore.PrivateKey.fromWIF(this.walletwif ).toAddress(dashcore.Networks.testnet).toString();

}

prepareautomatic() {

    if(!this.greetingtomake || this.greetingtomake.length < 5) {
      alert("Enter greeting to make");
      return;
    }

    var data = {
      msgtype: "greeting",
      greeting: this.greetingtomake,
      network: "testnet"
    };

   this.blue022issue.issuegreetingmessage(data).then((data: any) => {
      if(data != null)
      {
        this.issued = data;
        this.blue022issue.savesendinggreeting(this.issued);
        this.sendpayment() ;
      }
      else {
        //alert("Issue failed");
      }
   }, (err)=> {
     alert (err._body)
   });


}

modemanual() {

  this.modeautomatic = false;

}

switchmodeautomatic() {

  this.modeautomatic = true;

}


generatetestnet() {

    if(!this.greetingtomake || this.greetingtomake.length < 5) {
      alert("Enter greeting to make");
      return;
    }

    var data = {
      msgtype: "greeting",
      greeting: this.greetingtomake,
      network: "testnet"
    };

   this.blue022issue.issuegreetingmessage(data).then((data: any) => {
      if(data != null)
      {
        this.issued = data;
        this.blue022issue.savesendinggreeting(this.issued);
      }
      else {
        //alert("Issue failed");
      }
   }, (err)=> {
     alert (err._body)
   });

}


getaddressbalance() {

if(!this.issued.address) {
 alert("Testnet address empty");
 return;
}

 this.blue022issue.getBalance(this.issued.address, "testnet").then((data: any) => {
      if(data != null)
      {
        this.addressbalance = data;
      }
      else {
//        alert("Query failed");
      }
   }, (err)=> {
     alert (err)
   });
}

sharingdata() {

  var amount;

  if(this.addressbalance.balanceSat > 0) 
  {
     amount = this.addressbalance.balanceSat;
  }
  else 
  {
     amount = this.addressbalance.unconfirmedBalanceSat;
  }

  var sharingdata = {
     shorturl : this.issued.shorturl,
     pin : this.issued.pin,
     greeting : this.issued.greeting,
     amount : amount
  };

  this.storage.set('sharingdata',sharingdata);
 
}

printingdata() {

  var printingdata = {
     shorturl : this.issued.shorturl,
     pin : this.issued.pin,
     greeting : this.issued.greeting,
     amount : this.addressbalance.balanceSat
  };

  this.storage.set('printingdata',printingdata);

}


printcheck() {
  if(this.addressbalance && ( this.addressbalance.balanceSat > 14999 || this.addressbalance.unconfirmedBalanceSat > 14999) ) {
   this.printingdata() ;
   this.router.navigateByUrl('/util/socialtabs/tab2');
  } else {
    alert("Greeting is not adequately funded, Minimum 15000 satoshis needed.");
  }
}

sharecheck() {
  if(this.addressbalance && ( this.addressbalance.balanceSat > 14999 || this.addressbalance.unconfirmedBalanceSat > 14999))
  {
   this.sharingdata() ;
   this.router.navigateByUrl('/util/socialtabs/tab1');

  } else {
    alert("Greeting is not adequately funded, Minimum 15000 satoshis needed.");
  }
}


getwalletbalance() {

if(!this.walletaddress) {
 alert("Address empty");
 return;
}

 this.blue022issue.getBalance(this.walletaddress, "testnet").then((data: any) => {
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


loadsendinggreetings() {


   this.blue022issue.getsendinggreetings().then((data: any) => {
      if(data != null)
      {
        this.sendinggreetings = data;
      }
      else {
//        alert("Load failed");
      }
   }, (err)=> {
     alert (err)
   });

}

senddirectpayment() {

 this.blue022issue.getUtxo(this.walletaddress, 'testnet').then((data: any) => {
 var fees = 15000;
 var utxo = data;
 var privatekey = dashcore.PrivateKey.fromWIF(this.walletwif);
 var changeaddress = this.walletaddress;
    var tx = this.blue022issue.createtransaction(utxo, privatekey,changeaddress, this.toaddress, Number(this.toamount),fees ) ;

    this.blue022issue.broadcast(tx.toString('hex')).then((res: any) => {
      if(res) {
        this.txid = res.txid;
        var trandata = {
            txid: this.txid,
            fromaddress: this.walletaddress,
            toaddress: this.toaddress,
            amount: Number(this.toamount),
            fees: fees
        };

       this.blue022issue.savesendtransaction(trandata);
       this.blue022issue.updatesendinggreeting(this.toaddress, this.txid);

      }
    });

  });


}

sendpayment() {

 this.blue022issue.getUtxo(this.walletaddress, 'testnet').then((data: any) => {
 var fees = 15000;
 var utxo = data;
 var privatekey = dashcore.PrivateKey.fromWIF(this.walletwif);
 var changeaddress = this.walletaddress;

    var tx = this.blue022issue.createtransaction(utxo, privatekey,changeaddress, this.issued.address, Number(this.toamount),fees ) ;

    this.blue022issue.broadcast(tx.toString('hex')).then((res: any) => {
      if(res) {
        this.txid = res.txid;
        var trandata = {
            txid: this.txid,
            fromaddress: this.walletaddress,
            toaddress: this.issued.address,
            amount: Number(this.toamount),
            fees: fees
        };

       this.blue022issue.savesendtransaction(trandata);

      }
    });

  });
}


 

}
