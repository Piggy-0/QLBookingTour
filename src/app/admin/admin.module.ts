import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';

import { AdminRoutingModule } from './admin-routing.module';

import { IndexComponent } from './index/index.component';

import { ListUsersComponent } from './Users/list-users/list-users.component';
import { CreateUsersComponent } from './Users/create-users/create-users.component';
import { ListCategoryComponent } from './Category/list-category/list-category.component';
import { CreateCategoryComponent } from './Category/create-category/create-category.component';
import { DetailsCategoryComponent } from './Category/details-category/details-category.component';
import { CreateTourComponent } from './Tour/create-tour/create-tour.component';
import { DetailsTourComponent } from './Tour/details-tour/details-tour.component';
import { ListOrderComponent } from './Order/list-order/list-order.component';
import { CreateOrderComponent } from './Order/create-order/create-order.component';
import { DetailsOrderComponent } from './Order/details-order/details-order.component';
import { ListToursComponent } from './Tour/list-tours/list-tours.component';
import { ReportOrderComponent } from './Report/report-order/report-order.component';


@NgModule({
  declarations: [
    AdminComponent,
    IndexComponent,
    ListUsersComponent,
    CreateUsersComponent,
    ListCategoryComponent,
    CreateCategoryComponent,
    DetailsCategoryComponent,
    CreateTourComponent,
    DetailsTourComponent,
    ListOrderComponent,
    CreateOrderComponent,
    DetailsOrderComponent,
    ListToursComponent,
    ReportOrderComponent,

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    FormsModule
  ]
})
export class AdminModule { }
