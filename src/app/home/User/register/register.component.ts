import { Component } from '@angular/core';
import { userService } from '../../../Service/userService';
import { Router } from '@angular/router';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string;
  email:string;
  phone:string;
  password: string;
  rePassword: string;
  create_at: Date;
  role_id:number;

  constructor(private userService: userService, private router:Router) {}

  dangKy() {
    if (!this.username || !this.password || !this.rePassword) {
      alert('Vui lòng nhập đầy đủ thông tin đăng ký');
      return;
    }

    if (this.password !== this.rePassword) {
      alert('Mật khẩu không khớp');
      return;
    }

    const userData = {
      username: this.username,
      email: this.email,
      phone : this.phone,
      password: this.password,
      create_at : this.create_at,
      role_id : this.role_id
    };

    this.userService.register(userData).subscribe(
      res => {
        alert('Đăng ký thành công');
        this.router.navigate(['/login']); 
      },
      error => {
        alert('Đăng ký thất bại');
        console.error(error);
      }
    );
  }
}
