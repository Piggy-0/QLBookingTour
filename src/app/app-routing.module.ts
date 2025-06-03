import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CapNhatMKComponent } from './home/User/cap-nhat-mk/cap-nhat-mk.component';
import { CapNhatUserComponent } from './home/User/cap-nhat-user/cap-nhat-user.component';
import { ViewOrderHistoryComponent } from './home/User/view-order-history/view-order-history.component';
import { LoginComponent } from './home/User/login/login.component';
import { Xacthuc } from './home/User/xacthuc';
import { RegisterComponent } from './home/User/register/register.component';
import { AdminComponent } from './admin/admin.component';
import { IndexComponent } from './admin/index/index.component';
import { ListUsersComponent } from './admin/Users/list-users/list-users.component';
import { CreateUsersComponent } from './admin/Users/create-users/create-users.component';
import { HomepageComponent } from './home/homepage/homepage.component';
import { ListTourComponent } from './home/Tour/list-tour/list-tour.component';
import { DetailTourComponent } from './home/Tour/detail-tour/detail-tour.component';
import { CategoryTourComponent } from './home/Tour/category-tour/category-tour.component';
import { ListCategoryComponent } from './admin/Category/list-category/list-category.component';
import { CreateCategoryComponent } from './admin/Category/create-category/create-category.component';
import { ListToursComponent } from './admin/Tour/list-tours/list-tours.component';
import { CreateTourComponent } from './admin/Tour/create-tour/create-tour.component';
import { DetailsTourComponent } from './admin/Tour/details-tour/details-tour.component';
import { ListOrderComponent } from './admin/Order/list-order/list-order.component';
import { CreateOrderComponent } from './admin/Order/create-order/create-order.component';
import { DetailsOrderComponent } from './admin/Order/details-order/details-order.component';
import { ReportOrderComponent } from './admin/Report/report-order/report-order.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'home/homepage', pathMatch: 'full' }, // Route mặc định

  { path: 'home', component: HomeComponent, children: [
    { path: 'homepage', component: HomepageComponent },
    { path: 'tour/list', component: ListTourComponent },
    // { path: 'login', component: LoginComponent },
    { path: 'user/register', component: RegisterComponent },
    { path: 'tour/detail/:id', component: DetailTourComponent },
    { path: 'tour/TourDM/:id', component: CategoryTourComponent },

 
  ]},
  { path: 'home', component: HomeComponent,canActivate: [Xacthuc], children: [
    { path: 'user/updatePW/:id', component: CapNhatMKComponent },
    { path: 'user/updateUser/:id', component: CapNhatUserComponent },
    { path: 'user/viewOH/:id', component: ViewOrderHistoryComponent },


    
  ]},

  { path: 'admin', component: AdminComponent, canActivate: [Xacthuc], children: [
  //  { path: '**', redirectTo: 'index' },
    { path: 'index', component: IndexComponent },

    { path: 'users/list', component: ListUsersComponent},
    { path: 'users/create', component: CreateUsersComponent},
    { path: 'user/updatePW/:id', component: CapNhatMKComponent },
    { path: 'categories/list', component: ListCategoryComponent },
    { path: 'categories/create', component: CreateCategoryComponent },
    { path: 'tours/list/:id', component: ListToursComponent },
    { path: 'tours/create', component: CreateTourComponent },
    { path: 'tours/detail/:id', component: DetailsTourComponent },
    { path: 'orders/list', component: ListOrderComponent },
    { path: 'orders/create', component: CreateOrderComponent },
    { path: 'orders/detail/:id', component: DetailsOrderComponent },
    { path: 'orders/report', component: ReportOrderComponent },
  ]},

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
