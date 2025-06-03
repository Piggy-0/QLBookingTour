import { Component, Input } from '@angular/core';
import { Orders } from '../../../Models/orders';
import { Tours } from '../../../Models/tours';
import { Vehicles } from '../../../Models/vehicles';
import { userService } from '../../../Service/userService';
import { Router } from '@angular/router';
import { VehicleService } from '../../../Service/vehicle-service';
import { TourService } from '../../../Service/tour-service';
import { OrderService } from '../../../Service/order-service';
import { User } from '../../../Models/users';

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrl: './list-order.component.css'
})
export class ListOrderComponent {
  constructor(
    private service: OrderService,
    private tourService:TourService,
    private vehiclesService:VehicleService,
    private router: Router,
    private userService: userService
  ) { }

  DSVehicle: Vehicles[] = [];
  @Input() DsTour: Tours[] = [];;
  DSDonHang: any=[];
  Name: string;
  sdt: string;
  Email: string;
  SoLuong: number;
  order_status: string;
  NgayKhoiHanh: string = '';
  IDTour: number;
  TourTen: string;
  VehiclesTen: string;
  IDXe: number;
  Gia: number= 0;
  them: boolean = false;
  donhang: Orders;
  selected: any = null;
  tour:Tours;
  vehicles:Vehicles;
  user:User


  orderStatuses: { [key: string]: string[] } = {
    'Chờ xác nhận': ['Đã xác nhận', 'Đã hủy'],
    'Đã xác nhận': ['Đang chuẩn bị', 'Đã hủy'],
    'Đang chuẩn bị': ['Đang khởi hành', 'Đã hủy'],
    'Đang khởi hành': ['Đã hoàn thành', 'Không tham gia'],
    'Đã hoàn thành': [],
    'Không tham gia': ['Hoàn tiền'],
    'Hoàn tiền': [],
    'Đã hủy': []
  };

  ngOnInit(): void {
    this.tailaiDSDonhang();
    this.layDSTour();
    this.layDSVehicles();
  }

  tailaiDSDonhang() {
    this.service.getDsDonHang().subscribe(data => {
      this.DSDonHang = data;
      this.DSDonHang.forEach(donhang => {
        this.tourService.getTourDetails(donhang.IDTour).subscribe(tour => {
          donhang.TourTen = tour.Ten;
        });
        this.vehiclesService.getVehiclesDetails(donhang.IDXe).subscribe(vehicle => {
          donhang.VehiclesTen = vehicle.Name;
        });
        this.userService.getUserById(donhang.customer_id).subscribe(user => {
          donhang.Email = user.email;
        });
      });
    });
  }

  xoaDsDonhang(donhang: Orders) {
    this.service.deleteDsDonhang(donhang.ID).subscribe(
      (data) => {
        console.log(data);
        this.tailaiDSDonhang();
      }
    );
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  editDonHang(donhang: Orders) {
    this.selected = donhang;
    this.Name = this.selected.Name;
    this.sdt = this.selected.sdt;
    this.SoLuong = this.selected.SoLuong;
    this.order_status = this.order_status;
    this.NgayKhoiHanh = this.formatDate(this.selected.NgayKhoiHanh);
    this.IDTour = this.selected.IDTour;
    this.IDXe = this.selected.IDXe;
    this.Gia = this.selected.Gia;
    this.userService.getUserById(this.selected.customer_id).subscribe(user => {
    this.Email = user.email;
    });
  }

  layDSVehicles(){
    this.vehiclesService.getVehicles().subscribe(data => {
      this.DSVehicle = data;
    });
  }

  layDSTour(){
    this.tourService.getTours().subscribe(data => {
      this.DsTour = data;
    });
  }
  updateGia() {
    if (this.tour && this.SoLuong) {
      this.Gia = this.SoLuong * this.tour.Gia;
    }
  }

  loadTourAndUpdateGia() {
    if (this.IDTour) {
      this.tourService.getTourDetails(this.IDTour).subscribe(tour => {
        this.tour = tour;
        this.updateGia();
      });
    }
  }

  suaDonHang() {
    if (!this.selected || !this.selected.ID) {
      console.error('Đơn hàng chưa được chọn hoặc không hợp lệ.');
      return;
    }
    this.updateGia();
    const val = {
      ID: this.selected.ID,
      customer_id: this.selected.customer_id,
      Name: this.Name,
      Sdt: this.sdt,
      SoLuong: this.SoLuong,
      order_status: this.selected.order_status,
      NgayKhoiHanh: new Date(this.NgayKhoiHanh),
      IDTour: this.IDTour,
      IDXe: this.IDXe,
      Gia: this.Gia
    };
    console.log("sdhka", val);
    this.service.updateDsDonhang(this.selected.ID, val).subscribe(
      response => {
        console.log("sdhka", val);
        this.tailaiDSDonhang();
        alert('Sửa đơn hàng thành công!');
      },
      error => {
        console.error('Có lỗi khi sửa đơn hàng!', error);
        if (error.error) {
          console.error('Chi tiết lỗi:', error.error);
        }
      }
    );
  }

  updateOrderStatus(orderId: number, newStatus: string): void {  
    // Gọi API để cập nhật trạng thái của đơn hàng trong cơ sở dữ liệu
    this.service.updateOrderStatus(orderId, newStatus).subscribe(
      () => {
        console.log('Cập nhật trạng thái đơn hàng thành công');
        this.tailaiDSDonhang();
        // Bạn có thể thực hiện hành động khác sau khi cập nhật thành công
      },
      (error) => {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng', error);
        // Bạn có thể hiển thị thông báo lỗi nếu có
      }
    );
  }

}
