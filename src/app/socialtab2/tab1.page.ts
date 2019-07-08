import { Component, OnInit,  ElementRef ,ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as jspdf from 'jspdf'; 
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

// https://neelbhatt.com/2018/09/16/convert-html-to-pdf-using-angular-6/

export class Tab1Page implements OnInit{

printingdata: any;
printingmessage: string;

public whichsegment = "receive";

constructor(
	private storage: Storage,
  ) {
  this.loadprintingdata() ;
}


captureScreen()
{
var data = document.getElementById('contentToConvert');
html2canvas(data).then(canvas => {
// Few necessary setting options
var imgWidth = 208;
var pageHeight = 295;
var imgHeight = canvas.height * imgWidth / canvas.width;
var heightLeft = imgHeight;
 
const contentDataURL = canvas.toDataURL('image/png')
let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
var position = 0;
pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
pdf.save('MYPdf.pdf'); // Generated PDF
});
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
