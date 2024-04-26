import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TabsComponent } from './tabs/tabs.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    HeaderComponent,
    TabsComponent,
    SidebarComponent
  ],
  exports: [
    HeaderComponent,
    TabsComponent,
    SidebarComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
  ]
})
export class CommonsModule { }
