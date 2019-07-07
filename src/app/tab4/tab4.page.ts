import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http, Headers } from '@angular/http';
import { Blue022ConsumeService } from '../tab1/blue022.consume.service';
import { Blue022IssueService } from '../tab3/blue022.issue.service';

declare var dashcore;

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {
walletwif : any;
walletaddress : any;
testnetaddressbalance : any;
url: string;

constructor(public http: Http, 
         private blue022consume: Blue022ConsumeService,
         private blue022issue: Blue022IssueService,
	public storage: Storage) {

    this.loadwalletwif() ;

}

createwif() {

  const PrivateKey = dashcore.PrivateKey;
  const privateKey = new PrivateKey();
  this.walletwif = privateKey.toWIF();
  this.wiftoaddress() ;

}

getinitialcoins() {
 if(!this.walletaddress) {
 alert("Testnet address empty");
 return;
}

 var data = {
	network: 'testnet',
	toaddress: this.walletaddress
  };

 this.blue022issue.getinitialcoins(data).then((data: any) => {
      if(data != null)
      {
        //this.testnetaddressbalance = data;
      }
      else {
//        alert("Query failed");
      }
   }, (err)=> {
     alert (err)
   });


}

wiftoaddress() {

  this.walletaddress = dashcore.PrivateKey.fromWIF(this.walletwif ).toAddress(dashcore.Networks.testnet).toString();

}

savewif() {

   this.wiftoaddress() ;
   this.storage.set('walletwif', this.walletwif);

}


loadwalletwif() {
     this.storage.get('walletwif').then(data=> {
	if(data) {
      this.walletwif = data;
      this.wiftoaddress() ;
        }
     });
}





gettestnetbalance() {

if(!this.walletaddress) {
 alert("Testnet address empty");
 return;
}

 this.blue022consume.getBalance(this.walletaddress, "testnet").then((data: any) => {
      if(data != null)
      {
        this.testnetaddressbalance = data;
      }
      else {
        alert("Query failed");
      }
   }, (err)=> {
     alert (err)
   });
}


}
