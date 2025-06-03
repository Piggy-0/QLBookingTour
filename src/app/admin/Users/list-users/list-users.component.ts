import { Component } from '@angular/core';
import { User } from '../../../Models/users';
import { userService } from '../../../Service/userService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css'
})
export class ListUsersComponent {


  user: User;
  username: string;
  email: string;
  phone:string;
  password: string;
  create_at: string = '';


  list_user: User[]= [];
  them: boolean = false;
  selected_user: any = null;


  constructor(private userService: userService, private router: Router) {
  }

  ngOnInit(): void {
    this.DsUser();
  }

  DsUser() {
    this.userService.getUsersRole2().subscribe(data => {
      this.list_user = data;
    });
  }

    xoaUser(user: User) {
      this.userService.deleteUser(user.id).subscribe(
        (data) => {
          this.DsUser();
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
  
  
    editUser(user: User) {
      this.selected_user = user;
      this.username = this.selected_user.username;
      this.email = this.selected_user.email;
      this.phone = this.selected_user.phone;
      this.password =this.selected_user.password;
      this.create_at = this.formatDate(this.selected_user.create_at);
    }
    
  
    suaUser() {
      console.log(this.selected_user);
      console.log(this.selected_user.id);
      if (!this.selected_user || !this.selected_user.id) {
        console.error('User chưa được chọn hoặc không hợp lệ.');
        console.log(this.selected_user);
        console.log(this.selected_user.id);
        return;
      }
  
      const val = {
        id: this.selected_user.id,
        username: this.username,
        email: this.email,
        phone: this.phone,
        password: this.selected_user.password,
        create_at: new Date(this.create_at),  // Sử dụng hàm tiện ích để định dạng ngày tháng
        role_id: 2
      };
      this.userService.updateUser(this.selected_user.id, val).subscribe(
        response => {
          this.DsUser();
          console.log('Sửa thành công:', response);
          alert('Sửa User thành công!');
        },
        error => {
          console.error('Có lỗi khi!', error);
          if (error.error) {
            console.error('Chi tiết lỗi:', error.error);
          }
        }
      );
    }
  
    dong() {
      this.them = false;
      this.DsUser();
    }

  
}
