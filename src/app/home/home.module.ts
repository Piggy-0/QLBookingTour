import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from '../home/home.component';
import { FormsModule } from '@angular/forms';
import { CapNhatMKComponent } from './User/cap-nhat-mk/cap-nhat-mk.component';
import { CapNhatUserComponent } from './User/cap-nhat-user/cap-nhat-user.component';
import { ViewOrderHistoryComponent } from './User/view-order-history/view-order-history.component';
import { LoginComponent } from './User/login/login.component';
import { RegisterComponent } from './User/register/register.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ListTourComponent } from './Tour/list-tour/list-tour.component';
import { DetailTourComponent } from './Tour/detail-tour/detail-tour.component';
import { CategoryTourComponent } from './Tour/category-tour/category-tour.component';
import { ReviewTourComponent } from './Tour/review-tour/review-tour.component';
import { CreateTourComponent } from './Tour/create-tour/create-tour.component';


@NgModule({
  declarations: [
    HomeComponent,
    CapNhatMKComponent,
    CapNhatUserComponent,
    ViewOrderHistoryComponent,

    LoginComponent,

    RegisterComponent,
      HomepageComponent,
      ListTourComponent,
      DetailTourComponent,
      CategoryTourComponent,
      ReviewTourComponent,
      CreateTourComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    RouterModule,
    FormsModule
  ]
})
export class HomeModule { }
