import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

sharingdata: any;
sharingmessage: string;
mailingmessage: string;
mobiletest : any;

public whichsegment = "receive";

constructor(
	private storage: Storage,
        private socialSharing: SocialSharing

  ) {
  this.loadsharingdata() ;
}


ngOnInit() {
  this.mobiletest = this.isMobile();

  this.loadsharingdata() ;

}

shareme() {
this.socialSharing.canShareViaEmail().then(() => {
  // Sharing via email is possible
}).catch(() => {
  // Sharing via email is not possible
});

// Share via email
this.socialSharing.shareViaEmail('Body', 'Subject', ['recipient@example.org']).then(() => {
  // Success!
}).catch(() => {
  // Error!
});

}


isMobile() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};


loadsharingdata() {
      this.storage.get('sharingdata').then((data)=> {
        if(data) {
        this.sharingdata = data;

  this.sharingmessage = "\r\n" +  this.sharingdata.greeting.substring(0, this.sharingdata.greeting.length-2)  +  "\r\n"+  " My gift is in :   "  + this.sharingdata.shorturl +  "\r\n"+ " PIN to accept gift is: " + this.sharingdata.pin + "\r\n"  + " Amount enclosed is " + this.sharingdata.amount + " Satoshis " + "\r\n    Good day   \r\n";

  this.mailingmessage = "%0D%0A \r\n" +  this.sharingdata.greeting.substring(0, this.sharingdata.greeting.length-2)  +  "%0D%0A \r\n"+  " My gift is in :   "  + this.sharingdata.shorturl +  "%0D%0A \r\n"+ " PIN to accept gift is: " + this.sharingdata.pin + "%0D%0A \r\n"  + " Amount enclosed is " + this.sharingdata.amount + " Satoshis " + "%0D%0A \r\n    Good day   %0D%0A \r\n";



        }
      });

  }




ionViewWillEnter() {
  this.loadsharingdata() ;
}








}
