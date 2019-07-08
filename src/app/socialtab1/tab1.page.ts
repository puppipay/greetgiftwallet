import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

sharingdata: any;
sharingmessage: string;

public whichsegment = "receive";

constructor(
	private storage: Storage,

  ) {
  this.loadsharingdata() ;
}


ngOnInit() {

  this.loadsharingdata() ;

}

loadsharingdata() {
      this.storage.get('sharingdata').then((data)=> {
        if(data) {
        this.sharingdata = data;

    this.sharingmessage = "Dear  \r\n" + " %0A %0A  " + this.sharingdata.greeting +  "%0A %0A \r\n"+  "My gift is in  "  + this.sharingdata.shorturl +  "%0A %0A \r\n "+ " PIN to accept is: " + this.sharingdata.pin + " %0A %0A \r\n "  + " Amount enclosed is " + this.sharingdata.amount + " Satoshis " + " \r\n %0A  %0A Good day %0A %0A \r\n";


        }
      });

  }




ionViewWillEnter() {
  this.loadsharingdata() ;
}








}
