import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SocialTabsPageRoutingModule } from './tabs.router.module';

import { SocialTabsPage } from './tabs.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SocialTabsPageRoutingModule
  ],
  declarations: [SocialTabsPage]
})
export class SocialTabsPageModule {}
