import { Component } from '@angular/core';
import { userService } from '../Service/userService';
import { Router } from '@angular/router';
import { User } from '../Models/users';
import { ActivatedRoute } from '@angular/router'; 
import { CategoriesService } from '../Service/categories-service';
import { Categories } from '../Models/categories';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  user: User | null = null; 
  user_id : number;
  message = '';
  category_id : number;
  brand_id:number;
  isSidebarOpen = false;

  constructor(private userService: userService, private router: Router,
    private route: ActivatedRoute,
    private categoryService:CategoriesService
  ){};

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  ngOnInit(): void {

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
    const Id = Number(this.route.snapshot.paramMap.get('id'));
    this.category_id = Id;
  }
  productSearch: any[] = [];
  searchText: string = '';
  navigateToHome() {
    this.router.navigate(['/home/tour/list']);
  }

  timkiem() {
    if (this.searchText && this.searchText.trim() !== '') {
      // Chỉ thực hiện tìm kiếm nếu searchText không rỗng
      this.router.navigate(['/admin/tours/list'], { queryParams: { search: this.searchText } });
    } else {
      // Thông báo nếu searchText rỗng
      console.log("Vui lòng nhập từ khóa tìm kiếm.");
    }
  }
  logout() {
    console.log("dkhl",this.user);
    this.userService.logout().subscribe(
      response => {
        if (response.Success) {
          // Reset thông tin người dùng trong service
          this.userService.setCurrentUser(null); // Xóa user trong service
          // Xóa thông tin trong localStorage
          localStorage.removeItem('user');
          
          // Đặt lại đối tượng người dùng trong component
          this.user = null;
          this.user_id = null;
  
          // Điều hướng về trang đăng nhập
          this.router.navigate(['/login']);
        } else {
          this.message = response.message || 'Đăng xuất thất bại.';
        }
      },
      error => {
        console.error('Logout error', error);
        this.message = 'Đăng xuất thất bại. Vui lòng thử lại.';
      }
    );
  }
  
  updatePassword() {
    this.router.navigate(['/admin/user/updatePW/', this.user.id]); // Đảm bảo route này tồn tại trong router module
  }


}
