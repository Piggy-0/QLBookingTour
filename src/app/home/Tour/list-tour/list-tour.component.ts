import { Component , OnInit, Input} from '@angular/core';
import { Tours } from '../../../Models/tours';
import { TourService } from '../../../Service/tour-service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Categories } from '../../../Models/categories';
import { CategoriesService } from '../../../Service/categories-service';
import { userService } from '../../../Service/userService';
import { Vehicles } from '../../../Models/vehicles';
import { OrderService } from '../../../Service/order-service';
import { VehicleService } from '../../../Service/vehicle-service';

@Component({
  selector: 'app-list-tour',
  templateUrl: './list-tour.component.html',
  styleUrl: './list-tour.component.css'
})
export class ListTourComponent {

  constructor(private tourService: TourService, private router:Router,  public userService:userService,
    private route: ActivatedRoute, private categoriesService: CategoriesService,
     private vehiclesService:VehicleService,
  private donhangService:OrderService) {}


  name: string = '';
  sdt: string = '';
  soLuong: number = 0;
  ngayKhoiHanh: Date;
  idTour: number = 0;
  idXe: number = 0;
  Gia: number = 0;
  DSVehicle: Vehicles[] = [];
  user_id: number;
  customer_name:string;

  DSTour: Tours[];
  tour:Tours;
  tourSearch: any[] = [];
  dangThemSua:boolean= false;
  tieude:any;
  searchText: string = '';
  tours:Tours[] = [];
  @Input() categoryId:any;
  @Input() ListCategories: Categories[] = [];
  category_id: any;

  ngOnInit(): void {
    this.layDSTour();
    this.route.queryParams.subscribe(params => {
      this.searchText = params['search'] || '';
      this.timkiem(); // Gọi hàm timkiem để tìm kiếm và lọc danh sách tour
    });
    this.DsDanhMucSp();
    this.layDSVehicles();

}

  DsDanhMucSp() {
    this.categoriesService.getDsdanhmuc().subscribe(data => {
      this.ListCategories = data;
    });
  }

    //lấy danh sách xe
  layDSVehicles(){
    this.vehiclesService.getVehicles().subscribe(data => {
      this.DSVehicle = data;
    });
  }

  updateGia() {
    if (this.tour && this.soLuong) {
      this.Gia = this.soLuong * this.tour.Gia;
    }
  }

  layDSTour(){
  this.tourService.getTours().subscribe(data => {
    this.DSTour = data;
    this.DSTour.forEach(tour => {
      tour.PathAnh = this.tourService.PhotosUrl + "/" + tour.Anh;
    });
  });
  }


  timkiem() {
    this.tourService.timkiem(this.searchText)
      .subscribe({
        next: (tourSearch) => {
          this.tourSearch = tourSearch;
          this.tourSearch.forEach(tour => {
            tour.PathAnh = this.tourService.PhotosUrl + "/" + tour.Anh;
          });
        },
        error: (err) => {
          console.error('Đã xảy ra lỗi khi tìm kiếm tour:', err);
        }
      });
  }

  dong(){
    this.dangThemSua=false;
    this.layDSTour();
  }


  chonTour(tour: Tours) {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) {
      alert('Vui lòng đăng nhập để đặt tour.');
      this.router.navigate(['/login']);
      return;
    }
    this.tour = tour;
    this.idTour = tour.Id;
    this.updateGia(); // cập nhật giá trước khi hiển thị modal
  }
  
  themTour() {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) {
      alert('Vui lòng đăng nhập để đặt tour.');
      this.router.navigate(['/login']);
      return;
    }
  
    this.user_id = currentUser.id;
    this.updateGia();
  
    const val = {
      customer_id: this.user_id,
      order_status: 'Chờ xác nhận',
      SoLuong: this.soLuong,
      NgayKhoiHanh: this.ngayKhoiHanh,
      IDTour: this.idTour,
      IDXe: this.idXe,
      Gia: this.Gia,
      Name: this.name,
      sdt: this.sdt,
    };
  
    this.donhangService.addDsDonhang(val).subscribe({
      next: () => {
        alert('Đặt tour thành công!');
        this.dong(); // làm mới modal
      },
      error: (error) => {
        console.error('Lỗi!', error);
      }
    });
  }
  
}
