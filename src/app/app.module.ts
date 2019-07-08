import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';

import { TabsPage } from './tabs/tabs.page';
import { TabsPageRoutingModule } from './tabs/tabs.router.module';




@NgModule({
  declarations: [AppComponent, 
        TabsPage,
   ],
  entryComponents: [],
  imports: [BrowserModule, 
        HttpModule,
        IonicStorageModule.forRoot(),
	IonicModule.forRoot(), 
        TabsPageRoutingModule,
	AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule {}
