import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Blue022ConsumeService } from '../tab1/blue022.consume.service';
import { Blue022IssueService } from '../tab3/blue022.issue.service';
import { Storage } from '@ionic/storage';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

public receivedtransactions = [];
public senttransactions = [];
public whichtransaction = "senttransactions";

constructor(
        private blue022consumeservice: Blue022ConsumeService,
        private blue022issueservice: Blue022IssueService,
        private storage: Storage

  ) {
}

ngOnInit() {

this.getreceivetransactions();
this.getsenttransactions();

}

clear() {
  var empty= [];
    this.storage.set('receivetransactions',empty);
    this.storage.set('sendtransactions',empty);
    this.getreceivetransactions() ;
    this.getsenttransactions();
}

getreceivetransactions() {

   this.blue022consumeservice.getreceivetransactions().then((data: any) => {
      if(data != null)
      {
        this.receivedtransactions = data;
      }
      else {
        alert("No receive transactions ");
    }
    });

}
 

getsenttransactions() {

   this.blue022issueservice.getsenttransactions().then((data: any) => {
      if(data != null)
      {
        this.senttransactions = data;
      }
      else {
        alert("No sent transactions ");
    }
    });

}

}
