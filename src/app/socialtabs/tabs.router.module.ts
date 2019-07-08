import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SocialTabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'socialtabs',
    component: SocialTabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: '../socialtab1/tab1.module#Tab1PageModule'
          }
        ]
      },
      {
        path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: '../socialtab2/tab1.module#Tab1PageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/socialtabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/socialtabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SocialTabsPageRoutingModule {}
