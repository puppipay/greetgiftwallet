import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

printingdata: any;
printingmessage: string;

public whichsegment = "receive";

constructor(
	private storage: Storage,

  ) {
  this.loadprintingdata() ;
}


ngOnInit() {

  this.loadprintingdata() ;

}

loadprintingdata() {
      this.storage.get('printingdata').then((data)=> {
        if(data) {
        this.printingdata = data;

    this.printingmessage = "Dear  \r\n" + " %0A %0A  " + this.printingdata.greeting +  "%0A %0A \r\n"+  "My gift is in  "  + this.printingdata.shorturl +  "%0A %0A \r\n "+ " PIN to accept is: " + this.printingdata.pin + " %0A %0A \r\n "  + " Amount enclosed is " + this.printingdata.amount + " Satoshis " + " \r\n %0A  %0A Good day %0A %0A \r\n";


        }
      });

  }




ionViewWillEnter() {
  this.loadprintingdata() ;
}








}
