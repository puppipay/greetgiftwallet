import { Component, OnInit,  ElementRef ,ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as jspdf from 'jspdf'; 
import html2canvas from 'html2canvas';
import { Blue022IssueService } from '../tab3/blue022.issue.service';
import { QRCode, ErrorCorrectLevel, QRNumber, QRAlphaNum, QR8BitByte, QRKanji } from 'qrcode-generator-ts/js';




@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

// https://neelbhatt.com/2018/09/16/convert-html-to-pdf-using-angular-6/

export class Tab1Page implements OnInit{

printingdata: any;
printingmessage: string;
qrstring: string;

public whichsegment = "receive";

constructor(
	private storage: Storage,
	private blue022issue: Blue022IssueService,
  ) {
  this.loadprintingdata() ;
}


getqrcode () {
// https://github.com/kazuhikoarase/qrcode-generator/blob/master/ts/src/ts/test.ts

var qr = new QRCode();
    qr.setTypeNumber(5);
    qr.setErrorCorrectLevel(ErrorCorrectLevel.L);
    qr.addData(new QRNumber('0123') ); // Number only
    qr.addData(new QRAlphaNum('AB5678CD') ); // Alphabet and Number
    qr.addData(new QR8BitByte('[8BitByte :)]') ); // most useful for usual purpose.
    qr.addData('[here is 8BitByte too]');
    qr.addData(new QRKanji('漢字') ); // Kanji(SJIS) only
    qr.make();

 this.qrstring = qr.toDataURL() ;
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

        this.getqrcode();

    this.printingmessage = "\r\n" +  this.printingdata.greeting.substring(0, this.printingdata.greeting.length-2)  +  "\r\n"+  "My gift is in :   "  + this.printingdata.shorturl +  "\r\n "+ "PIN to accept gift is: " + this.printingdata.pin + "\r\n"  + "Amount enclosed is " + this.printingdata.amount + " Satoshis " + "\r\n    Good day   \r\n";


        }
      });

  }




ionViewWillEnter() {
  this.loadprintingdata() ;
}








}
