import { Component, Input } from '@angular/core';
import { OrderService } from '../../../Service/order-service';
import { TourService } from '../../../Service/tour-service';
import { VehicleService } from '../../../Service/vehicle-service';
import { Router } from '@angular/router';
import { userService } from '../../../Service/userService';
import { Tours } from '../../../Models/tours';
import { Orders } from '../../../Models/orders';
import { Vehicles } from '../../../Models/vehicles';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent {


  @Input() tour: Tours;
  totalAmout: number = 0;
  Name: string = '';
  customer_id: number;
  sdt: string = '';
  soLuong: number = 0;
  order_status: string = 'Chờ xác nhận';
  ngayKhoiHanh: Date;
  idTour: number = 0;
  idXe: number = 0;
  Gia: number = 0;
  @Input() DsTour: Tours[] = [];;
  @Input() donhang: Orders;
  DSVehicle: Vehicles[] = [];

  user_id:number;
  customer_name:string;

  constructor(
    private service: OrderService,
    private tourService:TourService,
    private vehiclesService:VehicleService,
    private router: Router,
    private userService: userService
  ) { }

  ngOnInit(): void {
    this.layDSTour();
    this.layDSVehicles();
        // Lấy thông tin người dùng và gán customer_id
    const currentUser = this.userService.getCurrentUser();  
    if (currentUser) {
      this.customer_id = currentUser.id;  
      this.customer_name = currentUser.username;
    } else {
      console.log('Không có người dùng đăng nhập'); 
    }
  }

  layDSTour(){
    this.tourService.getTours().subscribe(data => {
      this.DsTour = data;
    });
  }

  layTour() {
    if (!this.idTour) {
      console.error('ID Tour is required');
    }
    return this.tourService.getTourDetails(this.idTour);
  }

  updateGia() {
    if (this.tour && this.soLuong) {
      this.Gia = this.soLuong * this.tour.Gia;
    }
  }
  
  layDSVehicles(){
    this.vehiclesService.getVehicles().subscribe(data => {
      this.DSVehicle = data;
    });
  }

  themDonhang() {
    this.layTour().subscribe({
      next: (tour) => {
        this.tour = tour;
        this.updateGia();
        const val = {
          Name: this.Name,
          customer_id: this.customer_id,
          SDT: this.sdt,
          SoLuong: this.soLuong,
          order_status: this.order_status,
          NgayKhoiHanh: this.ngayKhoiHanh,
          IDTour: this.idTour,
          IDXe: this.idXe,
          Gia: this.Gia,
          
        };

        console.log("sha",val);
        this.service.addDsDonhang(val).subscribe(
          result => {
            console.log('Thêm thành công', result);
            alert('Thêm thành công!');
            this.router.navigate(['/admin/orders/list']);
          },
          error => {
            console.error('There was an error adding the category!', error);
          }
        );
      },
      error: (err) => {
        console.error('Error fetching tour details:', err);
      }
    });
  }
}
