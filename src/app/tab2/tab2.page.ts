import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Blue011ConsumeService } from '../tab1/blue011.consume.service';
import { Blue011IssueService } from '../tab3/blue011.issue.service';


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
        private blue011consumeservice: Blue011ConsumeService,
        private blue011issueservice: Blue011IssueService

  ) {
}

ngOnInit() {

this.getreceivetransactions();
this.getsenttransactions();

}



getreceivetransactions() {

   this.blue011consumeservice.getreceivetransactions().then((data: any) => {
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

   this.blue011issueservice.getsenttransactions().then((data: any) => {
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
