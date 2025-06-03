import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { userService } from '../Service/userService';
import { User } from '../Models/users';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isLogIn = false;

  
  tourSearch: any[] = [];
  searchText: string = '';
  user: User | null = null; 
  user_id: number;
  message = '';



  constructor(private router: Router, 
    public userService: userService,
      private route: ActivatedRoute,
    ){};


  ngOnInit() {
  if (!localStorage.getItem('user')) {
    this.userService.setCurrentUser(null); // Reset user trong service nếu chưa login
  }

   this.isLogIn = !!localStorage.getItem('userId');
  }

  timkiem() {
    this.router.navigate(['/home/tour/list'], { queryParams: { search: this.searchText } });
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