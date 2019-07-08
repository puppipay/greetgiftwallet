import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { TabsPageRoutingModule } from './tabs/tabs.router.module';

import { TabsPage } from './tabs/tabs.page';

const routes: Routes = [
  // { path: '', loadChildren: './tabs/tabs.module#TabsPageModule',
  { path: '', component: TabsPage,

  },
   { path: 'util', loadChildren: './socialtabs/tabs.module#TabsPageModule', 

  },
  { path: '**', redirectTo: '/tabs/tab2'

  },


];
@NgModule({
  imports: [
    TabsPageRoutingModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
